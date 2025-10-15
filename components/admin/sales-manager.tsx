
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Package, CheckCircle } from "lucide-react"
import { getOrders } from "@/lib/firebase/orders"
import type { Order } from "@/lib/types"

export function SalesManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const ordersData = await getOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDeliveredOrders = () => {
    return orders.filter(order => order.status === 'delivered' || order.status === 'finalizado')
  }

  const getTotalRevenue = () => {
    return getDeliveredOrders().reduce((total, order) => {
      const orderTotal = order.total || (order as any).totalPrice || 0
      console.log('📊 Calculando receita - Pedido:', order.id, 'Total:', orderTotal)
      return total + orderTotal
    }, 0)
  }

  const getPendingRevenue = () => {
    return orders
      .filter(order => ['pending', 'processing', 'shipped'].includes(order.status))
      .reduce((total, order) => {
        const orderTotal = order.total || (order as any).totalPrice || 0
        return total + orderTotal
      }, 0)
  }

  const getTotalOrders = () => {
    return orders.length
  }

  const getDeliveredCount = () => {
    return getDeliveredOrders().length
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", color: "bg-yellow-500" },
      processing: { label: "Processando", color: "bg-blue-500" },
      shipped: { label: "Enviado", color: "bg-purple-500" },
      delivered: { label: "Entregue", color: "bg-green-500" },
      finalizado: { label: "Finalizado", color: "bg-emerald-600" },
      cancelled: { label: "Cancelado", color: "bg-red-500" }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>
  }

  if (loading) {
    return <div>Carregando vendas...</div>
  }

  const deliveredOrders = getDeliveredOrders()
  const totalRevenue = getTotalRevenue()
  const pendingRevenue = getPendingRevenue()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestão de Vendas</h2>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Apenas pedidos entregues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Pendente</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pedidos em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Entregues</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getDeliveredCount()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              De {getTotalOrders()} pedidos totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {getDeliveredCount() > 0 
                ? (totalRevenue / getDeliveredCount()).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '0,00'
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Por pedido entregue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Vendas Concluídas */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Concluídas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deliveredOrders.length > 0 ? (
              deliveredOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Pedido #{order.id.slice(-8)}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cliente: {order.customerInfo?.name || "Não identificado"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Data: {order.createdAt ? order.createdAt.toLocaleDateString('pt-BR') : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      R$ {((order.total || (order as any).totalPrice || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Array.isArray(order.items) ? order.items.length : 0} {Array.isArray(order.items) && order.items.length === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma venda concluída ainda.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
