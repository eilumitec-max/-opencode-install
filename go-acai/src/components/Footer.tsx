import Link from 'next/link'
import { ShoppingBag, Facebook, Instagram, WhatsApp, Mail, MapPin, Phone, ArrowRight, ArrowUp } from 'lucide-react'

const footerLinks = {
  produto: [
    { label: 'Início', href: '/' },
    { label: 'Plano', href: '#precos' },
    { label: 'Demonstração', href: '#demo' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Benefícios', href: '#beneficios' },
    { label: 'Comparativo', href: '#comparativo' },
  ],
  empresa: [
    { label: 'Sobre Nós', href: '#sobre' },
    { label: 'Blog', href: '/blog' },
    { label: 'Carreiras', href: '/carreiras' },
    { label: 'Imprensa', href: '/imprensa' },
    { label: 'Parceiros', href: '/parceiros' },
  ],
  suporte: [
    { label: 'Central de Ajuda', href: '/ajuda' },
    { label: 'Documentação', href: '/docs' },
    { label: 'API', href: '/api-docs' },
    { label: 'Status do Sistema', href: '/status' },
    { label: 'Contato', href: '#contato' },
  ],
  legal: [
    { label: 'Política de Privacidade', href: '/privacidade' },
    { label: 'Termos de Uso', href: '/termos' },
    { label: 'LGPD', href: '/lgpd' },
    { label: 'Cookies', href: '/cookies' },
    { label: 'Segurança', href: '/seguranca' },
  ],
}

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/goacai', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/goacai', label: 'Facebook' },
  { icon: WhatsApp, href: 'https://wa.me/5511999999999', label: 'WhatsApp' },
  { icon: Mail, href: 'mailto:oi@goacai.com.br', label: 'E-mail' },
]

export function Footer() {
  return (
    <footer id="contato" className="bg-dark-900 text-dark-100 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom py-16 lg:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-display font-bold text-white mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span>GO AÇAÍ</span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed mb-6 max-w-xs">
              O sistema de delivery completo para açaí, sorveterias e gelaterias.
              Seu app próprio, sem taxa por pedido, sem fidelidade.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-dark-300 hover:bg-primary-500/20 hover:text-primary-400 hover:border-primary-500/50 border border-dark-700 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <nav className="lg:col-span-1" aria-label="Produto">
            <h4 className="font-semibold text-white mb-4">Produto</h4>
            <ul className="space-y-3">
              {footerLinks.produto.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-dark-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group"
                  >
                    {link.label}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-1" aria-label="Empresa">
            <h4 className="font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-dark-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group"
                  >
                    {link.label}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-1" aria-label="Suporte">
            <h4 className="font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-3">
              {footerLinks.suporte.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-dark-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group"
                  >
                    {link.label}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-1" aria-label="Legal">
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-dark-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group"
                  >
                    {link.label}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-1">
            <h4 className="font-semibold text-white mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-dark-400">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>São Paulo - SP</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="tel:+5511999999999" className="hover:text-primary-400 transition-colors">
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="mailto:oi@goacai.com.br" className="hover:text-primary-400 transition-colors">
                  oi@goacai.com.br
                </a>
              </li>
              <li className="flex items-center gap-3">
                <WhatsApp className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="hover:text-secondary-400 transition-colors">
                  WhatsApp Comercial
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <p className="text-dark-500 text-sm">
              © 2024 GO AÇAÍ. Todos os direitos reservados.
            </p>

            <div className="flex items-center gap-6 text-sm text-dark-500">
              <span>Feito com <span className="text-red-400">♥</span> para donos de açaí</span>
              <span className="hidden sm:inline">|</span>
              <Link href="/privacidade" className="hover:text-primary-400 transition-colors">Privacidade</Link>
              <Link href="/termos" className="hover:text-primary-400 transition-colors">Termos</Link>
              <Link href="/lgpd" className="hover:text-primary-400 transition-colors">LGPD</Link>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-dark-500">CNPJ: 12.345.678/0001-90</span>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">HTTPS</span>
                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">LGPD</span>
                <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">PCI DSS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors opacity-0 invisible group"
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </footer>
  )
}