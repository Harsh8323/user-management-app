import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createUser, deleteUser, fetchUsers, updateUser } from '../features/users/api.js'
import { mapApiUserToModel, mapFormToApi } from '../features/users/mappers.js'
import { assertValidUser } from '../features/users/validations.js'
import { getErrorMessage } from '../utils/errors.js'
import { useAsync } from './use-async.js'
import {
  isLocallyCreated,
  mergeUsersWithPersisted,
  persistCreatedUser,
  removeCreatedUser,
  updateCreatedUser,
} from '../utils/persisted-users.js'

const UsersContext = createContext(null)

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const listAsync = useAsync()
  const mutationAsync = useAsync()
  const usersRef = useRef([])

  useEffect(() => {
    usersRef.current = users
  }, [users])

  const generateLocalId = useCallback(() => {
    const existingIds = new Set(usersRef.current.map((user) => Number(user.id)))
    let candidate = Date.now()
    while (existingIds.has(candidate)) {
      candidate += 1
    }
    return candidate
  }, [])

  const loadUsers = useCallback(async () => {
    const data = await listAsync.run(fetchUsers())
    const mapped = data.map(mapApiUserToModel)
    const merged = mergeUsersWithPersisted(mapped)
    setUsers(merged)
    return merged
  }, [listAsync])

  const createUserRecord = useCallback(
    async (payload) => {
      const cleanPayload = assertValidUser(payload)
      const apiPayload = mapFormToApi(cleanPayload)
      const data = await mutationAsync.run(createUser(apiPayload))
      const mapped = mapApiUserToModel(data)

      const userWithId = (() => {
        const candidateId = Number(mapped.id)
        if (!candidateId || usersRef.current.some((user) => Number(user.id) === candidateId)) {
          return { ...mapped, id: generateLocalId() }
        }
        return { ...mapped }
      })()

      persistCreatedUser(userWithId)

      setUsers((prev) => {
        const nextUsers = [userWithId, ...prev]
        return nextUsers
      })
      return userWithId
    },
    [generateLocalId, mutationAsync],
  )

  const updateUserRecord = useCallback(
    async (id, payload) => {
      const cleanPayload = assertValidUser(payload)
      const numericId = Number(id)
      const isLocal = isLocallyCreated(numericId)

      // For locally created users, update locally without API call
      if (isLocal) {
        const updatedUser = {
          id: numericId,
          name: cleanPayload.name,
          email: cleanPayload.email,
          phone: cleanPayload.phone,
        }
        updateCreatedUser(numericId, updatedUser)
        setUsers((prev) =>
          prev.map((user) => (Number(user.id) === numericId ? { ...user, ...updatedUser } : user))
        )
        return updatedUser
      }

      // For JSONPlaceholder users (IDs 1-10), make API call
      const apiPayload = mapFormToApi(cleanPayload)
      const data = await mutationAsync.run(updateUser(id, apiPayload))
      const mapped = mapApiUserToModel(data)

      setUsers((prev) => prev.map((user) => (Number(user.id) === Number(mapped.id) ? { ...user, ...mapped } : user)))
      return mapped
    },
    [mutationAsync],
  )

  const deleteUserRecord = useCallback(
    async (id) => {
      const numericId = Number(id)
      const isLocal = isLocallyCreated(numericId)

      // For locally created users, delete locally without API call
      if (isLocal) {
        removeCreatedUser(numericId)
        setUsers((prev) => prev.filter((user) => Number(user.id) !== numericId))
        return
      }

      // For JSONPlaceholder users (IDs 1-10), make API call (simulated)
      await mutationAsync.run(deleteUser(id))
      setUsers((prev) => prev.filter((user) => Number(user.id) !== numericId))
    },
    [mutationAsync],
  )

  const findUser = useCallback(
    (id) => users.find((user) => user.id === Number(id)) ?? null,
    [users],
  )

  const value = useMemo(
    () => ({
      users,
      loadUsers,
      createUser: createUserRecord,
      updateUser: updateUserRecord,
      deleteUser: deleteUserRecord,
      findUser,
      listStatus: listAsync.status,
      listError: listAsync.error,
      mutationStatus: mutationAsync.status,
      mutationError: mutationAsync.error,
      resetList: listAsync.reset,
      resetMutation: mutationAsync.reset,
      getErrorMessage,
    }),
    [
      users,
      loadUsers,
      createUserRecord,
      updateUserRecord,
      deleteUserRecord,
      findUser,
      listAsync.status,
      listAsync.error,
      listAsync.reset,
      mutationAsync.status,
      mutationAsync.error,
      mutationAsync.reset,
    ],
  )

  return createElement(UsersContext.Provider, { value }, children)
}

export const useUsers = () => {
  const context = useContext(UsersContext)
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider')
  }
  return context
}

