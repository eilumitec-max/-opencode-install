import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Benefits } from '@/components/Benefits'
import { HowItWorks } from '@/components/HowItWorks'
import { Demo } from '@/components/Demo'
import { Testimonials } from '@/components/Testimonials'
import { Comparison } from '@/components/Comparison'
import { FAQ } from '@/components/FAQ'
import { Pricing } from '@/components/Pricing'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Benefits />
        <HowItWorks />
        <Demo />
        <Testimonials />
        <Comparison />
        <FAQ />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}