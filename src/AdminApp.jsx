import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
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
  ChevronLeft,
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
  MessageSquare,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Printer,
  RotateCcw,
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
  XCircle,
} from 'lucide-react'
import './AdminApp.css'
import {
  checkAdminAccess,
  createAdminCategory,
  createAdminArticle,
  createAdminCustomer,
  createAdminDiscount,
  createAdminProduct,
  getAdminSession,
  importAdminProducts,
  isSupabaseConfigured,
  loadAdminCategories,
  loadAdminArticles,
  loadAdminCustomers,
  loadAdminDiscounts,
  loadAdminOrders,
  loadAdminProducts,
  loadStoreSettings,
  removeAdminArticles,
  removeAdminCategories,
  removeAdminCustomers,
  removeAdminDiscounts,
  removeAdminProducts,
  saveStoreSettings,
  signInAdmin,
  signOutAdmin,
  updateAdminArticle,
  updateAdminCategory,
  updateAdminCustomer,
  updateAdminDiscount,
  logOrderEvents,
  resolveReturnRequest,
  updateAdminOrder,
  updateAdminOrders,
  updateAdminProduct,
  updateAdminProducts,
  uploadAdminArticleImage,
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
  { id: '#LY1048', date: '02 Jun, 13:42', customer: 'Emma Wilson', email: 'emma.wilson@example.com', phone: '+1 555 0184', location: 'Brooklyn, NY', total: 54.2, payment: 'Paid', delivery: 'Packing', items: 5, note: 'Leave at concierge if no answer.', paymentMethod: 'Bank Transfer', shippingPartner: 'GHN', trackingId: 'GHN1023847', lineItems: [{ name: 'Organic Hass Avocados', quantity: 2, price: 5.9, total: 11.8 }, { name: 'Farm Fresh Whole Milk', quantity: 1, price: 3.25, total: 3.25 }, { name: 'Sweet Garden Strawberries', quantity: 2, price: 4.75, total: 9.5 }] },
  { id: '#LY1047', date: '02 Jun, 12:16', customer: 'Noah Taylor', email: 'noah.taylor@example.com', phone: '+1 555 0162', location: 'Queens, NY', total: 82.75, payment: 'Paid', delivery: 'Ready', items: 7, note: 'Pickup window: 5-6 PM.', paymentMethod: 'MoMo', shippingPartner: 'GHTK', trackingId: 'GHTK5547821', lineItems: [{ name: 'Atlantic Salmon Fillet', quantity: 2, price: 14.5, total: 29 }, { name: 'Fresh Rigatoni Pasta', quantity: 2, price: 4.9, total: 9.8 }, { name: 'Artisan Sourdough Loaf', quantity: 1, price: 6.5, total: 6.5 }] },
  { id: '#LY1046', date: '02 Jun, 10:04', customer: 'Ava Anderson', email: 'ava.anderson@example.com', phone: '+1 555 0138', location: 'Jersey City, NJ', total: 34.5, payment: 'Pending', delivery: 'Unfulfilled', items: 3, note: 'Call before delivery.', paymentMethod: 'COD', shippingPartner: '', trackingId: '', lineItems: [{ name: 'Free Range Brown Eggs', quantity: 1, price: 5.5, total: 5.5 }, { name: 'Sun-Kissed Navel Oranges', quantity: 2, price: 4.2, total: 8.4 }] },
  { id: '#LY1045', date: '01 Jun, 18:32', customer: 'Liam Johnson', email: 'liam.johnson@example.com', phone: '+1 555 0119', location: 'Manhattan, NY', total: 96.4, payment: 'Paid', delivery: 'Delivered', items: 9, note: 'Delivered by local courier.', paymentMethod: 'VNPay', shippingPartner: 'Viettel Post', trackingId: 'VTP8834510', lineItems: [{ name: 'Atlantic Salmon Fillet', quantity: 3, price: 14.5, total: 43.5 }, { name: 'Organic Hass Avocados', quantity: 3, price: 5.9, total: 17.7 }] },
  { id: '#LY1044', date: '01 Jun, 16:21', customer: 'Mia Brown', email: 'mia.brown@example.com', phone: '+1 555 0144', location: 'Hoboken, NJ', total: 41.85, payment: 'Refunded', delivery: 'Cancelled', items: 4, note: 'Customer requested cancellation.', paymentMethod: 'Bank Transfer', shippingPartner: '', trackingId: '', lineItems: [{ name: 'Fresh Rigatoni Pasta', quantity: 2, price: 4.9, total: 9.8 }, { name: 'Artisan Sourdough Loaf', quantity: 2, price: 6.5, total: 13 }] },
  { id: '#LY1043', date: '01 Jun, 14:47', customer: 'Oliver Davis', email: 'oliver.davis@example.com', phone: '+1 555 0157', location: 'Brooklyn, NY', total: 67.1, payment: 'Paid', delivery: 'Delivered', items: 6, note: 'No substitutions.', paymentMethod: 'COD', shippingPartner: 'GHN', trackingId: 'GHN9982341', lineItems: [{ name: 'Sweet Garden Strawberries', quantity: 4, price: 4.75, total: 19 }, { name: 'Farm Fresh Whole Milk', quantity: 2, price: 3.25, total: 6.5 }] },
  { id: '#LY1042', date: '01 Jun, 11:20', customer: 'Sophia Martinez', email: 'sophia.m@example.com', phone: '+1 555 0198', location: 'Bronx, NY', total: 28.6, payment: 'Refunded', delivery: 'Returned', items: 3, note: 'Hàng bị dập, khách trả lại.', paymentMethod: 'MoMo', shippingPartner: 'GHTK', trackingId: 'GHTK4412309', lineItems: [{ name: 'Organic Hass Avocados', quantity: 2, price: 5.9, total: 11.8 }, { name: 'Farm Fresh Whole Milk', quantity: 2, price: 3.25, total: 6.5 }] },
  { id: '#LY1041', date: '31 May, 17:05', customer: 'James Lee', email: 'james.lee@example.com', phone: '+1 555 0173', location: 'Staten Island, NY', total: 52.3, payment: 'Pending', delivery: 'Failed Delivery', items: 4, note: 'Shipper gọi không nghe máy. Đang hoàn hàng về kho.', paymentMethod: 'COD', shippingPartner: 'Ninja Van', trackingId: 'NV7741228', lineItems: [{ name: 'Atlantic Salmon Fillet', quantity: 2, price: 14.5, total: 29 }, { name: 'Free Range Brown Eggs', quantity: 1, price: 5.5, total: 5.5 }] },
]

const customers = [
  { id: 1, name: 'Emma Wilson', email: 'emma.wilson@example.com', phone: '+1 555 0184', orders: 8, spent: 424.6, location: 'Brooklyn, NY', province: 'New York', district: 'Brooklyn', ward: '', address: '142 Atlantic Ave', initials: 'EW', status: 'active', createdAt: '15 Jan 2025', birthday: '1992-06-14', gender: 'female', tags: ['VIP', 'Returning'], notes: 'Khách thân thiết, hay mua hàng sáng thứ Hai.' },
  { id: 2, name: 'Noah Taylor', email: 'noah.taylor@example.com', phone: '+1 555 0162', orders: 5, spent: 279.85, location: 'Queens, NY', province: 'New York', district: 'Queens', ward: '', address: '78 Jamaica Ave', initials: 'NT', status: 'active', createdAt: '03 Mar 2025', birthday: '1988-11-22', gender: 'male', tags: ['Wholesale'], notes: '' },
  { id: 3, name: 'Ava Anderson', email: 'ava.anderson@example.com', phone: '+1 555 0138', orders: 2, spent: 86.2, location: 'Jersey City, NJ', province: 'New Jersey', district: 'Jersey City', ward: '', address: '30 Grove St', initials: 'AA', status: 'active', createdAt: '20 Apr 2025', birthday: '1995-03-08', gender: 'female', tags: [], notes: 'Gọi trước khi giao.' },
  { id: 4, name: 'Liam Johnson', email: 'liam.johnson@example.com', phone: '+1 555 0119', orders: 11, spent: 642.4, location: 'Manhattan, NY', province: 'New York', district: 'Manhattan', ward: '', address: '200 W 57th St', initials: 'LJ', status: 'active', createdAt: '08 Dec 2024', birthday: '1985-07-30', gender: 'male', tags: ['VIP'], notes: '' },
  { id: 5, name: 'Mia Brown', email: 'mia.brown@example.com', phone: '+1 555 0144', orders: 4, spent: 175.3, location: 'Hoboken, NJ', province: 'New Jersey', district: 'Hoboken', ward: '', address: '55 Newark St', initials: 'MB', status: 'blocked', createdAt: '14 Feb 2025', birthday: '1990-12-01', gender: 'female', tags: ['Blocked'], notes: 'Đã hủy đơn 2 lần không lý do.' },
  { id: 6, name: 'Oliver Davis', email: 'oliver.davis@example.com', phone: '+1 555 0157', orders: 7, spent: 388.1, location: 'Brooklyn, NY', province: 'New York', district: 'Brooklyn', ward: '', address: '90 Court St', initials: 'OD', status: 'active', createdAt: '27 Nov 2024', birthday: '1993-09-17', gender: 'male', tags: ['Facebook'], notes: '' },
]

const initialDiscounts = [
  { code: 'FRESH20', title: 'Fresh 20', method: 'code', discountType: 'order', valueType: 'percentage', valueAmount: 20, type: 'Order discount', value: '20%', uses: 128, status: 'Active', ends: '30 Jun 2026', minimumType: 'none', minimumValue: 0, active: true },
  { code: 'WELCOME10', title: 'Welcome 10', method: 'code', discountType: 'order', valueType: 'percentage', valueAmount: 10, type: 'Order discount', value: '10%', uses: 67, status: 'Active', ends: 'No end date', minimumType: 'none', minimumValue: 0, active: true },
  { code: 'LOCALDELIVERY', title: 'Local delivery', method: 'code', discountType: 'shipping', valueType: 'free', valueAmount: 0, type: 'Free shipping', value: 'Free shipping', uses: 42, status: 'Scheduled', ends: '15 Jun 2026', minimumType: 'none', minimumValue: 0, active: true },
]

const articles = [
  { id: 1, title: 'A simpler way to plan your weekly groceries', slug: 'weekly-grocery-planning', type: 'news', category: 'News', status: 'Published', author: 'LyLy Editorial', date: '01 Jun 2026', excerpt: 'Plan a fresh basket for the week with fewer decisions and better staples.', content: 'Plan a fresh basket for the week with fewer decisions and better staples.', tags: ['Planning'], image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=260&q=85' },
  { id: 2, title: 'Three bright salads for warmer days', slug: 'three-bright-salads', type: 'recipe', category: 'Recipes', status: 'Published', author: 'LyLy Kitchen', date: '29 May 2026', excerpt: 'A quick recipe set for seasonal vegetables, herbs and pantry dressings.', content: 'A quick recipe set for seasonal vegetables, herbs and pantry dressings.', tags: ['Recipe'], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=260&q=85' },
  { id: 3, title: 'Meet the growers behind our organic greens', slug: 'organic-greens-growers', type: 'news', category: 'News', status: 'Draft', author: 'LyLy Editorial', date: '28 May 2026', excerpt: 'Local sourcing notes from the growers behind our organic greens.', content: 'Local sourcing notes from the growers behind our organic greens.', tags: ['Local'], image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=260&q=85' },
]

const defaultShippingCarriers = [
  { id: 'ghn', name: 'GHN', service: 'Giao hàng nhanh', type: 'domestic', enabled: true, cod: true, trackingUrl: 'https://donhang.ghn.vn/?order_code={trackingId}', notes: 'Phù hợp giao nội thành và liên tỉnh.' },
  { id: 'ghtk', name: 'GHTK', service: 'Giao hàng tiết kiệm', type: 'domestic', enabled: true, cod: true, trackingUrl: 'https://i.ghtk.vn/{trackingId}', notes: 'Tối ưu chi phí cho đơn tiêu chuẩn.' },
  { id: 'viettel-post', name: 'Viettel Post', service: 'Chuyển phát tiêu chuẩn', type: 'domestic', enabled: true, cod: true, trackingUrl: 'https://viettelpost.com.vn/tra-cuu-hanh-trinh-don/?orderNumber={trackingId}', notes: 'Phủ rộng toàn quốc.' },
]

const initialStoreSettings = {
  general: { storeName: 'LyLy Fresh Market', contactEmail: 'lydoan.king@gmail.com', phone: '', country: 'Vietnam', currency: 'VND', timezone: 'Asia/Bangkok', orderPrefix: 'LY' },
  shipping: { pickupEnabled: true, deliveryEnabled: true, freeShippingThreshold: 75, localDeliveryFee: 0, domesticShippingFee: 8, expressShippingFee: 18, promise: 'Usually ready in 2 hrs', carriers: defaultShippingCarriers },
  notifications: { senderEmail: 'lydoan.king@gmail.com', customerNotifications: true, staffNotifications: true, webhooks: false },
  users: [{ id: 'owner', name: 'Doan Thi Truc Ly', email: 'lydoan.king@gmail.com', role: 'Owner', status: 'Active', twoFactor: true }],
}

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
      { id: 'content', label: 'Nội dung', icon: FileText, children: [{ id: 'content-recipes', label: 'Công thức' }, { id: 'content-blog', label: 'Bài viết' }] },
      { id: 'analytics', label: 'Phân tích', icon: BarChart3, children: [{ id: 'analytics-reports', label: 'Báo cáo' }] },
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
  'content-recipes': ['Công thức', 'Tạo và quản lý bài viết công thức trên storefront.'],
  'content-blog': ['Bài viết', 'Tạo và quản lý bài viết blog/news trên storefront.'],
  analytics: ['Phân tích', 'Theo dõi hiệu quả bán hàng và hành vi khách hàng.'],
  'analytics-reports': ['Báo cáo', 'Phân tích các báo cáo quan trọng cho vận hành thương mại điện tử.'],
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
      'content-recipes': 'Công thức',
      'content-blog': 'Bài viết',
      analytics: 'Phân tích',
      'analytics-reports': 'Báo cáo',
      'online-store': 'Cửa hàng trực tuyến',
      locations: 'Điểm bán hàng',
    },
    navGroup: { salesChannels: 'Kênh bán hàng' },
    validation: {
      required: 'Vui lòng nhập trường này.',
      email: 'Vui lòng nhập đúng định dạng email.',
      url: 'Vui lòng nhập đúng định dạng URL.',
      number: 'Vui lòng nhập số hợp lệ.',
    },
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
      'content-recipes': 'Recipes',
      'content-blog': 'Blog',
      analytics: 'Analytics',
      'analytics-reports': 'Reports',
      'online-store': 'Online store',
      locations: 'Locations',
    },
    navGroup: { salesChannels: 'Sales channels' },
    validation: {
      required: 'Please fill out this field.',
      email: 'Please enter a valid email address.',
      url: 'Please enter a valid URL.',
      number: 'Please enter a valid number.',
    },
    pageMeta: {
      products: ['Products', 'Manage product catalog, inventory, and sales status.'],
      categories: ['Categories', 'Manage category structure, menus, and storefront category display.'],
      orders: ['Orders', 'Track payment, packing, and delivery for your store.'],
      customers: ['Customers', 'View purchase history and care for LyLy customers.'],
      marketing: ['Marketing', 'Create campaigns that bring customers back to LyLy.'],
      discounts: ['Discounts', 'Manage promotion codes and discount programs.'],
      content: ['Content', 'Manage articles and content displayed on the storefront.'],
      'content-recipes': ['Recipes', 'Create and manage recipe articles for the storefront.'],
      'content-blog': ['Blog', 'Create and manage blog/news articles for the storefront.'],
      analytics: ['Analytics', 'Track sales performance and customer behavior.'],
      'analytics-reports': ['Reports', 'Review essential ecommerce reports for sales, products, customers and operations.'],
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

const DELIVERY_LABELS = {
  'Unfulfilled': 'Chưa xử lý',
  'Packing': 'Đang đóng gói',
  'Ready': 'Sẵn sàng giao',
  'In Transit': 'Đang giao hàng',
  'Delivered': 'Đã giao',
  'Cancelled': 'Đã hủy',
  'Returned': 'Trả hàng',
  'Failed Delivery': 'Giao thất bại',
}
function deliveryLabel(value) { return DELIVERY_LABELS[value] || value }

function adminOrderBucket(order) {
  const dl = order.delivery.toLowerCase()
  const pm = order.payment.toLowerCase()
  if (order.returnReason) return { key: 'return_requested', label: 'Yêu cầu trả hàng' }
  if (dl === 'returned' || pm === 'refunded') return { key: 'returned', label: 'Trả hàng / Hoàn tiền' }
  if (dl === 'delivered') return { key: 'delivered', label: 'Đã giao' }
  if (dl === 'cancelled') return { key: 'cancelled', label: 'Đã hủy' }
  if (dl === 'failed delivery' || dl === 'failed_delivery') return { key: 'failed', label: 'Giao thất bại' }
  if (pm === 'pending') return { key: 'unpaid', label: 'Chưa thanh toán' }
  if (['in transit', 'in_transit'].includes(dl)) return { key: 'transit', label: 'Đang giao hàng' }
  return { key: 'open', label: 'Đang xử lý' }
}

function generateTrackingId(carrier) {
  const prefix = carrier.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
  const now = new Date()
  const yy = String(now.getFullYear()).slice(2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `${prefix}${yy}${mm}${dd}${rand}`
}

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const defaultProductImage = 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=700&q=85'
const productCsvColumns = ['sku', 'name', 'category', 'price', 'old_price', 'stock', 'status', 'unit', 'badge', 'image_url', 'manufacturer', 'vendor', 'warehouse', 'product_type', 'description', 'images', 'options', 'variants']

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
    product.description || '',
    (product.images || []).join('|'),
    JSON.stringify(product.options || []),
    JSON.stringify(product.variants || []),
  ])
  const csv = [productCsvColumns, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')
  downloadBlob(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }), 'lyly-products.csv')
}

function downloadProductsCsvTemplate(categories) {
  const category = categories.find((item) => item.active)?.name || 'Bread & Bakery'
  const sample = [
    'SKU-DEMO-001',
    'Tên sản phẩm mẫu',
    category,
    '10.00',
    '12.00',
    '25',
    'active',
    '500g',
    'New',
    'https://example.com/product-image.jpg',
    'LyLy Market',
    'LyLy Market',
    'Main Store',
    'Grocery',
    'Tiêu đề mô tả\nNội dung mô tả chi tiết của sản phẩm.',
    'https://example.com/gallery-1.jpg|https://example.com/gallery-2.jpg',
    '[]',
    '[]',
  ]
  const csv = [productCsvColumns, sample].map((row) => row.map(csvCell).join(',')).join('\r\n')
  downloadBlob(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }), 'lyly-product-import-template.csv')
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
      description: field(row, 'description') || existing?.description || '',
      images: field(row, 'images') ? field(row, 'images').split('|').map((image) => image.trim()).filter(Boolean) : existing?.images || [],
      options: field(row, 'options') ? JSON.parse(field(row, 'options')) : existing?.options || [],
      variants: field(row, 'variants') ? JSON.parse(field(row, 'variants')) : existing?.variants || [],
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
  const headers = ['order_number', 'date', 'customer', 'email', 'phone', 'location', 'payment_method', 'payment_status', 'delivery_status', 'items', 'total']
  const rows = orders.map((order) => [
    order.id,
    order.date,
    order.customer,
    order.email || '',
    order.phone || '',
    order.location || '',
    order.paymentMethod || '',
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

function ConfirmDeleteModal({ title, message, confirmLabel = 'Xóa', onCancel, onConfirm }) {
  const [submitting, setSubmitting] = useState(false)
  const confirm = async () => {
    setSubmitting(true)
    await onConfirm()
    setSubmitting(false)
  }

  return (
    <Modal title={title} onClose={onCancel}>
      <div className="confirm-delete">
        <Trash2 size={34} />
        <p>{message}</p>
        <div className="modal-actions">
          <button className="admin-secondary" type="button" disabled={submitting} onClick={onCancel}>Hủy</button>
          <button className="product-danger" type="button" disabled={submitting} onClick={confirm}>{submitting ? 'Đang xóa...' : confirmLabel}</button>
        </div>
      </div>
    </Modal>
  )
}

function CsvImportGuideModal({ categories, onClose, onChooseFile }) {
  return (
    <Modal title="Nhập sản phẩm bằng CSV" onClose={onClose}>
      <div className="csv-guide">
        <p>Tải template CSV, điền dữ liệu theo đúng cột rồi upload lại file để tạo hoặc cập nhật sản phẩm theo SKU.</p>
        <ul>
          <li>Các cột bắt buộc: sku, name, category, price, stock, unit.</li>
          <li>Trạng thái chỉ nhận active hoặc draft.</li>
          <li>Ảnh phụ nhập nhiều URL bằng dấu | trong cột images.</li>
          <li>Options và variants dùng JSON; nếu chưa dùng biến thể hãy để [].</li>
        </ul>
        <div className="modal-actions">
          <button className="admin-secondary" type="button" onClick={() => downloadProductsCsvTemplate(categories)}><Download size={14} /> Tải template</button>
          <button className="admin-primary" type="button" onClick={onChooseFile}><Upload size={14} /> Chọn file CSV</button>
        </div>
      </div>
    </Modal>
  )
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
  const [importGuideOpen, setImportGuideOpen] = useState(false)
  const [deleteRequest, setDeleteRequest] = useState(null)
  const [selectionWarning, setSelectionWarning] = useState(false)
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
  const removeProduct = (product) => setDeleteRequest({ ids: [product.id], names: [product.name] })
  const visibleIds = visible.map((product) => product.id)
  const allVisibleSelected = visible.length > 0 && visibleIds.every((id) => selected.includes(id))
  const toggleAll = () => setSelected((current) => allVisibleSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])])
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const removeSelected = () => {
    if (!selected.length) {
      setSelectionWarning(true)
      return
    }
    const names = products.filter((product) => selected.includes(product.id)).map((product) => product.name)
    setDeleteRequest({ ids: selected, names })
  }
  const confirmRemove = async () => {
    if (!deleteRequest?.ids.length) return
    await onRemove(deleteRequest.ids)
    setSelected([])
    setDeleteRequest(null)
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
        <button className="admin-secondary" type="button" onClick={() => setImportGuideOpen(true)}><Upload size={15} /> Nhập CSV</button>
        <button className="product-danger" type="button" onClick={removeSelected}><Trash2 size={15} /> Xóa đã chọn{selected.length ? ` (${selected.length})` : ''}</button>
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
                  <td><div className="product-cell"><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.sku} · {product.variants?.length ? `${product.variants.length} biến thể` : product.unit}</small></span></div></td>
                  <td><StatusPill>{product.status === 'active' ? 'Active' : 'Draft'}</StatusPill></td>
                  <td><span className={product.stock < 10 ? 'low-stock' : ''}>{product.stock} in stock</span></td>
                  <td>{product.category}</td>
                  <td><b>{money(product.price)}</b></td>
                  <td><div className="row-actions"><button className="row-icon" type="button" onClick={() => onEdit(product)} title="Sửa sản phẩm"><Pencil size={15} /></button><button className="row-icon" type="button" onClick={() => removeProduct(product)} aria-label={`Delete ${product.name}`}><Trash2 size={15} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && <EmptyHint icon={ShoppingBag} title="Không tìm thấy sản phẩm" copy="Thử thay đổi từ khóa hoặc thêm sản phẩm mới." />}
        </div>
      </section>
      {deleteRequest && (
        <ConfirmDeleteModal
          title={deleteRequest.ids.length > 1 ? 'Xóa sản phẩm đã chọn?' : 'Xóa sản phẩm?'}
          message={deleteRequest.ids.length > 1
            ? `Bạn có chắc muốn xóa ${deleteRequest.ids.length} sản phẩm đã chọn? Hành động này không thể hoàn tác.`
            : `Bạn có chắc muốn xóa "${deleteRequest.names[0]}"? Hành động này không thể hoàn tác.`}
          confirmLabel={deleteRequest.ids.length > 1 ? 'Xóa đã chọn' : 'Xóa sản phẩm'}
          onCancel={() => setDeleteRequest(null)}
          onConfirm={confirmRemove}
        />
      )}
      {selectionWarning && (
        <Modal title="Chưa chọn sản phẩm" onClose={() => setSelectionWarning(false)}>
          <div className="confirm-delete">
            <Trash2 size={34} />
            <p>Hãy chọn ít nhất một sản phẩm trong danh sách trước khi dùng nút Xóa đã chọn.</p>
            <div className="modal-actions">
              <button className="admin-primary" type="button" onClick={() => setSelectionWarning(false)}>Đã hiểu</button>
            </div>
          </div>
        </Modal>
      )}
      {importGuideOpen && <CsvImportGuideModal categories={categories} onClose={() => setImportGuideOpen(false)} onChooseFile={() => { setImportGuideOpen(false); importInput.current?.click() }} />}
      {bulkOpen && <BulkProductEditor categories={categories} products={products.filter((product) => selected.includes(product.id))} onClose={() => setBulkOpen(false)} onSubmit={async (updates) => { await onBulkEdit(updates); setSelected([]); setBulkOpen(false) }} />}
    </>
  )
}

function CategoriesPage({ meta, categories, products, onCreate, onEdit, onRemove, onToggle }) {
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({ root: 'all', status: 'all', homepage: 'all', menu: 'all' })
  const [selected, setSelected] = useState([])
  const [collapsed, setCollapsed] = useState({})
  const rootCategories = categories.filter((c) => !c.parentId)
  const activeFilterCount = Object.values(filters).filter((v) => v !== 'all').length

  const aggregateProductCount = (category) => {
    const direct = products.filter((p) => p.category === category.name).length
    const childCounts = categories.filter((c) => c.parentId === category.id).reduce((sum, child) => sum + products.filter((p) => p.category === child.name).length, 0)
    return direct + childCounts
  }
  const matchesFilters = (category) => {
    const matchesQuery = `${category.name} ${category.slug}`.toLowerCase().includes(query.toLowerCase())
    const rootId = Number(filters.root)
    const matchesRoot = filters.root === 'all' || category.id === rootId || category.parentId === rootId
    const matchesStatus = filters.status === 'all' || category.active === (filters.status === 'active')
    const matchesHomepage = filters.homepage === 'all' || category.showOnHome === (filters.homepage === 'yes')
    const matchesMenu = filters.menu === 'all' || category.includeInMenu === (filters.menu === 'yes')
    return matchesQuery && matchesRoot && matchesStatus && matchesHomepage && matchesMenu
  }

  const setFilter = (name, value) => setFilters((cur) => ({ ...cur, [name]: value }))
  const resetFilters = () => setFilters({ root: 'all', status: 'all', homepage: 'all', menu: 'all' })
  const toggleCollapse = (id) => setCollapsed((cur) => ({ ...cur, [id]: !cur[id] }))
  const toggleSelected = (id) => setSelected((cur) => cur.includes(id) ? cur.filter((i) => i !== id) : [...cur, id])
  const allIds = categories.map((c) => c.id)
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.includes(id))
  const toggleAll = () => setSelected(allSelected ? [] : allIds)

  const handleRemove = (category) => {
    const hasChildren = categories.some((c) => c.parentId === category.id)
    if (hasChildren) {
      // Show error via onRemove with a flag — parent will handle
      alert(`Không thể xóa "${category.name}" vì đang có danh mục con bên trong.\nVui lòng di chuyển hoặc xóa danh mục con trước.`)
      return
    }
    onRemove(category.id)
  }
  const bulkToggle = (active) => {
    selected.forEach((id) => {
      const cat = categories.find((c) => c.id === id)
      if (cat && cat.active !== active) onToggle(cat)
    })
    setSelected([])
  }

  const treeRows = []
  rootCategories.filter(matchesFilters).forEach((root) => {
    const children = categories.filter((c) => c.parentId === root.id && matchesFilters(c))
    const isCollapsed = collapsed[root.id]
    treeRows.push({ ...root, depth: 0, hasChildren: children.length > 0, isCollapsed })
    if (!isCollapsed) children.forEach((child) => treeRows.push({ ...child, depth: 1 }))
  })

  return (
    <>
      <SectionTitle title={meta.categories[0]} description={meta.categories[1]} action="Thêm danh mục" onAction={onCreate} />
      <section className="admin-panel data-panel">
        <div className="table-toolbar category-toolbar">
          <label><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm kiếm danh mục" /></label>
          <button className={activeFilterCount ? 'filter-active' : ''} type="button" onClick={() => setFiltersOpen(!filtersOpen)}><Filter size={15} /> Bộ lọc {activeFilterCount > 0 && <em>{activeFilterCount}</em>}</button>
        </div>
        {filtersOpen && (
          <div className="category-filter-panel">
            <label><span>Danh mục gốc</span><select value={filters.root} onChange={(e) => setFilter('root', e.target.value)}><option value="all">Tất cả danh mục</option>{rootCategories.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}</select></label>
            <label><span>Trạng thái</span><select value={filters.status} onChange={(e) => setFilter('status', e.target.value)}><option value="all">Tất cả</option><option value="active">Đang hoạt động</option><option value="draft">Tạm ẩn</option></select></label>
            <label><span>Homepage</span><select value={filters.homepage} onChange={(e) => setFilter('homepage', e.target.value)}><option value="all">Tất cả</option><option value="yes">Có hiển thị</option><option value="no">Không hiển thị</option></select></label>
            <label><span>Mega menu</span><select value={filters.menu} onChange={(e) => setFilter('menu', e.target.value)}><option value="all">Tất cả</option><option value="yes">Có hiển thị</option><option value="no">Không hiển thị</option></select></label>
            <div className="category-filter-actions"><button className="admin-secondary" type="button" onClick={resetFilters}>Xóa lọc</button><button className="admin-primary" type="button" onClick={() => setFiltersOpen(false)}>Áp dụng</button></div>
          </div>
        )}
        {selected.length > 0 && (
          <div className="order-bulk-bar">
            <span>{selected.length} danh mục đã chọn</span>
            <button type="button" onClick={() => bulkToggle(true)}>Kích hoạt</button>
            <button type="button" onClick={() => bulkToggle(false)}>Tạm ẩn</button>
            <button className="danger-button" type="button" onClick={() => { selected.forEach((id) => { const cat = categories.find((c) => c.id === id); if (cat) handleRemove(cat) }); setSelected([]) }}>Xóa đã chọn</button>
          </div>
        )}
        <div className="admin-table-wrap">
          <table className="admin-table category-table">
            <thead><tr>
              <th><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Sản phẩm</th>
              <th>Thứ tự Menu</th>
              <th>Thứ tự Home</th>
              <th>Menu</th>
              <th>Home</th>
              <th></th>
            </tr></thead>
            <tbody>
              {treeRows.map((row) => (
                <tr key={row.id} className={row.depth === 1 ? 'category-child-row' : ''}>
                  <td><input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleSelected(row.id)} /></td>
                  <td>
                    <div className="category-cell" style={{ paddingLeft: row.depth * 20 }}>
                      {row.hasChildren && (
                        <button type="button" className="tree-toggle" onClick={() => toggleCollapse(row.id)}>
                          {row.isCollapsed ? '▶' : '▼'}
                        </button>
                      )}
                      {row.depth === 1 && !row.hasChildren && <span className="tree-indent">└</span>}
                      <div><b>{row.name}</b><small>/{row.slug}</small></div>
                    </div>
                  </td>
                  <td><StatusPill>{row.active ? 'Active' : 'Draft'}</StatusPill></td>
                  <td><span className={aggregateProductCount(row) === 0 ? 'muted-dash' : ''}>{aggregateProductCount(row)}</span></td>
                  <td>{row.displayOrder}</td>
                  <td>{row.homeDisplayOrder ?? row.displayOrder}</td>
                  <td>{row.includeInMenu ? <span className="cat-check">✓</span> : <span className="muted-dash">—</span>}</td>
                  <td>{row.showOnHome ? <span className="cat-check">✓</span> : <span className="muted-dash">—</span>}</td>
                  <td><div className="row-actions">
                    <button className="row-icon" type="button" onClick={() => onToggle(row)} title={row.active ? 'Ẩn danh mục' : 'Hiện danh mục'}><Eye size={15} /></button>
                    <button className="row-icon" type="button" onClick={() => onEdit(row)} title="Sửa"><Pencil size={15} /></button>
                    <button className="row-icon" type="button" onClick={() => handleRemove(row)} title="Xóa"><Trash2 size={15} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!treeRows.length && <EmptyHint icon={Tag} title="Không tìm thấy danh mục" copy="Thử thay đổi từ khóa hoặc thêm danh mục mới." />}
        </div>
      </section>
    </>
  )
}

function OrdersPage({ meta, orders, focusedOrderId = '', onFocusedOrderHandled, onUpdate, onBulkUpdate, shippingSettings = {} }) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const [deliveryFilter, setDeliveryFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [shippingFilter, setShippingFilter] = useState('all')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sort, setSort] = useState('newest')
  const [selected, setSelected] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [detailOrder, setDetailOrder] = useState(null)
  const [notice, setNotice] = useState('')

  const carrierOptions = (shippingSettings.carriers?.length ? shippingSettings.carriers : defaultShippingCarriers).filter((carrier) => carrier.enabled !== false)
  const shippingPartners = [...new Set([...carrierOptions.map((carrier) => carrier.name), ...orders.map((o) => o.shippingPartner)].filter(Boolean))]

  useEffect(() => {
    if (!focusedOrderId) return
    Promise.resolve().then(() => {
      const matchingOrder = orders.find((order) => order.id === focusedOrderId)
      if (matchingOrder) {
        setDetailOrder(matchingOrder)
        onFocusedOrderHandled?.()
        return
      }
      setNotice(`Không tìm thấy đơn hàng ${focusedOrderId}.`)
      onFocusedOrderHandled?.()
    })
  }, [focusedOrderId, orders, onFocusedOrderHandled])

  const visible = orders.filter((order) => {
    const text = `${order.id} ${order.customer} ${order.email || ''} ${order.phone || ''} ${order.location || ''} ${order.paymentMethod || ''} ${order.trackingId || ''}`.toLowerCase()
    const dl = order.delivery.toLowerCase()
    const pm = order.payment.toLowerCase()
    const matchesQuery = text.includes(query.toLowerCase())
    const matchesDelivery = deliveryFilter === 'all' || dl === deliveryFilter
    const matchesPayment = paymentFilter === 'all' || pm === paymentFilter
    const matchesShipping = shippingFilter === 'all' || (order.shippingPartner || '').toLowerCase() === shippingFilter
    const matchesPriceMin = !priceMin || order.total >= Number(priceMin)
    const matchesPriceMax = !priceMax || order.total <= Number(priceMax)
    const matchesTab =
      tab === 'all'
      || (tab === 'open' && !['delivered', 'cancelled', 'returned', 'failed delivery'].includes(dl))
      || (tab === 'unpaid' && pm === 'pending')
      || (tab === 'fulfilled' && dl === 'delivered')
      || (tab === 'cancelled' && dl === 'cancelled')
      || (tab === 'return_requested' && Boolean(order.returnReason))
      || (tab === 'returned' && (dl === 'returned' || pm === 'refunded'))
      || (tab === 'failed' && dl === 'failed delivery')
    return matchesQuery && matchesDelivery && matchesPayment && matchesShipping && matchesPriceMin && matchesPriceMax && matchesTab
  }).sort((a, b) => {
    if (sort === 'total-desc') return b.total - a.total
    if (sort === 'total-asc') return a.total - b.total
    return String(b.createdAt || b.date).localeCompare(String(a.createdAt || a.date))
  })

  const selectedOrders = visible.filter((order) => selected.includes(order.id))
  const allSelected = visible.length > 0 && selected.length === visible.length
  const openCount = orders.filter((o) => !['delivered', 'cancelled', 'returned', 'failed delivery'].includes(o.delivery.toLowerCase())).length
  const unpaidCount = orders.filter((o) => o.payment.toLowerCase() === 'pending').length
  const deliveredCount = orders.filter((o) => o.delivery.toLowerCase() === 'delivered').length
  const cancelledCount = orders.filter((o) => o.delivery.toLowerCase() === 'cancelled').length
  const returnRequestedCount = orders.filter((o) => Boolean(o.returnReason)).length
  const returnedCount = orders.filter((o) => o.delivery.toLowerCase() === 'returned' || o.payment.toLowerCase() === 'refunded').length
  const failedCount = orders.filter((o) => o.delivery.toLowerCase() === 'failed delivery').length
  const revenue = orders
    .filter((o) => o.payment === 'Paid' && !['Cancelled', 'Returned'].includes(o.delivery))
    .reduce((s, o) => s + o.total, 0)

  const toggleAll = () => setSelected(allSelected ? [] : visible.map((o) => o.id))
  const toggleSelected = (id) => setSelected((c) => c.includes(id) ? c.filter((i) => i !== id) : [...c, id])
  const updateOrder = async (order, changes) => {
    const updated = await onUpdate({ ...order, ...changes })
    if (!updated) {
      setNotice(`Không thể cập nhật ${order.id}. Trạng thái này chưa được hỗ trợ — vui lòng liên hệ admin để apply DB migration.`)
      return
    }
    setDetailOrder((current) => current?.id === updated.id ? updated : current)
    setNotice(`${updated.id} đã được cập nhật.`)
  }
  const bulkUpdate = async (changes) => {
    if (!selectedOrders.length) return
    await onBulkUpdate(selectedOrders.map((order) => ({ ...order, ...changes })))
    setNotice(`Đã cập nhật ${selectedOrders.length} đơn hàng.`)
    setSelected([])
  }
  const printSelected = () => {
    const lines = selectedOrders.map((o) => `${o.id}  ${o.customer}  ${o.date}  ${money(o.total)}  [${o.delivery}]`).join('\n')
    const w = window.open('', '_blank')
    w.document.write(`<pre style="font:14px/1.8 monospace;padding:24px">${lines}</pre>`)
    w.print()
  }
  const clearFilters = () => { setPaymentFilter('all'); setDeliveryFilter('all'); setShippingFilter('all'); setPriceMin(''); setPriceMax('') }

  return (
    <>
      <SectionTitle title={meta.orders[0]} description={meta.orders[1]} action="Xuất đơn hàng" onAction={() => downloadOrdersCsv(visible)} icon={Download} />
      <section className="metrics-grid">
        <MetricCard label="Tổng đơn" value={orders.length} note={`${openCount} đơn đang xử lý`} />
        <MetricCard label="Cần thanh toán" value={unpaidCount} note="Theo dõi trước khi đóng gói" />
        <MetricCard label="Doanh thu thực" value={money(revenue)} note={`${deliveredCount} đơn đã giao • chỉ tính đơn Đã thanh toán`} />
      </section>
      {notice && <div className="product-notice"><span>{notice}</span><button type="button" onClick={() => setNotice('')}><X size={14} /></button></div>}
      <section className="admin-panel data-panel">
        <div className="data-tabs">
          <button className={tab === 'all' ? 'active' : ''} type="button" onClick={() => setTab('all')}>Tất cả <em>{orders.length}</em></button>
          <button className={tab === 'open' ? 'active' : ''} type="button" onClick={() => setTab('open')}>Đang xử lý <em>{openCount}</em></button>
          <button className={tab === 'unpaid' ? 'active' : ''} type="button" onClick={() => setTab('unpaid')}>Chưa thanh toán <em>{unpaidCount}</em></button>
          <button className={tab === 'fulfilled' ? 'active' : ''} type="button" onClick={() => setTab('fulfilled')}>Đã giao <em>{deliveredCount}</em></button>
          {returnRequestedCount > 0 && <button className={`${tab === 'return_requested' ? 'active' : ''} tab-return-requested`} type="button" onClick={() => setTab('return_requested')}>Yêu cầu trả hàng <em>{returnRequestedCount}</em></button>}
          {cancelledCount > 0 && <button className={tab === 'cancelled' ? 'active' : ''} type="button" onClick={() => setTab('cancelled')}>Đã hủy <em>{cancelledCount}</em></button>}
          {returnedCount > 0 && <button className={tab === 'returned' ? 'active' : ''} type="button" onClick={() => setTab('returned')}>Trả hàng / Hoàn tiền <em>{returnedCount}</em></button>}
          {failedCount > 0 && <button className={tab === 'failed' ? 'active' : ''} type="button" onClick={() => setTab('failed')}>Giao thất bại <em>{failedCount}</em></button>}
        </div>
        <div className="table-toolbar">
          <label><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm mã đơn, khách hàng, email, SĐT hoặc mã vận đơn" /></label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">Mới nhất</option><option value="total-desc">Tổng cao nhất</option><option value="total-asc">Tổng thấp nhất</option></select>
          <button className={filterOpen ? 'filter-active' : ''} type="button" onClick={() => setFilterOpen(!filterOpen)}><Filter size={15} /> Bộ lọc</button>
          <button type="button" onClick={() => downloadOrdersCsv(visible)}><Download size={15} /> Xuất</button>
        </div>
        {selected.length > 0 && (
          <div className="order-bulk-bar">
            <span>{selected.length} đơn đã chọn</span>
            <button type="button" onClick={() => bulkUpdate({ payment: 'Paid' })}>Đã thanh toán</button>
            <button type="button" onClick={() => bulkUpdate({ delivery: 'Packing' })}>Đang đóng gói</button>
            <button type="button" onClick={() => bulkUpdate({ delivery: 'Ready' })}>Sẵn sàng giao</button>
            <button type="button" onClick={() => bulkUpdate({ delivery: 'In Transit' })}><Truck size={13} /> Đang giao hàng</button>
            <button type="button" onClick={() => bulkUpdate({ delivery: 'Delivered' })}>Đã giao</button>
            <button type="button" onClick={() => bulkUpdate({ delivery: 'Returned' })}>Trả hàng</button>
            <button type="button" onClick={printSelected}><Printer size={13} /> In phiếu</button>
            <button className="danger-button" type="button" onClick={() => bulkUpdate({ delivery: 'Cancelled' })}>Hủy đơn</button>
          </div>
        )}
        {filterOpen && (
          <div className="order-filter-panel">
            <label>
              <span>Thanh toán</span>
              <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="pending">Chờ thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="refunded">Đã hoàn tiền</option>
              </select>
            </label>
            <label>
              <span>Giao hàng</span>
              <select value={deliveryFilter} onChange={(e) => setDeliveryFilter(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="unfulfilled">Chưa xử lý</option>
                <option value="packing">Đang đóng gói</option>
                <option value="ready">Sẵn sàng giao</option>
                <option value="in transit">Đang giao hàng</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
                <option value="returned">Trả hàng</option>
                <option value="failed delivery">Giao thất bại</option>
              </select>
            </label>
            {shippingPartners.length > 0 && (
              <label>
                <span>Đơn vị vận chuyển</span>
                <select value={shippingFilter} onChange={(e) => setShippingFilter(e.target.value)}>
                  <option value="all">Tất cả</option>
                  {shippingPartners.map((p) => <option key={p} value={p.toLowerCase()}>{p}</option>)}
                </select>
              </label>
            )}
            <label>
              <span>Giá trị đơn (đ)</span>
              <div className="price-range-inputs">
                <input type="number" placeholder="Từ" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} min="0" />
                <span>–</span>
                <input type="number" placeholder="Đến" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} min="0" />
              </div>
            </label>
            <div className="category-filter-actions">
              <button className="admin-secondary" type="button" onClick={clearFilters}>Xóa lọc</button>
            </div>
          </div>
        )}
        <div className="admin-table-wrap">
          <table className="admin-table orders-table">
            <thead>
              <tr>
                <th><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
                <th>Đơn hàng</th>
                <th>Ngày</th>
                <th>Khách hàng</th>
                <th>Trạng thái</th>
                <th>Phương thức TT</th>
                <th>Trạng thái TT</th>
                <th>Trạng thái GH</th>
                <th>Vận chuyển</th>
                <th>Tổng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id}>
                  <td><input type="checkbox" checked={selected.includes(order.id)} onChange={() => toggleSelected(order.id)} /></td>
                  <td><button className="order-link" type="button" onClick={() => setDetailOrder(order)}>{order.id}</button></td>
                  <td className="date-cell">{order.date}</td>
                  <td>
                    <div className="customer-cell">
                      <span>{order.customer.split(' ').map((p) => p[0]).join('').slice(0, 2)}</span>
                      <div><b>{order.customer}</b><small>{order.email || order.location}</small></div>
                    </div>
                  </td>
                  <td>{(() => { const b = adminOrderBucket(order); return <span className={`order-status-badge status-${b.key}`}>{b.label}</span> })()}</td>
                  <td>{order.paymentMethod ? <span className="payment-method-tag">{order.paymentMethod}</span> : <span className="muted-dash">—</span>}</td>
                  <td>
                    <span className={`status-tag payment-${order.payment.toLowerCase()}`}>{order.payment === 'Pending' ? 'Chờ thanh toán' : order.payment === 'Paid' ? 'Đã thanh toán' : 'Đã hoàn tiền'}</span>
                  </td>
                  <td>
                    {order.returnReason
                      ? <span className="return-requested-badge">Yêu cầu trả hàng</span>
                      : <span className={`status-tag delivery-${order.delivery.toLowerCase().replaceAll(' ', '-')}`}>{deliveryLabel(order.delivery)}</span>
                    }
                  </td>
                  <td>
                    {order.shippingPartner ? (
                      <div className="shipping-cell">
                        <b>{order.shippingPartner}</b>
                        {order.trackingId && <small className="tracking-id">{order.trackingId}</small>}
                      </div>
                    ) : <span className="muted-dash">—</span>}
                  </td>
                  <td><b>{money(order.total)}</b></td>
                  <td>
                    <div className="row-actions">
                      <button className="row-icon" type="button" onClick={() => setDetailOrder(order)} title="Xem đơn"><Eye size={15} /></button>
                      {!order.returnReason && order.delivery === 'Ready' && order.shippingPartner && (
                        <button className="row-icon pickup-icon" type="button" title="Đơn vị vận chuyển đã lấy hàng" onClick={() => updateOrder(order, { delivery: 'In Transit' })}><Truck size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && <EmptyHint icon={ShoppingCart} title="Không tìm thấy đơn hàng" copy="Thử đổi từ khóa, bộ lọc hoặc trạng thái đơn." />}
        </div>
      </section>
      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          carriers={carrierOptions}
          onClose={() => setDetailOrder(null)}
          onUpdate={updateOrder}
          onResolveReturn={async (uuid, approve, rejectionReason) => {
            const updated = await resolveReturnRequest(uuid, approve, rejectionReason)
            await onUpdate(updated, {})
            setDetailOrder(null)
            setNotice(`${updated.id} ${approve ? 'đã được duyệt trả hàng.' : 'đã từ chối trả hàng.'}`)
          }}
        />
      )}
    </>
  )
}

function OrderDetailModal({ order, carriers = [], onClose, onUpdate, onResolveReturn }) {
  const [payment, setPayment] = useState(order.payment)
  const [delivery, setDelivery] = useState(order.delivery)
  const [shippingPartner, setShippingPartner] = useState(order.shippingPartner || '')
  const [trackingId, setTrackingId] = useState(order.trackingId || '')
  const [resolving, setResolving] = useState(false)
  const [rejectStep, setRejectStep] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const hasReturnRequest = Boolean(order.returnReason)
  const canMarkPickup = !hasReturnRequest && delivery === 'Ready' && Boolean(shippingPartner)
  const save = () => onUpdate(order, { payment, delivery, shippingPartner, trackingId })
  const markCarrierPickup = () => onUpdate(order, { payment, delivery: 'In Transit', shippingPartner, trackingId })
  const handleResolveReturn = async (approve, reason = '') => {
    setResolving(true)
    try {
      await onResolveReturn(order.uuid, approve, reason)
    } finally {
      setResolving(false)
      setRejectStep(false)
      setRejectReason('')
    }
  }
  const subtotal = Number(order.subtotal || 0) || order.lineItems?.reduce((total, item) => total + item.total, 0) || order.total
  const discountTotal = Number(order.discountTotal || 0)
  const deliveryFee = Number(order.deliveryFee || 0)
  const taxTotal = Number(order.taxTotal || 0)
  const selectedCarrier = carriers.find((carrier) => carrier.name === shippingPartner)
  const trackingHref = selectedCarrier?.trackingUrl && trackingId
    ? selectedCarrier.trackingUrl.replace('{trackingId}', encodeURIComponent(trackingId))
    : ''

  return (
    <Modal wide title={`${order.id} · ${order.customer}`} onClose={onClose}>
      <div className="order-detail">
        <section className="order-detail-main">
          <div className="order-card">
            <div className="order-card-title"><h3>Sản phẩm</h3><StatusPill>{delivery}</StatusPill></div>
            <div className="order-line-list">
              {(order.lineItems?.length ? order.lineItems : [{ name: 'Sản phẩm', quantity: order.items, price: order.total, total: order.total }]).map((item, index) => (
                <div className="order-line-item" key={`${item.name}-${index}`}>
                  <div><b>{item.name}</b><small>{item.quantity} x {money(item.price)}</small></div>
                  <strong>{money(item.total)}</strong>
                </div>
              ))}
            </div>
            <div className="order-total-box">
              <p><span>Tạm tính</span><b>{money(subtotal)}</b></p>
              {discountTotal > 0 && <p><span>Giảm giá</span><b>-{money(discountTotal)}</b></p>}
              {taxTotal > 0 && <p><span>Thuế</span><b>{money(taxTotal)}</b></p>}
              <p><span>Vận chuyển</span><b>{deliveryFee > 0 ? money(deliveryFee) : 'Miễn phí'}</b></p>
              <p><span>Tổng cộng</span><strong>{money(order.total)}</strong></p>
            </div>
          </div>

          <div className="order-card">
            <div className="order-card-title"><h3>Lịch sử</h3></div>
            <div className="order-timeline">
              <p><CheckCircle2 size={15} /> Đơn hàng tạo lúc {order.date}</p>
              {order.deliveryMethod && <p><Truck size={15} /> Hình thức nhận hàng: {order.deliveryMethod}</p>}
              {order.paymentMethod && <p><BadgePercent size={15} /> Phương thức thanh toán: {order.paymentMethod}</p>}
            </div>
            {order.events?.length > 0 && (
              <div className="admin-event-list">
                {[...order.events].reverse().map((event) => (
                  <div key={event.id} className={`admin-event-item actor-${event.actor}`}>
                    <span className="admin-event-date">{event.date}</span>
                    <span className="admin-event-actor">{event.actor === 'customer' ? 'Khách' : event.actor === 'admin' ? 'Admin' : 'Hệ thống'}</span>
                    <span className="admin-event-msg">{event.message}</span>
                  </div>
                ))}
              </div>
            )}
            {order.note && <div className="order-note"><b>Ghi chú khách hàng</b><span>{order.note}</span></div>}
          </div>

          {hasReturnRequest && (
            <div className="order-card order-return-request-card">
              <div className="order-card-title"><h3><RotateCcw size={14} /> Yêu cầu trả hàng</h3></div>
              <div className="return-request-info">
                <p><b>Lý do:</b> {order.returnReason}</p>
                {order.returnNotes && <p><b>Chi tiết:</b> {order.returnNotes}</p>}
                {order.returnRequestedAt && <p className="return-requested-time">Gửi lúc {new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(order.returnRequestedAt))}</p>}
              </div>
            </div>
          )}
        </section>

        <aside className="order-detail-side">
          <div className="order-card">
            <h3>Cập nhật đơn</h3>
            {hasReturnRequest ? (
              <div className="return-action-panel">
                <p className="return-action-notice">Đơn hàng đang có yêu cầu trả hàng. Vui lòng duyệt hoặc từ chối trước khi chỉnh sửa trạng thái.</p>
                {!rejectStep ? (
                  <>
                    <button className="return-approve-btn" type="button" disabled={resolving} onClick={() => handleResolveReturn(true)}>
                      <CheckCircle2 size={15} /> {resolving ? 'Đang xử lý...' : 'Duyệt trả hàng'}
                    </button>
                    <button className="return-reject-btn" type="button" disabled={resolving} onClick={() => setRejectStep(true)}>
                      <XCircle size={15} /> Từ chối trả hàng
                    </button>
                  </>
                ) : (
                  <div className="reject-reason-panel">
                    <label className="reject-reason-label">Lý do từ chối <span>(bắt buộc)</span></label>
                    <textarea
                      className="reject-reason-input"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Nhập lý do từ chối yêu cầu trả hàng..."
                      rows={3}
                      autoFocus
                    />
                    <div className="reject-reason-actions">
                      <button type="button" className="admin-secondary" onClick={() => { setRejectStep(false); setRejectReason('') }}>Hủy</button>
                      <button className="return-reject-btn" type="button" disabled={resolving || !rejectReason.trim()} onClick={() => handleResolveReturn(false, rejectReason.trim())}>
                        <XCircle size={15} /> {resolving ? 'Đang xử lý...' : 'Xác nhận từ chối'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <label>
                  <span>Thanh toán</span>
                  <select value={payment} onChange={(e) => setPayment(e.target.value)}>
                    <option value="Pending">Chờ thanh toán</option>
                    <option value="Paid">Đã thanh toán</option>
                    <option value="Refunded">Đã hoàn tiền</option>
                  </select>
                </label>
                <label>
                  <span>Giao hàng</span>
                  <select value={delivery} onChange={(e) => setDelivery(e.target.value)}>
                    <option value="Unfulfilled">Chưa xử lý</option>
                    <option value="Packing">Đang đóng gói</option>
                    <option value="Ready">Sẵn sàng giao</option>
                    <option value="In Transit">Đang giao hàng</option>
                    <option value="Delivered">Đã giao</option>
                    <option value="Cancelled">Đã hủy</option>
                    <option value="Returned">Trả hàng</option>
                    <option value="Failed Delivery">Giao thất bại</option>
                  </select>
                </label>
                <label>
                  <span>Đơn vị vận chuyển</span>
                  <select value={shippingPartner} onChange={(e) => {
                    const partner = e.target.value
                    setShippingPartner(partner)
                    if (partner && !trackingId) setTrackingId(generateTrackingId(partner))
                  }}>
                    <option value="">Chọn đơn vị</option>
                    {carriers.map((carrier) => <option key={carrier.id || carrier.name} value={carrier.name}>{carrier.name} - {carrier.service}</option>)}
                    {shippingPartner && !selectedCarrier && <option value={shippingPartner}>{shippingPartner}</option>}
                  </select>
                </label>
                {trackingId && (
                  <div className="tracking-display">
                    <span className="tracking-display-label">Mã vận đơn</span>
                    <span className="tracking-display-value">{trackingId}</span>
                  </div>
                )}
                {selectedCarrier && <p className="carrier-order-note">{selectedCarrier.service}{selectedCarrier.cod ? ' · Hỗ trợ COD' : ''}</p>}
                {trackingHref && <a className="tracking-link" href={trackingHref} target="_blank" rel="noreferrer">Mở trang tra cứu vận đơn <ArrowUpRight size={13} /></a>}
                <button className="admin-primary" type="button" onClick={save}><CheckCircle2 size={15} /> Lưu thay đổi</button>
                {canMarkPickup && (
                  <button className="carrier-pickup-btn" type="button" onClick={markCarrierPickup}>
                    <Truck size={15} /> Đơn vị vận chuyển đã lấy hàng
                  </button>
                )}
              </>
            )}
          </div>
          <div className="order-card">
            <h3>Khách hàng</h3>
            <div className="order-contact">
              <b>{order.customer}</b>
              {order.email && <a href={`mailto:${order.email}`}>{order.email}</a>}
              {order.phone && <a href={`tel:${order.phone}`}>{order.phone}</a>}
              {order.location && <span>{order.location}</span>}
            </div>
          </div>
          <div className="order-card">
            <h3>Đánh giá rủi ro</h3>
            <p className="order-risk"><ShieldCheck size={16} /> Rủi ro thấp · Thông tin thanh toán và giao hàng hợp lệ.</p>
          </div>
        </aside>
      </div>
    </Modal>
  )
}

// eslint-disable-next-line no-unused-vars
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

function CustomersManagePage({ meta, customers, onCreate, onEdit, onView, onRemove }) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const [selected, setSelected] = useState([])
  const sanitizeLocation = (loc) => {
    if (!loc) return ''
    if (/pass|api|token|key|secret|password|@#\$|77086/i.test(loc)) return ''
    return loc
  }
  const visible = customers.filter((customer) => {
    const matchesQuery = `${customer.name} ${customer.email} ${sanitizeLocation(customer.location)} ${customer.phone || ''}`.toLowerCase().includes(query.toLowerCase())
    const matchesTab = tab === 'all' || (tab === 'returning' && customer.orders > 1) || (tab === 'email' && customer.email) || (tab === 'blocked' && customer.status === 'blocked')
    return matchesQuery && matchesTab
  })
  const allSelected = visible.length > 0 && visible.every((c) => selected.includes(c.id))
  const toggleAll = () => setSelected(allSelected ? [] : visible.map((c) => c.id))
  const toggleSelected = (id) => setSelected((cur) => cur.includes(id) ? cur.filter((i) => i !== id) : [...cur, id])
  const blockedCount = customers.filter((c) => c.status === 'blocked').length

  return (
    <>
      <SectionTitle title={meta.customers[0]} description={meta.customers[1]} action="Thêm khách hàng" onAction={onCreate} />
      <section className="admin-panel data-panel">
        <div className="data-tabs">
          <button className={tab === 'all' ? 'active' : ''} type="button" onClick={() => setTab('all')}>Tất cả <em>{customers.length}</em></button>
          <button className={tab === 'returning' ? 'active' : ''} type="button" onClick={() => setTab('returning')}>Khách quay lại</button>
          <button className={tab === 'email' ? 'active' : ''} type="button" onClick={() => setTab('email')}>Có email</button>
          {blockedCount > 0 && <button className={tab === 'blocked' ? 'active' : ''} type="button" onClick={() => setTab('blocked')}>Bị khóa <em>{blockedCount}</em></button>}
        </div>
        <div className="table-toolbar">
          <label><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm tên, email, điện thoại hoặc địa điểm" /></label>
          <button type="button"><Filter size={15} /> Phân khúc</button>
        </div>
        {selected.length > 0 && (
          <div className="order-bulk-bar">
            <span>{selected.length} khách đã chọn</span>
            <button className="danger-button" type="button" onClick={() => { selected.forEach((id) => onRemove(id)); setSelected([]) }}>Xóa đã chọn</button>
          </div>
        )}
        <div className="admin-table-wrap">
          <table className="admin-table customers-table">
            <thead><tr>
              <th><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Địa điểm</th>
              <th>Ngày đăng ký</th>
              <th>Trạng thái</th>
              <th>Đơn hàng</th>
              <th>Đã chi tiêu</th>
              <th></th>
            </tr></thead>
            <tbody>{visible.map((customer) => (
              <tr key={customer.id}>
                <td><input type="checkbox" checked={selected.includes(customer.id)} onChange={() => toggleSelected(customer.id)} /></td>
                <td><div className="customer-cell"><span>{customer.initials}</span><div><b>{customer.name}</b><small>{customer.email}</small></div></div></td>
                <td>{customer.phone ? <a href={`tel:${customer.phone}`} className="customer-phone">{customer.phone}</a> : <span className="muted-dash">—</span>}</td>
                <td>{sanitizeLocation(customer.location) || <span className="muted-dash">—</span>}</td>
                <td className="date-cell">{customer.createdAt || <span className="muted-dash">—</span>}</td>
                <td><StatusPill>{customer.status === 'blocked' ? 'Blocked' : 'Active'}</StatusPill></td>
                <td>{customer.orders}</td>
                <td><b>{money(customer.spent)}</b></td>
                <td><div className="row-actions">
                  <button className="row-icon" type="button" onClick={() => onView(customer)} title="Xem"><Eye size={15} /></button>
                  <button className="row-icon" type="button" onClick={() => onEdit(customer)} title="Sửa"><Pencil size={15} /></button>
                  <button className="row-icon" type="button" onClick={() => onRemove(customer.id)} title="Xóa"><Trash2 size={15} /></button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
          {!visible.length && <EmptyHint icon={Users} title="Không tìm thấy khách hàng" copy="Thử đổi từ khóa hoặc tạo khách hàng mới." />}
        </div>
      </section>
    </>
  )
}

function CustomerModal({ customer, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: customer?.name || '', email: customer?.email || '', phone: customer?.phone || '',
    province: customer?.province || '', district: customer?.district || '',
    ward: customer?.ward || '', address: customer?.address || '',
    birthday: customer?.birthday || '', gender: customer?.gender || '',
    tags: Array.isArray(customer?.tags) ? customer.tags.join(', ') : (customer?.tags || ''),
    notes: customer?.notes || '', status: customer?.status || 'active',
    sendActivation: !customer,
  })
  const change = (event) => {
    const { checked, name, type, value } = event.target
    setForm((cur) => ({ ...cur, [name]: type === 'checkbox' ? checked : value }))
  }
  const submit = (event) => {
    event.preventDefault()
    onSubmit({
      ...customer,
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      location: [form.district, form.province].filter(Boolean).join(', ') || customer?.location || '',
    })
  }
  return (
    <Modal title={customer ? 'Sửa khách hàng' : 'Thêm khách hàng mới'} onClose={onClose}>
      <form className="modal-form compact-form" onSubmit={submit}>
        <p className="form-section-head">Thông tin cơ bản</p>
        <div>
          <label><span>Tên khách hàng *</span><input required name="name" value={form.name} onChange={change} /></label>
          <label><span>Email *</span><input required type="email" name="email" value={form.email} onChange={change} /></label>
        </div>
        <div>
          <label><span>Số điện thoại</span><input name="phone" value={form.phone} onChange={change} placeholder="+84..." /></label>
          <label><span>Trạng thái</span>
            <select name="status" value={form.status} onChange={change}>
              <option value="active">Đang hoạt động</option>
              <option value="blocked">Bị khóa</option>
            </select>
          </label>
        </div>
        <div>
          <label><span>Ngày sinh</span><input type="date" name="birthday" value={form.birthday} onChange={change} /></label>
          <label><span>Giới tính</span>
            <select name="gender" value={form.gender} onChange={change}>
              <option value="">Không xác định</option>
              <option value="female">Nữ</option>
              <option value="male">Nam</option>
              <option value="other">Khác</option>
            </select>
          </label>
        </div>
        <p className="form-section-head">Địa chỉ giao hàng</p>
        <div>
          <label><span>Tỉnh / Thành phố</span><input name="province" value={form.province} onChange={change} placeholder="Hồ Chí Minh" /></label>
          <label><span>Quận / Huyện</span><input name="district" value={form.district} onChange={change} placeholder="Quận 1" /></label>
        </div>
        <div>
          <label><span>Phường / Xã</span><input name="ward" value={form.ward} onChange={change} placeholder="Phường Bến Nghé" /></label>
        </div>
        <label><span>Địa chỉ cụ thể (số nhà, đường...)</span><input name="address" value={form.address} onChange={change} placeholder="123 Nguyễn Huệ" /></label>
        <p className="form-section-head">CRM & Ghi chú</p>
        <label><span>Nhãn / Tags</span><input name="tags" value={form.tags} onChange={change} placeholder="VIP, Wholesale, Facebook (phân cách bởi dấu phẩy)" /></label>
        <label><span>Ghi chú nội bộ</span><textarea name="notes" value={form.notes} onChange={change} placeholder="Ví dụ: Khách chỉ nhận hàng sau 18h..." rows={2} /></label>
        {!customer && (
          <label className="checkbox-label">
            <input type="checkbox" name="sendActivation" checked={form.sendActivation} onChange={change} />
            <span>Tự động tạo mật khẩu ngẫu nhiên và gửi email kích hoạt tài khoản</span>
          </label>
        )}
        <div className="modal-actions"><button className="admin-secondary" type="button" onClick={onClose}>Hủy</button><button className="admin-primary" type="submit">{customer ? 'Lưu thay đổi' : 'Thêm khách hàng'}</button></div>
      </form>
    </Modal>
  )
}

function CustomerDetailModal({ customer, onClose, onEdit, onRemove }) {
  return (
    <Modal title="Chi tiết khách hàng" onClose={onClose}>
      <div className="discount-detail">
        <p><span>Tên</span><b>{customer.name}</b></p>
        <p><span>Email</span><b>{customer.email}</b></p>
        <p><span>Điện thoại</span><b>{customer.phone || 'Chưa có'}</b></p>
        <p><span>Địa điểm</span><b>{customer.location || 'Chưa có'}</b></p>
        <p><span>Đơn hàng</span><b>{customer.orders}</b></p>
        <p><span>Đã chi tiêu</span><b>{money(customer.spent)}</b></p>
      </div>
      <div className="modal-actions discount-type-actions"><button className="admin-secondary" type="button" onClick={onClose}>Đóng</button><button className="admin-secondary" type="button" onClick={() => onEdit(customer)}><Pencil size={14} /> Sửa</button><button className="product-danger" type="button" onClick={() => onRemove(customer.id)}><Trash2 size={14} /> Xóa</button></div>
    </Modal>
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

// eslint-disable-next-line no-unused-vars
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

function DiscountsManagePage({ meta, discounts, onCreate, onEdit, onView, onRemove }) {
  const [query, setQuery] = useState('')
  const [statusTab, setStatusTab] = useState('all')
  const normalizedQuery = query.trim().toLowerCase()
  const visibleDiscounts = discounts.filter((discount) => {
    const matchesQuery = !normalizedQuery || `${discount.code} ${discount.title} ${discount.type} ${discount.value}`.toLowerCase().includes(normalizedQuery)
    const matchesStatus = statusTab === 'all'
      || (statusTab === 'active' && discount.status === 'Active')
      || (statusTab === 'scheduled' && discount.status === 'Scheduled')
      || (statusTab === 'expired' && discount.status === 'Expired')
      || (statusTab === 'draft' && discount.status === 'Draft')
    return matchesQuery && matchesStatus
  })

  return (
    <>
      <SectionTitle title={meta.discounts[0]} description={meta.discounts[1]} action="Tạo mã giảm giá" onAction={onCreate} />
      <section className="metrics-grid">
        <MetricCard label="Doanh số từ ưu đãi" value={money(1438)} note="Trong 30 ngày qua" />
        <MetricCard label="Mã đang hoạt động" value={String(discounts.filter((item) => item.status === 'Active').length)} note={`${discounts.length} mã đã tạo`} />
        <MetricCard label="Lượt sử dụng" value={String(discounts.reduce((total, discount) => total + Number(discount.uses || 0), 0))} note="Tổng lượt ghi nhận" />
      </section>
      <section className="admin-panel data-panel">
        <div className="data-tabs">
          <button className={statusTab === 'all' ? 'active' : ''} type="button" onClick={() => setStatusTab('all')}>Tất cả</button>
          <button className={statusTab === 'active' ? 'active' : ''} type="button" onClick={() => setStatusTab('active')}>Đang hoạt động</button>
          <button className={statusTab === 'scheduled' ? 'active' : ''} type="button" onClick={() => setStatusTab('scheduled')}>Đã lên lịch</button>
          <button className={statusTab === 'expired' ? 'active' : ''} type="button" onClick={() => setStatusTab('expired')}>Đã hết hạn</button>
          <button className={statusTab === 'draft' ? 'active' : ''} type="button" onClick={() => setStatusTab('draft')}>Bản nháp</button>
        </div>
        <div className="table-toolbar">
          <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm mã giảm giá" /></label>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Mã</th><th>Loại</th><th>Giá trị</th><th>Trạng thái</th><th>Lượt dùng</th><th>Kết thúc</th><th></th></tr></thead>
            <tbody>{visibleDiscounts.map((discount) => <tr key={discount.id || discount.code}><td><b className="discount-code"><Tag size={14} />{discount.code || discount.title}</b></td><td>{discount.type}</td><td>{discount.value}</td><td><StatusPill>{discount.status}</StatusPill></td><td>{discount.uses}</td><td>{discount.ends}</td><td><div className="row-actions"><button className="row-icon" type="button" onClick={() => onView(discount)} title="Xem chi tiết"><Eye size={15} /></button><button className="row-icon" type="button" onClick={() => onEdit(discount)} title="Sửa"><Pencil size={15} /></button><button className="row-icon" type="button" onClick={() => onRemove(discount.id)} title="Xóa"><Trash2 size={15} /></button></div></td></tr>)}</tbody>
          </table>
          {!visibleDiscounts.length && <EmptyHint icon={BadgePercent} title="Không tìm thấy mã giảm giá" copy="Thử đổi từ khóa tìm kiếm hoặc tạo mã mới." />}
        </div>
      </section>
    </>
  )
}

// eslint-disable-next-line no-unused-vars
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

function ContentManagePage({ meta, articles, type = 'all', onCreate, onEdit, onView, onRemove }) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const visible = articles.filter((article) => {
    const matchesQuery = `${article.title} ${article.author} ${article.category} ${article.tags?.join(' ')}`.toLowerCase().includes(query.toLowerCase())
    const matchesTab = tab === 'all' || article.status.toLowerCase() === tab
    const matchesType = type === 'all' || article.type === type
    return matchesQuery && matchesTab && matchesType
  })
  const createLabel = type === 'recipe' ? 'Tạo recipe mới' : type === 'news' ? 'Tạo bài blog mới' : 'Viết bài mới'
  return (
    <>
      <SectionTitle title={meta[0]} description={meta[1]} action={createLabel} onAction={onCreate} />
      <section className="admin-panel data-panel">
        <div className="data-tabs"><button className={tab === 'all' ? 'active' : ''} type="button" onClick={() => setTab('all')}>Tất cả</button><button className={tab === 'published' ? 'active' : ''} type="button" onClick={() => setTab('published')}>Hiển thị</button><button className={tab === 'draft' ? 'active' : ''} type="button" onClick={() => setTab('draft')}>Đã ẩn</button></div>
        <div className="table-toolbar"><label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm bài viết, tác giả, thẻ" /></label></div>
        <div className="content-grid managed-content-grid">
          {visible.map((article) => (
            <article className="admin-panel article-admin-card" key={article.id || article.slug}>
              <img src={article.image} alt="" />
              <div><StatusPill>{article.status}</StatusPill><h3>{article.title}</h3><p>{article.author} · {article.date}</p><div><button className="admin-secondary" type="button" onClick={() => onEdit(article)}><Pencil size={14} /> Sửa</button><button className="row-icon" type="button" onClick={() => onView(article)}><Eye size={16} /></button><button className="row-icon" type="button" onClick={() => onRemove(article.id)}><Trash2 size={16} /></button></div></div>
            </article>
          ))}
          <button className="new-content-card" type="button" onClick={onCreate}><Plus size={24} /><span>{createLabel}</span></button>
        </div>
      </section>
    </>
  )
}

function ArticleModal({ article, defaultType = 'news', onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    type: article?.type || defaultType,
    category: article?.category || (defaultType === 'recipe' ? 'Recipes' : 'News'),
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    image: article?.image || '',
    status: article?.status || 'Draft',
    author: article?.author || 'LyLy Editorial',
    tags: article?.tags?.join(', ') || '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(form.image || '')
  const change = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === 'type' ? { category: value === 'recipe' ? 'Recipes' : 'News' } : {}),
      ...(name === 'title' && !article ? { slug: slugify(value) } : {}),
    }))
  }
  const chooseImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setForm((current) => ({ ...current, image: current.image || 'upload-selected' }))
    imageFilePreview(file, setImagePreview)
  }
  const submit = (event) => {
    event.preventDefault()
    onSubmit({ ...article, ...form, imageFile, tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean), category: form.type === 'recipe' ? 'Recipes' : form.category })
  }
  return (
    <Modal title={article ? 'Sửa bài viết' : 'Thêm bài viết'} onClose={onClose} wide>
      <form className="admin-form article-form" onSubmit={submit}>
        <label className="product-upload-field article-image-upload"><span>Image</span><div className="product-image-picker"><img src={imagePreview || defaultProductImage} alt="" /><div><Upload size={21} /><b>{imageFile ? imageFile.name : 'Choose image from device'}</b><small>Upload the cover image for recipe/blog. Maximum 5MB.</small></div><input required={!form.image && !imageFile} accept="image/*" type="file" onChange={chooseImage} /></div></label>
        <section><h3>Nội dung</h3><label><span>Tiêu đề</span><input required name="title" value={form.title} onChange={change} /></label><label><span>Slug</span><input required name="slug" value={form.slug} onChange={change} /></label><label><span>Đoạn trích</span><textarea name="excerpt" value={form.excerpt} onChange={change} /></label><label><span>Nội dung bài viết</span><textarea name="content" value={form.content} onChange={change} rows={7} /></label></section>
        <section><h3>Hiển thị</h3><label><span>Loại</span><select name="type" value={form.type} onChange={change}><option value="news">Blog/news</option><option value="recipe">Recipe</option></select></label><label><span>Trạng thái</span><select name="status" value={form.status} onChange={change}><option>Published</option><option>Draft</option></select></label><label><span>Tác giả</span><input name="author" value={form.author} onChange={change} /></label><label><span>Ảnh</span><input required name="image" value={form.image} onChange={change} placeholder="https://..." /></label><label><span>Thẻ</span><input name="tags" value={form.tags} onChange={change} placeholder="Fresh, Recipe" /></label></section>
        <div className="modal-actions"><button className="admin-secondary" type="button" onClick={onClose}>Hủy</button><button className="admin-primary" type="submit">Lưu bài viết</button></div>
      </form>
    </Modal>
  )
}

function ArticleDetailModal({ article, onClose, onEdit, onRemove }) {
  return (
    <Modal title="Chi tiết bài viết" onClose={onClose}>
      <div className="article-detail-preview"><img src={article.image} alt="" /><h3>{article.title}</h3><p>{article.excerpt}</p></div>
      <div className="discount-detail">
        <p><span>Slug</span><b>{article.slug}</b></p>
        <p><span>Loại</span><b>{article.type}</b></p>
        <p><span>Trạng thái</span><b>{article.status}</b></p>
        <p><span>Tác giả</span><b>{article.author}</b></p>
        <p><span>Thẻ</span><b>{article.tags?.join(', ') || 'Không có'}</b></p>
      </div>
      <div className="modal-actions discount-type-actions"><button className="admin-secondary" type="button" onClick={onClose}>Đóng</button><button className="admin-secondary" type="button" onClick={() => onEdit(article)}><Pencil size={14} /> Sửa</button><button className="product-danger" type="button" onClick={() => onRemove(article.id)}><Trash2 size={14} /> Xóa</button></div>
    </Modal>
  )
}

function ReportsPage({ meta, orders, products, customers, discounts }) {
  const [activeReportId, setActiveReportId] = useState('sales')
  const [query, setQuery] = useState('')
  const paidOrders = orders.filter((order) => order.payment === 'Paid')
  const totalRevenue = paidOrders.reduce((total, order) => total + Number(order.total || 0), 0)
  const lineItems = orders.flatMap((order) => (order.lineItems || []).map((item) => ({ ...item, orderId: order.id, orderStatus: order.delivery, orderTotal: order.total })))
  const productRows = products.map((product) => {
    const matchingItems = lineItems.filter((item) => item.name.includes(product.name))
    const quantity = matchingItems.reduce((total, item) => total + Number(item.quantity || 0), 0)
    const revenue = matchingItems.reduce((total, item) => total + Number(item.total || 0), 0)
    return { name: product.name, category: product.category, sku: product.sku || product.id, quantity, revenue, stock: product.stock }
  }).sort((a, b) => b.revenue - a.revenue)
  const returningCustomers = customers.filter((customer) => customer.orders > 1)
  const statusRows = ['Unfulfilled', 'Packing', 'Ready', 'Delivered', 'Cancelled'].map((status) => {
    const matching = orders.filter((order) => order.delivery === status)
    return { status, orders: matching.length, revenue: matching.reduce((total, order) => total + Number(order.total || 0), 0) }
  })
  const reports = [
    {
      id: 'sales',
      title: 'Doanh thu và đơn hàng',
      description: 'Theo dõi tổng doanh thu, AOV và trạng thái thanh toán.',
      kpis: [['Doanh thu', money(totalRevenue)], ['Đơn đã thanh toán', paidOrders.length], ['AOV', money(paidOrders.length ? totalRevenue / paidOrders.length : 0)]],
      columns: ['Mã đơn', 'Khách hàng', 'Thanh toán', 'Fulfillment', 'Tổng tiền'],
      rows: orders.map((order) => ({ search: `${order.id} ${order.customer} ${order.payment} ${order.delivery}`, cells: [order.id, order.customer, order.payment, order.delivery, money(order.total)] })),
    },
    {
      id: 'products',
      title: 'Hiệu suất sản phẩm',
      description: 'Xếp hạng sản phẩm theo doanh thu, số lượng bán và tồn kho.',
      kpis: [['Sản phẩm', products.length], ['Đã bán', productRows.reduce((total, row) => total + row.quantity, 0)], ['Doanh thu SP', money(productRows.reduce((total, row) => total + row.revenue, 0))]],
      columns: ['Sản phẩm', 'Danh mục', 'SKU', 'Đã bán', 'Doanh thu', 'Tồn kho'],
      rows: productRows.map((row) => ({ search: `${row.name} ${row.category} ${row.sku}`, cells: [row.name, row.category, row.sku, row.quantity, money(row.revenue), row.stock] })),
    },
    {
      id: 'customers',
      title: 'Khách hàng',
      description: 'Nhận diện khách quay lại, tổng chi tiêu và số đơn theo khách.',
      kpis: [['Khách hàng', customers.length], ['Khách quay lại', returningCustomers.length], ['Tỷ lệ quay lại', `${customers.length ? ((returningCustomers.length / customers.length) * 100).toFixed(1) : '0.0'}%`]],
      columns: ['Khách hàng', 'Email', 'Địa điểm', 'Đơn hàng', 'Đã chi tiêu'],
      rows: customers.map((customer) => ({ search: `${customer.name} ${customer.email} ${customer.location}`, cells: [customer.name, customer.email, customer.location || 'Chưa có', customer.orders, money(customer.spent)] })),
    },
    {
      id: 'discounts',
      title: 'Khuyến mãi',
      description: 'Kiểm tra mã giảm giá đang chạy, lượt dùng và ngày kết thúc.',
      kpis: [['Mã giảm giá', discounts.length], ['Đang hoạt động', discounts.filter((discount) => discount.status === 'Active').length], ['Lượt dùng', discounts.reduce((total, discount) => total + Number(discount.uses || 0), 0)]],
      columns: ['Mã/Tiêu đề', 'Loại', 'Giá trị', 'Trạng thái', 'Lượt dùng', 'Kết thúc'],
      rows: discounts.map((discount) => ({ search: `${discount.code} ${discount.title} ${discount.type} ${discount.status}`, cells: [discount.code || discount.title, discount.type, discount.value, discount.status, discount.uses || 0, discount.ends] })),
    },
    {
      id: 'fulfillment',
      title: 'Fulfillment',
      description: 'Theo dõi số đơn theo trạng thái xử lý để ưu tiên vận hành.',
      kpis: [['Tổng đơn', orders.length], ['Đã giao', orders.filter((order) => order.delivery === 'Delivered').length], ['Cần xử lý', orders.filter((order) => !['Delivered', 'Cancelled'].includes(order.delivery)).length]],
      columns: ['Trạng thái', 'Số đơn', 'Doanh thu liên quan'],
      rows: statusRows.map((row) => ({ search: row.status, cells: [row.status, row.orders, money(row.revenue)] })),
    },
  ]
  const activeReport = reports.find((report) => report.id === activeReportId) || reports[0]
  const visibleRows = activeReport.rows.filter((row) => row.search.toLowerCase().includes(query.toLowerCase()))
  const exportCsv = () => {
    const csv = [activeReport.columns, ...visibleRows.map((row) => row.cells)].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${activeReport.id}-report.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <SectionTitle title={meta['analytics-reports'][0]} description={meta['analytics-reports'][1]} action="Xuất CSV" icon={Download} onAction={exportCsv} />
      <section className="reports-layout">
        <aside className="admin-panel report-list">
          {reports.map((report) => <button className={activeReport.id === report.id ? 'active' : ''} type="button" onClick={() => { setActiveReportId(report.id); setQuery('') }} key={report.id}><b>{report.title}</b><span>{report.description}</span></button>)}
        </aside>
        <section className="admin-panel report-detail">
          <div className="report-head"><div><p className="admin-eyebrow">Báo cáo</p><h2>{activeReport.title}</h2><span>{activeReport.description}</span></div><button className="admin-secondary" type="button" onClick={exportCsv}><Download size={14} /> Xuất CSV</button></div>
          <div className="report-kpis">{activeReport.kpis.map(([label, value]) => <article key={label}><span>{label}</span><b>{value}</b></article>)}</div>
          <div className="table-toolbar"><label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm trong báo cáo" /></label></div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr>{activeReport.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
              <tbody>{visibleRows.map((row, index) => <tr key={`${activeReport.id}-${index}`}>{row.cells.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
            </table>
            {!visibleRows.length && <EmptyHint icon={BarChart3} title="Không có dữ liệu báo cáo" copy="Thử đổi từ khóa hoặc kiểm tra dữ liệu đơn hàng." />}
          </div>
        </section>
      </section>
    </>
  )
}

function AnalyticsPage({ meta, orders, products, customers }) {
  const paidOrders = orders.filter((order) => order.payment === 'Paid')
  void products
  void customers
  const chart = Array.from({ length: 12 }, (_, index) => Math.max(8, Math.round((paidOrders[index % Math.max(1, paidOrders.length)]?.total || 20) * 1.8)))
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
  const storefrontLocations = [
    ['Champs Elysees', '13 Champs-Elysees', '75008 Paris', 'Pickup $5 - Ready in 2 hrs'],
    ['Saint Germain', '18 Rue Saint-Germain', '75006 Paris', 'Pickup $5 - Ready in 2 hrs'],
    ['La Defense', '22 Parvis de la Defense', '92800 Puteaux', 'Free pickup - Ready in 24 hrs'],
    ['Warehouse', 'Fond du Val 23', 'Maurecourt, France', 'Free pickup - Ready in 24 hrs'],
  ]

  return (
    <>
      <SectionTitle title={meta.locations[0]} description={meta.locations[1]} action="Thêm địa điểm" />
      <section className="location-grid">
        {storefrontLocations.map(([name, address, city, note]) => (
          <div className="admin-panel location-card" key={name}>
            <MapPin size={24} />
            <div><StatusPill>Active</StatusPill><h3>LyLy Market - {name}</h3><p>{address}<br />{city}</p><span>{note}</span></div>
            <button className="row-icon" type="button"><MoreHorizontal size={17} /></button>
          </div>
        ))}
        <div className="admin-panel location-card"><MapPin size={24} /><div><StatusPill>Active</StatusPill><h3>LyLy Market · Brooklyn</h3><p>68 Greenpoint Avenue<br />Brooklyn, NY 11222</p><span>Pickup · Local delivery · Inventory</span></div><button className="row-icon" type="button"><MoreHorizontal size={17} /></button></div>
        <div className="admin-panel location-card"><MapPin size={24} /><div><StatusPill>Active</StatusPill><h3>LyLy Market · Manhattan</h3><p>214 Spring Street<br />New York, NY 10013</p><span>Pickup · Inventory</span></div><button className="row-icon" type="button"><MoreHorizontal size={17} /></button></div>
      </section>
    </>
  )
}

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
function SettingsManagePage({ meta, settings, onSave }) {
  const [form, setForm] = useState(settings)
  const setGroupValue = (group, name, value) => setForm((current) => ({ ...current, [group]: { ...current[group], [name]: value } }))
  const submit = (event) => {
    event.preventDefault()
    onSave(form)
  }
  return (
    <>
      <SectionTitle title={meta.settings[0]} description={meta.settings[1]} />
      <form className="settings-editor" onSubmit={submit}>
        <section className="admin-panel"><h3>Chung</h3><label><span>Tên cửa hàng</span><input value={form.general.storeName} onChange={(event) => setGroupValue('general', 'storeName', event.target.value)} /></label><label><span>Email liên hệ</span><input type="email" value={form.general.contactEmail} onChange={(event) => setGroupValue('general', 'contactEmail', event.target.value)} /></label><label><span>Điện thoại</span><input value={form.general.phone} onChange={(event) => setGroupValue('general', 'phone', event.target.value)} /></label><div className="settings-two"><label><span>Tiền tệ</span><select value={form.general.currency} onChange={(event) => setGroupValue('general', 'currency', event.target.value)}><option>VND</option><option>USD</option></select></label><label><span>Múi giờ</span><input value={form.general.timezone} onChange={(event) => setGroupValue('general', 'timezone', event.target.value)} /></label></div></section>
        <section className="admin-panel"><h3>Vận chuyển và giao hàng</h3><label className="discount-check"><input type="checkbox" checked={form.shipping.pickupEnabled} onChange={(event) => setGroupValue('shipping', 'pickupEnabled', event.target.checked)} /> Cho phép nhận hàng tại cửa hàng</label><label className="discount-check"><input type="checkbox" checked={form.shipping.deliveryEnabled} onChange={(event) => setGroupValue('shipping', 'deliveryEnabled', event.target.checked)} /> Cho phép giao hàng tận nơi</label><div className="settings-two"><label><span>Miễn phí từ</span><input type="number" value={form.shipping.freeShippingThreshold} onChange={(event) => setGroupValue('shipping', 'freeShippingThreshold', Number(event.target.value))} /></label><label><span>Phí giao nội địa</span><input type="number" value={form.shipping.domesticShippingFee} onChange={(event) => setGroupValue('shipping', 'domesticShippingFee', Number(event.target.value))} /></label></div><label><span>Cam kết giao/nhận</span><input value={form.shipping.promise} onChange={(event) => setGroupValue('shipping', 'promise', event.target.value)} /></label></section>
        <section className="admin-panel"><h3>Thông báo</h3><label><span>Email người gửi</span><input type="email" value={form.notifications.senderEmail} onChange={(event) => setGroupValue('notifications', 'senderEmail', event.target.value)} /></label><label className="discount-check"><input type="checkbox" checked={form.notifications.customerNotifications} onChange={(event) => setGroupValue('notifications', 'customerNotifications', event.target.checked)} /> Gửi thông báo cho khách hàng</label><label className="discount-check"><input type="checkbox" checked={form.notifications.staffNotifications} onChange={(event) => setGroupValue('notifications', 'staffNotifications', event.target.checked)} /> Gửi thông báo cho nhân viên</label><label className="discount-check"><input type="checkbox" checked={form.notifications.webhooks} onChange={(event) => setGroupValue('notifications', 'webhooks', event.target.checked)} /> Bật webhook</label></section>
        <div className="settings-save"><button className="admin-primary" type="submit">Lưu cài đặt</button></div>
      </form>
    </>
  )
}

function SettingsWorkspacePage({ meta, settings, orders, onSave }) {
  const [section, setSection] = useState('general')
  const [form, setForm] = useState(settings)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Staff', status: 'Invited', twoFactor: false })
  const [newCarrier, setNewCarrier] = useState({ name: '', service: '', type: 'domestic', enabled: true, cod: true, trackingUrl: '', notes: '' })
  const [showCarrierForm, setShowCarrierForm] = useState(false)
  const [editingCarrierId, setEditingCarrierId] = useState('')
  const users = form.users || []
  const shippingCarriers = form.shipping?.carriers?.length ? form.shipping.carriers : defaultShippingCarriers
  const enabledCarriers = shippingCarriers.filter((carrier) => carrier.enabled !== false)
  const codCarriers = shippingCarriers.filter((carrier) => carrier.cod)
  const openOrders = orders.filter((order) => !['Delivered', 'Cancelled'].includes(order.delivery)).slice(0, 5)
  const settingsNav = [
    { id: 'general', icon: Store, title: 'Chung', text: 'Thông tin cửa hàng, tiền tệ, múi giờ và định dạng đơn hàng.' },
    { id: 'users', icon: Users, title: 'Người dùng & phân quyền', text: 'Quản lý tài khoản nội bộ, vai trò và trạng thái truy cập.' },
    { id: 'shipping', icon: Truck, title: 'Vận chuyển và giao hàng', text: 'Bật tắt nhận hàng, giao hàng và cấu hình phí vận chuyển.' },
    { id: 'notifications', icon: Bell, title: 'Thông báo', text: 'Cấu hình email gửi, thông báo nhân viên và webhook.' },
  ]
  const roleOptions = ['Owner', 'Admin', 'Staff', 'Fulfillment', 'Viewer']
  const statusOptions = ['Active', 'Invited', 'Disabled']
  const carrierTypeLabels = { local: 'Nội thành', domestic: 'Toàn quốc', express: 'Hỏa tốc', international: 'Quốc tế' }
  const setGroupValue = (group, name, value) => setForm((current) => ({ ...current, [group]: { ...(current[group] || {}), [name]: value } }))
  const addUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return
    setForm((current) => ({ ...current, users: [{ ...newUser, id: `user-${Date.now()}` }, ...(current.users || [])] }))
    setNewUser({ name: '', email: '', role: 'Staff', status: 'Invited', twoFactor: false })
  }
  const updateUser = (id, field, value) => setForm((current) => ({ ...current, users: (current.users || []).map((user) => user.id === id ? { ...user, [field]: value } : user) }))
  const removeUser = (id) => setForm((current) => ({ ...current, users: (current.users || []).filter((user) => user.id !== id) }))
  const setShippingCarriers = (carriers) => setGroupValue('shipping', 'carriers', carriers)
  const addCarrier = () => {
    if (!newCarrier.name.trim()) return
    const carrier = {
      ...newCarrier,
      id: slugify(newCarrier.name) || `carrier-${Date.now()}`,
      name: newCarrier.name.trim(),
      service: newCarrier.service.trim() || 'Giao hàng tiêu chuẩn',
    }
    setShippingCarriers([carrier, ...shippingCarriers])
    setNewCarrier({ name: '', service: '', type: 'domestic', enabled: true, cod: true, trackingUrl: '', notes: '' })
    setShowCarrierForm(false)
    setEditingCarrierId(carrier.id)
  }
  const updateCarrier = (id, field, value) => setShippingCarriers(shippingCarriers.map((carrier) => carrier.id === id ? { ...carrier, [field]: value } : carrier))
  const removeCarrier = (id) => setShippingCarriers(shippingCarriers.filter((carrier) => carrier.id !== id))
  const submit = (event) => {
    event.preventDefault()
    onSave(form)
  }

  return (
    <>
      <SectionTitle title={meta.settings[0]} description={meta.settings[1]} />
      <form className="settings-workspace" onSubmit={submit}>
        <aside className="admin-panel settings-menu">
          {settingsNav.map((item) => {
            const Icon = item.icon
            return (
              <button className={section === item.id ? 'active' : ''} key={item.id} type="button" onClick={() => setSection(item.id)}>
                <Icon size={18} />
                <span><b>{item.title}</b><small>{item.text}</small></span>
              </button>
            )
          })}
        </aside>

        <div className="settings-page-panel">
          {section === 'general' && (
            <>
              <section className="admin-panel settings-section-card">
                <h3>Thông tin doanh nghiệp</h3>
                <p>Dữ liệu này được dùng trên admin, email, thông báo đơn hàng và các phần hiển thị công khai của cửa hàng.</p>
                <div className="settings-two">
                  <label>Tên cửa hàng<input value={form.general?.storeName || ''} onChange={(event) => setGroupValue('general', 'storeName', event.target.value)} /></label>
                  <label>Email liên hệ<input type="email" value={form.general?.contactEmail || ''} onChange={(event) => setGroupValue('general', 'contactEmail', event.target.value)} /></label>
                </div>
                <div className="settings-two">
                  <label>Số điện thoại<input value={form.general?.phone || ''} onChange={(event) => setGroupValue('general', 'phone', event.target.value)} /></label>
                  <label>Quốc gia<input value={form.general?.country || ''} onChange={(event) => setGroupValue('general', 'country', event.target.value)} /></label>
                </div>
              </section>
              <section className="admin-panel settings-section-card">
                <h3>Mặc định cửa hàng</h3>
                <div className="settings-two">
                  <label>Tiền tệ<select value={form.general?.currency || 'VND'} onChange={(event) => setGroupValue('general', 'currency', event.target.value)}><option>VND</option><option>USD</option><option>EUR</option></select></label>
                  <label>Múi giờ<select value={form.general?.timezone || 'Asia/Bangkok'} onChange={(event) => setGroupValue('general', 'timezone', event.target.value)}><option>Asia/Bangkok</option><option>Asia/Ho_Chi_Minh</option><option>UTC</option></select></label>
                </div>
                <div className="settings-two">
                  <label>Tiền tố đơn hàng<input value={form.general?.orderPrefix || ''} onChange={(event) => setGroupValue('general', 'orderPrefix', event.target.value)} /></label>
                  <label>Hậu tố đơn hàng<input value={form.general?.orderSuffix || ''} onChange={(event) => setGroupValue('general', 'orderSuffix', event.target.value)} /></label>
                </div>
              </section>
            </>
          )}

          {section === 'users' && (
            <>
              <section className="admin-panel settings-section-card">
                <h3>Thêm người dùng</h3>
                <div className="settings-two">
                  <label>Tên<input value={newUser.name} onChange={(event) => setNewUser((current) => ({ ...current, name: event.target.value }))} /></label>
                  <label>Email<input type="email" value={newUser.email} onChange={(event) => setNewUser((current) => ({ ...current, email: event.target.value }))} /></label>
                </div>
                <div className="settings-two">
                  <label>Vai trò<select value={newUser.role} onChange={(event) => setNewUser((current) => ({ ...current, role: event.target.value }))}>{roleOptions.map((role) => <option key={role}>{role}</option>)}</select></label>
                  <label>Trạng thái<select value={newUser.status} onChange={(event) => setNewUser((current) => ({ ...current, status: event.target.value }))}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label>
                </div>
                <button className="admin-secondary" type="button" onClick={addUser}><Plus size={15} /> Thêm người dùng</button>
              </section>
              <section className="admin-panel managed-content-grid">
                <div className="admin-table settings-user-table">
                  <div className="admin-table-row head"><span>Người dùng</span><span>Vai trò</span><span>Trạng thái</span><span>2FA</span><span>Thao tác</span></div>
                  {users.map((user) => (
                    <div className="admin-table-row" key={user.id}>
                      <span><b>{user.name}</b><small>{user.email}</small></span>
                      <span><select value={user.role} onChange={(event) => updateUser(user.id, 'role', event.target.value)}>{roleOptions.map((role) => <option key={role}>{role}</option>)}</select></span>
                      <span><select value={user.status} onChange={(event) => updateUser(user.id, 'status', event.target.value)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></span>
                      <span><label className="settings-inline-check"><input type="checkbox" checked={Boolean(user.twoFactor)} onChange={(event) => updateUser(user.id, 'twoFactor', event.target.checked)} /> Bật</label></span>
                      <span><button className="icon-danger" type="button" onClick={() => removeUser(user.id)} disabled={user.role === 'Owner'}><Trash2 size={15} /></button></span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {section === 'shipping' && (
            <>
              <section className="admin-panel settings-section-card shipping-control-panel">
                <div className="settings-card-head">
                  <div>
                    <h3>Vận chuyển và giao hàng</h3>
                    <p>Bật phương thức phục vụ khách hàng và cấu hình phí hiển thị tại giỏ hàng, thanh toán.</p>
                  </div>
                  <div className="shipping-status-strip">
                    <span>{enabledCarriers.length}/{shippingCarriers.length} đơn vị đang bật</span>
                    <span>{codCarriers.length} hỗ trợ COD</span>
                  </div>
                </div>

                <div className="delivery-method-grid">
                  <label className={`delivery-method-card ${form.shipping?.pickupEnabled ? 'active' : ''}`}>
                    <input type="checkbox" checked={Boolean(form.shipping?.pickupEnabled)} onChange={(event) => setGroupValue('shipping', 'pickupEnabled', event.target.checked)} />
                    <Store size={18} />
                    <span><b>Nhận tại cửa hàng</b><small>Khách tự đến nhận, không cần đơn vị vận chuyển.</small></span>
                  </label>
                  <label className={`delivery-method-card ${form.shipping?.deliveryEnabled ? 'active' : ''}`}>
                    <input type="checkbox" checked={Boolean(form.shipping?.deliveryEnabled)} onChange={(event) => setGroupValue('shipping', 'deliveryEnabled', event.target.checked)} />
                    <Truck size={18} />
                    <span><b>Giao hàng tận nơi</b><small>Dùng phí vận chuyển và carrier khi xử lý đơn.</small></span>
                  </label>
                </div>

                <div className="shipping-rate-grid">
                  <label><span>Miễn phí từ</span><input type="number" value={form.shipping?.freeShippingThreshold || 0} onChange={(event) => setGroupValue('shipping', 'freeShippingThreshold', Number(event.target.value))} /></label>
                  <label><span>Phí nội thành</span><input type="number" value={form.shipping?.localDeliveryFee || 0} onChange={(event) => setGroupValue('shipping', 'localDeliveryFee', Number(event.target.value))} /></label>
                  <label><span>Phí tiêu chuẩn</span><input type="number" value={form.shipping?.domesticShippingFee || 0} onChange={(event) => setGroupValue('shipping', 'domesticShippingFee', Number(event.target.value))} /></label>
                  <label><span>Phí nhanh</span><input type="number" value={form.shipping?.expressShippingFee || 0} onChange={(event) => setGroupValue('shipping', 'expressShippingFee', Number(event.target.value))} /></label>
                  <label className="shipping-promise-field"><span>Cam kết xử lý</span><input value={form.shipping?.promise || ''} onChange={(event) => setGroupValue('shipping', 'promise', event.target.value)} /></label>
                </div>
              </section>

              <section className="admin-panel settings-section-card carrier-manager">
                <div className="settings-card-head">
                  <div>
                    <h3>Đơn vị vận chuyển</h3>
                    <p>Danh sách này dùng trong chi tiết đơn hàng để chọn carrier, nhập mã vận đơn và mở link tra cứu.</p>
                  </div>
                  <button className="admin-secondary" type="button" onClick={() => setShowCarrierForm((current) => !current)}><Plus size={15} /> Thêm đơn vị</button>
                </div>

                {showCarrierForm && (
                  <div className="carrier-setup-panel">
                    <div className="carrier-create-grid">
                      <label>Tên đơn vị<input value={newCarrier.name} onChange={(event) => setNewCarrier((current) => ({ ...current, name: event.target.value }))} placeholder="GHN, GHTK, Viettel Post..." /></label>
                      <label>Dịch vụ<input value={newCarrier.service} onChange={(event) => setNewCarrier((current) => ({ ...current, service: event.target.value }))} placeholder="Giao hàng nhanh" /></label>
                      <label>Phạm vi<select value={newCarrier.type} onChange={(event) => setNewCarrier((current) => ({ ...current, type: event.target.value }))}><option value="local">Nội thành</option><option value="domestic">Toàn quốc</option><option value="express">Hỏa tốc</option><option value="international">Quốc tế</option></select></label>
                      <label>URL tra cứu<input value={newCarrier.trackingUrl} onChange={(event) => setNewCarrier((current) => ({ ...current, trackingUrl: event.target.value }))} placeholder="https://.../{trackingId}" /></label>
                    </div>
                    <div className="carrier-create-actions">
                      <label className="settings-inline-check"><input type="checkbox" checked={newCarrier.cod} onChange={(event) => setNewCarrier((current) => ({ ...current, cod: event.target.checked }))} /> Hỗ trợ COD</label>
                      <label className="settings-inline-check"><input type="checkbox" checked={newCarrier.enabled} onChange={(event) => setNewCarrier((current) => ({ ...current, enabled: event.target.checked }))} /> Đang bật</label>
                      <button className="admin-primary" type="button" onClick={addCarrier}><CheckCircle2 size={15} /> Lưu đơn vị</button>
                    </div>
                  </div>
                )}

                <div className="carrier-table">
                  <div className="carrier-table-head"><span>Đơn vị</span><span>Dịch vụ</span><span>Phạm vi</span><span>Trạng thái</span><span></span></div>
                  {shippingCarriers.map((carrier) => {
                    const isEditing = editingCarrierId === carrier.id
                    return (
                      <article className={`carrier-row ${isEditing ? 'editing' : ''}`} key={carrier.id}>
                        <div className="carrier-row-main">
                          <span><b>{carrier.name}</b><small>{carrier.notes || 'Chưa có ghi chú'}</small></span>
                          <span>{carrier.service || 'Giao hàng tiêu chuẩn'}</span>
                          <span>{carrierTypeLabels[carrier.type] || carrier.type || 'Toàn quốc'}</span>
                          <span className="carrier-badges">
                            <button className={`status-pill ${carrier.enabled !== false ? 'active' : ''}`} type="button" onClick={() => updateCarrier(carrier.id, 'enabled', carrier.enabled === false)}> {carrier.enabled !== false ? 'Đang bật' : 'Đang tắt'}</button>
                            {carrier.cod && <em>COD</em>}
                          </span>
                          <span className="carrier-actions">
                            <button className="admin-icon-btn" type="button" onClick={() => setEditingCarrierId(isEditing ? '' : carrier.id)}><Pencil size={14} /></button>
                            <button className="icon-danger" type="button" onClick={() => removeCarrier(carrier.id)}><Trash2 size={15} /></button>
                          </span>
                        </div>
                        {isEditing && (
                          <div className="carrier-inline-editor">
                            <label>Tên<input value={carrier.name} onChange={(event) => updateCarrier(carrier.id, 'name', event.target.value)} /></label>
                            <label>Dịch vụ<input value={carrier.service || ''} onChange={(event) => updateCarrier(carrier.id, 'service', event.target.value)} /></label>
                            <label>Phạm vi<select value={carrier.type || 'domestic'} onChange={(event) => updateCarrier(carrier.id, 'type', event.target.value)}><option value="local">Nội thành</option><option value="domestic">Toàn quốc</option><option value="express">Hỏa tốc</option><option value="international">Quốc tế</option></select></label>
                            <label>URL tra cứu<input value={carrier.trackingUrl || ''} onChange={(event) => updateCarrier(carrier.id, 'trackingUrl', event.target.value)} placeholder="https://.../{trackingId}" /></label>
                            <label className="carrier-note-field">Ghi chú<input value={carrier.notes || ''} onChange={(event) => updateCarrier(carrier.id, 'notes', event.target.value)} /></label>
                            <div className="carrier-inline-flags">
                              <label className="settings-inline-check"><input type="checkbox" checked={carrier.enabled !== false} onChange={(event) => updateCarrier(carrier.id, 'enabled', event.target.checked)} /> Bật</label>
                              <label className="settings-inline-check"><input type="checkbox" checked={Boolean(carrier.cod)} onChange={(event) => updateCarrier(carrier.id, 'cod', event.target.checked)} /> COD</label>
                            </div>
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              </section>
            </>
          )}

          {section === 'notifications' && (
            <>
              <section className="admin-panel settings-section-card">
                <h3>Email người gửi</h3>
                <p>Email này dùng cho các thông báo đơn hàng và cập nhật trạng thái.</p>
                <label>Email gửi<input type="email" value={form.notifications?.senderEmail || ''} onChange={(event) => setGroupValue('notifications', 'senderEmail', event.target.value)} /></label>
                <label className="settings-inline-check"><input type="checkbox" checked={Boolean(form.notifications?.customerNotifications)} onChange={(event) => setGroupValue('notifications', 'customerNotifications', event.target.checked)} /> Gửi thông báo cho khách hàng</label>
                <label className="settings-inline-check"><input type="checkbox" checked={Boolean(form.notifications?.staffNotifications)} onChange={(event) => setGroupValue('notifications', 'staffNotifications', event.target.checked)} /> Báo cho nhân viên khi có đơn hàng cần xử lý</label>
                <label className="settings-inline-check"><input type="checkbox" checked={Boolean(form.notifications?.webhooks)} onChange={(event) => setGroupValue('notifications', 'webhooks', event.target.checked)} /> Bật webhook sự kiện đơn hàng</label>
              </section>
              <section className="admin-panel settings-section-card">
                <h3>Thông báo đơn hàng hiện tại</h3>
                <div className="settings-event-list">
                  {openOrders.length ? openOrders.map((order) => <p key={order.id}><ShoppingCart size={16} /><span>{order.id} - {order.customer} - {money(order.total)} - {order.delivery}</span></p>) : <p><CheckCircle2 size={16} /><span>Không có đơn hàng mới cần xử lý.</span></p>}
                </div>
              </section>
            </>
          )}
          <div className="settings-save"><button className="admin-primary" type="submit">Lưu cài đặt</button></div>
        </div>
      </form>
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

function generateProductSku(category, products, currentId, afterSku = '') {
  const prefix = skuPrefix(category)
  const used = new Set(products.filter((product) => product.id !== currentId).map((product) => product.sku))
  const afterNumber = afterSku.startsWith(`${prefix}-`) ? Number(afterSku.slice(prefix.length + 1)) : 0
  const maxNumber = products.reduce((highest, product) => {
    if (product.id === currentId || !product.sku?.startsWith(`${prefix}-`)) return highest
    const value = Number(product.sku.slice(prefix.length + 1))
    return Number.isFinite(value) ? Math.max(highest, value) : highest
  }, 1029)
  let number = Math.max(maxNumber, Number.isFinite(afterNumber) ? afterNumber : 0) + 1
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
    name: '', slug: '', parentId: '', description: '', image: '',
    active: true, showOnHome: false, includeInMenu: false,
    displayOrder: 100, homeDisplayOrder: 100,
    metaTitle: '', metaDescription: '',
  })
  const [slugLocked, setSlugLocked] = useState(Boolean(category?.slug))
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(category?.image || '')

  const change = (event) => {
    const { checked, name, type, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' && !slugLocked ? { slug: slugify(value) } : {}),
    }))
  }
  const chooseImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImageFile(file)
    imageFilePreview(file, setImagePreview)
  }
  const submit = (event) => {
    event.preventDefault()
    onSubmit({ ...form, parentId: form.parentId ? Number(form.parentId) : null, displayOrder: Number(form.displayOrder), imageFile: imageFile || null })
  }

  return (
    <Modal title={category ? 'Sửa danh mục' : 'Thêm danh mục mới'} onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        <label><span>Tên danh mục *</span><input required name="name" value={form.name} onChange={change} placeholder="Ví dụ: Fresh Produce" /></label>
        <div>
          <label>
            <span>Slug *</span>
            <div className="slug-field">
              <input required name="slug" value={form.slug} onChange={change} placeholder="fresh-produce" disabled={!slugLocked} />
              <button type="button" className={`slug-lock-btn ${slugLocked ? 'unlocked' : 'locked'}`} onClick={() => setSlugLocked(!slugLocked)} title={slugLocked ? 'Khóa lại' : 'Mở khóa để sửa'}>
                {slugLocked ? <Eye size={14} /> : <ShieldCheck size={14} />}
              </button>
            </div>
          </label>
          <label><span>Danh mục cha</span><select name="parentId" value={form.parentId || ''} onChange={change}><option value="">{editingRoot ? 'Danh mục gốc' : 'Chọn danh mục gốc'}</option>{rootCategories.filter((item) => item.id !== category?.id).map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
        </div>
        <label><span>Mô tả</span><input name="description" value={form.description || ''} onChange={change} placeholder="Mô tả ngắn cho danh mục" /></label>
        <label className="product-upload-field">
          <span>Ảnh danh mục</span>
          <div className="product-image-picker category-image-picker">
            {imagePreview ? <img src={imagePreview} alt="" /> : <div className="image-placeholder"><Upload size={20} /></div>}
            <div><Upload size={18} /><b>{imageFile ? imageFile.name : (imagePreview ? 'Đổi ảnh' : 'Chọn ảnh')}</b><small>JPG, PNG hoặc WebP</small></div>
            <input accept="image/*" type="file" onChange={chooseImage} />
          </div>
        </label>
        <div>
          <label><span>Thứ tự Menu</span><input required min="0" type="number" name="displayOrder" value={form.displayOrder} onChange={change} /></label>
          <label><span>Thứ tự Homepage</span><input required min="0" type="number" name="homeDisplayOrder" value={form.homeDisplayOrder ?? form.displayOrder} onChange={change} /></label>
        </div>
        <div className="modal-check-grid">
          <label><input type="checkbox" name="active" checked={form.active} onChange={change} /><span>Đang hoạt động</span></label>
          <label><input type="checkbox" name="showOnHome" checked={form.showOnHome} onChange={change} /><span>Hiện homepage</span></label>
          <label><input type="checkbox" name="includeInMenu" checked={form.includeInMenu} onChange={change} /><span>Hiện mega menu</span></label>
        </div>
        <p className="form-section-head">SEO</p>
        <label>
          <span>Meta Title</span>
          <input name="metaTitle" value={form.metaTitle || ''} onChange={change} placeholder={form.name || 'Tiêu đề SEO'} maxLength={60} />
          <small className="char-count">{(form.metaTitle || '').length}/60</small>
        </label>
        <label>
          <span>Meta Description</span>
          <textarea name="metaDescription" value={form.metaDescription || ''} onChange={change} placeholder="Mô tả ngắn hiển thị trên Google (150–160 ký tự)" maxLength={160} rows={2} />
          <small className="char-count">{(form.metaDescription || '').length}/160</small>
        </label>
        <div className="modal-actions"><button className="admin-secondary" type="button" onClick={onClose}>Hủy</button><button className="admin-primary" type="submit">{category ? 'Lưu thay đổi' : 'Thêm danh mục'}</button></div>
      </form>
    </Modal>
  )
}

function blankProductOption() {
  return { name: '', values: '' }
}

function blankProductVariant(product = {}, index = 1) {
  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${index}`,
    label: '',
    sku: product.sku ? `${product.sku}-${index}` : '',
    price: product.price || '',
    oldPrice: product.oldPrice || '',
    stock: product.stock || '',
    unit: product.unit || '',
    image: product.image || '',
  }
}

function parseProductDescriptionFields(description = '') {
  const lines = String(description).split(/\r?\n/).map((line) => line.trim()).filter(Boolean)

  if (lines.length <= 1) return { title: '', body: lines[0] || '' }

  return {
    title: lines[0],
    body: lines.slice(1).join('\n'),
  }
}

function buildProductDescription(title, body) {
  return [title, body].map((value) => value.trim()).filter(Boolean).join('\n')
}

function imageFilePreview(file, callback) {
  const reader = new FileReader()
  reader.onload = () => callback(reader.result)
  reader.readAsDataURL(file)
}

function CategoryTreeSelect({ categories, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const rootCategories = categories.filter((c) => !c.parentId)
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  return (
    <div className="category-tree-select" ref={ref}>
      <button type="button" className="tree-select-btn" onClick={() => setOpen(!open)}>
        <span>{value || 'Chọn danh mục'}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="tree-select-dropdown">
          {rootCategories.map((root) => {
            const children = categories.filter((c) => c.parentId === root.id)
            return (
              <div key={root.id}>
                <button type="button" className={`tree-item tree-root ${value === root.name ? 'selected' : ''}`} onClick={() => { onChange(root.name); setOpen(false) }}>
                  {root.name}
                </button>
                {children.map((child) => (
                  <button type="button" key={child.id} className={`tree-item tree-child ${value === child.name ? 'selected' : ''}`} onClick={() => { onChange(child.name); setOpen(false) }}>
                    └ {child.name}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ProductModal({ categories, products, product, onClose, onSubmit, copy: incomingCopy }) {
  const copy = {
    ...incomingCopy,
    create: 'Thêm sản phẩm mới',
    edit: 'Sửa sản phẩm',
    name: 'Tên sản phẩm',
    namePlaceholder: 'Ví dụ: Rau chân vịt hữu cơ',
    category: 'Danh mục',
    price: 'Giá bán',
    oldPrice: 'Giá trước giảm',
    oldPricePlaceholder: 'Để trống nếu không giảm giá',
    stock: 'Tồn kho',
    status: 'Trạng thái',
    active: 'Đang hiển thị',
    draft: 'Bản nháp',
    unit: 'Quy cách',
    unitPlaceholder: 'Ví dụ: 250g',
    badge: 'Nhãn sản phẩm',
    badgePlaceholder: 'Ví dụ: Hữu cơ',
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
  }
  const activeCategories = categories.filter((c) => c.active)
  const initialCategory = product?.category || activeCategories[0]?.name || ''
  const hasExistingVariants = product?.variants?.length > 0
  const initialDescription = parseProductDescriptionFields(product?.description)
  const [activeTab, setActiveTab] = useState('general')
  const [form, setForm] = useState(product || {
    name: '', category: initialCategory, sku: generateProductSku(initialCategory, products),
    price: '', oldPrice: '', stock: '', status: 'active', unit: '', badge: '',
    image: defaultProductImage, manufacturer: 'LyLy Market', vendor: 'LyLy Market',
    warehouse: 'Kho chính', productType: 'Thực phẩm', description: '', images: [], options: [], variants: [],
    weight: '', weightUnit: 'g', length: '', width: '', height: '',
    mfgDate: '', expDate: '', shelfLife: '', barcode: '', purchaseLimit: '',
    metaSlug: '', metaTitle: '', metaDescription: '',
  })
  const [descriptionTitle, setDescriptionTitle] = useState(initialDescription.title)
  const [descriptionBody, setDescriptionBody] = useState(initialDescription.body)
  const [productMode, setProductMode] = useState(hasExistingVariants ? 'variants' : 'single')
  const [galleryImages, setGalleryImages] = useState(product?.images?.map((url) => ({ url, preview: url, file: null })) || [])
  const [options, setOptions] = useState(product?.options?.length ? product.options.map((o) => ({ ...o, values: Array.isArray(o.values) ? o.values.join(', ') : o.values || '' })) : [blankProductOption()])
  const [variants, setVariants] = useState(product?.variants?.length ? product.variants.map((v) => ({ ...v, price: v.price ?? '', oldPrice: v.oldPrice ?? '', stock: v.stock ?? '', unit: v.unit ?? '', image: v.image ?? '', imagePreview: v.image ?? '', imageFile: null })) : [blankProductVariant(product || {}, 1)])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(form.image || defaultProductImage)
  const [slugLocked, setSlugLocked] = useState(Boolean(product?.metaSlug))
  const descRef = useRef()

  const change = (event) => {
    const { name, value } = event.target
    setForm((current) => {
      const next = { ...current, [name]: value }
      if (name === 'category') next.sku = generateProductSku(value, products, product?.id)
      if (name === 'name' && !slugLocked) next.metaSlug = slugify(value)
      return next
    })
  }
  const chooseImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImageFile(file)
    imageFilePreview(file, setImagePreview)
  }
  const addGalleryFiles = (files) => {
    Array.from(files).forEach((file) => {
      imageFilePreview(file, (preview) => setGalleryImages((cur) => [...cur, { url: '', preview, file }]))
    })
  }
  const removeGalleryImage = (index) => setGalleryImages((cur) => cur.filter((_, i) => i !== index))
  const changeOption = (index, name, value) => setOptions((cur) => cur.map((o, i) => i === index ? { ...o, [name]: value } : o))
  const changeVariant = (index, name, value) => setVariants((cur) => cur.map((v, i) => i === index ? { ...v, [name]: value } : v))
  const chooseVariantImage = (index, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    imageFilePreview(file, (preview) => setVariants((cur) => cur.map((v, i) => i === index ? { ...v, imageFile: file, imagePreview: preview } : v)))
  }
  const removeVariantImage = (index) => setVariants((cur) => cur.map((v, i) => i === index ? { ...v, image: '', imageFile: null, imagePreview: '' } : v))
  const addOption = () => setOptions((cur) => [...cur, blankProductOption()])
  const addVariant = () => setVariants((cur) => [...cur, blankProductVariant(form, cur.length + 1)])
  const removeOption = (index) => setOptions((cur) => cur.filter((_, i) => i !== index))
  const removeVariant = (index) => setVariants((cur) => cur.filter((_, i) => i !== index))
  const regenerateSku = () => setForm((cur) => ({ ...cur, sku: generateProductSku(cur.category, products, product?.id, cur.sku) }))
  const insertFormat = (before, after = '') => {
    const el = descRef.current
    if (!el) return
    const s = el.selectionStart; const e = el.selectionEnd
    setDescriptionBody(descriptionBody.slice(0, s) + before + descriptionBody.slice(s, e) + after + descriptionBody.slice(e))
  }
  const submit = (event) => {
    event.preventDefault()
    const normalizedOptions = productMode === 'variants' ? options.map((o) => ({ name: o.name.trim(), values: o.values.split(',').map((v) => v.trim()).filter(Boolean) })).filter((o) => o.name && o.values.length) : []
    const normalizedVariants = productMode === 'variants' ? variants.map((v, i) => ({ id: v.id || `${form.sku}-${i + 1}`, label: v.label.trim(), sku: v.sku.trim() || `${form.sku}-${i + 1}`, price: Number(v.price || form.price), oldPrice: v.oldPrice ? Number(v.oldPrice) : undefined, stock: Number(v.stock || 0), unit: v.unit.trim() || form.unit, image: v.image.trim() || '', imageFile: v.imageFile || null })).filter((v) => v.label && Number.isFinite(v.price)) : []
    onSubmit({ ...form, sku: ensureUniqueSku(form, products).sku, price: Number(form.price), oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined, stock: Number(form.stock), purchaseLimit: form.purchaseLimit ? Number(form.purchaseLimit) : undefined, image: form.image || imagePreview || defaultProductImage, description: buildProductDescription(descriptionTitle, descriptionBody), images: galleryImages.map((item) => item.url).filter(Boolean), imageFiles: galleryImages.map((item, index) => ({ index, file: item.file })).filter((item) => item.file), options: normalizedOptions, variants: normalizedVariants, imageFile })
  }

  return (
    <Modal wide title={product ? copy.edit : copy.create} onClose={onClose}>
      <form className="modal-form product-tabbed-form" onSubmit={submit}>
        <div className="product-modal-tabs">
          {[['general', 'Thông tin chung'], ['pricing', 'Giá và kho'], ['variants', 'Biến thể'], ['seo', 'Tối ưu tìm kiếm']].map(([id, label]) => (
            <button key={id} type="button" className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>
              {label}{id === 'variants' && productMode === 'variants' && <em>Bật</em>}
            </button>
          ))}
        </div>

        {activeTab === 'general' && (
          <div className="tab-pane">
            <label><span>{copy.name} *</span><input required name="name" value={form.name} onChange={change} placeholder={copy.namePlaceholder} /></label>
            <label>
              <span>{copy.category} *</span>
              <CategoryTreeSelect categories={activeCategories} value={form.category} onChange={(val) => change({ target: { name: 'category', value: val } })} />
            </label>
            <label><span>Tiêu đề mô tả</span><input name="descriptionTitle" value={descriptionTitle} onChange={(e) => setDescriptionTitle(e.target.value)} placeholder="Ví dụ: Kết cấu mềm mịn, hương vị tự nhiên" /></label>
            <div className="rich-editor-wrap">
              <span className="form-label">Nội dung mô tả</span>
              <div className="rich-editor-toolbar">
                <button type="button" title="In đậm" onClick={() => insertFormat('**', '**')}><b>B</b></button>
                <button type="button" title="In nghiêng" onClick={() => insertFormat('_', '_')}><i>I</i></button>
                <button type="button" title="Gạch đầu dòng" onClick={() => insertFormat('\n• ')}>• Danh sách</button>
                <button type="button" title="Tiêu đề" onClick={() => insertFormat('\n### ')}>H3</button>
              </div>
              <textarea ref={descRef} name="description" value={descriptionBody} onChange={(e) => setDescriptionBody(e.target.value)} placeholder="Nội dung mô tả chi tiết sản phẩm..." rows={6} />
            </div>
            <label className="product-upload-field">
              <span>Ảnh chính</span>
              <div className="product-image-picker">
                <img src={imagePreview || defaultProductImage} alt="" />
                <div><Upload size={21} /><b>{imageFile ? imageFile.name : copy.chooseImage}</b><small>{copy.imageHelp}</small></div>
                <input accept="image/*" type="file" onChange={chooseImage} />
              </div>
            </label>
            <div className="gallery-dropzone-wrap">
              <div className="variant-editor-head"><b>Ảnh phụ</b><small>Kéo thả hoặc bấm + để tải nhiều ảnh</small></div>
              <div className="gallery-dropzone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addGalleryFiles(e.dataTransfer.files) }}>
                {galleryImages.map((item, index) => (
                  <div className="gallery-thumb" key={index}>
                    <img src={item.preview} alt="" />
                    <button type="button" className="gallery-remove" onClick={() => removeGalleryImage(index)}><X size={12} /></button>
                  </div>
                ))}
                <label className="gallery-add-slot">
                  <Plus size={20} /><small>Thêm ảnh</small>
                  <input accept="image/*" type="file" multiple onChange={(e) => addGalleryFiles(e.target.files)} />
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="tab-pane pricing-tab-pane">
            <section className="product-form-section">
              <div className="product-form-section-head">
                <h3>Giá bán & Tồn kho</h3>
                <p>Thiết lập giá mặc định, tồn kho, SKU và giới hạn mua cho sản phẩm.</p>
              </div>
              <div className="product-section-grid">
                <label><span>{copy.price}{productMode === 'single' ? ' *' : ' (mặc định)'}</span><input min="0" step=".01" type="number" name="price" value={form.price} onChange={change} placeholder="0.00" required={productMode === 'single'} disabled={productMode === 'variants'} /></label>
                <label><span>{copy.oldPrice}</span><input min="0" step=".01" type="number" name="oldPrice" value={form.oldPrice || ''} onChange={change} placeholder={copy.oldPricePlaceholder} disabled={productMode === 'variants'} /></label>
                <label><span>{copy.stock}{productMode === 'single' ? ' *' : ' (mặc định)'}</span><input min="0" type="number" name="stock" value={form.stock} onChange={change} placeholder="0" required={productMode === 'single'} disabled={productMode === 'variants'} /></label>
                <label><span>{copy.status}</span><select name="status" value={form.status} onChange={change}><option value="active">{copy.active}</option><option value="draft">{copy.draft}</option></select></label>
                <label><span>{copy.unit} *</span><input required name="unit" value={form.unit} onChange={change} placeholder={copy.unitPlaceholder} /></label>
                <label><span>{copy.badge}</span><input name="badge" value={form.badge || ''} onChange={change} placeholder={copy.badgePlaceholder} /></label>
                <div className="sku-field"><span>SKU</span><div><strong>{form.sku}</strong><button type="button" onClick={regenerateSku}>{copy.regenerate}</button></div></div>
                <label><span>Mã vạch (EAN/UPC)</span><input name="barcode" value={form.barcode || ''} onChange={change} placeholder="0123456789012" /></label>
                <label className="section-wide"><span>Giới hạn mua tối đa / đơn</span><input min="1" type="number" name="purchaseLimit" value={form.purchaseLimit || ''} onChange={change} placeholder="Không giới hạn" /></label>
              </div>
            </section>

            <section className="product-form-section">
              <div className="product-form-section-head">
                <h3>Thông tin vận chuyển</h3>
                <p>Dữ liệu này giúp tính phí giao hàng và đóng gói chính xác hơn.</p>
              </div>
              <div className="product-section-grid shipping-dimensions-grid">
                <label><span>Khối lượng</span>
                  <div className="weight-input">
                    <input type="number" min="0" step=".01" name="weight" value={form.weight || ''} onChange={change} placeholder="0" />
                    <select name="weightUnit" value={form.weightUnit || 'g'} onChange={change}><option value="g">g</option><option value="kg">kg</option></select>
                  </div>
                </label>
                <label><span>Dài (cm)</span><input type="number" min="0" step=".1" name="length" value={form.length || ''} onChange={change} placeholder="0" /></label>
                <label><span>Rộng (cm)</span><input type="number" min="0" step=".1" name="width" value={form.width || ''} onChange={change} placeholder="0" /></label>
                <label><span>Cao (cm)</span><input type="number" min="0" step=".1" name="height" value={form.height || ''} onChange={change} placeholder="0" /></label>
              </div>
            </section>

            <section className="product-form-section">
              <div className="product-form-section-head">
                <h3>Hạn sử dụng & Nhà cung cấp</h3>
                <p>Quản lý thông tin nguồn hàng, kho và hạn sử dụng của sản phẩm.</p>
              </div>
              <div className="product-section-grid">
                <label><span>Ngày sản xuất (MFG)</span><input type="date" name="mfgDate" value={form.mfgDate || ''} onChange={change} /></label>
                <label><span>Hạn sử dụng (EXP)</span><input type="date" name="expDate" value={form.expDate || ''} onChange={change} /></label>
                <label className="section-wide"><span>Thời hạn sử dụng (ngày kể từ SX)</span><input type="number" min="0" name="shelfLife" value={form.shelfLife || ''} onChange={change} placeholder="Ví dụ: 365" /></label>
                <label><span>{copy.manufacturer} *</span><input required name="manufacturer" value={form.manufacturer} onChange={change} /></label>
                <label><span>{copy.vendor} *</span><input required name="vendor" value={form.vendor} onChange={change} /></label>
                <label><span>{copy.warehouse} *</span><input required name="warehouse" value={form.warehouse} onChange={change} /></label>
                <label><span>{copy.productType} *</span><input required name="productType" value={form.productType} onChange={change} /></label>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'variants' && (
          <div className="tab-pane">
            <label className="product-mode-select">
              <span>Kiểu sản phẩm</span>
              <select value={productMode} onChange={(event) => setProductMode(event.target.value)}>
                <option value="single">Sản phẩm đơn</option>
                <option value="variants">Có nhiều lựa chọn / biến thể</option>
              </select>
              <small>{productMode === 'single' ? 'Dùng khi sản phẩm chỉ có một giá, một SKU và một tồn kho.' : 'Dùng khi sản phẩm có nhiều lựa chọn như kích thước, màu sắc, khối lượng.'}</small>
            </label>
            {productMode === 'single' && (
              <section className="single-product-editor">
                <div className="variant-editor-head">
                  <b>Thông tin bán hàng cho sản phẩm đơn</b>
                  <small>Nhập thông tin chính cho một phiên bản duy nhất.</small>
                </div>
                <div>
                  <label><span>{copy.price} *</span><input min="0" step=".01" type="number" name="price" value={form.price} onChange={change} placeholder="0.00" required /></label>
                  <label><span>{copy.oldPrice}</span><input min="0" step=".01" type="number" name="oldPrice" value={form.oldPrice || ''} onChange={change} placeholder={copy.oldPricePlaceholder} /></label>
                </div>
                <div>
                  <label><span>{copy.stock} *</span><input min="0" type="number" name="stock" value={form.stock} onChange={change} placeholder="0" required /></label>
                  <label><span>{copy.unit} *</span><input required name="unit" value={form.unit} onChange={change} placeholder={copy.unitPlaceholder} /></label>
                </div>
                <div>
                  <div className="sku-field"><span>SKU</span><div><strong>{form.sku}</strong><button type="button" onClick={regenerateSku}>{copy.regenerate}</button></div></div>
                  <label><span>{copy.status}</span><select name="status" value={form.status} onChange={change}><option value="active">{copy.active}</option><option value="draft">{copy.draft}</option></select></label>
                </div>
              </section>
            )}
            {productMode === 'variants' && (
              <section className="variant-editor">
                <div className="variant-editor-head"><b>Tùy chọn</b><button type="button" onClick={addOption}><Plus size={13} /> Thêm tùy chọn</button></div>
                {options.map((option, index) => (
                  <div className="variant-row" key={index}>
                    <label><span>Tên tùy chọn</span><input value={option.name} onChange={(e) => changeOption(index, 'name', e.target.value)} placeholder="Ví dụ: Kích thước" /></label>
                    <label><span>Giá trị (phân cách bởi dấu phẩy)</span><input value={option.values} onChange={(e) => changeOption(index, 'values', e.target.value)} placeholder="250g, 500g, 1kg" /></label>
                    <button type="button" onClick={() => removeOption(index)}><Trash2 size={13} /></button>
                  </div>
                ))}
                <div className="variant-editor-head"><b>Biến thể bán hàng</b><button type="button" onClick={addVariant}><Plus size={13} /> Thêm biến thể</button></div>
                {variants.map((variant, index) => (
                  <div className="variant-card" key={variant.id || index}>
                    <label><span>Tên hiển thị *</span><input required name={`variants[${index}][label]`} value={variant.label} onChange={(e) => changeVariant(index, 'label', e.target.value)} placeholder="500g / Đỏ" /></label>
                    <div>
                      <label><span>SKU</span><input name={`variants[${index}][sku]`} value={variant.sku} onChange={(e) => changeVariant(index, 'sku', e.target.value)} /></label>
                      <label><span>Quy cách</span><input name={`variants[${index}][unit]`} value={variant.unit} onChange={(e) => changeVariant(index, 'unit', e.target.value)} placeholder={form.unit || '500g'} /></label>
                    </div>
                    <div>
                      <label><span>Giá *</span><input required min="0" step=".01" type="number" name={`variants[${index}][price]`} value={variant.price} onChange={(e) => changeVariant(index, 'price', e.target.value)} /></label>
                      <label><span>Tồn kho *</span><input required min="0" type="number" name={`variants[${index}][stock]`} value={variant.stock} onChange={(e) => changeVariant(index, 'stock', e.target.value)} /></label>
                    </div>
                    <label className="variant-image-upload">
                      <span>Ảnh biến thể</span>
                      <div>
                        <img src={variant.imagePreview || imagePreview || defaultProductImage} alt="" />
                        <strong>{variant.imageFile?.name || (variant.imagePreview ? 'Đổi ảnh biến thể' : 'Chọn ảnh biến thể')}</strong>
                        <small>Để trống sẽ dùng ảnh chính</small>
                        {variant.imagePreview && <button type="button" onClick={(e) => { e.preventDefault(); removeVariantImage(index) }}>Xóa ảnh</button>}
                        <input accept="image/*" type="file" onChange={(e) => chooseVariantImage(index, e)} />
                      </div>
                    </label>
                    <button className="variant-remove" type="button" onClick={() => removeVariant(index)}>Xóa biến thể</button>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="tab-pane">
            <div className="seo-preview-card">
              <div className="seo-preview-url">lyly-storefront.vercel.app/products/{form.metaSlug || slugify(form.name) || 'ten-san-pham'}</div>
              <div className="seo-preview-title">{form.metaTitle || form.name || 'Tiêu đề sản phẩm'}</div>
              <div className="seo-preview-desc">{form.metaDescription || descriptionBody.slice(0, 120) || 'Mô tả ngắn hiển thị trên kết quả tìm kiếm Google...'}</div>
            </div>
            <label>
              <span>Đường dẫn (Slug)</span>
              <div className="slug-field">
                <input name="metaSlug" value={form.metaSlug || slugify(form.name)} onChange={change} disabled={!slugLocked} placeholder="ten-san-pham" />
                <button type="button" className={`slug-lock-btn ${slugLocked ? 'unlocked' : 'locked'}`} onClick={() => setSlugLocked(!slugLocked)} title={slugLocked ? 'Khóa lại' : 'Mở khóa để sửa'}>
                  {slugLocked ? <Eye size={14} /> : <ShieldCheck size={14} />}
                </button>
              </div>
              <small className="field-hint">Tự động sinh từ tên. Bấm 🔓 để sửa tay.</small>
            </label>
            <label>
              <span>Tiêu đề SEO</span>
              <input name="metaTitle" value={form.metaTitle || ''} onChange={change} placeholder={form.name || 'Tiêu đề SEO (tối đa 60 ký tự)'} maxLength={60} />
              <small className="char-count">{(form.metaTitle || '').length}/60</small>
            </label>
            <label>
              <span>Mô tả SEO</span>
              <textarea name="metaDescription" value={form.metaDescription || ''} onChange={change} placeholder="Mô tả ngắn hiển thị dưới tiêu đề trên Google (150–160 ký tự)" maxLength={160} rows={3} />
              <small className="char-count">{(form.metaDescription || '').length}/160</small>
            </label>
          </div>
        )}

        <div className="modal-actions"><button className="admin-secondary" type="button" onClick={onClose}>{copy.cancel}</button><button className="admin-primary" type="submit">{product ? copy.save : copy.add}</button></div>
      </form>
    </Modal>
  )
}

// eslint-disable-next-line no-unused-vars
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

function BulkProductEditor({ categories, products, onClose, onSubmit }) {
  const [rows, setRows] = useState(products.map((product) => ({
    ...product,
    price: String(product.price ?? ''),
    stock: String(product.stock ?? ''),
    variants: (product.variants || []).map((variant, index) => ({
      ...variant,
      _bulkKey: variant.id || `${product.id}-variant-${index}`,
      price: String(variant.price ?? product.price ?? ''),
      stock: String(variant.stock ?? ''),
    })),
  })))
  const activeCategories = categories.filter((category) => category.active)
  const changeProduct = (id, name, value) => setRows((current) => current.map((product) => product.id === id ? { ...product, [name]: value } : product))
  const changeVariant = (productId, variantId, name, value) => setRows((current) => current.map((product) => (
    product.id === productId
      ? { ...product, variants: product.variants.map((variant) => variant._bulkKey === variantId ? { ...variant, [name]: value } : variant) }
      : product
  )))
  const submit = (event) => {
    event.preventDefault()
    onSubmit(rows.map((product) => ({
      ...product,
      price: Number(product.price || 0),
      stock: Number(product.stock || 0),
      variants: product.variants.map((variant) => {
        const variantFields = { ...variant }
        delete variantFields._bulkKey
        return {
          ...variantFields,
          price: Number(variant.price || product.price || 0),
          stock: Number(variant.stock || 0),
        }
      }),
    })))
  }

  return (
    <div className="modal-overlay bulk-editor-overlay">
      <form className="bulk-editor" onSubmit={submit}>
        <header className="bulk-editor-head">
          <button className="admin-secondary" type="button" onClick={onClose}><ChevronLeft size={16} /> Quay lại</button>
          <strong>Đang sửa {rows.length} sản phẩm</strong>
          <button className="admin-primary" type="submit">Lưu</button>
        </header>
        <div className="bulk-editor-table-wrap">
          <table className="bulk-editor-table">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Trạng thái</th>
                <th>Danh mục</th>
                <th>Nhà cung cấp</th>
                <th>Giá (đ)</th>
                <th>Tồn kho</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((product) => (
                <Fragment key={product.id}>
                  <tr>
                    <td>
                      <div className="bulk-product-name">
                        <img src={product.image} alt="" />
                        <input value={product.name} onChange={(event) => changeProduct(product.id, 'name', event.target.value)} />
                      </div>
                    </td>
                    <td><select value={product.status} onChange={(event) => changeProduct(product.id, 'status', event.target.value)}><option value="active">Đang hoạt động</option><option value="draft">Bản nháp</option></select></td>
                    <td><select value={product.category} onChange={(event) => changeProduct(product.id, 'category', event.target.value)}>{activeCategories.map((category) => <option key={category.id}>{category.name}</option>)}</select></td>
                    <td><input value={product.vendor || ''} onChange={(event) => changeProduct(product.id, 'vendor', event.target.value)} /></td>
                    <td><input min="0" step=".01" type="number" value={product.price} disabled={product.variants?.length > 0} onChange={(event) => changeProduct(product.id, 'price', event.target.value)} /></td>
                    <td><input min="0" type="number" value={product.stock} disabled={product.variants?.length > 0} onChange={(event) => changeProduct(product.id, 'stock', event.target.value)} /></td>
                  </tr>
                  {product.variants.map((variant) => (
                    <tr className="bulk-variant-row" key={variant._bulkKey}>
                      <td><span className="bulk-variant-label">↳ {variant.label || variant.unit || product.unit}</span></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><input min="0" step=".01" type="number" value={variant.price} onChange={(event) => changeVariant(product.id, variant._bulkKey, 'price', event.target.value)} /></td>
                      <td><input min="0" type="number" value={variant.stock} onChange={(event) => changeVariant(product.id, variant._bulkKey, 'stock', event.target.value)} /></td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
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

const discountTypeOptions = [
  { id: 'product', title: 'Số tiền giảm cho sản phẩm', description: 'Giảm giá sản phẩm hoặc bộ sưu tập cụ thể', icon: Tag },
  { id: 'buy_x_get_y', title: 'Mua X nhận Y', description: 'Ưu đãi theo số lượng sản phẩm trong giỏ', icon: BadgePercent },
  { id: 'order', title: 'Số tiền giảm cho đơn hàng', description: 'Giảm tổng số tiền đơn hàng', icon: ShoppingBag },
  { id: 'shipping', title: 'Vận chuyển miễn phí', description: 'Cung cấp vận chuyển miễn phí cho đơn hàng', icon: Truck },
]

function generateDiscountCode() {
  return `LYLY${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

function DiscountBuilderModal({ discount, onClose, onSubmit }) {
  const [selectedType, setSelectedType] = useState(discount?.discountType || '')
  const [form, setForm] = useState({
    method: discount?.method || 'code',
    code: discount?.code || '',
    title: discount?.title || '',
    valueType: discount?.valueType || 'percentage',
    valueAmount: discount?.valueAmount ?? '',
    appliesToType: discount?.appliesTo?.type || 'all',
    appliesToSearch: discount?.appliesTo?.query || '',
    minimumType: discount?.minimumType || 'none',
    minimumValue: discount?.minimumValue || '',
    usageLimitEnabled: Boolean(discount?.usageLimit),
    usageLimit: discount?.usageLimit || '',
    oncePerCustomer: Boolean(discount?.oncePerCustomer),
    combinesProduct: Boolean(discount?.combines?.product),
    combinesOrder: Boolean(discount?.combines?.order),
    combinesShipping: Boolean(discount?.combines?.shipping),
    startsAt: discount?.startsAt ? new Date(discount.startsAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    endsEnabled: Boolean(discount?.endsAt),
    endsAt: discount?.endsAt ? new Date(discount.endsAt).toISOString().slice(0, 10) : '',
    active: discount?.active ?? true,
  })
  const selected = discountTypeOptions.find((item) => item.id === selectedType)
  const change = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }
  const submit = (event) => {
    event.preventDefault()
    onSubmit({
      id: discount?.id,
      code: form.method === 'code' ? form.code.trim().toUpperCase() : '',
      title: form.method === 'automatic' ? form.title.trim() : form.code.trim().toUpperCase(),
      method: form.method,
      discountType: selectedType,
      valueType: selectedType === 'shipping' ? 'free' : form.valueType,
      valueAmount: selectedType === 'shipping' || form.valueType === 'free' ? 0 : Number(form.valueAmount),
      appliesTo: { type: form.appliesToType, query: form.appliesToSearch.trim() },
      minimumType: form.minimumType,
      minimumValue: form.minimumType === 'none' ? 0 : Number(form.minimumValue || 0),
      usageLimit: form.usageLimitEnabled ? Number(form.usageLimit || 0) : null,
      oncePerCustomer: form.oncePerCustomer,
      combines: { product: form.combinesProduct, order: form.combinesOrder, shipping: form.combinesShipping },
      startsAt: form.startsAt ? new Date(`${form.startsAt}T00:00:00`).toISOString() : new Date().toISOString(),
      endsAt: form.endsEnabled && form.endsAt ? new Date(`${form.endsAt}T23:59:59`).toISOString() : null,
      active: form.active,
    })
  }

  if (!selectedType) {
    return (
      <Modal title="Chọn loại giảm giá" onClose={onClose}>
        <div className="discount-type-list">
          {discountTypeOptions.map((option) => {
            const Icon = option.icon
            return (
              <button type="button" onClick={() => setSelectedType(option.id)} key={option.id}>
                <Icon size={18} />
                <span><b>{option.title}</b><small>{option.description}</small></span>
                <ChevronRight size={18} />
              </button>
            )
          })}
        </div>
        <div className="modal-actions discount-type-actions"><button className="admin-secondary" type="button" onClick={onClose}>Hủy</button></div>
      </Modal>
    )
  }

  return (
    <Modal wide title={`Tạo giảm giá - ${selected.title}`} onClose={onClose}>
      <form className="modal-form discount-form" onSubmit={submit}>
        <section>
          <h3>{selected.title}</h3>
          <label><span>Phương thức</span><select name="method" value={form.method} onChange={change}><option value="code">Mã giảm giá</option><option value="automatic">Giảm giá tự động</option></select></label>
          {form.method === 'code' ? (
            <label><span>Mã giảm giá</span><div className="discount-code-input"><input required name="code" value={form.code} onChange={change} placeholder="Ví dụ: SUMMER20" /><button type="button" onClick={() => setForm((current) => ({ ...current, code: generateDiscountCode() }))}>Tạo mã</button></div></label>
          ) : (
            <label><span>Tiêu đề</span><input required name="title" value={form.title} onChange={change} placeholder="Khách hàng sẽ thấy mục này trong giỏ hàng" /></label>
          )}
        </section>
        {selectedType !== 'shipping' && (
          <section>
            <h3>Giá trị giảm giá</h3>
            <div><label><span>Loại giá trị</span><select name="valueType" value={form.valueType} onChange={change}><option value="percentage">Phần trăm</option><option value="fixed">Số tiền cố định</option>{selectedType === 'buy_x_get_y' && <option value="free">Miễn phí</option>}</select></label><label><span>Giá trị</span><input required={form.valueType !== 'free'} disabled={form.valueType === 'free'} min="0" max={form.valueType === 'percentage' ? 100 : undefined} step=".01" type="number" name="valueAmount" value={form.valueAmount} onChange={change} /></label></div>
            {(selectedType === 'product' || selectedType === 'buy_x_get_y') && (
              <>
                <label><span>Áp dụng cho</span><select name="appliesToType" value={form.appliesToType} onChange={change}><option value="all">Tất cả sản phẩm</option><option value="collection">Bộ sưu tập cụ thể</option><option value="product">Sản phẩm cụ thể</option></select></label>
                <label><span>Tìm kiếm áp dụng</span><input name="appliesToSearch" value={form.appliesToSearch} onChange={change} placeholder="Nhập tên sản phẩm hoặc danh mục" /></label>
              </>
            )}
          </section>
        )}
        {selectedType === 'buy_x_get_y' && <p className="modal-note">Ưu đãi Mua X nhận Y sẽ đồng bộ ra storefront theo điều kiện số lượng tối thiểu và mức giảm đã nhập.</p>}
        <section>
          <h3>Yêu cầu mua tối thiểu</h3>
          <div className="discount-radio-list">
            <label><input type="radio" name="minimumType" value="none" checked={form.minimumType === 'none'} onChange={change} /> Không có yêu cầu tối thiểu</label>
            <label><input type="radio" name="minimumType" value="amount" checked={form.minimumType === 'amount'} onChange={change} /> Số tiền mua tối thiểu</label>
            <label><input type="radio" name="minimumType" value="quantity" checked={form.minimumType === 'quantity'} onChange={change} /> Số lượng mặt hàng tối thiểu</label>
          </div>
          {form.minimumType !== 'none' && <label><span>Giá trị tối thiểu</span><input required min="0" step=".01" type="number" name="minimumValue" value={form.minimumValue} onChange={change} /></label>}
        </section>
        <section>
          <h3>Giới hạn và kết hợp</h3>
          <label className="discount-check"><input type="checkbox" name="usageLimitEnabled" checked={form.usageLimitEnabled} onChange={change} /> Giới hạn tổng số lần sử dụng</label>
          {form.usageLimitEnabled && <label><span>Số lần sử dụng</span><input required min="1" type="number" name="usageLimit" value={form.usageLimit} onChange={change} /></label>}
          <label className="discount-check"><input type="checkbox" name="oncePerCustomer" checked={form.oncePerCustomer} onChange={change} /> Giới hạn mỗi khách hàng một lần</label>
          <div className="modal-check-grid">
            <label><input type="checkbox" name="combinesProduct" checked={form.combinesProduct} onChange={change} /><span>Giảm giá sản phẩm</span></label>
            <label><input type="checkbox" name="combinesOrder" checked={form.combinesOrder} onChange={change} /><span>Giảm giá đơn hàng</span></label>
            <label><input type="checkbox" name="combinesShipping" checked={form.combinesShipping} onChange={change} /><span>Giảm phí vận chuyển</span></label>
          </div>
        </section>
        <section>
          <h3>Ngày hoạt động</h3>
          <div><label><span>Ngày bắt đầu</span><input required type="date" name="startsAt" value={form.startsAt} onChange={change} /></label><label><span>Ngày kết thúc</span><input disabled={!form.endsEnabled} type="date" name="endsAt" value={form.endsAt} onChange={change} /></label></div>
          <label className="discount-check"><input type="checkbox" name="endsEnabled" checked={form.endsEnabled} onChange={change} /> Thiết lập ngày kết thúc</label>
        </section>
        <div className="modal-actions"><button className="admin-secondary" type="button" onClick={() => setSelectedType('')}>Quay lại</button><button className="admin-primary" type="submit">Lưu giảm giá</button></div>
      </form>
    </Modal>
  )
}

function DiscountDetailModal({ discount, onClose, onEdit, onRemove }) {
  const rows = [
    ['Mã/Tiêu đề', discount.code || discount.title],
    ['Loại', discount.type],
    ['Giá trị', discount.value],
    ['Trạng thái', discount.status],
    ['Phương thức', discount.method === 'automatic' ? 'Tự động' : 'Mã giảm giá'],
    ['Yêu cầu tối thiểu', discount.minimumType === 'amount' ? `Tối thiểu ${money(discount.minimumValue)}` : discount.minimumType === 'quantity' ? `Tối thiểu ${discount.minimumValue} sản phẩm` : 'Không có'],
    ['Áp dụng cho', discount.appliesTo?.query || 'Tất cả'],
    ['Giới hạn sử dụng', discount.usageLimit || 'Không giới hạn'],
    ['Mỗi khách hàng một lần', discount.oncePerCustomer ? 'Có' : 'Không'],
    ['Bắt đầu', discount.startsAt ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(discount.startsAt)) : 'Ngay bây giờ'],
    ['Kết thúc', discount.ends],
  ]

  return (
    <Modal title="Chi tiết mã giảm giá" onClose={onClose}>
      <div className="discount-detail">
        {rows.map(([label, value]) => <p key={label}><span>{label}</span><b>{value}</b></p>)}
      </div>
      <div className="modal-actions discount-type-actions">
        <button className="admin-secondary" type="button" onClick={onClose}>Đóng</button>
        <button className="admin-secondary" type="button" onClick={() => onEdit(discount)}><Pencil size={14} /> Sửa</button>
        <button className="product-danger" type="button" onClick={() => onRemove(discount.id)}><Trash2 size={14} /> Xóa</button>
      </div>
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
  const [adminCustomers, setAdminCustomers] = useState(customers)
  const [adminArticles, setAdminArticles] = useState(articles)
  const [storeSettings, setStoreSettings] = useState(initialStoreSettings)
  const [productModal, setProductModal] = useState(false)
  const [productEditing, setProductEditing] = useState(null)
  const [categoryModal, setCategoryModal] = useState(false)
  const [categoryEditing, setCategoryEditing] = useState(null)
  const [discountModal, setDiscountModal] = useState(false)
  const [discountEditing, setDiscountEditing] = useState(null)
  const [discountDetail, setDiscountDetail] = useState(null)
  const [customerModal, setCustomerModal] = useState(false)
  const [customerEditing, setCustomerEditing] = useState(null)
  const [customerDetail, setCustomerDetail] = useState(null)
  const [articleModal, setArticleModal] = useState(false)
  const [articleEditing, setArticleEditing] = useState(null)
  const [articleDefaultType, setArticleDefaultType] = useState('news')
  const [articleDetail, setArticleDetail] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [focusedOrderId, setFocusedOrderId] = useState('')
  const [tasks, setTasks] = useState(['name'])
  const [globalSearch, setGlobalSearch] = useState('')
  const [adminLanguage, setAdminLanguage] = useState(() => localStorage.getItem('lyly-admin-language') || 'vi')
  const [authStatus, setAuthStatus] = useState(isSupabaseConfigured ? 'loading' : 'demo')
  const [adminError, setAdminError] = useState('')
  const adminCopy = adminI18n[adminLanguage] || adminI18n.vi
  const localizedMeta = adminCopy.pageMeta

  useEffect(() => {
    const validationCopy = adminCopy.validation
    const setLocalizedValidity = (event) => {
      const field = event.target
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return
      field.setCustomValidity('')
      if (field.validity.valueMissing) field.setCustomValidity(validationCopy.required)
      else if (field.validity.typeMismatch && field.type === 'email') field.setCustomValidity(validationCopy.email)
      else if (field.validity.typeMismatch && field.type === 'url') field.setCustomValidity(validationCopy.url)
      else if (field.validity.badInput) field.setCustomValidity(validationCopy.number)
    }
    const clearLocalizedValidity = (event) => {
      const field = event.target
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
        field.setCustomValidity('')
      }
    }

    document.addEventListener('invalid', setLocalizedValidity, true)
    document.addEventListener('input', clearLocalizedValidity, true)
    document.addEventListener('change', clearLocalizedValidity, true)
    return () => {
      document.removeEventListener('invalid', setLocalizedValidity, true)
      document.removeEventListener('input', clearLocalizedValidity, true)
      document.removeEventListener('change', clearLocalizedValidity, true)
    }
  }, [adminCopy.validation])
  const safeLoad = async (loader, fallback) => {
    try {
      return await loader()
    } catch (error) {
      console.error(error)
      return fallback
    }
  }

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

  const adminNotifications = useMemo(() => {
    if (!storeSettings.notifications?.staffNotifications) return []
    return adminOrders
      .filter((order) => !['Delivered', 'Cancelled'].includes(order.delivery))
      .slice(0, 8)
      .map((order) => ({
        id: order.id,
        orderId: order.id,
        title: `Đơn hàng ${order.id} cần xử lý`,
        message: `${order.customer} · ${money(order.total)} · ${order.delivery}`,
        page: 'orders',
      }))
  }, [adminOrders, storeSettings.notifications?.staffNotifications])

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

        const [remoteProducts, remoteCategories, remoteOrders, remoteDiscounts, remoteCustomers, remoteArticles, remoteSettings] = await Promise.all([
          safeLoad(loadAdminProducts, initialProducts),
          safeLoad(loadAdminCategories, initialCategories),
          safeLoad(loadAdminOrders, initialOrders),
          safeLoad(loadAdminDiscounts, initialDiscounts),
          safeLoad(loadAdminCustomers, customers),
          safeLoad(loadAdminArticles, articles),
          safeLoad(loadStoreSettings, initialStoreSettings),
        ])
        if (!ignore) {
          setProducts(remoteProducts)
          setCategories(remoteCategories)
          setAdminOrders(remoteOrders || initialOrders)
          setDiscounts(remoteDiscounts || initialDiscounts)
          setAdminCustomers(remoteCustomers || customers)
          setAdminArticles(remoteArticles || articles)
          if (remoteSettings) setStoreSettings({ ...initialStoreSettings, ...remoteSettings })
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

  useEffect(() => {
    if (authStatus !== 'ready' || !isSupabaseConfigured) return undefined
    const timer = window.setInterval(async () => {
      const remoteOrders = await safeLoad(loadAdminOrders, null)
      if (remoteOrders) setAdminOrders(remoteOrders)
    }, 20000)
    return () => window.clearInterval(timer)
  }, [authStatus])

  const navigate = (nextPage) => {
    if (nextPage === 'online-store') {
      window.location.assign('/')
      return
    }
    window.history.pushState({}, '', nextPage === 'dashboard' ? '/admin' : `/admin/${nextPage}`)
    setPage(nextPage)
    setMenuOpen(false)
  }

  const openNotification = (item) => {
    if (item.orderId) setFocusedOrderId(item.orderId)
    navigate(item.page)
    setNotificationsOpen(false)
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
      const [remoteProducts, remoteCategories, remoteOrders, remoteDiscounts, remoteCustomers, remoteArticles, remoteSettings] = await Promise.all([
        safeLoad(loadAdminProducts, initialProducts),
        safeLoad(loadAdminCategories, initialCategories),
        safeLoad(loadAdminOrders, initialOrders),
        safeLoad(loadAdminDiscounts, initialDiscounts),
        safeLoad(loadAdminCustomers, customers),
        safeLoad(loadAdminArticles, articles),
        safeLoad(loadStoreSettings, initialStoreSettings),
      ])
      setProducts(remoteProducts)
      setCategories(remoteCategories)
      setAdminOrders(remoteOrders || initialOrders)
      setDiscounts(remoteDiscounts || initialDiscounts)
      setAdminCustomers(remoteCustomers || customers)
      setAdminArticles(remoteArticles || articles)
      if (remoteSettings) setStoreSettings({ ...initialStoreSettings, ...remoteSettings })
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
      const { imageFile, imageFiles = [], ...productFields } = ensureUniqueSku(product, products)
      const image = imageFile ? await uploadAdminProductImage(imageFile, productFields.sku) : productFields.image
      const images = [...(productFields.images || [])]

      for (const item of imageFiles) {
        images[item.index] = await uploadAdminProductImage(item.file, `${productFields.sku}-gallery-${item.index + 1}`)
      }

      const variants = []
      for (const variant of productFields.variants || []) {
        const variantFields = { ...variant }
        const variantImageFile = variantFields.imageFile
        delete variantFields.imageFile
        delete variantFields.imagePreview
        const variantImage = variantImageFile
          ? await uploadAdminProductImage(variantImageFile, variantFields.sku || `${productFields.sku}-variant`)
          : variantFields.image
        variants.push({ ...variantFields, image: variantImage || image || defaultProductImage })
      }

      const payload = {
        ...productFields,
        image: image || defaultProductImage,
        images: images.filter(Boolean).slice(0, 5),
        variants,
      }

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

  const bulkEditProducts = async (updates) => {
    setAdminError('')
    try {
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
      let categoryToSave = { ...category }
      if (category.imageFile) {
        try {
          const imageUrl = await uploadAdminProductImage(category.imageFile, `category-${slugify(category.name)}`)
          categoryToSave.image = imageUrl
        } catch { /* keep existing image if upload fails */ }
        delete categoryToSave.imageFile
      }
      if (categoryToSave.id) {
        const previous = categories.find((item) => item.id === categoryToSave.id)
        const updatedCategory = await updateAdminCategory(categoryToSave)
        setCategories((current) => current.map((item) => item.id === updatedCategory.id ? updatedCategory : item))
        if (previous?.name !== updatedCategory.name) {
          setProducts((current) => current.map((product) => product.category === previous.name ? { ...product, category: updatedCategory.name } : product))
        }
      } else {
        const createdCategory = await createAdminCategory(categoryToSave)
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

  const addDiscount = async (discount) => {
    setAdminError('')
    try {
      if (discount.id) {
        const updatedDiscount = await updateAdminDiscount(discount)
        setDiscounts((current) => current.map((item) => item.id === updatedDiscount.id ? updatedDiscount : item))
      } else {
        const createdDiscount = await createAdminDiscount(discount)
        setDiscounts((current) => [createdDiscount, ...current])
      }
      setDiscountEditing(null)
      setDiscountModal(false)
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
    }
  }

  const editDiscount = (discount) => {
    setDiscountDetail(null)
    setDiscountEditing(discount)
    setDiscountModal(true)
  }

  const removeDiscount = async (id) => {
    if (!id) return
    setAdminError('')
    try {
      await removeAdminDiscounts([id])
      setDiscounts((current) => current.filter((discount) => discount.id !== id))
      setDiscountDetail(null)
      setDiscountEditing(null)
      setDiscountModal(false)
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
    }
  }

  const saveCustomer = async (customer) => {
    setAdminError('')
    try {
      if (customer.id) {
        const updatedCustomer = await updateAdminCustomer(customer)
        setAdminCustomers((current) => current.map((item) => item.id === updatedCustomer.id ? updatedCustomer : item))
      } else {
        const createdCustomer = await createAdminCustomer(customer)
        setAdminCustomers((current) => [createdCustomer, ...current])
      }
      setCustomerEditing(null)
      setCustomerModal(false)
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
    }
  }

  const removeCustomer = async (id) => {
    if (!id) return
    setAdminError('')
    try {
      await removeAdminCustomers([id])
      setAdminCustomers((current) => current.filter((customer) => customer.id !== id))
      setCustomerDetail(null)
      setCustomerEditing(null)
      setCustomerModal(false)
    } catch (error) {
      console.error(error)
      setAdminError('Không thể xóa khách hàng đã có đơn hàng. Hãy giữ hồ sơ để bảo toàn lịch sử đơn.')
    }
  }

  const saveArticle = async (article) => {
    setAdminError('')
    try {
      const { imageFile, ...articleFields } = article
      const slug = articleFields.slug || slugify(articleFields.title)
      const image = imageFile ? await uploadAdminArticleImage(imageFile, slug) : articleFields.image
      const payload = { ...articleFields, slug, image }
      if (payload.id) {
        const updatedArticle = await updateAdminArticle(payload)
        setAdminArticles((current) => current.map((item) => item.id === updatedArticle.id ? updatedArticle : item))
      } else {
        const createdArticle = await createAdminArticle(payload)
        setAdminArticles((current) => [createdArticle, ...current])
      }
      setArticleEditing(null)
      setArticleModal(false)
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
    }
  }

  const removeArticle = async (id) => {
    if (!id) return
    setAdminError('')
    try {
      await removeAdminArticles([id])
      setAdminArticles((current) => current.filter((article) => article.id !== id))
      setArticleDetail(null)
      setArticleEditing(null)
      setArticleModal(false)
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
    }
  }

  const saveSettings = async (settings) => {
    setAdminError('')
    try {
      await saveStoreSettings(settings)
      setStoreSettings(settings)
    } catch (error) {
      console.error(error)
      setAdminError(error.message)
    }
  }

  const saveOrder = async (order) => {
    setAdminError('')
    try {
      const oldOrder = adminOrders.find(o => o.uuid === order.uuid)
      const updatedOrder = await updateAdminOrder(order)
      setAdminOrders((current) => current.map((item) => item.id === updatedOrder.id ? { ...item, ...updatedOrder } : item))
      const events = []
      if (oldOrder && oldOrder.payment !== order.payment) events.push({ actor: 'admin', eventType: 'payment_updated', message: `Thanh toán: ${oldOrder.payment} → ${order.payment}` })
      if (oldOrder && oldOrder.delivery !== order.delivery) events.push({ actor: 'admin', eventType: 'delivery_updated', message: `Giao hàng: ${oldOrder.delivery} → ${order.delivery}` })
      if (events.length > 0) logOrderEvents(order.uuid, events)
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
    if (page === 'orders') return <OrdersPage meta={localizedMeta} orders={adminOrders} focusedOrderId={focusedOrderId} onFocusedOrderHandled={() => setFocusedOrderId('')} shippingSettings={storeSettings.shipping || {}} onUpdate={saveOrder} onBulkUpdate={bulkSaveOrders} />
    if (page === 'customers') return <CustomersManagePage meta={localizedMeta} customers={adminCustomers} onCreate={() => { setCustomerEditing(null); setCustomerModal(true) }} onEdit={(customer) => { setCustomerDetail(null); setCustomerEditing(customer); setCustomerModal(true) }} onView={setCustomerDetail} onRemove={removeCustomer} />
    if (page === 'marketing') return <MarketingPage meta={localizedMeta} />
    if (page === 'discounts') return <DiscountsManagePage meta={localizedMeta} discounts={discounts} onCreate={() => { setDiscountEditing(null); setDiscountModal(true) }} onEdit={editDiscount} onView={setDiscountDetail} onRemove={removeDiscount} />
    if (page === 'content' || page === 'content-recipes' || page === 'content-blog') {
      const type = page === 'content-recipes' ? 'recipe' : page === 'content-blog' ? 'news' : 'all'
      return <ContentManagePage meta={localizedMeta[page] || localizedMeta.content} articles={adminArticles} type={type} onCreate={() => { setArticleDefaultType(type === 'recipe' ? 'recipe' : 'news'); setArticleEditing(null); setArticleModal(true) }} onEdit={(article) => { setArticleDefaultType(article.type || 'news'); setArticleDetail(null); setArticleEditing(article); setArticleModal(true) }} onView={setArticleDetail} onRemove={removeArticle} />
    }
    if (page === 'analytics') return <AnalyticsPage meta={localizedMeta} orders={adminOrders} products={products} customers={adminCustomers} />
    if (page === 'analytics-reports') return <ReportsPage meta={localizedMeta} orders={adminOrders} products={products} customers={adminCustomers} discounts={discounts} />
    if (page === 'locations') return <LocationsPage meta={localizedMeta} />
    if (page === 'settings') return <SettingsWorkspacePage meta={localizedMeta} settings={storeSettings} orders={adminOrders} onSave={saveSettings} />
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
          <button type="button" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18} />{adminNotifications.length > 0 && <i>{adminNotifications.length > 9 ? '9+' : adminNotifications.length}</i>}</button>
          {isSupabaseConfigured && <button type="button" onClick={logout} title="Đăng xuất"><LogOut size={18} /></button>}
          <button className="store-switcher" type="button"><span>LY</span><b>LyLy Market</b><ChevronDown size={14} /></button>
        </div>
        {notificationsOpen && <div className="notification-popover"><div><b>{adminCopy.notifications}</b><button type="button" onClick={() => setNotificationsOpen(false)}><X size={14} /></button></div>{adminNotifications.length ? adminNotifications.map((item) => <button className="notification-item" type="button" key={item.id} onClick={() => openNotification(item)}><ShoppingCart size={16} /><span><b>{item.title}</b><small>{item.message}</small></span></button>) : <p><CheckCircle2 size={16} /> Không có thông báo mới.</p>}</div>}
      </header>

      <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-mobile-head"><AdminLogo /><button type="button" onClick={() => setMenuOpen(false)}><X size={18} /></button></div>
        <nav>
          {navGroups.map((group, index) => (
            <div className="nav-group" key={index}>
              {group.title && <p>{adminCopy.navGroup.salesChannels}<ChevronRight size={13} /></p>}
              {group.items.map((item) => {
                const Icon = item.icon
                const parentActive = page === item.id || item.children?.some((child) => child.id === page)
                return (
                  <div className="nav-item-block" key={item.id}>
                    <button className={parentActive ? 'active' : ''} type="button" onClick={() => navigate(item.id)}><Icon size={17} /><span>{adminCopy.nav[item.id] || item.label}</span>{item.count && <em>{item.count}</em>}</button>
                    {item.children?.map((child) => <button className={`sub-nav ${page === child.id ? 'active' : ''}`} type="button" onClick={() => navigate(child.id)} key={child.id}><ChevronRight size={13} /><span>{adminCopy.nav[child.id] || child.label}</span></button>)}
                  </div>
                )
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
      {discountModal && <DiscountBuilderModal discount={discountEditing} onClose={() => { setDiscountEditing(null); setDiscountModal(false) }} onSubmit={addDiscount} />}
      {discountDetail && <DiscountDetailModal discount={discountDetail} onClose={() => setDiscountDetail(null)} onEdit={editDiscount} onRemove={removeDiscount} />}
      {customerModal && <CustomerModal customer={customerEditing} onClose={() => { setCustomerEditing(null); setCustomerModal(false) }} onSubmit={saveCustomer} />}
      {customerDetail && <CustomerDetailModal customer={customerDetail} onClose={() => setCustomerDetail(null)} onEdit={(customer) => { setCustomerDetail(null); setCustomerEditing(customer); setCustomerModal(true) }} onRemove={removeCustomer} />}
      {articleModal && <ArticleModal article={articleEditing} defaultType={articleDefaultType} onClose={() => { setArticleEditing(null); setArticleModal(false) }} onSubmit={saveArticle} />}
      {articleDetail && <ArticleDetailModal article={articleDetail} onClose={() => setArticleDetail(null)} onEdit={(article) => { setArticleDetail(null); setArticleEditing(article); setArticleModal(true) }} onRemove={removeArticle} />}
    </div>
  )
}

export default AdminApp
