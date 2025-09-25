
import { auth } from "./config"
import { doc, getDoc } from "firebase/firestore"
import { getDb } from "./firestore"

// Lista de emails de administradores
const ADMIN_EMAILS = [
  'admin@juriecommerce.com',
  'guga@gmail.com'
]

// Verifica se o usuário atual é admin
export async function verifyAdminUser(): Promise<boolean> {
  try {
    const currentUser = auth.currentUser
    
    if (!currentUser) {
      return false
    }

    // Verificar se o email está na lista de admins
    if (ADMIN_EMAILS.includes(currentUser.email || '')) {
      return true
    }

    // Verificar no Firestore se o usuário tem flag isAdmin
    const db = getDb()
    const userRef = doc(db, "users", currentUser.uid)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return userData.isAdmin === true
    }

    return false
  } catch (error) {
    console.error("Erro ao verificar admin:", error)
    return false
  }
}

// Verifica se um email específico é de admin
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email)
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser
}
