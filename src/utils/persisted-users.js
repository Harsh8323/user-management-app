const STORAGE_KEY = 'user-management-persisted-users'

const getStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }
  return window.localStorage
}

const loadRawState = () => {
  try {
    const storage = getStorage()
    if (!storage) return []
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('[persisted-users] Failed to load created users', error)
    return []
  }
}

const saveCreatedUsers = (users) => {
  try {
    const storage = getStorage()
    if (!storage) return
    storage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.warn('[persisted-users] Failed to persist created users', error)
  }
}

export const mergeUsersWithPersisted = (serverUsers) => {
  const createdUsers = loadRawState().map((user) => ({ ...user }))
  const serverMap = new Map()

  serverUsers.forEach((user) => {
    serverMap.set(Number(user.id), { ...user })
  })

  const filteredCreated = createdUsers.filter((user) => !serverMap.has(Number(user.id)))

  return [...filteredCreated, ...serverMap.values()]
}

export const persistCreatedUser = (user) => {
  const createdUsers = loadRawState()
  const id = Number(user.id)
  const filtered = createdUsers.filter((existing) => Number(existing.id) !== id)
  saveCreatedUsers([{ ...user }, ...filtered])
}

export const removeCreatedUser = (id) => {
  const createdUsers = loadRawState()
  const filtered = createdUsers.filter((user) => Number(user.id) !== Number(id))
  saveCreatedUsers(filtered)
}

export const updateCreatedUser = (id, updatedUser) => {
  const createdUsers = loadRawState()
  const numericId = Number(id)
  const updated = createdUsers.map((user) =>
    Number(user.id) === numericId ? { ...user, ...updatedUser } : user
  )
  saveCreatedUsers(updated)
}

export const isLocallyCreated = (id) => {
  const createdUsers = loadRawState()
  return createdUsers.some((user) => Number(user.id) === Number(id))
}

