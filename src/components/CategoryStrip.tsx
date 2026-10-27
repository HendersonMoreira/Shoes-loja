import type { Category } from '../types/store'
import './CategoryStrip.css'

type CategoryStripProps = {
  categories: Category[]
}

export function CategoryStrip({ categories }: CategoryStripProps) {
  return (
    <aside className="category-strip" id="destaques">
      <div className="category-sidebar-heading">
        <span>Encontre o seu</span>
        <h2>Compre por categoria</h2>
      </div>
      <nav className="category-list" aria-label="Categorias de produtos">
        {categories.map((category) => (
          <a key={category.name} className="category-link" href="#produtos">
            <span>
              <strong>{category.name}</strong>
              <small>{category.description}</small>
            </span>
            <span className="category-arrow" aria-hidden="true">›</span>
          </a>
        ))}
      </nav>
      <a className="category-help" href="#beneficios">
        Precisa de ajuda?
        <span>Fale com a nossa equipe →</span>
      </a>
    </aside>
  )
}