import AppNavbar from '@/components/AppNavbar';

export default function AppLayout({ children }) {
  return (
    <div>
      <AppNavbar />
      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}