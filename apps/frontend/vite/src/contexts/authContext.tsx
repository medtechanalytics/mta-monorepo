/*
Based on
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import React, { useContext, useEffect, useMemo } from 'react'

import * as cognito from 'lib/Cognito';
import { useLocalStorage } from "./useLocalStorage"
import { Navigate, useLocation } from "react-router-dom"
import * as _ from 'lodash'
import { federatedSignIn } from "lib/Cognito"
import { useRecoilState } from "recoil"
import { userState } from "../store/atoms"

export enum AuthStatus {
  Loading,
  SignedIn,
  SignedOut,
}

export interface IAuth {
  user?: any
  sessionInfo?: { username?: string; email?: string; sub?: string; accessToken?: string; refreshToken?: string }
  attrInfo?: any
  authStatus?: AuthStatus
  signInWithEmail?: any
  signUpWithEmail?: any
  signOut?: any
  verifyCode?: any
  getSession?: any
  sendCode?: any
  forgotPassword?: any
  changePassword?: any
  getAttributes?: any
  setAttribute?: any
  federatedLogin?: any
}

interface Props {
  children: JSX.Element
  redirect?: string
}

const defaultState: IAuth = {
  sessionInfo: undefined,
  authStatus: AuthStatus.SignedOut,
}

export const AuthContext = React.createContext(defaultState)

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthIsSignedIn: React.FunctionComponent<Props> = ({ children, redirect }: Props) => {
  const { authStatus }: IAuth = useContext(AuthContext)
  const location = useLocation();

  const fromPathname = location.pathname.includes('logout') ? undefined : location.pathname;

  return <>{authStatus === AuthStatus.SignedIn ?
    children :
    (redirect ? <Navigate replace to={redirect} state={{ fromPathname }} /> : null)
  }</>
}

export const AuthIsNotSignedIn: React.FunctionComponent<Props> = ({ children, redirect }: Props) => {
  const { authStatus }: IAuth = useContext(AuthContext)
  const location = useLocation()

  let origin;
  if (authStatus === AuthStatus.SignedIn) {
    // https://www.robinwieruch.de/react-router-authentication/
    origin = _.get(location, 'state.fromPathname', redirect)
  }

  return <>{authStatus === AuthStatus.SignedOut ?
    children :
    (redirect ? <Navigate replace to={origin} state={{ fromPathname: undefined }} /> : null)
  }</>
}

export const AuthProvider: React.FunctionComponent<Props> = ({ children }: Props) => {
  const [authStatus, setAuthStatus] = useLocalStorage("authStatus", AuthStatus.Loading)
  const [sessionInfo, setSessionInfo] = useLocalStorage("sessionInfo", {})
  const [user, setUser] = useLocalStorage("user", {})
  const [attrInfo, setAttrInfo] = useLocalStorage("attrInfo", [])
  const [_user, _setUser] = useRecoilState(userState)

  useEffect( () => {
    const userAttributes = attrInfo?.reduce( (acc: any, curr: any) => ({...acc, [curr.Name]:curr.Value}),{})
    _setUser((m:any) => (userAttributes))
  }, [attrInfo])

  async function getSessionInfo() {
    try {
      const session: any = await getSession()
      setSessionInfo({
        accessToken: session.accessToken.jwtToken,
        refreshToken: session.refreshToken.token,
      })
      setUser(session.idToken.payload)
      const attr: any = await getAttributes()
      setAttrInfo(attr)
      setAuthStatus(AuthStatus.SignedIn)
    }
    catch (err) {
      setUser(undefined)
      setAttrInfo(undefined)
      setSessionInfo(undefined)
      setAuthStatus(AuthStatus.SignedOut)
    }
  }

  async function signInWithEmail(username: string, password: string) {
    try {
      await cognito.signInWithEmail(username, password)
      await getSessionInfo()
      setAuthStatus(AuthStatus.SignedIn)
    }
    catch (err) {
      setAuthStatus(AuthStatus.SignedOut)
      throw err
    }
  }

  async function signUpWithEmail(username: string, email: string, password: string) {
    try {
      await cognito.signUpUserWithEmail(username, email, password)
    }
    catch (err) {
      throw err
    }
  }

  function signOut() {
    cognito.signOut()
    setAuthStatus(AuthStatus.SignedOut)
  }

  async function verifyCode(username: string, code: string) {
    try {
      const response = await cognito.verifyCode(username, code)
      if (response == 'SUCCESS') {

      }
    }
    catch (err) {
      throw err
    }
  }

  async function getSession() {
    try {
      const session = await cognito.getSession()
      return session
    }
    catch (err) {
      throw err
    }
  }

  async function getAttributes() {
    try {
      const attr = await cognito.getAttributes()
      return attr
    }
    catch (err) {
      throw err
    }
  }

  async function setAttribute(attr: any) {
    try {
      const res = await cognito.setAttribute(attr)
      const attr_res: any = await getAttributes()
      setAttrInfo(attr_res)
      return res
    }
    catch (err) {
      throw err
    }
  }

  async function sendCode(username: string) {
    try {
      await cognito.sendCode(username)
    }
    catch (err) {
      throw err
    }
  }

  async function forgotPassword(username: string, code: string, password: string) {
    try {
      await cognito.forgotPassword(username, code, password)
    }
    catch (err) {
      throw err
    }
  }

  async function changePassword(oldPassword: string, newPassword: string) {
    try {
      await cognito.changePassword(oldPassword, newPassword)
    }
    catch (err) {
      throw err
    }
  }

  async function federatedLogin(authorizationCode: string) {
    try {
      await federatedSignIn(authorizationCode)
      const session: any = await getSession()
      setSessionInfo({
        accessToken: session.accessToken.token,
        refreshToken: session.refreshToken.token,
      })
      setUser(session.idToken.payload)
      const attr: any = await getAttributes()
      setAttrInfo(attr)
      setAuthStatus(AuthStatus.SignedIn)
    }
    catch (err) {
      console.log("Error", err)
      throw err
    }
  }

  useMemo(() => {
    getSessionInfo()
  }, [authStatus])

  const state = useMemo(() => ({
    user,
    authStatus,
    sessionInfo,
    attrInfo,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    verifyCode,
    getSession,
    sendCode,
    forgotPassword,
    changePassword,
    getAttributes,
    setAttribute,
    federatedLogin
  }), [user, authStatus])

  if (authStatus === AuthStatus.Loading) {
    <AuthContext.Provider value={state}></AuthContext.Provider>
  }

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}
