import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SignUpForm from './signup-form'

export const metadata: Metadata = {
  title: 'Sign Up',
}

type SignUpPageProps = {
  searchParams?: {
    callbackUrl?: string
  }
}

export default async function SignUpPage(props: SignUpPageProps) {
  const session = await auth()
  const callbackUrl = props.searchParams?.callbackUrl || '/'

  if (session) {
    return redirect(callbackUrl)
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
