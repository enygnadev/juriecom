import { type NextRequest, NextResponse } from "next/server"
import { getProducts, addProduct } from "@/lib/firebase/products"
import { db as adminDb } from "@/lib/firebase/admin" // Import adminDb

// 📋 GET todos os produtos
export async function GET(request: NextRequest) {
  try {
    console.log("🚀 API: Iniciando busca de produtos...")

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    console.log("🔍 API: Filtros recebidos:", { category, featured })

    const products = await getProducts()
    console.log("✅ API: Produtos encontrados:", products.length)

    // Filtrar por categoria se especificada
    let filteredProducts = products
    if (category && category !== 'all') {
      filteredProducts = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Filtrar por destaque se especificado
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(product => product.featured)
    }

    console.log("🎯 API: Produtos filtrados:", filteredProducts.length)

    return NextResponse.json(filteredProducts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error("❌ API: Erro ao buscar produtos:", error)

    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor'
    const errorStack = error instanceof Error ? error.stack : undefined

    console.error("❌ API: Stack trace:", errorStack)
    console.error("❌ API: Erro completo:", error)

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: "Verifique os logs para mais informações"
      },
      { status: 500 }
    )
  }
}

// ➕ POST para criar novo produto
export async function POST(request: NextRequest) {
  try {
    console.log("🔐 POST: Verificando autenticação para criação de produto")

    const data = await request.json()
    console.log("📝 POST: Dados recebidos para criação:", data)

    // Usar Firebase Admin SDK para criar produto
    const productsRef = adminDb.collection("products")

    // Filtrar campos undefined
    const cleanData: any = {}
    Object.keys(data).forEach(key => {
      const value = (data as any)[key]
      if (value !== undefined) {
        cleanData[key] = value
      }
    })

    const productData = {
      ...cleanData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await productsRef.add(productData)
    console.log("✅ POST: Produto criado com sucesso via Admin SDK:", docRef.id)

    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      message: "Produto criado com sucesso" 
    })
  } catch (error) {
    console.error("❌ POST: Erro ao criar produto:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Erro ao criar produto",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}