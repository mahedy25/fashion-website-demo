import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { IProduct } from '@/lib/db/models/product.model'

import Rating from './rating'
import { formatNumber} from '@/lib/utils'
import ProductPrice from './product-price'
import ImageHover from './image-hover'


const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,

 
}: {
  product: IProduct
  hideDetails?: boolean
  hideBorder?: boolean
  hideAddtoCart?: boolean

}) => {
  const ProductImage = () => (
    <Link href={`/product/${product.slug}`}>
      <div className='relative h-52'>
        {product.images.length > 1 ? (
          <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
          />
        ) : (
            <div className='relative w-full h-52'>
            <Image
              src={product.images[0] || '/fallback-image.jpg'} // Default Image
              alt={product.name || 'No name'}
              fill
              sizes='80vw'
              className='object-contain'
            />
          </div>
          
        )}
      </div>
    </Link>
  )
/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Displays the product name, brand, rating and price.
   *
   * This component is used in the product list page and in the product detail page.
   * When the product is in the "today's deal" tag, it displays a red tag next to the price.
   * The product name is a link to the product detail page.
   *
   * @param {{ brand: string; name: string; avgRating: number; price: number; listPrice: number; numReviews: number; tags: string[] }} product
   * @returns {JSX.Element}
   */
/******  aa87c4ee-dfb6-4fa8-9759-9d681a9b8bfa  *******/
  const ProductDetails = () => (
    <div className='flex-1 space-y-2'>
      <p className='font-bold'>{product.brand}</p>
      <Link
        href={`/product/${product.slug}`}
        className='overflow-hidden text-ellipsis'
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {product.name}
      </Link>
      <div className='flex gap-2 justify-center'>
        <Rating rating={product.avgRating} />
        <span>({formatNumber(product.numReviews)})</span>
      </div>

      <ProductPrice
        isDeal={product.tags.includes('todays-deal')}
        price={product.price}
        listPrice={product.listPrice}
        forListing
      />
    </div>
  )

  return hideBorder ? (
    <div className='flex flex-col'>
      <ProductImage />
      {!hideDetails && (
        <>
          <div className='p-3 flex-1 text-center'>
            <ProductDetails />
          </div>
        </>
      )}
    </div>
  ) : (
    <Card className='flex flex-col  '>
      <CardHeader className='p-3'>
        <ProductImage />
      </CardHeader>
      {!hideDetails && (
        <>
          <CardContent className='p-3 flex-1  text-center'>
            <ProductDetails />
          </CardContent>
        </>
      )}
    </Card>
  )
}

export default ProductCard