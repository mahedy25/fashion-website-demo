'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getFilterUrl } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ProductSortSelector({
  sortOrders,
/**
 * A dropdown select component for selecting a product sort order.
 *
 * Props:
 *
 * - `sortOrders`: An array of objects with `value` and `name` properties, where
 *   `value` is the value of the select option and `name` is the display name.
 * - `sort`: The currently selected value of the select.
 * - `params`: An object containing other search parameters to preserve when
 *   navigating to the updated URL.
 *
 * When a sort option is selected, the component navigates to a new URL using
 * `getFilterUrl` from `../header/sidebar` to construct the new URL.
 */
  sort,
  params,
}: {
  sortOrders: { value: string; name: string }[]
  sort: string
  params: {
    q?: string
    category?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }
}) {
  const router = useRouter()
  return (
    <Select
      onValueChange={(v) => {
        router.push(getFilterUrl({ params, sort: v }))
      }}
      value={sort}
    >
      <SelectTrigger>
        <SelectValue>
          Sort By: {sortOrders.find((s) => s.value === sort)!.name}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {sortOrders.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}