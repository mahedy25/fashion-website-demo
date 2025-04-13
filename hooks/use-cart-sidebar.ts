import { usePathname } from 'next/navigation'
import useDeviceType from './use-device-type'
import useCartStore from './use-cart-store'

const pathsPattern = '^\\S*/(cart$|checkout$|sign-in$|sign-up$|order(/.*)?$|account(/.*)?$|admin(/.*)?$)'

// Helper function to check if the current route should NOT show the cart sidebar
const isNotInPaths = (s: string) => {
  console.log('Current Path (s):', s)
  console.log('Regex Pattern:', pathsPattern)
  console.log('Match Result:', !new RegExp(pathsPattern).test(s))

  return !new RegExp(pathsPattern).test(s)
}

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
