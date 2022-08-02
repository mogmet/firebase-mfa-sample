import React, {useEffect, useState} from "react";
import {
  getAuth,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator
} from "firebase/auth";
import {Button, InputLabel, TextField} from "@mui/material";
import {useRouter} from "next/router";
import { RecaptchaVerifier } from "firebase/auth";
import {AuthProvider, useAuthContext} from "../../context/AuthContext";
import {app} from "../../utils/firebase/firebaseClient";
let recaptchaVerifier: RecaptchaVerifier | null = null
const MfaCreate = () => {
  const {user} = useAuthContext()
  console.log('MfaCreate', user)
  const router = useRouter()
  // const [phoneNumber, setPhoneNumber] = useState("")
  let phoneNumber = ''
  const [verificationId, setVerificationId] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  let recaptchaId: number | null = null
  const auth = getAuth(app)
  const getRecaptchaVerifier = function(): RecaptchaVerifier {
    return new RecaptchaVerifier("sign-in-button", {
      "size": "invisible",
      "callback": function (response: any) {
        console.log('didResolved', response)
      }
    }, auth);
  }
  const handleChangePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    phoneNumber = e.currentTarget.value
    // setPhoneNumber(e.currentTarget.value)
  }
  const handleChangeSession = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.currentTarget.value)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (recaptchaId === null || !recaptchaVerifier) {
        console.log('reset', recaptchaId, recaptchaVerifier)
        setRecaptcha(true)
        return
      }
      console.log('start', phoneNumber, user)
      const multiFactorSession = await multiFactor(user!).getSession()
      const phoneInfoOptions = {
        phoneNumber: phoneNumber,
        session: multiFactorSession
      };
      const verificationId = await new PhoneAuthProvider(auth).verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
      setVerificationId(verificationId)
    } catch (e) {
      console.error('error', e)
      setRecaptcha(true)
      return
    }
    await router.push("/")
  }
  const handleSubmitSession = async (e: React.FormEvent<HTMLFormElement>) => {
    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
    // Complete enrollment.
    return multiFactor(user!).enroll(multiFactorAssertion);
  }
  const setRecaptcha = function (isReset = false) {
    if (isReset && recaptchaId !== null) {
      console.log('reset', recaptchaId)
      recaptchaId = null
      // setRecaptchaId(null)
    }
    if (recaptchaId !== null) {
      return
    }
    if (!recaptchaVerifier) {
      console.log('init recaptchaVerifier')
      recaptchaVerifier = getRecaptchaVerifier()
    }
    recaptchaVerifier.render().then(function (widgetId) {
      console.log('setRecaptchaId', widgetId)
      recaptchaId = widgetId
      // setRecaptchaId(widgetId)
    });
  }
  // 描画後にauthは使うようにする
  if (typeof window !== 'undefined') {
    setRecaptcha()
  }
  // useEffect(() => {
  //   console.log('use effect')
  //   return () => {setRecaptcha()}
  // }, []);
  console.log('will render')
  return (<div>
    <h2>MFA登録</h2>
    <div id="sign-in-button" />
    <form onSubmit={handleSubmit}>
      <div>
        <InputLabel>電話番号</InputLabel>
        <TextField
          name="phoneNumber"
          type="text"
          size="small"
          onChange={handleChangePhoneNumber}
        />
      </div>
      <div>
        <Button type="submit" variant="outlined" disabled={recaptchaId !== null}>
          コード送信
        </Button>
      </div>
    </form>
    <form onSubmit={handleSubmitSession}>
      <div>
        <InputLabel>コード</InputLabel>
        <TextField
          name="session"
          type="text"
          size="small"
          onChange={handleChangeSession}
        />
      </div>
      <div>
        <Button type="submit" variant="outlined" disabled={recaptchaId !== null}>
          認証
        </Button>
      </div>
    </form>
  </div>)
}
export default MfaCreate
