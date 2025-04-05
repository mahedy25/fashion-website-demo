import { usePathname } from 'next/navigation'
import useDeviceType from './use-device-type'
import useCartStore from './use-cart-store'

// Helper function to check if the current route should NOT show the cart sidebar
const isNotInPaths = (path: string) =>
  !/^\S*\/(cart$|checkout$|sign-in$|sign-up$|order(\/.*)?$|account(\/.*)?$|admin(\/.*)?$)/.test(path)

function useCartSidebar() {
  const {
    cart: { items },
  } = useCartStore()

  const deviceType = useDeviceType()
  const currentPath = usePathname()

  return (
    items.length > 0 &&
    deviceType === 'desktop' &&
    isNotInPaths(currentPath)
  )
}

export default useCartSidebar