import { supabase } from './supabase'
import type { Tenant, TenantProduct, TenantCategory, TenantOrder } from './tenants'

type Row<T> = T extends TenantProduct ? any : T extends TenantCategory ? any : T extends TenantOrder ? any : any

function mapTenant(row: any): Tenant {
  return {
    id: row.id, slug: row.slug, name: row.name, logo: row.logo,
    primaryColor: row.primary_color, whatsapp: row.whatsapp, address: row.address,
    deliveryFee: row.delivery_fee, minOrder: row.min_order,
    workingHours: row.working_hours, installments: row.installments,
    pricePerKm: row.price_per_km || 0, latitude: row.latitude, longitude: row.longitude,
    cep: row.cep || '',
    products: [], categories: [], orders: [],
  }
}

export async function fetchTenantById(id: string): Promise<Tenant | null> {
  const { data, error } = await supabase.from('tenants').select('*').eq('id', id).single()
  if (error || !data) return null
  const tenant = mapTenant(data)
  const [products, categories, orders, deliveryZones] = await Promise.all([
    supabase.from('products').select('*').eq('tenant_id', id),
    supabase.from('categories').select('*').eq('tenant_id', id),
    supabase.from('orders').select('*').eq('tenant_id', id),
    supabase.from('delivery_zones').select('*').eq('tenant_id', id),
  ])
  if (products.data) tenant.products = products.data.map((r: any) => ({
    id: r.id, name: r.name, category: r.category, price: r.price,
    oldPrice: r.old_price, stock: r.stock, image: r.image || '',
    active: r.active, featured: r.featured, sales: r.sales,
  }))
  if (categories.data) tenant.categories = categories.data.map((r: any) => ({
    id: r.id, name: r.name, icon: r.icon, active: r.active, order: r.order,
  }))
  if (orders.data) tenant.orders = orders.data.map((r: any) => ({
    id: r.id, customer: r.customer, items: r.items, total: r.total,
    status: r.status, payment: r.payment, method: r.method, date: r.date, address: r.address,
  }))
  if (deliveryZones.data) tenant.deliveryZones = deliveryZones.data.map((r: any) => ({
    id: r.id, name: r.name, fee: r.fee, distanceKm: r.distance_km || 0, active: r.active,
  }))
  return tenant
}

export async function fetchTenantBySlug(slug: string): Promise<Tenant | null> {
  const { data, error } = await supabase.from('tenants').select('*').eq('slug', slug).single()
  if (error || !data) return null
  return fetchTenantById(data.id)
}

export async function upsertProduct(product: TenantProduct & { tenant_id: string }) {
  const { id, tenant_id, name, category, price, oldPrice, stock, active, featured, sales } = product
  const { error } = await supabase.from('products').upsert({
    id, tenant_id, name, category, price, old_price: oldPrice,
    stock, active, featured, sales,
  })
  return error
}

export async function deleteProductById(id: string, tenantId: string) {
  const { error } = await supabase.from('products').delete().match({ id, tenant_id: tenantId })
  return error
}

export async function upsertCategory(cat: TenantCategory & { tenant_id: string }) {
  const { error } = await supabase.from('categories').upsert({
    id: cat.id, tenant_id: cat.tenant_id, name: cat.name,
    icon: cat.icon, active: cat.active, order: cat.order,
  })
  return error
}

export async function deleteCategoryById(id: string, tenantId: string) {
  const { error } = await supabase.from('categories').delete().match({ id, tenant_id: tenantId })
  return error
}

export async function updateOrderStatus(id: string, status: string, tenantId: string) {
  const { error } = await supabase.from('orders').update({ status }).match({ id, tenant_id: tenantId })
  return error
}

export async function insertOrder(order: any) {
  const { error } = await supabase.from('orders').insert(order)
  return error
}

export async function deleteOrderById(id: string, tenantId: string) {
  const { error } = await supabase.from('orders').delete().match({ id, tenant_id: tenantId })
  return error
}

export async function upsertCustomer(customer: any) {
  const { error } = await supabase.from('customers').upsert(customer, { onConflict: 'phone' })
  return error
}

export async function fetchCustomerByPhone(phone: string) {
  const { data } = await supabase.from('customers').select('*').eq('phone', phone).single()
  return data
}

export async function fetchOrdersByTenant(tenantId: string): Promise<any[]> {
  const { data } = await supabase.from('orders').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false })
  return data || []
}

export async function fetchTenantSizes(tenantId: string): Promise<any[]> {
  const { data } = await supabase.from('sizes').select('*').eq('tenant_id', tenantId).order('order')
  return data || []
}

export async function upsertSize(size: any) {
  const { error } = await supabase.from('sizes').upsert(size)
  return error
}

export async function deleteSizeById(id: string, tenantId: string) {
  const { error } = await supabase.from('sizes').delete().match({ id, tenant_id: tenantId })
  return error
}

export async function fetchTenantTypes(tenantId: string): Promise<any[]> {
  const { data } = await supabase.from('types').select('*').eq('tenant_id', tenantId).order('order')
  return data || []
}

export async function upsertType(type: any) {
  const { error } = await supabase.from('types').upsert(type)
  return error
}

export async function deleteTypeById(id: string, tenantId: string) {
  const { error } = await supabase.from('types').delete().match({ id, tenant_id: tenantId })
  return error
}

export async function fetchTenantPaymentMethods(tenantId: string): Promise<any[]> {
  const { data } = await supabase.from('payment_methods').select('*').eq('tenant_id', tenantId)
  return data || []
}

export async function upsertPaymentMethod(pm: any) {
  const { error } = await supabase.from('payment_methods').upsert(pm)
  return error
}

export async function deletePaymentMethodById(id: string, tenantId: string) {
  const { error } = await supabase.from('payment_methods').delete().match({ id, tenant_id: tenantId })
  return error
}

export async function updateTenant(tenantId: string, fields: Record<string, any>) {
  const { error } = await supabase.from('tenants').update(fields).eq('id', tenantId)
  return error
}

export async function fetchDeliveryZones(tenantId: string): Promise<any[]> {
  const { data } = await supabase.from('delivery_zones').select('*').eq('tenant_id', tenantId)
  return data || []
}

export async function upsertDeliveryZone(zone: any) {
  const { error } = await supabase.from('delivery_zones').upsert(zone)
  return error
}

export async function deleteDeliveryZoneById(id: string, tenantId: string) {
  const { error } = await supabase.from('delivery_zones').delete().match({ id, tenant_id: tenantId })
  return error
}
