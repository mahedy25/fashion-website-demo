'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Check, StarIcon, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { z } from 'zod'

// UI Components
import Rating from '@/components/ui/shared/product/rating'
import { Button } from '@/components/ui/button'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

// Data / Actions
import {
  createUpdateReview,
  getReviewByProductId,
  getReviews,
} from '@/lib/db/actions/review.actions'
import { ReviewInputSchema } from '@/lib/validator'
import RatingSummary from '@/components/ui/shared/product/rating-summary'

// Types
import { IProduct } from '@/lib/db/models/product.model'
import { IReviewDetails } from '@/types'

// Default form values
const reviewFormDefaultValues = {
  title: '',
  comment: '',
  rating: 0,
}

export default function ReviewList({
  userId,
  product,
}: {
  userId: string | undefined
  product: IProduct
}) {
  const [page, setPage] = useState(2)
  const [totalPages, setTotalPages] = useState(0)
  const [reviews, setReviews] = useState<IReviewDetails[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true })

  // Reload first page of reviews (used after submitting or mounting)
  const reload = async () => {
    try {
      const res = await getReviews({ productId: product._id, page: 1 })
      setReviews([...res.data])
      setTotalPages(res.totalPages)
    } catch (err) {
      console.error(err)
      toast.error('Error in fetching reviews')
    }
  }

  // Load more reviews on scroll/in-view
  const loadMoreReviews = async () => {
    if (totalPages !== 0 && page > totalPages) return
    setLoadingReviews(true)
    const res = await getReviews({ productId: product._id, page })
    setReviews((prev) => [...prev, ...res.data])
    setTotalPages(res.totalPages)
    setPage((prev) => prev + 1)
    setLoadingReviews(false)
  }

  // Automatically load first page when inView
  useEffect(() => {
    const loadReviews = async () => {
      setLoadingReviews(true)
      const res = await getReviews({ productId: product._id, page: 1 })
      setReviews([...res.data])
      setTotalPages(res.totalPages)
      setLoadingReviews(false)
    }

    if (inView) {
      loadReviews()
    }
  }, [inView, product._id])

  type CustomerReview = z.infer<typeof ReviewInputSchema>

  const form = useForm<CustomerReview>({
    resolver: zodResolver(ReviewInputSchema),
    defaultValues: reviewFormDefaultValues,
  })

  const [open, setOpen] = useState(false)

  // Submit review handler
  const onSubmit: SubmitHandler<CustomerReview> = async (values) => {
    const res = await createUpdateReview({
      data: { ...values, product: product._id },
      path: `/product/${product.slug}`,
    })

    if (!res.success) return toast.error(res.message)

    setOpen(false)
    reload()
    toast.success(res.message)
  }

  // Open review form, preload existing if found
  const handleOpenForm = async () => {
    form.setValue('product', product._id)
    form.setValue('user', userId!)
    form.setValue('isVerifiedPurchase', true)

    const review = await getReviewByProductId({ productId: product._id })
    if (review) {
      form.setValue('title', review.title)
      form.setValue('comment', review.comment)
      form.setValue('rating', review.rating)
    }

    setOpen(true)
  }

  return (
    <div className='space-y-4'>
      {/* Empty state message */}
      {reviews.length === 0 && <div>No reviews yet</div>}

      <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
        {/* Left Column: Summary + Review Button */}
        <div className='flex flex-col gap-4'>
          {reviews.length !== 0 && (
            <RatingSummary
              avgRating={product.avgRating}
              numReviews={product.numReviews}
              ratingDistribution={
                (product.ratingDistribution || []).filter(
                  (r): r is { rating: number; count: number } =>
                    typeof r.rating === 'number' && typeof r.count === 'number'
                )
              }
            />
          )}
          <Separator />

          <div className='space-y-2'>
            <h3 className='font-bold text-lg'>Review this product</h3>
            <p className='text-sm text-muted-foreground'>
              Share your thoughts with other customers
            </p>

            {/* If signed in, show review button and dialog */}
            {userId ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <Button
                  onClick={handleOpenForm}
                  variant='outline'
                  className='w-full rounded-full'
                >
                  Write a customer review
                </Button>

                <DialogContent className='sm:max-w-[425px]'>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <DialogHeader>
                        <DialogTitle>Write a customer review</DialogTitle>
                        <DialogDescription>
                          Share your thoughts with other customers
                        </DialogDescription>
                      </DialogHeader>

                      <div className='grid gap-4 py-4'>
                        {/* Title Input */}
                        <FormField
                          control={form.control}
                          name='title'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder='Enter title' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Comment Input */}
                        <FormField
                          control={form.control}
                          name='comment'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Comment</FormLabel>
                              <FormControl>
                                <Textarea placeholder='Enter comment' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Rating Selector */}
                        <FormField
                          control={form.control}
                          name='rating'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rating</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select a rating' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <SelectItem key={i} value={(i + 1).toString()}>
                                      <div className='flex items-center gap-1'>
                                        {i + 1} <StarIcon className='h-4 w-4' />
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          type='submit'
                          size='lg'
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            ) : (
              // If not signed in
              <div>
                Please{' '}
                <Link href={`/sign-in?callbackUrl=/product/${product.slug}`} className='highlight-link'>
                  sign in
                </Link>{' '}
                to write a review
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reviews List */}
        <div className='md:col-span-3 flex flex-col gap-3'>
          {reviews.map((review) => (
            <Card key={review._id}>
              <CardHeader>
                <div className='flex justify-between items-center'>
                  <CardTitle>{review.title}</CardTitle>
                  <div className='italic text-sm flex items-center gap-1'>
                    <Check className='h-4 w-4' /> Verified Purchase
                  </div>
                </div>
                <CardDescription>{review.comment}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex space-x-4 text-sm text-muted-foreground'>
                  <Rating rating={review.rating} />
                  <div className='flex items-center'>
                    <User className='mr-1 h-3 w-3' />
                    {review.user ? review.user.name : 'Deleted User'}
                  </div>
                  <div className='flex items-center'>
                    <Calendar className='mr-1 h-3 w-3' />
                    {review.createdAt.toString().substring(0, 10)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Load More Button */}
          <div ref={ref} className='flex justify-center'>
            {page <= totalPages && !loadingReviews && (
              <Button variant='link' onClick={loadMoreReviews}>
                See more reviews
              </Button>
            )}
            {loadingReviews && <span>Loading...</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
