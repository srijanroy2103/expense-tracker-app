// This layout's only job is to create the flex container.
// It is now a simple Server Component with no client-side logic.
export default function ReportLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {children}
    </div>
  );
}