import type { CartItem } from '../types/store'
import { formatPrice } from '../utils/currency'
import './ShoppingCart.css'

type ShoppingCartProps = {
  items: CartItem[]
  subtotal: number
  shipping: number
  onQuantityChange: (productId: number, size: number, quantity: number) => void
  onRemove: (productId: number, size: number) => void
  onContinueShopping: () => void
  onCheckout: () => void
}

export function ShoppingCart({
  items,
  subtotal,
  shipping,
  onQuantityChange,
  onRemove,
  onContinueShopping,
  onCheckout,
}: ShoppingCartProps) {
  return (
    <main className="purchase-page">
      <div className="purchase-heading">
        <p>SUA SELEÇÃO</p>
        <h1>Sacola de compras</h1>
        <span>Confira os modelos e tamanhos antes de continuar.</span>
      </div>

      {items.length === 0 ? (
        <section className="empty-cart">
          <span aria-hidden="true">▢</span>
          <h2>Sua sacola está esperando por você</h2>
          <p>Encontre seu próximo par na nossa seleção de tênis.</p>
          <button type="button" className="purchase-primary-button" onClick={onContinueShopping}>
            Explorar modelos
          </button>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Produtos na sacola">
            {items.map(({ product, size, quantity }) => (
              <article className="cart-item" key={`${product.id}-${size}`}>
                <div className="cart-item-photo">
                  <img src={product.image} alt={product.imageAlt} />
                </div>
                <div className="cart-item-details">
                  <span>{product.category} · {product.tag}</span>
                  <h2>{product.name}</h2>
                  <p>Tamanho: <strong>{size}</strong></p>
                  <div className="cart-item-controls">
                    <label>
                      <span className="visually-hidden">Quantidade de {product.name}, tamanho {size}</span>
                      <select
                        value={quantity}
                        onChange={(event) => onQuantityChange(product.id, size, Number(event.target.value))}
                      >
                        {[1, 2, 3, 4, 5].map((amount) => (
                          <option key={amount} value={amount}>{amount}</option>
                        ))}
                      </select>
                    </label>
                    <button type="button" onClick={() => onRemove(product.id, size)}>
                      Remover
                    </button>
                  </div>
                </div>
                <strong className="cart-item-price">{formatPrice(product.price * quantity)}</strong>
              </article>
            ))}
            <button type="button" className="purchase-back-link" onClick={onContinueShopping}>
              ← Continuar comprando
            </button>
          </section>

          <aside className="order-summary">
            <h2>Resumo do pedido</h2>
            <div className="summary-line">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="summary-line">
              <span>Entrega</span>
              <strong>{shipping === 0 ? 'Grátis' : formatPrice(shipping)}</strong>
            </div>
            <p className="shipping-note">
              {shipping === 0
                ? 'Você ganhou frete grátis!'
                : `Frete grátis em compras acima de ${formatPrice(29900)}.`}
            </p>
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPrice(subtotal + shipping)}</strong>
            </div>
            <button type="button" className="purchase-primary-button" onClick={onCheckout}>
              Ir para entrega e pagamento <span aria-hidden="true">→</span>
            </button>
            <div className="safe-checkout-note">
              <span aria-hidden="true">✓</span>
              Você confere todos os dados antes de concluir.
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}
