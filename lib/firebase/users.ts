import { doc, getDoc, getDocs, collection, updateDoc, deleteDoc, query, orderBy, setDoc, where, addDoc } from "firebase/firestore"
import { getDb } from "./firestore"
import type { User } from "@/lib/types"

const USERS_COLLECTION = "users"
const ADDRESSES_COLLECTION = "addresses"
const PAYMENT_METHODS_COLLECTION = "paymentMethods"
const WISHLIST_COLLECTION = "wishlist"

export async function getUserProfile(userId: string) {
  try {
    const db = getDb()
    const docRef = doc(db, USERS_COLLECTION, userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    }

    return null
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const db = getDb()
    const q = query(collection(db, USERS_COLLECTION), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as User[]
  } catch (error) {
    console.error("Error getting users:", error)
    return []
  }
}

export async function updateUserRole(userId: string, isAdmin: boolean): Promise<boolean> {
  try {
    const db = getDb()
    const docRef = doc(db, USERS_COLLECTION, userId)
    await updateDoc(docRef, { isAdmin })
    return true
  } catch (error) {
    console.error("Error updating user role:", error)
    return false
  }
}

export async function updateUserProfile(userId: string, data: Partial<User>): Promise<boolean> {
  try {
    const db = getDb()
    const docRef = doc(db, USERS_COLLECTION, userId)
    await updateDoc(docRef, { 
      ...data, 
      updatedAt: new Date()
    })
    return true
  } catch (error) {
    console.error("Error updating user profile:", error)
    return false
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const db = getDb()
    const docRef = doc(db, USERS_COLLECTION, userId)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    return false
  }
}

// Endereços
export async function getUserAddresses(userId: string) {
  try {
    const db = getDb()
    const q = query(
      collection(db, ADDRESSES_COLLECTION), 
      where("userId", "==", userId),
      orderBy("isDefault", "desc")
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Error fetching user addresses:", error)
    return []
  }
}

export async function addUserAddress(userId: string, address: any) {
  try {
    const db = getDb()

    // Se for o endereço padrão, remover padrão dos outros
    if (address.isDefault) {
      const existingAddresses = await getUserAddresses(userId)
      for (const addr of existingAddresses) {
        if ((addr as any).isDefault) {
          await updateDoc(doc(db, ADDRESSES_COLLECTION, addr.id), { isDefault: false })
        }
      }
    }

    const docRef = await addDoc(collection(db, ADDRESSES_COLLECTION), {
      ...address,
      userId,
      createdAt: new Date()
    })

    return docRef.id
  } catch (error) {
    console.error("Error adding address:", error)
    return null
  }
}

export async function updateUserAddress(addressId: string, data: any) {
  try {
    const db = getDb()
    const docRef = doc(db, ADDRESSES_COLLECTION, addressId)
    await updateDoc(docRef, { ...data, updatedAt: new Date() })
    return true
  } catch (error) {
    console.error("Error updating address:", error)
    return false
  }
}

export async function deleteUserAddress(addressId: string) {
  try {
    const db = getDb()
    const docRef = doc(db, ADDRESSES_COLLECTION, addressId)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error("Error deleting address:", error)
    return false
  }
}

// Métodos de Pagamento
export async function getUserPaymentMethods(userId: string) {
  try {
    const db = getDb()
    const q = query(
      collection(db, PAYMENT_METHODS_COLLECTION), 
      where("userId", "==", userId),
      orderBy("isDefault", "desc")
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return []
  }
}

export async function addUserPaymentMethod(userId: string, paymentMethod: any) {
  try {
    const db = getDb()

    // Se for o método padrão, remover padrão dos outros
    if (paymentMethod.isDefault) {
      const existingMethods = await getUserPaymentMethods(userId)
      for (const method of existingMethods) {
        if ((method as any).isDefault) {
          await updateDoc(doc(db, PAYMENT_METHODS_COLLECTION, method.id), { isDefault: false })
        }
      }
    }

    const docRef = await addDoc(collection(db, PAYMENT_METHODS_COLLECTION), {
      ...paymentMethod,
      userId,
      createdAt: new Date()
    })

    return docRef.id
  } catch (error) {
    console.error("Error adding payment method:", error)
    return null
  }
}

export async function deleteUserPaymentMethod(paymentMethodId: string) {
  try {
    const db = getDb()
    const docRef = doc(db, PAYMENT_METHODS_COLLECTION, paymentMethodId)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error("Error deleting payment method:", error)
    return false
  }
}

// Lista de Desejos
export async function getUserWishlist(userId: string) {
  try {
    const db = getDb()
    const q = query(
      collection(db, WISHLIST_COLLECTION), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }))
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return []
  }
}

export async function addToWishlist(userId: string, productId: string, productData: any) {
  try {
    const db = getDb()

    // Verificar se já existe
    const q = query(
      collection(db, WISHLIST_COLLECTION),
      where("userId", "==", userId),
      where("productId", "==", productId)
    )
    const existing = await getDocs(q)

    if (!existing.empty) {
      return null // Já existe
    }

    const docRef = await addDoc(collection(db, WISHLIST_COLLECTION), {
      userId,
      productId,
      ...productData,
      createdAt: new Date()
    })

    return docRef.id
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return null
  }
}

export async function removeFromWishlist(userId: string, productId: string) {
  try {
    const db = getDb()
    const q = query(
      collection(db, WISHLIST_COLLECTION),
      where("userId", "==", userId),
      where("productId", "==", productId)
    )
    const querySnapshot = await getDocs(q)

    for (const doc of querySnapshot.docs) {
      await deleteDoc(doc.ref)
    }

    return true
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return false
  }
}

// Conformidade LGPD
export async function exportUserData(userId: string) {
  try {
    const [profile, addresses, paymentMethods, wishlist] = await Promise.all([
      getUserProfile(userId),
      getUserAddresses(userId),
      getUserPaymentMethods(userId),
      getUserWishlist(userId)
    ])

    return {
      profile,
      addresses,
      paymentMethods: paymentMethods.map(method => ({
        ...method,
        // Remover dados sensíveis na exportação
        cardNumber: undefined,
        cvv: undefined
      })),
      wishlist,
      exportDate: new Date().toISOString(),
      dataController: "Juridico Ecommerce",
      legalBasis: "Consent - LGPD Art. 7, I"
    }
  } catch (error) {
    console.error("Error exporting user data:", error)
    return null
  }
}

export async function deleteUserDataCompletely(userId: string) {
  try {
    const db = getDb()

    // Deletar endereços
    const addressesQuery = query(collection(db, ADDRESSES_COLLECTION), where("userId", "==", userId))
    const addressesSnapshot = await getDocs(addressesQuery)
    for (const doc of addressesSnapshot.docs) {
      await deleteDoc(doc.ref)
    }

    // Deletar métodos de pagamento
    const paymentQuery = query(collection(db, PAYMENT_METHODS_COLLECTION), where("userId", "==", userId))
    const paymentSnapshot = await getDocs(paymentQuery)
    for (const doc of paymentSnapshot.docs) {
      await deleteDoc(doc.ref)
    }

    // Deletar wishlist
    const wishlistQuery = query(collection(db, WISHLIST_COLLECTION), where("userId", "==", userId))
    const wishlistSnapshot = await getDocs(wishlistQuery)
    for (const doc of wishlistSnapshot.docs) {
      await deleteDoc(doc.ref)
    }

    // Deletar perfil do usuário
    await deleteDoc(doc(db, USERS_COLLECTION, userId))

    return true
  } catch (error) {
    console.error("Error deleting user data:", error)
    return false
  }
}