import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string'
import { ZodError } from 'zod'
import mongoose from 'mongoose'

type AnyError = {
  name?: string
  code?: number
  message?: string | object
  errors?: Record<string, { message: string; path?: string[] }>
  keyValue?: Record<string, string>
}

// Classnames merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format number with at least 2 decimal digits
export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split('.')
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : int
}

// Convert string to slug
export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')

// Currency formatter
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
})
export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

// Number formatter
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}

// Round to 2 decimal places
export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100

// Random ID generator (24 digits)
export const generateId = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)).join('')

// URL query formatter
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string
  key: string
  value: string | null
}) {
  const currentUrl = qs.parse(params)
  currentUrl[key] = value
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

// Format error messages (Zod, Mongoose, MongoDB, Generic)
export const formatError = (error: AnyError): string => {
  if (error instanceof ZodError) {
    return error.errors
      .map((err) => `${err.path.join('.') || 'field'}: ${err.message}`)
      .join('. ')
  }
  if (error instanceof mongoose.Error.ValidationError) {
    return Object.values(error.errors).map((err) => err.message).join('. ')
  }
  if (error.code === 11000 && error.keyValue) {
    const duplicateField = Object.keys(error.keyValue)[0]
    return `${duplicateField} already exists`
  }
  return typeof error.message === 'string'
    ? error.message
    : JSON.stringify(error.message ?? 'Something went wrong. Please try again.')
}

// ✅ Get month name from a string like "2025-04"
export function getMonthName(yearAndMonth: string): string {
  const [year, month] = yearAndMonth.split('-')

  const yearNum = parseInt(year)
  const monthNum = parseInt(month)

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return 'Invalid date'
  }

  const targetDate = new Date(yearNum, monthNum - 1)
  const now = new Date()

  const isOngoing =
    now.getFullYear() === targetDate.getFullYear() &&
    now.getMonth() === targetDate.getMonth()

  const monthName = targetDate.toLocaleString('default', { month: 'long' })

  return isOngoing ? `${monthName} (ongoing)` : monthName
}

// Calculate a past date by subtracting `days` from today
export function calculatePastDate(days: number): Date {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() - days)
  return currentDate
}

// Calculate a future date by adding `days` to today
export function calculateFutureDate(days: number): Date {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + days)
  return currentDate
}

// Time remaining until midnight
export function timeUntilMidnight(): { hours: number; minutes: number } {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)

  const diff = midnight.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { hours, minutes }
}

// Format a date object into full, date-only, and time-only strings
export const formatDateTime = (dateInput: Date | string) => {
  const date = new Date(dateInput)

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  return {
    dateTime: date.toLocaleString('en-US', dateTimeOptions),
    dateOnly: date.toLocaleString('en-US', dateOptions),
    timeOnly: date.toLocaleString('en-US', timeOptions),
  }
}

// Shorten an ID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`
}

// Generate filter URL for search
export const getFilterUrl = ({
  params,
  category,
  tag,
  sort,
  price,
  rating,
  page,
}: {
  params: {
    q?: string
    category?: string
    tag?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }
  tag?: string
  category?: string
  sort?: string
  price?: string
  rating?: string
  page?: string
}) => {
  const newParams = { ...params }
  if (category) newParams.category = category
  if (tag) newParams.tag = toSlug(tag)
  if (price) newParams.price = price
  if (rating) newParams.rating = rating
  if (page) newParams.page = page
  if (sort) newParams.sort = sort
  return `/search?${new URLSearchParams(newParams).toString()}`
}