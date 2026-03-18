// ============================================
// ALOHA E-Commerce Type Definitions
// ============================================

// Product Types
export type Size = 'S' | 'M' | 'L' | 'XL'
export type FitType = 'oversize' | 'regular'
export type FitPreference = 'ajustada' | 'normal' | 'suelta'

export interface ProductVariant {
  size: Size
  color: string
  colorHex: string
  stock: number
  sku: string
}

export interface ProductMedia {
  type: 'image' | 'video'
  url: string
  alt: string
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  shortDescription: string
  price: number
  compareAtPrice: number
  fitType: FitType
  tags: string[]
  collectionSlugs: string[]
  collectionId: 'colombia' | 'plenty' | 'dolce-vita' | 'quillami'
  category: 'kids' | 'adult'
  isHotSale: boolean
  isNew: boolean
  variants: ProductVariant[]
  media: ProductMedia[]
  relatedProducts: string[] // product IDs
}

// Cart Types
export interface CartItem {
  productId: string
  variantSku: string
  quantity: number
  size: Size
  color: string
  colorHex: string
}

export interface Cart {
  items: CartItem[]
  couponCode?: string
}

// Customer Types
export interface CustomerAddress {
  city: string
  neighborhood: string // Barrio
  addressLine: string
  additionalInstructions?: string
}

export interface Customer {
  fullName: string
  email: string
  phone: string
  address: CustomerAddress
}

// Order Types
export type OrderStatus = 'pending_payment' | 'paid' | 'failed' | 'shipped' | 'delivered'

export interface OrderItem {
  productId: string
  productName: string
  variantSku: string
  size: Size
  color: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: string
  items: OrderItem[]
  customer: Customer
  subtotal: number
  shipping: number
  total: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  paymentReference?: string
}

// Filter Types
export interface ProductFilters {
  sizes: Size[]
  fits: FitType[]
  colors: string[]
  minPrice?: number
  maxPrice?: number
}

export type SortOption = 'newest' | 'popular' | 'price-asc' | 'price-desc'

// Fit Recommendation Types
export interface FitRecommendationInput {
  heightCm: number
  weightKg: number
  preference?: FitPreference
}

export interface FitRecommendation {
  recommendedSize: Size
  explanation: string
}

// Bold Payment Types
export interface BoldPaymentConfig {
  orderId: string
  amount: number
  currency: string
  description: string
  customerEmail: string
  reference: string
  integrityHash: string
  successUrl: string
  returnUrl: string
}

export interface BoldWebhookEvent {
  event: string
  reference: string
  status: string
  timestamp: string
}
