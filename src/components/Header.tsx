import './Header.css'

type HeaderProps = {
  onSearchChange: (query: string) => void
  onCartOpen: () => void
  cartCount: number
}

export function Header({ onSearchChange, onCartOpen, cartCount }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="utility-bar">
        <p>Frete grátis nas compras acima de R$ 299</p>
        <div className="utility-links">
          <a href="#beneficios">Atendimento ao cliente</a>
          <a href="#produtos">Novidades</a>
        </div>
      </div>

      <div className="main-bar">
        <a href="#topo" className="brand-mark" aria-label="Tiago Shoes — início">
          <span className="brand-symbol" aria-hidden="true">T</span>
          <span className="brand-wordmark">TIAGO<span>SHOES</span></span>
        </a>

        <label className="search-box" aria-label="Buscar produtos">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Busque seu próximo tênis"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <div className="header-actions">
          <a href="#beneficios" className="account-link">Minha conta</a>
          <button type="button" className="cart-button" onClick={onCartOpen} aria-label={`Abrir sacola, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}>
            <span className="cart-icon" aria-hidden="true">▢</span>
            <span className="cart-count" aria-hidden="true">{cartCount}</span>
            <span className="cart-copy">Minha sacola<small>{cartCount ? `${cartCount} ${cartCount === 1 ? 'item' : 'itens'}` : 'Ver produtos'}</small></span>
          </button>
        </div>
      </div>

      <nav className="primary-nav" aria-label="Navegação principal">
        <div className="primary-nav__inner">
          <a href="#topo">Início</a>
          <a href="#destaques">Categorias</a>
          <a href="#produtos">Lançamentos</a>
          <a href="#produtos">Ofertas</a>
          <a href="#beneficios">Sobre a Tiago Shoes</a>
        </div>
      </nav>
    </header>
  )
}