import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { Product } from "@/lib/types"

// 📋 GET produto específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log("🔍 API: Buscando produto:", id)

    const product = await db.getProduct(id)

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log("🔄 API: Atualizando produto:", id)

    const updates = await request.json()
    console.log("📝 API: Dados para atualização:", updates)

    const cleanUpdates: any = {}
    Object.keys(updates).forEach(key => {
      const value = (updates as any)[key]
      if (value !== undefined) {
        cleanUpdates[key] = value
      }
    })

    const updateData = {
      ...cleanUpdates,
      updatedAt: new Date().toISOString(),
    }

    await db.updateProduct(id, updateData)
    console.log("✅ API: Produto atualizado com sucesso:", id)

    return NextResponse.json({
      success: true,
      message: "Produto atualizado com sucesso",
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log("🗑️ API: Excluindo produto:", id)

    await db.deleteProduct(id)

    console.log("✅ API: Produto excluído com sucesso:", id)

    return NextResponse.json({
      success: true,
      message: "Produto excluído com sucesso",
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