import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date in standard DD MMM YYYY format (e.g. 31 Oct 2026)
 * Uses deterministic UTC parsing to prevent hydration mismatch across timezones.
 */
export function formatDisplayDate(dateInput?: string | Date | number | null): string {
  if (!dateInput) return 'Date not available';
  try {
    if (typeof dateInput === 'string') {
      const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const [, year, monthNum, dayNum] = match;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = months[parseInt(monthNum, 10) - 1] || monthNum;
        return `${parseInt(dayNum, 10)} ${m} ${year}`;
      }
    }
    const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) {
      return String(dateInput);
    }
    const day = d.getUTCDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Format time deterministically (e.g. 07:03 AM) for activity feeds
 */
export function formatDisplayTime(dateInput?: string | Date | number | null): string {
  if (!dateInput) return '';
  try {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '';
    const hours = d.getUTCHours();
    const mins = d.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${mins} ${ampm}`;
  } catch {
    return '';
  }
}

