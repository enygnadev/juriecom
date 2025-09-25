
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { useCart } from "@/components/providers/cart-provider"
import { ShoppingCart, Upload, CheckCircle, ArrowRight, FileText, X } from "lucide-react"
import { toast } from "sonner"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { getFirestore, collection, addDoc } from "firebase/firestore"
import { app } from "@/lib/firebase/config"
import { getDocumentsForCartItem } from "@/lib/product-templates"

interface DocumentUpload {
  [productId: string]: {
    [document: string]: {
      file: File | null
      url: string | null
      uploaded: boolean
    }
  }
}

export default function PreVendaPage() {
  const { items: cartItems, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [uploads, setUploads] = useState<DocumentUpload>({})
  const [loading, setLoading] = useState(false)
  const [uploadingDoc, setUploadingDoc] = useState<string>("")

  const storage = getStorage(app)
  const db = getFirestore(app)

  // Função para inicializar os documentos necessários para cada produto
  useEffect(() => {
    const initializeDocuments = () => {
      const newUploads: DocumentUpload = {}
      
      cartItems.forEach(item => {
        const documents = getDocumentsForCartItem(item)
        newUploads[item.id] = {}
        
        documents.forEach(document => {
          newUploads[item.id][document] = {
            file: null,
            url: null,
            uploaded: false
          }
        })
      })
      
      setUploads(newUploads)
    }

    if (cartItems.length > 0) {
      initializeDocuments()
    }
  }, [cartItems])

  const handleFileUpload = async (productId: string, document: string, file: File | null) => {
    if (!file) {
      setUploadingDoc("")
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande. Máximo 5MB permitido.")
      setUploadingDoc("")
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não permitido. Use apenas JPG, PNG, WebP ou PDF.")
      setUploadingDoc("")
      return
    }

    const uploadKey = `${productId}-${document}`
    setUploadingDoc(uploadKey)
    
    try {
      // Criar referência no Firebase Storage
      const fileName = `documents/${productId}/${document}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const storageRef = ref(storage, fileName)
      
      // Upload do arquivo
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      // Atualizar estado local de forma mais robusta
      setUploads(prev => {
        const newUploads = { ...prev }
        if (!newUploads[productId]) {
          newUploads[productId] = {}
        }
        
        newUploads[productId] = {
          ...newUploads[productId],
          [document]: {
            file,
            url: downloadURL,
            uploaded: true
          }
        }
        
        return newUploads
      })
      
      toast.success(`${document} enviado com sucesso!`)
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error("Erro ao enviar documento. Tente novamente.")
      
      // Limpar o arquivo problemático do estado
      setUploads(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          [document]: {
            file: null,
            url: null,
            uploaded: false
          }
        }
      }))
    } finally {
      setUploadingDoc("")
    }
  }

  const removeUpload = (productId: string, document: string) => {
    setUploads(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [document]: {
          file: null,
          url: null,
          uploaded: false
        }
      }
    }))
    toast.info(`${document} removido.`)
  }

  const isProductComplete = (productId: string) => {
    const productUploads = uploads[productId]
    if (!productUploads) return false
    
    const requiredDocuments = getDocumentsForCartItem(cartItems.find(item => item.id === productId) || cartItems[0])
    if (requiredDocuments.length === 0) return false
    
    return requiredDocuments.every(document => productUploads[document]?.uploaded === true)
  }

  const allProductsComplete = cartItems.length > 0 && cartItems.every(item => isProductComplete(item.id))
  
  const getCompletedProductsCount = () => {
    return cartItems.filter(item => isProductComplete(item.id)).length
  }

  const handleContinueToCheckout = async () => {
    if (!allProductsComplete) {
      toast.error("Por favor, envie todos os documentos necessários antes de continuar.")
      return
    }

    setLoading(true)
    
    try {
      // Criar pedido com documentos no Firestore
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          documents: uploads[item.id] ? Object.entries(uploads[item.id]).map(([docName, docData]) => ({
            name: docName,
            url: docData.url,
            uploadedAt: new Date()
          })) : []
        })),
        totalPrice: getTotalPrice(),
        status: 'pending_payment',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const docRef = await addDoc(collection(db, 'orders'), orderData)
      console.log("Pedido criado com ID:", docRef.id)
      
      // Limpar carrinho após criar pedido
      clearCart()
      
      toast.success("Documentos enviados e pedido criado com sucesso!")
      router.push(`/checkout?orderId=${docRef.id}`)
    } catch (error) {
      console.error("Erro ao criar pedido:", error)
      toast.error("Erro ao processar pedido. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const total = getTotalPrice()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Header />
        <main className="container mx-auto px-4 py-12 pt-28">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Carrinho Vazio
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Adicione alguns serviços ao seu carrinho para continuar.
              </p>
              <Button 
                onClick={() => router.push("/products")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Explorar Serviços
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-28 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Confirmar Pedido
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Revise seus serviços selecionados e envie os documentos necessários para cada um
          </p>
        </div>

        {/* Order Summary Card */}
        <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Resumo do Pedido
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {cartItems.length} serviço{cartItems.length !== 1 ? 's' : ''} selecionado{cartItems.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-center lg:text-right">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg">
                  <span className="text-sm opacity-90">Total:</span>
                  <span className="text-2xl font-bold">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {cartItems.map((item) => {
            const requiredDocuments = getDocumentsForCartItem(item)
            const productUploads = uploads[item.id] || {}
            const completedDocs = Object.values(productUploads).filter(doc => doc.uploaded).length
            const progressPercentage = (completedDocs / requiredDocuments.length) * 100
            
            return (
              <Card key={item.id} className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                        {item.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700">
                          {item.category}
                        </Badge>
                        {isProductComplete(item.id) && (
                          <Badge className="text-xs bg-emerald-500 hover:bg-emerald-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completo
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 dark:border-blue-400 dark:text-blue-300">
                          R$ {item.price.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Progresso dos Documentos
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {completedDocs}/{requiredDocuments.length}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Documentos Necessários
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {requiredDocuments.map((document, index) => {
                      const uploadData = productUploads[document]
                      const isUploading = uploadingDoc === `${item.id}-${document}`
                      
                      return (
                        <div key={index} className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                              {document}
                            </Label>
                            {uploadData?.uploaded && (
                              <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* File Preview */}
                          {uploadData?.uploaded && uploadData.url && (
                            <div className="relative mb-3 group">
                              <div className="w-full h-20 bg-slate-200 dark:bg-slate-600 rounded-lg overflow-hidden">
                                {uploadData.file?.type.startsWith('image/') ? (
                                  <img
                                    src={uploadData.url}
                                    alt={document}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-slate-400" />
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => removeUpload(item.id, document)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          
                          {/* Upload Controls */}
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                              onChange={async (e) => {
                                const file = e.target.files?.[0] || null
                                if (file) {
                                  await handleFileUpload(item.id, document, file)
                                }
                                // Limpar o input após o upload
                                e.target.value = ""
                              }}
                              className="text-sm flex-1 h-9 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                              disabled={isUploading}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-3 h-9 border-slate-300 dark:border-slate-600"
                              disabled={isUploading}
                            >
                              {isUploading ? (
                                <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                              ) : uploadData?.uploaded ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Upload className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            Formatos: JPG, PNG, WebP, PDF (máx. 5MB)
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Actions Footer */}
        <div className="sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 p-6 -mx-4 shadow-2xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Progress Overview */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Progresso Geral
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {getCompletedProductsCount()} de {cartItems.length} serviços completos
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${cartItems.length > 0 ? (getCompletedProductsCount() / cartItems.length) * 100 : 0}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-300">
                    Total: R$ {total.toFixed(2)}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {cartItems.length > 0 ? Math.round((getCompletedProductsCount() / cartItems.length) * 100) : 0}% concluído
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:w-auto lg:flex-shrink-0">
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/products")}
                  className="lg:w-auto border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Voltar aos Serviços
                </Button>
                <Button
                  onClick={handleContinueToCheckout}
                  disabled={!allProductsComplete || loading}
                  className="lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                      Processando...
                    </div>
                  ) : (
                    <>
                      Finalizar e Pagar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
