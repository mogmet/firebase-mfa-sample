import React, { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Alert, Button, InputLabel, Snackbar, TextField } from "@mui/material"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import {useAuthContext} from "../context/AuthContext"
import { app } from "../utils/firebase/firebaseClient"

const Hoge = () => {
  return (
    <div>
      a
    </div>
  )
}

export default Hoge