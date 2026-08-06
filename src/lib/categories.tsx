import type { ReactNode } from "react";

export type CategoryId =
  | "google"
  | "facebook"
  | "tiktok"
  | "x"
  | "instagram"
  | "outlook"
  | "other";

export type Category = {
  id: CategoryId;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
};

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
    />
    <path
      fill="#FF3D00"
      d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C36.9 40.2 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"
    />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#1877F2"
      d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"
    />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#25F4EE"
      d="M9.9 9.2v3.1a3.6 3.6 0 1 0 2.6 3.5V0h2.9c.1 1 .4 1.9.9 2.7l-2.1 1.2v11.9A6.5 6.5 0 1 1 9.9 9.2z"
    />
    <path
      fill="#FE2C55"
      d="M11.4 8.6v3.1a3.6 3.6 0 1 0 2.6 3.5V1.5h2.9c.4 2.4 2.3 4.3 4.7 4.6v3a7.7 7.7 0 0 1-4.6-1.5v7.8a6.5 6.5 0 1 1-5.6-6.8z"
    />
    <path
      fill="#fff"
      d="M11.4 8.6v3.1a3.6 3.6 0 1 0 2.6 3.5V1.5h1.4c.4 2.4 2.3 4.3 4.7 4.6v3a7.7 7.7 0 0 1-4.6-1.5v7.8a6.5 6.5 0 1 1-5.6-6.8z"
      opacity="0.001"
    />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.81-5.96 6.81H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64z"
    />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#FDF497" />
        <stop offset="25%" stopColor="#FD5949" />
        <stop offset="60%" stopColor="#D6249F" />
        <stop offset="100%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="1" y="1" width="22" height="22" rx="6" fill="url(#ig-grad)" />
    <circle cx="12" cy="12" r="5" fill="none" stroke="#fff" strokeWidth="2" />
    <circle cx="17.8" cy="6.2" r="1.4" fill="#fff" />
  </svg>
);

const OutlookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path fill="#0F6CBD" d="M23 6.5v11c0 .8-.7 1.5-1.5 1.5H10V5h11.5c.8 0 1.5.7 1.5 1.5z" />
    <path fill="#1A9BF0" d="M23 8.2 16.5 12 10 8.2V5h11.5c.8 0 1.5.7 1.5 1.5v1.7z" />
    <rect x="1" y="3.5" width="12" height="17" rx="2.2" fill="#0A4A8C" />
    <ellipse cx="7" cy="12" rx="3.1" ry="3.7" fill="none" stroke="#fff" strokeWidth="1.8" />
  </svg>
);

const OtherIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="8" cy="12" r="1.4" fill="currentColor" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    <circle cx="16" cy="12" r="1.4" fill="currentColor" />
  </svg>
);

export const CATEGORIES: Category[] = [
  { id: "google", label: "Google", icon: GoogleIcon },
  { id: "facebook", label: "Facebook", icon: FacebookIcon },
  { id: "tiktok", label: "TikTok", icon: TikTokIcon },
  { id: "x", label: "X (Twitter)", icon: XIcon },
  { id: "instagram", label: "Instagram", icon: InstagramIcon },
  { id: "outlook", label: "Outlook", icon: OutlookIcon },
  { id: "other", label: "Other", icon: OtherIcon },
];

export function getCategory(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1]!;
}
