import { lazy } from 'react'
import Layout from './Layout.jsx'
import { ROUTES } from '../utils/constants.js'

const HomePage = lazy(() => import('../pages/Home/Home.jsx'))
const UserDetailPage = lazy(() => import('../pages/UserDetail/UserDetail.jsx'))
const UserCreatePage = lazy(() => import('../pages/UserCreate/UserCreate.jsx'))
const UserEditPage = lazy(() => import('../pages/UserEdit/UserEdit.jsx'))
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFound.jsx'))

const routes = [
  {
    path: ROUTES.home,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.createUser,
        element: <UserCreatePage />,
      },
      {
        path: ROUTES.userDetail(),
        element: <UserDetailPage />,
      },
      {
        path: ROUTES.editUser(),
        element: <UserEditPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]

export default routes

