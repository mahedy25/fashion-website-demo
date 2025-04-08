import { IReviewInput } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

// Define the full Review interface, including base fields and timestamps
export interface IReview extends Document, IReviewInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

// Define the review schema
const reviewSchema = new Schema<IReview>(
  {
    // Reference to the user who wrote the review
    user: {
      type: Schema.Types.ObjectId as unknown as typeof String,
      ref: 'User',
    },

    // Whether the reviewer actually purchased the product
    isVerifiedPurchase: {
      type: Boolean,
      required: true,
      default: false,
    },

    // Reference to the reviewed product
    product: {
      type: Schema.Types.ObjectId as unknown as typeof String,
      ref: 'Product',
    },

    // Rating given by the user (1 to 5)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Title of the review
    title: {
      type: String,
      required: true,
    },

    // Review body/comment
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
)

// Create or retrieve the Review model
const Review =
  (models.Review as Model<IReview>) || model<IReview>('Review', reviewSchema)

export default Review
