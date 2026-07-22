'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react'

const testimonials = [
  {
    quote: 'Depois que comecei usar a GO AÇAÍ meus pedidos aumentaram muito. O app é lindo, clientes montam a tigela sozinhos. Painel mostra tudo em tempo real.',
    author: 'Carlos Mendes',
    role: 'Sócio - Açaí Point',
    location: 'Rio de Janeiro - RJ',
    avatar: 'CM',
    stars: 5,
  },
  {
    quote: 'Muito fácil de usar. Configurei tudo em 30 min. Meus clientes amam o link de vendas no WhatsApp. Pedido cai direto na cozinha, sem erro.',
    author: 'Ana Paula Lima',
    role: 'Dona - Gelateria Bella',
    location: 'Belo Horizonte - MG',
    avatar: 'AP',
    stars: 5,
  },
  {
    quote: 'Vale cada centavo. Antes perdia tempo no WhatsApp, anotava errado, cliente reclamava. Agora é automático. App PWA passou credibilidade.',
    author: 'Roberto Silva',
    role: 'Gerente - Sorveteiro do Bairro',
    location: 'Curitiba - PR',
    avatar: 'RS',
    stars: 5,
  },
  {
    quote: 'Meu delivery ficou profissional. O painel mostra pedidos em tempo real, sei exatamente o que está acontecendo na cozinha.',
    author: 'Fernanda Costa',
    role: 'Proprietária - Açaí da Nanda',
    location: 'Porto Alegre - RS',
    avatar: 'FC',
    stars: 5,
  },
  {
    quote: 'Suporte incrível. Tive dúvida na configuração, me atenderam no WhatsApp em 5 min. Migração do antigo sistema foi tranquila.',
    author: 'Lucas Oliveira',
    role: 'Sócio - Frutaçaí',
    location: 'Salvador - BA',
    avatar: 'LO',
    stars: 5,
  },
  {
    quote: 'O app é muito prático. Cliente monta o pedido sozinho, escolhe coberturas, frutas, tudo visual. Meu ticket médio aumentou.',
    author: 'Juliana Santos',
    role: 'Dona - Açaí da Ju',
    location: 'Fortaleza - CE',
    avatar: 'JS',
    stars: 5,
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section id="depoimentos" className="py-20 lg:py-32 bg-dark-50 relative">
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
            Depoimentos de clientes
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-4">
            O que <span className="text-gradient">donos de loja</span> dizem
          </h2>
          <p className="text-lg text-dark-500">
            Veja o que alguns donos de açaí e sorveteria estão falando.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              layout
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="w-[calc(100%/3)] px-3 flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="glass h-full rounded-2xl p-6 lg:p-8 flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${i < testimonial.stars ? 'text-accent-400 fill-current' : 'text-dark-200'}`}
                        />
                      ))}
                    </div>

                    <Quote className="w-10 h-10 text-primary-200 mb-4" />

                    <blockquote className="text-dark-700 leading-relaxed mb-6 flex-1">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>

                    <div className="border-t border-dark-200 pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center text-white font-bold text-lg">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-dark-900">{testimonial.author}</p>
                          <p className="text-sm text-dark-500">{testimonial.role}</p>
                          <p className="text-xs text-dark-400">{testimonial.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full glass border border-dark-200 flex items-center justify-center hover:bg-primary-50 hover:border-primary-200 transition-all"
              aria-label="Depoimento anterior"
            >
              <ArrowLeft className="w-5 h-5 text-dark-600" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentIndex
                      ? 'bg-primary-500 w-8'
                      : 'bg-dark-300 hover:bg-dark-400'
                  }`}
                  aria-label={`Ir para depoimento ${i + 1}`}
                  aria-current={i === currentIndex}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full glass border border-dark-200 flex items-center justify-center hover:bg-primary-50 hover:border-primary-200 transition-all"
              aria-label="Próximo depoimento"
            >
              <ArrowRight className="w-5 h-5 text-dark-600" />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-display font-bold text-dark-900">R$ 0</p>
                <p className="text-sm text-dark-500">Taxa por Pedido</p>
              </div>
              <div className="w-px h-8 bg-dark-200" />
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-display font-bold text-dark-900">7 Dias</p>
                <p className="text-sm text-dark-500">Teste Grátis</p>
              </div>
              <div className="w-px h-8 bg-dark-200" />
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-display font-bold text-dark-900">Zero</p>
                <p className="text-sm text-dark-500">Fidelidade</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}