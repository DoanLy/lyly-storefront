import { isSupabaseConfigured, supabase } from './supabase'

const productColumns = 'id, name, category, sku, price, old_price, stock, status, unit, badge, image_url, manufacturer, vendor, warehouse, product_type, description, images, options, variants'
const categoryColumns = 'id, parent_id, name, slug, description, image_url, active, show_on_home, include_in_menu, display_order, home_display_order'
const orderColumns = 'id, order_number, total, payment_status, delivery_status, created_at, customers(full_name, email, phone, location), order_items(product_name, unit_price, quantity, line_total, variant_label)'

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
    description: product.description || '',
    images: Array.isArray(product.images) ? product.images : [],
    options: Array.isArray(product.options) ? product.options : [],
    variants: Array.isArray(product.variants) ? product.variants : [],
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
    description: product.description || null,
    images: product.images?.length ? product.images : [],
    options: product.options?.length ? product.options : [],
    variants: product.variants?.length ? product.variants : [],
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

function titleStatus(value) {
  return String(value || '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function orderStatusValue(value) {
  return String(value || '').trim().toLowerCase().replaceAll(' ', '_')
}

function mapOrder(order) {
  const lineItems = order.order_items || []

  return {
    uuid: order.id,
    id: order.order_number,
    date: new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(order.created_at)),
    createdAt: order.created_at,
    customer: order.customers?.full_name || 'Guest customer',
    email: order.customers?.email || '',
    phone: order.customers?.phone || '',
    location: order.customers?.location || '',
    total: Number(order.total || 0),
    payment: titleStatus(order.payment_status),
    delivery: titleStatus(order.delivery_status),
    items: lineItems.reduce((total, item) => total + Number(item.quantity || 0), 0),
    note: '',
    lineItems: lineItems.map((item) => ({
      name: item.variant_label ? `${item.product_name} (${item.variant_label})` : item.product_name,
      quantity: Number(item.quantity),
      price: Number(item.unit_price),
      total: Number(item.line_total),
    })),
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

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export async function uploadAdminProductImage(file, sku) {
  if (!file) return null
  if (!file.type.startsWith('image/')) throw new Error('Chỉ hỗ trợ upload file hình ảnh.')
  if (file.size > 5 * 1024 * 1024) throw new Error('Ảnh sản phẩm không được vượt quá 5MB.')
  if (!supabase) return fileToDataUrl(file)

  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const safeSku = String(sku || 'product').toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const path = `${safeSku}/${Date.now()}.${extension}`
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })

  if (error) throw error

  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

export async function loadAdminOrders() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('orders')
    .select(orderColumns)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(mapOrder)
}

export async function updateAdminOrder(order) {
  if (!supabase) return order

  const { data, error } = await supabase
    .from('orders')
    .update({
      payment_status: orderStatusValue(order.payment),
      delivery_status: orderStatusValue(order.delivery),
    })
    .eq('id', order.uuid)
    .select(orderColumns)
    .single()

  if (error) throw error
  return mapOrder(data)
}

export async function updateAdminOrders(orders) {
  if (!supabase) return orders

  const updated = []
  for (const order of orders) {
    updated.push(await updateAdminOrder(order))
  }
  return updated
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
      items: items.map((item) => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
        variantId: item.variantId || null,
        variantLabel: item.variantLabel || '',
        unitPrice: item.price,
      })),
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
