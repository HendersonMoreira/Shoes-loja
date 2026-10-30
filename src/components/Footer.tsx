import './Footer.css'

type FooterProps = {
  onHomeClick: () => void
}

export function Footer({ onHomeClick }: FooterProps) {
  return (
    <footer className="site-footer" id="rodape">
      <div className="footer-main">
        <div className="footer-brand">
          <a href="#topo" className="footer-wordmark" aria-label="Tiago Shoes — voltar ao início" onClick={(event) => {
            event.preventDefault()
            onHomeClick()
          }}>
            <span className="footer-symbol" aria-hidden="true">T</span>
            <span>TIAGO <strong>SHOES</strong></span>
          </a>
          <p>Tênis para acompanhar seus passos, do treino aos dias de descanso.</p>
        </div>

        <nav className="footer-column" aria-label="Links da loja">
          <h2>Explore a loja</h2>
          <a href="#destaques">Categorias</a>
          <a href="#produtos">Produtos em destaque</a>
          <a href="#produtos">Marcas</a>
        </nav>

        <nav className="footer-column" aria-label="Informações">
          <h2>Informações</h2>
          <a href="#beneficios">Benefícios da loja</a>
          <a href="/creditos-imagens.html">Créditos das fotos</a>
          <a href="#topo" onClick={(event) => {
            event.preventDefault()
            onHomeClick()
          }}>Voltar ao início</a>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Tiago Shoes</p>
        <span>Feito para acompanhar seu ritmo.</span>
      </div>
    </footer>
  )
}
