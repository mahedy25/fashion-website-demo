/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import ProductPrice from '@/components/ui/shared/product/product-price'
import useColorStore from '@/hooks/use-color-store'
import { formatDateTime } from '@/lib/utils'
import { useTheme } from 'next-themes'

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <Card>
        <CardContent className='p-2'>
          <p>{label && formatDateTime(new Date(label)).dateOnly}</p>
          <p className='text-primary text-xl'>
            <ProductPrice price={payload[0].value} plain />
          </p>
        </CardContent>
      </Card>
    )
  }
  return null
}

const CustomXAxisTick: React.FC<any> = ({ x, y, payload }) => {
  return (
    <text
      x={x}
      y={y + 10}
      textAnchor='left'
      fill='#666'
      className='text-sm sm:text-base text-black dark:text-white font-medium'
    >
      {formatDateTime(new Date(payload.value)).dateOnly}
    </text>
  )
}

const STROKE_COLORS: { [key: string]: { [key: string]: string } } = {
  Blue: { light: '#0b40de', dark: '#3d33ff' },
  Green: { light: '#015001', dark: '#06dc06' },
  Yellow: { light: '#ac9103', dark: '#f1d541' },
}

export default function SalesAreaChart({ data }: { data: any[] }) {
  const { theme } = useTheme()
  const { cssColors, color } = useColorStore(theme)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className='w-full overflow-x-auto'>
      <ResponsiveContainer width='100%' height={isMobile ? 280 : 400}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey='date'
            tick={<CustomXAxisTick />}
            interval={isMobile ? 5 : 3}
          />
          <YAxis
            fontSize={12}
            tickFormatter={(value: number) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type='monotone'
            dataKey='totalSales'
            stroke={STROKE_COLORS[color.name][theme || 'light']}
            strokeWidth={2}
            fill={cssColors['--primary']}
            fillOpacity={0.8}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
