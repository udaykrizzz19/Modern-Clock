import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format time in milliseconds to a string format HH:MM:SS.ms
 * 
 * @param milliseconds The time in milliseconds to format
 * @param showMilliseconds Whether to include milliseconds in the formatted string
 * @returns Formatted time string
 */
export function formatTime(milliseconds: number, showMilliseconds = false): string {
  // Calculate hours, minutes, seconds, and remaining milliseconds
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = Math.floor((milliseconds % 1000) / 10);

  // Format each part with leading zeros
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  const formattedMs = String(ms).padStart(2, '0');

  // Return the formatted string
  return showMilliseconds
    ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMs}`
    : `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}