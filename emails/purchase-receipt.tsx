import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
  } from '@react-email/components'
  
  import { formatCurrency } from '@/lib/utils'
  import { IOrder } from '@/lib/db/models/order.model'
  import { SERVER_URL } from '@/lib/constants'
  
  // Define props type for the component
  type OrderInformationProps = {
    order: IOrder
  }
  
  // Preview data for testing the email rendering
  PurchaseReceiptEmail.PreviewProps = {
    order: {
      _id: '123',
      isPaid: true,
      paidAt: new Date(),
      totalPrice: 100,
      itemsPrice: 100,
      taxPrice: 0,
      shippingPrice: 0,
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
      shippingAddress: {
        fullName: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        postalCode: '12345',
        country: 'USA',
        Phone: '123-456-7890',
        province: 'New York',
      },
      items: [
        {
          clientId: '123',
          name: 'Product 1',
          image: 'https://via.placeholder.com/150',
          price: 100,
          quantity: 1,
          product: '123',
          slug: 'product-1',
          category: 'Category 1',
          countInStock: 10,
        },
      ],
      paymentMethod: 'PayPal',
      expectedDeliveryDate: new Date(),
      isDelivered: true,
    } as IOrder,
  } satisfies OrderInformationProps
  
  // Date formatter to display readable dates
  const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' })
  
  // Main email component to render the purchase receipt
  export default async function PurchaseReceiptEmail({ order }: OrderInformationProps) {
    return (
      <Html>
        <Preview>View order receipt</Preview> {/* Email preview text */}
        <Tailwind>
          <Head />
          <Body className="font-sans bg-white">
            <Container className="max-w-xl">
              <Heading>Purchase Receipt</Heading>
  
              {/* Order meta information */}
              <Section>
                <Row>
                  <Column>
                    <Text className="mb-0 text-gray-500 whitespace-nowrap">Order ID</Text>
                    <Text className="mt-0">{order._id.toString()}</Text>
                  </Column>
                  <Column>
                    <Text className="mb-0 text-gray-500 whitespace-nowrap">Purchased On</Text>
                    <Text className="mt-0">{dateFormatter.format(order.createdAt)}</Text>
                  </Column>
                  <Column>
                    <Text className="mb-0 text-gray-500 whitespace-nowrap">Price Paid</Text>
                    <Text className="mt-0">{formatCurrency(order.totalPrice)}</Text>
                  </Column>
                </Row>
              </Section>
  
              {/* Product details and pricing breakdown */}
              <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
                {order.items.map((item) => (
                  <Row key={item.product} className="mt-8">
                    {/* Product image with link */}
                    <Column className="w-20">
                      <Link href={`${SERVER_URL}/product/${item.slug}`}>
                        <Img
                          width="80"
                          alt={item.name}
                          className="rounded"
                          src={
                            item.image.startsWith('/')
                              ? `${SERVER_URL}${item.image}`
                              : item.image
                          }
                        />
                      </Link>
                    </Column>
  
                    {/* Product name and quantity */}
                    <Column className="align-top">
                      <Link href={`${SERVER_URL}/product/${item.slug}`}>
                        <Text className="mx-2 my-0">
                          {item.name} x {item.quantity}
                        </Text>
                      </Link>
                    </Column>
  
                    {/* Product price */}
                    <Column align="right" className="align-top">
                      <Text className="m-0">{formatCurrency(item.price)}</Text>
                    </Column>
                  </Row>
                ))}
  
                {/* Order summary rows: items, tax, shipping, total */}
                {[
                  { name: 'Items', price: order.itemsPrice },
                  { name: 'Tax', price: order.taxPrice },
                  { name: 'Shipping', price: order.shippingPrice },
                  { name: 'Total', price: order.totalPrice },
                ].map(({ name, price }) => (
                  <Row key={name} className="py-1">
                    <Column align="right">{name}:</Column>
                    <Column align="right" width={70} className="align-top">
                      <Text className="m-0">{formatCurrency(price)}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    )
  }
  