import React from "react"
import { useRouter } from "next/router"
import { getAuth, signOut } from "firebase/auth"
import { useAuthContext} from "../context/AuthContext"
import { app } from "../utils/firebase/firebaseClient"
import {Loading} from "../components/loading";

const Signout = () => {
  const router = useRouter()
  const {user} = useAuthContext()
  const auth = getAuth(app)
  const isLoggedIn = !!user
  if (!isLoggedIn) {
    router.push('/login')
    return Loading
  }
  signOut(auth)
  return (
    <div>
      ...sign outing
    </div>
  )
}

export default Signout