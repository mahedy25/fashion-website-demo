/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCartStore from '@/hooks/use-cart-store'
import { toast } from 'sonner';
import { OrderItem } from '@/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddToCart({
  item,
  minimal = false,
}: {
  item: OrderItem
  minimal?: boolean
}) {
  const router = useRouter()
  const { addItem } = useCartStore()
  const [quantity, setQuantity] = useState(1)

  return minimal ? (
    <Button
      className='rounded-full w-auto'
      onClick={async () => { // ✅ Made function async
        try {
          await addItem(item, 1) // ✅ Added await

          toast.success('Product added to cart', { // ✅ Corrected toast usage
            action: {
              label: 'Go to Cart',
              onClick: () => router.push('/cart'),
            },
          })
        } catch (error: any) {
          toast.error(error.message) // ✅ Corrected error toast
        }
      }}
    >
      Add to Cart
    </Button>
  ) : (
    <div className='w-full space-y-2'>
      <Select
        value={quantity.toString()}
        onValueChange={(i) => setQuantity(Number(i))}
      >
        <SelectTrigger>
          <SelectValue>Quantity: {quantity}</SelectValue>
        </SelectTrigger>
        <SelectContent position='popper'>
          {Array.from({ length: item.countInStock }).map((_, i) => (
            <SelectItem key={i + 1} value={`${i + 1}`}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className='rounded-full w-full'
        type='button'
        onClick={async () => { // ✅ Made function async
          try {
            const itemId = await addItem(item, quantity) // ✅ Added await
            router.push(`/cart/${itemId}`)
          } catch (error: any) {
            toast.error(error.message) // ✅ Fixed error toast
          }
        }}
      >
        Add to Cart
      </Button>

      <Button
        variant='secondary'
        onClick={async () => { // ✅ Made function async
          try {
            await addItem(item, quantity) // ✅ Added await
            router.push(`/checkout`)
          } catch (error: any) {
            toast.error(error.message) // ✅ Fixed error toast
          }
        }}
        className='w-full rounded-full '
      >
        Buy Now
      </Button>
    </div>
  )
}