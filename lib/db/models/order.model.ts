import { IOrderInput } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

// Order interface extending Mongoose's Document and custom input type
export interface IOrder extends Document, IOrderInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

// Mongoose schema definition
const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId as unknown as typeof String,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        clientId: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String },
        color: { type: String },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      province: { type: String, required: true },
      Phone: { type: String, required: true },
    },
    expectedDeliveryDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      email_address: { type: String },
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
)

// Use existing model if available (prevents re-registering during dev)
const Order: Model<IOrder> =
  models.Order || model<IOrder>('Order', orderSchema)

export default Order
