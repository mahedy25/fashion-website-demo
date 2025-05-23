'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

import { IProduct } from '@/lib/db/models/product.model'
import { UploadButton } from '@/lib/uploadthing'
import { ProductInputSchema, ProductUpdateSchema } from '@/lib/validator'
import { Checkbox } from '@/components/ui/checkbox'
import { toSlug } from '@/lib/utils'
import { IProductInput } from '@/types'
import { createProduct, updateProduct } from '@/lib/db/actions/product.actions'
import { Trash } from 'lucide-react'

const productDefaultValues: IProductInput =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'Sample Product',
        slug: 'sample-product',
        category: 'Sample Category',
        images: ['/images/p11-1.jpg'],
        brand: 'Sample Brand',
        description: 'This is a sample description of the product.',
        price: 99.99,
        listPrice: 0,
        countInStock: 15,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }
    : {
        name: '',
        slug: '',
        category: '',
        images: [],
        brand: '',
        description: '',
        price: 0,
        listPrice: 0,
        countInStock: 0,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update'
  product?: IProduct
  productId?: string
}) => {
  const router = useRouter()

  const form = useForm<IProductInput>({
    resolver:
      type === 'Update'
        ? zodResolver(ProductUpdateSchema)
        : zodResolver(ProductInputSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  })

  async function onSubmit(values: IProductInput) {
    if (type === 'Create') {
      const res = await createProduct(values)
      if (!res.success) {
        toast.error(res.message); // Error toast
      } else {
        toast.success(res.message); // Success toast
        router.push('/admin/products');
      }
      
    }
    if (type === 'Update') {
      if (!productId) {
        router.push(`/admin/products`)
        return
      }
      const res = await updateProduct({ ...values, _id: productId })
      if (!res.success) {
        toast.error(res.message); // Error toast
      } else {
        router.push('/admin/products'); // Redirect on success
      }      
    }
  }
  const images = form.watch('images')

  console.log(form.formState.errors)
  return (
    <Form {...form}>
      <form
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product name' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>

                <FormControl>
                <div className="flex items-start gap-2">
  <div className="flex-1">
    <Input
      placeholder="Enter product slug"
      className="w-full"
      {...field}
    />
  </div>
  <button
    type="button"
    onClick={() => {
      form.setValue('slug', toSlug(form.getValues('name')))
    }}
    className="bg-blue-600 font-semibold text-white  px-4 py-1 rounded-md hover:bg-blue-700 transition"
  >
    Generate
  </button>
</div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder='Enter category' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='brand'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product brand' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='listPrice'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>List Price</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product list price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Net Price</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
  control={form.control}
  name='images'
  render={() => (
    <FormItem className='w-full'>
      <FormLabel>Images</FormLabel>
      <Card>
        <CardContent className='space-y-2 mt-2 min-h-48'>
          <div className='flex justify-start items-center flex-wrap gap-3'>
            {images.map((image: string) => (
              <Card key={image} className='relative w-20 h-20'>
                <Image
                  src={image}
                  alt='product image'
                  className='w-full h-full object-cover object-center rounded-sm'
                  width={100}
                  height={100}
                />
                <Button
                  variant='destructive'
                  className='absolute top-0 right-0 p-1'
                  type='button'
                  size='icon'
                  onClick={() => {
                    form.setValue(
                      'images',
                      images.filter((img) => img !== image)
                    );
                  }}
                >
                  <Trash className='w-4 h-4' />
                </Button>
              </Card>
            ))}

            <FormControl>
              <UploadButton
                className="rounded-full"
                endpoint="imageUploader"
                appearance={{
                  button:
                    'bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded-full transition-colors',
                }}
                onClientUploadComplete={(res: { url: string }[]) => {
                  form.setValue('images', [...images, res[0].url]);
                }}
                onUploadError={(error: Error) => {
                  toast.error(`ERROR! ${error.message}`);
                }}
              />
            </FormControl>
          </div>
        </CardContent>
      </Card>

      <FormMessage />
    </FormItem>
  )}
/>

        </div>

        <div>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Tell us a little bit about yourself'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> other users and organizations to
                  link to them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name='isPublished'
            render={({ field }) => (
              <FormItem className='space-x-2 items-center'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Is Published?</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? 'Submitting...' : `${type} Product `}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm