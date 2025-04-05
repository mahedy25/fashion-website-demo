'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TrashIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

import useCartStore from '@/hooks/use-cart-store'
import { FREE_SHIPPING_MIN_PRICE } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '../button'
import ProductPrice from './product/product-price'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select' // ✅ make sure this points to your styled component

export default function CartSidebar() {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore()

  return (
    <div className='w-36 overflow-y-auto'>
      <div className='fixed h-full border-l bg-white z-50'>
        <div className='h-full flex flex-col items-center justify-start gap-2 p-2'>
          {/* Subtotal Info */}
          <div className='text-center space-y-2 w-full'>
            <div>Subtotal</div>
            <div className='font-bold'>
              <ProductPrice price={itemsPrice} plain />
            </div>

            {itemsPrice > FREE_SHIPPING_MIN_PRICE && (
              <div className='text-xs text-center text-green-500'>
                Your order qualifies for FREE Shipping
              </div>
            )}

            <Link
              href='/cart'
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'w-full rounded-full hover:no-underline'
              )}
            >
              Go to Cart
            </Link>

            <Separator className='mt-3' />
          </div>

          {/* Cart Items */}
          <ScrollArea className='flex-1 w-full'>
            {items.map((item) => (
              <div key={item.clientId}>
                <div className='my-3 px-2'>
                  <Link href={`/product/${item.slug}`}>
                    <div className='relative h-24 w-full'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes='20vw'
                        className='object-contain rounded'
                      />
                    </div>
                  </Link>

                  <div className='text-center text-sm font-bold mt-2'>
                    <ProductPrice price={item.price} plain />
                  </div>

                  <div className='mt-2 flex gap-2 items-center justify-center'>
                    <Select
                      value={item.quantity.toString()}
                      onValueChange={(value) =>
                        updateItem(item, Number(value))
                      }
                    >
                      <SelectTrigger className='ml-1 h-auto w-14 py-1 text-xs border'>
                        <SelectValue placeholder="Qty" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: item.countInStock }).map((_, i) => (
                          <SelectItem key={i + 1} value={`${i + 1}`}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => removeItem(item)}
                    >
                      <TrashIcon className='h-4 w-4' />
                    </Button>
                  </div>
                </div>

                <Separator className='my-2' />
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
