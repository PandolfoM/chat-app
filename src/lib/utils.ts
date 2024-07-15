import { type ClassValue, clsx } from "clsx";
import { format, isToday, isYesterday } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number) {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return format(date, "hh:mm a");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "MM/dd/yy");
  }
}

export function getInitials(name: string) {
  const words = name.split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  } else if (words.length >= 2) {
    return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  }
  return "";
}

export function getProfileColor() {
  const colors = ["#3e66fb", "#dc3435", "#72C96E", "#E3B23C", "#71717A"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
