import { OrderItem, ShippingAddress } from '@/types'
import { round2 } from '@/lib/utils'
import { AVAILABLE_DELIVERY_DATES } from '@/lib/constants'

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
