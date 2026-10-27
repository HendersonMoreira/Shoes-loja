import { useRef, useState, type FormEvent } from 'react'
import { fetchAddressByCep, formatCep } from '../utils/viaCep'
import type { CartItem } from '../types/store'
import { formatPrice } from '../utils/currency'
import './CheckoutPage.css'

type CheckoutPageProps = {
  items: CartItem[]
  subtotal: number
  shipping: number
  onBackToCart: () => void
  onConfirmDemoOrder: () => void
}

export function CheckoutPage({
  items,
  subtotal,
  shipping,
  onBackToCart,
  onConfirmDemoOrder,
}: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [cep, setCep] = useState('')
  const [cepStatus, setCepStatus] = useState<'idle' | 'loading' | 'success' | 'notFound' | 'error'>('idle')
  const [address, setAddress] = useState({ street: '', neighborhood: '', city: '', state: '' })
  const numberRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  function handleCepChange(value: string) {
    const formatted = formatCep(value)
    setCep(formatted)
    abortRef.current?.abort()

    if (formatted.length < 9) {
      setCepStatus('idle')
      return
    }

    const controller = new AbortController()
    abortRef.current = controller
    setCepStatus('loading')

    fetchAddressByCep(formatted, controller.signal)
      .then((result) => {
        if (!result) {
          setCepStatus('notFound')
          return
        }
        setAddress(result)
        setCepStatus('success')
        numberRef.current?.focus()
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setCepStatus('error')
      })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onConfirmDemoOrder()
  }

  return (
    <main className="purchase-page checkout-page">
      <div className="purchase-heading">
        <p>QUASE LÁ</p>
        <h1>Entrega e pagamento</h1>
        <span>Preencha seus dados e confira o resumo antes de concluir.</span>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span>1</span>
              <div>
                <h2>Seus dados</h2>
                <p>Usaremos essas informações para identificar o pedido.</p>
              </div>
            </div>
            <div className="checkout-fields">
              <label className="checkout-field checkout-field--wide">
                Nome completo
                <input name="name" autoComplete="name" required placeholder="Como podemos te chamar?" />
              </label>
              <label className="checkout-field">
                E-mail
                <input name="email" type="email" autoComplete="email" required placeholder="voce@email.com" />
              </label>
              <label className="checkout-field">
                Celular
                <input name="phone" type="tel" autoComplete="tel" inputMode="tel" required placeholder="(00) 00000-0000" />
              </label>
            </div>
          </section>

          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span>2</span>
              <div>
                <h2>Endereço de entrega</h2>
                <p>Informe onde deseja receber seus tênis.</p>
              </div>
            </div>
            <div className="checkout-fields">
              <label className="checkout-field">
                CEP
                <input
                  name="postalCode"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  required
                  placeholder="00000-000"
                  maxLength={9}
                  value={cep}
                  onChange={(event) => handleCepChange(event.target.value)}
                />
                {cepStatus === 'loading' && <small className="checkout-hint">Buscando endereço...</small>}
                {cepStatus === 'notFound' && <small className="checkout-hint checkout-hint--error">CEP não encontrado. Preencha manualmente.</small>}
                {cepStatus === 'error' && <small className="checkout-hint checkout-hint--error">Não foi possível consultar o CEP. Preencha manualmente.</small>}
                {cepStatus === 'success' && <small className="checkout-hint checkout-hint--ok">Endereço preenchido automaticamente.</small>}
              </label>
              <label className="checkout-field checkout-field--wide">
                Endereço
                <input name="street" autoComplete="street-address" required placeholder="Rua, avenida..." value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              </label>
              <label className="checkout-field">
                Número
                <input ref={numberRef} name="number" required placeholder="Nº" />
              </label>
              <label className="checkout-field">
                Bairro
                <input name="neighborhood" placeholder="Seu bairro" value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} />
              </label>
              <label className="checkout-field">
                Complemento <span>(opcional)</span>
                <input name="complement" autoComplete="address-line2" placeholder="Apto, bloco..." />
              </label>
              <label className="checkout-field">
                Cidade
                <input name="city" autoComplete="address-level2" required placeholder="Sua cidade" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </label>
              <label className="checkout-field">
                Estado
                <select name="state" autoComplete="address-level1" required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}>
                  <option value="" disabled>Selecione</option>
                  {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span>3</span>
              <div>
                <h2>Forma de pagamento</h2>
                <p>Escolha como prefere pagar.</p>
              </div>
            </div>
            <div className="payment-options">
              {[
                { id: 'pix', title: 'Pix', description: 'Pagamento instantâneo' },
                { id: 'card', title: 'Cartão de crédito', description: 'Consulte as condições na próxima etapa' },
                { id: 'boleto', title: 'Boleto bancário', description: 'Pagamento sujeito ao prazo de compensação' },
              ].map((method) => (
                <label key={method.id} className={`payment-option${paymentMethod === method.id ? ' is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                  />
                  <span className="payment-radio" aria-hidden="true" />
                  <span>
                    <strong>{method.title}</strong>
                    <small>{method.description}</small>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <p className="checkout-demo-notice">
            <strong>Checkout demonstrativo:</strong> o site ainda não está conectado a um serviço que envie pedidos ou processe pagamentos. Nenhuma cobrança será feita.
          </p>
          <div className="checkout-actions">
            <button type="button" className="purchase-back-link" onClick={onBackToCart}>← Voltar à sacola</button>
            <button type="submit" className="purchase-primary-button">
              Revisar pedido <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>

        <aside className="order-summary checkout-summary">
          <h2>Seu pedido</h2>
          <div className="checkout-mini-items">
            {items.map(({ product, size, quantity }) => (
              <div className="checkout-mini-item" key={`${product.id}-${size}`}>
                <img src={product.image} alt="" />
                <div>
                  <strong>{product.name}</strong>
                  <span>Tam. {size} · Qtd. {quantity}</span>
                </div>
                <b>{formatPrice(product.price * quantity)}</b>
              </div>
            ))}
          </div>
          <div className="summary-line">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div className="summary-line">
            <span>Entrega</span>
            <strong>{shipping === 0 ? 'Grátis' : formatPrice(shipping)}</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(subtotal + shipping)}</strong>
          </div>
          <p className="safe-checkout-note">Seus dados não são salvos nem enviados por esta demonstração.</p>
        </aside>
      </div>
    </main>
  )
}

type PurchaseConfirmationProps = {
  onContinueShopping: () => void
  onReturnToCart: () => void
}

export function PurchaseConfirmation({ onContinueShopping, onReturnToCart }: PurchaseConfirmationProps) {
  return (
    <main className="purchase-page">
      <section className="demo-confirmation">
        <span className="demo-confirmation-icon" aria-hidden="true">✓</span>
        <p>REVISÃO CONCLUÍDA</p>
        <h1>Seu pedido está pronto para revisão</h1>
        <p className="demo-confirmation-copy">
          Esta é uma demonstração visual do checkout. O pedido não foi enviado à loja e nenhum pagamento foi processado.
          Para vender de verdade, é necessário conectar um sistema de pedidos e um gateway de pagamento.
        </p>
        <div className="demo-confirmation-actions">
          <button type="button" className="purchase-primary-button" onClick={onContinueShopping}>
            Continuar comprando
          </button>
          <button type="button" className="purchase-back-link" onClick={onReturnToCart}>
            Voltar à sacola
          </button>
        </div>
      </section>
    </main>
  )
}
