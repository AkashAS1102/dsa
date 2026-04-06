import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-[72px] flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
