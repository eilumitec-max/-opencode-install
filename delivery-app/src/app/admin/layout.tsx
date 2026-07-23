'use client'

import { useState } from 'react'
import { 
  LayoutDashboard, Store, Package, ShoppingBag, Tag, 
  Settings, Users, BarChart2, LogOut, Menu, X, ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/components/ui/Button'
import { mockUser } from '@/lib/mock-data.tsx'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Restaurantes', href: '/admin/restaurants', icon: Store },
  { name: 'Produtos', href: '/admin/products', icon: Package },
  { name: 'Pedidos', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Categorias', href: '/admin/categories', icon: Tag },
  { name: 'Configurações', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-white border-r border-neutral-200 z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="p-4 border-b border-neutral-200">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-neutral-900">Foodie Admin</h1>
                <p className="text-xs text-neutral-500">Painel de controle</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User section */}
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 truncate">{mockUser.name}</p>
              <p className="text-xs text-neutral-500 truncate">{mockUser.email}</p>
            </div>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          
          {userMenuOpen && (
            <div className="mt-3 py-2 border-t border-neutral-100">
              <Link href="/admin/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors">
                <Settings className="w-4 h-4" />
                Configurações
              </Link>
              <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Ver site
              </Link>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-neutral-200 z-30">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:hidden">
              <h1 className="font-semibold text-neutral-900">Admin</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-xl text-sm text-neutral-600">
                <Users className="w-4 h-4" />
                <span>{mockUser.name}</span>
              </div>
              
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="relative p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* User dropdown for desktop */}
      {userMenuOpen && (
        <div className="fixed top-16 right-6 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50 animate-scale-in lg:block">
          <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
            <Settings className="w-4 h-4" />
            Configurações
          </Link>
          <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
            <LayoutDashboard className="w-4 h-4" />
            Ver site
          </Link>
          <hr className="my-2 border-neutral-100" />
          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}