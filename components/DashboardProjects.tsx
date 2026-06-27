"use client";

// Dashboard main content that depends on the client project store:
// the working "New Project" card plus the real "Your Projects" list
// (or the empty-state when there are none).
import { useRouter } from "next/navigation";
import { useProjects, createProject } from "@/lib/projectStore";
import { Plus, Folder } from "./icons";

export default function DashboardProjects() {
  const router = useRouter();
  const projects = useProjects();

  const create = () => {
    const p = createProject();
    router.push(`/compose?project=${p.id}`);
  };

  return (
    <>
      {/* New Project card */}
      <button
        type="button"
        onClick={create}
        className="card group mt-7 flex w-full max-w-md items-center gap-3.5 rounded-xl p-3.5 text-left transition-shadow hover:shadow-card"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-foreground text-background transition-transform group-hover:scale-105">
          <Plus width={20} height={20} />
        </span>
        <span>
          <span className="block text-sm font-semibold text-foreground">New Project</span>
          <span className="block text-xs text-muted">Start building your app</span>
        </span>
      </button>

      {/* Your Projects */}
      <h2 className="mt-12 text-lg font-semibold text-foreground">Your Projects</h2>

      {projects.length === 0 ? (
        <div className="card mt-4 flex flex-col items-center justify-center rounded-xl px-6 py-16 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-foreground text-background">
            <Folder width={20} height={20} />
          </span>
          <h3 className="mt-4 text-base font-semibold text-foreground">No projects yet</h3>
          <p className="mt-1 max-w-xs text-sm text-muted">
            Create your first project and let the agent build a polished mobile app for you.
          </p>
          <button type="button" onClick={create} className="btn-primary mt-5">
            <Plus width={15} height={15} />
            Create your first project
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => router.push(`/compose?project=${p.id}`)}
              className="card flex items-center gap-3 rounded-xl p-4 text-left transition-shadow hover:shadow-card"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-foreground">
                <Folder width={18} height={18} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {p.name}
                </span>
                <span className="block text-xs text-muted">
                  {p.app ? `${p.app.files.length} files` : "Empty draft"}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
