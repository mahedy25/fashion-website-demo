import data from "@/lib/data"
import { connectToDatabase } from "."
import Product from "./models/product.model"
import { cwd } from "process"
import {loadEnvConfig } from "@next/env"
import User from "./models/user.model"
import Review from "./models/review.model"

loadEnvConfig(cwd())

const main = async () => {
    try {
        const {products, users, reviews} = data;
        await connectToDatabase(process.env.MONGODB_URI)

        await User.deleteMany()
        const createdUsers = await User.insertMany(users)

        await Product.deleteMany()
        const createdProducts = await Product.insertMany(products)

        // Clear all existing reviews
await Review.deleteMany()

const rws = []

for (let i = 0; i < createdProducts.length; i++) {
  let x = 0
  const { ratingDistribution } = createdProducts[i]

  for (let j = 0; j < ratingDistribution.length; j++) {
    const count = ratingDistribution[j].count

    for (let k = 0; k < count; k++) {
      x++

      // Pick a matching review sample for the current rating
      const filteredByRating = reviews.filter((r) => r.rating === j + 1)
      const sampleReview =
        filteredByRating[x % filteredByRating.length]

      rws.push({
        ...sampleReview,
        isVerifiedPurchase: true,
        product: createdProducts[i]._id,
        user: createdUsers[x % createdUsers.length]._id,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      })
    }
  }
}

// Insert all generated reviews
const createdReviews = await Review.insertMany(rws)


        console.log({
            createdUsers,
            createdProducts,
            createdReviews,
            message: "seed created successfully",
        })
        process.exit(0)
    } catch (error) {
        console.error(error)
        throw new Error("Failed to seed database")
    }
}

main()