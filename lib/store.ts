// ============================================
// ALOHA Zustand Store
// Cart, Checkout, UI State Management
// ============================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Customer, Order, OrderStatus, Size } from './types'
import { getProductById, products } from './products'

// ============================================
// Cart Store
// ============================================
interface CartState {
  items: CartItem[]
  couponCode: string | null
  isCartOpen: boolean
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (variantSku: string) => void
  updateQuantity: (variantSku: string, quantity: number) => void
  clearCart: () => void
  setCouponCode: (code: string | null) => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  // Computed
  getItemCount: () => number
  getSubtotal: () => number
  getCartItems: () => (CartItem & { product: typeof products[0] | undefined })[]
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      isCartOpen: false,
      
      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.variantSku === newItem.variantSku
          )
          const incomingQty = Math.max(1, Math.min(newItem.quantity ?? 1, 10))
          
          if (existingIndex >= 0) {
            const updatedItems = [...state.items]
            updatedItems[existingIndex].quantity = Math.min(
              updatedItems[existingIndex].quantity + incomingQty,
              10
            )
            return { items: updatedItems, isCartOpen: true }
          }
          
          return { 
            items: [...state.items, { ...newItem, quantity: incomingQty }],
            isCartOpen: true 
          }
        })
      },
      
      removeItem: (variantSku) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantSku !== variantSku)
        }))
      },
      
      updateQuantity: (variantSku, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantSku)
          return
        }

        const clamped = Math.min(quantity, 10)
        set((state) => ({
          items: state.items.map((item) =>
            item.variantSku === variantSku ? { ...item, quantity: clamped } : item
          )
        }))
      },
      
      clearCart: () => set({ items: [], couponCode: null }),
      
      setCouponCode: (code) => set({ couponCode: code }),
      
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
      
      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const product = getProductById(item.productId)
          if (!product) return sum
          return sum + product.price * item.quantity
        }, 0)
      },
      
      getCartItems: () => {
        return get().items.map((item) => ({
          ...item,
          product: getProductById(item.productId)
        }))
      }
    }),
    {
      name: 'aloha-cart',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode
      })
    }
  )
)

// ============================================
// Checkout Store
// ============================================
interface CheckoutState {
  customer: Customer | null
  currentOrder: Order | null
  isProcessing: boolean
  
  // Actions
  setCustomer: (customer: Customer) => void
  createOrder: (items: CartItem[]) => Order
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  setPaymentReference: (orderId: string, reference: string) => void
  clearCheckout: () => void
  setProcessing: (isProcessing: boolean) => void
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      customer: null,
      currentOrder: null,
      isProcessing: false,
      
      setCustomer: (customer) => set({ customer }),
      
      createOrder: (items) => {
        const customer = get().customer
        if (!customer) throw new Error('Customer data required')
        
        const orderItems = items.map((item) => {
          const product = getProductById(item.productId)
          if (!product) throw new Error(`Product not found: ${item.productId}`)
          return {
            productId: item.productId,
            productName: product.name,
            variantSku: item.variantSku,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            unitPrice: product.price,
            totalPrice: product.price * item.quantity
          }
        })
        
        const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0)
        const shipping = 15000 // Placeholder shipping cost
        
        const order: Order = {
          id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          items: orderItems,
          customer,
          subtotal,
          shipping,
          total: subtotal + shipping,
          status: 'pending_payment',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        set({ currentOrder: order })
        return order
      },
      
      updateOrderStatus: (orderId, status) => {
        set((state) => {
          if (state.currentOrder?.id === orderId) {
            return {
              currentOrder: {
                ...state.currentOrder,
                status,
                updatedAt: new Date().toISOString()
              }
            }
          }
          return state
        })
      },
      
      setPaymentReference: (orderId, reference) => {
        set((state) => {
          if (state.currentOrder?.id === orderId) {
            return {
              currentOrder: {
                ...state.currentOrder,
                paymentReference: reference,
                updatedAt: new Date().toISOString()
              }
            }
          }
          return state
        })
      },
      
      clearCheckout: () => set({ customer: null, currentOrder: null }),
      
      setProcessing: (isProcessing) => set({ isProcessing })
    }),
    {
      name: 'aloha-checkout',
      partialize: (state) => ({
        customer: state.customer,
        currentOrder: state.currentOrder
      })
    }
  )
)

// ============================================
// UI Store
// ============================================
interface UIState {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  activeModal: string | null
  
  // Actions
  openMobileMenu: () => void
  closeMobileMenu: () => void
  toggleMobileMenu: () => void
  openSearch: () => void
  closeSearch: () => void
  setActiveModal: (modal: string | null) => void
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  activeModal: null,
  
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  setActiveModal: (modal) => set({ activeModal: modal })
}))

// ============================================
// Fit Recommendation Utility
// ============================================
export function calculateFitRecommendation(
  heightCm: number,
  weightKg: number,
  preference: 'ajustada' | 'normal' | 'suelta' | undefined,
  fitType: 'oversize' | 'regular'
): { recommendedSize: Size; explanation: string } {
  // Calculate BMI for a general reference
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  
  // Base size determination using height and build
  let baseSize: Size
  
  if (heightCm < 165) {
    baseSize = bmi < 22 ? 'S' : bmi < 26 ? 'M' : 'L'
  } else if (heightCm < 175) {
    baseSize = bmi < 21 ? 'S' : bmi < 25 ? 'M' : bmi < 29 ? 'L' : 'XL'
  } else if (heightCm < 185) {
    baseSize = bmi < 22 ? 'M' : bmi < 27 ? 'L' : 'XL'
  } else {
    baseSize = bmi < 23 ? 'L' : 'XL'
  }
  
  // Adjust based on fit type and preference
  const sizeOrder: Size[] = ['S', 'M', 'L', 'XL']
  let sizeIndex = sizeOrder.indexOf(baseSize)
  
  if (fitType === 'oversize') {
    // Oversize products already run large
    if (preference === 'ajustada' || preference === 'normal') {
      sizeIndex = Math.max(0, sizeIndex - 1) // Size down
    }
    // 'suelta' stays the same for oversize
  } else {
    // Regular fit
    if (preference === 'suelta') {
      sizeIndex = Math.min(3, sizeIndex + 1) // Size up
    } else if (preference === 'ajustada') {
      sizeIndex = Math.max(0, sizeIndex - 1) // Size down if possible
    }
  }
  
  const recommendedSize = sizeOrder[sizeIndex]
  
  // Generate explanation
  let explanation = ''
  if (fitType === 'oversize') {
    if (preference === 'ajustada' || preference === 'normal') {
      explanation = `Con tu altura (${heightCm}cm) y peso (${weightKg}kg), te recomendamos ${recommendedSize}. Como es oversize, una talla menos te dará un look más estructurado.`
    } else {
      explanation = `Con tu altura (${heightCm}cm) y peso (${weightKg}kg), te recomendamos ${recommendedSize} para ese look oversize relajado que buscas.`
    }
  } else {
    if (preference === 'suelta') {
      explanation = `Con tu altura (${heightCm}cm) y peso (${weightKg}kg), te recomendamos ${recommendedSize}. Una talla más te dará ese fit más cómodo que prefieres.`
    } else if (preference === 'ajustada') {
      explanation = `Con tu altura (${heightCm}cm) y peso (${weightKg}kg), te recomendamos ${recommendedSize} para un look más ceñido.`
    } else {
      explanation = `Con tu altura (${heightCm}cm) y peso (${weightKg}kg), te recomendamos ${recommendedSize} para un fit clásico y cómodo.`
    }
  }
  
  return { recommendedSize, explanation }
}
