import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `R ${amount.toFixed(2)}`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getDiscountPercentage(originalPrice: number, salePrice: number): number {
  if (!salePrice || salePrice >= originalPrice) return 0
  const discount = ((originalPrice - salePrice) / originalPrice) * 100
  return Math.round(discount)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function isNewProduct(createdAt: string, daysToConsiderNew = 7): boolean {
  const productDate = new Date(createdAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - productDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= daysToConsiderNew
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return 'https://via.placeholder.com/300x300?text=No+Image'
  if (path.startsWith('http')) return path
  return path
}
