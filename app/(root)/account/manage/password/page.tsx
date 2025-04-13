import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import PasswordForm from './password-form'

export const metadata: Metadata = {
  title: 'Change Password',
}

export default async function PasswordPage() {
  const session = await auth()

  return (
    <div className='mb-24'>
      <SessionProvider session={session}>
        <div className='flex gap-2'>
          <Link href='/account'>Your Account</Link>
          <span>›</span>
          <Link href='/account/manage'>Login & Security</Link>
          <span>›</span>
          <span>Change Password</span>
        </div>

        <h1 className='h1-bold py-4'>Change Password</h1>

        <Card className='max-w-2xl'>
          <CardContent className='p-4'>
            <PasswordForm />
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}
