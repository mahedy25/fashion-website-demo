'use server'

import { auth, signIn, signOut } from '@/auth'
import { UserSignUpSchema, UserUpdateSchema } from '@/lib/validator'
import { IUserName, IUserSignIn, IUserSignUp } from '@/types'
import { redirect } from 'next/navigation'
import { connectToDatabase } from '..'
import User, { IUser } from '../models/user.model'
import bcrypt from 'bcryptjs'
import { formatError } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { PAGE_SIZE } from '@/lib/constants'
import { z } from 'zod'



export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn('credentials', { ...user, redirect: false })
}

export const SignInWithGoogle= async () => {
  await signIn('google')
}

export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false })
  redirect(redirectTo.redirect)
}

// CREATE
export async function registerUser(userSignUp: IUserSignUp) {
  try {
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    })

    await connectToDatabase()
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    })
    return { success: true, message: 'User created successfully' }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

// UPDATE
export async function updateUserName(user: IUserName) {
  try {
    await connectToDatabase()
    const session = await auth()
    const currentUser = await User.findById(session?.user?.id)
    if (!currentUser) throw new Error('User not found')
    currentUser.name = user.name
    const updatedUser = await currentUser.save()
    return {
      success: true,
      message: 'User updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}


// DELETE

export async function deleteUser(id: string) {
  try {
    await connectToDatabase()
    const res = await User.findByIdAndDelete(id)
    if (!res) throw new Error('Use not found')
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// GET
export async function getAllUsers({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  limit = limit || PAGE_SIZE
  await connectToDatabase()

  const skipAmount = (Number(page) - 1) * limit
  const users = await User.find()
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const usersCount = await User.countDocuments()
  return {
    data: JSON.parse(JSON.stringify(users)) as IUser[],
    totalPages: Math.ceil(usersCount / limit),
  }
}

export async function updateUser(user: z.infer<typeof UserUpdateSchema>) {
  try {
    await connectToDatabase()
    const dbUser = await User.findById(user._id)
    if (!dbUser) throw new Error('User not found')
    dbUser.name = user.name
    dbUser.email = user.email
    dbUser.role = user.role
    const updatedUser = await dbUser.save()
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function getUserById(userId: string) {
  await connectToDatabase()
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')
  return JSON.parse(JSON.stringify(user)) as IUser
}


export async function updateUserEmail({ email, userId }: { email: string; userId: string }) {
  try {
    await connectToDatabase()
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')
    
    user.email = email
    await user.save()
    
    return { success: true, message: 'Email updated successfully' }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}


export async function updateUserPassword({ password, userId }: { password: string; userId: string }) {
  try {
    await connectToDatabase()
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')

    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
    await user.save()

    return { success: true, message: 'Password updated successfully' }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
