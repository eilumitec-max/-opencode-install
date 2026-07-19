'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Smartphone, Utensils, Coffee, Heart, Star, Plus, CreditCard, Package, Zap, ShoppingBag, Users, Layers, Tag, BarChart3, Settings, MapPin, Clock, Megaphone, LayoutDashboard, QrCode, Palette, Shield, Globe, Monitor, Tablet } from 'lucide-react'

const appFlow = [
  {
    step: 1,
    icon: Smartphone,
    title: 'Tela Inicial',
    desc: 'Seu logo, banner, promoções. Cliente abre e já vê o cardápio.',
  },
  {
    step: 2,
    icon: Utensils,
    title: 'Escolhe: Tigela ou Copo',
    desc: 'Interface visual, fotos reais. Um toque para selecionar.',
  },
  {
    step: 3,
    icon: Coffee,
    title: 'Tamanho & Base',
    desc: '300ml, 500ml, 700ml, 1L. Açaí tradicional, zero, creme, sorvete.',
  },
  {
    step: 4,
    icon: Heart,
    title: 'Coberturas',
    desc: 'Leite condensado, Nutella, chocolate, caramelo, leite em pó...',
  },
  {
    step: 5,
    icon: Star,
    title: 'Frutas & Complementos',
    desc: 'Banana, morango, kiwi, uva, manga + granola, paçoca, castanha, Ovomaltine.',
  },
  {
    step: 6,
    icon: Plus,
    title: 'Resumo & Carrinho',
    desc: 'Visualiza tudo, ajusta quantidades, adiciona observações.',
  },
  {
    step: 7,
    icon: CreditCard,
    title: 'Checkout Inteligente',
    desc: 'Entrega/Retirada → PIX/Cartão/Dinheiro → Endereço salvo → Confirmar.',
  },
  {
    step: 8,
    icon: Package,
    title: 'Acompanhamento Real',
    desc: 'Recebido → Preparando → Saiu pra entrega → Entregue. Notificação em cada etapa.',
  },
]

const adminModules = [
  { icon: BarChart3, title: 'Dashboard', desc: 'Pedidos, faturamento, ticket médio, top produtos, clientes novos' },
  { icon: ShoppingBag, title: 'Produtos', desc: 'Cadastro completo: fotos, preços, estoque, categorias, opcionais' },
  { icon: Layers, title: 'Categorias', desc: 'Organize: Açaí, Sorvete, Acompanhamentos, Bebidas, Combos' },
  { icon: Package, title: 'Pedidos', desc: 'Gestão total: status, impressão, histórico, cancelamento, reembolso' },
  { icon: Users, title: 'Clientes', desc: 'Cadastro, histórico, favoritos, fidelidade, aniversariantes, segmentação' },
  { icon: Tag, title: 'Promoções', desc: 'Cupons, frete grátis, desconto progressivo, primeira compra, validade' },
  { icon: BarChart3, title: 'Relatórios', desc: 'Vendas por período, produto, hora, entregador, forma pagamento' },
  { icon: CreditCard, title: 'Financeiro', desc: 'Recebíveis, split, antecipação, conciliação, extrato Mercado Pago' },
  { icon: Truck, title: 'Entregadores', desc: 'Cadastro, rotas, rastreio, avaliação, comissão, documento' },
  { icon: Settings, title: 'Configurações', desc: 'Horários, área entrega, taxas, impressoras, integrações, LGPD' },
  { icon: QrCode, title: 'QR Code', desc: 'Mesa, balcão, delivery. Um QR para cada ponto de venda' },
  { icon: Globe, title: 'Banner & Tema', desc: 'Hero, cores, fontes, modo escuro, sazonal (Natal, Páscoa)' },
  { icon: MapPin, title: 'Área de Entrega', desc: 'Desenhe no mapa, taxa por km/região, tempo estimado' },
  { icon: Clock, title: 'Horários', desc: 'Funcionamento, agendamento, preparo, feriados, exceções' },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 lg:py-32 bg-dark-50 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary-50/30 to-transparent" />

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            Fluxo Completo
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-4">
            Do primeiro toque ao <span className="text-gradient">pedido entregue</span>
          </h2>
          <p className="text-lg text-dark-500">
            Tudo pensado para seu cliente montar o pedido perfeito em segundos.
            E você gerenciar tudo em um painel único.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-2 border-primary-200/50 rounded-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start"
          >
            <div className="relative z-10 space-y-6">
              {appFlow.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-dark-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300 group"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center text-white font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <step.icon className="w-5 h-5 text-primary-500" aria-hidden="true" />
                      <h4 className="font-semibold text-dark-900">{step.title}</h4>
                    </div>
                    <p className="text-sm text-dark-500">{step.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary-400 group-hover:text-primary-600 transition-colors mt-1" />
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-display font-bold text-dark-900 mb-6 flex items-center gap-3">
                <LayoutDashboard className="w-8 h-8 text-primary-500" />
                Painel Administrativo Completo
              </h3>
              <div className="grid gap-4">
                {adminModules.map((module, index) => (
                  <motion.div
                    key={module.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="p-4 bg-white rounded-xl border border-dark-100 hover:border-primary-200 hover:shadow-md transition-all group"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        <module.icon className="w-5 h-5 text-primary-600 group-hover:text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-dark-900 truncate">{module.title}</h4>
                        <p className="text-sm text-dark-500">{module.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}