const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatPrice(priceInCents: number) {
  return brlFormatter.format(priceInCents / 100)
}
