import './AboutPage.css'

type AboutPageProps = {
  onBack: () => void
  onHelpClick: () => void
}

export function AboutPage({ onBack, onHelpClick }: AboutPageProps) {
  return (
    <main className="purchase-page about-page">
      <button type="button" className="purchase-back-link" onClick={onBack}>
        ← Voltar
      </button>

      <header className="about-heading">
        <p>CONHEÇA A LOJA</p>
        <h1>Sobre a Tiago Shoes</h1>
        <span>
          Uma loja online de tênis para acompanhar você no treino, na rua e no dia a dia.
        </span>
      </header>

      <section className="about-intro-card">
        <span className="about-mark" aria-hidden="true">T</span>
        <div>
          <h2>Seu próximo passo começa aqui</h2>
          <p>
            Na Tiago Shoes você encontra modelos esportivos e casuais de marcas como Adidas,
            Nike e New Balance. Confira o catálogo, escolha o tamanho e veja o total do pedido
            antes de seguir para o pagamento.
          </p>
        </div>
      </section>

      <div className="about-content-grid">
        <section className="about-section">
          <span className="about-section-number">01</span>
          <h2>Como comprar</h2>
          <ol>
            <li>Escolha um modelo no catálogo e selecione o tamanho.</li>
            <li>Adicione o produto à sacola e confira os itens e o valor da entrega.</li>
            <li>Preencha os dados de entrega e escolha a forma de pagamento.</li>
            <li>Finalize o pagamento no ambiente seguro do Mercado Pago ou use o Pix apresentado na loja.</li>
          </ol>
        </section>

        <section className="about-section">
          <span className="about-section-number">02</span>
          <h2>Trocas e devoluções</h2>
          <p>
            Teve um problema com o tamanho, o produto ou a compra? Abra a página de ajuda e
            informe o assunto, o e-mail usado no pedido e o que aconteceu. O atendimento vai
            orientar os próximos passos.
          </p>
          <p>
            Para uma troca por preferência ou tamanho, o produto precisa ser devolvido e
            recebido para conferência antes do envio do novo par. Essa regra de troca não
            limita os direitos previstos em lei.
          </p>
          <button type="button" className="about-help-button" onClick={onHelpClick}>
            Falar com o atendimento <span aria-hidden="true">→</span>
          </button>
        </section>

        <section className="about-section about-section--wide">
          <span className="about-section-number">03</span>
          <h2>Direito de arrependimento em compras online</h2>
          <p>
            Nas compras feitas fora de uma loja física, o Código de Defesa do Consumidor
            prevê o direito de desistir em até 7 dias, contados da assinatura ou do recebimento
            do produto, conforme o caso. Para exercer esse direito, envie a solicitação pela
            página de ajuda dentro do prazo; o atendimento orientará a devolução e o estorno
            conforme a legislação.
          </p>
          <p className="about-policy-note">
            Por isso, não podemos estabelecer uma regra geral dizendo que todo reembolso só
            será solicitado depois que o produto chegar de volta. O processo de troca por
            preferência pode aguardar o recebimento do item, mas o direito legal de
            arrependimento deve ser respeitado.
          </p>
          <a
            className="about-law-link"
            href="https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"
            target="_blank"
            rel="noreferrer"
          >
            Consulte o art. 49 do Código de Defesa do Consumidor
          </a>
        </section>
      </div>
    </main>
  )
}
