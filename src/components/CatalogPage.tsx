import { useState } from 'react'
import type { BrandName, Product } from '../types/store'
import { ProductGrid } from './ProductGrid'
import './CatalogPage.css'

type CatalogPageProps = {
  products: Product[]
  searchQuery: string
  initialCategory: string
  onAddToCart: (product: Product, size: number) => void
}

type BrandFilter = 'Todas' | BrandName
type PriceOrder = 'recommended' | 'price-ascending' | 'price-descending'

export function CatalogPage({
  products,
  searchQuery,
  initialCategory,
  onAddToCart,
}: CatalogPageProps) {
  const [category, setCategory] = useState(initialCategory)
  const [brand, setBrand] = useState<BrandFilter>('Todas')
  const [priceOrder, setPriceOrder] = useState<PriceOrder>('recommended')
  const categories = [...new Set(products.map((product) => product.category))].sort()

  const filteredProducts = products.filter((product) => {
    const productBrand = product.name.startsWith('Adidas')
      ? 'Adidas'
      : product.name.startsWith('Nike')
        ? 'Nike'
        : product.name.startsWith('New Balance')
          ? 'New Balance'
          : ''
    return (category === 'Todas' || product.category === category)
      && (brand === 'Todas' || productBrand === brand)
  })

  if (priceOrder === 'price-ascending') filteredProducts.sort((a, b) => a.price - b.price)
  if (priceOrder === 'price-descending') filteredProducts.sort((a, b) => b.price - a.price)
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('pt-BR')
  const resultCount = filteredProducts.filter((product) =>
    `${product.name} ${product.category} ${product.tag}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery),
  ).length

  function clearFilters() {
    setCategory('Todas')
    setBrand('Todas')
    setPriceOrder('recommended')
  }

  return (
    <main className="purchase-page catalog-page">
      <div className="purchase-heading">
        <p>TIAGO SHOES</p>
        <h1>Catálogo de tênis</h1>
        <span>Explore todos os modelos disponíveis e filtre para encontrar o seu.</span>
      </div>

      <div className="catalog-layout">
        <aside className="catalog-filters" aria-label="Filtros do catálogo">
          <div className="catalog-filter-heading">
            <span aria-hidden="true">☷</span>
            <div>
              <p>ENCONTRE O SEU</p>
              <h2>Filtros</h2>
            </div>
          </div>

          <label className="catalog-filter-group">
            <span>Tipo de calçado</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="Todas">Todos os tipos</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <fieldset className="catalog-filter-group catalog-brand-options">
            <legend>Marca</legend>
            {(['Todas', 'Adidas', 'New Balance', 'Nike'] as BrandFilter[]).map((item) => (
              <label key={item} className={brand === item ? 'is-selected' : ''}>
                <input
                  type="radio"
                  name="catalog-brand"
                  value={item}
                  checked={brand === item}
                  onChange={() => setBrand(item)}
                />
                <span>{item === 'Todas' ? 'Todas as marcas' : item}</span>
              </label>
            ))}
          </fieldset>

          <label className="catalog-filter-group">
            <span>Ordenar por preço</span>
            <select value={priceOrder} onChange={(event) => setPriceOrder(event.target.value as PriceOrder)}>
              <option value="recommended">Recomendados</option>
              <option value="price-ascending">Menor preço</option>
              <option value="price-descending">Maior preço</option>
            </select>
          </label>

          <button type="button" className="catalog-clear-filters" onClick={clearFilters}>
            Limpar filtros
          </button>
        </aside>

        <div className="catalog-results">
          <p className="catalog-result-count" role="status">
            {resultCount} {resultCount === 1 ? 'modelo encontrado' : 'modelos encontrados'}
          </p>
          <ProductGrid
            products={filteredProducts}
            searchQuery={searchQuery}
            onAddToCart={onAddToCart}
            eyebrow="Encontre seu próximo par"
            title="Todos os modelos"
          />
          {products.length < 20 && (
            <p className="catalog-inventory-note">
              Este catálogo mostra todos os modelos cadastrados na loja no momento.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
