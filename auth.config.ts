import type { NextAuthConfig } from 'next-auth'

// This is just the configuration object, not a full Auth.js instance
const authConfig: NextAuthConfig = {
  providers: [],

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/checkout(\/.*)?/,
        /\/account(\/.*)?/,
        /\/admin(\/.*)?/,
      ]

      const { pathname } = request.nextUrl

      // Block access to protected routes if not authenticated
      if (protectedPaths.some((pattern) => pattern.test(pathname))) {
        return !!auth
      }

      return true
    },
  },
}

export default authConfig
