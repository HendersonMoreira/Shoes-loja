export type Category = {
  name: string
  description: string
}

export type Product = {
  id: number
  name: string
  category: string
  price: number
  tag: string
  image: string
  imageAlt: string
  accent: 'gold' | 'black' | 'sand' | 'white'
}

export type BrandName = 'Adidas' | 'New Balance' | 'Nike'

export type CartItem = {
  product: Product
  size: number
  quantity: number
}