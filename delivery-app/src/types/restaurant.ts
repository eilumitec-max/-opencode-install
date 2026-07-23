export interface Address {
  id: string
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Restaurant {
  id: string
  name: string
  description: string
  image: string
  coverImage?: string
  rating: number
  reviewCount: number
  deliveryTime: {
    min: number
    max: number
  }
  deliveryFee: number
  minimumOrder: number
  categories: string[]
  isOpen: boolean
  isPromoted: boolean
  distance?: string
  coordinates?: {
    lat: number
    lng: number
  }
  openingHours: {
    [key: string]: { open: string; close: string } | null
  }
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  tags: string[]
  isPopular?: boolean
  isVegetarian?: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
  customizations?: CustomizationGroup[]
}

export interface CustomizationGroup {
  id: string
  name: string
  type: 'single' | 'multiple'
  required: boolean
  options: CustomizationOption[]
}

export interface CustomizationOption {
  id: string
  name: string
  price: number
}

export interface CartItem {
  id: string
  menuItem: MenuItem
  quantity: number
  customizations: Record<string, string[]>
  notes?: string
}

export interface Order {
  id: string
  restaurant: Restaurant
  items: CartItem[]
  status: OrderStatus
  total: number
  deliveryFee: number
  discount: number
  paymentMethod: PaymentMethod
  address: Address
  createdAt: Date
  estimatedDelivery: Date
  tracking: OrderTracking[]
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export interface OrderTracking {
  status: OrderStatus
  timestamp: Date
  message: string
}

export type PaymentMethod = 
  | 'pix'
  | 'credit_card'
  | 'debit_card'
  | 'cash'
  | 'apple_pay'
  | 'google_pay'
  | 'wallet'

export interface Promotion {
  id: string
  title: string
  description: string
  discount: number
  badge: string
  code?: string
  image?: string
  validUntil?: Date
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  addresses: Address[]
  paymentMethods: PaymentMethodInfo[]
  preferences: UserPreferences
}

export interface PaymentMethodInfo {
  id: string
  type: PaymentMethod
  brand?: string
  last4?: string
  isDefault: boolean
}

export interface UserPreferences {
  notifications: boolean
  promotionalEmails: boolean
  darkMode: boolean
  language: string
}

export interface Category {
  id: string
  name: string
  icon: string
  image?: string
  count: number
}