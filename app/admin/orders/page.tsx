import { Metadata } from 'next'
import Link from 'next/link'

import { auth } from '@/auth'
import DeleteDialog from '@/components/ui/shared/delete-dialog'
import Pagination from '@/components/ui/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime, formatId } from '@/lib/utils'
import { IOrderList } from '@/types'
import { deleteOrder, getAllOrders } from '@/lib/db/actions/order.actions'
import ProductPrice from '@/components/ui/shared/product/product-price'

// Set page metadata
export const metadata: Metadata = {
  title: 'Admin Orders',
}

export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>
}) {
  // Await search parameters from props
  const searchParams = await props.searchParams
  const { page = '1' } = searchParams

  // Check admin session
  const session = await auth()
  if (session?.user.role !== 'Admin')
    throw new Error('Admin permission required')

  // Fetch orders for the current page
  const orders = await getAllOrders({
    page: Number(page),
  })

  return (
    <div className='space-y-2'>
      <h1 className='h1-bold'>Orders</h1>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.data.map((order: IOrderList) => (
              <TableRow key={order._id}>
                {/* Display order ID */}
                <TableCell>{formatId(order._id)}</TableCell>

                {/* Order creation date */}
                <TableCell>
                  {formatDateTime(order.createdAt!).dateTime}
                </TableCell>

                {/* Buyer name or fallback */}
                <TableCell>
                  {order.user ? order.user.name : 'Deleted User'}
                </TableCell>

                {/* Order total price */}
                <TableCell>
                  <ProductPrice price={order.totalPrice} plain />
                </TableCell>

                {/* Paid date or fallback */}
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'No'}
                </TableCell>

                {/* Delivered date or fallback */}
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'No'}
                </TableCell>

                {/* Action buttons: View details and delete */}
                <TableCell className='flex gap-1'>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/admin/orders/${order._id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={order._id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Render pagination if more than 1 page */}
        {orders.totalPages > 1 && (
          <Pagination page={page} totalPages={orders.totalPages!} />
        )}
      </div>
    </div>
  )
}
