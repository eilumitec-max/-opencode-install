import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Foodie - Delivery de Comida Rápido e Fácil',
  description: 'Peça comida dos melhores restaurantes com entrega rápida. Hambúrgueres, pizzas, sushi, saudável e muito mais.',
  keywords: ['delivery', 'comida', 'restaurantes', 'pedido online', 'ifood', 'uber eats'],
  openGraph: {
    title: 'Foodie - Delivery de Comida',
    description: 'Peça comida dos melhores restaurantes com entrega rápida',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" class={`${inter.variable} antialiased`}>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}