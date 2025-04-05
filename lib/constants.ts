export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Ecommerce Demo"
export const APP_SLOGAN =
    process.env.NEXT_PUBLIC_APP_SLOGAN || "BEST E-COMMERCE WEBSITE"
export const APP_DESCRIPTION =
    process.env.NEXT_PUBLIC_APP_DESCRIPTION || "IT IS INSPIRED BY AMAZON.COM, CREATED BY NEXT JS & MONGODB"

export const APP_COPYRIGHT = process.env.NEXT_PUBLIC_APP_COPYRIGHT || `Copyright © 2025" ${APP_NAME}. All Rights Reserved.`

export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)


export const FREE_SHIPPING_MIN_PRICE = Number(process.env.FREE_SHIPPING_MIN_PRICE || 35)