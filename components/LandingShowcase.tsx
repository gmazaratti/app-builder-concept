// A framed, static product mock for the landing page — a miniature of the
// /compose screen (sidebar + chat + live phone preview) in a bordered card.
import Logo from "./Logo";
import PhoneFrame from "./PhoneFrame";
import AppPreview from "./AppPreview";

function Bar({ w, dim = false }: { w: string; dim?: boolean }) {
  return (
    <div
      className={`h-2 rounded-full ${dim ? "bg-surface-2" : "bg-border"}`}
      style={{ width: w }}
    />
  );
}

export default function LandingShowcase() {
  return (
    <div className="card mx-auto w-full max-w-5xl overflow-hidden rounded-2xl shadow-card">
      {/* window top bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <span className="hidden text-xs text-muted sm:inline">
            Home / Projects / Stride / Compose
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="rounded-md bg-surface-2 px-2 py-1 font-medium text-foreground">Preview</span>
          <span className="px-2 py-1 text-muted">Files</span>
        </div>
      </div>

      {/* body */}
      <div className="grid grid-cols-[140px_1fr] bg-surface md:grid-cols-[160px_1.1fr_300px]">
        {/* mini sidebar */}
        <div className="hidden flex-col gap-4 border-r border-border p-4 md:flex">
          <Logo size={18} />
          <div className="mt-2 space-y-2.5">
            <Bar w="70%" />
            <Bar w="55%" dim />
            <Bar w="62%" dim />
            <Bar w="48%" dim />
          </div>
          <div className="mt-auto space-y-2.5">
            <Bar w="50%" dim />
            <Bar w="40%" dim />
          </div>
        </div>

        {/* chat column */}
        <div className="flex flex-col gap-3 p-5">
          <div className="text-sm font-medium text-foreground">
            Tell me what you&apos;d like to build.
          </div>
          {/* user bubble */}
          <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-foreground px-3.5 py-2 text-xs text-background">
            A run tracker with weekly stats and a clean home screen.
          </div>
          {/* assistant bubble */}
          <div className="max-w-[88%] space-y-1.5 rounded-2xl rounded-tl-sm bg-surface-2 px-3.5 py-3">
            <Bar w="92%" />
            <Bar w="76%" dim />
            <Bar w="84%" dim />
          </div>
          <div className="mt-auto flex items-center gap-2 rounded-xl border border-border px-3 py-2">
            <span className="text-xs text-muted-2">Type a message…</span>
            <span className="ml-auto h-6 w-6 rounded-full bg-foreground" />
          </div>
        </div>

        {/* phone preview */}
        <div className="hidden items-center justify-center overflow-hidden border-l border-border bg-surface-2 p-5 md:flex">
          <PhoneFrame scale={0.62}>
            <AppPreview />
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}
