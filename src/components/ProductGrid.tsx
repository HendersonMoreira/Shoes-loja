import { useState } from 'react'
import type { Product } from '../types/store'
import { formatPrice } from '../utils/currency'
import './ProductGrid.css'

type ProductGridProps = {
  products: Product[]
  searchQuery: string
  onAddToCart: (product: Product, size: number) => void
}

const accentClassMap: Record<Product['accent'], string> = {
  gold: 'accent-gold',
  black: 'accent-black',
  sand: 'accent-sand',
  white: 'accent-white',
}

export function ProductGrid({ products, searchQuery, onAddToCart }: ProductGridProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<number, number>>({})
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('pt-BR')
  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category} ${product.tag}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery),
  )

  return (
    <section className="product-section" id="produtos">
      <div className="section-heading">
        <div>
          <p>Escolhas da semana</p>
          <h2>Modelos em destaque</h2>
        </div>
        <span className="product-count">{filteredProducts.length} modelos</span>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product, index) => (
            <article key={product.id} className="product-card">
              <div className={`product-art ${accentClassMap[product.accent]}`}>
                <span className="product-index">0{index + 1}</span>
                <span className="product-tag">{product.tag}</span>
                <img className="product-photo" src={product.image} alt={product.imageAlt} loading="lazy" />
              </div>

              <div className="product-info">
                <span>{product.category}</span>
                <strong>{product.name}</strong>
                <div className="product-footer">
                  <b>{formatPrice(product.price)}</b>
                  <label className="size-picker">
                    <span>Tamanho</span>
                    <select
                      value={selectedSizes[product.id] ?? ''}
                      aria-label={`Escolha o tamanho para ${product.name}`}
                      onChange={(event) => {
                        const size = Number(event.target.value)
                        setSelectedSizes((current) => ({ ...current, [product.id]: size }))
                      }}
                    >
                      <option value="" disabled>Selecione</option>
                      {[34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44].map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  type="button"
                  className="add-to-cart-button"
                  disabled={!selectedSizes[product.id]}
                  onClick={() => onAddToCart(product, selectedSizes[product.id])}
                >
                  Adicionar à sacola <span aria-hidden="true">+</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-products" role="status">
          Não encontramos modelos para “{searchQuery}”. Tente buscar por outra palavra.
        </p>
      )}
    </section>
  )
}