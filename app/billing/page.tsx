import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import BillingPlans from "@/components/BillingPlans";

export default function BillingPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Breadcrumb top bar — Home / Billing */}
        <header className="flex h-12 items-center gap-2 border-b border-border px-5 text-sm">
          <Link href="/dashboard" className="text-muted transition-colors hover:text-foreground">
            Home
          </Link>
          <span className="text-muted-2">/</span>
          <span className="font-medium text-foreground">Billing</span>
        </header>

        <main className="mx-auto w-full max-w-6xl px-8 py-10">
          <BillingPlans />
        </main>
      </div>
    </div>
  );
}
