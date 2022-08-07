import React, {useEffect} from "react"
import {NextRouter, useRouter} from "next/router"
import { getAuth,  sendSignInLinkToEmail } from "firebase/auth"
import { useAuthContext} from "../../context/AuthContext"
import { app } from "../../utils/firebase/firebaseClient"

const EmailSend = () => {
  const router = useRouter()
  const {user} = useAuthContext()
  console.log('EmailSend', user?.email, typeof window)
  useEffect(() => {
    console.log('useefe', user?.email, typeof window)
    sendEmail(router, user?.email, user?.emailVerified)
    return () => {
      console.log('useefed??', user?.email, typeof window)
    }
  }, [user])
  return (
    <div>
      メールを送付しました。
      もう一度送る場合は再読込してください
    </div>
  )
}

export default EmailSend

const sendEmail = async (router: NextRouter, email?: string | null, emailVerified?: boolean): Promise<void> => {
  if (!email) {
    return
  }
  if (emailVerified) {
    // await router.push('/mfa/create')
    return
  }
  const actionCodeSettings = {
    url: 'https://localhost:3000/email/confirm',
    handleCodeInApp: true,
  }
  const auth = getAuth(app)
  console.log('getA')
  await sendSignInLinkToEmail(auth, email, actionCodeSettings).catch(error => {
    console.error(error)
    window.alert(error)
  })
}