import shoeCollectionImage from '../assets/Ultraboost_Grafite_e_Rosa juntos.png'
import './HeroSection.css'

export function HeroSection() {
  return (
    <section className="hero-section" id="topo">
      <div className="hero-copy">
        <p className="hero-eyebrow"><span /> ESCOLHAS PARA IR MAIS LONGE</p>
        <h1>Movimento<br />com atitude.</h1>
        <p className="hero-description">
          Descubra modelos que combinam conforto, estilo e a energia do seu dia.
        </p>
        <a href="#produtos" className="hero-cta">
          Ver modelos em destaque <span aria-hidden="true">→</span>
        </a>
      </div>
      <div className="hero-visual">
        <div className="hero-image-wrap">
          <img src={shoeCollectionImage} alt="Tênis esportivos em diferentes estilos" />
        </div>
        <div className="hero-caption">
          <span>DA RUA AO TREINO</span>
          <strong>Um novo passo, todo dia.</strong>
        </div>
      </div>
    </section>
  )
}