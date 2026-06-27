// Minimal inline icon set (stroke = currentColor so everything themes).
// Kept local to avoid an icon-library dependency.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (p: IconProps) => ({
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

export const Plus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ChevronDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const Cloud = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97 6 6 0 0 0-11.64-1.2A4 4 0 0 0 6.5 19h11Z" />
  </svg>
);

export const Folder = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 7a2 2 0 0 1 2-2h3.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  </svg>
);

export const FolderOpen = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v1H4V7Z" />
    <path d="M3.2 10h17.6l-1.6 7a1.5 1.5 0 0 1-1.5 1.2H6.3A1.5 1.5 0 0 1 4.8 17L3.2 10Z" />
  </svg>
);

export const FileCode = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5M10 12l-2 2 2 2M14 12l2 2-2 2" />
  </svg>
);

export const Sparkle = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
  </svg>
);

export const Compass = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" />
  </svg>
);

export const Book = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z" />
    <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
  </svg>
);

export const Help = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 0 1 4.8.9c0 1.7-2.3 2.1-2.3 3.6" />
    <path d="M12 17.5h.01" />
  </svg>
);

export const Rocket = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.9-.9.9-2.3 0-3.2a2.3 2.3 0 0 0-3 0Z" />
    <path d="M9 13l-2-2c1-5 5-8 12-8 0 7-3 11-8 12l-2-2" />
    <path d="M9 13a14 14 0 0 1 2 2" />
    <circle cx="14.5" cy="9.5" r="1.2" />
  </svg>
);

export const Newspaper = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5Z" />
    <path d="M17 8h2a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2M7 8h6M7 12h6M7 16h4" />
  </svg>
);

export const Gift = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 11h16v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8Z" />
    <path d="M3 7h18v4H3zM12 7v13" />
    <path d="M12 7S10.5 3.5 8.5 4.2 9 7 12 7Zm0 0s1.5-3.5 3.5-2.8S15 7 12 7Z" />
  </svg>
);

export const Megaphone = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 10v4a1 1 0 0 0 1 1h2l8 4V5L7 9H5a1 1 0 0 0-1 1Z" />
    <path d="M18 9a3 3 0 0 1 0 6" />
  </svg>
);

export const GraduationCap = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4 2 9l10 5 10-5-10-5Z" />
    <path d="M6 11v4c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-4" />
  </svg>
);

export const PanelLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16" />
  </svg>
);

export const Phone = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="7" y="2" width="10" height="20" rx="2.5" />
    <path d="M11 18h2" />
  </svg>
);

export const Refresh = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 11a8 8 0 1 0-1.5 5" />
    <path d="M20 5v6h-6" />
  </svg>
);

export const Image = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.5" />
    <path d="M21 16l-5-5L4 21" />
  </svg>
);

export const Signal = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 16v3M10 12v7M15 8v11M20 4v15" />
  </svg>
);

export const ArrowLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);

export const Pencil = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20h4L19 9a2 2 0 0 0-3-3L5 17v3Z" />
    <path d="M14.5 7.5L17 10" />
  </svg>
);

export const Trash = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M10 11v6M14 11v6" />
  </svg>
);

export const MoreVertical = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="5" r="1.4" />
    <circle cx="12" cy="12" r="1.4" />
    <circle cx="12" cy="19" r="1.4" />
  </svg>
);

export const Layers = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3l9 5-9 5-9-5 9-5Z" />
    <path d="M3 13l9 5 9-5M3 17l9 5 9-5" />
  </svg>
);

export const Blocks = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
    <path d="M13 6.5h5a1 1 0 0 1 1 1v3M11 13.5H6a1 1 0 0 0-1 1v3" />
  </svg>
);

export const Plug = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 3v5M15 3v5" />
    <path d="M7 8h10v3a5 5 0 0 1-10 0V8Z" />
    <path d="M12 16v5" />
  </svg>
);

export const Devices = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="13" height="10" rx="1.5" />
    <path d="M3 18h10" />
    <rect x="17" y="9" width="4" height="11" rx="1.2" />
  </svg>
);

export const Check = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12.5l4.5 4.5L19 6.5" />
  </svg>
);

export const CreditCard = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3 10h18M7 15h4" />
  </svg>
);

export const Settings = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.5l1.6 2.3 2.7-.6.3 2.8 2.5 1.2-1.2 2.5 1.2 2.5-2.5 1.2-.3 2.8-2.7-.6L12 21.5l-1.6-2.3-2.7.6-.3-2.8-2.5-1.2 1.2-2.5L4.9 11l2.5-1.2.3-2.8 2.7.6L12 2.5Z" />
  </svg>
);

export const LogOut = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const Code = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
  </svg>
);

export const Eye = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const X = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const MessageSquare = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 11.5a7.5 7.5 0 0 1-10.9 6.7L4 20l1.8-5.1A7.5 7.5 0 1 1 21 11.5Z" />
  </svg>
);

export const PanelRight = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M15 4v16" />
  </svg>
);
