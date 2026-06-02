import { isSupabaseConfigured, supabase } from './supabase'

const productColumns = 'id, name, category, sku, price, old_price, stock, status, unit, badge, image_url'

function mapProduct(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    sku: product.sku,
    price: Number(product.price),
    oldPrice: product.old_price ? Number(product.old_price) : undefined,
    stock: product.stock,
    status: product.status,
    unit: product.unit,
    badge: product.badge || undefined,
    image: product.image_url,
  }
}

export async function loadPublicProducts() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('products')
    .select(productColumns)
    .eq('status', 'active')
    .gt('stock', 0)
    .order('id')

  if (error) throw error
  return data.map(mapProduct)
}

export async function loadAdminProducts() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('products')
    .select(productColumns)
    .order('id')

  if (error) throw error
  return data.map(mapProduct)
}

export async function createAdminProduct(product) {
  if (!supabase) return { ...product, id: Date.now() }

  const { data, error } = await supabase
    .from('products')
    .insert({
      name: product.name,
      category: product.category,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      status: product.status,
      unit: product.unit,
      image_url: product.image,
    })
    .select(productColumns)
    .single()

  if (error) throw error
  return mapProduct(data)
}

export async function removeAdminProducts(ids) {
  if (!supabase || !ids.length) return

  const { error } = await supabase.from('products').delete().in('id', ids)
  if (error) throw error
}

export async function subscribeToNewsletter(email) {
  if (!supabase) return { demo: true }

  const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
    body: { email },
  })

  if (error) throw error
  return data
}

export async function createStorefrontOrder(customer, items) {
  if (!supabase) {
    throw new Error('Supabase chưa được cấu hình. Hãy thêm biến môi trường trước khi tạo đơn hàng.')
  }

  const { data, error } = await supabase.functions.invoke('create-order', {
    body: {
      customer,
      items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
    },
  })

  if (error) throw error
  return data
}

export async function signInAdmin(email, password) {
  if (!supabase) return null

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.session
}

export async function signOutAdmin() {
  if (!supabase) return

  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getAdminSession() {
  if (!supabase) return null

  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function checkAdminAccess() {
  if (!supabase) return true

  const { data, error } = await supabase.from('admin_users').select('user_id').maybeSingle()
  if (error) throw error
  return Boolean(data)
}

export { isSupabaseConfigured }
