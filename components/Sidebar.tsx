"use client";

// Reusable left sidebar — shared by the dashboard and compose surfaces.
// Reads the client project store, so the Projects list, "+ Create", the
// right-click (or kebab) context menu, inline rename, and delete-with-warning
// all work without a backend.
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import ConfirmDialog from "./ConfirmDialog";
import TutorialModal from "./TutorialModal";
import FeedbackModal from "./FeedbackModal";
import { currentUser } from "@/lib/user";
import {
  useProjects,
  createProject,
  renameProject,
  deleteProject,
} from "@/lib/projectStore";
import {
  Cloud,
  Plus,
  Folder,
  GraduationCap,
  Megaphone,
  ChevronDown,
  ArrowLeft,
  Pencil,
  Trash,
  MoreVertical,
  CreditCard,
  Settings,
  LogOut,
} from "./icons";

type Menu = { x: number; y: number; id: string } | null;

function StaticNavItem({
  icon: Icon,
  label,
  href = "#",
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
    >
      <Icon width={16} height={16} />
      {label}
    </Link>
  );
}

function UtilButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
    >
      <Icon width={16} height={16} />
      {label}
    </button>
  );
}

export default function Sidebar({ activeProjectId }: { activeProjectId?: string }) {
  const router = useRouter();
  const projects = useProjects();
  const [menu, setMenu] = useState<Menu>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close the profile menu on outside click / Escape.
  useEffect(() => {
    if (!profileOpen) return;
    const onDown = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setProfileOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  // Close the context menu on any outside interaction.
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const openProject = (id: string) => router.push(`/compose?project=${id}`);

  const handleCreate = () => {
    const p = createProject();
    router.push(`/compose?project=${p.id}`);
  };

  const openMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const menuW = 180;
    const x = Math.min(e.clientX, window.innerWidth - menuW - 8);
    const y = Math.min(e.clientY, window.innerHeight - 140);
    setMenu({ x, y, id });
  };

  const commitRename = (id: string, name: string) => {
    renameProject(id, name);
    setRenamingId(null);
  };

  const confirmDelete = () => {
    if (confirmId) {
      const wasActive = confirmId === activeProjectId;
      deleteProject(confirmId);
      if (wasActive) router.push("/dashboard");
    }
    setConfirmId(null);
  };

  const confirmProject = projects.find((p) => p.id === confirmId);

  return (
    <aside
      className="sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-surface px-3 py-4"
      style={{ width: "var(--sidebar-width)" }}
    >
      {/* Back-to-homepage + brand + plan */}
      <div className="flex items-center gap-1.5 px-1.5 py-1">
        <Link
          href="/"
          title="Back to homepage"
          aria-label="Back to homepage"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <ArrowLeft width={16} height={16} />
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size={20} />
        </Link>
        <span className="ml-auto rounded-pill bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted">
          {currentUser.plan}
        </span>
      </div>

      {/* Primary nav */}
      <div className="mt-4 flex flex-col gap-0.5">
        <StaticNavItem icon={Cloud} label="Clouds" />
      </div>

      {/* Projects group */}
      <div className="mt-5 flex min-h-0 flex-1 flex-col">
        <div className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-2">
          Projects
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <Plus width={16} height={16} />
          Create
        </button>

        {/* Project list */}
        <div className="scroll-thin mt-0.5 flex flex-col gap-0.5 overflow-y-auto">
          {projects.map((p) => {
            const active = p.id === activeProjectId;
            if (renamingId === p.id) {
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-2.5 rounded-md bg-surface-2 px-2.5 py-1.5"
                >
                  <Folder width={16} height={16} className="shrink-0 text-muted" />
                  <input
                    autoFocus
                    defaultValue={p.name}
                    onFocus={(e) => e.currentTarget.select()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitRename(p.id, e.currentTarget.value);
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    onBlur={(e) => commitRename(p.id, e.currentTarget.value)}
                    className="w-full min-w-0 bg-transparent text-sm text-foreground focus:outline-none"
                  />
                </div>
              );
            }
            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => openProject(p.id)}
                onContextMenu={(e) => openMenu(e, p.id)}
                onKeyDown={(e) => e.key === "Enter" && openProject(p.id)}
                className={`group flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-surface-2 font-medium text-foreground"
                    : "text-muted hover:bg-surface-2 hover:text-foreground"
                }`}
              >
                <Folder width={16} height={16} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">{p.name}</span>
                <button
                  type="button"
                  aria-label="Project options"
                  onClick={(e) => openMenu(e, p.id)}
                  className="-mr-1 flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-2 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                >
                  <MoreVertical width={15} height={15} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom utility links */}
      <div className="mt-3 flex flex-col gap-0.5">
        <UtilButton icon={GraduationCap} label="Tutorial" onClick={() => setTutorialOpen(true)} />
        <UtilButton icon={Megaphone} label="Feedback" onClick={() => setFeedbackOpen(true)} />
      </div>

      {/* User row + profile menu */}
      <div ref={profileRef} className="relative mt-3">
        {profileOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-1.5 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-pop">
            <Link
              href="/billing"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-surface-2"
            >
              <CreditCard width={15} height={15} className="text-muted" />
              Billing
            </Link>
            <button
              type="button"
              onClick={() => setProfileOpen(false)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-surface-2"
            >
              <Settings width={15} height={15} className="text-muted" />
              Settings
            </button>
            <div className="my-1 border-t border-border" />
            <Link
              href="/"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-surface-2"
            >
              <LogOut width={15} height={15} className="text-muted" />
              Log out
            </Link>
          </div>
        )}
        <button
          type="button"
          onClick={() => setProfileOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 rounded-md border border-border px-2.5 py-2 text-left transition-colors hover:bg-surface-2"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold leading-none text-background">
            {currentUser.fullName.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-foreground">
              {currentUser.fullName}
            </div>
            <div className="truncate text-[11px] text-muted-2">{currentUser.email}</div>
          </div>
          <ChevronDown
            width={14}
            height={14}
            className={`shrink-0 text-muted-2 transition-transform ${profileOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Context menu */}
      {menu && (
        <div
          className="fixed z-[90] w-44 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-pop"
          style={{ left: menu.x, top: menu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              openProject(menu.id);
              setMenu(null);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-surface-2"
          >
            <Folder width={15} height={15} className="text-muted" />
            Open
          </button>
          <button
            type="button"
            onClick={() => {
              setRenamingId(menu.id);
              setMenu(null);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-surface-2"
          >
            <Pencil width={15} height={15} className="text-muted" />
            Rename
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmId(menu.id);
              setMenu(null);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm text-danger transition-colors hover:bg-danger-surface"
          >
            <Trash width={15} height={15} />
            Delete
          </button>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!confirmProject}
        title="Delete project?"
        message={
          confirmProject
            ? `"${confirmProject.name}" and its generated files will be permanently removed. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />

      {/* Tutorial + feedback modals */}
      <TutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </aside>
  );
}
