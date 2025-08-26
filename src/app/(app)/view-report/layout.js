import ReportSidebar from '@/components/ReportSidebar';

export default function ReportLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-64 flex-shrink-0">
        <ReportSidebar />
      </aside>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
