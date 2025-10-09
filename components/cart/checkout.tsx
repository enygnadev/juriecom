"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { useCart } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/db"

export function Checkout() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("pix")
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  })

  const handleCheckout = async () => {
    if (!user) {
      router.push("/auth")
      return
    }

    setLoading(true)

    try {
      const orderId = `order_${Date.now()}`

      await db.add("orders", {
        userId: user.uid,
        items,
        total,
        paymentMethod,
        shippingInfo,
        status: "pending",
        createdAt: new Date().toISOString(),
      }, orderId)

      clearCart()
      router.push(`/pedido-confirmado?orderId=${orderId}`)
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Erro ao processar pedido. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Informações de Envio</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={shippingInfo.address}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, address: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={shippingInfo.city}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, city: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={shippingInfo.state}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, state: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="zip">CEP</Label>
            <Input
              id="zip"
              value={shippingInfo.zip}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, zip: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={shippingInfo.phone}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, phone: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Método de Pagamento</h3>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pix" id="pix" />
            <Label htmlFor="pix">PIX</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="boleto" id="boleto" />
            <Label htmlFor="boleto">Boleto</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card">Cartão de Crédito</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">Total:</span>
        <span className="text-2xl font-bold">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(total)}
        </span>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="w-full"
      >
        {loading ? "Processando..." : "Finalizar Pedido"}
      </Button>
    </div>
  )
}