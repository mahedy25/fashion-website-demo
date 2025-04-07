import { HelpCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-4">
      <header className="bg-card mb-4 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/icons/logo.svg"
              alt="LoveAnime Logo"
              width={70}
              height={70}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
              priority
            />
          </Link>

          {/* Checkout Title */}
          <h1 className="text-2xl font-semibold">Checkout</h1>

          {/* Help Icon */}
          <Link href="/page/help" className="hover:text-primary transition-colors">
            <HelpCircle className="w-6 h-6" aria-hidden="true" />
            <span className="sr-only">Help</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
