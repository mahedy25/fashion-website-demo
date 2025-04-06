import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split('.')
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : int
}
// PROMPT: [ChatGTP] create toSlug ts arrow function that convert text to lowercase, remove non-word,
// non-whitespace, non-hyphen characters, replace whitespace, trim leading hyphens and trim trailing hyphens

export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')

    const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency',
      minimumFractionDigits: 2,
    })
    export function formatCurrency(amount: number) {
      return CURRENCY_FORMATTER.format(amount)
    }
    
    const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')
    export function formatNumber(number: number) {
      return NUMBER_FORMATTER.format(number)
    }

export const round2 = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100

export const generateId = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)).join('')


import { ZodError } from 'zod'
import mongoose from 'mongoose'

type AnyError = {
  name?: string
  code?: number
  message?: string | object
  errors?: Record<string, { message: string; path?: string[] }>
  keyValue?: Record<string, string>
}

export const formatError = (error: AnyError): string => {
  // Zod validation error
  if (error instanceof ZodError) {
    const fieldErrors = error.errors.map((err) => {
      const path = err.path.join('.') || 'field'
      return `${path}: ${err.message}`
    })
    return fieldErrors.join('. ')
  }

  // Mongoose validation error
  if (error instanceof mongoose.Error.ValidationError) {
    const fieldErrors = Object.values(error.errors).map((err) => err.message)
    return fieldErrors.join('. ')
  }

  // MongoDB duplicate key error
  if (error.code === 11000 && error.keyValue) {
    const duplicateField = Object.keys(error.keyValue)[0]
    return `${duplicateField} already exists`
  }

  // Generic error
  return typeof error.message === 'string'
    ? error.message
    : JSON.stringify(error.message ?? 'Something went wrong. Please try again.')
}
