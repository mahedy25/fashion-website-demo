'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from 'sonner'
import { SettingInputSchema } from '@/lib/validator'
import { ClientSetting, ISettingInput } from '@/types'

import CurrencyForm from './currency-form'
import PaymentMethodForm from './payment-method-form'
import DeliveryDateForm from './delivery-date-form'
import SiteInfoForm from './site-info-form'
import CommonForm from './common-form'
import CarouselForm from './carousel-form'
import { updateSetting } from '@/lib/db/actions/setting.actions'
import useSetting from '@/hooks/use-setting-store'

import { useRouter } from 'next/navigation' // ✅ import router

const SettingForm = ({ setting }: { setting: ISettingInput }) => {
  const { setSetting } = useSetting()
  const router = useRouter() // ✅ initialize router

  const form = useForm<ISettingInput>({
    resolver: zodResolver(SettingInputSchema),
    defaultValues: {
      site: {
        name: setting?.site?.name ?? '',
        logo: setting?.site?.logo ?? '',
        slogan: setting?.site?.slogan ?? '',
        description: setting?.site?.description ?? '',
        keywords: setting?.site?.keywords ?? '',
        url: setting?.site?.url ?? '',
        email: setting?.site?.email ?? '',
        phone: setting?.site?.phone ?? '',
        copyright: setting?.site?.copyright ?? '',
        address: setting?.site?.address ?? '',
      },
      common: {
        pageSize: setting?.common?.pageSize ?? 12,
        isMaintenanceMode: setting?.common?.isMaintenanceMode ?? false,
        freeShippingMinPrice: setting?.common?.freeShippingMinPrice ?? 0,
        defaultTheme: setting?.common?.defaultTheme ?? 'light',
        defaultColor: setting?.common?.defaultColor ?? 'blue',
      },
      carousels: setting?.carousels ?? [],
      defaultLanguage: setting?.defaultLanguage ?? 'en',
      availableCurrencies: setting?.availableCurrencies ?? [],
      defaultCurrency: setting?.defaultCurrency ?? '',
      availablePaymentMethods: setting?.availablePaymentMethods ?? [],
      defaultPaymentMethod: setting?.defaultPaymentMethod ?? '',
      availableDeliveryDates: setting?.availableDeliveryDates ?? [],
      defaultDeliveryDate: setting?.defaultDeliveryDate ?? '',
    },
  })

  const {
    formState: { isSubmitting },
  } = form

  async function onSubmit(values: ISettingInput) {
    const res = await updateSetting({ ...values })

    if (!res.success) {
      toast.error('Error', {
        description: res.message,
      })
    } else {
      toast.success('Success', {
        description: res.message,
      })

      setSetting(values as ClientSetting)

      router.refresh() // ✅ force server component refresh
    }
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SiteInfoForm id='setting-site-info' form={form} />
        <CommonForm id='setting-common' form={form} />
        <CarouselForm id='setting-carousels' form={form} />
        <CurrencyForm id='setting-currencies' form={form} />
        <PaymentMethodForm id='setting-payment-methods' form={form} />
        <DeliveryDateForm id='setting-delivery-dates' form={form} />

        <div>
          <Button
            type='submit'
            size='lg'
            disabled={isSubmitting}
            className='w-full mb-24'
          >
            {isSubmitting ? 'Submitting...' : `Save Setting`}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SettingForm
