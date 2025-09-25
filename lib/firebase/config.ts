// lib/firebase.ts

import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import { getStorage, FirebaseStorage } from "firebase/storage"
import { getAnalytics, isSupported } from "firebase/analytics"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID  ,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ,
}

// Check if environment variables are loaded properly
if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.log('✅ Configuração Firebase carregada das variáveis de ambiente')
} else {
  console.warn('⚠️ Usando configuração Firebase padrão para desenvolvimento')
}

// ⚙️ Inicializa o app somente uma vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// 📦 Exportações para Firebase services
export let auth: Auth
export let firestore: Firestore
export let storage: FirebaseStorage
export let analytics: ReturnType<typeof getAnalytics> | null = null

// Inicializa os serviços do Firebase
if (typeof window !== "undefined") {
  auth = getAuth(app)
  firestore = getFirestore(app)
  storage = getStorage(app)

  // Configurar persistência de autenticação
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("🔓 Usuário autenticado:", user.email, "UID:", user.uid)
    } else {
      console.log("🔒 Usuário não autenticado")
    }
  })

  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  }).catch((err) => {
    console.warn("🔇 Firebase Analytics não suportado:", err)
  })
}

// ✅ Exportações
export { app }