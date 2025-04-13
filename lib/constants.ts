export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Ecommerce Demo"

export const SERVER_URL = 
process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "abcd@example.com"
export const SENDER_NAME = process.env.SENDER_NAME || APP_NAME

export const APP_SLOGAN =
    process.env.NEXT_PUBLIC_APP_SLOGAN || "BEST E-COMMERCE WEBSITE"
export const APP_DESCRIPTION =
    process.env.NEXT_PUBLIC_APP_DESCRIPTION || "IT IS INSPIRED BY AMAZON.COM, CREATED BY NEXT JS & MONGODB"

export const APP_COPYRIGHT = process.env.NEXT_PUBLIC_APP_COPYRIGHT || `Copyright © 2025" ${APP_NAME}. All Rights Reserved.`

export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)


export const FREE_SHIPPING_MIN_PRICE = Number(process.env.FREE_SHIPPING_MIN_PRICE || 35)


export const AVAILABLE_PAYMENT_METHODS = [
    {
        name: "PayPal",
        commission: 0,
        isDefault: true,
    },
    {
        name: "Stripe",
        commission: 0,
        isDefault: true,
    },
    {
        name: "Cash On Delivery",
        commission: 0,
        isDefault: true,
    },
]

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'PayPal'

export const AVAILABLE_DELIVERY_DATES = [
    {
        name: 'Tomorrow',
        daysToDeliver: 1,
        shippingPrice: 12.9,
        freeShippingMinPrice: 0,
    },
    {
        name: 'Next 3 Days',
        daysToDeliver: 3,
        shippingPrice: 6.9,
        freeShippingMinPrice: 0,
    },
    {
        name: 'Next 7 Days',
        daysToDeliver: 7,
        shippingPrice: 4.9,
        freeShippingMinPrice: 35,
    },
]

export const USER_ROLES = ['Admin', 'User']
export const COLORS = ['Yellow', 'Green', 'Red']
export const THEMES = ['Light', 'Dark', 'System']
