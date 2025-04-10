import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, OrderItem, ShippingAddress } from '@/types' // 🆕 Added ShippingAddress import
import { calcDeliveryDateAndPrice } from '@/lib/db/actions/order.actions'

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: undefined,
  shippingPrice: undefined,
  totalPrice: 0,
  paymentMethod: undefined,
  shippingAddress: undefined, // 🆕 Added shippingAddress field
  deliveryDateIndex: undefined,
}

interface CartState {
  cart: Cart
  addItem: (item: OrderItem, quantity: number) => Promise<string>
  updateItem: (item: OrderItem, quantity: number) => Promise<void>
  removeItem: (item: OrderItem) => Promise<void>
  init: () => void
  clearCart: () => void // 🆕 Added clearCart method
  setShippingAddress: (shippingAddress: ShippingAddress) => Promise<void> // 🆕 New method
  setPaymentMethod: (paymentMethod: string) => void // 🆕 New method
  setDeliveryDateIndex: (deliveryDateIndex: number) => Promise<void> // 🆕 New method
}

const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: initialState,

      addItem: async (item: OrderItem, quantity: number) => {
        const { items, shippingAddress } = get().cart // 🆕 using shippingAddress now
        const existItem = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )

        if (existItem) {
          if (existItem.countInStock < quantity + existItem.quantity) {
            throw new Error('Not enough items in stock')
          }
        } else {
          if (item.countInStock < quantity) {
            throw new Error('Not enough items in stock')
          }
        }

        const updatedCartItems = existItem
          ? items.map((x) =>
              x.product === item.product &&
              x.color === item.color &&
              x.size === item.size
                ? { ...existItem, quantity: existItem.quantity + quantity }
                : x
            )
          : [...items, { ...item, quantity }]

        const deliveryDetails = await calcDeliveryDateAndPrice({
          items: updatedCartItems,
          shippingAddress, // 🆕 now passed to calculation
        })

        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...deliveryDetails,
          },
        })

        localStorage.setItem('cart', JSON.stringify(updatedCartItems)) // ✅ originally present

        // Added code for finding clientId
        const foundItem = updatedCartItems.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )?.clientId

        if (!foundItem) {
          throw new Error('Item not found in cart')
        }

        return foundItem || '' // Ensure it returns the clientId or empty string
      },

      updateItem: async (item: OrderItem, quantity: number) => {
        const { items, shippingAddress } = get().cart // 🆕 using shippingAddress now
        const exist = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )
        if (!exist) return

        const updatedCartItems = items.map((x) =>
          x.product === item.product &&
          x.color === item.color &&
          x.size === item.size
            ? { ...exist, quantity }
            : x
        )

        const deliveryDetails = await calcDeliveryDateAndPrice({
          items: updatedCartItems,
          shippingAddress, // 🆕
        })

        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...deliveryDetails,
          },
        })
      },

      removeItem: async (item: OrderItem) => {
        const { items, shippingAddress } = get().cart // 🆕 using shippingAddress
        const updatedCartItems = items.filter(
          (x) =>
            x.product !== item.product ||
            x.color !== item.color ||
            x.size !== item.size
        )

        const deliveryDetails = await calcDeliveryDateAndPrice({
          items: updatedCartItems,
          shippingAddress, // 🆕
        })

        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...deliveryDetails,
          },
        })
      },

      setShippingAddress: async (shippingAddress: ShippingAddress) => {
        const { items } = get().cart
        const deliveryDetails = await calcDeliveryDateAndPrice({
          items,
          shippingAddress,
        })

        set({
          cart: {
            ...get().cart,
            shippingAddress, // 🆕 updates cart with shipping address
            ...deliveryDetails,
          },
        })
      },

      setPaymentMethod: (paymentMethod: string) => {
        set({
          cart: {
            ...get().cart,
            paymentMethod, // 🆕
          },
        })
      },

      setDeliveryDateIndex: async (index: number) => {
        const { items, shippingAddress } = get().cart
        const deliveryDetails = await calcDeliveryDateAndPrice({
          items,
          shippingAddress,
          deliveryDateIndex: index,
        })

        set({
          cart: {
            ...get().cart,
            ...deliveryDetails,
          },
        })
      },

      clearCart: () => {
        set({
          cart: {
            ...get().cart,
            items: [], // 🆕 clears only items
          },
        })
      },

      init: () => set({ cart: initialState }), // ✅ already present
    }),
    {
      name: 'cart-store',
    }
  )
)

export default useCartStore
