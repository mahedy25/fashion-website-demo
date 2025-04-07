'use server'

import { Cart, OrderItem, ShippingAddress } from '@/types'
import { formatError, round2 } from '@/lib/utils'
import { AVAILABLE_DELIVERY_DATES } from '@/lib/constants'
import { connectToDatabase } from '..'
import { auth } from '@/auth'
import { OrderInputSchema } from '@/lib/validator'
import Order from '../models/order.model'

// CREATE: Entry function to create an order from client-side cart
export const createOrder = async (clientSideCart: Cart) => {
  try {
    // Connect to MongoDB
    await connectToDatabase()

    // Get the authenticated session
    const session = await auth()
    if (!session) throw new Error('User not authenticated')

    // Recalculate delivery date and pricing on the server
    const createdOrder = await createOrderFromCart(
      clientSideCart,
      session.user.id!
    )

    // Return success with order ID
    return {
      success: true,
      message: 'Order placed successfully',
      data: { orderId: createdOrder._id.toString() },
    }
  } catch (error) {
    // Handle and return formatted error
    return { success: false, message: formatError(error) }
  }
}

// Helper function to sanitize and create order from cart
export const createOrderFromCart = async (
  clientSideCart: Cart,
  userId: string
) => {
  // Recalculate prices and expected delivery date server-side for security
  const cart = {
    ...clientSideCart,
    ...calcDeliveryDateAndPrice({
      items: clientSideCart.items,
      shippingAddress: clientSideCart.shippingAddress,
      deliveryDateIndex: clientSideCart.deliveryDateIndex,
    }),
  }

  // Validate and sanitize order using Zod schema
  const order = OrderInputSchema.parse({
    user: userId,
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
    expectedDeliveryDate: cart.expectedDeliveryDate,
  })

  // Save order to the database
  return await Order.create(order)
}



export const calcDeliveryDateAndPrice = async ({
  items,
  shippingAddress,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number
  items: OrderItem[]
  shippingAddress?: ShippingAddress
}) => {
  // Calculate total price of items
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  // Determine which delivery date to use
  const deliveryDate =
    AVAILABLE_DELIVERY_DATES[
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex
    ]

  // Calculate shipping price
  const shippingPrice =
    !shippingAddress || !deliveryDate
      ? undefined
      : deliveryDate.freeShippingMinPrice > 0 &&
        itemsPrice > deliveryDate.freeShippingMinPrice
      ? 0
      : deliveryDate.shippingPrice

  // Calculate tax (if address provided)
  const taxPrice = !shippingAddress ? undefined : round2(itemsPrice * 0.15)

  // Calculate total price
  const totalPrice = round2(
    itemsPrice +
      (shippingPrice !== undefined ? round2(shippingPrice) : 0) +
      (taxPrice !== undefined ? round2(taxPrice) : 0)
  )

  return {
    AVAILABLE_DELIVERY_DATES,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  }
}
