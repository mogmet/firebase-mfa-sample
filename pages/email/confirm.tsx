import React, {useEffect} from "react"
import { useRouter } from "next/router"
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { useAuthContext} from "../../context/AuthContext"
import { app } from "../../utils/firebase/firebaseClient"

const EmailConfirm = () => {
  const router = useRouter()
  const {user} = useAuthContext()
  useEffect(() => {
    if (!user) {
      return
    }
    if (!user.email) {
      return
    }
    if (user.emailVerified) {
      return
    }
    if (!user || !user.email) {
      return
    }
    const auth = getAuth(app)
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      alert('不正なリンク')
      return
    }
    signInWithEmailLink(auth, user.email, window.location.href).then(async () => {
      await router.push('/mfa/create')
    }).catch(async error => {
      window.alert(error)
      await router.push('/email/send')
    })
  })
  return (
    <div>
      verifying...
    </div>
  )
}
export default EmailConfirm