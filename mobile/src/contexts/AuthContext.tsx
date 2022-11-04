import { createContext, ReactNode, useState, useEffect } from 'react'
import Constants from 'expo-constants'
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { api } from '../lib/axios'

WebBrowser.maybeCompleteAuthSession()

interface UserProps {
  name: string
  avatarUrl: string
}

export interface AuthContextDataProps {
  user: UserProps
  signIn: () => Promise<void>
  isUserLoading: boolean
}

export const AuthContext = createContext({} as AuthContextDataProps);

interface AuthContextProviderProps {
  children: ReactNode
}

export function AuthContextProvider({children}: AuthContextProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps)
  const [isUserLoading, setIsUserLoading] = useState(false)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '279530657008-i2m27cug1d86gp17r5kr6rjekh55gn54.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({useProxy: true}),
    scopes: ['profile', 'email']
  })

  async function signIn() {
    try {
      setIsUserLoading(true)
      await promptAsync()
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsUserLoading(false)
    }
  }

  async function signInWithGoogle(access_token: string) {
    try {
      setIsUserLoading(true)

      const tokenResponse = await api.post('/users', {
        access_token
      })
      api.defaults.headers.authorization = `Bearer ${tokenResponse.data.token}`

      const userInfoResponse = await api.get('/me')
      setUser({
        avatarUrl: userInfoResponse.data.user.avatar,
        name: userInfoResponse.data.user.name
      })
    }catch(error) {
      console.log(error)
      throw error
    }finally{
      setIsUserLoading(false)
    }
  }

  useEffect(() => {
    if (response?.type === 'success' && response.authentication.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  },[response])

  return (
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}