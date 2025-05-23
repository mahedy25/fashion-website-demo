import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { APP_NAME } from '@/lib/constants'
import { getAllCategories } from '@/lib/db/actions/product.actions'

export default async function search(){
  const categories = await getAllCategories()
  return (
    <form action='/search' method='GET' className='flex  items-stretch h-10 '>
      <Select name='category'>
        <SelectTrigger className='w-auto min-h-[39px] h-[39px] bg-gray-100 text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 border-r dark:border-gray-200 rounded-r-none rounded-l-md rtl:rounded-r-md rtl:rounded-l-none font-semibold'>
          <SelectValue placeholder='All'/>
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectItem value='all'>All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
  className='flex-1 rounded-none bg-gray-100 text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 text-base h-[39px]'
  placeholder={`Search in ${APP_NAME}`}
  name='q'
  type='search'
/>

<button
  type='submit'
  className='bg-primary text-black rounded-s-none rounded-e-md h-[39px] w-[42px] flex items-center justify-center hover:bg-primary/90'
>
  <SearchIcon className='w-5 h-5' />
</button>
    </form>
  )
}