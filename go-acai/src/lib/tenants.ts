export interface DeliveryZone {
  id: string
  name: string
  fee: number
  active: boolean
}

export interface Tenant {
  id: string
  slug: string
  name: string
  logo: string
  primaryColor: string
  whatsapp: string
  address: string
  deliveryFee: number
  minOrder: number
  workingHours: string
  installments: string
  banner?: string
  products: TenantProduct[]
  categories: TenantCategory[]
  orders: TenantOrder[]
  deliveryZones?: DeliveryZone[]
}

export interface TenantProduct {
  id: string
  name: string
  category: string
  price: number
  oldPrice: number | null
  stock: number
  image: string
  active: boolean
  featured: boolean
  sales: number
}

export interface TenantCategory {
  id: string
  name: string
  icon: string
  active: boolean
  order: number
}

export interface TenantOrder {
  id: string
  customer: string
  phone?: string
  items: string[]
  total: number
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
  payment: string
  method: string
  date: string
  address: string
}

export const tenants: Tenant[] = [
  {
    id: '1',
    slug: 'acai-do-miqueias',
    name: 'Açaí do Miqueias',
    logo: '🍇',
    primaryColor: '#7c3aed',
    whatsapp: '(11) 98765-4321',
    address: 'Rua das Palmeiras, 150 - Centro',
    deliveryFee: 5.00,
    minOrder: 15.00,
    workingHours: '09:00 - 22:00',
    installments: 'Até 12x',
    banner: '🎉 Cliente novo? Use o cupom BEMVINDO e ganhe 10% off na primeira compra!',
    products: [
      { id: 'p1', name: 'Açaí Tradicional 500ml', category: 'Açaís', price: 19.90, oldPrice: 24.90, stock: 50, image: '', active: true, featured: true, sales: 342 },
      { id: 'p2', name: 'Açaí Zero 500ml', category: 'Açaís', price: 22.90, oldPrice: null, stock: 30, image: '', active: true, featured: false, sales: 156 },
      { id: 'p3', name: 'Copo Açaí 300ml', category: 'Copos', price: 15.00, oldPrice: null, stock: 60, image: '', active: true, featured: false, sales: 210 },
      { id: 'p4', name: 'Tigela Power 700ml', category: 'Açaís', price: 28.90, oldPrice: 34.90, stock: 25, image: '', active: true, featured: true, sales: 198 },
      { id: 'p5', name: 'Sorvete de Creme 2 bolas', category: 'Sorvetes', price: 12.00, oldPrice: 15.00, stock: 40, image: '', active: true, featured: false, sales: 89 },
    ],
    categories: [
      { id: 'c1', name: 'Açaís', icon: '🍇', active: true, order: 1 },
      { id: 'c2', name: 'Copos', icon: '🥤', active: true, order: 2 },
      { id: 'c3', name: 'Sorvetes', icon: '🍦', active: true, order: 3 },
      { id: 'c4', name: 'Coberturas', icon: '🍫', active: true, order: 4 },
      { id: 'c5', name: 'Frutas', icon: '🍓', active: true, order: 5 },
    ],
    orders: [
      { id: 'GO-4521', customer: 'Maria Silva', items: ['Açaí Tradicional 500ml', 'Granola', 'Banana'], total: 27.40, status: 'delivered', payment: 'PIX', method: 'Entrega', date: '2024-07-20 19:32', address: 'Rua das Flores, 123' },
      { id: 'GO-4520', customer: 'João Santos', items: ['Copo Açaí 300ml', 'Nutella'], total: 18.00, status: 'shipped', payment: 'Cartão', method: 'Entrega', date: '2024-07-20 19:15', address: 'Av. Principal, 456' },
      { id: 'GO-4519', customer: 'Ana Oliveira', items: ['Tigela Power 700ml', 'Paçoca'], total: 34.90, status: 'preparing', payment: 'Dinheiro', method: 'Retirada', date: '2024-07-20 18:50', address: '-' },
    ],
  },
  {
    id: '2',
    slug: 'gelateria-bella',
    name: 'Gelateria Bella',
    logo: '🍦',
    primaryColor: '#e11d48',
    whatsapp: '(11) 91234-5678',
    address: 'Av. Paulista, 1000 - Bela Vista',
    deliveryFee: 3.00,
    minOrder: 20.00,
    workingHours: '10:00 - 23:00',
    installments: 'Até 6x',
    banner: '🍦 Compre 2 Gelatos e leve 1 brinde surpresa!',
    products: [
      { id: 'p1', name: 'Gelato Cremoso 300ml', category: 'Gelatos', price: 18.00, oldPrice: null, stock: 35, image: '', active: true, featured: true, sales: 412 },
      { id: 'p2', name: 'Gelato de Pistache', category: 'Gelatos', price: 22.00, oldPrice: 26.00, stock: 20, image: '', active: true, featured: true, sales: 287 },
      { id: 'p3', name: 'Milkshake de Chocolate', category: 'Bebidas', price: 16.00, oldPrice: null, stock: 40, image: '', active: true, featured: false, sales: 156 },
      { id: 'p4', name: 'Banana Split Especial', category: 'Sobremesas', price: 24.90, oldPrice: null, stock: 15, image: '', active: true, featured: false, sales: 98 },
      { id: 'p5', name: 'Sorvete Vegano 300ml', category: 'Gelatos', price: 25.00, oldPrice: null, stock: 10, image: '', active: true, featured: false, sales: 67 },
    ],
    categories: [
      { id: 'c1', name: 'Gelatos', icon: '🍦', active: true, order: 1 },
      { id: 'c2', name: 'Bebidas', icon: '🧃', active: true, order: 2 },
      { id: 'c3', name: 'Sobremesas', icon: '🍰', active: true, order: 3 },
    ],
    orders: [
      { id: 'GB-301', customer: 'Carlos Lima', items: ['Gelato Cremoso 300ml'], total: 18.00, status: 'delivered', payment: 'Cartão', method: 'Entrega', date: '2024-07-20 20:10', address: 'Rua Augusta, 500' },
      { id: 'GB-300', customer: 'Julia Costa', items: ['Milkshake de Chocolate'], total: 16.00, status: 'preparing', payment: 'PIX', method: 'Retirada', date: '2024-07-20 19:55', address: '-' },
    ],
  },
  {
    id: '3',
    slug: 'acai-da-maria',
    name: 'Açaí da Maria',
    logo: '💜',
    primaryColor: '#6d28d9',
    whatsapp: '(11) 95555-1234',
    address: 'Rua XV de Novembro, 80 - Centro',
    deliveryFee: 0,
    minOrder: 12.00,
    workingHours: '08:00 - 21:00',
    installments: 'Até 10x',
    banner: '🌟 Frete grátis em pedidos acima de R$ 25,00!',
    products: [
      { id: 'p1', name: 'Açaí Médio 500ml', category: 'Açaís', price: 17.90, oldPrice: 21.90, stock: 45, image: '', active: true, featured: true, sales: 521 },
      { id: 'p2', name: 'Açaí Pequeno 300ml', category: 'Açaís', price: 13.90, oldPrice: null, stock: 70, image: '', active: true, featured: false, sales: 334 },
      { id: 'p3', name: 'Açaí Gigante 1L', category: 'Açaís', price: 30.00, oldPrice: null, stock: 20, image: '', active: true, featured: true, sales: 178 },
      { id: 'p4', name: 'Suco Natural 500ml', category: 'Bebidas', price: 9.00, oldPrice: null, stock: 50, image: '', active: true, featured: false, sales: 210 },
    ],
    categories: [
      { id: 'c1', name: 'Açaís', icon: '🍇', active: true, order: 1 },
      { id: 'c2', name: 'Bebidas', icon: '🧃', active: true, order: 2 },
      { id: 'c3', name: 'Complementos', icon: '🥜', active: true, order: 3 },
    ],
    orders: [
      { id: 'AM-189', customer: 'Pedro Alves', items: ['Açaí Médio 500ml', 'Granola'], total: 22.90, status: 'delivered', payment: 'Dinheiro', method: 'Entrega', date: '2024-07-20 18:30', address: 'Rua da Paz, 200' },
      { id: 'AM-188', customer: 'Lucia Mendes', items: ['Açaí Pequeno 300ml'], total: 13.90, status: 'shipped', payment: 'PIX', method: 'Entrega', date: '2024-07-20 18:15', address: 'Rua das Acácias, 55' },
    ],
  },
]

export function getTenantBySlug(slug: string): Tenant | undefined {
  return tenants.find(t => t.slug === slug)
}

export function getTenantById(id: string): Tenant | undefined {
  return tenants.find(t => t.id === id)
}