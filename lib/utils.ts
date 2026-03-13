import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscountedPrice(price: number, discount: number): number {
  return price - (price * discount) / 100;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LS-${timestamp}-${random}`;
}

export function generateSKU(brand: string, size: string): string {
  const brandCode = brand.substring(0, 3).toUpperCase();
  const sizeCode = size.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${brandCode}-${sizeCode}-${random}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function getStarRating(rating: number): string {
  return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
