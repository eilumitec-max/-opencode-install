import type { Category, Restaurant, MenuItem, Promotion, Address, Order, User, CartItem, PaymentMethod, OrderStatus } from '@/types/restaurant'
import { 
  Utensils, Pizza, Salad, Coffee, 
  IceCream, Sandwich, Drumstick, Fish, Cookie, Wine 
} from 'lucide-react'

export const categories: Category[] = [
  { id: 'all', name: 'Todos', icon: 'utensils', count: 0 },
  { id: 'burgers', name: 'Hambúrgueres', icon: 'sandwich', count: 12 },
  { id: 'pizza', name: 'Pizzas', icon: 'pizza', count: 8 },
  { id: 'japanese', name: 'Japonesa', icon: 'fish', count: 6 },
  { id: 'healthy', name: 'Saudável', icon: 'salad', count: 10 },
  { id: 'desserts', name: 'Sobremesas', icon: 'ice-cream', count: 5 },
  { id: 'coffee', name: 'Cafés', icon: 'coffee', count: 4 },
  { id: 'brazilian', name: 'Brasileira', icon: 'drumstick', count: 7 },
]

export const categoryIcons: Record<string, React.ReactNode> = {
  utensils: <Utensils className="w-6 h-6" />,
  sandwich: <Sandwich className="w-6 h-6" />,
  pizza: <Pizza className="w-6 h-6" />,
  fish: <Fish className="w-6 h-6" />,
  salad: <Salad className="w-6 h-6" />,
  'ice-cream': <IceCream className="w-6 h-6" />,
  coffee: <Coffee className="w-6 h-6" />,
  drumstick: <Drumstick className="w-6 h-6" />,
}

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Burger House',
    cuisine: 'Hamburgueria · Americana',
    rating: 4.8,
    reviews: 1240,
    distance: 2.3,
    deliveryFee: 5.90,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    tags: ['Hambúrgueres', 'Batatas', 'Milkshakes'],
    isOpen: true,
    isPromoted: true,
    promoText: '20% OFF no primeiro pedido',
  },
  {
    id: '2',
    name: 'Pizza Bella Napoli',
    cuisine: 'Pizzaria · Italiana',
    rating: 4.9,
    reviews: 890,
    distance: 1.8,
    deliveryFee: 0,
    deliveryTime: '30-40 min',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    tags: ['Pizzas', 'Massas', 'Vinhos'],
    isOpen: true,
  },
  {
    id: '3',
    name: 'Sushi Zen',
    cuisine: 'Japonesa · Sushi',
    rating: 4.7,
    reviews: 567,
    distance: 3.1,
    deliveryFee: 7.90,
    deliveryTime: '35-45 min',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
    tags: ['Sushi', 'Sashimi', 'Temaki'],
    isOpen: true,
  },
  {
    id: '4',
    name: 'Green Bowl',
    cuisine: 'Saudável · Vegana',
    rating: 4.6,
    reviews: 423,
    distance: 1.2,
    deliveryFee: 4.90,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    tags: ['Bowls', 'Saladas', 'Sucos'],
    isOpen: true,
  },
  {
    id: '5',
    name: 'Doce Tentação',
    cuisine: 'Doces · Confeitaria',
    rating: 4.9,
    reviews: 789,
    distance: 2.7,
    deliveryFee: 6.90,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    tags: ['Bolos', 'Doces', 'Café'],
    isOpen: true,
  },
  {
    id: '6',
    name: 'Frango Assado',
    cuisine: 'Brasileira · Rotisserie',
    rating: 4.5,
    reviews: 1100,
    distance: 0.9,
    deliveryFee: 3.90,
    deliveryTime: '20-25 min',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
    tags: ['Frango', 'Acompanhamentos', 'Feijoada'],
    isOpen: true,
  },
]

export const menuItems: MenuItem[] = [
  // Burger House items
  {
    id: '1-1',
    name: 'X-Bacon Especial',
    description: 'Pão brioche, 180g de carne angus, queijo cheddar, bacon crocante, alface, tomate e molho especial da casa',
    price: 32.90,
    originalPrice: 38.90,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    category: 'Hambúrgueres',
    tags: ['Popular', 'Carne Angus'],
    isPopular: true,
    customizations: [
      {
        id: 'c1',
        name: 'Ponto da carne',
        type: 'single',
        required: true,
        options: [
          { id: 'c1-1', name: 'Mal passado', price: 0 },
          { id: 'c1-2', name: 'Ao ponto', price: 0 },
          { id: 'c1-3', name: 'Bem passado', price: 0 },
        ],
      },
      {
        id: 'c2',
        name: 'Adicionais',
        type: 'multiple',
        required: false,
        options: [
          { id: 'c2-1', name: 'Queijo extra', price: 4.00 },
          { id: 'c2-2', name: 'Bacon extra', price: 5.00 },
          { id: 'c2-3', name: 'Ovo frito', price: 3.00 },
          { id: 'c2-4', name: 'Cebola caramelizada', price: 2.00 },
        ],
      },
    ],
  },
  {
    id: '1-2',
    name: 'X-Salada Clássico',
    description: 'Pão brioche, 180g de carne angus, queijo mussarela, alface, tomate, cebola e molho da casa',
    price: 26.90,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    category: 'Hambúrgueres',
    tags: ['Clássico'],
  },
  {
    id: '1-3',
    name: 'Batata Rústica',
    description: 'Batatas rústicas temperadas com alecrim e alho, servidas com molho aioli',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    category: 'Acompanhamentos',
    tags: ['Vegetariano'],
    isVegetarian: true,
  },
  {
    id: '1-4',
    name: 'Milkshake de Ovomaltine',
    description: 'Sorvete de baunilha, Ovomaltine, leite integral e chantilly',
    price: 19.90,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
    category: 'Bebidas',
    tags: ['Gelado', 'Doce'],
  },
  // Pizza Bella Napoli items
  {
    id: '2-1',
    name: 'Pizza Margherita',
    description: 'Molho de tomate san marzano, mussarela de búfala, manjericão fresco e azeite extra virgem',
    price: 42.90,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    category: 'Pizzas Tradicionais',
    tags: ['Vegetariano', 'Clássica'],
    isVegetarian: true,
    customizations: [
      {
        id: 'p1',
        name: 'Borda',
        type: 'single',
        required: false,
        options: [
          { id: 'p1-1', name: 'Sem borda', price: 0 },
          { id: 'p1-2', name: 'Borda recheada catupiry', price: 8.00 },
          { id: 'p1-3', name: 'Borda recheada cheddar', price: 8.00 },
        ],
      },
    ],
  },
  {
    id: '2-2',
    name: 'Pizza Pepperoni',
    description: 'Molho de tomate, mussarela, pepperoni artesanal e orégano',
    price: 48.90,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
    category: 'Pizzas Tradicionais',
    tags: ['Popular'],
    isPopular: true,
  },
  // Sushi Zen items
  {
    id: '3-1',
    name: 'Combo Sashimi 15 pçs',
    description: '5 fatias de salmão, 5 de atum, 5 de peixe branco',
    price: 68.90,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
    category: 'Sashimi',
    tags: ['Premium', 'Peixe Fresco'],
  },
  {
    id: '3-2',
    name: 'Hot Roll Salmão (8 pçs)',
    description: 'Salmão, cream cheese, cebolinha, empanado no panko e frito, coberto com molho tarê',
    price: 34.90,
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop',
    category: 'Hot Rolls',
    tags: ['Quente', 'Cream Cheese'],
    isPopular: true,
  },
  // Green Bowl items
  {
    id: '4-1',
    name: 'Buddha Bowl',
    description: 'Quinoa, grão de bico assado, batata doce, abacate, brotos, cenoura, pepino e molho tahine',
    price: 38.90,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    category: 'Bowls',
    tags: ['Vegano', 'Proteína Vegetal', 'Sem Glúten'],
    isVegetarian: true,
    isVegan: true,
  },
  {
    id: '4-2',
    name: 'Suco Verde Detox',
    description: 'Couve, maçã, gengibre, limão, pepino e água de coco',
    price: 14.90,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop',
    category: 'Bebidas',
    tags: ['Natural', 'Detox', 'Sem Açúcar'],
    isVegetarian: true,
    isVegan: true,
  },
]

export const promotions: Promotion[] = [
  {
    id: 'promo-1',
    title: '20% OFF no Primeiro Pedido',
    description: 'Use o cupom PRIMEIRO20 e ganhe desconto no seu primeiro pedido em qualquer restaurante',
    discount: 20,
    badge: 'NOVO',
    code: 'PRIMEIRO20',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'promo-2',
    title: 'Frete Grátis Hoje',
    description: 'Pedidos acima de R$ 50 têm entrega grátis em todos os restaurantes parceiros',
    discount: 100,
    badge: 'HOJE',
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    id: 'promo-3',
    title: 'Combo Família',
    description: 'Peça 2 pizzas grandes e ganhe 1 refrigerante 2L + borda recheada grátis',
    discount: 25,
    badge: 'FAMÍLIA',
    code: 'FAMILIA25',
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
]

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Casa',
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Jardim Primavera',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    isDefault: true,
    coordinates: { lat: -23.5505, lng: -46.6333 },
  },
  {
    id: 'addr-2',
    label: 'Trabalho',
    street: 'Av. Paulista',
    number: '1000',
    complement: 'Sala 1200',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    isDefault: false,
    coordinates: { lat: -23.5613, lng: -46.6564 },
  },
]

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    restaurant: restaurants[0],
    items: [
      { id: 'item-1', menuItem: menuItems[0], quantity: 2, customizations: { c1: ['c1-2'], c2: ['c2-1', 'c2-3'] }, notes: 'Sem cebola', subtotal: 65.80 },
      { id: 'item-2', menuItem: menuItems[2], quantity: 1, customizations: {}, subtotal: 18.90 },
    ],
    status: 'delivered',
    total: 92.60,
    deliveryFee: 5.90,
    discount: 0,
    paymentMethod: 'pix',
    address: mockAddresses[0],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000),
    tracking: [
      { status: 'confirmed', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), message: 'Pedido confirmado' },
      { status: 'preparing', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000), message: 'Restaurante preparando seu pedido' },
      { status: 'ready', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000), message: 'Pedido pronto para retirada' },
      { status: 'out_for_delivery', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), message: 'Entregador a caminho' },
      { status: 'delivered', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000), message: 'Pedido entregue' },
    ],
  },
  {
    id: 'order-2',
    restaurant: restaurants[1],
    items: [
      { id: 'item-3', menuItem: menuItems[4], quantity: 1, customizations: { p1: ['p1-2'] }, subtotal: 50.90 },
    ],
    status: 'out_for_delivery',
    total: 50.90,
    deliveryFee: 0,
    discount: 0,
    paymentMethod: 'credit_card',
    address: mockAddresses[1],
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000),
    tracking: [
      { status: 'confirmed', timestamp: new Date(Date.now() - 30 * 60 * 1000), message: 'Pedido confirmado' },
      { status: 'preparing', timestamp: new Date(Date.now() - 25 * 60 * 1000), message: 'Restaurante preparando seu pedido' },
      { status: 'ready', timestamp: new Date(Date.now() - 10 * 60 * 1000), message: 'Pedido pronto para retirada' },
      { status: 'out_for_delivery', timestamp: new Date(Date.now() - 5 * 60 * 1000), message: 'Entregador a caminho' },
    ],
  },
]

export const mockUser: User = {
  id: 'user-1',
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '(11) 99999-9999',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
  addresses: mockAddresses,
  paymentMethods: [
    { id: 'pm-1', type: 'pix', isDefault: true },
    { id: 'pm-2', type: 'credit_card', brand: 'Visa', last4: '4242', isDefault: false },
    { id: 'pm-3', type: 'apple_pay', isDefault: false },
  ],
  preferences: {
    notifications: true,
    promotionalEmails: true,
    darkMode: false,
    language: 'pt-BR',
  },
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`
  }
  return `${distance.toFixed(1)} km`
}

export const getOrderStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    ready: 'Pronto',
    out_for_delivery: 'Saiu para entrega',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  }
  return labels[status]
}

export const getOrderStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    pending: 'warning',
    confirmed: 'info',
    preparing: 'warning',
    ready: 'info',
    out_for_delivery: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  }
  return colors[status]
}

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  const labels: Record<PaymentMethod, string> = {
    pix: 'PIX',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    cash: 'Dinheiro',
    apple_pay: 'Apple Pay',
    google_pay: 'Google Pay',
    wallet: 'Saldo no App',
  }
  return labels[method]
}