import { useEffect, useRef, useState, type FormEvent } from 'react'
import { fetchAddressByCep, formatCep } from '../utils/viaCep'
import type { CartItem } from '../types/store'
import { formatPrice } from '../utils/currency'
import {
  createStoreCheckout,
  createStorePix,
  getStorePaymentStatus,
  type StorePaymentMethod,
  type StorePixPayment,
} from '../utils/paymentsApi'
import './CheckoutPage.css'

const paymentMethods: Array<{ id: StorePaymentMethod; title: string; description: string }> = [
  { id: 'pix', title: 'Pix', description: 'Pagamento instantâneo' },
  { id: 'card', title: 'Cartão de crédito', description: 'Consulte as condições na próxima etapa' },
  { id: 'boleto', title: 'Boleto bancário', description: 'Pagamento sujeito ao prazo de compensação' },
]

type CheckoutPageProps = {
  items: CartItem[]
  subtotal: number
  shipping: number
  onBackToCart: () => void
}

export function CheckoutPage({
  items,
  subtotal,
  shipping,
  onBackToCart,
}: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<StorePaymentMethod>('pix')
  const [cep, setCep] = useState('')
  const [cepStatus, setCepStatus] = useState<'idle' | 'loading' | 'success' | 'notFound' | 'error'>('idle')
  const [address, setAddress] = useState({ street: '', neighborhood: '', city: '', state: '' })
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [pixPayment, setPixPayment] = useState<StorePixPayment | null>(null)
  const [pixStatus, setPixStatus] = useState('PENDING')
  const [pixCopied, setPixCopied] = useState(false)
  const numberRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!pixPayment || pixStatus === 'APPROVED') return

    const interval = window.setInterval(() => {
      getStorePaymentStatus(pixPayment.paymentId)
        .then(({ status }) => setPixStatus(status))
        .catch(() => undefined)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [pixPayment, pixStatus])

  async function copyPixCode() {
    if (!pixPayment) return
    try {
      await navigator.clipboard.writeText(pixPayment.pixCode)
      setPixCopied(true)
      window.setTimeout(() => setPixCopied(false), 2500)
    } catch {
      setPaymentError('Não foi possível copiar. Selecione o código e copie manualmente.')
    }
  }

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isCreatingPayment) return

    const formData = new FormData(event.currentTarget)
    const payload = {
      items: items.map(({ product, size, quantity }) => ({
        productId: product.id,
        size,
        quantity,
      })),
      customer: {
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        phone: String(formData.get('phone') || ''),
        postalCode: String(formData.get('postalCode') || ''),
        street: String(formData.get('street') || ''),
        streetNumber: String(formData.get('number') || ''),
        neighborhood: String(formData.get('neighborhood') || ''),
        complement: String(formData.get('complement') || ''),
        city: String(formData.get('city') || ''),
        state: String(formData.get('state') || ''),
      },
      paymentMethod,
    }

    setIsCreatingPayment(true)
    setPaymentError('')
    try {
      if (paymentMethod === 'pix') {
        const pix = await createStorePix({
          items: payload.items,
          customer: {
            name: payload.customer.name,
            email: payload.customer.email,
            cpf: String(formData.get('cpf') || ''),
          },
        })
        setPixStatus(pix.status)
        setPixPayment(pix)
        setIsCreatingPayment(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      const checkout = await createStoreCheckout(payload)
      window.location.assign(checkout.paymentUrl)
    } catch (error: unknown) {
      setPaymentError(error instanceof Error ? error.message : 'Não foi possível iniciar o pagamento.')
      setIsCreatingPayment(false)
    }
  }

  if (pixPayment) {
    const approved = pixStatus === 'APPROVED'
    return (
      <main className="purchase-page checkout-page">
        <section className="pix-panel">
          <p className="pix-eyebrow">{approved ? 'PAGAMENTO CONFIRMADO' : 'PAGUE COM PIX'}</p>
          <h1>{approved ? 'Pagamento aprovado!' : 'Escaneie o QR Code'}</h1>
          <strong className="pix-amount">{formatPrice(pixPayment.amount)}</strong>
          {approved ? (
            <p className="pix-help">Recebemos seu Pix. Obrigado pela compra!</p>
          ) : (
            <>
              {pixPayment.pixQrCodeBase64 && (
                <img
                  className="pix-qr"
                  src={`data:image/png;base64,${pixPayment.pixQrCodeBase64}`}
                  alt="QR Code Pix para pagamento"
                />
              )}
              <p className="pix-help">Abra o app do seu banco, escolha Pix e escaneie o código, ou use o Pix copia e cola. O código expira em 30 minutos.</p>
              <textarea className="pix-code" readOnly value={pixPayment.pixCode} rows={3} aria-label="Pix copia e cola" />
              <button type="button" className="purchase-primary-button" onClick={copyPixCode}>
                {pixCopied ? 'Código copiado!' : 'Copiar código Pix'}
              </button>
              <p className="pix-waiting" aria-live="polite">Aguardando pagamento... a tela atualiza sozinha.</p>
            </>
          )}
          {paymentError && <p className="checkout-error" role="alert">{paymentError}</p>}
          <button type="button" className="purchase-back-link" onClick={onBackToCart}>← Voltar à sacola</button>
        </section>
      </main>
    )
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
              {paymentMethod === 'pix' && (
                <label className="checkout-field">
                  CPF (para o Pix)
                  <input name="cpf" inputMode="numeric" autoComplete="off" required minLength={11} maxLength={14} placeholder="000.000.000-00" />
                </label>
              )}
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
              {paymentMethods.map((method) => (
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

          {paymentError && <p className="checkout-error" role="alert">{paymentError}</p>}
          <p className="checkout-payment-notice">
            {paymentMethod === 'pix'
              ? 'Ao continuar, geramos um QR Code Pix aqui mesmo na loja.'
              : 'Você será redirecionado ao ambiente seguro do Mercado Pago para concluir o pagamento. Os dados do cartão não são digitados nem armazenados nesta loja.'}
          </p>
          <div className="checkout-actions">
            <button type="button" className="purchase-back-link" onClick={onBackToCart}>← Voltar à sacola</button>
            <button type="submit" className="purchase-primary-button" disabled={isCreatingPayment}>
              {isCreatingPayment ? 'Preparando pagamento...' : 'Ir para pagamento'} <span aria-hidden="true">→</span>
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
          <p className="safe-checkout-note">Seus dados de contato e entrega serão enviados ao Mercado Pago para iniciar o checkout.</p>
        </aside>
      </div>
    </main>
  )
}

type StorePaymentResultProps = {
  loading: boolean
  status?: string
  paymentId?: string
  error?: string
  onContinueShopping: () => void
}

export function StorePaymentResult({
  loading,
  status,
  paymentId,
  error,
  onContinueShopping,
}: StorePaymentResultProps) {
  const normalizedStatus = status?.toUpperCase()
  const isApproved = normalizedStatus === 'APPROVED' || normalizedStatus === 'AUTHORIZED'
  const isPending = normalizedStatus === 'PENDING' || normalizedStatus === 'IN_PROCESS' || normalizedStatus === 'IN_MEDIATION'
  const title = loading
    ? 'Consultando pagamento'
    : isApproved
      ? 'Pagamento confirmado'
      : isPending
        ? 'Pagamento em processamento'
        : error
          ? 'Não foi possível confirmar o pagamento'
          : 'Pagamento não aprovado'

  const description = loading
    ? 'Aguarde enquanto confirmamos o status diretamente com o Mercado Pago.'
    : isApproved
      ? 'O Mercado Pago confirmou seu pagamento. Guarde o comprovante enviado pelo provedor.'
      : isPending
        ? 'O pagamento ainda está em processamento. Confira novamente em alguns instantes no Mercado Pago.'
        : error || 'O pagamento não foi aprovado. Você pode tentar novamente pela sacola.'

  return (
    <main className="purchase-page">
      <section className="store-payment-result" aria-live="polite">
        <span className={`store-payment-result-icon${isApproved ? ' is-approved' : ''}`} aria-hidden="true">
          {loading ? '…' : isApproved ? '✓' : isPending ? '…' : '!'}
        </span>
        <p>PAGAMENTO MERCADO PAGO</p>
        <h1>{title}</h1>
        <p className="store-payment-result-copy">{description}</p>
        {paymentId && <small className="store-payment-id">Pagamento: {paymentId}</small>}
        <div className="store-payment-result-actions">
          <button type="button" className="purchase-primary-button" onClick={onContinueShopping}>
            Voltar para a loja
          </button>
        </div>
      </section>
    </main>
  )
}
