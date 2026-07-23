'use client'

import { useState } from 'react'
import { 
  Store, MapPin, Clock, DollarSign, Bell, Shield, 
  Palette, Globe, Save, CheckCircle, Loader2
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const tabs = [
    { id: 'general', label: 'Geral', icon: Store },
    { id: 'delivery', label: 'Entrega', icon: Truck },
    { id: 'payments', label: 'Pagamentos', icon: DollarSign },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'security', label: 'Segurança', icon: Shield },
  ]

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Configurações</h1>
          <p className="text-neutral-500 mt-1">Gerencie as configurações da sua plataforma</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Salvo!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar alterações
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card>
        <div className="p-6">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'delivery' && <DeliverySettings />}
          {activeTab === 'payments' && <PaymentsSettings />}
          {activeTab === 'notifications' && <NotificationsSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </Card>
    </div>
  )
}

function GeneralSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-lg font-semibold text-neutral-900">Informações Básicas</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Nome da plataforma" placeholder="Foodie" defaultValue="Foodie" />
        <Input label="Subdomínio" placeholder="foodie" defaultValue="foodie" />
      </div>
      
      <Input label="Descrição" placeholder="Descreva sua plataforma de delivery" defaultValue="A melhor plataforma de delivery de comida da região" />
      
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="E-mail de contato" type="email" placeholder="contato@foodie.com" defaultValue="contato@foodie.com" />
        <Input label="Telefone" placeholder="(11) 99999-9999" defaultValue="(11) 99999-9999" />
      </div>
      
      <Input label="Endereço da sede" placeholder="Rua, número, bairro, cidade, estado" defaultValue="Av. Paulista, 1000 - Bela Vista, São Paulo - SP" />
      
      <div className="grid md:grid-cols-3 gap-4">
        <Input label="CNPJ" placeholder="00.000.000/0000-00" defaultValue="12.345.678/0001-90" />
        <Input label="Inscrição Estadual" placeholder="Isento" defaultValue="Isento" />
        <Input label="Inscrição Municipal" placeholder="123456" defaultValue="123456" />
      </div>

      <h2 className="text-lg font-semibold text-neutral-900 mt-8">Horário de Funcionamento</h2>
      <div className="space-y-3">
        {['Segunda a Sexta', 'Sábado', 'Domingo'].map((day) => (
          <div key={day} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl">
            <span className="font-medium text-neutral-900 w-32">{day}</span>
            <div className="flex-1 flex gap-2">
              <Input placeholder="Abertura" defaultValue={day === 'Domingo' ? '11:00' : '10:00'} className="w-24" />
              <span className="self-center text-neutral-500">até</span>
              <Input placeholder="Fechamento" defaultValue={day === 'Sábado' ? '00:00' : '23:00'} className="w-24" />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked={day !== 'Domingo'} />
              <span className="text-sm text-neutral-700">Fechado</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

function DeliverySettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-lg font-semibold text-neutral-900">Configurações de Entrega</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Taxa de entrega padrão" type="number" step="0.01" placeholder="5.90" defaultValue="5.90" />
        <Input label="Pedido mínimo para entrega" type="number" step="0.01" placeholder="15.00" defaultValue="15.00" />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Tempo médio de entrega (min)" type="number" placeholder="35" defaultValue="35" />
        <Input label="Raio de entrega (km)" type="number" step="0.1" placeholder="10" defaultValue="10" />
      </div>
      
      <h3 className="font-medium text-neutral-900">Taxas por distância</h3>
      <div className="space-y-3">
        {[
          { from: 0, to: 3, fee: 3.90 },
          { from: 3, to: 6, fee: 5.90 },
          { from: 6, to: 10, fee: 8.90 },
        ].map((range, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
            <span className="w-24 font-medium text-neutral-700">{range.from}-{range.to} km</span>
            <Input label="Taxa" type="number" step="0.01" placeholder="0.00" defaultValue={range.fee.toFixed(2)} className="w-32" />
            <span className="text-sm text-neutral-500">por pedido</span>
          </div>
        ))}
        <Button variant="outline" size="sm">+ Adicionar faixa</Button>
      </div>

      <h3 className="font-medium text-neutral-900 mt-8">Opções de Retirada</h3>
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <span className="text-neutral-700">Permitir retirada no local</span>
        </label>
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <span className="text-neutral-700">Mostrar tempo de preparo na retirada</span>
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Tempo mínimo para retirada (min)" type="number" placeholder="15" defaultValue="15" />
          <Input label="Tempo máximo para retirada (min)" type="number" placeholder="45" defaultValue="45" />
        </div>
      </div>
    </div>
  )
}

function PaymentsSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-lg font-semibold text-neutral-900">Métodos de Pagamento</h2>
      
      <div className="space-y-3">
        {[
          { id: 'pix', name: 'PIX', desc: 'Pagamento instantâneo via PIX', icon: '📱', enabled: true },
          { id: 'credit_card', name: 'Cartão de Crédito', desc: 'Visa, Mastercard, Elo, Amex', icon: '💳', enabled: true },
          { id: 'debit_card', name: 'Cartão de Débito', desc: 'Pagamento à vista no débito', icon: '💳', enabled: true },
          { id: 'cash', name: 'Dinheiro', desc: 'Pagamento na entrega', icon: '💵', enabled: true },
          { id: 'apple_pay', name: 'Apple Pay', desc: 'Pagamento via Apple Pay', icon: '🍎', enabled: false },
          { id: 'google_pay', name: 'Google Pay', desc: 'Pagamento via Google Pay', icon: '🤖', enabled: false },
        ].map((method) => (
          <label key={method.id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" 
              defaultChecked={method.enabled}
            />
            <span className="text-2xl">{method.icon}</span>
            <div className="flex-1">
              <p className="font-medium text-neutral-900">{method.name}</p>
              <p className="text-sm text-neutral-500">{method.desc}</p>
            </div>
            <Badge variant={method.enabled ? 'success' : 'neutral'} size="sm">
              {method.enabled ? 'Ativo' : 'Inativo'}
            </Badge>
          </label>
        ))}
      </div>

      <h3 className="font-medium text-neutral-900 mt-8">Configurações de Taxas</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Taxa cartão de crédito (%)" type="number" step="0.01" placeholder="3.99" defaultValue="3.99" />
        <Input label="Taxa cartão de débito (%)" type="number" step="0.01" placeholder="1.99" defaultValue="1.99" />
        <Input label="Taxa PIX (%)" type="number" step="0.01" placeholder="0.99" defaultValue="0.99" />
        <Input label="Valor fixo por transação" type="number" step="0.01" placeholder="0.39" defaultValue="0.39" />
      </div>

      <h3 className="font-medium text-neutral-900 mt-8">Parcelamento</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <Input label="Máx. parcelas sem juros" type="number" placeholder="3" defaultValue="3" />
        <Input label="Máx. parcelas com juros" type="number" placeholder="12" defaultValue="12" />
        <Input label="Juros ao mês (%)" type="number" step="0.01" placeholder="2.99" defaultValue="2.99" />
      </div>
    </div>
  )
}

function NotificationsSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-lg font-semibold text-neutral-900">Notificações Push</h2>
      
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <div>
            <p className="font-medium text-neutral-900">Notificações de pedido</p>
            <p className="text-sm text-neutral-500">Confirmado, preparando, saiu para entrega, entregue</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <div>
            <p className="font-medium text-neutral-900">Promoções e ofertas</p>
            <p className="text-sm text-neutral-500">Cupons, descontos, novidades</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
          <div>
            <p className="font-medium text-neutral-900">Lembretes de reordenação</p>
            <p className="text-sm text-neutral-500">Sugerir pedir novamente após X dias</p>
          </div>
        </label>
      </div>

      <h3 className="font-medium text-neutral-900 mt-8">E-mail</h3>
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <div>
            <p className="font-medium text-neutral-900">Confirmação de pedido por e-mail</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <div>
            <p className="font-medium text-neutral-900">Recibo por e-mail</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
          <div>
            <p className="font-medium text-neutral-900">Newsletter semanal</p>
          </div>
        </label>
      </div>

      <h3 className="font-medium text-neutral-900 mt-8">SMS / WhatsApp</h3>
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <div>
            <p className="font-medium text-neutral-900">Código de verificação por SMS</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
          <div>
            <p className="font-medium text-neutral-900">Atualizações de pedido por WhatsApp</p>
          </div>
        </label>
      </div>
    </div>
  )
}

function AppearanceSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-lg font-semibold text-neutral-900">Tema e Cores</h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        <label className="block">
          <span className="block text-sm font-medium text-neutral-700 mb-1">Cor primária</span>
          <input type="color" className="w-full h-12 rounded-xl border border-neutral-200 cursor-pointer" defaultValue="#f97316" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-neutral-700 mb-1">Cor secundária</span>
          <input type="color" className="w-full h-12 rounded-xl border border-neutral-200 cursor-pointer" defaultValue="#eab308" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-neutral-700 mb-1">Cor de sucesso</span>
          <input type="color" className="w-full h-12 rounded-xl border border-neutral-200 cursor-pointer" defaultValue="#22c55e" />
        </label>
      </div>

      <h3 className="font-medium text-neutral-900 mt-8">Logo e Favicon</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-300">
          <p className="text-sm text-neutral-500 mb-2">Logo principal (SVG/PNG, máx. 200KB)</p>
          <input type="file" accept="image/*" className="w-full" />
        </div>
        <div className="p-4 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-300">
          <p className="text-sm text-neutral-500 mb-2">Favicon (ICO/PNG, 32x32)</p>
          <input type="file" accept="image/*" className="w-full" />
        </div>
      </div>

      <h3 className="font-medium text-neutral-900 mt-8">Modo Escuro</h3>
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <div>
            <p className="font-medium text-neutral-900">Permitir modo escuro</p>
            <p className="text-sm text-neutral-500">Usuários podem alternar entre claro/escuro</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
          <div>
            <p className="font-medium text-neutral-900">Modo escuro por padrão</p>
            <p className="text-sm text-neutral-500">Baseado na preferência do sistema</p>
          </div>
        </label>
      </div>

      <h3 className="font-medium text-neutral-900 mt-8">Idiomas</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm font-medium text-neutral-700 mb-1">Idioma padrão</span>
          <select className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-neutral-700 mb-1">Idiomas disponíveis</span>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm">
              <input type="checkbox" className="w-3.5 h-3.5" defaultChecked /> PT-BR
            </label>
            <label className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-sm">
              <input type="checkbox" className="w-3.5 h-3.5" /> EN
            </label>
            <label className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-sm">
              <input type="checkbox" className="w-3.5 h-3.5" /> ES
            </label>
          </div>
        </label>
      </div>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-lg font-semibold text-neutral-900">Autenticação</h2>
      
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <div>
            <p className="font-medium text-neutral-900">Autenticação de dois fatores (2FA)</p>
            <p className="text-sm text-neutral-500">Obrigatório para administradores</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <div>
            <p className="font-medium text-neutral-900">Login com Google</p>
            <p className="text-sm text-neutral-500">Permitir OAuth do Google</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
          <div>
            <p className="font-medium text-neutral-900">Login com Apple</p>
            <p className="text-sm text-neutral-500">Permitir Sign in with Apple</p>
          </div>
        </label>
      </div>

      <h3 className="font-medium text-neutral-900 mt-8">Sessão</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Tempo de expiração (dias)" type="number" placeholder="30" defaultValue="30" />
        <Input label="Tempo de inatividade (minutos)" type="number" placeholder="60" defaultValue="60" />
      </div>

      <h3 className="font-medium text-neutral-900 mt-8">API e Integrações</h3>
      <div className="space-y-4">
        <div className="p-4 bg-neutral-50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium text-neutral-900">Chave da API Pública</p>
              <p className="text-sm text-neutral-500">Usada para integrações frontend</p>
            </div>
            <Button variant="outline" size="sm">Copiar</Button>
          </div>
          <code className="text-sm bg-neutral-200 px-3 py-2 rounded-lg font-mono">pk_live_••••••••••••••••••••••••</code>
        </div>
        <div className="p-4 bg-neutral-50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium text-neutral-900">Chave Secreta da API</p>
              <p className="text-sm text-neutral-500">Nunca compartilhe esta chave</p>
            </div>
            <Button variant="outline" size="sm">Regenerar</Button>
          </div>
          <code className="text-sm bg-neutral-200 px-3 py-2 rounded-lg font-mono">sk_live_••••••••••••••••••••••••••••••••••••••••••••</code>
        </div>
        <div className="p-4 bg-neutral-50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium text-neutral-900">Webhook Secret</p>
              <p className="text-sm text-neutral-500">Para validação de webhooks</p>
            </div>
            <Button variant="outline" size="sm">Regenerar</Button>
          </div>
          <code className="text-sm bg-neutral-200 px-3 py-2 rounded-lg font-mono">whsec_••••••••••••••••••••••••••••••••••••••••••••</code>
        </div>
      </div>

      <h3 className="font-medium text-neutral-900 mt-8">LGPD e Privacidade</h3>
      <div className="space-y-3">
        <Input label="URL da Política de Privacidade" placeholder="https://foodie.com/privacidade" defaultValue="https://foodie.com/privacidade" />
        <Input label="URL dos Termos de Uso" placeholder="https://foodie.com/termos" defaultValue="https://foodie.com/termos" />
        <Input label="E-mail do DPO (Encarregado de Dados)" placeholder="dpo@foodie.com" defaultValue="dpo@foodie.com" />
      </div>

      <h3 className="font-medium text-neutral-900 mt-8">Logs de Auditoria</h3>
      <div className="p-4 bg-neutral-50 rounded-xl">
        <p className="text-sm text-neutral-600 mb-3">Visualize as últimas ações realizadas no painel administrativo</p>
        <Button variant="outline" size="sm">Ver logs completos</Button>
      </div>
    </div>
  )
}

// Need to import Truck for DeliverySettings
import { Truck } from 'lucide-react'