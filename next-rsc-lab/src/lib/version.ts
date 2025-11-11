export const BUILD_VERSION =
  process.env.NEXT_PUBLIC_APP_VERSION ??
  process.env.NEXT_BUILD_ID ??
  (process.env.NODE_ENV === 'development' ? 'dev-local' : 'preview')
