import { Suspense } from "react"
import { ProductGrid } from "@/components/products/product-grid"
import { SearchBar } from "@/components/search/search-bar"
import { Header } from "@/components/layout/header"
import { Cart } from "@/components/cart/cart"
import { ChatBot } from "@/components/chat/chat-bot"
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton"
import { HeroSection } from "@/components/products/hero-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <HeroSection />
      </div>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Nossos Serviços Jurídicos</h2>
          <p className="text-gray-600 mb-6">
            Encontre o serviço jurídico ideal para suas necessidades. Especialistas em diversas áreas do direito.
          </p>
          <SearchBar />
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </main>

      <Cart />
      <ChatBot />
    </div>
  )
}