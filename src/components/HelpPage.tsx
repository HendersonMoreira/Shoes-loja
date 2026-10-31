import { useState, type FormEvent } from 'react'
import { sendSupportMessage } from '../utils/paymentsApi'
import './HelpPage.css'

const subjects = [
  'Problema com pagamento',
  'Dúvida sobre pedido',
  'Entrega',
  'Produto ou tamanho',
  'Troca ou devolução',
  'Outro assunto',
]

type HelpPageProps = {
  onBack: () => void
}

export function HelpPage({ onBack }: HelpPageProps) {
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSending) return

    const form = event.currentTarget
    const formData = new FormData(form)
    setIsSending(true)
    setError('')

    try {
      await sendSupportMessage({
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        subject: String(formData.get('subject') || ''),
        message: String(formData.get('message') || ''),
        website: String(formData.get('website') || ''),
      })
      form.reset()
      setSent(true)
    } catch (requestError: unknown) {
      setError(requestError instanceof Error
        ? requestError.message
        : 'Não foi possível enviar sua mensagem. Tente novamente.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="purchase-page help-page">
      <button type="button" className="purchase-back-link" onClick={onBack}>
        ← Voltar
      </button>

      <div className="purchase-heading">
        <p>ATENDIMENTO TIAGO SHOES</p>
        <h1>Como podemos ajudar?</h1>
        <span>Conte o que aconteceu. Nossa equipe receberá sua mensagem por e-mail.</span>
      </div>

      <div className="help-page-layout">
        <section className="help-form-card">
          {sent ? (
            <div className="help-success" role="status">
              <span aria-hidden="true">✓</span>
              <h2>Mensagem enviada</h2>
              <p>Recebemos seu contato. Se precisar, você pode enviar outra mensagem.</p>
              <button type="button" className="purchase-primary-button" onClick={() => setSent(false)}>
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form className="help-form" onSubmit={handleSubmit}>
              <h2>Fale com a gente</h2>
              <p>Preencha seus dados e explique como podemos ajudar.</p>

              <label className="help-field">
                Seu nome
                <input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Como podemos te chamar?" />
              </label>

              <label className="help-field">
                Seu e-mail
                <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="voce@email.com" />
              </label>

              <label className="help-field">
                Assunto
                <select name="subject" required defaultValue="">
                  <option value="" disabled>Selecione o assunto</option>
                  {subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                </select>
              </label>

              <label className="help-field">
                Mensagem
                <textarea
                  name="message"
                  required
                  minLength={10}
                  maxLength={4000}
                  rows={6}
                  placeholder="Descreva o problema e, se possível, diga em qual etapa aconteceu."
                />
              </label>

              <label className="help-website-field" aria-hidden="true">
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>

              {error && <p className="help-form-error" role="alert">{error}</p>}

              <p className="help-privacy-note">
                Seus dados serão usados somente para responder a esta solicitação.
              </p>
              <button type="submit" className="purchase-primary-button" disabled={isSending}>
                {isSending ? 'Enviando mensagem...' : 'Enviar mensagem'}
                {!isSending && <span aria-hidden="true">→</span>}
              </button>
            </form>
          )}
        </section>

        <aside className="help-contact-card">
          <span className="help-contact-icon" aria-hidden="true">?</span>
          <h2>O que acontece depois?</h2>
          <p>
            Sua mensagem será encaminhada ao atendimento da Tiago Shoes. Responderemos no e-mail informado no formulário.
          </p>
          <ul>
            <li>Escolha o assunto que mais combina com o problema.</li>
            <li>Não envie senhas nem dados completos do cartão.</li>
            <li>Se o problema for um pagamento, informe apenas a data e o método usado.</li>
          </ul>
        </aside>
      </div>
    </main>
  )
}
