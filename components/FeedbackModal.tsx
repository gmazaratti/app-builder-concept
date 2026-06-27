"use client";

import { useState } from "react";
import Modal from "./Modal";
import { currentUser } from "@/lib/user";
import { Check } from "./icons";

const TYPES = ["Idea", "Bug", "Other"] as const;
type FeedbackType = (typeof TYPES)[number];

// Feedback form in a modal. No backend — submitting shows a success state.
export default function FeedbackModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [type, setType] = useState<FeedbackType>("Idea");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  // Close, then reset after the modal has animated away.
  const close = () => {
    onClose();
    setTimeout(() => {
      setSent(false);
      setMessage("");
      setType("Idea");
    }, 200);
  };

  return (
    <Modal open={open} onClose={close} title="Send feedback">
      {sent ? (
        <div className="flex flex-col items-center py-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
            <Check width={22} height={22} />
          </span>
          <h3 className="mt-4 text-base font-semibold text-foreground">Thanks — we got it!</h3>
          <p className="mt-1 max-w-xs text-sm text-muted">
            Your feedback helps shape what we build next.
          </p>
          <button type="button" onClick={close} className="btn-primary mt-5">
            Done
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (message.trim()) setSent(true);
          }}
        >
          <label className="mb-1.5 block text-xs font-medium text-muted">
            What kind of feedback?
          </label>
          <div className="flex gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-pill border px-3 py-1.5 text-sm font-medium transition-colors ${
                  type === t
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted hover:bg-surface-2 hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <label className="mb-1.5 mt-4 block text-xs font-medium text-muted">
            Your message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            autoFocus
            placeholder="Tell us what's working, what's not, or what you'd love to see…"
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-2 focus:border-muted-2 focus:outline-none"
          />

          <p className="mt-2 text-xs text-muted-2">Sending as {currentUser.email}</p>

          <button
            type="submit"
            disabled={!message.trim()}
            className="btn-primary mt-4 w-full justify-center disabled:opacity-40"
          >
            Send feedback
          </button>
        </form>
      )}
    </Modal>
  );
}
