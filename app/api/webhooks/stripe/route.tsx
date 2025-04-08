import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { sendPurchaseReceipt } from '@/emails'
import Order from '@/lib/db/models/order.model'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest) {
  // Construct the Stripe event using the raw request body and signature header
  const event = await stripe.webhooks.constructEvent(
    await req.text(), // Raw request body
    req.headers.get('stripe-signature') as string, // Stripe signature from header
    process.env.STRIPE_WEBHOOK_SECRET as string // Webhook secret from env
  )

  // Handle the 'charge.succeeded' event type
  if (event.type === 'charge.succeeded') {
    const charge = event.data.object // Extract charge object
    const orderId = charge.metadata.orderId // Get orderId from metadata
    const email = charge.billing_details.email // Get email from billing details
    const pricePaidInCents = charge.amount // Total amount in cents

    // Find the corresponding order in the database
    const order = await Order.findById(orderId).populate('user', 'email')
    
    // If order not found, return 400 response
    if (order == null) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    // Update order details
    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = {
      id: event.id, // Stripe event ID
      status: 'COMPLETED', // Payment status
      email_address: email!, // Customer email (non-null assertion)
      pricePaid: (pricePaidInCents / 100).toFixed(2), // Convert cents to dollars
    }

    // Save the updated order
    await order.save()

    // Attempt to send purchase receipt via email
    try {
      await sendPurchaseReceipt({ order })
    } catch (err) {
      console.log('email error', err)
    }

    // Return success response
    return NextResponse.json({
      message: 'updateOrderToPaid was successful',
    })
  }

  // Return default response for other event types
  return new NextResponse()
}
