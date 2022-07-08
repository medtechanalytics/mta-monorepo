import React, { ReactElement } from "react"
import { AuthIsSignedIn } from "contexts/authContext"

interface Props {
  children: JSX.Element | ReactElement
}

export const ProtectedRoute = ({ children }: Props): JSX.Element => {

  return <AuthIsSignedIn redirect={'/login'}>{children}</AuthIsSignedIn>

};