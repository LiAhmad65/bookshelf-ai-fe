/** Single source of truth for backend endpoints (paths are relative to the API base URL). */
export const API_ROUTES = {
  auth: {
    login: '/users/login',
    signup: '/users/signup',
    me: '/auth/me',
  },
  users: {
    detail: (id: string) => `/users/${encodeURIComponent(id)}`,
  },
  books: {
    list: '/books',
    add: '/books/add-book',
    update: (id: string) => `/books/update-book/${encodeURIComponent(id)}`,
    remove: (id: string) => `/books/delete-book/${encodeURIComponent(id)}`,
    detail: (id: string) => `/books/${encodeURIComponent(id)}`,
  },
  ai: {
    chat: '/ai/chat',
    generateBookDescription: '/ai/generate-book-description',
  },
} as const
