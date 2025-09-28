
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { addToWishlist, removeFromWishlist } from "@/lib/firebase/users"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  productData: {
    title: string
    price: number
    image?: string
    inStock?: boolean
  }
  isInWishlist?: boolean
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function WishlistButton({ 
  productId, 
  productData, 
  isInWishlist = false,
  className,
  variant = "outline",
  size = "icon"
}: WishlistButtonProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [inWishlist, setInWishlist] = useState(isInWishlist)

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos aos favoritos",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      if (inWishlist) {
        await removeFromWishlist(user.uid, productId)
        setInWishlist(false)
        toast({
          title: "Removido dos favoritos",
          description: "Produto removido da sua lista de desejos"
        })
      } else {
        await addToWishlist(user.uid, productId, {
          ...productData,
          inStock: productData.inStock !== false
        })
        setInWishlist(true)
        toast({
          title: "Adicionado aos favoritos",
          description: "Produto adicionado à sua lista de desejos"
        })
      }
    } catch (error) {
      console.error("Erro ao atualizar lista de desejos:", error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar lista de desejos",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWishlist}
      disabled={loading}
      className={cn(className)}
    >
      <Heart 
        className={cn(
          "w-4 h-4",
          inWishlist && "fill-red-500 text-red-500"
        )} 
      />
      {size !== "icon" && (
        <span className="ml-2">
          {inWishlist ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
        </span>
      )}
    </Button>
  )
}
