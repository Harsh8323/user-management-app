export const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

export const ROUTES = {
  home: '/',
  createUser: '/users/new',
  userDetail: (id = ':id') => `/users/${id}`,
  editUser: (id = ':id') => `/users/${id}/edit`,
}

export const REQUEST_TIMEOUT = 10000

