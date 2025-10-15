"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, XCircle, Clock, Package, User, MapPin, CreditCard, Calendar, Phone, Mail, File } from "lucide-react"
import { getDocumentsForCartItem } from "@/lib/product-templates"
import type { Order } from "@/lib/types"

interface OrderDetailsModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (orderId: string, newStatus: string) => Promise<void>
}

export function OrderDetailsModal({ order, isOpen, onClose, onStatusChange }: OrderDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  if (!order) return null

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", color: "bg-yellow-500" },
      processing: { label: "Processando", color: "bg-blue-500" },
      shipped: { label: "Enviado", color: "bg-purple-500" },
      delivered: { label: "Entregue", color: "bg-green-500" },
      cancelled: { label: "Cancelado", color: "bg-red-500" }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await onStatusChange(order.id, newStatus)
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getPaymentMethodLabel = (method?: string) => {
    const methods = {
      pix: "PIX",
      credit_card: "Cartão de Crédito", 
      whatsapp: "WhatsApp"
    }
    return methods[method as keyof typeof methods] || "Não informado"
  }

  const getDocumentStatus = (item: any, documentName: string) => {
    // Buscar o item correspondente ao productId
    const documents = (item as any).documents
    if (documents && Array.isArray(documents)) {
      const doc = documents.find((d: any) => d.name === documentName)
      if (doc && doc.url) {
        return {
          uploaded: true,
          url: doc.url,
          fileName: doc.name,
          uploadedAt: doc.uploadedAt
        }
      }
    }

    // Verificar formato alternativo (objeto com chaves)
    const orderDocuments = (order as any).documents
    if (orderDocuments?.[item.id]?.[documentName]) {
      return {
        uploaded: true,
        url: orderDocuments[item.id][documentName].url,
        fileName: orderDocuments[item.id][documentName].fileName,
        uploadedAt: orderDocuments[item.id][documentName].uploadedAt
      }
    }

    return { uploaded: false }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Pedido #{order.id.slice(-8)}</span>
            {getStatusBadge(order.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID do Pedido</p>
                  <p className="font-mono text-sm">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data do Pedido</p>
                  <p>{order.createdAt.toLocaleDateString()} às {order.createdAt.toLocaleTimeString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status Atual</p>
                  <div className="mt-1">
                    <Select 
                      value={order.status} 
                      onValueChange={handleStatusChange}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="processing">Processando</SelectItem>
                        <SelectItem value="shipped">Enviado</SelectItem>
                        <SelectItem value="delivered">Entregue</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Método de Pagamento</p>
                  <p>{getPaymentMethodLabel(order.paymentMethod)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Cliente */}
          {order.customerInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p>{order.customerInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {order.customerInfo.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      {order.customerInfo.phone || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {order.customerInfo.address || "Não informado"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Itens do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Itens do Pedido ({order.items.length} {order.items.length === 1 ? 'item' : 'itens'})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Itens do Pedido:</h3>
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {order.items.map((item, index) => {
                    const requiredDocuments = getDocumentsForCartItem(item)

                    return (
                      <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex justify-between items-center w-full pr-4">
                            <div className="text-left">
                              <p className="font-medium">{item.title || item.name || 'Item sem nome'}</p>
                              <p className="text-sm text-muted-foreground">
                                Quantidade: {item.quantity || 1} | Valor: R$ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {requiredDocuments.length > 0 ? (
                            <div className="pt-2 pb-4">
                              <h4 className="font-medium mb-3 text-sm">Documentos Necessários:</h4>
                              <div className="space-y-2">
                                {requiredDocuments.map((documentName: string, docIndex: number) => {
                                  const docStatus = getDocumentStatus(item, documentName)

                                  return (
                                    <div key={docIndex} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                      <span className="text-sm">{documentName}</span>
                                      <div className="flex items-center gap-2">
                                        {docStatus.uploaded ? (
                                          <>
                                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                                              <CheckCircle className="w-3 h-3 mr-1" />
                                              Enviado
                                            </Badge>
                                            {docStatus.url && (
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(docStatus.url, '_blank')}
                                                className="h-7 text-xs"
                                              >
                                                Ver arquivo
                                              </Button>
                                            )}
                                          </>
                                        ) : (
                                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Pendente
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              <File className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">Nenhum documento necessário para este item</p>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(() => {
                  const itemsTotal = Array.isArray(order.items) 
                    ? order.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)
                    : 0
                  const calculatedTotal = (order.total && order.total > 0) ? order.total : itemsTotal
                  const subtotal = calculatedTotal - (order.shippingFee || 0)
                  
                  return (
                    <>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                      </div>
                      {order.shippingFee && order.shippingFee > 0 && (
                        <div className="flex justify-between">
                          <span>Frete:</span>
                          <span>R$ {(order.shippingFee || 0).toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>R$ {calculatedTotal.toFixed(2)}</span>
                      </div>
                    </>
                  )
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}