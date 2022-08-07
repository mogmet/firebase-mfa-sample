import { ReactNode, createContext, useState, useContext, useEffect } from "react"
import { getAuth, onAuthStateChanged, Auth } from "firebase/auth"
import type { User } from "firebase/auth"
import { useRouter} from "next/router"
import { app } from "../utils/firebase/firebaseClient"

export type UserType = User | null

export type AuthContextProps = {
  user: UserType
}

export type AuthProps = {
  children: ReactNode
}

const AuthContext = createContext<AuthContextProps>({user: null})

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: AuthProps) => {
  const router = useRouter()
  const [user, setUser] = useState<UserType>(null)
  const isAvailableForViewing =
    router.pathname === "/about" ||
    router.pathname === "/login" ||
    router.pathname === "/signup" ||
    router.pathname === "/confirm"
  console.log('AuthProvider', user)

  useEffect(() => {
    const authStateChanged = () => {
      const auth = getAuth(app)
      onAuthStateChanged(auth, async (user) => {
        console.table(user)
        setUser(user)
        if (!user && !isAvailableForViewing) {
          await router.push("/login")
          return
        }
        if (!user?.emailVerified) {
          await router.push("/email/send")
          return
        }
        // if (!user?.providerData) {
        //   await router.push("/email/send")
        //   return
        // }
      })
    }
    return () => {
      authStateChanged()
    }
  }, [user])

  return (
    <AuthContext.Provider value={{user}}>
      {children}
    </AuthContext.Provider>
  )
}