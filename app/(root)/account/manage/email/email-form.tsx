'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { updateUserEmail } from '@/lib/db/actions/user.actions'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type FormValues = z.infer<typeof formSchema>

export const EmailForm = () => {
  const { data: session, update } = useSession()

  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: session?.user.email || '',
    },
  })

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      updateUserEmail({ email: values.email, userId: session?.user.id || '' })
        .then(() => {
          update() // refresh session
          toast.success('Email updated successfully')
        })
        .catch(() => {
          toast.error('Something went wrong while updating email')
        })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  )
}
