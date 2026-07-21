import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import InstallPrompt from '@/components/InstallPrompt'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'GO AÇAÍ - Seu Aplicativo Delivery em Minutos',
    template: '%s | GO AÇAÍ',
  },
  description: 'Tenha seu próprio aplicativo de delivery para açaí, sorveterias e gelaterias. Teste grátis por 7 dias. R$ 29,90/mês sem fidelidade.',
  keywords: ['delivery açaí', 'aplicativo sorveteria', 'sistema delivery', 'app açaí', 'gestão sorveteria', 'mercado pago delivery'],
  authors: [{ name: 'GO AÇAÍ' }],
  creator: 'GO AÇAÍ',
  publisher: 'GO AÇAÍ',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://goacai.com.br',
    siteName: 'GO AÇAÍ',
    title: 'GO AÇAÍ - Seu Aplicativo Delivery em Minutos',
    description: 'Tenha seu próprio aplicativo de delivery para açaí, sorveterias e gelaterias. Teste grátis por 7 dias.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GO AÇAÍ - Aplicativo Delivery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GO AÇAÍ - Seu Aplicativo Delivery em Minutos',
    description: 'Tenha seu próprio aplicativo de delivery para açaí, sorveterias e gelaterias. Teste grátis por 7 dias.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/apple-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta httpEquiv="content-language" content="pt-BR" />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}` }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <InstallPrompt />
      </body>
    </html>
  )
}