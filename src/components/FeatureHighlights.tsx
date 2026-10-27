import './FeatureHighlights.css'

const highlights = [
  {
    icon: '↗',
    title: 'Entrega ágil',
    text: 'Acompanhe seu pedido em cada etapa.',
  },
  {
    icon: '✓',
    title: 'Marcas selecionadas',
    text: 'Opções para diferentes estilos e rotinas.',
  },
  {
    icon: '◇',
    title: 'Compra facilitada',
    text: 'Escolha seu modelo com praticidade.',
  },
]

export function FeatureHighlights() {
  return (
    <section className="feature-section" id="beneficios" aria-label="Benefícios da loja">
      <div className="feature-grid">
        {highlights.map((item) => (
          <article key={item.title} className="feature-card">
            <span className="feature-icon" aria-hidden="true">{item.icon}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
      <a className="image-credits" href="/creditos-imagens.html">
        Créditos e licenças das fotos
      </a>
    </section>
  )
}