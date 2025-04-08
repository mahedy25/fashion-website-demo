'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { formUrlQuery } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type PaginationProps = {
  page: number | string
  totalPages: number
  urlParamName?: string
}

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Handle click for previous or next buttons
  const onClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1

    // Build new URL with updated page query param
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    })

    router.push(newUrl, { scroll: true }) // Navigate to new URL
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        size='lg'
        variant='outline'
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1}
        className='w-28'
      >
        Previous
      </Button>

      <Button
        size='lg'
        variant='outline'
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
        className='w-24'
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination
