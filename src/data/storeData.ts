import type { BrandName, Category, Product } from '../types/store'
import adidasBostonImage from '../assets/products/adidas-boston.jpeg'
import adidasUltraboostImage from '../assets/products/adidas-ultraboost.jpeg'
import newBalance1906rImage from '../assets/products/new-balance-1906r.jpg'
import newBalance574Image from '../assets/products/new-balance-574.jpg'
import nikeCortezImage from '../assets/products/nike-cortez.jpg'
import nikeTerminatorImage from '../assets/products/nike-terminator.jpg'

export const categories: Category[] = [
  { name: 'Corrida', description: 'Modelos leves para treinos e rua' },
  { name: 'Casual', description: 'Modelos confortáveis para usar todo dia' },
  { name: 'Lifestyle', description: 'Estilo urbano para o dia a dia' },
]

export const brandProducts: Record<BrandName, Product[]> = {
  Adidas: [
    {
      id: 101,
      name: 'Adidas Ultraboost 4',
      category: 'Corrida',
      price: 100,
      tag: 'Mais vendido',
      accent: 'gold',
      image: adidasUltraboostImage,
      imageAlt: 'Par de tênis Adidas Ultraboost preto fotografado ao ar livre',
    },
    {
      id: 102,
      name: 'Adidas Adizero Boston 12',
      category: 'Corrida',
      price: 100,
      tag: 'Performance',
      accent: 'sand',
      image: adidasBostonImage,
      imageAlt: 'Tênis Adidas Adizero Boston 12 branco e colorido',
    },
  ],
  'New Balance': [
    {
      id: 201,
      name: 'New Balance 574',
      category: 'Casual',
      price: 100,
      tag: 'Clássico',
      accent: 'sand',
      image: newBalance574Image,
      imageAlt: 'Tênis New Balance 574 bege',
    },
    {
      id: 202,
      name: 'New Balance 1906R',
      category: 'Lifestyle',
      price: 100,
      tag: 'Novo',
      accent: 'black',
      image: newBalance1906rImage,
      imageAlt: 'Par de tênis New Balance 1906R branco e preto',
    },
  ],
  Nike: [
    {
      id: 301,
      name: 'Nike Cortez',
      category: 'Casual',
      price: 100,
      tag: 'Clássico',
      accent: 'gold',
      image: nikeCortezImage,
      imageAlt: 'Tênis Nike Cortez branco com detalhes vermelhos',
    },
    {
      id: 302,
      name: 'Nike Terminator',
      category: 'Lifestyle',
      price: 100,
      tag: 'Destaque',
      accent: 'black',
      image: nikeTerminatorImage,
      imageAlt: 'Par de tênis Nike Terminator cinza e azul-marinho',
    },
  ],
}

export const products: Product[] = brandProducts.Adidas