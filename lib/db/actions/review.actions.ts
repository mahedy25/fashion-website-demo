'use server'

import mongoose from 'mongoose'
import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { connectToDatabase } from '..'
import Product from '../models/product.model'
import Review, { IReview } from '../models/review.model'
import { formatError } from '@/lib/utils'
import { ReviewInputSchema } from '@/lib/validator'
import { IReviewDetails } from '@/types'
import { PAGE_SIZE } from '@/lib/constants'
import { z } from 'zod'


type ReviewInput = z.infer<typeof ReviewInputSchema>


export async function createUpdateReview({
  data,
  path,
}: {
  data: ReviewInput
  path: string
}) {
  try {
    const session = await auth()
    if (!session) {
      throw new Error('User is not authenticated')
    }

    // Validate incoming review data
    const review = ReviewInputSchema.parse({
      ...data,
      user: session?.user?.id,
    })

    await connectToDatabase()

    // Check if the review already exists
    const existReview = await Review.findOne({
      product: review.product,
      user: review.user,
    })

    if (existReview) {
      // Update existing review
      existReview.comment = review.comment
      existReview.rating = review.rating
      existReview.title = review.title
      await existReview.save()
      await updateProductReview(review.product)
      revalidatePath(path)
      return {
        success: true,
        message: 'Review updated successfully',
      }
    } else {
      // Create new review
      await Review.create(review)
      await updateProductReview(review.product)
      revalidatePath(path)
      return {
        success: true,
        message: 'Review created successfully',
      }
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

const updateProductReview = async (productId: string) => {
  // Get count of each rating for the product
  const result = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
  ])

  const totalReviews = result.reduce((sum, { count }) => sum + count, 0)
  const avgRating =
    result.reduce((sum, { _id, count }) => sum + _id * count, 0) / totalReviews

  // Map ratings to make sure all 1-5 are included
  const ratingMap = result.reduce((map, { _id, count }) => {
    map[_id] = count
    return map
  }, {})

  const ratingDistribution = []
  for (let i = 1; i <= 5; i++) {
    ratingDistribution.push({ rating: i, count: ratingMap[i] || 0 })
  }

  // Update product with new rating data
  await Product.findByIdAndUpdate(productId, {
    avgRating: avgRating.toFixed(1),
    numReviews: totalReviews,
    ratingDistribution,
  })
}

export async function getReviews({
  productId,
  limit,
  page,
}: {
  productId: string
  limit?: number
  page: number
}) {
  limit = limit || PAGE_SIZE
  await connectToDatabase()
  const skipAmount = (page - 1) * limit

  // Fetch paginated and sorted reviews
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)

  const reviewsCount = await Review.countDocuments({ product: productId })

  return {
    data: JSON.parse(JSON.stringify(reviews)) as IReviewDetails[],
    totalPages: reviewsCount === 0 ? 1 : Math.ceil(reviewsCount / limit),
  }
}

export const getReviewByProductId = async ({
  productId,
}: {
  productId: string
}) => {
  await connectToDatabase()
  const session = await auth()
  if (!session) {
    throw new Error('User is not authenticated')
  }

  // Get review by current user for a specific product
  const review = await Review.findOne({
    product: productId,
    user: session?.user?.id,
  })

  return review ? (JSON.parse(JSON.stringify(review)) as IReview) : null
}
