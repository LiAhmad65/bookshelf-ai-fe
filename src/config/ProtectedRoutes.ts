/** Routes that require a logged-in user. */
export const PROTECTED_ROUTES = {
  books: '/books',
  bookDetailPattern: '/books/:id',
  userDetailPattern: '/users/:id',
  userDetail: (id: string) => `/users/${encodeURIComponent(id)}`,
  bookDetail: (id: string) => `/books/${encodeURIComponent(id)}`,
} as const
