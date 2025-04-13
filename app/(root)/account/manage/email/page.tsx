// email/page.tsx
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { EmailForm } from './email-form'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Change Email',
}

export default async function EmailPage() {
  const session = await auth()

  return (
    <div className='mb-24'>
      <SessionProvider session={session}>
        <div className='flex gap-2'>
          <Link href='/account'>Your Account</Link>
          <span>›</span>
          <Link href='/account/manage'>Login & Security</Link>
          <span>›</span>
          <span>Change Email</span>
        </div>

        <h1 className='h1-bold py-4'>Change Email</h1>

        <Card className='max-w-2xl'>
          <CardContent className='p-4'>
            <EmailForm />
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}
