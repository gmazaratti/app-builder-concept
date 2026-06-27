import Sidebar from "@/components/Sidebar";
import DashboardProjects from "@/components/DashboardProjects";
import { currentUser, greeting } from "@/lib/user";
import { PanelLeft } from "@/components/icons";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-12 items-center gap-2 border-b border-border px-5 text-sm text-muted">
          <PanelLeft width={16} height={16} />
          <span className="text-foreground">Home</span>
        </header>

        {/* Main */}
        <main className="mx-auto w-full max-w-4xl px-8 py-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {greeting()}, {currentUser.name}
          </h1>
          <p className="mt-1.5 text-sm text-muted">Ready to bring your app idea to life?</p>

          <DashboardProjects />
        </main>
      </div>
    </div>
  );
}
