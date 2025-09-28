
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
    await updateDoc(docRef, { status })
    return true
  } catch (error) {
    console.error("Error updating order status:", error)
    return false
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
        status: data.status,
        total: data.total,
        createdAt: data.createdAt?.toDate?.() || data.createdAt
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
    console.error("❌ Detalhes do erro:", error.message)
    
    // Fallback: buscar todos e filtrar manualmente
    try {
      console.log("🔄 Tentando fallback: buscar todos e filtrar...")
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
