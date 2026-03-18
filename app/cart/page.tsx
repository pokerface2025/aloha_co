import type { Metadata } from 'next'
import { CartPageContent } from '@/components/cart/cart-page-content'

export const metadata: Metadata = {
  title: 'Carrito | ALOHA',
  description: 'Revisa tu carrito de compras y procede al checkout.',
}

export default function CartPage() {
  return <CartPageContent />
}
