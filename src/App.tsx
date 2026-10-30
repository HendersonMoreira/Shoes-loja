import { useEffect, useState } from 'react'
import './App.css'
import { BrandCarousel } from './components/BrandCarousel'
import { CatalogPage } from './components/CatalogPage'
import { CategoryStrip } from './components/CategoryStrip'
import { CheckoutPage, StorePaymentResult } from './components/CheckoutPage'
import { FeatureHighlights } from './components/FeatureHighlights'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { ProductGrid } from './components/ProductGrid'
import { ShoppingCart } from './components/ShoppingCart'
import { brandProducts, categories } from './data/storeData'
import type { BrandName, CartItem, Product } from './types/store'
import { getStorePaymentStatus } from './utils/paymentsApi'

type StoreView = 'store' | 'catalog' | 'cart' | 'checkout' | 'payment-result'

function App() {
  const [paymentReturnId] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('payment_id') || params.get('collection_id')
  })
  const [selectedBrand, setSelectedBrand] = useState<BrandName>('Adidas')
  const [searchQuery, setSearchQuery] = useState('')
  const [catalogCategory, setCatalogCategory] = useState('Todas')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [view, setView] = useState<StoreView>(() => paymentReturnId ? 'payment-result' : 'store')
  const [paymentResult, setPaymentResult] = useState<{
    loading: boolean
    status?: string
    paymentId?: string
    error?: string
  }>(() => paymentReturnId ? { loading: true, paymentId: paymentReturnId } : { loading: false })
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal >= 29900 || subtotal === 0 ? 0 : 1990
  const visibleProducts = searchQuery.trim()
    ? Object.values(brandProducts).flat()
    : brandProducts[selectedBrand]

  useEffect(() => {
    if (!paymentReturnId) return

    const controller = new AbortController()

    if (!/^\d{1,20}$/.test(paymentReturnId)) {
      Promise.resolve().then(() => {
        if (controller.signal.aborted) return
        setPaymentResult({
          loading: false,
          paymentId: paymentReturnId,
          error: 'O identificador retornado pelo Mercado Pago é inválido.',
        })
      })
      return () => controller.abort()
    }

    getStorePaymentStatus(paymentReturnId, controller.signal)
      .then(({ status }) => setPaymentResult({ loading: false, status, paymentId: paymentReturnId }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setPaymentResult({
          loading: false,
          paymentId: paymentReturnId,
          error: error instanceof Error ? error.message : 'Erro ao verificar o pagamento.',
        })
      })

    return () => controller.abort()
  }, [paymentReturnId])

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
    window.history.replaceState({}, '', window.location.pathname)
    setView('store')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openCatalog(category = 'Todas') {
    setCatalogCategory(category)
    setView('catalog')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="storefront">
      <Header
        onSearchChange={(query) => {
          setSearchQuery(query)
          setView('catalog')
        }}
        onCartOpen={() => setView('cart')}
        onHomeClick={returnToStore}
        onCatalogClick={() => openCatalog()}
        cartCount={cartCount}
      />
      {view === 'store' && (
        <main>
          <div className="store-layout">
            <CategoryStrip categories={categories} onCategoryClick={openCatalog} />
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
      {view === 'catalog' && (
        <CatalogPage
          products={Object.values(brandProducts).flat()}
          searchQuery={searchQuery}
          initialCategory={catalogCategory}
          onAddToCart={addToCart}
        />
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
      {view === 'payment-result' && (
        <StorePaymentResult
          {...paymentResult}
          onContinueShopping={returnToStore}
        />
      )}
      <Footer onHomeClick={returnToStore} />
    </div>
  )
}

export default App
