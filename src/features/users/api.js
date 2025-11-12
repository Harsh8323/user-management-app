import { fetchJson } from '../../utils/http.js'

const USERS_ENDPOINT = '/users'

export const fetchUsers = () => fetchJson(USERS_ENDPOINT)

export const fetchUser = (id) => fetchJson(`${USERS_ENDPOINT}/${id}`)

export const createUser = (payload) =>
  fetchJson(USERS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateUser = (id, payload) =>
  fetchJson(`${USERS_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const deleteUser = (id) =>
  fetchJson(`${USERS_ENDPOINT}/${id}`, {
    method: 'DELETE',
  })

