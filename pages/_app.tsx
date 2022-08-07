import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {AuthProvider} from "../context/AuthContext";
export default function MyApp({ Component, pageProps }: AppProps) {
  console.log('MyAPp!!', typeof window)
  return <AuthProvider><Component {...pageProps} /></AuthProvider>
}
