/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts'
import useColorStore from '@/hooks/use-color-store'
import { useTheme } from 'next-themes'

export default function SalesCategoryPieChart({ data }: { data: any[] }) {
  const { theme } = useTheme()
  const { cssColors } = useColorStore(theme)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline='central'
        className='text-xs sm:text-sm font-semibold fill-black dark:fill-white'
      >
        {`${data[index]._id}: ${data[index].totalSales}`}
      </text>
    )
  }

  return (
    <div className='w-full overflow-x-auto'>
      <ResponsiveContainer width='100%' height={isMobile ? 300 : 400}>
        <PieChart>
          <Pie
            data={data}
            dataKey='totalSales'
            cx='50%'
            cy='50%'
            outerRadius={isMobile ? 80 : 120}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={cssColors['--primary']}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
