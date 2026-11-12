import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date,
  format: "short" | "long" = "short",
) {
  const d = new Date(date);
  if (format === "short") {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Get status color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    verified: "bg-blue-100 text-blue-800",
    invited: "bg-purple-100 text-purple-800",
    active: "bg-emerald-100 text-emerald-800",
    inactive: "bg-gray-100 text-gray-800",
  };

  return colors[status.toLowerCase()] || colors.pending;
}

// Clean submission data object
export function cleanObject<T extends Record<string, any>>(obj: T): T {
  const cleaned = { ...obj };
  Object.keys(cleaned).forEach(key => {
    const value = cleaned[key];
    if (value === undefined || value === null) {
      delete cleaned[key];
    }
  });
  return cleaned;
}

// Coerce a value to a finite number, falling back when it is not numeric
export function toFiniteNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// Format a stat value for display — never renders "NaN"
export function formatStat(value: unknown): string {
  return toFiniteNumber(value).toLocaleString();
}

// Compute a month-over-month percentage change from monthly series
export function monthOverMonthChange(
  months?: Array<{ total?: number; count?: number }>,
): number | null {
  if (!months || months.length < 2) return null;
  const last = months[months.length - 1];
  const prev = months[months.length - 2];
  const curr = toFiniteNumber(last?.total ?? last?.count);
  const before = toFiniteNumber(prev?.total ?? prev?.count);
  if (before === 0) return curr > 0 ? 100 : null;
  return ((curr - before) / before) * 100;
}

// Resolve a backend document path/URL into a proxied app URL that
// carries auth via cookies. Returns null when the source is unusable.
export function getDocumentUrl(
  src: string | null | undefined,
  download = false,
): string | null {
  if (!src || typeof src !== "string") return null;
  let path = src.trim();
  const backend = process.env.NEXT_PUBLIC_API_URL;
  if (backend && path.startsWith(backend)) {
    path = path.slice(backend.length);
  }
  if (!path.startsWith("/")) return null;
  return `/api/documents?src=${encodeURIComponent(path)}${download ? "&download=1" : ""}`;
}

// True when the value can be turned into a real date
export function isValidDate(value: unknown): value is string | Date | number {
  if (value === null || value === undefined || value === "") return false;
  const d = new Date(value as string | Date | number);
  return !Number.isNaN(d.getTime());
}

// Format a date safely — returns fallback (default "—") for missing/invalid
// dates instead of "Invalid Date" or NaN.
export function formatDateSafe(
  value: unknown,
  options?: Intl.DateTimeFormatOptions,
  fallback = "—",
): string {
  if (!isValidDate(value)) return fallback;
  return new Date(value as string | Date).toLocaleDateString(
    "en-US",
    options || { year: "numeric", month: "long", day: "numeric" },
  );
}

// Safely get the year from a date value; null when invalid/missing
export function getYearSafe(value: unknown): number | null {
  if (!isValidDate(value)) return null;
  return new Date(value as string | Date).getFullYear();
}

// Join address parts, dropping empty/undefined pieces — never "undefined, undefined"
export function joinAddress(
  parts: Array<string | null | undefined>,
  fallback = "—",
): string {
  const cleaned = parts.filter(
    (p): p is string => typeof p === "string" && p.trim() !== "",
  );
  return cleaned.length > 0 ? cleaned.join(", ") : fallback;
}