'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="text-destructive h-10 w-10" />
          <h1 className="text-4xl font-bold text-gray-800">404 - Not Found</h1>
          <p className="text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => (window.location.href = '/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
