import { isSupabaseConfigured, supabase } from './supabase'

const productColumns = 'id, name, category, sku, price, old_price, stock, status, unit, badge, image_url, manufacturer, vendor, warehouse, product_type, description, images, options, variants'
const categoryColumns = 'id, parent_id, name, slug, description, image_url, active, show_on_home, include_in_menu, display_order, home_display_order'
const orderColumns = 'id, order_number, total, subtotal, discount_total, delivery_fee, tax_total, delivery_method, payment_method, shipping_address, notes, payment_status, delivery_status, created_at, customers(full_name, email, phone, location), order_items(product_name, unit_price, quantity, line_total, variant_label)'
const discountColumns = 'id, code, percent_off, active, ends_at, title, method, discount_type, value_type, value_amount, applies_to, minimum_type, minimum_value, usage_limit, once_per_customer, combines, starts_at'
const customerColumns = 'id, email, full_name, phone, location, created_at, updated_at'
const articleColumns = 'id, title, slug, category, excerpt, image_url, status, published_at, author, content, tags, type, created_at, updated_at'

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

function paymentMethodLabel(value) {
  const labels = {
    momo: 'MoMo',
    zalopay: 'ZaloPay',
    shopeepay: 'ShopeePay',
    vnpay: 'VNPAY-QR',
    cod: 'Thanh toán khi nhận hàng (COD)',
    transfer: 'Chuyển khoản ngân hàng',
  }
  const normalized = String(value || '').trim().toLowerCase()
  return labels[normalized] || titleStatus(normalized || value)
}

function deliveryMethodLabel(value) {
  const labels = {
    local: 'Giao tận nơi',
    pickup: 'Nhận tại cửa hàng',
  }
  const normalized = String(value || '').trim().toLowerCase()
  return labels[normalized] || titleStatus(normalized || value)
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
    subtotal: Number(order.subtotal || 0),
    discountTotal: Number(order.discount_total || 0),
    deliveryFee: Number(order.delivery_fee || 0),
    taxTotal: Number(order.tax_total || 0),
    payment: titleStatus(order.payment_status),
    paymentMethod: paymentMethodLabel(order.payment_method),
    paymentMethodCode: order.payment_method || '',
    delivery: titleStatus(order.delivery_status),
    deliveryMethod: deliveryMethodLabel(order.delivery_method),
    deliveryMethodCode: order.delivery_method || '',
    items: lineItems.reduce((total, item) => total + Number(item.quantity || 0), 0),
    note: order.notes || '',
    shippingAddress: order.shipping_address || order.customers?.location || '',
    lineItems: lineItems.map((item) => ({
      name: item.variant_label ? `${item.product_name} (${item.variant_label})` : item.product_name,
      quantity: Number(item.quantity),
      price: Number(item.unit_price),
      total: Number(item.line_total),
    })),
  }
}

function discountStatus(discount) {
  const now = Date.now()
  const startsAt = discount.starts_at ? new Date(discount.starts_at).getTime() : 0
  const endsAt = discount.ends_at ? new Date(discount.ends_at).getTime() : null
  if (!discount.active) return 'Draft'
  if (startsAt && startsAt > now) return 'Scheduled'
  if (endsAt && endsAt < now) return 'Expired'
  return 'Active'
}

function discountValueLabel(discount) {
  const type = discount.value_type || (discount.percent_off ? 'percentage' : 'fixed')
  const amount = Number(discount.value_amount ?? discount.percent_off ?? 0)
  if (discount.discount_type === 'shipping') return 'Free shipping'
  if (type === 'percentage') return `${amount}%`
  if (type === 'free') return 'Free'
  return `$${amount.toFixed(2)}`
}

function mapDiscount(discount) {
  return {
    id: discount.id,
    code: discount.code || '',
    title: discount.title || discount.code || 'Automatic discount',
    method: discount.method || 'code',
    discountType: discount.discount_type || 'order',
    valueType: discount.value_type || (discount.percent_off ? 'percentage' : 'fixed'),
    valueAmount: Number(discount.value_amount ?? discount.percent_off ?? 0),
    appliesTo: discount.applies_to || {},
    minimumType: discount.minimum_type || 'none',
    minimumValue: Number(discount.minimum_value || 0),
    usageLimit: discount.usage_limit,
    oncePerCustomer: Boolean(discount.once_per_customer),
    combines: discount.combines || {},
    startsAt: discount.starts_at,
    endsAt: discount.ends_at,
    active: discount.active,
    percentOff: discount.percent_off,
    type: discount.discount_type === 'shipping'
      ? 'Free shipping'
      : discount.discount_type === 'buy_x_get_y'
        ? 'Buy X get Y'
        : discount.discount_type === 'product'
          ? 'Product discount'
          : 'Order discount',
    value: discountValueLabel(discount),
    status: discountStatus(discount),
    uses: 0,
    ends: discount.ends_at ? new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(discount.ends_at)) : 'No end date',
  }
}

function discountPayload(discount) {
  const valueAmount = Number(discount.valueAmount || 0)
  return {
    ...(discount.id ? { id: discount.id } : {}),
    code: discount.method === 'automatic' ? null : String(discount.code || '').trim().toUpperCase(),
    title: discount.title || discount.code || null,
    method: discount.method || 'code',
    discount_type: discount.discountType || 'order',
    value_type: discount.valueType || 'percentage',
    value_amount: valueAmount,
    percent_off: discount.valueType === 'percentage' ? Math.round(valueAmount) : null,
    active: discount.active ?? true,
    applies_to: discount.appliesTo || {},
    minimum_type: discount.minimumType || 'none',
    minimum_value: discount.minimumValue ? Number(discount.minimumValue) : 0,
    usage_limit: discount.usageLimit ? Number(discount.usageLimit) : null,
    once_per_customer: Boolean(discount.oncePerCustomer),
    combines: discount.combines || {},
    starts_at: discount.startsAt || new Date().toISOString(),
    ends_at: discount.endsAt || null,
  }
}

function initials(name) {
  return String(name || 'Guest')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'G'
}

function mapCustomer(customer) {
  return {
    id: customer.id,
    name: customer.full_name,
    email: customer.email,
    phone: customer.phone || '',
    location: customer.location || '',
    orders: Number(customer.orders || 0),
    spent: Number(customer.spent || 0),
    initials: initials(customer.full_name),
    createdAt: customer.created_at,
    notes: customer.notes || '',
    tags: Array.isArray(customer.tags) ? customer.tags : [],
  }
}

function customerPayload(customer) {
  return {
    ...(customer.id ? { id: customer.id } : {}),
    email: String(customer.email || '').trim().toLowerCase(),
    full_name: customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
    phone: customer.phone || null,
    location: customer.location || null,
  }
}

function mapArticle(article) {
  const publishedAt = article.published_at || article.created_at
  const tags = Array.isArray(article.tags) ? article.tags : []
  const normalizedCategory = String(article.category || '').toLowerCase()
  const normalizedType = String(article.type || '').toLowerCase()
  const type = normalizedType === 'recipe' || normalizedCategory === 'recipes' || tags.some((tag) => String(tag).toLowerCase() === 'recipe') ? 'recipe' : 'news'
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    category: article.category,
    type,
    excerpt: article.excerpt || '',
    content: article.content || '',
    image: article.image_url,
    status: article.status === 'published' ? 'Published' : 'Draft',
    author: article.author || 'LyLy Editorial',
    date: publishedAt ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(publishedAt)) : '',
    publishedAt,
    tags,
    ingredients: [],
  }
}

function articlePayload(article) {
  return {
    ...(article.id ? { id: article.id } : {}),
    title: article.title,
    slug: article.slug,
    category: article.category || 'News',
    excerpt: article.excerpt || null,
    content: article.content || null,
    image_url: article.image || article.imageUrl,
    status: article.status === 'Published' || article.status === 'published' ? 'published' : 'draft',
    published_at: article.status === 'Published' || article.status === 'published' ? (article.publishedAt || new Date().toISOString()) : null,
    author: article.author || 'LyLy Editorial',
    tags: Array.isArray(article.tags) ? article.tags : String(article.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
    type: article.type || (article.category === 'Recipes' ? 'recipe' : 'news'),
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

export async function loadPublicDiscounts() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('discounts')
    .select(discountColumns)
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(mapDiscount)
}

export async function loadAdminDiscounts() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('discounts')
    .select(discountColumns)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(mapDiscount)
}

export async function createAdminDiscount(discount) {
  if (!supabase) {
    return {
      ...discount,
      id: Date.now(),
      type: discount.discountType === 'shipping' ? 'Free shipping' : discount.discountType === 'buy_x_get_y' ? 'Buy X get Y' : discount.discountType === 'product' ? 'Product discount' : 'Order discount',
      value: discount.discountType === 'shipping' ? 'Free shipping' : discount.valueType === 'percentage' ? `${discount.valueAmount}%` : discount.valueType === 'free' ? 'Free' : `$${Number(discount.valueAmount || 0).toFixed(2)}`,
      status: 'Active',
      uses: 0,
      ends: discount.endsAt || 'No end date',
    }
  }

  const { data, error } = await supabase
    .from('discounts')
    .insert(discountPayload(discount))
    .select(discountColumns)
    .single()

  if (error) throw error
  return mapDiscount(data)
}

export async function updateAdminDiscount(discount) {
  if (!supabase) return {
    ...discount,
    type: discount.discountType === 'shipping' ? 'Free shipping' : discount.discountType === 'buy_x_get_y' ? 'Buy X get Y' : discount.discountType === 'product' ? 'Product discount' : 'Order discount',
    value: discount.discountType === 'shipping' ? 'Free shipping' : discount.valueType === 'percentage' ? `${discount.valueAmount}%` : discount.valueType === 'free' ? 'Free' : `$${Number(discount.valueAmount || 0).toFixed(2)}`,
    status: discount.active === false ? 'Draft' : 'Active',
    uses: discount.uses || 0,
    ends: discount.endsAt || 'No end date',
  }

  const { data, error } = await supabase
    .from('discounts')
    .update(discountPayload(discount))
    .eq('id', discount.id)
    .select(discountColumns)
    .single()

  if (error) throw error
  return mapDiscount(data)
}

export async function removeAdminDiscounts(ids) {
  if (!supabase || !ids.length) return

  const { error } = await supabase.from('discounts').delete().in('id', ids)
  if (error) throw error
}

export async function loadAdminCustomers() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('customers')
    .select(customerColumns)
    .order('created_at', { ascending: false })

  if (error) throw error
  const customers = data.map(mapCustomer)
  const { data: orders } = await supabase
    .from('orders')
    .select('customer_id,total')

  if (!orders) return customers
  const totals = orders.reduce((acc, order) => {
    const current = acc.get(order.customer_id) || { orders: 0, spent: 0 }
    acc.set(order.customer_id, { orders: current.orders + 1, spent: current.spent + Number(order.total || 0) })
    return acc
  }, new Map())

  return customers.map((customer) => ({ ...customer, ...(totals.get(customer.id) || {}) }))
}

export async function createAdminCustomer(customer) {
  if (!supabase) return { ...customer, id: Date.now(), initials: initials(customer.name), orders: 0, spent: 0 }

  const { data, error } = await supabase
    .from('customers')
    .insert(customerPayload(customer))
    .select(customerColumns)
    .single()

  if (error) throw error
  return mapCustomer(data)
}

export async function updateAdminCustomer(customer) {
  if (!supabase) return { ...customer, initials: initials(customer.name) }

  const { data, error } = await supabase
    .from('customers')
    .update(customerPayload(customer))
    .eq('id', customer.id)
    .select(customerColumns)
    .single()

  if (error) throw error
  return { ...mapCustomer(data), orders: customer.orders || 0, spent: customer.spent || 0 }
}

export async function removeAdminCustomers(ids) {
  if (!supabase || !ids.length) return

  const { error } = await supabase.from('customers').delete().in('id', ids)
  if (error) throw error
}

export async function loadPublicArticles() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('articles')
    .select(articleColumns)
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })

  if (error) throw error
  return data.map(mapArticle)
}

export async function loadAdminArticles() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('articles')
    .select(articleColumns)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(mapArticle)
}

export async function createAdminArticle(article) {
  if (!supabase) return { ...article, id: Date.now(), date: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()) }

  const { data, error } = await supabase
    .from('articles')
    .insert(articlePayload(article))
    .select(articleColumns)
    .single()

  if (error) throw error
  return mapArticle(data)
}

export async function updateAdminArticle(article) {
  if (!supabase) return article

  const { data, error } = await supabase
    .from('articles')
    .update(articlePayload(article))
    .eq('id', article.id)
    .select(articleColumns)
    .single()

  if (error) throw error
  return mapArticle(data)
}

export async function removeAdminArticles(ids) {
  if (!supabase || !ids.length) return

  const { error } = await supabase.from('articles').delete().in('id', ids)
  if (error) throw error
}

export async function loadStoreSettings() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('store_settings')
    .select('key,value')

  if (error) throw error
  return Object.fromEntries(data.map((item) => [item.key, item.value]))
}

export async function saveStoreSettings(settings) {
  if (!supabase) return settings

  const rows = Object.entries(settings).map(([key, value]) => ({ key, value }))
  const { error } = await supabase
    .from('store_settings')
    .upsert(rows, { onConflict: 'key' })

  if (error) throw error
  return settings
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

async function uploadAdminImage(file, owner, folder = 'products') {
  if (!file) return null
  if (!file.type.startsWith('image/')) throw new Error('Chỉ hỗ trợ upload file hình ảnh.')
  if (file.size > 5 * 1024 * 1024) throw new Error('Ảnh sản phẩm không được vượt quá 5MB.')
  if (!supabase) return fileToDataUrl(file)

  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const safeFolder = String(folder || 'uploads').toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const safeOwner = String(owner || 'image').toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const path = `${safeFolder}/${safeOwner}/${Date.now()}.${extension}`
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })

  if (error) throw error

  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadAdminProductImage(file, sku) {
  return uploadAdminImage(file, sku || 'product', 'products')
}

export async function uploadAdminArticleImage(file, slug) {
  return uploadAdminImage(file, slug || 'article', 'articles')
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
