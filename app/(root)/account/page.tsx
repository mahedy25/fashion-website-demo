import BrowsingHistoryList from '@/components/ui/shared/browsing-history-list'
import { Card, CardContent } from '@/components/ui/card'
import { Home, PackageCheckIcon, User } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import Pagination from '@/components/ui/shared/pagination'

const PAGE_TITLE = 'Your Account'

export const metadata: Metadata = {
  title: PAGE_TITLE,
}

// Assuming orders is coming as a prop or from another source
const orders = { totalPages: 5 }; // You can replace this with actual data

export default function AccountPage() {
  const page = 1; // You can replace this with the actual page number

  return (
    <div>
      <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>

      {/* Account sections grid */}
      <div className='grid md:grid-cols-3 gap-4 items-stretch'>
        {/* Orders Card */}
        <Card>
          <Link href='/account/orders'>
            <CardContent className='flex items-start gap-4 p-6'>
              <div>
                <PackageCheckIcon className='w-12 h-12' />
              </div>
              <div>
                <h2 className='text-xl font-bold'>Orders</h2>
                <p className='text-muted-foreground'>
                  Track, return, cancel an order, download invoice or buy again
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* Login & Security Card */}
        <Card>
          <Link href='/account/manage'>
            <CardContent className='flex items-start gap-4 p-6'>
              <div>
                <User className='w-12 h-12' />
              </div>
              <div>
                <h2 className='text-xl font-bold'>Login & security</h2>
                <p className='text-muted-foreground'>
                  Manage password, email and mobile number
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* Addresses Card */}
        <Card>
          <Link href='/account/addresses'>
            <CardContent className='flex items-start gap-4 p-6'>
              <div>
                <Home className='w-12 h-12' />
              </div>
              <div>
                <h2 className='text-xl font-bold'>Addresses</h2>
                <p className='text-muted-foreground'>
                  Edit, remove or set default address
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Browsing history section */}
      <BrowsingHistoryList className='mt-16' />

      {/* Pagination */}
      <Pagination page={page} totalPages={orders?.totalPages || 0} />
    </div>
  );
}
