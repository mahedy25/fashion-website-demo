import * as React from 'react'
import Link from 'next/link'
import { X, ChevronRight, UserCircle, MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOut } from '@/lib/db/actions/user.actions'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { auth } from '@/auth'
import { toSlug } from '@/lib/utils'

export default async function Sidebar({
  categories,
}: {
  categories: string[] // Categories to display in the sidebar
}) {
  // Fetch user session for dynamic rendering (sign-in state)
  const session = await auth()

  return (
    <Drawer direction="left"> {/* Drawer component for sidebar */}
      {/* Drawer Trigger Button */}
      <DrawerTrigger className="header-button flex items-center !p-2">
        <MenuIcon className="h-5 w-5 mr-1" />
        All {/* Label for the button */}
      </DrawerTrigger>

      {/* Drawer Content */}
      <DrawerContent className="w-[350px] mt-0 top-0">
        <div className="flex flex-col h-full">
          {/* User Sign-In Section */}
          <div className="dark bg-gray-800 text-foreground flex items-center justify-between">
            <DrawerHeader>
              <DrawerTitle className="flex items-center">
                <UserCircle className="h-6 w-6 mr-2" />
                {/* Check if the user is signed in */}
                {session ? (
                  <DrawerClose asChild>
                    <Link href="/account">
                      <span className="text-lg font-semibold">
                        Hello, {session.user.name} {/* User's name */}
                      </span>
                    </Link>
                  </DrawerClose>
                ) : (
                  <DrawerClose asChild>
                    <Link href="/sign-in">
                      <span className="text-lg font-semibold">
                        Hello, sign in {/* Call-to-action for signing in */}
                      </span>
                    </Link>
                  </DrawerClose>
                )}
              </DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            {/* Close button for the sidebar */}
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span> {/* Screen reader only */}
              </Button>
            </DrawerClose>
          </div>

          {/* Shop By Category Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                Available Categories {/* Title for the categories */}
              </h2>
            </div>
            <nav className="flex flex-col">
              {/* Iterate over categories and create a link for each */}
              {categories.map((category) => (
                <DrawerClose asChild key={category}>
                  <Link
                    href={`/search?category=${category}`}
                    className="flex items-center justify-between item-button"
                  >
                    <span>{category}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </DrawerClose>
              ))}
            </nav>
          </div>

          {/* Settings and Help Section */}
          <div className="border-t flex flex-col">
            <div className="p-4">
              <h2 className="text-lg font-semibold">
                Help & Settings {/* Title for help and settings */}
              </h2>
            </div>
            {/* Account and Customer Service links */}
            <DrawerClose asChild>
              <Link href="/account" className="item-button">
                Your account
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link href="/page/customer-service" className="item-button">
                Customer Service
              </Link>
            </DrawerClose>
            {/* Show sign-out button if user is signed in */}
            {session ? (
              <form action={SignOut} className="w-full">
                <Button
                  className="w-full justify-start item-button text-base"
                  variant="ghost"
                >
                  Sign out {/* Sign out button */}
                </Button>
              </form>
            ) : (
              <Link href="/sign-in" className="item-button">
                Sign in {/* Sign in link */}
              </Link>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export const getFilterUrl = ({
  params,
  category,
  tag,
  sort,
  price,
  rating,
  page,
}: {
  params: {
    q?: string
    category?: string
    tag?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }
  tag?: string
  category?: string
  sort?: string
  price?: string
  rating?: string
  page?: string
}) => {
  const newParams = { ...params }
  if (category) newParams.category = category
  if (tag) newParams.tag = toSlug(tag)
  if (price) newParams.price = price
  if (rating) newParams.rating = rating
  if (page) newParams.page = page
  if (sort) newParams.sort = sort
  return `/search?${new URLSearchParams(newParams).toString()}`
}