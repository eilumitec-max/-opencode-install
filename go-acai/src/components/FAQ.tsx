'use client'

import { motion } from 'framer-motion'
import { HelpCircle, AlertCircle, CheckCircle, X } from 'lucide-react'

const faqs = [
  {
    q: 'Posso testar antes de contratar?',
    a: 'Sim! Você tem 7 dias grátis com acesso completo. Cadastre sua loja, configure, faça pedidos testes. Só cobramos após o período se você quiser continuar.',
  },
  {
    q: 'Preciso instalar algo no computador?',
    a: 'Não. Tudo roda na nuvem. Você acessa o painel pelo navegador (Chrome, Safari, Edge). Seus clientes usam o app no celular ou seu link de vendas.',
  },
  {
    q: 'Funciona no celular e tablet?',
    a: 'Sim. O painel é 100% responsivo. O app do cliente é um PWA (instalável como app no celular) e o link de vendas abre perfeitamente no mobile.',
  },
  {
    q: 'Tem contrato de fidelidade?',
    a: 'Zero fidelidade. Cancele quando quiser, sem multa, sem burocracia. Seu acesso permanece até o fim do período pago.',
  },
  {
    q: 'Como recebo os pagamentos?',
    a: 'Integrado ao Mercado Pago. PIX cai na hora, cartão em 1 dia útil. Vai direto pra sua conta Mercado Pago. Taxas são as do Mercado Pago.',
  },
  {
    q: 'Meus dados ficam seguros?',
    a: 'Sim. Criptografia ponta a ponta, LGPD, backups diários, servidores no Brasil, HTTPS obrigatório, tokens JWT, rate limiting, WAF.',
  },
  {
    q: 'Consigo migrar do WhatsApp/outro sistema?',
    a: 'Sim. Importamos seus produtos, clientes e categorias via planilha (CSV/Excel). Nossa equipe ajuda na migração gratuita.',
  },
  {
    q: 'E se eu tiver mais de uma loja?',
    a: 'Cada loja tem sua conta separada (multi-tenant). Painel master para ver tudo consolidado. Desconto progressivo a partir da 2ª loja.',
  },
  {
    q: 'O app vai na Play Store e App Store?',
    a: 'Sim! Publicamos com sua marca, seu ícone, suas cores. Cuidamos de todo processo: contas developer, builds, aprovação, updates.',
  },
  {
    q: 'Qual o suporte oferecido?',
    a: 'WhatsApp, Email, Chamados no painel. Horário comercial estendido. Onboarding guiado. Base de conhecimento. Vídeos tutoriais.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-32 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-dark-500">
            Não encontrou sua resposta? <a href="#contato" className="link">Fale com a gente</a>
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-dark-900 pr-4">{faq.q}</span>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary-500" />
                    <X className="w-5 h-5 text-primary-500 rotate-45 group-open:rotate-0 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-dark-600 leading-relaxed border-t border-dark-100">
                  {faq.a}
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}