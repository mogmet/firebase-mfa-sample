import React, { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Alert, Button, InputLabel, Snackbar, TextField } from "@mui/material"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import {AuthProvider, useAuthContext} from "../context/AuthContext"
import { app } from "../utils/firebase/firebaseClient"

const Signout = () => {
  const router = useRouter()
  const { user } = useAuthContext()
  const auth = getAuth(app)
  const isLoggedIn = !!user
  return (
    <div>
      ...sign outing
    </div>
  )
}

export default Signout