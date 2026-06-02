import { isSupabaseConfigured, supabase } from './supabase'

const productColumns = 'id, name, category, sku, price, old_price, stock, status, unit, badge, image_url, manufacturer, vendor, warehouse, product_type'
const categoryColumns = 'id, parent_id, name, slug, description, image_url, active, show_on_home, include_in_menu, display_order, home_display_order'

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
    manufacturer: product.manufacturer || 'LyLy Market',
    vendor: product.vendor || 'LyLy Market',
    warehouse: product.warehouse || 'Main Store',
    productType: product.product_type || 'Grocery',
  }
}

function productPayload(product) {
  return {
    ...(product.id ? { id: product.id } : {}),
    name: product.name,
    category: product.category,
    sku: product.sku,
    price: product.price,
    old_price: product.oldPrice || null,
    stock: product.stock,
    status: product.status,
    unit: product.unit,
    badge: product.badge || null,
    image_url: product.image,
    manufacturer: product.manufacturer || 'LyLy Market',
    vendor: product.vendor || 'LyLy Market',
    warehouse: product.warehouse || 'Main Store',
    product_type: product.productType || 'Grocery',
  }
}

function mapCategory(category) {
  return {
    id: category.id,
    parentId: category.parent_id,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    image: category.image_url || '',
    active: category.active,
    showOnHome: category.show_on_home,
    includeInMenu: category.include_in_menu,
    displayOrder: category.display_order,
    homeDisplayOrder: category.home_display_order,
  }
}

export async function loadPublicCategories() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('categories')
    .select(categoryColumns)
    .eq('active', true)
    .order('display_order')
    .order('name')

  if (error) throw error
  return data.map(mapCategory)
}

export async function loadAdminCategories() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('categories')
    .select(categoryColumns)
    .order('display_order')
    .order('name')

  if (error) throw error
  return data.map(mapCategory)
}

export async function createAdminCategory(category) {
  if (!supabase) return { ...category, id: Date.now() }

  const { data, error } = await supabase
    .from('categories')
    .insert({
      parent_id: category.parentId || null,
      name: category.name,
      slug: category.slug,
      description: category.description || null,
      image_url: category.image || null,
      active: category.active,
      show_on_home: category.showOnHome,
      include_in_menu: category.includeInMenu,
      display_order: category.displayOrder,
      home_display_order: category.homeDisplayOrder,
    })
    .select(categoryColumns)
    .single()

  if (error) throw error
  return mapCategory(data)
}

export async function updateAdminCategory(category) {
  if (!supabase) return category

  const { data, error } = await supabase
    .from('categories')
    .update({
      parent_id: category.parentId || null,
      name: category.name,
      slug: category.slug,
      description: category.description || null,
      image_url: category.image || null,
      active: category.active,
      show_on_home: category.showOnHome,
      include_in_menu: category.includeInMenu,
      display_order: category.displayOrder,
      home_display_order: category.homeDisplayOrder,
    })
    .eq('id', category.id)
    .select(categoryColumns)
    .single()

  if (error) throw error
  return mapCategory(data)
}

export async function removeAdminCategories(ids) {
  if (!supabase || !ids.length) return

  const { error } = await supabase.from('categories').delete().in('id', ids)
  if (error) throw error
}

export async function loadPublicProducts() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('products')
    .select(productColumns)
    .eq('status', 'active')
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
    .insert(productPayload(product))
    .select(productColumns)
    .single()

  if (error) throw error
  return mapProduct(data)
}

export async function updateAdminProduct(product) {
  if (!supabase) return product

  const { data, error } = await supabase
    .from('products')
    .update(productPayload(product))
    .eq('id', product.id)
    .select(productColumns)
    .single()

  if (error) throw error
  return mapProduct(data)
}

export async function updateAdminProducts(products) {
  if (!supabase) return products
  if (!products.length) return []

  const { data, error } = await supabase
    .from('products')
    .upsert(products.map(productPayload))
    .select(productColumns)

  if (error) throw error
  return data.map(mapProduct)
}

export async function importAdminProducts(products) {
  if (!supabase) return products.map((product, index) => ({ ...product, id: product.id || Date.now() + index }))
  if (!products.length) return []

  const { data, error } = await supabase
    .from('products')
    .upsert(products.map(productPayload), { onConflict: 'sku' })
    .select(productColumns)

  if (error) throw error
  return data.map(mapProduct)
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
