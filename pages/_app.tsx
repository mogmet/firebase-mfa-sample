import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {AuthProvider} from "../context/AuthContext";
function MyApp({ Component, pageProps }: AppProps) {
  console.trace('hoge')
  console.log('MyAPp!!')
  return <AuthProvider><Component {...pageProps} /></AuthProvider>
}

export default MyApp
