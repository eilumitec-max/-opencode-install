'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Smartphone, Monitor, Tablet, CheckCircle, ShoppingBag } from 'lucide-react'

const demoScreens = [
  {
    id: 'home',
    title: 'Tela Inicial',
    bg: 'bg-gradient-to-br from-primary-500 to-primary-400',
    content: (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">GO AÇAÍ</h3>
        <p className="text-white/80 text-sm">Selecione: Tigela ou Copo</p>
        <div className="mt-6 flex gap-3">
          <div className="w-24 h-24 rounded-xl bg-white/10 flex flex-col items-center justify-center p-3">
            <div className="w-full h-16 rounded-lg bg-white/20 mb-2" />
            <span className="text-white text-sm font-medium">Tigela</span>
            <span className="text-white/70 text-xs">Açaí tradicional</span>
          </div>
          <div className="w-24 h-24 rounded-xl bg-white/10 flex flex-col items-center justify-center p-3">
            <div className="w-full h-16 rounded-lg bg-white/20 mb-2" />
            <span className="text-white text-sm font-medium">Copo</span>
            <span className="text-white/70 text-xs">Para viagem</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'size',
    title: 'Escolher Tamanho',
    bg: 'bg-gradient-to-br from-accent-500 to-accent-400',
    content: (
      <div className="h-full p-4 overflow-y-auto">
        <h3 className="text-lg font-bold text-dark-900 mb-4 text-center">Qual o tamanho?</h3>
        <div className="grid grid-cols-2 gap-3">
          {['300 ml', '500 ml', '700 ml', '1 Litro'].map((size, i) => (
            <motion.button
              key={size}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-xl bg-white border border-dark-200 text-left"
            >
              <p className="font-semibold text-dark-900">{size}</p>
              <p className="text-sm text-primary-600 font-medium">R$ {15 + i * 5},{i === 0 ? '00' : i === 1 ? '90' : i === 2 ? '90' : '90'}</p>
            </motion.button>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'base',
    title: 'Açaí ou Sorvete',
    bg: 'bg-gradient-to-br from-secondary-500 to-secondary-400',
    content: (
      <div className="h-full p-4 overflow-y-auto">
        <h3 className="text-lg font-bold text-dark-900 mb-4 text-center">Base</h3>
        <div className="space-y-3">
          {['Açaí Tradicional', 'Açaí Zero Açúcar', 'Sorvete de Creme', 'Sorvete de Chocolate', 'Sorvete de Morango'].map((base) => (
            <motion.div
              key={base}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-dark-200"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary-500" />
              </div>
              <span className="font-medium text-dark-900">{base}</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'toppings',
    title: 'Coberturas',
    bg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    content: (
      <div className="h-full p-4 overflow-y-auto">
        <h3 className="text-lg font-bold text-dark-900 mb-4 text-center">Coberturas</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {['Leite Condensado', 'Nutella', 'Chocolate', 'Caramelo', 'Morango', 'Doce de Leite'].map((topping) => (
            <motion.span
              key={topping}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1.5 rounded-full bg-white/90 text-sm font-medium text-dark-700 border border-dark-200"
            >
              {topping}
            </motion.span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'fruits',
    title: 'Frutas',
    bg: 'bg-gradient-to-br from-red-500 to-pink-500',
    content: (
      <div className="h-full p-4 overflow-y-auto">
        <h3 className="text-lg font-bold text-dark-900 mb-4 text-center">Frutas</h3>
        <div className="grid grid-cols-3 gap-3">
          {['Banana', 'Morango', 'Kiwi', 'Uva', 'Manga', 'Abacaxi', 'Maçã', 'Pera', 'Maracujá'].map((fruit) => (
            <motion.div
              key={fruit}
              whileHover={{ scale: 1.05 }}
              className="p-3 rounded-xl bg-white/90 text-center border border-dark-200"
            >
              <span className="font-medium text-dark-900">{fruit}</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'extras',
    title: 'Complementos',
    bg: 'bg-gradient-to-br from-purple-500 to-indigo-500',
    content: (
      <div className="h-full p-4 overflow-y-auto">
        <h3 className="text-lg font-bold text-dark-900 mb-4 text-center">Complementos</h3>
        <div className="space-y-2">
          {['Granola', 'Paçoca', 'Leite em Pó', 'Castanha', 'Confete', 'Ovomaltine', 'Amendoim', 'Coco Ralado', 'Chia'].map((extra) => (
            <motion.div
              key={extra}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/90 border border-dark-200"
            >
              <input type="checkbox" className="w-5 h-5 text-primary-500 rounded border-dark-300" />
              <span className="font-medium text-dark-900">{extra}</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'cart',
    title: 'Carrinho & Checkout',
    bg: 'bg-gradient-to-br from-secondary-500 to-teal-500',
    content: (
      <div className="h-full p-4 overflow-y-auto">
        <h3 className="text-lg font-bold text-dark-900 mb-4 text-center">Resumo do Pedido</h3>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between p-3 rounded-xl bg-white border border-dark-200">
            <div>
              <p className="font-medium text-dark-900">Tigela 500ml - Açaí</p>
              <p className="text-sm text-dark-500">Leite Condensado, Banana, Granola</p>
            </div>
            <span className="font-bold text-dark-900">R$ 24,90</span>
          </div>
        </div>
        <div className="border-t border-dark-200 pt-3 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>R$ 24,90</span></div>
          <div className="flex justify-between text-secondary-600"><span>Entrega</span><span>Grátis</span></div>
          <div className="flex justify-between text-lg font-bold border-t border-dark-200 pt-2"><span>Total</span><span>R$ 24,90</span></div>
        </div>
        <motion.button className="btn-primary w-full mt-4 py-3" whileTap={{ scale: 0.98 }}>
          Finalizar Pedido
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    ),
  },
  {
    id: 'tracking',
    title: 'Acompanhamento',
    bg: 'bg-gradient-to-br from-blue-500 to-indigo-500',
    content: (
      <div className="h-full p-4">
        <h3 className="text-lg font-bold text-dark-900 mb-4 text-center">Seu Pedido</h3>
        <div className="space-y-4">
          {[
            { status: 'Pedido recebido', done: true, current: true, icon: '📋' },
            { status: 'Em preparo', done: false, current: false, icon: '👨‍🍳' },
            { status: 'Saiu para entrega', done: false, current: false, icon: '🚀' },
            { status: 'Entregue', done: false, current: false, icon: '✅' },
          ].map((step, i) => (
            <motion.div
              key={step.status}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${step.done || step.current ? 'bg-primary-100 text-primary-600' : 'bg-dark-100 text-dark-400'}`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${step.done || step.current ? 'text-dark-900' : 'text-dark-500'}`}>{step.status}</p>
                {step.current && <span className="text-xs text-primary-600 font-medium">Agora</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
]

export function Demo() {
  const [activeScreen, setActiveScreen] = useState(0)

  return (
    <section id="demo" className="py-20 lg:py-32 bg-white relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/50 via-transparent to-accent-50/50" />

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-4">
            Teste a <span className="text-gradient">Demonstração</span> Completa
          </h2>
          <p className="text-lg text-dark-500">
            Navegue pelo fluxo real do cliente: montagem → carrinho → pagamento → rastreio
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className={`relative rounded-3xl overflow-hidden shadow-2xl ${demoScreens[activeScreen].bg}`}>
              <div className="absolute inset-0 bg-black/10" />

              <div className="relative z-10 h-[500px] sm:h-[550px] lg:h-[600px] flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-sm border-b border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium">{demoScreens[activeScreen].title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition-colors" />
                    <button className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition-colors" />
                    <button className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition-colors" />
                  </div>
                </div>

                <div className="flex-1 bg-white rounded-t-3xl rounded-b-none mt-[-1px] overflow-hidden">
                  {demoScreens[activeScreen].content}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {demoScreens.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveScreen(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeScreen === i
                      ? 'bg-primary-500 w-8'
                      : 'bg-dark-300 hover:bg-dark-400'
                  }`}
                  aria-label={`Ir para tela ${demoScreens[i].title}`}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            <div className="glass p-6 rounded-2xl text-center">
              <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-7 h-7 text-primary-600" />
              </div>
              <h4 className="font-semibold text-dark-900 mb-2">App Nativo</h4>
              <p className="text-sm text-dark-500">Android & iOS nas stores</p>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="w-14 h-14 rounded-xl bg-accent-100 flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-7 h-7 text-accent-600" />
              </div>
              <h4 className="font-semibold text-dark-900 mb-2">Link de Vendas</h4>
              <p className="text-sm text-dark-500">Funciona em qualquer navegador</p>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="w-14 h-14 rounded-xl bg-secondary-100 flex items-center justify-center mx-auto mb-4">
                <Tablet className="w-7 h-7 text-secondary-600" />
              </div>
              <h4 className="font-semibold text-dark-900 mb-2">Totem / Tablet</h4>
              <p className="text-sm text-dark-500">Modo quiosque para balcão</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link href="/demo" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              Abrir App Completo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-4 text-sm text-dark-500">Abre em nova aba • Dados fictícios • Reset a cada sessão</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}