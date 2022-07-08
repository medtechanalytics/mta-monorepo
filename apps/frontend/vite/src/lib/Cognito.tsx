import {
  AuthenticationDetails, CognitoAccessToken, CognitoIdToken, CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession
} from 'amazon-cognito-identity-js'
import { DEFAULT_TIMEZONE } from "../config"
import axios from 'axios'

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID as string;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string;

const poolData = {
  UserPoolId: `${userPoolId}`,
  ClientId: `${clientId}`,
}

const userPool: CognitoUserPool = new CognitoUserPool(poolData)

let currentUser: any = userPool.getCurrentUser()

export function getCurrentUser() {
  return currentUser
}

function getCognitoUser(username: string) {
  const userData = {
    Username: username,
    Pool: userPool,
  }
  return new CognitoUser(userData)
}

export async function refreshSession() {
  if (!currentUser) {
    currentUser = userPool.getCurrentUser()
  }
  const session: any = await getSession();
  return new Promise(function (resolve, reject) {
    currentUser.refreshSession(
      new CognitoRefreshToken({RefreshToken: session.refreshToken}),
      function (err: any, session: any) {
      if (err) {
        reject(err)
      }
      else {
        resolve(session)
      }
    })
  }).catch((err) => {
    throw err
  })
}

export async function getSession() {
  if (!currentUser) {
    currentUser = userPool.getCurrentUser()
  }

  return new Promise(function (resolve, reject) {
    currentUser.getSession(function (err: any, session: any) {
      if (err) {
        reject(err)
      }
      else {
        resolve(session)
      }
    })
  }).catch((err) => {
    throw err
  })
}

export async function signUpUserWithEmail(username: string, email: string, password: string) {
  return new Promise(function (resolve, reject) {
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
      new CognitoUserAttribute({
        Name: 'zoneinfo',
        Value: DEFAULT_TIMEZONE
      })
    ]

    userPool.signUp(username, password, attributeList, [], function (err, res) {
      if (err) {
        reject(err)
      }
      else {
        resolve(res)
      }
    })
  }).catch((err) => {
    throw err
  })
}

export async function verifyCode(username: string, code: string) {
  return new Promise(function (resolve, reject) {
    const cognitoUser = getCognitoUser(username)

    cognitoUser.confirmRegistration(code, true, function (err, result) {
      if (err) {
        reject(err)
      }
      else {
        resolve(result)
      }
    })
  }).catch((err) => {
    throw err
  })
}

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  }
  catch (e) {
    return null;
  }
};

export async function federatedSignIn(code: string) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
    // client_secret: import.meta.env.VITE_COGNITO_CLIENT_SECRET,
    redirect_uri: `${import.meta.env.VITE_COGNITO_CALLBACK}/oauth`
  })
  const response = await axios.post(`https://${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/token`,
    params.toString(), {headers}
  )
  const idToken = parseJwt(response.data.id_token)
  currentUser = getCognitoUser(idToken.email);
  const session = new CognitoUserSession({
    IdToken: new CognitoIdToken({ IdToken: response.data.id_token }),
    AccessToken: new CognitoAccessToken({ AccessToken: response.data.access_token }),
    RefreshToken: new CognitoRefreshToken({ RefreshToken: response.data.refresh_token })
  })
  await currentUser.setSignInUserSession(session)
  return new Promise(function (resolve, reject) {
    currentUser.getSession(function (err: any, session: any) {
      if (err) {
        reject(err)
      }
      else {
        resolve(session)
      }
    })
  }).catch((err) => {
    throw err
  })
}

export async function signInWithEmail(username: string, password: string) {
  return new Promise(function (resolve, reject) {
    const authenticationData = {
      Username: username,
      Password: password,
    }
    const authenticationDetails = new AuthenticationDetails(authenticationData)

    currentUser = getCognitoUser(username)

    currentUser.authenticateUser(authenticationDetails, {
      onSuccess: function (res: any) {
        resolve(res)
      },
      onFailure: function (err: any) {
        reject(err)
      },
    })
  }).catch((err) => {
    throw err
  })
}

export function signOut() {
  if (currentUser) {
    currentUser.signOut()
  }
}

export async function getAttributes() {
  return new Promise(function (resolve, reject) {
    currentUser.getUserAttributes(function (err: any, attributes: any) {
      if (err) {
        reject(err)
      }
      else {
        resolve(attributes)
      }
    })
  }).catch((err) => {
    throw err
  })
}

export async function setAttribute(attribute: any[]) {
  return new Promise(function (resolve, reject) {
    const attributeList = attribute.map(at => {
      return new CognitoUserAttribute(at)
    })

    currentUser.updateAttributes(attributeList, (err: any, res: any) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(res)
      }
    })
  }).catch((err) => {
    throw err
  })
}

export async function resendVerificationCode(username: string) {
  return new Promise(function (resolve, reject) {
    const cognitoUser = getCognitoUser(username)

    if (!cognitoUser) {
      reject(`could not find ${username}`)
      return
    }

    cognitoUser.resendConfirmationCode((err: any, res: any) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(res)
      }
    })
  }).catch((err) => {
    throw err
  })
}

export async function sendCode(username: string) {
  return new Promise(function (resolve, reject) {
    const cognitoUser = getCognitoUser(username)

    if (!cognitoUser) {
      reject(`could not find ${username}`)
      return
    }

    cognitoUser.forgotPassword({
      onSuccess: function (res) {
        resolve(res)
      },
      onFailure: function (err) {
        reject(err)
      },
    })
  }).catch((err) => {
    throw err
  })
}

export async function forgotPassword(username: string, code: string, password: string) {
  return new Promise(function (resolve, reject) {
    const cognitoUser = getCognitoUser(username)

    if (!cognitoUser) {
      reject(`could not find ${username}`)
      return
    }

    cognitoUser.confirmPassword(code, password, {
      onSuccess: function () {
        resolve('password updated')
      },
      onFailure: function (err) {
        reject(err)
      },
    })
  })
}

export async function changePassword(oldPassword: string, newPassword: string) {
  return new Promise(function (resolve, reject) {
    currentUser.changePassword(oldPassword, newPassword, function (err: any, res: any) {
      if (err) {
        reject(err)
      }
      else {
        resolve(res)
      }
    })
  })
}
