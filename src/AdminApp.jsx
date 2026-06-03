import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BadgePercent,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleHelp,
  Download,
  Eye,
  FileText,
  Filter,
  Globe2,
  Home,
  Image,
  Leaf,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Megaphone,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Tag,
  Trash2,
  Truck,
  Upload,
  Users,
  X,
} from 'lucide-react'
import './AdminApp.css'
import {
  checkAdminAccess,
  createAdminCategory,
  createAdminProduct,
  getAdminSession,
  importAdminProducts,
  isSupabaseConfigured,
  loadAdminCategories,
  loadAdminOrders,
  loadAdminProducts,
  removeAdminCategories,
  removeAdminProducts,
  signInAdmin,
  signOutAdmin,
  updateAdminCategory,
  updateAdminOrder,
  updateAdminOrders,
  updateAdminProduct,
  updateAdminProducts,
  uploadAdminProductImage,
} from './lib/storeApi'

const initialProducts = [
  { id: 1, name: 'Artisan Sourdough Loaf', category: 'Bread & Bakery', sku: 'BRD-1001', price: 6.5, stock: 42, status: 'active', unit: '500g', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=160&q=85' },
  { id: 2, name: 'Organic Hass Avocados', category: 'Fruits & Vegetables', sku: 'FRT-1024', price: 5.9, stock: 68, status: 'active', unit: 'Pack of 3', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=160&q=85' },
  { id: 3, name: 'Sweet Garden Strawberries', category: 'Fruits & Vegetables', sku: 'FRT-1018', price: 4.75, stock: 16, status: 'active', unit: '250g', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=160&q=85' },
  { id: 4, name: 'Farm Fresh Whole Milk', category: 'Dairy & Eggs', sku: 'DRY-1006', price: 3.25, stock: 34, status: 'active', unit: '1 litre', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=160&q=85' },
  { id: 5, name: 'Sun-Kissed Navel Oranges', category: 'Fruits & Vegetables', sku: 'FRT-1029', price: 4.2, stock: 0, status: 'draft', unit: '1kg', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=160&q=85' },
  { id: 6, name: 'Free Range Brown Eggs', category: 'Dairy & Eggs', sku: 'DRY-1011', price: 5.5, stock: 21, status: 'active', unit: '12 eggs', image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=160&q=85' },
  { id: 7, name: 'Fresh Rigatoni Pasta', category: 'Pasta & Noodles', sku: 'MEA-1015', price: 4.9, stock: 11, status: 'active', unit: '400g', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=160&q=85' },
  { id: 8, name: 'Atlantic Salmon Fillet', category: 'Pantry', sku: 'MEA-1021', price: 14.5, stock: 8, status: 'active', unit: '350g', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=160&q=85' },
].map((product) => ({ manufacturer: 'LyLy Market', vendor: 'LyLy Market', warehouse: 'Main Store', productType: 'Grocery', ...product }))

const initialCategories = [
  { id: 1, name: 'Pantry', slug: 'pantry', active: true, showOnHome: false, includeInMenu: true, displayOrder: 10 },
  { id: 2, name: 'Produce', slug: 'produce', active: true, showOnHome: false, includeInMenu: true, displayOrder: 20 },
  { id: 3, name: 'Drinks', slug: 'drinks', active: true, showOnHome: false, includeInMenu: true, displayOrder: 30 },
  { id: 4, name: 'Bakery', slug: 'bakery', active: true, showOnHome: false, includeInMenu: true, displayOrder: 40 },
  { id: 5, name: 'Dairy & Eggs', slug: 'dairy-eggs', active: true, showOnHome: true, includeInMenu: true, displayOrder: 50 },
  { id: 6, parentId: 1, name: 'Pasta & Noodles', slug: 'pasta-noodles', active: true, showOnHome: false, includeInMenu: false, displayOrder: 11 },
  { id: 7, parentId: 1, name: 'Grains & Beans', slug: 'grains-beans', active: true, showOnHome: false, includeInMenu: false, displayOrder: 12 },
  { id: 8, parentId: 1, name: 'Snacks', slug: 'snacks', active: true, showOnHome: false, includeInMenu: false, displayOrder: 13 },
  { id: 9, parentId: 1, name: 'Oil, Vinegar & Spices', slug: 'oil-vinegar-spices', active: true, showOnHome: false, includeInMenu: false, displayOrder: 14 },
  { id: 10, parentId: 1, name: 'Sauces & Marinades', slug: 'sauces-marinades', active: true, showOnHome: true, includeInMenu: false, displayOrder: 15 },
  { id: 11, parentId: 1, name: 'Dressings', slug: 'dressings', active: true, showOnHome: false, includeInMenu: false, displayOrder: 16 },
  { id: 12, parentId: 2, name: 'Fruits & Vegetables', slug: 'fruits-vegetables', active: true, showOnHome: true, includeInMenu: false, displayOrder: 21 },
  { id: 13, parentId: 2, name: 'Vegetables', slug: 'vegetables', active: true, showOnHome: false, includeInMenu: false, displayOrder: 22 },
  { id: 14, parentId: 2, name: 'Fruit', slug: 'fruit', active: true, showOnHome: false, includeInMenu: false, displayOrder: 23 },
  { id: 15, parentId: 2, name: 'Herbs & Aromatics', slug: 'herbs-aromatics', active: true, showOnHome: false, includeInMenu: false, displayOrder: 24 },
  { id: 16, parentId: 3, name: 'Beverages', slug: 'beverages', active: true, showOnHome: true, includeInMenu: false, displayOrder: 31 },
  { id: 17, parentId: 3, name: 'Coffee', slug: 'coffee', active: true, showOnHome: false, includeInMenu: false, displayOrder: 32 },
  { id: 18, parentId: 3, name: 'Tea & Elixirs', slug: 'tea-elixirs', active: true, showOnHome: false, includeInMenu: false, displayOrder: 33 },
  { id: 19, parentId: 3, name: 'Juices', slug: 'juices', active: true, showOnHome: false, includeInMenu: false, displayOrder: 34 },
  { id: 20, parentId: 4, name: 'Bread & Bakery', slug: 'bread-bakery', active: true, showOnHome: true, includeInMenu: false, displayOrder: 41 },
  { id: 21, parentId: 4, name: 'Flour & Baking', slug: 'flour-baking', active: true, showOnHome: true, includeInMenu: false, displayOrder: 42 },
  { id: 22, parentId: 4, name: 'Bread', slug: 'bread', active: true, showOnHome: false, includeInMenu: false, displayOrder: 43 },
  { id: 23, parentId: 4, name: 'Buns & Rolls', slug: 'buns-rolls', active: true, showOnHome: false, includeInMenu: false, displayOrder: 44 },
  { id: 24, parentId: 4, name: 'Bagels & Breakfast', slug: 'bagels-breakfast', active: true, showOnHome: false, includeInMenu: false, displayOrder: 45 },
  { id: 25, parentId: 4, name: 'Gluten-Free', slug: 'gluten-free', active: true, showOnHome: false, includeInMenu: false, displayOrder: 46 },
  { id: 26, parentId: 5, name: 'Milk & Cream', slug: 'milk-cream', active: true, showOnHome: false, includeInMenu: false, displayOrder: 51 },
  { id: 27, parentId: 5, name: 'Eggs & Butter', slug: 'eggs-butter', active: true, showOnHome: false, includeInMenu: false, displayOrder: 52 },
  { id: 28, parentId: 5, name: 'Cheese', slug: 'cheese', active: true, showOnHome: false, includeInMenu: false, displayOrder: 53 },
  { id: 29, parentId: 5, name: 'Yogurt & Cultured Dairy', slug: 'yogurt-cultured-dairy', active: true, showOnHome: false, includeInMenu: false, displayOrder: 54 },
  { id: 30, parentId: 5, name: 'Plant-Based', slug: 'plant-based', active: true, showOnHome: false, includeInMenu: false, displayOrder: 55 },
]

const initialOrders = [
  { id: '#LY1048', date: '02 Jun, 13:42', customer: 'Emma Wilson', email: 'emma.wilson@example.com', phone: '+1 555 0184', location: 'Brooklyn, NY', total: 54.2, payment: 'Paid', delivery: 'Packing', items: 5, note: 'Leave at concierge if no answer.', lineItems: [{ name: 'Organic Hass Avocados', quantity: 2, price: 5.9, total: 11.8 }, { name: 'Farm Fresh Whole Milk', quantity: 1, price: 3.25, total: 3.25 }, { name: 'Sweet Garden Strawberries', quantity: 2, price: 4.75, total: 9.5 }] },
  { id: '#LY1047', date: '02 Jun, 12:16', customer: 'Noah Taylor', email: 'noah.taylor@example.com', phone: '+1 555 0162', location: 'Queens, NY', total: 82.75, payment: 'Paid', delivery: 'Ready', items: 7, note: 'Pickup window: 5-6 PM.', lineItems: [{ name: 'Atlantic Salmon Fillet', quantity: 2, price: 14.5, total: 29 }, { name: 'Fresh Rigatoni Pasta', quantity: 2, price: 4.9, total: 9.8 }, { name: 'Artisan Sourdough Loaf', quantity: 1, price: 6.5, total: 6.5 }] },
  { id: '#LY1046', date: '02 Jun, 10:04', customer: 'Ava Anderson', email: 'ava.anderson@example.com', phone: '+1 555 0138', location: 'Jersey City, NJ', total: 34.5, payment: 'Pending', delivery: 'Unfulfilled', items: 3, note: 'Call before delivery.', lineItems: [{ name: 'Free Range Brown Eggs', quantity: 1, price: 5.5, total: 5.5 }, { name: 'Sun-Kissed Navel Oranges', quantity: 2, price: 4.2, total: 8.4 }] },
  { id: '#LY1045', date: '01 Jun, 18:32', customer: 'Liam Johnson', email: 'liam.johnson@example.com', phone: '+1 555 0119', location: 'Manhattan, NY', total: 96.4, payment: 'Paid', delivery: 'Delivered', items: 9, note: 'Delivered by local courier.', lineItems: [{ name: 'Atlantic Salmon Fillet', quantity: 3, price: 14.5, total: 43.5 }, { name: 'Organic Hass Avocados', quantity: 3, price: 5.9, total: 17.7 }] },
  { id: '#LY1044', date: '01 Jun, 16:21', customer: 'Mia Brown', email: 'mia.brown@example.com', phone: '+1 555 0144', location: 'Hoboken, NJ', total: 41.85, payment: 'Refunded', delivery: 'Cancelled', items: 4, note: 'Customer requested cancellation.', lineItems: [{ name: 'Fresh Rigatoni Pasta', quantity: 2, price: 4.9, total: 9.8 }, { name: 'Artisan Sourdough Loaf', quantity: 2, price: 6.5, total: 13 }] },
  { id: '#LY1043', date: '01 Jun, 14:47', customer: 'Oliver Davis', email: 'oliver.davis@example.com', phone: '+1 555 0157', location: 'Brooklyn, NY', total: 67.1, payment: 'Paid', delivery: 'Delivered', items: 6, note: 'No substitutions.', lineItems: [{ name: 'Sweet Garden Strawberries', quantity: 4, price: 4.75, total: 19 }, { name: 'Farm Fresh Whole Milk', quantity: 2, price: 3.25, total: 6.5 }] },
]

const customers = [
  { id: 1, name: 'Emma Wilson', email: 'emma.wilson@example.com', orders: 8, spent: 424.6, location: 'Brooklyn, NY', initials: 'EW' },
  { id: 2, name: 'Noah Taylor', email: 'noah.taylor@example.com', orders: 5, spent: 279.85, location: 'Queens, NY', initials: 'NT' },
  { id: 3, name: 'Ava Anderson', email: 'ava.anderson@example.com', orders: 2, spent: 86.2, location: 'Jersey City, NJ', initials: 'AA' },
  { id: 4, name: 'Liam Johnson', email: 'liam.johnson@example.com', orders: 11, spent: 642.4, location: 'Manhattan, NY', initials: 'LJ' },
  { id: 5, name: 'Mia Brown', email: 'mia.brown@example.com', orders: 4, spent: 175.3, location: 'Hoboken, NJ', initials: 'MB' },
  { id: 6, name: 'Oliver Davis', email: 'oliver.davis@example.com', orders: 7, spent: 388.1, location: 'Brooklyn, NY', initials: 'OD' },
]

const initialDiscounts = [
  { code: 'FRESH20', type: 'Percentage', value: '20%', uses: 128, status: 'Active', ends: '30 Jun 2026' },
  { code: 'WELCOME10', type: 'Percentage', value: '10%', uses: 67, status: 'Active', ends: 'No end date' },
  { code: 'LOCALDELIVERY', type: 'Free delivery', value: '$0 delivery', uses: 42, status: 'Scheduled', ends: '15 Jun 2026' },
]

const articles = [
  { title: 'A simpler way to plan your weekly groceries', status: 'Published', author: 'LyLy Editorial', date: '01 Jun 2026', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=260&q=85' },
  { title: 'Three bright salads for warmer days', status: 'Published', author: 'LyLy Kitchen', date: '29 May 2026', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=260&q=85' },
  { title: 'Meet the growers behind our organic greens', status: 'Draft', author: 'LyLy Editorial', date: '28 May 2026', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=260&q=85' },
]

const campaigns = [
  { name: 'Summer market essentials', channel: 'Email campaign', audience: '1,482 customers', status: 'Scheduled', date: '05 Jun, 09:00' },
  { name: 'Fresh20 welcome series', channel: 'Email automation', audience: 'New subscribers', status: 'Active', date: 'Always on' },
  { name: 'Weekend bakery picks', channel: 'Social campaign', audience: 'Instagram audience', status: 'Draft', date: 'Not scheduled' },
]

const navGroups = [
  {
    items: [
      { id: 'dashboard', label: 'Trang chủ', icon: Home },
      { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart, count: 3 },
      { id: 'products', label: 'Sản phẩm', icon: Package },
      { id: 'categories', label: 'Danh mục', icon: Tag },
      { id: 'customers', label: 'Khách hàng', icon: Users },
      { id: 'marketing', label: 'Tiếp thị', icon: Megaphone },
      { id: 'discounts', label: 'Giảm giá', icon: BadgePercent },
      { id: 'content', label: 'Nội dung', icon: FileText },
      { id: 'analytics', label: 'Phân tích', icon: BarChart3 },
    ],
  },
  {
    title: 'Kênh bán hàng',
    items: [
      { id: 'online-store', label: 'Cửa hàng trực tuyến', icon: Store, external: true },
      { id: 'locations', label: 'Điểm bán hàng', icon: MapPin },
    ],
  },
]

const pageMeta = {
  products: ['Sản phẩm', 'Quản lý danh mục sản phẩm, tồn kho và trạng thái bán hàng.'],
  categories: ['Danh mục', 'Quản lý cấu trúc danh mục, menu và danh mục hiển thị trên storefront.'],
  orders: ['Đơn hàng', 'Theo dõi thanh toán, đóng gói và giao hàng của cửa hàng.'],
  customers: ['Khách hàng', 'Xem lịch sử mua sắm và chăm sóc khách hàng LyLy.'],
  marketing: ['Tiếp thị', 'Tạo chiến dịch để khách hàng quay lại với LyLy.'],
  discounts: ['Giảm giá', 'Quản lý mã ưu đãi và chương trình khuyến mại.'],
  content: ['Nội dung', 'Quản lý bài viết và nội dung hiển thị trên storefront.'],
  analytics: ['Phân tích', 'Theo dõi hiệu quả bán hàng và hành vi khách hàng.'],
  locations: ['Điểm bán hàng', 'Cấu hình địa điểm lấy hàng và khu vực giao hàng.'],
  settings: ['Cài đặt', 'Cấu hình vận hành chung cho cửa hàng LyLy.'],
}

const adminI18n = {
  vi: {
    code: 'VI',
    search: 'Tìm kiếm sản phẩm, đơn hàng, khách hàng',
    settings: 'Cài đặt',
    notifications: 'Thông báo',
    noResults: 'Không tìm thấy kết quả phù hợp.',
    demo: 'Chế độ demo local: thêm',
    nav: {
      dashboard: 'Trang chủ',
      orders: 'Đơn hàng',
      products: 'Sản phẩm',
      categories: 'Danh mục',
      customers: 'Khách hàng',
      marketing: 'Tiếp thị',
      discounts: 'Giảm giá',
      content: 'Nội dung',
      analytics: 'Phân tích',
      'online-store': 'Cửa hàng trực tuyến',
      locations: 'Điểm bán hàng',
    },
    navGroup: { salesChannels: 'Kênh bán hàng' },
    pageMeta,
    product: {
      create: 'Thêm sản phẩm mới',
      edit: 'Sửa sản phẩm',
      name: 'Tên sản phẩm',
      namePlaceholder: 'Ví dụ: Organic Baby Spinach',
      category: 'Danh mục',
      price: 'Giá bán',
      oldPrice: 'Giá trước giảm',
      oldPricePlaceholder: 'Để trống nếu không sale',
      stock: 'Tồn kho',
      status: 'Trạng thái',
      active: 'Đang hiển thị',
      draft: 'Bản nháp',
      unit: 'Quy cách',
      unitPlaceholder: 'Ví dụ: 250g',
      badge: 'Nhãn sản phẩm',
      badgePlaceholder: 'Ví dụ: Organic',
      image: 'Ảnh sản phẩm',
      chooseImage: 'Chọn ảnh từ máy',
      imageHelp: 'JPG, PNG hoặc WebP. Tối đa 5MB.',
      manufacturer: 'Nhà sản xuất',
      vendor: 'Nhà cung cấp',
      warehouse: 'Kho hàng',
      productType: 'Loại sản phẩm',
      regenerate: 'Tạo lại',
      cancel: 'Hủy',
      save: 'Lưu thay đổi',
      add: 'Thêm sản phẩm',
    },
  },
  en: {
    code: 'EN',
    search: 'Search products, orders, customers',
    settings: 'Settings',
    notifications: 'Notifications',
    noResults: 'No matching results found.',
    demo: 'Local demo mode: add',
    nav: {
      dashboard: 'Home',
      orders: 'Orders',
      products: 'Products',
      categories: 'Categories',
      customers: 'Customers',
      marketing: 'Marketing',
      discounts: 'Discounts',
      content: 'Content',
      analytics: 'Analytics',
      'online-store': 'Online store',
      locations: 'Locations',
    },
    navGroup: { salesChannels: 'Sales channels' },
    pageMeta: {
      products: ['Products', 'Manage product catalog, inventory, and sales status.'],
      categories: ['Categories', 'Manage category structure, menus, and storefront category display.'],
      orders: ['Orders', 'Track payment, packing, and delivery for your store.'],
      customers: ['Customers', 'View purchase history and care for LyLy customers.'],
      marketing: ['Marketing', 'Create campaigns that bring customers back to LyLy.'],
      discounts: ['Discounts', 'Manage promotion codes and discount programs.'],
      content: ['Content', 'Manage articles and content displayed on the storefront.'],
      analytics: ['Analytics', 'Track sales performance and customer behavior.'],
      locations: ['Locations', 'Configure pickup points and delivery zones.'],
      settings: ['Settings', 'Configure general operations for LyLy store.'],
    },
    product: {
      create: 'Add new product',
      edit: 'Edit product',
      name: 'Product name',
      namePlaceholder: 'Example: Organic Baby Spinach',
      category: 'Category',
      price: 'Price',
      oldPrice: 'Compare-at price',
      oldPricePlaceholder: 'Leave blank if not on sale',
      stock: 'Inventory',
      status: 'Status',
      active: 'Active',
      draft: 'Draft',
      unit: 'Unit',
      unitPlaceholder: 'Example: 250g',
      badge: 'Product badge',
      badgePlaceholder: 'Example: Organic',
      image: 'Product image',
      chooseImage: 'Choose image from device',
      imageHelp: 'JPG, PNG, or WebP. Max 5MB.',
      manufacturer: 'Manufacturer',
      vendor: 'Vendor',
      warehouse: 'Warehouse',
      productType: 'Product type',
      regenerate: 'Regenerate',
      cancel: 'Cancel',
      save: 'Save changes',
      add: 'Add product',
    },
  },
}

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const defaultProductImage = 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=700&q=85'
const productCsvColumns = ['sku', 'name', 'category', 'price', 'old_price', 'stock', 'status', 'unit', 'badge', 'image_url', 'manufacturer', 'vendor', 'warehouse', 'product_type']

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function csvCell(value) {
  const text = value == null ? '' : String(value)
  return `"${text.replaceAll('"', '""')}"`
}

function downloadProductsCsv(products) {
  const rows = products.map((product) => [
    product.sku,
    product.name,
    product.category,
    product.price,
    product.oldPrice || '',
    product.stock,
    product.status,
    product.unit,
    product.badge || '',
    product.image,
    product.manufacturer,
    product.vendor,
    product.warehouse,
    product.productType,
  ])
  const csv = [productCsvColumns, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')
  downloadBlob(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }), 'lyly-products.csv')
}

function parseCsv(text) {
  const rows = []
  let cell = ''
  let row = []
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (character === '"' && quoted && text[index + 1] === '"') {
      cell += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === ',' && !quoted) {
      row.push(cell)
      cell = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1
      row.push(cell)
      if (row.some((value) => value.trim())) rows.push(row)
      row = []
      cell = ''
    } else {
      cell += character
    }
  }

  row.push(cell)
  if (row.some((value) => value.trim())) rows.push(row)
  return rows
}

function productsFromCsv(text, categories, products) {
  const [headerRow, ...dataRows] = parseCsv(text.replace(/^\uFEFF/, ''))
  if (!headerRow) throw new Error('File CSV không có dữ liệu.')

  const headers = headerRow.map((header) => header.trim().toLowerCase())
  const required = ['sku', 'name', 'category', 'price', 'stock', 'unit']
  if (required.some((column) => !headers.includes(column))) {
    throw new Error(`CSV cần có các cột: ${required.join(', ')}.`)
  }

  const categoryNames = new Set(categories.map((category) => category.name))
  const field = (row, name) => row[headers.indexOf(name)]?.trim() || ''
  return dataRows.map((row, index) => {
    const sku = field(row, 'sku')
    const existing = products.find((product) => product.sku === sku)
    const category = field(row, 'category')
    const price = Number(field(row, 'price'))
    const stock = Number(field(row, 'stock'))
    const status = field(row, 'status') || existing?.status || 'draft'
    const oldPriceValue = field(row, 'old_price')

    if (!sku) throw new Error(`Dòng ${index + 2}: SKU không được để trống.`)
    if (!field(row, 'name')) throw new Error(`Dòng ${index + 2}: tên sản phẩm không được để trống.`)
    if (!categoryNames.has(category)) throw new Error(`Dòng ${index + 2}: danh mục "${category}" không tồn tại.`)
    if (!Number.isFinite(price) || price < 0) throw new Error(`Dòng ${index + 2}: giá bán không hợp lệ.`)
    if (!Number.isInteger(stock) || stock < 0) throw new Error(`Dòng ${index + 2}: tồn kho không hợp lệ.`)
    if (!['active', 'draft'].includes(status)) throw new Error(`Dòng ${index + 2}: trạng thái phải là active hoặc draft.`)
    if (!field(row, 'unit')) throw new Error(`Dòng ${index + 2}: quy cách không được để trống.`)
    if (oldPriceValue && (!Number.isFinite(Number(oldPriceValue)) || Number(oldPriceValue) < price)) throw new Error(`Dòng ${index + 2}: giá trước giảm phải lớn hơn hoặc bằng giá bán.`)

    return {
      ...existing,
      sku,
      name: field(row, 'name'),
      category,
      price,
      oldPrice: oldPriceValue ? Number(oldPriceValue) : undefined,
      stock,
      status,
      unit: field(row, 'unit'),
      badge: field(row, 'badge') || undefined,
      image: field(row, 'image_url') || existing?.image || defaultProductImage,
      manufacturer: field(row, 'manufacturer') || existing?.manufacturer || 'LyLy Market',
      vendor: field(row, 'vendor') || existing?.vendor || 'LyLy Market',
      warehouse: field(row, 'warehouse') || existing?.warehouse || 'Main Store',
      productType: field(row, 'product_type') || existing?.productType || 'Grocery',
    }
  })
}

function pdfText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/[\\()]/g, '\\$&')
}

function buildCatalogPdf(products) {
  const lines = products.map((product) => `${product.name} | ${product.sku} | ${product.category} | ${money(product.price)} | Stock: ${product.stock}`)
  const chunks = Array.from({ length: Math.max(1, Math.ceil(lines.length / 40)) }, (_, index) => lines.slice(index * 40, index * 40 + 40))
  const fontObjectId = 3 + chunks.length * 2
  const objects = []
  const pageIds = chunks.map((_, index) => 3 + index * 2)

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`
  chunks.forEach((chunk, index) => {
    const pageObjectId = pageIds[index]
    const contentObjectId = pageObjectId + 1
    const content = [
      'BT',
      '/F1 17 Tf',
      '50 790 Td',
      '(LyLy Product Catalog) Tj',
      '/F1 9 Tf',
      '0 -20 Td',
      `(Page ${index + 1} of ${chunks.length}) Tj`,
      ...chunk.flatMap((line) => ['0 -16 Td', `(${pdfText(line)}) Tj`]),
      'ET',
    ].join('\n')
    objects[pageObjectId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`
    objects[contentObjectId] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  })
  objects[fontObjectId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = pdf.length
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`
  }
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`
  for (let index = 1; index < objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return pdf
}

function downloadCatalogPdf(products) {
  downloadBlob(new Blob([buildCatalogPdf(products)], { type: 'application/pdf' }), 'lyly-product-catalog.pdf')
}

function downloadOrdersCsv(orders) {
  const headers = ['order_number', 'date', 'customer', 'email', 'phone', 'location', 'payment_status', 'delivery_status', 'items', 'total']
  const rows = orders.map((order) => [
    order.id,
    order.date,
    order.customer,
    order.email || '',
    order.phone || '',
    order.location || '',
    order.payment,
    order.delivery,
    order.items,
    money(order.total),
  ])
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')
  downloadBlob(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }), 'lyly-orders.csv')
}

function StatusPill({ children }) {
  return <span className={`admin-status ${String(children).toLowerCase().replaceAll(' ', '-')}`}>{children}</span>
}

function AdminLogo() {
  return (
    <a className="admin-logo" href="/admin" aria-label="LyLy admin home">
      <Leaf size={22} />
      <span>LyLy</span>
      <small>admin</small>
    </a>
  )
}

function SectionTitle({ title, description, action, onAction, icon: Icon = Plus }) {
  return (
    <div className="admin-page-heading">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <button className="admin-primary" type="button" onClick={onAction}><Icon size={16} />{action}</button>}
    </div>
  )
}

function EmptyHint({ icon: Icon, title, copy }) {
  return <div className="empty-hint"><Icon size={33} /><h3>{title}</h3><p>{copy}</p></div>
}

function Dashboard({ tasks, setTasks, orders }) {
  const [assistantText, setAssistantText] = useState('')
  const [assistantReply, setAssistantReply] = useState('')
  const toggleTask = (id) => setTasks((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])

  const submitAssistant = (event) => {
    event.preventDefault()
    if (!assistantText.trim()) return
    setAssistantReply('Tôi đã ghi nhận. Bạn có thể bắt đầu bằng việc cập nhật banner theo mùa và kiểm tra tồn kho sản phẩm bán chạy.')
    setAssistantText('')
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-topline">
        <div>
          <p className="admin-eyebrow">Tổng quan cửa hàng</p>
          <h1>Chào buổi chiều, LyLy.</h1>
        </div>
        <div className="admin-date"><CalendarDays size={16} /> 02 Jun 2026 <ChevronDown size={14} /></div>
      </div>

      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <span><Sparkles size={14} /> LyLy market workspace</span>
          <h2>Bạn đã có sản phẩm để bán.<br />Bạn muốn làm gì tiếp theo?</h2>
          <p>Hoàn thiện cửa hàng và theo dõi các công việc vận hành hằng ngày.</p>
        </div>
        <img src="/images/lyly-hero.png" alt="" />
      </section>

      <form className="assistant-bar" onSubmit={submitAssistant}>
        <Bot size={20} />
        <input value={assistantText} onChange={(event) => setAssistantText(event.target.value)} placeholder="Hỏi trợ lý LyLy về cửa hàng của bạn" />
        <button type="submit" aria-label="Send prompt"><Send size={17} /></button>
      </form>
      {assistantReply && <div className="assistant-reply"><Bot size={17} /><p>{assistantReply}</p><button type="button" onClick={() => setAssistantReply('')}><X size={15} /></button></div>}

      <div className="dashboard-section-heading">
        <div><p className="admin-eyebrow">Bắt đầu nhanh</p><h2>Thiết lập cửa hàng LyLy</h2></div>
        <span>{tasks.length}/5 hoàn thành</span>
      </div>
      <section className="setup-grid">
        <SetupCard id="theme" tasks={tasks} onToggle={toggleTask} wide title="Chọn thiết kế cửa hàng" copy="Chỉnh storefront phù hợp với thương hiệu và các mùa bán hàng." button="Xem giao diện">
          <div className="setup-theme-visual"><Image size={36} /><span>Aa</span><i></i></div>
        </SetupCard>
        <SetupCard id="payment" tasks={tasks} onToggle={toggleTask} wide title="Thiết lập thanh toán" copy="Cho phép khách hàng thanh toán đơn hàng an toàn và thuận tiện." button="Kích hoạt thanh toán">
          <div className="setup-payment-visual"><b>VISA</b><b>Pay</b><b>••</b></div>
        </SetupCard>
        <SetupCard id="name" tasks={tasks} onToggle={toggleTask} title="Đặt tên cửa hàng" copy="Hiển thị thông tin nhất quán trong email và khi thanh toán." button="Kiểm tra tên">
          <div className="setup-mini-visual"><Store size={48} /></div>
        </SetupCard>
        <SetupCard id="domain" tasks={tasks} onToggle={toggleTask} title="Sở hữu tên miền riêng" copy="Tạo URL mang thương hiệu để khách hàng dễ nhớ hơn." button="Thiết lập miền">
          <div className="domain-visual"><Globe2 size={40} /><span>lylymarket.com</span></div>
        </SetupCard>
        <SetupCard id="delivery" tasks={tasks} onToggle={toggleTask} title="Xem lại phí vận chuyển" copy="Kiểm tra mức phí theo địa điểm và giá trị đơn hàng." button="Xem lại phí">
          <div className="setup-mini-visual"><Truck size={54} /></div>
        </SetupCard>
      </section>

      <section className="dashboard-lower-grid">
        <div className="admin-panel recent-orders">
          <div className="panel-title"><div><p className="admin-eyebrow">Hôm nay</p><h2>Đơn hàng gần đây</h2></div><a href="/admin/orders">Xem tất cả <ArrowRight size={15} /></a></div>
          {orders.slice(0, 4).map((order) => (
            <div className="compact-order" key={order.id}>
              <div><b>{order.id}</b><small>{order.customer}</small></div>
              <span>{money(order.total)}</span>
              <StatusPill>{order.delivery}</StatusPill>
            </div>
          ))}
        </div>
        <div className="admin-panel sales-summary">
          <div className="panel-title"><div><p className="admin-eyebrow">7 ngày qua</p><h2>Tóm tắt doanh thu</h2></div></div>
          <strong>{money(2846.35)}</strong>
          <p><ArrowUpRight size={15} /> 18.6% so với tuần trước</p>
          <div className="mini-chart">{[34, 51, 46, 68, 59, 78, 91].map((height, index) => <i style={{ height: `${height}%` }} key={index} />)}</div>
        </div>
      </section>
    </div>
  )
}

function SetupCard({ id, title, copy, button, children, wide, tasks, onToggle }) {
  const complete = tasks.includes(id)
  return (
    <article className={`setup-card ${wide ? 'wide' : ''} ${complete ? 'complete' : ''}`}>
      <button className="task-check" type="button" onClick={() => onToggle(id)} aria-label={`Mark ${title} complete`}>
        {complete ? <CheckCircle2 size={19} /> : <Circle size={19} />}
      </button>
      <div><h3>{title}</h3><p>{copy}</p></div>
      {children}
      <button className="admin-secondary" type="button" onClick={() => onToggle(id)}>{complete ? 'Đã hoàn tất' : button}</button>
    </article>
  )
}

function ProductsPage({ meta, categories, products, onBulkEdit, onCreate, onEdit, onImport, onRemove }) {
  const [query, setQuery] = useState('')
  const [statusTab, setStatusTab] = useState('all')
  const [selected, setSelected] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [sku, setSku] = useState('')
  const [notice, setNotice] = useState('')
  const [filters, setFilters] = useState({
    category: 'all',
    includeSubcategories: true,
    manufacturer: 'all',
    vendor: 'all',
    warehouse: 'all',
    productType: 'all',
    published: 'all',
    stock: 'all',
  })
  const importInput = useRef(null)
  const filterOptions = (name) => [...new Set(products.map((product) => product[name]).filter(Boolean))].sort()
  const activeFilterCount = Object.entries(filters).filter(([name, value]) => name !== 'includeSubcategories' && value !== 'all').length
  const categoryMatches = (product) => {
    if (filters.category === 'all' || product.category === filters.category) return true
    if (!filters.includeSubcategories) return false

    const selectedCategory = categories.find((category) => category.name === filters.category)
    let productCategory = categories.find((category) => category.name === product.category)
    while (selectedCategory && productCategory?.parentId) {
      productCategory = categories.find((category) => category.id === productCategory.parentId)
      if (productCategory?.id === selectedCategory.id) return true
    }
    return false
  }
  const visible = products.filter((product) => {
    const matchesQuery = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = statusTab === 'all' || product.status === statusTab
    const matchesPublished = filters.published === 'all' || product.status === filters.published
    const matchesStock = filters.stock === 'all'
      || (filters.stock === 'in' && product.stock > 0)
      || (filters.stock === 'out' && product.stock === 0)
      || (filters.stock === 'low' && product.stock > 0 && product.stock < 10)
    return matchesQuery
      && matchesStatus
      && matchesPublished
      && matchesStock
      && categoryMatches(product)
      && (filters.manufacturer === 'all' || product.manufacturer === filters.manufacturer)
      && (filters.vendor === 'all' || product.vendor === filters.vendor)
      && (filters.warehouse === 'all' || product.warehouse === filters.warehouse)
      && (filters.productType === 'all' || product.productType === filters.productType)
  })
  const removeProduct = (id) => onRemove([id])
  const visibleIds = visible.map((product) => product.id)
  const allVisibleSelected = visible.length > 0 && visibleIds.every((id) => selected.includes(id))
  const toggleAll = () => setSelected((current) => allVisibleSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])])
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const removeSelected = async () => {
    await onRemove(selected)
    setSelected([])
  }
  const setFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value }))
  const resetFilters = () => setFilters({
    category: 'all',
    includeSubcategories: true,
    manufacturer: 'all',
    vendor: 'all',
    warehouse: 'all',
    productType: 'all',
    published: 'all',
    stock: 'all',
  })
  const goToSku = () => {
    const product = products.find((item) => item.sku.toLowerCase() === sku.trim().toLowerCase())
    if (!product) {
      setNotice('Không tìm thấy sản phẩm có SKU này.')
      return
    }
    setNotice('')
    onEdit(product)
  }
  const importCsv = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const imported = productsFromCsv(await file.text(), categories, products)
      await onImport(imported)
      setNotice(`Đã nhập ${imported.length} sản phẩm từ CSV.`)
    } catch (error) {
      setNotice(error.message)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <>
      <SectionTitle title={meta.products[0]} description={meta.products[1]} />
      <div className="product-action-bar">
        <button className="admin-primary" type="button" onClick={onCreate}><Plus size={15} /> Thêm mới</button>
        <button className="admin-secondary" type="button" disabled={!selected.length} onClick={() => setBulkOpen(true)}><Pencil size={15} /> Sửa hàng loạt</button>
        <button className="admin-secondary" type="button" onClick={() => downloadCatalogPdf(visible)}><FileText size={15} /> Tải catalog PDF</button>
        <button className="admin-secondary" type="button" onClick={() => downloadProductsCsv(visible)}><Download size={15} /> Xuất CSV</button>
        <button className="admin-secondary" type="button" onClick={() => importInput.current?.click()}><Upload size={15} /> Nhập CSV</button>
        <button className="product-danger" type="button" disabled={!selected.length} onClick={removeSelected}><Trash2 size={15} /> Xóa đã chọn{selected.length ? ` (${selected.length})` : ''}</button>
        <input ref={importInput} type="file" accept=".csv,text/csv" hidden onChange={importCsv} />
      </div>
      {notice && <div className="product-notice"><span>{notice}</span><button type="button" onClick={() => setNotice('')}><X size={14} /></button></div>}
      <section className="admin-panel data-panel">
        <div className="data-tabs"><button className={statusTab === 'all' ? 'active' : ''} type="button" onClick={() => setStatusTab('all')}>Tất cả ({products.length})</button><button className={statusTab === 'active' ? 'active' : ''} type="button" onClick={() => setStatusTab('active')}>Đang bán ({products.filter((product) => product.status === 'active').length})</button><button className={statusTab === 'draft' ? 'active' : ''} type="button" onClick={() => setStatusTab('draft')}>Bản nháp ({products.filter((product) => product.status === 'draft').length})</button></div>
        <div className="table-toolbar">
          <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm sản phẩm" /></label>
          <button className={activeFilterCount ? 'filter-active' : ''} type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}><Filter size={15} /> Bộ lọc {activeFilterCount > 0 && <em>{activeFilterCount}</em>}</button>
        </div>
        {filtersOpen && (
          <div className="product-filter-panel">
            <label><span>Danh mục</span><select value={filters.category} onChange={(event) => setFilter('category', event.target.value)}><option value="all">Tất cả danh mục</option>{categories.filter((category) => category.active).map((category) => <option key={category.id}>{category.name}</option>)}</select></label>
            <label><span>Nhà sản xuất</span><select value={filters.manufacturer} onChange={(event) => setFilter('manufacturer', event.target.value)}><option value="all">Tất cả</option>{filterOptions('manufacturer').map((value) => <option key={value}>{value}</option>)}</select></label>
            <label><span>Nhà cung cấp</span><select value={filters.vendor} onChange={(event) => setFilter('vendor', event.target.value)}><option value="all">Tất cả</option>{filterOptions('vendor').map((value) => <option key={value}>{value}</option>)}</select></label>
            <label><span>Kho hàng</span><select value={filters.warehouse} onChange={(event) => setFilter('warehouse', event.target.value)}><option value="all">Tất cả</option>{filterOptions('warehouse').map((value) => <option key={value}>{value}</option>)}</select></label>
            <label><span>Loại sản phẩm</span><select value={filters.productType} onChange={(event) => setFilter('productType', event.target.value)}><option value="all">Tất cả</option>{filterOptions('productType').map((value) => <option key={value}>{value}</option>)}</select></label>
            <label><span>Hiển thị storefront</span><select value={filters.published} onChange={(event) => setFilter('published', event.target.value)}><option value="all">Tất cả</option><option value="active">Đang hiển thị</option><option value="draft">Đang ẩn</option></select></label>
            <label><span>Tồn kho</span><select value={filters.stock} onChange={(event) => setFilter('stock', event.target.value)}><option value="all">Tất cả</option><option value="in">Còn hàng</option><option value="low">Sắp hết hàng</option><option value="out">Hết hàng</option></select></label>
            <label className="product-filter-checkbox"><input type="checkbox" checked={filters.includeSubcategories} onChange={(event) => setFilter('includeSubcategories', event.target.checked)} /><span>Tìm trong danh mục con</span></label>
            <label className="product-sku-jump"><span>Đi thẳng tới SKU</span><div><input value={sku} onChange={(event) => setSku(event.target.value)} placeholder="Ví dụ: FRT-1024" /><button type="button" onClick={goToSku}>Mở</button></div></label>
            <div className="product-filter-actions"><button className="admin-secondary" type="button" onClick={resetFilters}>Xóa lọc</button><button className="admin-primary" type="button" onClick={() => setFiltersOpen(false)}>Áp dụng</button></div>
          </div>
        )}
        <div className="admin-table-wrap">
          <table className="admin-table product-table">
            <thead><tr><th><input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} /></th><th>Sản phẩm</th><th>Trạng thái</th><th>Tồn kho</th><th>Danh mục</th><th>Giá</th><th></th></tr></thead>
            <tbody>
              {visible.map((product) => (
                <tr key={product.id}>
                  <td><input type="checkbox" checked={selected.includes(product.id)} onChange={() => toggle(product.id)} /></td>
                  <td><div className="product-cell"><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.sku} · {product.unit}</small></span></div></td>
                  <td><StatusPill>{product.status === 'active' ? 'Active' : 'Draft'}</StatusPill></td>
                  <td><span className={product.stock < 10 ? 'low-stock' : ''}>{product.stock} in stock</span></td>
                  <td>{product.category}</td>
                  <td><b>{money(product.price)}</b></td>
                  <td><div className="row-actions"><button className="row-icon" type="button" onClick={() => onEdit(product)} title="Sửa sản phẩm"><Pencil size={15} /></button><button className="row-icon" type="button" onClick={() => removeProduct(product.id)} aria-label={`Delete ${product.name}`}><Trash2 size={15} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && <EmptyHint icon={ShoppingBag} title="Không tìm thấy sản phẩm" copy="Thử thay đổi từ khóa hoặc thêm sản phẩm mới." />}
        </div>
      </section>
      {bulkOpen && <BulkProductModal categories={categories} count={selected.length} onClose={() => setBulkOpen(false)} onSubmit={async (changes) => { await onBulkEdit(selected, changes); setSelected([]); setBulkOpen(false) }} />}
    </>
  )
}

function CategoriesPage({ meta, categories, products, onCreate, onEdit, onRemove, onToggle }) {
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({ root: 'all', status: 'all', homepage: 'all', menu: 'all' })
  const rootCategories = categories.filter((category) => !category.parentId)
  const activeFilterCount = Object.values(filters).filter((value) => value !== 'all').length
  const visible = categories.filter((category) => {
    const matchesQuery = `${category.name} ${category.slug}`.toLowerCase().includes(query.toLowerCase())
    const rootId = Number(filters.root)
    const matchesRoot = filters.root === 'all' || category.id === rootId || category.parentId === rootId
    const matchesStatus = filters.status === 'all' || category.active === (filters.status === 'active')
    const matchesHomepage = filters.homepage === 'all' || category.showOnHome === (filters.homepage === 'yes')
    const matchesMenu = filters.menu === 'all' || category.includeInMenu === (filters.menu === 'yes')
    return matchesQuery && matchesRoot && matchesStatus && matchesHomepage && matchesMenu
  })
  const categoryName = (id) => categories.find((category) => category.id === id)?.name || 'Danh mục gốc'
  const productCount = (name) => products.filter((product) => product.category === name).length
  const setFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value }))
  const resetFilters = () => setFilters({ root: 'all', status: 'all', homepage: 'all', menu: 'all' })

  return (
    <>
      <SectionTitle title={meta.categories[0]} description={meta.categories[1]} action="Thêm danh mục" onAction={onCreate} />
      <section className="admin-panel data-panel">
        <div className="table-toolbar category-toolbar">
          <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm danh mục" /></label>
          <button className={activeFilterCount ? 'filter-active' : ''} type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}><Filter size={15} /> Bộ lọc {activeFilterCount > 0 && <em>{activeFilterCount}</em>}</button>
        </div>
        {filtersOpen && (
          <div className="category-filter-panel">
            <label><span>Danh mục gốc</span><select value={filters.root} onChange={(event) => setFilter('root', event.target.value)}><option value="all">Tất cả danh mục</option>{rootCategories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
            <label><span>Trạng thái</span><select value={filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="all">Tất cả trạng thái</option><option value="active">Đang hoạt động</option><option value="draft">Tạm ẩn</option></select></label>
            <label><span>Homepage</span><select value={filters.homepage} onChange={(event) => setFilter('homepage', event.target.value)}><option value="all">Tất cả</option><option value="yes">Có hiển thị</option><option value="no">Không hiển thị</option></select></label>
            <label><span>Mega menu</span><select value={filters.menu} onChange={(event) => setFilter('menu', event.target.value)}><option value="all">Tất cả</option><option value="yes">Có hiển thị</option><option value="no">Không hiển thị</option></select></label>
            <div className="category-filter-actions"><button className="admin-secondary" type="button" onClick={resetFilters}>Xóa lọc</button><button className="admin-primary" type="button" onClick={() => setFiltersOpen(false)}>Áp dụng</button></div>
          </div>
        )}
        <div className="admin-table-wrap">
          <table className="admin-table category-table">
            <thead><tr><th>Danh mục</th><th>Danh mục cha</th><th>Trạng thái</th><th>Homepage</th><th>Mega menu</th><th>Sản phẩm</th><th>Menu</th><th>Home</th><th></th></tr></thead>
            <tbody>
              {visible.map((category) => (
                <tr key={category.id}>
                  <td><div className="category-cell"><b>{category.name}</b><small>/{category.slug}</small></div></td>
                  <td>{categoryName(category.parentId)}</td>
                  <td><StatusPill>{category.active ? 'Active' : 'Draft'}</StatusPill></td>
                  <td>{category.showOnHome ? 'Có' : '-'}</td>
                  <td>{category.includeInMenu ? 'Có' : '-'}</td>
                  <td>{productCount(category.name)}</td>
                  <td>{category.displayOrder}</td>
                  <td>{category.homeDisplayOrder ?? category.displayOrder}</td>
                  <td><div className="row-actions"><button className="row-icon" type="button" onClick={() => onToggle(category)} title={category.active ? 'Ẩn danh mục' : 'Hiện danh mục'}><Eye size={15} /></button><button className="row-icon" type="button" onClick={() => onEdit(category)} title="Sửa danh mục"><Pencil size={15} /></button><button className="row-icon" type="button" onClick={() => onRemove(category.id)} title="Xóa danh mục"><Trash2 size={15} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && <EmptyHint icon={Tag} title="Không tìm thấy danh mục" copy="Thử thay đổi từ khóa hoặc thêm danh mục mới." />}
        </div>
      </section>
    </>
  )
}

function OrdersPage({ meta, orders, onUpdate, onBulkUpdate }) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const [deliveryFilter, setDeliveryFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [selected, setSelected] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [detailOrder, setDetailOrder] = useState(null)
  const [notice, setNotice] = useState('')
  const visible = orders.filter((order) => {
    const text = `${order.id} ${order.customer} ${order.email || ''} ${order.phone || ''} ${order.location || ''}`.toLowerCase()
    const matchesQuery = text.includes(query.toLowerCase())
    const matchesDelivery = deliveryFilter === 'all' || order.delivery.toLowerCase() === deliveryFilter
    const matchesPayment = paymentFilter === 'all' || order.payment.toLowerCase() === paymentFilter
    const matchesTab =
      tab === 'all'
      || (tab === 'open' && !['delivered', 'cancelled'].includes(order.delivery.toLowerCase()))
      || (tab === 'unpaid' && order.payment.toLowerCase() === 'pending')
      || (tab === 'fulfilled' && order.delivery.toLowerCase() === 'delivered')
    return matchesQuery && matchesDelivery && matchesPayment && matchesTab
  }).sort((a, b) => {
    if (sort === 'total-desc') return b.total - a.total
    if (sort === 'total-asc') return a.total - b.total
    return String(b.createdAt || b.date).localeCompare(String(a.createdAt || a.date))
  })
  const selectedOrders = visible.filter((order) => selected.includes(order.id))
  const allSelected = visible.length > 0 && selected.length === visible.length
  const openCount = orders.filter((order) => !['delivered', 'cancelled'].includes(order.delivery.toLowerCase())).length
  const unpaidCount = orders.filter((order) => order.payment.toLowerCase() === 'pending').length
  const deliveredCount = orders.filter((order) => order.delivery.toLowerCase() === 'delivered').length

  const toggleAll = () => setSelected(allSelected ? [] : visible.map((order) => order.id))
  const toggleSelected = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const updateOrder = async (order, changes) => {
    const updated = await onUpdate({ ...order, ...changes })
    setDetailOrder((current) => current?.id === updated.id ? updated : current)
    setNotice(`${updated.id} đã được cập nhật.`)
  }
  const bulkUpdate = async (changes) => {
    if (!selectedOrders.length) return
    await onBulkUpdate(selectedOrders.map((order) => ({ ...order, ...changes })))
    setNotice(`Đã cập nhật ${selectedOrders.length} đơn hàng.`)
    setSelected([])
  }

  return (
    <>
      <SectionTitle title={meta.orders[0]} description={meta.orders[1]} action="Xuất đơn hàng" onAction={() => downloadOrdersCsv(visible)} icon={Download} />
      <section className="metrics-grid">
        <MetricCard label="Tổng đơn" value={orders.length} note={`${openCount} đơn đang xử lý`} />
        <MetricCard label="Cần thanh toán" value={unpaidCount} note="Theo dõi trước khi đóng gói" />
        <MetricCard label="Doanh thu" value={money(orders.reduce((total, order) => total + order.total, 0))} note={`${deliveredCount} đơn đã giao`} />
      </section>
      {notice && <div className="product-notice"><span>{notice}</span><button type="button" onClick={() => setNotice('')}><X size={14} /></button></div>}
      <section className="admin-panel data-panel">
        <div className="data-tabs">
          <button className={tab === 'all' ? 'active' : ''} type="button" onClick={() => setTab('all')}>Tất cả <em>{orders.length}</em></button>
          <button className={tab === 'open' ? 'active' : ''} type="button" onClick={() => setTab('open')}>Đang xử lý <em>{openCount}</em></button>
          <button className={tab === 'unpaid' ? 'active' : ''} type="button" onClick={() => setTab('unpaid')}>Chưa thanh toán <em>{unpaidCount}</em></button>
          <button className={tab === 'fulfilled' ? 'active' : ''} type="button" onClick={() => setTab('fulfilled')}>Đã giao <em>{deliveredCount}</em></button>
        </div>
        <div className="table-toolbar">
          <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo mã đơn, khách hàng, email hoặc SĐT" /></label>
          <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Mới nhất</option><option value="total-desc">Tổng cao nhất</option><option value="total-asc">Tổng thấp nhất</option></select>
          <button className={filterOpen ? 'filter-active' : ''} type="button" onClick={() => setFilterOpen(!filterOpen)}><Filter size={15} /> Bộ lọc</button>
          <button type="button" onClick={() => downloadOrdersCsv(visible)}><Download size={15} /> Xuất</button>
        </div>
        {selected.length > 0 && (
          <div className="order-bulk-bar">
            <span>{selected.length} đơn đã chọn</span>
            <button type="button" onClick={() => bulkUpdate({ payment: 'Paid' })}>Đã thanh toán</button>
            <button type="button" onClick={() => bulkUpdate({ delivery: 'Packing' })}>Đóng gói</button>
            <button type="button" onClick={() => bulkUpdate({ delivery: 'Ready' })}>Sẵn sàng giao</button>
            <button type="button" onClick={() => bulkUpdate({ delivery: 'Delivered' })}>Đã giao</button>
            <button className="danger-button" type="button" onClick={() => bulkUpdate({ delivery: 'Cancelled' })}>Hủy đơn</button>
          </div>
        )}
        {filterOpen && (
          <div className="order-filter-panel">
            <label><span>Thanh toán</span><select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}><option value="all">Tất cả</option><option value="pending">Pending</option><option value="paid">Paid</option><option value="refunded">Refunded</option></select></label>
            <label><span>Giao hàng</span><select value={deliveryFilter} onChange={(event) => setDeliveryFilter(event.target.value)}><option value="all">Tất cả</option><option value="unfulfilled">Unfulfilled</option><option value="packing">Packing</option><option value="ready">Ready</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></label>
            <div className="category-filter-actions"><button className="admin-secondary" type="button" onClick={() => { setPaymentFilter('all'); setDeliveryFilter('all') }}>Xóa lọc</button></div>
          </div>
        )}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th><th>Đơn hàng</th><th>Ngày</th><th>Khách hàng</th><th>Thanh toán</th><th>Giao hàng</th><th>Số món</th><th>Tổng</th><th></th></tr></thead>
            <tbody>{visible.map((order) => (
              <tr key={order.id}>
                <td><input type="checkbox" checked={selected.includes(order.id)} onChange={() => toggleSelected(order.id)} /></td>
                <td><button className="order-link" type="button" onClick={() => setDetailOrder(order)}>{order.id}</button></td>
                <td>{order.date}</td>
                <td><div className="customer-cell"><span>{order.customer.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><b>{order.customer}</b><small>{order.email || order.location}</small></div></div></td>
                <td><StatusPill>{order.payment}</StatusPill></td>
                <td><StatusPill>{order.delivery}</StatusPill></td>
                <td>{order.items}</td>
                <td><b>{money(order.total)}</b></td>
                <td><div className="row-actions"><button className="row-icon" type="button" onClick={() => setDetailOrder(order)} title="Xem đơn"><Eye size={15} /></button><button className="row-icon" type="button" onClick={() => updateOrder(order, { delivery: 'Packing' })} title="Đóng gói"><Package size={15} /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
          {!visible.length && <EmptyHint icon={ShoppingCart} title="Không tìm thấy đơn hàng" copy="Thử đổi từ khóa, bộ lọc hoặc trạng thái đơn." />}
        </div>
      </section>
      {detailOrder && <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} onUpdate={updateOrder} />}
    </>
  )
}

function OrderDetailModal({ order, onClose, onUpdate }) {
  const [payment, setPayment] = useState(order.payment)
  const [delivery, setDelivery] = useState(order.delivery)
  const save = () => onUpdate(order, { payment, delivery })
  const subtotal = order.lineItems?.reduce((total, item) => total + item.total, 0) || order.total

  return (
    <Modal wide title={`${order.id} · ${order.customer}`} onClose={onClose}>
      <div className="order-detail">
        <section className="order-detail-main">
          <div className="order-card">
            <div className="order-card-title"><h3>Items</h3><StatusPill>{delivery}</StatusPill></div>
            <div className="order-line-list">
              {(order.lineItems?.length ? order.lineItems : [{ name: 'Order items', quantity: order.items, price: order.total, total: order.total }]).map((item, index) => (
                <div className="order-line-item" key={`${item.name}-${index}`}>
                  <div><b>{item.name}</b><small>{item.quantity} x {money(item.price)}</small></div>
                  <strong>{money(item.total)}</strong>
                </div>
              ))}
            </div>
            <div className="order-total-box">
              <p><span>Subtotal</span><b>{money(subtotal)}</b></p>
              <p><span>Shipping</span><b>Calculated</b></p>
              <p><span>Total</span><strong>{money(order.total)}</strong></p>
            </div>
          </div>

          <div className="order-card">
            <div className="order-card-title"><h3>Timeline</h3><button className="admin-secondary" type="button">Add note</button></div>
            <div className="order-timeline">
              <p><CheckCircle2 size={15} /> Order created on {order.date}</p>
              <p><Package size={15} /> Fulfillment status is {delivery}</p>
              <p><ShoppingBag size={15} /> Payment status is {payment}</p>
            </div>
            {order.note && <div className="order-note"><b>Customer note</b><span>{order.note}</span></div>}
          </div>
        </section>

        <aside className="order-detail-side">
          <div className="order-card">
            <h3>Actions</h3>
            <label><span>Payment</span><select value={payment} onChange={(event) => setPayment(event.target.value)}><option>Pending</option><option>Paid</option><option>Refunded</option></select></label>
            <label><span>Fulfillment</span><select value={delivery} onChange={(event) => setDelivery(event.target.value)}><option>Unfulfilled</option><option>Packing</option><option>Ready</option><option>Delivered</option><option>Cancelled</option></select></label>
            <button className="admin-primary" type="button" onClick={save}><CheckCircle2 size={15} /> Save status</button>
          </div>
          <div className="order-card">
            <h3>Customer</h3>
            <div className="order-contact">
              <b>{order.customer}</b>
              {order.email && <a href={`mailto:${order.email}`}>{order.email}</a>}
              {order.phone && <a href={`tel:${order.phone}`}>{order.phone}</a>}
              {order.location && <span>{order.location}</span>}
            </div>
          </div>
          <div className="order-card">
            <h3>Fraud analysis</h3>
            <p className="order-risk"><ShieldCheck size={16} /> Low risk · Billing and delivery details look consistent.</p>
          </div>
        </aside>
      </div>
    </Modal>
  )
}

function CustomersPage({ meta }) {
  const [query, setQuery] = useState('')
  const visible = customers.filter((customer) => `${customer.name} ${customer.email} ${customer.location}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <>
      <SectionTitle title={meta.customers[0]} description={meta.customers[1]} action="Thêm khách hàng" />
      <section className="admin-panel data-panel">
        <div className="data-tabs"><button className="active" type="button">Tất cả</button><button type="button">Khách quay lại</button><button type="button">Đăng ký email</button></div>
        <div className="table-toolbar"><label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên, email hoặc địa điểm" /></label><button type="button"><Filter size={15} /> Phân khúc</button></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th><input type="checkbox" /></th><th>Khách hàng</th><th>Địa điểm</th><th>Đơn hàng</th><th>Đã chi tiêu</th><th></th></tr></thead>
            <tbody>{visible.map((customer) => <tr key={customer.id}><td><input type="checkbox" /></td><td><div className="customer-cell"><span>{customer.initials}</span><div><b>{customer.name}</b><small>{customer.email}</small></div></div></td><td>{customer.location}</td><td>{customer.orders}</td><td><b>{money(customer.spent)}</b></td><td><button className="row-icon" type="button"><MoreHorizontal size={17} /></button></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function MarketingPage({ meta }) {
  return (
    <>
      <SectionTitle title={meta.marketing[0]} description={meta.marketing[1]} action="Tạo chiến dịch" />
      <section className="marketing-banner">
        <div><p className="admin-eyebrow">Grow with LyLy</p><h2>Đưa câu chuyện tươi ngon<br />đến đúng khách hàng.</h2><p>Tạo chiến dịch email, social và ưu đãi theo mùa từ một nơi.</p><button className="admin-primary" type="button"><Plus size={16} />Tạo chiến dịch</button></div>
        <div className="marketing-illustration"><Megaphone size={74} /><i></i><i></i><i></i></div>
      </section>
      <section className="admin-panel">
        <div className="panel-title"><div><p className="admin-eyebrow">Hoạt động</p><h2>Chiến dịch gần đây</h2></div><button className="admin-secondary" type="button">Xem lịch</button></div>
        <div className="campaign-list">{campaigns.map((campaign) => <div className="campaign-row" key={campaign.name}><div className="campaign-icon"><Mail size={18} /></div><div><b>{campaign.name}</b><small>{campaign.channel} · {campaign.audience}</small></div><span>{campaign.date}</span><StatusPill>{campaign.status}</StatusPill><button className="row-icon" type="button"><MoreHorizontal size={17} /></button></div>)}</div>
      </section>
    </>
  )
}

function DiscountsPage({ meta, discounts, onCreate }) {
  return (
    <>
      <SectionTitle title={meta.discounts[0]} description={meta.discounts[1]} action="Tạo mã giảm giá" onAction={onCreate} />
      <section className="metrics-grid">
        <MetricCard label="Doanh số từ ưu đãi" value={money(1438)} note="Trong 30 ngày qua" />
        <MetricCard label="Mã đang hoạt động" value={String(discounts.filter((item) => item.status === 'Active').length)} note={`${discounts.length} mã đã tạo`} />
        <MetricCard label="Lượt sử dụng" value="237" note="+19% so với tháng trước" />
      </section>
      <section className="admin-panel data-panel">
        <div className="data-tabs"><button className="active" type="button">Tất cả</button><button type="button">Đang hoạt động</button><button type="button">Đã lên lịch</button><button type="button">Đã hết hạn</button></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Mã</th><th>Loại</th><th>Giá trị</th><th>Trạng thái</th><th>Lượt dùng</th><th>Kết thúc</th><th></th></tr></thead>
            <tbody>{discounts.map((discount) => <tr key={discount.code}><td><b className="discount-code"><Tag size={14} />{discount.code}</b></td><td>{discount.type}</td><td>{discount.value}</td><td><StatusPill>{discount.status}</StatusPill></td><td>{discount.uses}</td><td>{discount.ends}</td><td><button className="row-icon" type="button"><MoreHorizontal size={17} /></button></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function ContentPage({ meta }) {
  return (
    <>
      <SectionTitle title={meta.content[0]} description={meta.content[1]} action="Viết bài mới" />
      <section className="content-grid">
        {articles.map((article) => (
          <article className="admin-panel article-admin-card" key={article.title}>
            <img src={article.image} alt="" />
            <div><StatusPill>{article.status}</StatusPill><h3>{article.title}</h3><p>{article.author} · {article.date}</p><div><button className="admin-secondary" type="button"><Pencil size={14} /> Chỉnh sửa</button><button className="row-icon" type="button"><Eye size={16} /></button></div></div>
          </article>
        ))}
        <button className="new-content-card" type="button"><Plus size={24} /><span>Tạo bài viết mới</span></button>
      </section>
    </>
  )
}

function AnalyticsPage({ meta }) {
  const chart = [34, 48, 43, 55, 58, 72, 67, 81, 76, 88, 92, 98]
  return (
    <>
      <SectionTitle title={meta.analytics[0]} description={meta.analytics[1]} action="Xuất báo cáo" icon={Download} />
      <section className="metrics-grid analytics-metrics">
        <MetricCard label="Tổng doanh thu" value={money(12846.35)} note="+18.6% so với kỳ trước" />
        <MetricCard label="Giá trị đơn trung bình" value={money(53.74)} note="+4.2% so với kỳ trước" />
        <MetricCard label="Khách hàng quay lại" value="38.5%" note="+7.1% so với kỳ trước" />
        <MetricCard label="Tỷ lệ chuyển đổi" value="3.84%" note="+0.6% so với kỳ trước" />
      </section>
      <section className="analytics-grid">
        <div className="admin-panel analytics-chart">
          <div className="panel-title"><div><p className="admin-eyebrow">01 May - 02 Jun</p><h2>Doanh thu theo thời gian</h2></div><button className="admin-secondary" type="button">30 ngày <ChevronDown size={14} /></button></div>
          <div className="chart-area"><div className="chart-scale"><span>$4k</span><span>$3k</span><span>$2k</span><span>$1k</span><span>$0</span></div><div className="chart-bars">{chart.map((height, index) => <i style={{ height: `${height}%` }} key={index}><span>{money(height * 38)}</span></i>)}</div></div>
        </div>
        <div className="admin-panel top-products">
          <div className="panel-title"><div><p className="admin-eyebrow">Theo doanh thu</p><h2>Sản phẩm nổi bật</h2></div></div>
          {initialProducts.slice(0, 5).map((product, index) => <div className="top-product" key={product.id}><em>{index + 1}</em><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.category}</small></span><strong>{money(product.price * (45 - index * 4))}</strong></div>)}
        </div>
      </section>
    </>
  )
}

function LocationsPage({ meta }) {
  return (
    <>
      <SectionTitle title={meta.locations[0]} description={meta.locations[1]} action="Thêm địa điểm" />
      <section className="location-grid">
        <div className="admin-panel location-card"><MapPin size={24} /><div><StatusPill>Active</StatusPill><h3>LyLy Market · Brooklyn</h3><p>68 Greenpoint Avenue<br />Brooklyn, NY 11222</p><span>Pickup · Local delivery · Inventory</span></div><button className="row-icon" type="button"><MoreHorizontal size={17} /></button></div>
        <div className="admin-panel location-card"><MapPin size={24} /><div><StatusPill>Active</StatusPill><h3>LyLy Market · Manhattan</h3><p>214 Spring Street<br />New York, NY 10013</p><span>Pickup · Inventory</span></div><button className="row-icon" type="button"><MoreHorizontal size={17} /></button></div>
      </section>
    </>
  )
}

function SettingsPage({ meta }) {
  return (
    <>
      <SectionTitle title={meta.settings[0]} description={meta.settings[1]} />
      <section className="settings-grid">
        {[
          [Store, 'Thông tin cửa hàng', 'Tên, địa chỉ và thông tin liên hệ'],
          [ShoppingCart, 'Thanh toán', 'Phương thức thanh toán và checkout'],
          [Truck, 'Vận chuyển và giao hàng', 'Phí giao hàng, pickup và khu vực phục vụ'],
          [Users, 'Tài khoản và quyền', 'Phân quyền nhân viên quản trị'],
          [Bell, 'Thông báo', 'Email vận hành và cảnh báo tồn kho'],
          [Globe2, 'Tên miền', 'Kết nối tên miền storefront'],
        ].map(([Icon, title, copy]) => <button className="admin-panel setting-card" type="button" key={title}><Icon size={23} /><span><b>{title}</b><small>{copy}</small></span><ChevronRight size={17} /></button>)}
      </section>
    </>
  )
}

function MetricCard({ label, value, note }) {
  return <article className="admin-panel metric-card"><p>{label}</p><strong>{value}</strong><span><ArrowUpRight size={14} />{note}</span></article>
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function skuPrefix(category) {
  const known = {
    'bread-bakery': 'BRD',
    bakery: 'BRD',
    beverages: 'BEV',
    drinks: 'BEV',
    coffee: 'COF',
    'dairy-eggs': 'DRY',
    produce: 'FRT',
    'fruits-vegetables': 'FRT',
    vegetables: 'VEG',
    fruit: 'FRT',
    pantry: 'PAN',
    'pasta-noodles': 'PAS',
  }
  const slug = slugify(category || 'product')
  if (known[slug]) return known[slug]
  const letters = slug.split('-').filter(Boolean).map((part) => part[0]).join('').slice(0, 3)
  return (letters || 'PRD').padEnd(3, 'X').toUpperCase()
}

function generateProductSku(category, products, currentId) {
  const prefix = skuPrefix(category)
  const used = new Set(products.filter((product) => product.id !== currentId).map((product) => product.sku))
  const maxNumber = products.reduce((highest, product) => {
    if (product.id === currentId || !product.sku?.startsWith(`${prefix}-`)) return highest
    const value = Number(product.sku.slice(prefix.length + 1))
    return Number.isFinite(value) ? Math.max(highest, value) : highest
  }, 1029)
  let number = maxNumber + 1
  let sku = `${prefix}-${String(number).padStart(4, '0')}`
  while (used.has(sku)) {
    number += 1
    sku = `${prefix}-${String(number).padStart(4, '0')}`
  }
  return sku
}

function ensureUniqueSku(product, products) {
  const duplicate = products.some((item) => item.id !== product.id && item.sku === product.sku)
  return duplicate || !product.sku ? { ...product, sku: generateProductSku(product.category, products, product.id) } : product
}

function CategoryModal({ categories, category, onClose, onSubmit }) {
  const rootCategories = categories.filter((item) => !item.parentId)
  const editingRoot = Boolean(category && !category.parentId)
  const [form, setForm] = useState(category || {
    name: '',
    slug: '',
    parentId: '',
    description: '',
    image: '',
    active: true,
    showOnHome: false,
    includeInMenu: false,
    displayOrder: 100,
    homeDisplayOrder: 100,
  })
  const change = (event) => {
    const { checked, name, type, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' && (!current.slug || current.slug === slugify(current.name)) ? { slug: slugify(value) } : {}),
    }))
  }
  const submit = (event) => {
    event.preventDefault()
    onSubmit({
      ...form,
      parentId: form.parentId ? Number(form.parentId) : null,
      displayOrder: Number(form.displayOrder),
    })
  }

  return (
    <Modal title={category ? 'Sửa danh mục' : 'Thêm danh mục mới'} onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        <label><span>Tên danh mục</span><input required name="name" value={form.name} onChange={change} placeholder="Ví dụ: Fresh Produce" /></label>
        <div><label><span>Slug</span><input required name="slug" value={form.slug} onChange={change} placeholder="fresh-produce" /></label><label><span>Danh mục cha</span><select required={!editingRoot} name="parentId" value={form.parentId || ''} onChange={change}><option value="">{editingRoot ? 'Danh mục gốc' : 'Chọn danh mục gốc'}</option>{rootCategories.filter((item) => item.id !== category?.id).map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label></div>
        <label><span>Mô tả</span><input name="description" value={form.description || ''} onChange={change} placeholder="Mô tả ngắn cho danh mục" /></label>
        <label><span>URL ảnh</span><input name="image" value={form.image || ''} onChange={change} placeholder="https://..." /></label>
        <label><span>Thứ tự hiển thị</span><input required min="0" type="number" name="displayOrder" value={form.displayOrder} onChange={change} /></label>
        <label><span>Thứ tự homepage</span><input required min="0" type="number" name="homeDisplayOrder" value={form.homeDisplayOrder ?? form.displayOrder} onChange={change} /></label>
        <div className="modal-check-grid">
          <label><input type="checkbox" name="active" checked={form.active} onChange={change} /><span>Đang hoạt động</span></label>
          <label><input type="checkbox" name="showOnHome" checked={form.showOnHome} onChange={change} /><span>Hiện homepage</span></label>
          <label><input type="checkbox" name="includeInMenu" checked={form.includeInMenu} onChange={change} /><span>Hiện mega menu</span></label>
        </div>
        <div className="modal-actions"><button className="admin-secondary" type="button" onClick={onClose}>Hủy</button><button className="admin-primary" type="submit">{category ? 'Lưu thay đổi' : 'Thêm danh mục'}</button></div>
      </form>
    </Modal>
  )
}

function ProductModal({ categories, products, product, onClose, onSubmit, copy }) {
  const activeCategories = categories.filter((category) => category.active)
  const initialCategory = product?.category || activeCategories[0]?.name || ''
  const [form, setForm] = useState(product || {
    name: '',
    category: initialCategory,
    sku: generateProductSku(initialCategory, products),
    price: '',
    oldPrice: '',
    stock: '',
    status: 'active',
    unit: '',
    badge: '',
    image: defaultProductImage,
    manufacturer: 'LyLy Market',
    vendor: 'LyLy Market',
    warehouse: 'Main Store',
    productType: 'Grocery',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(form.image || defaultProductImage)
  const change = (event) => {
    const { name, value } = event.target
    setForm((current) => {
      const next = { ...current, [name]: value }
      if (name === 'category') next.sku = generateProductSku(value, products, product?.id)
      return next
    })
  }
  const chooseImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }
  const regenerateSku = () => setForm((current) => ({ ...current, sku: generateProductSku(current.category, products, product?.id) }))
  const submit = (event) => {
    event.preventDefault()
    onSubmit({
      ...form,
      sku: ensureUniqueSku(form, products).sku,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      stock: Number(form.stock),
      image: form.image || imagePreview || defaultProductImage,
      imageFile,
    })
  }
  return (
    <Modal wide title={product ? copy.edit : copy.create} onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        <label><span>{copy.name}</span><input required name="name" value={form.name} onChange={change} placeholder={copy.namePlaceholder} /></label>
        <div>
          <label><span>{copy.category}</span><select required name="category" value={form.category} onChange={change}>{activeCategories.map((category) => <option key={category.id}>{category.name}</option>)}</select></label>
          <div className="sku-field"><span>SKU</span><div><strong>{form.sku}</strong><button type="button" onClick={regenerateSku}>{copy.regenerate}</button></div></div>
        </div>
        <div><label><span>{copy.price}</span><input required min="0" step=".01" type="number" name="price" value={form.price} onChange={change} placeholder="0.00" /></label><label><span>{copy.oldPrice}</span><input min={form.price || 0} step=".01" type="number" name="oldPrice" value={form.oldPrice || ''} onChange={change} placeholder={copy.oldPricePlaceholder} /></label></div>
        <div><label><span>{copy.stock}</span><input required min="0" type="number" name="stock" value={form.stock} onChange={change} placeholder="0" /></label><label><span>{copy.status}</span><select name="status" value={form.status} onChange={change}><option value="active">{copy.active}</option><option value="draft">{copy.draft}</option></select></label></div>
        <div><label><span>{copy.unit}</span><input required name="unit" value={form.unit} onChange={change} placeholder={copy.unitPlaceholder} /></label><label><span>{copy.badge}</span><input name="badge" value={form.badge || ''} onChange={change} placeholder={copy.badgePlaceholder} /></label></div>
        <label className="product-upload-field">
          <span>{copy.image}</span>
          <div className="product-image-picker">
            <img src={imagePreview || defaultProductImage} alt="" />
            <div><Upload size={21} /><b>{imageFile ? imageFile.name : copy.chooseImage}</b><small>{copy.imageHelp}</small></div>
            <input accept="image/*" type="file" onChange={chooseImage} />
          </div>
        </label>
        <div><label><span>{copy.manufacturer}</span><input required name="manufacturer" value={form.manufacturer} onChange={change} /></label><label><span>{copy.vendor}</span><input required name="vendor" value={form.vendor} onChange={change} /></label></div>
        <div><label><span>{copy.warehouse}</span><input required name="warehouse" value={form.warehouse} onChange={change} /></label><label><span>{copy.productType}</span><input required name="productType" value={form.productType} onChange={change} /></label></div>
        <div className="modal-actions"><button className="admin-secondary" type="button" onClick={onClose}>{copy.cancel}</button><button className="admin-primary" type="submit">{product ? copy.save : copy.add}</button></div>
      </form>
    </Modal>
  )
}

function BulkProductModal({ categories, count, onClose, onSubmit }) {
  const [form, setForm] = useState({ category: '', status: '', stockAdjustment: '', manufacturer: '', vendor: '', warehouse: '', productType: '' })
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = (event) => {
    event.preventDefault()
    onSubmit({
      ...form,
      stockAdjustment: form.stockAdjustment ? Number(form.stockAdjustment) : 0,
    })
  }

  return (
    <Modal title={`Sửa hàng loạt ${count} sản phẩm`} onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        <p className="modal-note">Chỉ các trường có nhập giá trị mới được áp dụng cho sản phẩm đã chọn.</p>
        <div><label><span>Danh mục</span><select name="category" value={form.category} onChange={change}><option value="">Giữ nguyên</option>{categories.filter((category) => category.active).map((category) => <option key={category.id}>{category.name}</option>)}</select></label><label><span>Trạng thái</span><select name="status" value={form.status} onChange={change}><option value="">Giữ nguyên</option><option value="active">Đang hiển thị</option><option value="draft">Bản nháp</option></select></label></div>
        <label><span>Điều chỉnh tồn kho</span><input type="number" name="stockAdjustment" value={form.stockAdjustment} onChange={change} placeholder="Ví dụ: 10 hoặc -5" /></label>
        <div><label><span>Nhà sản xuất</span><input name="manufacturer" value={form.manufacturer} onChange={change} placeholder="Giữ nguyên" /></label><label><span>Nhà cung cấp</span><input name="vendor" value={form.vendor} onChange={change} placeholder="Giữ nguyên" /></label></div>
        <div><label><span>Kho hàng</span><input name="warehouse" value={form.warehouse} onChange={change} placeholder="Giữ nguyên" /></label><label><span>Loại sản phẩm</span><input name="productType" value={form.productType} onChange={change} placeholder="Giữ nguyên" /></label></div>
        <div className="modal-actions"><button className="admin-secondary" type="button" onClick={onClose}>Hủy</button><button className="admin-primary" type="submit">Áp dụng thay đổi</button></div>
      </form>
    </Modal>
  )
}

function DiscountModal({ onClose, onSubmit }) {
  const [code, setCode] = useState('')
  const [value, setValue] = useState('')
  const submit = (event) => {
    event.preventDefault()
    onSubmit({ code: code.toUpperCase(), type: 'Percentage', value: `${value}%`, uses: 0, status: 'Active', ends: 'No end date' })
  }
  return (
    <Modal title="Tạo mã giảm giá" onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        <label><span>Mã giảm giá</span><input required value={code} onChange={(event) => setCode(event.target.value)} placeholder="Ví dụ: SUMMER15" /></label>
        <label><span>Phần trăm giảm giá</span><input required min="1" max="100" type="number" value={value} onChange={(event) => setValue(event.target.value)} placeholder="15" /></label>
        <label><span>Áp dụng</span><select><option>Tất cả sản phẩm</option><option>Danh mục được chọn</option><option>Sản phẩm được chọn</option></select></label>
        <div className="modal-actions"><button className="admin-secondary" type="button" onClick={onClose}>Hủy</button><button className="admin-primary" type="submit">Tạo mã</button></div>
      </form>
    </Modal>
  )
}

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`admin-modal ${wide ? 'wide' : ''}`}>
        <div className="modal-header"><h2>{title}</h2><button type="button" onClick={onClose}><X size={19} /></button></div>
        {children}
      </section>
    </div>
  )
}

function AdminLogin({ status, error, onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    await onSubmit(email, password)
    setSubmitting(false)
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <AdminLogo />
        <p className="admin-eyebrow">Restricted workspace</p>
        <h1>Đăng nhập quản trị</h1>
        <p>Đăng nhập bằng tài khoản Supabase Auth đã được thêm vào bảng <b>admin_users</b>.</p>
        <label><span>Email</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label><span>Mật khẩu</span><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {status === 'unauthorized' && <div className="admin-auth-error">Tài khoản này chưa có quyền quản trị.</div>}
        {error && <div className="admin-auth-error">{error}</div>}
        <button className="admin-primary" type="submit" disabled={submitting}>{submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
        <a href="/">Quay lại storefront</a>
      </form>
    </div>
  )
}

function AdminApp() {
  const getPage = () => window.location.pathname.replace(/^\/admin\/?/, '') || 'dashboard'
  const [page, setPage] = useState(getPage)
  const [products, setProducts] = useState(initialProducts)
  const [categories, setCategories] = useState(initialCategories)
  const [adminOrders, setAdminOrders] = useState(initialOrders)
  const [discounts, setDiscounts] = useState(initialDiscounts)
  const [productModal, setProductModal] = useState(false)
  const [productEditing, setProductEditing] = useState(null)
  const [categoryModal, setCategoryModal] = useState(false)
  const [categoryEditing, setCategoryEditing] = useState(null)
  const [discountModal, setDiscountModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [tasks, setTasks] = useState(['name'])
  const [globalSearch, setGlobalSearch] = useState('')
  const [adminLanguage, setAdminLanguage] = useState(() => localStorage.getItem('lyly-admin-language') || 'vi')
  const [authStatus, setAuthStatus] = useState(isSupabaseConfigured ? 'loading' : 'demo')
  const [adminError, setAdminError] = useState('')
  const adminCopy = adminI18n[adminLanguage] || adminI18n.vi
  const localizedMeta = adminCopy.pageMeta

  const toggleLanguage = () => {
    setAdminLanguage((current) => {
      const next = current === 'vi' ? 'en' : 'vi'
      localStorage.setItem('lyly-admin-language', next)
      return next
    })
  }

  const searchMatches = useMemo(() => {
    if (!globalSearch.trim()) return []
    return [
      ...products.slice(0, 3).map((product) => ({ type: 'Sản phẩm', label: product.name, page: 'products' })),
      ...adminOrders.slice(0, 2).map((order) => ({ type: 'Đơn hàng', label: `${order.id} · ${order.customer}`, page: 'orders' })),
      ...customers.slice(0, 2).map((customer) => ({ type: 'Khách hàng', label: customer.name, page: 'customers' })),
    ].filter((item) => `${item.type} ${item.label}`.toLowerCase().includes(globalSearch.toLowerCase()))
  }, [globalSearch, products, adminOrders])

  useEffect(() => {
    const update = () => setPage(getPage())
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let ignore = false
    const bootstrap = async () => {
      try {
        const session = await getAdminSession()
        if (!session) {
          if (!ignore) setAuthStatus('signed-out')
          return
        }

        const hasAccess = await checkAdminAccess()
        if (!hasAccess) {
          if (!ignore) setAuthStatus('unauthorized')
          return
        }

        const [remoteProducts, remoteCategories, remoteOrders] = await Promise.all([loadAdminProducts(), loadAdminCategories(), loadAdminOrders()])
        if (!ignore) {
          setProducts(remoteProducts)
          setCategories(remoteCategories)
          setAdminOrders(remoteOrders || initialOrders)
          setAuthStatus('ready')
        }
      } catch (error) {
        console.error(error)
        if (!ignore) {
          setAdminError(error.message)
          setAuthStatus('signed-out')
        }
      }
    }

    bootstrap()
    return () => { ignore = true }
  }, [])

  const navigate = (nextPage) => {
    if (nextPage === 'online-store') {
      window.location.assign('/')
      return
    }
    window.history.pushState({}, '', nextPage === 'dashboard' ? '/admin' : `/admin/${nextPage}`)
    setPage(nextPage)
    setMenuOpen(false)
  }

  const login = async (email, password) => {
    setAdminError('')
    try {
      await signInAdmin(email, password)
      const hasAccess = await checkAdminAccess()
      if (!hasAccess) {
        setAuthStatus('unauthorized')
        return
      }
      const [remoteProducts, remoteCategories, remoteOrders] = await Promise.all([loadAdminProducts(), loadAdminCategories(), loadAdminOrders()])
      setProducts(remoteProducts)
      setCategories(remoteCategories)
      setAdminOrders(remoteOrders || initialOrders)
      setAuthStatus('ready')
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
    }
  }

  const logout = async () => {
    setAdminError('')
    try {
      await signOutAdmin()
      setAuthStatus('signed-out')
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
    }
  }

  const saveProduct = async (product) => {
    setAdminError('')
    try {
      const { imageFile, ...productFields } = ensureUniqueSku(product, products)
      const image = imageFile ? await uploadAdminProductImage(imageFile, productFields.sku) : productFields.image
      const payload = { ...productFields, image: image || defaultProductImage }

      if (payload.id) {
        const updatedProduct = await updateAdminProduct(payload)
        setProducts((current) => current.map((item) => item.id === updatedProduct.id ? updatedProduct : item))
      } else {
        const createdProduct = await createAdminProduct(payload)
        setProducts((current) => [createdProduct, ...current])
      }
      setProductEditing(null)
      setProductModal(false)
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
    }
  }

  const bulkEditProducts = async (ids, changes) => {
    setAdminError('')
    try {
      const updates = products
        .filter((product) => ids.includes(product.id))
        .map((product) => ({
          ...product,
          ...Object.fromEntries(Object.entries(changes).filter(([name, value]) => name !== 'stockAdjustment' && value !== '')),
          stock: Math.max(0, product.stock + changes.stockAdjustment),
        }))
      const updatedProducts = await updateAdminProducts(updates)
      const updatedById = new Map(updatedProducts.map((product) => [product.id, product]))
      setProducts((current) => current.map((product) => updatedById.get(product.id) || product))
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
      throw error
    }
  }

  const importProducts = async (importedProducts) => {
    setAdminError('')
    try {
      const savedProducts = await importAdminProducts(importedProducts)
      setProducts((current) => {
        const savedBySku = new Map(savedProducts.map((product) => [product.sku, product]))
        const unchanged = current.filter((product) => !savedBySku.has(product.sku))
        return [...savedProducts, ...unchanged]
      })
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
      throw error
    }
  }

  const removeProducts = async (ids) => {
    setAdminError('')
    try {
      await removeAdminProducts(ids)
      setProducts((current) => current.filter((product) => !ids.includes(product.id)))
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
    }
  }

  const saveCategory = async (category) => {
    setAdminError('')
    try {
      if (category.id) {
        const previous = categories.find((item) => item.id === category.id)
        const updatedCategory = await updateAdminCategory(category)
        setCategories((current) => current.map((item) => item.id === updatedCategory.id ? updatedCategory : item))
        if (previous?.name !== updatedCategory.name) {
          setProducts((current) => current.map((product) => product.category === previous.name ? { ...product, category: updatedCategory.name } : product))
        }
      } else {
        const createdCategory = await createAdminCategory(category)
        setCategories((current) => [...current, createdCategory].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name)))
      }
      setCategoryEditing(null)
      setCategoryModal(false)
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
    }
  }

  const toggleCategory = async (category) => {
    setAdminError('')
    try {
      const updatedCategory = await updateAdminCategory({ ...category, active: !category.active })
      setCategories((current) => current.map((item) => item.id === updatedCategory.id ? updatedCategory : item))
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
    }
  }

  const removeCategory = async (id) => {
    setAdminError('')
    try {
      await removeAdminCategories([id])
      setCategories((current) => current.filter((category) => category.id !== id))
    } catch (error) {
      console.error(error)
      setAdminError('Không thể xóa danh mục đang chứa sản phẩm. Hãy chuyển sản phẩm sang danh mục khác trước.')
    }
  }

  const addDiscount = (discount) => {
    setDiscounts((current) => [discount, ...current])
    setDiscountModal(false)
  }

  const saveOrder = async (order) => {
    setAdminError('')
    try {
      const updatedOrder = await updateAdminOrder(order)
      setAdminOrders((current) => current.map((item) => item.id === updatedOrder.id ? { ...item, ...updatedOrder } : item))
      return updatedOrder
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
      throw error
    }
  }

  const bulkSaveOrders = async (updates) => {
    setAdminError('')
    try {
      const updatedOrders = await updateAdminOrders(updates)
      const updatedById = new Map(updatedOrders.map((order) => [order.id, order]))
      setAdminOrders((current) => current.map((order) => updatedById.get(order.id) ? { ...order, ...updatedById.get(order.id) } : order))
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
      throw error
    }
  }

  const renderPage = () => {
    if (page === 'dashboard') return <Dashboard tasks={tasks} setTasks={setTasks} orders={adminOrders} />
    if (page === 'products') return <ProductsPage meta={localizedMeta} categories={categories} products={products} onBulkEdit={bulkEditProducts} onCreate={() => { setProductEditing(null); setProductModal(true) }} onEdit={(product) => { setProductEditing(product); setProductModal(true) }} onImport={importProducts} onRemove={removeProducts} />
    if (page === 'categories') return <CategoriesPage meta={localizedMeta} categories={categories} products={products} onCreate={() => { setCategoryEditing(null); setCategoryModal(true) }} onEdit={(category) => { setCategoryEditing(category); setCategoryModal(true) }} onRemove={removeCategory} onToggle={toggleCategory} />
    if (page === 'orders') return <OrdersPage meta={localizedMeta} orders={adminOrders} onUpdate={saveOrder} onBulkUpdate={bulkSaveOrders} />
    if (page === 'customers') return <CustomersPage meta={localizedMeta} />
    if (page === 'marketing') return <MarketingPage meta={localizedMeta} />
    if (page === 'discounts') return <DiscountsPage meta={localizedMeta} discounts={discounts} onCreate={() => setDiscountModal(true)} />
    if (page === 'content') return <ContentPage meta={localizedMeta} />
    if (page === 'analytics') return <AnalyticsPage meta={localizedMeta} />
    if (page === 'locations') return <LocationsPage meta={localizedMeta} />
    if (page === 'settings') return <SettingsPage meta={localizedMeta} />
    return <Dashboard tasks={tasks} setTasks={setTasks} orders={adminOrders} />
  }

  if (authStatus === 'loading') return <div className="admin-auth-loading">Đang kết nối Supabase...</div>
  if (authStatus === 'signed-out' || authStatus === 'unauthorized') {
    return <AdminLogin status={authStatus} error={adminError} onSubmit={login} />
  }

  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <button className="admin-mobile-menu" type="button" onClick={() => setMenuOpen(true)}><Menu size={21} /></button>
        <AdminLogo />
        <div className="admin-global-search">
          <Search size={17} />
          <input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder={adminCopy.search} />
          <kbd>CTRL K</kbd>
          {globalSearch && <div className="global-search-results">{searchMatches.length ? searchMatches.map((item) => <button type="button" onClick={() => { navigate(item.page); setGlobalSearch('') }} key={`${item.type}-${item.label}`}><span>{item.type}</span><b>{item.label}</b><ChevronRight size={15} /></button>) : <p>{adminCopy.noResults}</p>}</div>}
        </div>
        <div className="topbar-actions">
          <button className="language-toggle" type="button" onClick={toggleLanguage} title="Switch language">{adminCopy.code}</button>
          <button type="button"><CircleHelp size={18} /></button>
          <button type="button" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18} /><i></i></button>
          {isSupabaseConfigured && <button type="button" onClick={logout} title="Đăng xuất"><LogOut size={18} /></button>}
          <button className="store-switcher" type="button"><span>LY</span><b>LyLy Market</b><ChevronDown size={14} /></button>
        </div>
        {notificationsOpen && <div className="notification-popover"><div><b>{adminCopy.notifications}</b><button type="button" onClick={() => setNotificationsOpen(false)}><X size={14} /></button></div><p><Truck size={16} /> Có 3 đơn hàng mới cần xử lý.</p><p><Package size={16} /> Atlantic Salmon Fillet sắp hết hàng.</p></div>}
      </header>

      <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-mobile-head"><AdminLogo /><button type="button" onClick={() => setMenuOpen(false)}><X size={18} /></button></div>
        <nav>
          {navGroups.map((group, index) => (
            <div className="nav-group" key={index}>
              {group.title && <p>{adminCopy.navGroup.salesChannels}<ChevronRight size={13} /></p>}
              {group.items.map((item) => {
                const Icon = item.icon
                return <button className={page === item.id ? 'active' : ''} type="button" onClick={() => navigate(item.id)} key={item.id}><Icon size={17} /><span>{adminCopy.nav[item.id] || item.label}</span>{item.count && <em>{item.count}</em>}</button>
              })}
            </div>
          ))}
        </nav>
        <button className={`sidebar-settings ${page === 'settings' ? 'active' : ''}`} type="button" onClick={() => navigate('settings')}><Settings size={17} /> {adminCopy.settings}</button>
      </aside>

      {menuOpen && <button className="admin-menu-overlay" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" />}
      <main className={`admin-main ${page === 'dashboard' ? 'is-dashboard' : ''}`}>
        {authStatus === 'demo' && <div className="admin-mode-banner">{adminCopy.demo} <code>VITE_SUPABASE_URL</code> và <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> để dùng database.</div>}
        {adminError && <div className="admin-error-banner">{adminError}</div>}
        {page !== 'dashboard' && <div className="admin-breadcrumb"><button type="button" onClick={() => navigate('dashboard')}>LyLy</button><ChevronRight size={13} /><span>{localizedMeta[page]?.[0] || adminCopy.nav.dashboard}</span></div>}
        {renderPage()}
      </main>
      {productModal && <ProductModal categories={categories} products={products} product={productEditing} copy={adminCopy.product} onClose={() => { setProductEditing(null); setProductModal(false) }} onSubmit={saveProduct} />}
      {categoryModal && <CategoryModal categories={categories} category={categoryEditing} onClose={() => { setCategoryEditing(null); setCategoryModal(false) }} onSubmit={saveCategory} />}
      {discountModal && <DiscountModal onClose={() => setDiscountModal(false)} onSubmit={addDiscount} />}
    </div>
  )
}

export default AdminApp
