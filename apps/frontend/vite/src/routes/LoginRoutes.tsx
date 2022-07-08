/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import { lazy } from 'react';

import Loadable from 'components/Loadable';
import MinimalLayout from 'layouts/MinimalLayout';
import { AuthIsNotSignedIn } from "../contexts/authContext"
const OAuth = Loadable(lazy(() => import('pages/auth/oauth')));
const AuthLogin = Loadable(lazy(() => import('pages/auth/login')));
const AuthRegister = Loadable(lazy(() => import('pages/auth/register')));
const AuthVerify = Loadable(lazy(() => import('pages/auth/verify')));
const AuthRequestVerify = Loadable(lazy(() => import('pages/auth/request-verify')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/forgot-password')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/reset-password')));
// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: <AuthIsNotSignedIn redirect={'/'}><MinimalLayout /></AuthIsNotSignedIn>,
    children: [
        {
            path: 'oauth',
            element: <OAuth />
        },
        {
            path: 'login',
            element: <AuthLogin />
        },
        {
            path: 'verify',
            element: <AuthVerify />
        },
        {
            path: 'request-verify',
            element: <AuthRequestVerify />
        },
        {
            path: 'reset-password',
            element: <AuthResetPassword />
        },
        {
            path: 'forgot-password',
            element: <AuthForgotPassword />
        },
        {
            path: 'register',
            element: <AuthRegister />
        }
    ]
};

export default LoginRoutes;
