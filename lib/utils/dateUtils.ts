/**
 * Date utility functions for handling both Date objects and date strings
 */

/**
 * Safely converts a date (string or Date) to a Date object
 * @param date - Date string or Date object
 * @returns Date object or null if invalid
 */
export function safeParseDate(date: Date | string | null | undefined): Date | null {
  if (!date) return null;
  
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date;
  }
  
  if (typeof date === 'string') {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  return null;
}

/**
 * Formats a date for display with relative time
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatRelativeDate(date: Date | string | null | undefined): string {
  const dateObj = safeParseDate(date);
  
  if (!dateObj) {
    return "Invalid date";
  }
  
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return dateObj.toLocaleDateString();
}

/**
 * Formats a date for display with absolute time
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatAbsoluteDate(date: Date | string | null | undefined): string {
  const dateObj = safeParseDate(date);
  
  if (!dateObj) {
    return "Invalid date";
  }
  
  return dateObj.toLocaleDateString();
}

/**
 * Checks if a date is valid
 * @param date - Date string or Date object
 * @returns true if date is valid
 */
export function isValidDate(date: Date | string | null | undefined): boolean {
  return safeParseDate(date) !== null;
}
