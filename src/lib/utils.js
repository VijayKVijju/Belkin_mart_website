import clsx from 'clsx'

// Combine class names
export function cn(...inputs) {
  return clsx(inputs)
}

// Format price in Indian Rupees
export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

// Format date
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

// Format date and time
export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// Generate slug from text
export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Truncate text
export function truncate(text, length = 100) {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Calculate discount percentage
export function calculateDiscount(originalPrice, discountPrice) {
  if (!discountPrice || discountPrice >= originalPrice) return 0
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
}

// Validate email
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Validate phone number (Indian format)
export function isValidPhone(phone) {
  const regex = /^[6-9]\d{9}$/
  return regex.test(phone.replace(/\D/g, ''))
}

// Format phone number
export function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  return phone
}

// Get random items from array
export function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Debounce function
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}