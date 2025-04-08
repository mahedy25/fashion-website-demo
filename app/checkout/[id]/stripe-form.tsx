import {
    LinkAuthenticationElement,
    PaymentElement,
    useElements,
    useStripe,
  } from '@stripe/react-stripe-js'
  import { FormEvent, useState } from 'react'
  
  import { Button } from '@/components/ui/button'
  import ProductPrice from '@/components/ui/shared/product/product-price'
  import { SERVER_URL } from '@/lib/constants'
  
  export default function StripeForm({
    priceInCents,
    orderId,
  }: {
    priceInCents: number
    orderId: string
  }) {
    // Stripe hooks to interact with Stripe Elements
    const stripe = useStripe()
    const elements = useElements()
  
    // Local states for loading, error message, and email
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>()
    const [email, setEmail] = useState<string>()
  
    // Handle form submission
    async function handleSubmit(e: FormEvent) {
      e.preventDefault()
  
      // Prevent submission if Stripe or Elements is not ready, or email is missing
      if (stripe == null || elements == null || email == null) return
  
      setIsLoading(true)
  
      // Confirm the payment
      stripe
        .confirmPayment({
          elements,
          confirmParams: {
            // Redirect URL after successful payment
            return_url: `${SERVER_URL}/checkout/${orderId}/stripe-payment-success`,
          },
        })
        .then(({ error }) => {
          // Handle specific Stripe errors
          if (error.type === 'card_error' || error.type === 'validation_error') {
            setErrorMessage(error.message)
          } else {
            setErrorMessage('An unknown error occurred')
          }
        })
        .finally(() => setIsLoading(false)) // Stop loading spinner in all cases
    }
  
    return (
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Heading */}
        <div className='text-xl'>Stripe Checkout</div>
  
        {/* Show error message if any */}
        {errorMessage && <div className='text-destructive'>{errorMessage}</div>}
  
        {/* Stripe's built-in card/payment form */}
        <PaymentElement />
  
        {/* Email input provided by Stripe */}
        <div>
          <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
        </div>
  
        {/* Submit button */}
        <Button
          className='w-full'
          size='lg'
          disabled={stripe == null || elements == null || isLoading}
        >
          {isLoading ? (
            'Purchasing...'
          ) : (
            <div>
              Purchase - <ProductPrice price={priceInCents / 100} plain />
            </div>
          )}
        </Button>
      </form>
    )
  }
  