import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
  deleteDoc, // Imported deleteDoc
  Timestamp, // Added Timestamp for updateOrderStatus
} from "firebase/firestore"
import { getDb } from "./firestore"
import type { Order } from "@/lib/types"

const ORDERS_COLLECTION = "orders"

export async function getOrders(): Promise<Order[]> {
  try {
    const db = getDb()
    const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Order[]
  } catch (error) {
    console.error("Error getting orders:", error)
    return []
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const db = getDb()
    const docRef = doc(db, ORDERS_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date()
      } as Order
    }

    return null
  } catch (error) {
    console.error("Error getting order:", error)
    return null
  }
}

export async function createOrder(order: Omit<Order, "id">): Promise<string | null> {
  try {
    console.log("🆕 Criando pedido:", {
      userId: order.userId,
      items: order.items?.length,
      total: order.total
    })

    const db = getDb()
    const orderData = {
      ...order,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log("📝 Dados do pedido a ser salvo:", orderData)

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData)

    console.log("✅ Pedido criado com ID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("❌ Erro ao criar pedido:", error)
    return null
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  try {
    const db = getDb()
    const docRef = doc(db, ORDERS_COLLECTION, orderId)
    await updateDoc(docRef, { status, updatedAt: Timestamp.now() }) // Added Timestamp.now()
    return true
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

// Added deleteOrder function
export async function deleteOrder(orderId: string) {
  try {
    const db = getDb()
    await deleteDoc(doc(db, ORDERS_COLLECTION, orderId))
  } catch (error) {
    console.error("Error deleting order:", error)
    throw error
  }
}


export async function getOrdersByUser(userId: string): Promise<Order[]> {
  try {
    console.log("🔍 Buscando pedidos para usuário:", userId)
    const db = getDb()

    // Primeiro, vamos buscar todos os pedidos para debug
    const allOrdersQuery = query(collection(db, ORDERS_COLLECTION))
    const allOrdersSnapshot = await getDocs(allOrdersQuery)
    console.log("📦 Total de pedidos no banco:", allOrdersSnapshot.size)

    // Log de TODOS os pedidos para verificar estrutura
    allOrdersSnapshot.docs.forEach(doc => {
      const data = doc.data()
      console.log("📝 Pedido completo:", {
        id: doc.id,
        userId: data.userId,
        userEmail: data.userEmail,
        status: data.status,
        total: data.total,
        totalPrice: data.totalPrice,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        allFields: Object.keys(data)
      })
    })

    // Tentativa sem orderBy para evitar erro de índice
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("userId", "==", userId)
    )
    const querySnapshot = await getDocs(q)

    console.log("🎯 Pedidos encontrados para o usuário:", querySnapshot.size)

    const orders = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt) || new Date()
      }
    }) as Order[]

    // Ordenar no cliente se necessário
    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    console.log("✅ Pedidos processados e ordenados:", orders.length)
    return orders
  } catch (error) {
    console.error("❌ Erro ao buscar pedidos do usuário:", error)
    console.error("❌ Detalhes do erro:", error instanceof Error ? error.message : String(error))
    console.error("❌ Stack trace:", error instanceof Error ? error.stack : "No stack trace")
    console.error("❌ Erro completo:", error)

    try {
      const db = getDb()
      const allOrdersQuery = query(collection(db, ORDERS_COLLECTION))
      const snapshot = await getDocs(allOrdersQuery)
      console.log("📊 Total de pedidos no banco:", snapshot.size)
    } catch (fallbackError) {
      console.error("❌ Erro ao verificar coleção:", fallbackError)
    }

    // Fallback: buscar todos e filtrar manualmente
    try {
      console.log("🔄 Tentando fallback: buscar todos e filtrar...")
      const db = getDb()
      const allOrdersQuery = query(collection(db, ORDERS_COLLECTION))
      const allOrdersSnapshot = await getDocs(allOrdersQuery)

      const userOrders = allOrdersSnapshot.docs
        .filter(doc => {
          const data = doc.data()
          return data.userId === userId
        })
        .map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt) || new Date()
          }
        }) as Order[]

      console.log("✅ Fallback: pedidos encontrados:", userOrders.length)
      return userOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } catch (fallbackError) {
      console.error("❌ Erro no fallback também:", fallbackError)
      return []
    }
  }
}