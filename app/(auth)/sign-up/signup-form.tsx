'use client'

import { redirect, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { IUserSignUp } from '@/types'
import { UserSignUpSchema } from '@/lib/validator'
import { registerUser, signInWithCredentials } from '@/lib/db/actions/user.actions'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { APP_NAME } from '@/lib/constants'

const signUpDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'Mahedy Hasan',
        email: 'mahedyhasan873@gmail.com',
        password: '123456',
        confirmPassword: '123456',
      }
    : {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      }

export default function SignUpForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const form = useForm<IUserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: signUpDefaultValues,
  })

  const { control, handleSubmit } = form

  const onSubmit = async (data: IUserSignUp) => {
    try {
      const res = await registerUser(data)

      if (!res.success) {
        toast.error(res.error || 'Something went wrong.')
        return
      }

      toast.success('Account created successfully! Logging in...')

      await signInWithCredentials({
        email: data.email,
        password: data.password,
      })

      redirect(callbackUrl)
    } catch (error) {
      if (isRedirectError(error)) throw error

      toast.error('Invalid email or password')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='hidden' name='callbackUrl' value={callbackUrl} />
        <div className='space-y-6'>
          <FormField
            control={control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Confirm your password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full'>
            Sign Up
          </Button>

          <div className='text-sm'>
            By creating an account, you agree to {APP_NAME}&apos;s{' '}
            <Link href='/page/conditions-of-use' className='underline'>
              Conditions of Use
            </Link>{' '}
            and{' '}
            <Link href='/page/privacy-policy' className='underline'>
              Privacy Notice
            </Link>
            .
          </div>

          <Separator className='mb-4' />

          <div className='text-sm text-center'>
            Already have an account?{' '}
            <Link
              className='text-blue-500 underline'
              href={`/sign-in?callbackUrl=${callbackUrl}`}
            >
              Sign In
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
