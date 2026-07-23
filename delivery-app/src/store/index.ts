'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Address, User, Restaurant, MenuItem } from '@/types/restaurant'

interface CartState {
  items: CartItem[]
  restaurantId: string | null
  addItem: (item: MenuItem, customizations?: Record<string, string[]>, notes?: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  setRestaurant: (restaurantId: string | null) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      
      addItem: (menuItem, customizations = {}, notes) => {
        const { items, restaurantId } = get()
        
        if (restaurantId && restaurantId !== menuItem.id) {
          // Different restaurant - could show confirmation modal
        }
        
        const existingIndex = items.findIndex(
          (item) => 
            item.menuItem.id === menuItem.id && 
            JSON.stringify(item.customizations) === JSON.stringify(customizations)
        )
        
        if (existingIndex >= 0) {
          const newItems = [...items]
          newItems[existingIndex].quantity += 1
          set({ items: newItems })
        } else {
          const newItem: CartItem = {
            id: `${menuItem.id}-${Date.now()}`,
            menuItem,
            quantity: 1,
            customizations,
            notes,
          }
          set({ items: [...items, newItem], restaurantId: menuItem.id })
        }
      },
      
      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) })
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        })
      },
      
      clearCart: () => set({ items: [], restaurantId: null }),
      
      getTotal: () => {
        return get().items.reduce((total, item) => {
          const customizationPrice = Object.values(item.customizations).flat().reduce(
            (sum, optId) => {
              const option = item.menuItem.customizations?.flatMap(c => c.options).find(o => o.id === optId)
              return sum + (option?.price || 0)
            },
            0
          )
          return total + (item.menuItem.price + customizationPrice) * item.quantity
        }, 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
      
      setRestaurant: (restaurantId) => set({ restaurantId }),
    }),
    {
      name: 'delivery-cart',
      partialize: (state) => ({ items: state.items, restaurantId: state.restaurantId }),
    }
  )
)

interface UserState {
  user: User | null
  addresses: Address[]
  setUser: (user: User | null) => void
  addAddress: (address: Address) => void
  updateAddress: (id: string, address: Partial<Address>) => void
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      addresses: [],
      
      setUser: (user) => set({ user }),
      
      addAddress: (address) => set((state) => ({
        addresses: [...state.addresses, address],
        user: state.user ? { ...state.user, addresses: [...state.user.addresses, address] } : null,
      })),
      
      updateAddress: (id, address) => set((state) => ({
        addresses: state.addresses.map((a) => a.id === id ? { ...a, ...address } : a),
        user: state.user ? {
          ...state.user,
          addresses: state.user.addresses.map((a) => a.id === id ? { ...a, ...address } : a),
        } : null,
      })),
      
      removeAddress: (id) => set((state) => ({
        addresses: state.addresses.filter((a) => a.id !== id),
        user: state.user ? {
          ...state.user,
          addresses: state.user.addresses.filter((a) => a.id !== id),
        } : null,
      })),
      
      setDefaultAddress: (id) => set((state) => ({
        addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        user: state.user ? {
          ...state.user,
          addresses: state.user.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        } : null,
      })),
    }),
    {
      name: 'delivery-user',
    }
  )
)

interface UIState {
  isCartOpen: boolean
  isMenuOpen: boolean
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleMenu: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isMenuOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
}))