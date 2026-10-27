import { useState } from 'react'
import './App.css'
import { BrandCarousel } from './components/BrandCarousel'
import { CategoryStrip } from './components/CategoryStrip'
import { CheckoutPage, PurchaseConfirmation } from './components/CheckoutPage'
import { FeatureHighlights } from './components/FeatureHighlights'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { ProductGrid } from './components/ProductGrid'
import { ShoppingCart } from './components/ShoppingCart'
import { brandProducts, categories } from './data/storeData'
import type { BrandName, CartItem, Product } from './types/store'

type StoreView = 'store' | 'cart' | 'checkout' | 'confirmation'

function App() {
  const [selectedBrand, setSelectedBrand] = useState<BrandName>('Adidas')
  const [searchQuery, setSearchQuery] = useState('')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [view, setView] = useState<StoreView>('store')
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal >= 29900 || subtotal === 0 ? 0 : 1990
  const visibleProducts = searchQuery.trim()
    ? Object.values(brandProducts).flat()
    : brandProducts[selectedBrand]

  function addToCart(product: Product, size: number) {
    setCartItems((currentItems) => {
      const existing = currentItems.find((item) => item.product.id === product.id && item.size === size)
      if (existing) {
        return currentItems.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: Math.min(item.quantity + 1, 5) }
            : item,
        )
      }

      return [...currentItems, { product, size, quantity: 1 }]
    })
    setView('cart')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateCartQuantity(productId: number, size: number, quantity: number) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId && item.size === size ? { ...item, quantity } : item,
      ),
    )
  }

  function removeCartItem(productId: number, size: number) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId || item.size !== size),
    )
  }

  function returnToStore() {
    setView('store')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="storefront">
      <Header
        onSearchChange={setSearchQuery}
        onCartOpen={() => setView('cart')}
        cartCount={cartCount}
      />
      {view === 'store' && (
        <main>
          <div className="store-layout">
            <CategoryStrip categories={categories} />
            <div className="store-content">
              <HeroSection />
              <FeatureHighlights />
              <BrandCarousel
                currentBrand={searchQuery.trim() ? null : selectedBrand}
                onBrandChange={(brand) => {
                  setSelectedBrand(brand)
                  setSearchQuery('')
                }}
              />
              <ProductGrid products={visibleProducts} searchQuery={searchQuery} onAddToCart={addToCart} />
            </div>
          </div>
        </main>
      )}
      {view === 'cart' && (
        <ShoppingCart
          items={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          onQuantityChange={updateCartQuantity}
          onRemove={removeCartItem}
          onContinueShopping={returnToStore}
          onCheckout={() => setView('checkout')}
        />
      )}
      {view === 'checkout' && cartItems.length > 0 && (
        <CheckoutPage
          items={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          onBackToCart={() => setView('cart')}
          onConfirmDemoOrder={() => setView('confirmation')}
        />
      )}
      {view === 'checkout' && cartItems.length === 0 && (
        <ShoppingCart
          items={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          onQuantityChange={updateCartQuantity}
          onRemove={removeCartItem}
          onContinueShopping={returnToStore}
          onCheckout={() => setView('checkout')}
        />
      )}
      {view === 'confirmation' && (
        <PurchaseConfirmation onContinueShopping={returnToStore} onReturnToCart={() => setView('cart')} />
      )}
      <Footer />
    </div>
  )
}

export default App
