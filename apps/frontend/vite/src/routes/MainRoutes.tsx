/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import { lazy } from 'react';

import Loadable from 'components/Loadable';
import MainLayout from 'layouts/MainLayout';
import { ProtectedRoute } from "./ProtectedRoutes"

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const ProfilePage = Loadable(lazy(() => import('pages/user/profile')));
const LogoutPage = Loadable(lazy(() => import('pages/auth/logout')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
        {
            path: 'logout',
            element: <LogoutPage />
        },
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'profile',
            element: <ProfilePage />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        }
    ]
};

export default MainRoutes;
