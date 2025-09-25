import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Validate required environment variables
const requiredEnvVars = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
}

// Check if all required variables are present
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  console.error('❌ Missing Firebase Admin environment variables:', missingVars)
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
}

// Initialize Firebase Admin
const app = getApps().length === 0 ? initializeApp({
  credential: cert({
    projectId: requiredEnvVars.projectId!,
    clientEmail: requiredEnvVars.clientEmail!,
    privateKey: requiredEnvVars.privateKey!.replace(/\\n/g, '\n'),
  }),
}) : getApps()[0]

export const db = getFirestore(app)
