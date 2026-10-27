import type { BrandName } from '../types/store'
import './BrandCarousel.css'

const brands: BrandName[] = ['Adidas', 'New Balance', 'Nike']

type BrandCarouselProps = {
  currentBrand: BrandName | null
  onBrandChange: (brand: BrandName) => void
}

export function BrandCarousel({ currentBrand, onBrandChange }: BrandCarouselProps) {
  return (
    <section className="brand-carousel" aria-label="Filtrar produtos por marca">
      <div className="brand-carousel__intro">
        <p className="brand-carousel__title">ESCOLHA SUA MARCA</p>
        <span>Uma seleção para cada estilo.</span>
      </div>
      <div className="brand-stage" role="group" aria-label="Marcas disponíveis">
        {brands.map((brand) => (
          <button
            key={brand}
            type="button"
            className={`brand-option${currentBrand === brand ? ' is-active' : ''}`}
            aria-pressed={currentBrand === brand}
            onClick={() => onBrandChange(brand)}
          >
            {brand}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
    </section>
  )
}
