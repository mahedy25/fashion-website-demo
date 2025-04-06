import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SignUpForm from './signup-form'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: {
    callbackUrl?: string
  }
}) {
  const session = await auth()

  if (session) {
    return redirect(searchParams?.callbackUrl || '/')
  }

  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}
