import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        await dbConnect();
        try {
          const user = await User.findOne({ email: credentials.email }).select('+password');
          if (!user) {
            throw new Error('No user found with this email.');
          }
          if (!user.emailVerified) {
            throw new Error('Please verify your email before logging in.');
          }
          if (!user.password) {
            throw new Error('Please log in using the method you originally signed up with.');
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordCorrect) {
            throw new Error('Incorrect password.');
          }
          return user;
        } catch (err) {
          throw new Error(err.message || 'An error occurred during login.');
        }
      },
    }),
  ],

  // --- CORRECTED CALLBACKS SECTION ---
  callbacks: {
    // The JWT callback is the single source of truth for the session token.
    async jwt({ token, user, account }) {
      // The `user` and `account` objects are only passed on the initial sign-in.
      if (account && user) {
        await dbConnect();
        try {
          // Find the user in our database.
          let dbUser = await User.findOne({ email: user.email });

          // If the user doesn't exist (e.g., first-time Google login), create them.
          if (!dbUser) {
            dbUser = await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              emailVerified: true, // Google accounts are verified by default
            });
          }
          
          // Add the user's unique database ID to the token.
          token.id = dbUser._id.toString();

        } catch (error) {
          console.error("Error in JWT callback:", error);
          return token; // Return original token on error
        }
      }
      return token;
    },

    // The session callback uses the data from the token to populate the session object.
    async session({ session, token }) {
      // The token will always have the ID we added in the jwt callback.
      if (token && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  // --- END OF CALLBACKS SECTION ---

  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };