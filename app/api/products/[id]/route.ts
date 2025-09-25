
import { type NextRequest, NextResponse } from "next/server"
import { doc, updateDoc, deleteDoc, getDoc, Timestamp } from "firebase/firestore"
import { getDb } from "@/lib/firebase/firestore"
import { db as adminDb } from "@/lib/firebase/admin"
import type { Product } from "@/lib/types"

// 📋 GET produto específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log("🔍 API: Buscando produto:", id)

    const db = getDb()
    const productRef = doc(db, "products", id)
    const snapshot = await getDoc(productRef)

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    const product = {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate() || new Date(),
      updatedAt: snapshot.data().updatedAt?.toDate() || new Date(),
    } as Product

    return NextResponse.json(product)
  } catch (error) {
    console.error("❌ API: Erro ao buscar produto:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// ✏️ PUT para atualizar produto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log("🔄 API: Atualizando produto:", id)

    const updates = await request.json()
    console.log("📝 API: Dados para atualização:", updates)

    // Usar Firebase Admin SDK para bypass das regras de segurança
    const productRef = adminDb.collection("products").doc(id)
    
    // Filtrar campos undefined
    const cleanUpdates: any = {}
    Object.keys(updates).forEach(key => {
      const value = (updates as any)[key]
      if (value !== undefined) {
        cleanUpdates[key] = value
      }
    })

    const updateData = {
      ...cleanUpdates,
      updatedAt: new Date(), // Admin SDK usa Date normal
    }

    await productRef.update(updateData)
    console.log("✅ API: Produto atualizado com sucesso via Admin SDK:", id)

    return NextResponse.json({ 
      success: true, 
      message: "Produto atualizado com sucesso" 
    })
  } catch (error) {
    console.error("❌ API: Erro ao atualizar produto:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Erro ao atualizar produto",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// 🗑️ DELETE para excluir produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log("🗑️ API: Excluindo produto:", id)

    // Usar Firebase Admin SDK para bypass das regras de segurança
    const productRef = adminDb.collection("products").doc(id)
    await productRef.delete()
    
    console.log("✅ API: Produto excluído com sucesso:", id)

    return NextResponse.json({ 
      success: true, 
      message: "Produto excluído com sucesso" 
    })
  } catch (error) {
    console.error("❌ API: Erro ao excluir produto:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Erro ao excluir produto",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
