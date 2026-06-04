import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  Heart,
  HelpCircle,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Minus,
  Package,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  Tag,
  Truck,
  User,
  X,
} from 'lucide-react'
import './App.css'
import { createStorefrontOrder, loadPublicArticles, loadPublicCategories, loadPublicDiscounts, loadPublicProducts, loadStoreSettings, loadStorefrontOrders, subscribeToNewsletter, submitStorefrontReturnRequest, updateStorefrontOrderAction } from './lib/storeApi'
import { isSupabaseConfigured, supabase } from './lib/supabase'

const fallbackCategories = [
  { name: 'Bread & Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=85', showOnHome: true },
  { name: 'Flour & Baking', image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=700&q=85', showOnHome: true },
  { name: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85', showOnHome: true },
  { name: 'Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=85', showOnHome: true },
  { name: 'Eggs & Butter', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=700&q=85', showOnHome: true },
  { name: 'Sauces & Marinades', image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=700&q=85', showOnHome: true },
  { name: 'Coffee', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=700&q=85', showOnHome: true },
  { name: 'Pasta & Noodles', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=85', showOnHome: true },
]

const categoryImageFallbacks = [
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=88',
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=88',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=88',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=88',
  'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=900&q=88',
  'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=88',
  'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=88',
  'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=88',
]

const categoryShuffleSeed = Math.floor(Math.random() * 0x7fffffff)

const fallbackProducts = [
  {
    id: 1,
    name: 'Artisan Sourdough Loaf',
    category: 'Bread & Bakery',
    price: 6.5,
    oldPrice: 8,
    badge: 'Sale',
    stock: 18,
    unit: '500g',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=700&q=90',
  },
  {
    id: 2,
    name: 'Organic Hass Avocados',
    category: 'Fruits & Vegetables',
    price: 5.9,
    unit: 'Pack of 3',
    badge: 'Organic',
    stock: 24,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=90',
  },
  {
    id: 3,
    name: 'Sweet Garden Strawberries',
    category: 'Fruits & Vegetables',
    price: 4.75,
    unit: '250g',
    badge: 'Fresh',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=700&q=90',
  },
  {
    id: 4,
    name: 'Farm Fresh Whole Milk',
    category: 'Dairy & Eggs',
    price: 3.25,
    unit: '1 litre',
    badge: 'Local',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=90',
  },
  {
    id: 5,
    name: 'Sun-Kissed Navel Oranges',
    category: 'Fruits & Vegetables',
    price: 4.2,
    unit: '1kg',
    badge: 'Popular',
    stock: 0,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=700&q=90',
  },
  {
    id: 6,
    name: 'Free Range Brown Eggs',
    category: 'Dairy & Eggs',
    price: 5.5,
    unit: '12 eggs',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=700&q=90',
  },
  {
    id: 7,
    name: 'Fresh Rigatoni Pasta',
    category: 'Pasta & Noodles',
    price: 4.9,
    unit: '400g',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=90',
  },
  {
    id: 8,
    name: 'Atlantic Salmon Fillet',
    category: 'Pantry',
    price: 14.5,
    unit: '350g',
    badge: 'Premium',
    stock: 6,
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=700&q=90',
  },
]

const fallbackDiscounts = [
  { code: 'FRESH20', title: 'Fresh 20', method: 'code', discountType: 'order', valueType: 'percentage', valueAmount: 20, minimumType: 'none', minimumValue: 0, status: 'Active', active: true },
  { code: 'WELCOME10', title: 'Welcome 10', method: 'code', discountType: 'order', valueType: 'percentage', valueAmount: 10, minimumType: 'none', minimumValue: 0, status: 'Active', active: true },
]

const storeLocations = [
  {
    id: 'champs',
    name: 'Champs Elysees',
    price: 5,
    ready: 'Usually ready in 2 hrs',
    address: '13 Champs-Elysees',
    city: '75008 Paris',
    hours: ['Sun: Closed', 'Mon-Fri: 9:00 - 18:00', 'Sat: 10:00 - 13:00'],
    image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=900&q=88',
  },
  {
    id: 'saint-germain',
    name: 'Saint Germain',
    price: 5,
    ready: 'Usually ready in 2 hrs',
    address: '18 Rue Saint-Germain',
    city: '75006 Paris',
    hours: ['Sun: 10:00 - 14:00', 'Mon-Fri: 8:30 - 19:00', 'Sat: 9:00 - 16:00'],
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=900&q=88',
  },
  {
    id: 'defense',
    name: 'La Defense',
    price: 0,
    ready: 'Usually ready in 24 hrs',
    address: '22 Parvis de la Defense',
    city: '92800 Puteaux',
    hours: ['Sun: Closed', 'Mon-Fri: 9:00 - 17:30', 'Sat: 10:00 - 13:00'],
    image: 'https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=900&q=88',
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    price: 0,
    ready: 'Usually ready in 24 hrs',
    address: 'Fond du Val 23',
    city: 'Maurecourt, France',
    hours: ['Sun: Closed', 'Mon-Fri: 7:00 - 16:00', 'Sat: Closed'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=88',
  },
]

const shippingMethods = [
  { id: 'local', title: 'Local Delivery', price: 0, summary: 'Same day delivery if ordered until 12:00 a.m.', detail: 'Available for addresses within our local delivery zone. Orders over $75 qualify for free local delivery.' },
  { id: 'domestic', title: 'Domestic Shipping (US)', price: 8, summary: 'Up to 2 days (price calculated at checkout)', detail: 'All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.' },
  { id: 'express', title: 'Express Easy (DHL)', price: 18, summary: 'Next day delivery (price calculated at checkout)', detail: 'Priority handling for time-sensitive orders. Express rates may vary by postal code and order weight.' },
]

const editorialArticles = [
  {
    type: 'recipe',
    slug: 'juicy-beef-sandwitch',
    title: 'Juicy Beef Sandwitch',
    date: 'June 29, 2022',
    author: 'Mindaudas Budginas',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=88',
    excerpt: 'The origin of the hamburger is unclear, though hamburger steak sandwiches have been advertised in U.S. newspapers for decades.',
    intro: 'The origin of the hamburger is unclear, though "hamburger steak sandwiches" have been advertised in U.S. newspapers from New York to Hawaii since at least the 1890s. So let us make one!',
    ingredients: ['4 Burger Buns', '2 lb ground Beef', '4 Portobello Mushroom Caps', '1 Onion, sliced thin', '1 Avocado', '3 Tbsp. Cooking Oil', '4 Tbsp. Olive Oil', '1/4 cup BBQ Sauce', '1 Tbsp. Lemon Juice', 'Salt & Pepper', 'Mozzarella'],
    tags: ['Food', 'Recipe'],
  },
  {
    type: 'recipe',
    slug: 'chicken-with-salads',
    title: 'Chicken With Salads',
    date: 'June 29, 2022',
    author: 'Mindaudas Budginas',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1400&q=88',
    excerpt: 'Chicken is sometimes cited as being more healthful than red meat, with lower concentrations of cholesterol and saturated fat.',
    intro: 'Chicken is sometimes cited as being more healthful than red meat, with lower concentrations of cholesterol and saturated fat.',
    ingredients: ['1 Big chicken', '1 Paprika', '3 Cucumbers', '1 Onion, sliced thin', '3 Tbsp. Cooking Oil', '4 Tbsp. Olive Oil', '1/4 cup Balsamic Vinegar', '1 Tbsp. Minced Garlic', '1 Tbsp. Lemon Juice', 'Salt & Pepper'],
    tags: ['Food', 'Recipe'],
  },
  {
    type: 'news',
    slug: 'top-chef-grilling-recipes',
    title: '11 Top Chef Grilling Recipes to Make This Summer',
    date: 'June 7, 2022',
    author: 'LyLy Market',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1400&q=88',
    excerpt: 'Grilling is a form of cooking that involves dry heat applied to the surface of food.',
    tags: ['Guide', 'Summer'],
  },
  {
    type: 'news',
    slug: 'healthy-high-fiber-diet',
    title: '10 Ideas for a Healthy High Fiber Diet',
    date: 'June 5, 2022',
    author: 'LyLy Market',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=88',
    excerpt: 'Dietary fiber is the portion of plant-derived food that cannot be completely broken down.',
    tags: ['Health', 'Food'],
  },
  {
    type: 'news',
    slug: 'healthy-sweets',
    title: 'Healthy Sweets?',
    date: 'June 1, 2022',
    author: 'Mindaudas Budginas',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1400&q=88',
    excerpt: 'Dessert is a course that concludes a meal. The course consists of sweet foods and beverages.',
    tags: ['Food', 'Health'],
  },
  {
    type: 'news',
    slug: 'real-italian-crust',
    title: 'Secret of Real Italian Crust',
    date: 'May 17, 2022',
    author: 'LyLy Market',
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=1400&q=88',
    excerpt: 'The bottom of the pizza, called the crust, may vary widely according to style.',
    tags: ['Food', 'Pizza'],
  },
]

const fallbackMenuItems = [
  { label: 'Shop all', href: '/products' },
  { label: 'Pantry', href: '/products?category=Pantry' },
  { label: 'Produce', href: '/products?category=Produce' },
  { label: 'Drinks', href: '/products?category=Drinks' },
  { label: 'Bakery', href: '/products?category=Bakery' },
  { label: 'Dairy & Eggs', href: '/products?category=Dairy%20%26%20Eggs' },
]

const fallbackMegaMenuGroups = [
  {
    title: 'Pantry',
    category: 'Pantry',
    items: ['All', 'Pasta & Noodles', 'Grains & Beans', 'Snacks', 'Oil, Vinegar & Spices', 'Sauces', 'Dressings'],
  },
  {
    title: 'Produce',
    category: 'Fruits & Vegetables',
    items: ['All', 'Vegetables', 'Fruit', 'Herbs & Aromatics'],
    secondary: {
      title: 'Drinks',
      category: 'Beverages',
      items: ['All', 'Coffee', 'Tea & Elixirs', 'Juices'],
    },
  },
  {
    title: 'Bakery',
    category: 'Bread & Bakery',
    items: ['All', 'Bread', 'Buns & Rolls', 'Bagels & Breakfast', 'Gluten-Free'],
  },
  {
    title: 'Dairy & Eggs',
    category: 'Dairy & Eggs',
    items: ['All', 'Milk & Cream', 'Eggs & Butter', 'Cheese', 'Yogurt & Cultured Dairy', 'Plant-Based'],
  },
]

function formatPrice(value) {
  return `$${value.toFixed(2)}`
}

function getProductDetailDescription(product, meta) {
  const fallback = `${meta.description}. Selected for dependable quality, everyday freshness, and simple meal planning.`
  const lines = String(product.description || fallback).split(/\r?\n/).map((line) => line.trim()).filter(Boolean)

  if (lines.length <= 1) return { body: lines }

  return {
    title: lines[0],
    body: lines.slice(1),
  }
}

function ProductDetailDescription({ detail }) {
  if (!detail.body.length) return null

  return (
    <div className="product-detail-description">
      {detail.title && <h2>{detail.title}</h2>}
      {detail.body.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
    </div>
  )
}

function productSlug(product) {
  return `${product.id}-${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
}

function productDetailHref(product) {
  return `/products/${productSlug(product)}`
}

function productImages(product) {
  const images = [product.image, ...(Array.isArray(product.images) ? product.images : [])].filter(Boolean)
  return [...new Set(images)]
}

function productHasVariants(product) {
  return Array.isArray(product.variants) && product.variants.length > 0
}

function getDefaultVariant(product) {
  return productHasVariants(product) ? product.variants[0] : null
}

function variantLabel(product, variant) {
  if (!variant) return product.unit
  if (variant.label) return variant.label
  const optionValues = variant.optionValues || variant.options || {}
  return Object.values(optionValues).filter(Boolean).join(' / ') || variant.unit || product.unit
}

function productSelection(product, variant = getDefaultVariant(product)) {
  return {
    productId: product.id,
    variantId: variant?.id || null,
    variantLabel: variantLabel(product, variant),
    price: Number(variant?.price ?? product.price),
    oldPrice: variant?.oldPrice ?? product.oldPrice,
    stock: Number(variant?.stock ?? product.stock),
    unit: variant?.unit || product.unit,
    image: variant?.image || product.image,
  }
}

function cartLineId(product, variant = null) {
  return `${product.id}:${variant?.id || 'single'}`
}

function catalogHref(category = '') {
  return category ? `/products?category=${encodeURIComponent(category)}` : '/products'
}

function getChildCategories(categories) {
  const childCategories = categories.filter((category) => category.parentId)
  return childCategories.length ? childCategories : categories
}

function getCategoryImage(category, index = 0) {
  return category.image || categoryImageFallbacks[index % categoryImageFallbacks.length]
}

function getCategoryShuffleRank(category) {
  return [...category.name].reduce(
    (hash, character) => Math.imul(hash ^ character.charCodeAt(0), 16777619),
    categoryShuffleSeed,
  ) >>> 0
}

function getHomepageCategories(categories) {
  return [...getChildCategories(categories)]
    .sort((a, b) => getCategoryShuffleRank(a) - getCategoryShuffleRank(b) || a.name.localeCompare(b.name))
    .slice(0, 8)
}

function buildCollectionGroups(categories) {
  const childCategories = getChildCategories(categories)
  if (!categories.some((category) => category.parentId)) {
    return [{ id: 'all-categories', name: 'All categories', children: childCategories }]
  }

  const managedGroups = categories
    .filter((category) => !category.parentId)
    .map((category) => ({
      ...category,
      children: childCategories.filter((child) => child.parentId === category.id),
    }))
    .filter((category) => category.children.length)

  return managedGroups.length
    ? managedGroups
    : [{ id: 'all-categories', name: 'All categories', children: childCategories }]
}

function buildMegaMenuGroups(categories) {
  const roots = categories.filter((category) => category.includeInMenu && !category.parentId)
  if (!roots.length) return fallbackMegaMenuGroups
  const drinks = roots.find((category) => category.name === 'Drinks')

  return roots.filter((root) => root !== drinks).map((root) => {
    const children = categories.filter((category) => category.parentId === root.id)
    const secondary = root.name === 'Produce' && drinks
      ? drinks
      : children.find((category) => category.includeInMenu)
    return {
      title: root.name,
      category: root.name,
      items: [{ label: 'All', category: root.name }, ...children.filter((category) => category !== secondary).map((category) => ({ label: category.name, category: category.name }))],
      secondary: secondary ? {
        title: secondary.name,
        category: secondary.name,
        items: [{ label: 'All', category: secondary.name }, ...categories.filter((category) => category.parentId === secondary.id).map((category) => ({ label: category.name, category: category.name }))],
      } : undefined,
    }
  })
}

function categoryIncludesProduct(categoryName, productCategory, categories) {
  if (categoryName === productCategory) return true

  const categoriesById = new Map(categories.map((category) => [category.id, category]))
  let current = categories.find((category) => category.name === productCategory)
  while (current?.parentId) {
    current = categoriesById.get(current.parentId)
    if (current?.name === categoryName) return true
  }
  return false
}

function Logo() {
  return (
    <a className="logo" href="/" aria-label="LyLy home">
      <span>LyLy</span>
      <small>FRESH MARKET</small>
    </a>
  )
}

function ProductCard({ product, onAdd, copy = storefrontI18n.en }) {
  const [liked, setLiked] = useState(false)
  const selected = productSelection(product)
  const soldOut = selected.stock === 0

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className={`wish-button ${liked ? 'liked' : ''}`}
          type="button"
          aria-label={`${copy.product.save} ${product.name}`}
          onClick={() => setLiked(!liked)}
        >
          <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <a href={productDetailHref(product)} aria-label={`${copy.product.view} ${product.name}`}>
          <img src={product.image} alt={product.name} />
        </a>
        <button className="quick-add" type="button" disabled={soldOut} onClick={() => onAdd(product)}>
          {!soldOut && (productHasVariants(product) ? <Eye size={16} /> : <Plus size={16} />)}
          <span>{soldOut ? copy.product.soldOut : productHasVariants(product) ? copy.product.chooseOptions : copy.product.addToCart}</span>
        </button>
      </div>
      <div className="product-detail">
        <p className="product-category">{product.category}</p>
        <h3><a href={productDetailHref(product)}>{product.name}</a></h3>
        <div className="product-meta">
          <span>{productHasVariants(product) ? `${product.variants.length} ${copy.product.options}` : product.unit}</span>
          <div>
            {selected.oldPrice && <del>{formatPrice(Number(selected.oldPrice))}</del>}
            <strong>{formatPrice(selected.price)}</strong>
          </div>
        </div>
      </div>
    </article>
  )
}

const allergenOptions = ['Eggs free', 'Gluten free', 'Milk free', 'Nuts free', 'Plant based']

function getCatalogMeta(product) {
  const category = product.category.toLowerCase()
  const name = product.name.toLowerCase()
  const allergens = []

  if (!category.includes('dairy') && !name.includes('egg')) allergens.push('Eggs free')
  if (!category.includes('bread') && !category.includes('bakery') && !name.includes('pasta')) allergens.push('Gluten free')
  if (!category.includes('dairy') && !name.includes('milk')) allergens.push('Milk free')
  if (!name.includes('almond') && !name.includes('nut')) allergens.push('Nuts free')
  if (category.includes('fruit') || category.includes('vegetable') || category.includes('beverage')) allergens.push('Plant based')

  const descriptions = {
    'Bread & Bakery': 'Baked fresh with simple ingredients',
    'Fruits & Vegetables': 'Bright flavor, picked for freshness',
    'Dairy & Eggs': 'Farm sourced and quality checked',
    'Fresh Meals & Pizzas': 'A simple choice for busy days',
    'Fresh Meat': 'Carefully selected for your table',
    Beverages: 'Refreshingly good, any time of day',
  }

  return {
    allergens,
    description: descriptions[product.category] || 'Chosen with care for your kitchen',
    rating: product.id % 3 === 0 ? 4 : 5,
    reviews: product.id % 4 === 0 ? 12 : product.id % 5 + 3,
  }
}

function FilterCheckbox({ checked, count, label, onChange }) {
  return (
    <label className="catalog-check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
      <small>{count}</small>
    </label>
  )
}

function CatalogProductCard({ product, onAdd, copy = storefrontI18n.en }) {
  const meta = getCatalogMeta(product)
  const selected = productSelection(product)
  const soldOut = selected.stock === 0
  const sale = Boolean(selected.oldPrice)

  return (
    <article className="catalog-product-card">
      <a className="catalog-product-image" href={productDetailHref(product)}>
        {(soldOut || sale || product.badge) && (
          <span className={`catalog-product-badge ${soldOut ? 'sold-out' : ''}`}>
            {soldOut ? copy.product.soldOut : sale ? copy.product.onSale : product.badge}
          </span>
        )}
        <img src={product.image} alt={product.name} />
      </a>
      <div className="catalog-product-detail">
        <p className="catalog-price">
          {sale && <del>{formatPrice(Number(selected.oldPrice))}</del>}
          <strong>{formatPrice(selected.price)}</strong>
          <span>/ {productHasVariants(product) ? copy.product.fromOptions : selected.unit}</span>
        </p>
        <h3><a href={productDetailHref(product)}>{product.name}</a></h3>
        <p className="catalog-description">{meta.description}</p>
        <div className="catalog-rating" aria-label={`${meta.rating} ${copy.product.outOfFive}, ${meta.reviews} ${copy.product.reviews}`}>
          <span>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={13} fill={index < meta.rating ? 'currentColor' : 'none'} />)}</span>
          <small>({meta.reviews})</small>
        </div>
        <button type="button" disabled={soldOut} onClick={() => onAdd(product)}>
          {soldOut ? copy.product.soldOut : productHasVariants(product) ? copy.product.chooseOptions : copy.product.addToCart}
        </button>
        <p className="catalog-availability"><i /> {soldOut ? copy.product.unavailable : copy.product.localDelivery}</p>
      </div>
    </article>
  )
}

function QuickProductModal({ product, onAdd, onBuyNow, onClose, copy = storefrontI18n.en }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantId, setSelectedVariantId] = useState(getDefaultVariant(product)?.id || '')
  const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariantId) || getDefaultVariant(product)
  const selected = productSelection(product, selectedVariant)
  const meta = getCatalogMeta(product)
  const sale = Boolean(selected.oldPrice)
  const options = Array.isArray(product.options) ? product.options : []
  const images = productImages(product)
  const [activeImage, setActiveImage] = useState(selected.image || images[0])

  return (
    <div className="quick-product-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="quick-product-modal">
        <button className="quick-product-close" type="button" onClick={onClose} aria-label={copy.product.closePreview}><X size={22} /></button>
        <div className="quick-product-media">
          {product.badge && <span>{product.badge}</span>}
          <img src={activeImage || product.image} alt={product.name} />
          {images.length > 1 && (
            <div className="quick-product-thumbs">
              {images.map((image) => <button className={image === activeImage ? 'active' : ''} type="button" onClick={() => setActiveImage(image)} key={image}><img src={image} alt="" /></button>)}
            </div>
          )}
        </div>
        <div className="quick-product-info">
          <p className="quick-product-price">
            <strong>{formatPrice(selected.price)}</strong>
            {sale && <del>{formatPrice(Number(selected.oldPrice))}</del>}
          </p>
          <h2>{product.name}</h2>
          <p>{product.description || `${meta.description}. Selected for dependable quality, everyday freshness, and simple meal planning.`}</p>
          {productHasVariants(product) ? (
            <div className="quick-product-style">
              <span>{options.map((option) => option.name).filter(Boolean).join(' / ') || copy.product.optionsLabel}</span>
              {product.variants.map((variant) => {
                const item = productSelection(product, variant)
                return <button className={variant.id === selectedVariant?.id ? 'active' : ''} disabled={item.stock === 0} type="button" onClick={() => { setSelectedVariantId(variant.id); if (item.image) setActiveImage(item.image) }} key={variant.id}>{variantLabel(product, variant)}</button>
              })}
            </div>
          ) : (
            <div className="quick-product-style"><span>{copy.product.unit}</span><button className="active" type="button">{product.unit}</button></div>
          )}
          <div className="quick-product-actions">
            <div className="quick-qty">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={16} /></button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)}><Plus size={16} /></button>
            </div>
            <button className="quick-add-cart" type="button" disabled={selected.stock === 0} onClick={() => onAdd(product, quantity, true, selectedVariant)}>{copy.product.addToCart}</button>
          </div>
          <button className="quick-buy-now" type="button" disabled={selected.stock === 0} onClick={() => onBuyNow(product, quantity, selectedVariant)}>{copy.product.buyNow}</button>
          <a className="quick-view-details" href={productDetailHref(product)}>{copy.product.viewDetails}</a>
        </div>
      </section>
    </div>
  )
}

function isDiscountActive(discount) {
  const now = Date.now()
  const startsAt = discount.startsAt ? new Date(discount.startsAt).getTime() : 0
  const endsAt = discount.endsAt ? new Date(discount.endsAt).getTime() : null
  return discount.active !== false && (!startsAt || startsAt <= now) && (!endsAt || endsAt >= now) && discount.status !== 'Expired'
}

function discountBaseSubtotal(discount, items, subtotal) {
  const applies = discount.appliesTo || {}
  const query = String(applies.query || '').trim().toLowerCase()
  if (!query || applies.type === 'all' || discount.discountType === 'order' || discount.discountType === 'shipping') return subtotal

  const matched = items.filter((item) => {
    const haystack = `${item.name} ${item.category}`.toLowerCase()
    return haystack.includes(query)
  })
  return matched.reduce((total, item) => total + item.price * item.quantity, 0)
}

function minimumSatisfied(discount, subtotal, items) {
  if (discount.minimumType === 'amount') return subtotal >= Number(discount.minimumValue || 0)
  if (discount.minimumType === 'quantity') return items.reduce((total, item) => total + item.quantity, 0) >= Number(discount.minimumValue || 0)
  return true
}

function evaluateDiscount(discount, subtotal, items, deliveryFee = 0) {
  if (!discount || !isDiscountActive(discount) || !minimumSatisfied(discount, subtotal, items)) return null
  const base = discountBaseSubtotal(discount, items, subtotal)
  if (base <= 0 && discount.discountType !== 'shipping') return null

  if (discount.discountType === 'shipping') {
    return { discount: 0, shippingDiscount: deliveryFee, discountObject: discount }
  }

  const amount = Number(discount.valueAmount || discount.percentOff || 0)
  const discountValue = discount.valueType === 'percentage'
    ? base * (amount / 100)
    : discount.valueType === 'free'
      ? base
      : amount

  return { discount: Math.min(base, Math.max(0, discountValue)), shippingDiscount: 0, discountObject: discount }
}

function CartTotals({ subtotal, discountCode = '', discounts = [], items = [], deliveryFee = 0 }) {
  const normalized = discountCode.trim().toUpperCase()
  const pool = discounts.length ? discounts : fallbackDiscounts
  const candidates = normalized
    ? pool.filter((discount) => discount.method !== 'automatic' && discount.code?.toUpperCase() === normalized)
    : pool.filter((discount) => discount.method === 'automatic')
  const best = candidates
    .map((discount) => evaluateDiscount(discount, subtotal, items, deliveryFee))
    .filter(Boolean)
    .sort((a, b) => (b.discount + b.shippingDiscount) - (a.discount + a.shippingDiscount))[0]
  const discount = best?.discount || 0
  const shippingDiscount = best?.shippingDiscount || 0
  return {
    discount,
    shippingDiscount,
    total: Math.max(0, subtotal - discount + Math.max(0, deliveryFee - shippingDiscount)),
    normalized: best?.discountObject?.code || normalized,
    title: best?.discountObject?.title || best?.discountObject?.code || normalized,
    discountObject: best?.discountObject || null,
  }
}

function DiscountCodeForm({ value, appliedCode, error, hint, onChange, onApply, onRemove, compact = false, copy = storefrontI18n.en }) {
  return (
    <div className={`discount-code-form ${compact ? 'compact' : ''}`}>
      <div className="discount-code-row">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              onApply()
            }
          }}
          placeholder=""
          aria-label={copy.cart.discountCode}
        />
        <button type="button" disabled={!value.trim()} onClick={onApply}>{copy.cart.apply}</button>
      </div>
      {hint && <p>{hint}</p>}
      {error && <small className="discount-error">{error}</small>}
      {appliedCode && (
        <div className="discount-tag-list">
          <span className="discount-chip">
            <Tag size={20} />
            <b>{appliedCode}</b>
            <button type="button" onClick={onRemove} aria-label={copy.cart.removeDiscount}><X size={21} /></button>
          </span>
        </div>
      )}
    </div>
  )
}

function CartPage({
  cart,
  products,
  discounts,
  discountDraft,
  appliedDiscountCode,
  discountError,
  notes,
  termsAccepted,
  onDiscountDraftChange,
  onApplyDiscount,
  onRemoveDiscount,
  onNotesChange,
  onTermsChange,
  onQuantity,
  onCheckout,
  onAddRelated,
  copy = storefrontI18n.en,
}) {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const totals = CartTotals({ subtotal, discountCode: appliedDiscountCode, discounts, items: cart })
  const relatedProducts = products.filter((product) => !cart.some((item) => (item.productId || item.id) === product.id) && productSelection(product).stock !== 0).slice(0, 3)
  const [shippingEstimate, setShippingEstimate] = useState({ country: 'United States', postalCode: '', result: null, error: '' })
  const estimateShipping = (event) => {
    event.preventDefault()
    const postalCode = shippingEstimate.postalCode.trim()
    if (!postalCode) {
      setShippingEstimate((current) => ({ ...current, result: null, error: copy.cart.postalRequired }))
      return
    }

    const free = subtotal >= 75
    const baseRates = {
      'United States': { label: free ? copy.cart.freeDomesticShipping : copy.cart.domesticShipping, price: free ? 0 : 8, eta: copy.cart.oneTwoDays },
      France: { label: free ? copy.cart.freeLocalDelivery : copy.cart.localDelivery, price: free ? 0 : 5, eta: copy.cart.sameOrNextDay },
      Vietnam: { label: copy.cart.internationalDelivery, price: 14, eta: copy.cart.threeFiveDays },
    }
    setShippingEstimate((current) => ({
      ...current,
      result: baseRates[current.country],
      error: '',
    }))
  }

  return (
    <main className="cart-page container">
      <div className="breadcrumbs"><a href="/">{copy.common.home}</a><ChevronRight size={13} /><b>{copy.cart.cart}</b></div>
      <h1>{copy.cart.shoppingCart}</h1>
      <div className="cart-page-layout">
        <section className="cart-page-main">
          <div className="cart-table admin-like">
            <div className="cart-table-head"><span>{copy.cart.product}</span><span>{copy.cart.quantity}</span><span>{copy.cart.total}</span></div>
            {cart.length ? cart.map((item) => (
              <div className="cart-row" key={item.id}>
                <img src={item.image} alt="" />
                <div><p>{formatPrice(item.price)} {item.oldPrice && <del>{formatPrice(item.oldPrice)}</del>}</p><b>{item.name}</b><small>{copy.cart.style}: {item.variantLabel || item.unit}</small></div>
                <div className="cart-row-qty"><button type="button" onClick={() => onQuantity(item.id, -1)}><Minus size={14} /></button><span>{item.quantity}</span><button type="button" onClick={() => onQuantity(item.id, 1)}><Plus size={14} /></button><button type="button" onClick={() => onQuantity(item.id, -item.quantity)}>{copy.cart.remove}</button></div>
                <strong>{formatPrice(item.price * item.quantity)} {item.oldPrice && <del>{formatPrice(item.oldPrice * item.quantity)}</del>}</strong>
              </div>
            )) : <div className="cart-page-empty"><ShoppingBag size={36} /><p>{copy.cart.empty}</p><a href="/products">{copy.cart.continueShopping}</a></div>}
          </div>

          <div className="related-cart-products">
            <h2>{copy.cart.relatedProducts}</h2>
            {relatedProducts.map((product) => (
              <div className="related-cart-row" key={product.id}>
                <img src={product.image} alt="" />
                <span><b>{product.name}</b><small>{formatPrice(product.price)} {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</small></span>
                <button type="button" onClick={() => onAddRelated(product)}>{copy.product.buyNow}</button>
              </div>
            ))}
          </div>

          <div className="estimate-shipping">
            <h2>{copy.cart.estimateShipping}</h2>
            <form onSubmit={estimateShipping}>
              <label>{copy.cart.country}<select value={shippingEstimate.country} onChange={(event) => setShippingEstimate((current) => ({ ...current, country: event.target.value, result: null, error: '' }))}><option>United States</option><option>France</option><option>Vietnam</option></select></label>
              <label>{copy.cart.postalCode}<input value={shippingEstimate.postalCode} onChange={(event) => setShippingEstimate((current) => ({ ...current, postalCode: event.target.value, result: null, error: '' }))} placeholder="10001" /></label>
              <button type="submit">{copy.cart.estimate}</button>
            </form>
            {shippingEstimate.error && <p className="estimate-error">{shippingEstimate.error}</p>}
            {shippingEstimate.result && (
              <div className="estimate-result">
                <span><Truck size={18} /> {shippingEstimate.result.label}</span>
                <b>{shippingEstimate.result.price ? formatPrice(shippingEstimate.result.price) : copy.cart.free}</b>
                <small>{shippingEstimate.result.eta}</small>
              </div>
            )}
          </div>
        </section>

        <aside className="cart-page-summary">
          <div className="free-shipping-box">{copy.cart.freeShippingProgress(formatPrice(Math.max(0, 75 - subtotal)))}</div>
          <div className="cart-summary-card">
            <p>{copy.cart.subtotal} <b>{formatPrice(subtotal)}</b></p>
            <p>{copy.cart.discounts}</p>
            {totals.discount > 0 && <p className="discount-line"><span>{totals.normalized}</span><b>-{formatPrice(totals.discount)}</b></p>}
            <h3>{copy.cart.total} <strong>{formatPrice(totals.total)}</strong></h3>
            <label>{copy.cart.orderInstructions}<textarea value={notes} onChange={(event) => onNotesChange(event.target.value)} /></label>
            <div className="cart-summary-label">{copy.cart.discountCodes}</div>
            <DiscountCodeForm
              value={discountDraft}
              appliedCode={appliedDiscountCode}
              error={discountError}
              onChange={onDiscountDraftChange}
              onApply={onApplyDiscount}
              onRemove={onRemoveDiscount}
              copy={copy}
            />
            <p className="tax-note">{copy.cart.taxNote}</p>
            <label className="terms-row"><input type="checkbox" checked={termsAccepted} onChange={(event) => onTermsChange(event.target.checked)} /> {copy.cart.terms}</label>
            <button className="checkout-wide" type="button" disabled={!cart.length || !termsAccepted} onClick={onCheckout}>{copy.cart.checkout}</button>
          </div>
        </aside>
      </div>
    </main>
  )
}

function getAccountName(user, profile = {}) {
  const metadataName = user?.user_metadata?.full_name || user?.user_metadata?.name
  const localName = [profile.firstName, profile.lastName].filter(Boolean).join(' ')
  return localName || metadataName || user?.email?.split('@')[0] || 'Customer'
}

function AccountModal({ user, profile, onClose, onSignOut }) {
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const change = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setMessage('')
  }

  const submit = async (event) => {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase is not configured for storefront auth.')
      }

      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email.trim(),
          password: form.password,
        })
        if (error) throw error
        onClose()
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.email.trim(),
          password: form.password,
          options: { data: { full_name: form.name.trim() } },
        })
        if (error) throw error
        setMessage('Account created. Please check your email if confirmation is required.')
      }
    } catch (error) {
      setMessage(error.message || 'Please try again.')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="account-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="account-modal">
        <button className="account-modal-close" type="button" onClick={onClose} aria-label="Close account"><X size={28} /></button>
        {user ? (
          <>
            <h2>Account</h2>
            <p className="account-email">{user.email}</p>
            <div className="account-modal-actions">
              <a href="/account?tab=orders" onClick={onClose}><Package size={25} /> Orders</a>
              <a href="/account?tab=profile" onClick={onClose}><User size={25} /> Profile</a>
            </div>
            <div className="account-signed-in">
              <span>{getAccountName(user, profile)}</span>
              <button type="button" onClick={onSignOut}>Sign out</button>
            </div>
          </>
        ) : (
          <>
            <h2>{mode === 'signin' ? 'Sign in' : 'Create account'}</h2>
            <div className="account-tabs">
              <button className={mode === 'signin' ? 'active' : ''} type="button" onClick={() => setMode('signin')}>Sign in</button>
              <button className={mode === 'signup' ? 'active' : ''} type="button" onClick={() => setMode('signup')}>Register</button>
            </div>
            <form className="account-auth-form" onSubmit={submit}>
              {mode === 'signup' && <label>Name<input name="name" value={form.name} onChange={change} autoComplete="name" required /></label>}
              <label>Email<input name="email" type="email" value={form.email} onChange={change} autoComplete="email" required /></label>
              <label>Password<input name="password" type="password" value={form.password} onChange={change} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required minLength={6} /></label>
              {message && <p className="account-message">{message}</p>}
              <button type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Working...' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
            </form>
          </>
        )}
      </section>
    </div>
  )
}

const accountProfileText = {
  en: {
    settings: 'Account settings',
    welcome: (name) => `Welcome back, ${name}. Manage your profile and orders.`,
    profileTab: 'Profile',
    ordersTab: 'My orders',
    personal: 'Personal information',
    edit: 'Edit',
    fullName: 'Full name',
    email: 'Email address',
    verified: 'Securely verified',
    nickname: 'Nickname',
    phone: 'Phone number',
    noPhone: 'Not added',
    password: 'Password',
    changePassword: 'Change password',
    membership: 'LyLy Seedling member',
    progress: 'Rewards progress',
    points: 'points',
    pointsHelp: (remaining) => `Earn ${remaining} more points to reach Fresh Master and unlock a 25% coupon.`,
    stats: 'Purchase stats',
    ordersPlaced: 'Orders placed',
    totalSaved: 'Total saved',
    addresses: 'Delivery addresses',
    addressesHelp: 'Choose a default address for faster checkout.',
    addAddress: 'Add new address',
    default: 'Default',
    home: 'Home',
    office: 'Office',
    setDefault: 'Set default',
    delete: 'Delete',
    noAddresses: 'No addresses added',
    security: 'Information security zone',
    securityHelp: 'Protect your account by signing out of old browser sessions.',
    signOutAll: 'Sign out all devices',
    signOut: 'Sign out',
    editProfile: 'Edit profile',
    firstName: 'First name',
    lastName: 'Last name',
    emailOffers: 'Email me with news and offers',
    cancel: 'Cancel',
    save: 'Save',
    addAddressTitle: 'Add address',
    country: 'Country/region',
    city: 'City',
    state: 'State',
    zip: 'ZIP code',
    defaultAddress: 'This is my default address',
  },
  vi: {
    settings: 'Cài đặt tài khoản',
    welcome: (name) => `Chào mừng quay trở lại, ${name}. Quản lý thông tin cá nhân và đơn hàng của bạn.`,
    profileTab: 'Hồ sơ cá nhân',
    ordersTab: 'Đơn hàng của tôi',
    personal: 'Thông tin cá nhân',
    edit: 'Chỉnh sửa',
    fullName: 'Họ và tên',
    email: 'Địa chỉ email',
    verified: 'Đã xác thực bảo mật',
    nickname: 'Nickname',
    phone: 'Số điện thoại',
    noPhone: 'Chưa cập nhật',
    password: 'Mật khẩu',
    changePassword: 'Thay đổi mật khẩu',
    membership: 'Thành viên LyLy Seedling',
    progress: 'Tiến trình tích điểm',
    points: 'điểm',
    pointsHelp: (remaining) => `Tích lũy thêm ${remaining} điểm nữa để thăng cấp Fresh Master và nhận coupon giảm giá 25%.`,
    stats: 'Thống kê mua hàng',
    ordersPlaced: 'Đơn hàng đã đặt',
    totalSaved: 'Tổng tiết kiệm',
    addresses: 'Sổ địa chỉ giao hàng',
    addressesHelp: 'Chọn địa chỉ mặc định để đặt hàng nhanh hơn.',
    addAddress: 'Thêm địa chỉ mới',
    default: 'Mặc định',
    home: 'Nhà riêng',
    office: 'Văn phòng',
    setDefault: 'Đặt mặc định',
    delete: 'Xóa',
    noAddresses: 'Chưa có địa chỉ',
    security: 'Vùng bảo mật thông tin',
    securityHelp: 'Bảo vệ tài khoản bằng cách đăng xuất khỏi các trình duyệt cũ hoặc lạ.',
    signOutAll: 'Đăng xuất tất cả thiết bị',
    signOut: 'Đăng xuất tài khoản',
    editProfile: 'Chỉnh sửa hồ sơ',
    firstName: 'Tên',
    lastName: 'Họ',
    emailOffers: 'Nhận tin tức và ưu đãi qua email',
    cancel: 'Hủy',
    save: 'Lưu',
    addAddressTitle: 'Thêm địa chỉ',
    country: 'Quốc gia/khu vực',
    city: 'Thành phố',
    state: 'Tỉnh/Bang',
    zip: 'Mã bưu chính',
    defaultAddress: 'Đặt làm địa chỉ mặc định',
  },
}

const accountOrderTabs = [
  ['all', 'All'],
  ['unpaid', 'Awaiting payment'],
  ['processing', 'Processing'],
  ['transit', 'In transit'],
  ['delivered', 'Delivered'],
  ['cancelled', 'Cancelled'],
]

const accountOrderTabLabels = {
  vi: {
    all: 'T\u1ea5t c\u1ea3',
    unpaid: 'Ch\u1edd thanh to\u00e1n',
    processing: '\u0110ang x\u1eed l\u00fd',
    transit: '\u0110ang giao',
    delivered: '\u0110\u00e3 giao',
    cancelled: '\u0110\u00e3 h\u1ee7y',
  },
}

function normalizedOrderStatus(value) {
  return String(value || '').trim().toLowerCase()
}

function accountOrderBucket(order) {
  const payment = normalizedOrderStatus(order.payment)
  const delivery = normalizedOrderStatus(order.delivery)
  if (['cancelled', 'returned', 'failed delivery'].includes(delivery)) return 'cancelled'
  if (delivery === 'delivered') return 'delivered'
  if (payment === 'pending') return 'unpaid'
  if (['ready', 'in transit'].includes(delivery) || order.trackingId) return 'transit'
  return 'processing'
}

function accountOrderStage(order) {
  const delivery = normalizedOrderStatus(order.delivery)
  if (delivery === 'delivered') return 3
  if (['ready', 'in transit'].includes(delivery) || order.trackingId) return 2
  if (['packing'].includes(delivery)) return 1
  return 0
}

function AccountPage({ user, profile, addresses, products = [], copy = storefrontI18n.en, onOpenAccount, onSaveProfile, onSaveAddress, onReorder, onSignOut }) {
  const initialTab = new URLSearchParams(window.location.search).get('tab') === 'orders' ? 'orders' : 'profile'
  const [tab, setTab] = useState(initialTab)
  const [orders, setOrders] = useState([])
  const [ordersStatus, setOrdersStatus] = useState('idle')
  const [ordersMessage, setOrdersMessage] = useState('')
  const [orderQuery, setOrderQuery] = useState('')
  const [orderFilter, setOrderFilter] = useState('all')
  const [expandedOrders, setExpandedOrders] = useState(() => new Set())
  const [actionNotice, setActionNotice] = useState('')
  const [orderActionKey, setOrderActionKey] = useState('')
  const [payOrderModal, setPayOrderModal] = useState(null)
  const [payMethod, setPayMethod] = useState(null)
  const [cancelOrderModal, setCancelOrderModal] = useState(null)
  const [returnModal, setReturnModal] = useState(null)
  const [returnReason, setReturnReason] = useState('')
  const [returnNotes, setReturnNotes] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [addressOpen, setAddressOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    phone: profile.phone || '',
    emailOffers: Boolean(profile.emailOffers),
  })
  const [addressForm, setAddressForm] = useState({
    country: 'United States',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Alabama',
    zip: '',
    isDefault: true,
  })
  const accountText = accountProfileText[copy.langCode === 'VI' ? 'vi' : 'en']
  const accountName = getAccountName(user, profile)
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || accountName
  const nickname = accountName.split(' ').slice(0, 2).join(' ')
  const initials = fullName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'LY'
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const totalSaved = orders.reduce((sum, order) => sum + Number(order.discountTotal || 0), 0)
  const loyaltyPoints = Math.min(500, Math.round(totalSpent * 4))
  const remainingPoints = Math.max(0, 500 - loyaltyPoints)
  const progressPercent = Math.min(100, (loyaltyPoints / 500) * 100)
  const activeOrderCount = orders.filter((order) => !['delivered', 'cancelled'].includes(accountOrderBucket(order))).length
  const latestOrder = orders[0]?.id || '-'
  const productsById = useMemo(() => new Map(products.map((product) => [String(product.id), product])), [products])
  const findOrderProduct = (item) =>
    productsById.get(String(item.productId)) ||
    products.find((product) => product.name.toLowerCase() === String(item.name || '').split(' (')[0].toLowerCase()) ||
    null
  const orderCounts = useMemo(() => {
    const counts = Object.fromEntries(accountOrderTabs.map(([id]) => [id, 0]))
    orders.forEach((order) => {
      counts.all += 1
      counts[accountOrderBucket(order)] = (counts[accountOrderBucket(order)] || 0) + 1
    })
    return counts
  }, [orders])
  const visibleOrders = useMemo(() => {
    const query = orderQuery.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesTab = orderFilter === 'all' || accountOrderBucket(order) === orderFilter
      const searchable = [
        order.id,
        order.payment,
        order.delivery,
        ...(order.lineItems || []).map((item) => item.name),
      ].join(' ').toLowerCase()
      return matchesTab && (!query || searchable.includes(query))
    })
  }, [orders, orderFilter, orderQuery])
  const toggleExpandedOrder = (orderId) => {
    setExpandedOrders((current) => {
      const next = new Set(current)
      if (next.has(orderId)) next.delete(orderId)
      else next.add(orderId)
      return next
    })
  }
  const showActionNotice = (message) => {
    setActionNotice(message)
    window.setTimeout(() => setActionNotice(''), 3200)
  }

  useEffect(() => {
    if (!user?.email) return undefined

    let cancelled = false
    Promise.resolve()
      .then(() => {
        if (cancelled) return []
        setOrdersStatus('loading')
        setOrdersMessage('')
        return loadStorefrontOrders(user.email)
      })
      .then((data) => {
        if (cancelled) return
        setOrders(data)
        setOrdersStatus('success')
      })
      .catch((error) => {
        if (cancelled) return
        console.error('Unable to load storefront orders.', error)
        setOrders([])
        setOrdersStatus('error')
        setOrdersMessage('Unable to load orders right now.')
      })

    return () => {
      cancelled = true
    }
  }, [user?.email])

  if (!user) {
    return (
      <main className="account-page">
        <header className="account-page-header account-profile-header">
          <div>
            <h1>{accountText.settings}</h1>
            <p>{accountText.welcome('LyLy')}</p>
          </div>
        </header>
        <section className="account-empty-state">
          <h1>{copy.account}</h1>
          <p>{copy.langCode === 'VI' ? 'Đăng nhập hoặc tạo tài khoản để xem đơn hàng, hồ sơ và địa chỉ đã lưu.' : 'Sign in or create an account to view orders, profile and saved addresses.'}</p>
          <button type="button" onClick={onOpenAccount}>{copy.langCode === 'VI' ? 'Đăng nhập' : 'Sign in'}</button>
        </section>
      </main>
    )
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    await onSaveProfile(profileForm)
    setProfileOpen(false)
  }

  const saveAddress = (event) => {
    event.preventDefault()
    onSaveAddress(addressForm)
    setAddressOpen(false)
    setAddressForm((current) => ({ ...current, address: '', apartment: '', city: '', zip: '' }))
  }

  const runOrderAction = async (order, action, paymentMethod) => {
    const actionKey = `${order.uuid}-${action}`
    setOrderActionKey(actionKey)
    setActionNotice('')

    try {
      await updateStorefrontOrderAction(order.uuid, action, paymentMethod)
      const refreshedOrders = await loadStorefrontOrders(user.email)
      setOrders(refreshedOrders)
      showActionNotice(action === 'pay' ? `${order.id} has been marked as paid.` : `${order.id} has been cancelled.`)
    } catch (error) {
      console.error(`Unable to ${action} storefront order.`, error)
      showActionNotice(action === 'pay' ? `Unable to process payment for ${order.id}.` : `Unable to cancel ${order.id}.`)
    } finally {
      setOrderActionKey('')
    }
  }

  return (
    <main className="account-page">
      <header className="account-page-header account-profile-header">
        <div>
          <h1>{tab === 'orders' ? accountText.ordersTab : accountText.settings}</h1>
          <p>{accountText.welcome(accountName)}</p>
        </div>
        <nav>
          <button className={tab === 'profile' ? 'active' : ''} type="button" onClick={() => setTab('profile')}><User size={16} />{accountText.profileTab}</button>
          <button className={tab === 'orders' ? 'active' : ''} type="button" onClick={() => setTab('orders')}><RotateCcw size={16} />{accountText.ordersTab}</button>
        </nav>
      </header>

      <section className="account-content">
        {tab === 'orders' ? (
          ordersStatus === 'loading' ? (
            <div className="account-card account-empty-row">
              <Package size={24} />
              <span>Loading orders...</span>
            </div>
          ) : ordersStatus === 'error' ? (
            <div className="account-card account-empty-row">
              <Package size={24} />
              <span>{ordersMessage}</span>
            </div>
          ) : orders.length ? (
            <>
              <div className="account-order-tools">
                <div className="account-order-hero">
                  <div>
                    <span>{copy.langCode === 'VI' ? 'Trung t\u00e2m \u0111\u01a1n h\u00e0ng' : 'Order center'}</span>
                    <h2>{accountText.ordersTab}</h2>
                    <p>{copy.langCode === 'VI' ? 'Theo d\u00f5i tr\u1ea1ng th\u00e1i, t\u00ecm nhanh \u0111\u01a1n h\u00e0ng v\u00e0 x\u1eed l\u00fd c\u00e1c y\u00eau c\u1ea7u mua l\u1ea1i trong m\u1ed9t n\u01a1i.' : 'Track status, search purchases and manage reorder actions from one focused view.'}</p>
                  </div>
                  <dl className="account-order-summary">
                    <div>
                      <dt>{copy.langCode === 'VI' ? 'T\u1ed5ng \u0111\u01a1n' : 'Orders'}</dt>
                      <dd>{orders.length}</dd>
                    </div>
                    <div>
                      <dt>{copy.langCode === 'VI' ? '\u0110ang x\u1eed l\u00fd' : 'Active'}</dt>
                      <dd>{activeOrderCount}</dd>
                    </div>
                    <div>
                      <dt>{copy.langCode === 'VI' ? 'G\u1ea7n nh\u1ea5t' : 'Latest'}</dt>
                      <dd>{latestOrder}</dd>
                    </div>
                  </dl>
                </div>
                <div className="account-order-filter-panel">
                  <label className="account-order-search">
                    <Search size={18} />
                    <input value={orderQuery} onChange={(event) => setOrderQuery(event.target.value)} placeholder={copy.langCode === 'VI' ? 'T\u00ecm theo m\u00e3 \u0111\u01a1n ho\u1eb7c s\u1ea3n ph\u1ea9m' : 'Search by order number or product'} />
                  </label>
                  <div className="account-order-tabs">
                    {accountOrderTabs.map(([id, label]) => (
                      <button className={orderFilter === id ? 'active' : ''} type="button" onClick={() => setOrderFilter(id)} key={id}>
                        {(copy.langCode === 'VI' ? accountOrderTabLabels.vi[id] : label) || label}<em>{orderCounts[id] || 0}</em>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {actionNotice && <p className="account-action-notice">{actionNotice}</p>}
              <div className="account-orders-list">
                {visibleOrders.length ? visibleOrders.map((order) => {
                  const expanded = expandedOrders.has(order.uuid)
                  const orderItems = order.lineItems || []
                  const shownItems = expanded ? orderItems : orderItems.slice(0, 2)
                  const hiddenCount = Math.max(0, orderItems.length - shownItems.length)
                  const subtotalValue = order.subtotal || orderItems.reduce((sum, item) => sum + item.total, 0)
                  const stage = accountOrderStage(order)
                  const bucket = accountOrderBucket(order)
                  return (
                    <article className="account-card account-order-card" key={order.uuid}>
                      <header className="account-order-head">
                        <div>
                          <b>{order.id}</b>
                          <small>{order.date} · {order.deliveryMethod || 'Delivery'}</small>
                        </div>
                        <strong>{formatPrice(order.total)}</strong>
                      </header>
                      <div className="account-order-meta">
                        <span>{order.items} items</span>
                        <span>Payment: {order.payment}{order.paymentMethod ? ` · ${order.paymentMethod}` : ''}</span>
                        <span>Delivery: {order.delivery}</span>
                      </div>
                      <div className={`account-order-stepper stage-${stage}`}>
                        {['Ordered', 'Processing', 'In transit', 'Delivered'].map((label, index) => (
                          <span className={index <= stage ? 'active' : ''} key={label}><i></i>{label}</span>
                        ))}
                      </div>
                      {orderItems.length > 0 && (
                        <ul className="account-order-items">
                          {shownItems.map((item) => {
                            const product = findOrderProduct(item)
                            return (
                              <li key={`${order.uuid}-${item.name}`}>
                                {product?.image ? <img src={product.image} alt="" /> : <span className="order-item-fallback"><Package size={18} /></span>}
                                <div><b>{item.name}</b><small>{item.quantity} x {formatPrice(item.price)}</small></div>
                                <strong>{formatPrice(item.total)}</strong>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                      {hiddenCount > 0 && <button className="account-show-more" type="button" onClick={() => toggleExpandedOrder(order.uuid)}>View {hiddenCount} more products</button>}
                      {expanded && orderItems.length > 2 && <button className="account-show-more" type="button" onClick={() => toggleExpandedOrder(order.uuid)}>Show fewer products</button>}
                      <div className="account-price-breakdown">
                        <p><span>Subtotal</span><b>{formatPrice(subtotalValue)}</b></p>
                        {order.discountTotal > 0 && <p><span>Discount</span><b>-{formatPrice(order.discountTotal)}</b></p>}
                        <p><span>Delivery fee</span><b>{order.deliveryFee ? formatPrice(order.deliveryFee) : 'Free'}</b></p>
                        <p><span>Tax</span><b>{formatPrice(order.taxTotal || Math.max(0, order.total - subtotalValue + order.discountTotal - order.deliveryFee))}</b></p>
                        <p><span>Total</span><b>{formatPrice(order.total)}</b></p>
                      </div>
                      {order.trackingId && <p className="account-order-tracking">Tracking: {order.trackingId}</p>}
                      {order.returnRejected && (
                        <div className="return-rejected-notice">
                          <b>Yêu cầu trả hàng đã bị từ chối</b>
                          {order.returnRejectedMessage && <span>{order.returnRejectedMessage}</span>}
                        </div>
                      )}
                      <div className="order-history-list">
                        <p className="order-history-title"><RotateCcw size={12} /> Order history</p>
                        <div className="order-history-item">
                          <span className="order-history-date">{order.date}</span>
                          <span className="order-history-msg">Đơn hàng được đặt</span>
                        </div>
                        {order.events.map((event) => (
                          <div key={event.id} className="order-history-item">
                            <span className="order-history-date">{event.date}</span>
                            <span className="order-history-msg">{event.message}</span>
                          </div>
                        ))}
                      </div>
                      <div className="account-order-actions">
                        {bucket === 'unpaid' && <button type="button" disabled={Boolean(orderActionKey)} onClick={() => { setPayMethod(null); setPayOrderModal(order) }}>{orderActionKey === `${order.uuid}-pay` ? 'Processing...' : 'Pay now'}</button>}
                        {!['delivered', 'cancelled', 'transit'].includes(bucket) && <button type="button" disabled={Boolean(orderActionKey)} onClick={() => setCancelOrderModal(order)}>{orderActionKey === `${order.uuid}-cancel` ? 'Cancelling...' : 'Cancel order'}</button>}
                        {bucket === 'delivered' && <button type="button" onClick={() => onReorder?.(order)}>Reorder</button>}
                        {bucket === 'delivered' && !order.returnReason && !order.returnRejected && order.delivery !== 'Returned' && (
                          <button type="button" onClick={() => { setReturnReason(''); setReturnNotes(''); setReturnModal(order) }}>Return items</button>
                        )}
                        {bucket === 'delivered' && order.returnReason && (
                          <span className="return-pending-tag">Return requested</span>
                        )}
                      </div>
                    </article>
                  )
                }) : (
                  <div className="account-card account-empty-row">
                    <Search size={24} />
                    <span>No orders match your filters</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="account-card account-empty-row">
              <Package size={24} />
              <span>No orders yet</span>
            </div>
          )
        ) : (
          <div className="account-profile-layout">
            <aside className="account-profile-side">
              <div className="account-member-card">
                <div className="account-member-cover"></div>
                <div className="account-member-avatar">
                  <span>{initials}</span>
                  <button type="button" aria-label="Change avatar"><Camera size={15} /></button>
                </div>
                <h2>{fullName}</h2>
                <p>{user.email}</p>
                <em><Tag size={13} />{accountText.membership}</em>
                <div className="account-reward">
                  <div><span>{accountText.progress}</span><b>{loyaltyPoints} / 500 {accountText.points}</b></div>
                  <i><span style={{ width: `${progressPercent}%` }}></span></i>
                  <small>{accountText.pointsHelp(remainingPoints)}</small>
                </div>
              </div>
              <div className="account-stat-card">
                <h3><ShoppingBag size={17} />{accountText.stats}</h3>
                <div>
                  <span><b>{String(orders.length).padStart(2, '0')}</b><small>{accountText.ordersPlaced}</small></span>
                  <span><b>{formatPrice(totalSaved)}</b><small>{accountText.totalSaved}</small></span>
                </div>
              </div>
            </aside>
            <div className="account-profile-main">
              {actionNotice && <p className="account-action-notice">{actionNotice}</p>}
              <section className="account-profile-panel">
                <div className="account-panel-head">
                  <h2><User size={19} />{accountText.personal}</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileForm({
                        firstName: profile.firstName || '',
                        lastName: profile.lastName || '',
                        phone: profile.phone || '',
                        emailOffers: Boolean(profile.emailOffers),
                      })
                      setProfileOpen(true)
                    }}
                  >
                    <Pencil size={15} />{accountText.edit}
                  </button>
                </div>
                <div className="account-profile-fields">
                  <div>
                    <span>{accountText.fullName}</span>
                    <b>{fullName}</b>
                    <small>{accountText.nickname}: {nickname}</small>
                  </div>
                  <div>
                    <span>{accountText.email}</span>
                    <b>{user.email}</b>
                    <small className="verified"><ShieldCheck size={13} />{accountText.verified}</small>
                  </div>
                  <div>
                    <span>{accountText.phone}</span>
                    <b>{profile.phone || accountText.noPhone}</b>
                  </div>
                  <div>
                    <span>{accountText.password}</span>
                    <b>••••••••••</b>
                    <small>{accountText.changePassword}</small>
                  </div>
                </div>
              </section>

              <section className="account-profile-panel">
                <div className="account-panel-head">
                  <div>
                    <h2><MapPin size={20} />{accountText.addresses}</h2>
                    <p>{accountText.addressesHelp}</p>
                  </div>
                  <button type="button" onClick={() => setAddressOpen(true)}><Plus size={16} />{accountText.addAddress}</button>
                </div>
                <div className="account-address-grid">
                  {addresses.length ? addresses.map((address, index) => (
                    <article className={`account-address-tile ${address.isDefault || index === 0 ? 'default' : ''}`} key={address.id || `${address.address}-${address.zip}`}>
                      <header>
                        <b>{address.firstName} {address.lastName}</b>
                        <em>{address.isDefault || index === 0 ? accountText.default : index % 2 ? accountText.office : accountText.home}</em>
                      </header>
                      {(address.phone || profile.phone) && <p><Phone size={14} />{address.phone || profile.phone}</p>}
                      <p><MapPin size={14} />{address.address}{address.apartment ? `, ${address.apartment}` : ''}</p>
                      <small>{[address.city, address.state, address.zip, address.country].filter(Boolean).join(', ')}</small>
                      <footer>
                        {!(address.isDefault || index === 0) && <button type="button" onClick={() => showActionNotice(accountText.setDefault)}>{accountText.setDefault}</button>}
                        <button type="button" onClick={() => showActionNotice(accountText.delete)}>{accountText.delete}</button>
                      </footer>
                    </article>
                  )) : (
                    <div className="account-empty-row"><ShieldCheck size={22} /><span>{accountText.noAddresses}</span></div>
                  )}
                </div>
              </section>

              <section className="account-security-panel">
                <div>
                  <h2>{accountText.security}</h2>
                  <p>{accountText.securityHelp}</p>
                </div>
                <button type="button" onClick={onSignOut}>{accountText.signOutAll}</button>
                <button type="button" onClick={onSignOut}>{accountText.signOut}</button>
              </section>
            </div>
          </div>
        )}
      </section>

      {profileOpen && (
        <div className="account-overlay" onMouseDown={(event) => event.target === event.currentTarget && setProfileOpen(false)}>
          <form className="account-edit-modal" onSubmit={saveProfile}>
            <button className="account-modal-close" type="button" onClick={() => setProfileOpen(false)} aria-label="Close edit profile"><X size={28} /></button>
            <h2>{accountText.editProfile}</h2>
            <div className="account-form-grid two">
              <input value={profileForm.firstName} onChange={(event) => setProfileForm((current) => ({ ...current, firstName: event.target.value }))} placeholder={accountText.firstName} autoFocus />
              <input value={profileForm.lastName} onChange={(event) => setProfileForm((current) => ({ ...current, lastName: event.target.value }))} placeholder={accountText.lastName} />
            </div>
            <label className="stacked-input">{accountText.phone}<input value={profileForm.phone} onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))} placeholder={accountText.phone} /></label>
            <label className="stacked-input">{accountText.email}<input value={user.email} disabled /></label>
            <label className="account-check"><input type="checkbox" checked={profileForm.emailOffers} onChange={(event) => setProfileForm((current) => ({ ...current, emailOffers: event.target.checked }))} /> {accountText.emailOffers}</label>
            <div className="modal-button-row"><button type="button" onClick={() => setProfileOpen(false)}>{accountText.cancel}</button><button type="submit">{accountText.save}</button></div>
          </form>
        </div>
      )}

      {payOrderModal && (
        <div className="account-overlay" onMouseDown={(event) => event.target === event.currentTarget && setPayOrderModal(null)}>
          <div className="account-edit-modal order-pay-modal">
            <button className="account-modal-close" type="button" onClick={() => setPayOrderModal(null)} aria-label="Close"><X size={28} /></button>
            <h2>Complete payment</h2>
            <p className="order-pay-modal-subtitle">{payOrderModal.id} · {formatPrice(payOrderModal.total)}</p>
            <div className="order-pay-notice">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="8" cy="8" r="7.25" stroke="#b45309" strokeWidth="1.5"/><rect x="7.25" y="4" width="1.5" height="4.5" rx=".75" fill="#b45309"/><rect x="7.25" y="10" width="1.5" height="1.5" rx=".75" fill="#b45309"/></svg>
              <span>This order is awaiting payment. Select a method below to complete your purchase — your order will be held until payment is confirmed.</span>
            </div>
            <div className="checkout-payment-list order-pay-list">
              {PAYMENT_METHODS.map((method) => (
                <label key={method.id} className={`checkout-payment-option ${payMethod === method.id ? 'selected' : ''}`}>
                  <input type="radio" name="orderPayMethod" value={method.id} checked={payMethod === method.id} onChange={() => setPayMethod(method.id)} />
                  <PaymentLogo type={method.logoType} />
                  <div className="payment-info">
                    <b>{method.label}</b>
                    {method.promo && <small style={method.promoColor ? { color: method.promoColor } : {}}>{method.promo}</small>}
                  </div>
                </label>
              ))}
            </div>
            <div className="order-pay-modal-actions">
              <button type="button" className="order-pay-cancel-btn" onClick={() => setPayOrderModal(null)}>Back to order</button>
              <button type="button" className="order-pay-confirm-btn" disabled={Boolean(orderActionKey) || !payMethod} onClick={async () => { const order = payOrderModal; const method = payMethod; setPayOrderModal(null); await runOrderAction(order, 'pay', method) }}>{orderActionKey ? 'Processing...' : 'Confirm payment'}</button>
            </div>
          </div>
        </div>
      )}

      {cancelOrderModal && (
        <div className="account-overlay" onMouseDown={(event) => event.target === event.currentTarget && setCancelOrderModal(null)}>
          <div className="account-edit-modal order-cancel-modal">
            <button className="account-modal-close" type="button" onClick={() => setCancelOrderModal(null)} aria-label="Close"><X size={28} /></button>
            <h2>Cancel order?</h2>
            <p className="order-cancel-modal-text">Are you sure you want to cancel <strong>{cancelOrderModal.id}</strong>? This action cannot be undone.</p>
            <div className="order-pay-modal-actions">
              <button type="button" className="order-pay-cancel-btn" onClick={() => setCancelOrderModal(null)}>Keep order</button>
              <button type="button" className="order-cancel-confirm-btn" disabled={Boolean(orderActionKey)} onClick={async () => { const order = cancelOrderModal; setCancelOrderModal(null); await runOrderAction(order, 'cancel') }}>{orderActionKey ? 'Cancelling...' : 'Yes, cancel order'}</button>
            </div>
          </div>
        </div>
      )}

      {returnModal && (
        <div className="account-overlay" onMouseDown={(event) => event.target === event.currentTarget && setReturnModal(null)}>
          <div className="account-edit-modal order-return-modal">
            <button className="account-modal-close" type="button" onClick={() => setReturnModal(null)} aria-label="Close"><X size={28} /></button>
            <h2>Request a return</h2>
            <p className="order-pay-modal-subtitle">{returnModal.id} · {formatPrice(returnModal.total)}</p>
            <p className="order-return-warning"><AlertTriangle size={14} /> Yêu cầu này sẽ áp dụng hoàn trả cho toàn bộ sản phẩm có trong đơn hàng này.</p>
            <div className="order-return-form">
              <label className="order-return-label">
                Reason for return
                <select value={returnReason} onChange={(e) => setReturnReason(e.target.value)} className="order-return-select">
                  <option value="">Select a reason...</option>
                  <option value="damaged">Item arrived damaged or defective</option>
                  <option value="wrong_item">Wrong item received</option>
                  <option value="not_as_described">Item not as described</option>
                  <option value="changed_mind">Changed my mind</option>
                  <option value="missing_items">Missing items in order</option>
                </select>
              </label>
              <label className="order-return-label">
                Additional details <span className="order-return-optional">(optional)</span>
                <textarea value={returnNotes} onChange={(e) => setReturnNotes(e.target.value)} className="order-return-textarea" placeholder="Describe the issue in more detail..." rows={3} />
              </label>
            </div>
            <div className="order-pay-modal-actions">
              <button type="button" className="order-pay-cancel-btn" onClick={() => setReturnModal(null)}>Keep order</button>
              <button
                type="button"
                className="order-return-confirm-btn"
                disabled={!returnReason || Boolean(orderActionKey)}
                onClick={async () => {
                  const order = returnModal
                  const reason = returnReason
                  const notes = returnNotes
                  setReturnModal(null)
                  setOrderActionKey(`${order.uuid}-return`)
                  try {
                    await submitStorefrontReturnRequest(order.uuid, reason, notes)
                    const refreshedOrders = await loadStorefrontOrders(user.email)
                    setOrders(refreshedOrders)
                    showActionNotice(`Return request for ${order.id} submitted. We'll contact you within 2–3 business days.`)
                  } catch (error) {
                    console.error('Unable to submit return request.', error)
                    showActionNotice(`Unable to submit return request for ${order.id}. Please try again or contact support.`)
                  } finally {
                    setOrderActionKey('')
                  }
                }}
              >
                {orderActionKey ? 'Submitting...' : 'Submit return request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {addressOpen && (
        <div className="account-overlay" onMouseDown={(event) => event.target === event.currentTarget && setAddressOpen(false)}>
          <form className="account-edit-modal address-modal" onSubmit={saveAddress}>
            <button className="account-modal-close" type="button" onClick={() => setAddressOpen(false)} aria-label="Close add address"><X size={28} /></button>
            <h2>{accountText.addAddressTitle}</h2>
            <label className="stacked-input">{accountText.country}<select value={addressForm.country} onChange={(event) => setAddressForm((current) => ({ ...current, country: event.target.value }))}><option>United States</option><option>Vietnam</option><option>France</option></select></label>
            <div className="account-form-grid two">
              <input required value={addressForm.firstName} onChange={(event) => setAddressForm((current) => ({ ...current, firstName: event.target.value }))} placeholder={accountText.firstName} />
              <input required value={addressForm.lastName} onChange={(event) => setAddressForm((current) => ({ ...current, lastName: event.target.value }))} placeholder={accountText.lastName} />
            </div>
            <input required value={addressForm.address} onChange={(event) => setAddressForm((current) => ({ ...current, address: event.target.value }))} placeholder="Address" />
            <input value={addressForm.apartment} onChange={(event) => setAddressForm((current) => ({ ...current, apartment: event.target.value }))} placeholder="Apartment, suite, etc (optional)" />
            <div className="account-form-grid three">
              <input required value={addressForm.city} onChange={(event) => setAddressForm((current) => ({ ...current, city: event.target.value }))} placeholder={accountText.city} />
              <select value={addressForm.state} onChange={(event) => setAddressForm((current) => ({ ...current, state: event.target.value }))}><option>Alabama</option><option>California</option><option>New York</option><option>Texas</option></select>
              <input required value={addressForm.zip} onChange={(event) => setAddressForm((current) => ({ ...current, zip: event.target.value }))} placeholder={accountText.zip} />
            </div>
            <label className="account-check"><input type="checkbox" checked={addressForm.isDefault} onChange={(event) => setAddressForm((current) => ({ ...current, isDefault: event.target.checked }))} /> {accountText.defaultAddress}</label>
            <div className="modal-button-row"><button type="button" onClick={() => setAddressOpen(false)}>{accountText.cancel}</button><button type="submit">{accountText.save}</button></div>
          </form>
        </div>
      )}
    </main>
  )
}

function StoreMapMock() {
  return (
    <div className="store-map" aria-label="Store map preview">
      <img src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1100&q=85" alt="" />
      <i className="pin one" />
      <i className="pin two" />
      <i className="pin three" />
      <span className="map-control full">[]</span>
      <span className="map-control move">+</span>
      <span className="map-control zoom">+<br />-</span>
    </div>
  )
}

function StoresAccordion({ selectedId, onSelect }) {
  const [openId, setOpenId] = useState(selectedId || storeLocations[0].id)
  return (
    <div className="store-accordion">
      {storeLocations.map((location) => {
        const open = openId === location.id
        return (
          <article className={open ? 'open' : ''} key={location.id}>
            <button type="button" onClick={() => setOpenId(open ? '' : location.id)}>
              <span>{location.name}</span>
              <b>{open ? '-' : '+'}</b>
            </button>
            {open && (
              <div className="store-details">
                <img src={location.image} alt="" />
                <div>
                  <p>{location.address}</p>
                  <p>{location.city}</p>
                  <b>Store Hours</b>
                  {location.hours.map((line) => <span key={line}>{line}</span>)}
                  {onSelect ? <button type="button" onClick={() => onSelect(location)}>Select location</button> : <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.address} ${location.city}`)}`} target="_blank" rel="noreferrer">Get directions</a>}
                </div>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

function OurStoresPage() {
  const [message, setMessage] = useState('')
  return (
    <main className="info-page container">
      <div className="breadcrumbs"><a href="/">Home</a><ChevronRight size={13} /><b>Our stores</b></div>
      <h1>Our stores</h1>
      <section className="stores-layout">
        <StoreMapMock />
        <StoresAccordion />
      </section>
      <section className="contact-layout">
        <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setMessage('Thanks. We will get back to you shortly.') }}>
          <h2>Drop us a line</h2>
          <input required placeholder="Name" />
          <input required type="email" placeholder="Email" />
          <input placeholder="Subject" />
          <input placeholder="Phone Number" />
          <textarea required placeholder="Message" />
          <button type="submit">Submit</button>
          {message && <p>{message}</p>}
        </form>
        <article className="info-card">
          <h2>Mailing Address</h2>
          <p>For any issues related to our products, please send us a mail at our warehouse and we will try to provide a solution.</p>
          <b>Warehouse</b>
          <span>Fond du Val 23<br />Maurecourt, France</span>
        </article>
        <article className="info-card">
          <h2>Have a question?</h2>
          <p>We have written some documentation to help you in purchasing from us.</p>
          <a href="/faq">FAQ</a>
          <a href="/delivery">Shipping</a>
          <a href="/#promise">About</a>
          <a href="/products">Search</a>
        </article>
      </section>
    </main>
  )
}

function DeliveryPage({ onOpenPickup }) {
  const [openId, setOpenId] = useState('domestic')
  return (
    <main className="info-page container">
      <div className="breadcrumbs"><a href="/">Home</a><ChevronRight size={13} /><b>Shipping & Delivery</b></div>
      <h1>Shipping & Delivery</h1>
      <p className="page-lede">You can choose the preferred shipping method at checkout.</p>
      <section className="delivery-list">
        {shippingMethods.map((method) => {
          const open = openId === method.id
          return (
            <article className={open ? 'open' : ''} key={method.id}>
              <button type="button" onClick={() => setOpenId(open ? '' : method.id)}>
                <b>{open ? '-' : '+'}</b>
                <span>{method.title} {method.price === 0 ? '(free)' : ''}<small><Clock3 size={18} />{method.summary}</small></span>
              </button>
              {open && <div><p>{method.detail}</p><p>If we are experiencing a high volume of orders, shipments may be delayed by a few days. We will contact you via email or telephone if there is a significant delay.</p></div>}
            </article>
          )
        })}
      </section>
      <button className="pickup-inline-button" type="button" onClick={onOpenPickup}><Store size={19} /> Select pickup location</button>
    </main>
  )
}

function FaqPage() {
  const faqs = [
    ['Do you deliver to me?', 'Enter your postal code on the cart page to estimate available delivery rates and timing.'],
    ['When do you deliver?', 'Customers can choose local delivery, domestic shipping, or pickup depending on location and stock availability.'],
    ['What is meal delivery?', 'Meal delivery includes prepared fresh picks and pantry staples packed for convenient weeknight planning.'],
    ["What's the order minimum?", 'There is no order minimum, but orders over $75 qualify for free shipping where available.'],
    ['Delivery of ingredients, what is that?', 'We pack fresh ingredients for recipes and daily meals so you can cook without extra store runs.'],
    ['Grocery delivery', 'Grocery delivery is available for selected service zones and is calculated at checkout.'],
  ]
  const [openIndex, setOpenIndex] = useState(1)
  const [sent, setSent] = useState(false)
  return (
    <main className="info-page container">
      <div className="breadcrumbs"><a href="/">Home</a><ChevronRight size={13} /><b>Frequently asked questions</b></div>
      <h1>Frequently asked questions</h1>
      <section className="faq-layout">
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <article className={openIndex === index ? 'open' : ''} key={question}>
              <button type="button" onClick={() => setOpenIndex(openIndex === index ? -1 : index)}><b>{openIndex === index ? '-' : '+'}</b>{question}</button>
              {openIndex === index && <p>{answer}</p>}
            </article>
          ))}
        </div>
        <form className="ask-card" onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
          <h2>Do not find the answer? Ask us.</h2>
          <input required placeholder="Name" />
          <input required type="email" placeholder="Email" />
          <textarea required placeholder="Message" />
          <button type="submit">Submit</button>
          {sent && <p>Question received. We will reply by email.</p>}
        </form>
      </section>
    </main>
  )
}

function BlogIndexPage({ type, articles }) {
  const isRecipes = type === 'recipe'
  const list = articles.filter((article) => article.type === type)
  return (
    <main className="info-page container">
      <div className="breadcrumbs"><a href="/">Home</a><ChevronRight size={13} /><b>{isRecipes ? 'Recipes' : 'News'}</b></div>
      <h1>{isRecipes ? 'Recipes' : 'News'}</h1>
      <section className="article-grid-page">
        {list.length ? list.map((article) => (
          <a className="article-list-card" href={isRecipes ? `/blogs/recipes/${article.slug}` : `/blogs/news/${article.slug}`} key={article.slug}>
            <img src={article.image} alt="" />
            <h2>{article.title}</h2>
            <small>{article.date}</small>
            <p>{article.excerpt}</p>
          </a>
        )) : <p className="article-empty">No {isRecipes ? 'recipes' : 'articles'} are published yet.</p>}
      </section>
    </main>
  )
}

function ArticlePage({ article, articles }) {
  if (!article) {
    return (
      <main className="info-page container">
        <div className="breadcrumbs"><a href="/">Home</a><ChevronRight size={13} /><b>Article</b></div>
        <h1>Article not found</h1>
        <a className="dark-button" href="/blog">Back to blog</a>
      </main>
    )
  }

  const related = articles.filter((item) => item.slug !== article.slug && item.type === article.type).slice(0, 2)
  return (
    <main className="article-page container">
      <div className="breadcrumbs"><a href="/">Home</a><ChevronRight size={13} /><a href={article.type === 'recipe' ? '/recipes' : '/blog'}>{article.type === 'recipe' ? 'Recipes' : 'News'}</a><ChevronRight size={13} /><b>{article.title}</b></div>
      <h1>{article.title}</h1>
      <p className="article-meta">{article.date} | {article.author}</p>
      <img className="article-hero" src={article.image} alt="" />
      <section className="article-body">
        <div>
          <h2>{article.intro || article.excerpt}</h2>
          <p>{article.excerpt} Our kitchen team keeps the preparation simple, seasonal and flexible for everyday cooking.</p>
          {article.type === 'recipe' && (
            <>
              <h3>Ingredients:</h3>
              <ul>{article.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul>
              <h3>Preparation</h3>
              <ol>
                <li>Prepare your ingredients and season everything with salt, pepper and olive oil.</li>
                <li>Cook the main ingredient until golden and tender, then let it rest briefly.</li>
                <li>Assemble with fresh vegetables, sauces and warm bread or grains.</li>
                <li>Serve immediately while the texture is bright and fresh.</li>
              </ol>
            </>
          )}
        </div>
        <aside>
          <b>Share</b>
          <span>f x p</span>
          <b>Tags</b>
          {article.tags.map((tag) => <em key={tag}>{tag}</em>)}
        </aside>
      </section>
      <section className="more-articles">
        <h2>{article.type === 'recipe' ? 'Check out more recipes' : 'More articles'}</h2>
        <div>{related.map((item) => <a className="article-list-card" href={item.type === 'recipe' ? `/blogs/recipes/${item.slug}` : `/blogs/news/${item.slug}`} key={item.slug}><img src={item.image} alt="" /><h3>{item.title}</h3><p>{item.excerpt}</p></a>)}</div>
      </section>
      {article.type === 'news' && (
        <section className="comments-section">
          <h2>Comments (3)</h2>
          {['Thank you for your blog posts.', 'I really like the image you have chosen for this post.', 'Love the desserts! A great meal always needs a great dessert.'].map((comment) => <p key={comment}>{comment}</p>)}
          <h2>Leave a comment</h2>
          <form><input placeholder="Name" /><input placeholder="Email" /><textarea placeholder="Message" /><button type="button">Submit Comment</button></form>
          <small>Please note: comments must be approved before they are published</small>
        </section>
      )}
    </main>
  )
}

function SelectPickupModal({ selectedId, onSelect, onClose }) {
  const [expandedId, setExpandedId] = useState('')
  return (
    <div className="pickup-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="pickup-modal">
        <div className="pickup-head"><h2>Select pickup location</h2><button type="button" onClick={onClose} aria-label="Close pickup selector"><X size={30} /></button></div>
        <div className="pickup-layout">
          <StoreMapMock />
          <div className="pickup-list">
            {storeLocations.map((location) => {
              const expanded = expandedId === location.id
              return (
                <article className={expanded ? 'open' : ''} key={location.id}>
                  <div className="pickup-row">
                    <label><input type="checkbox" checked={selectedId === location.id} onChange={() => onSelect(location)} /><span><b>{location.name}</b>{location.price ? formatPrice(location.price).replace('.00', '') : 'Free'}. {location.ready}</span></label>
                    <button type="button" onClick={() => setExpandedId(expanded ? '' : location.id)}>{expanded ? '-' : '+'}</button>
                  </div>
                  {expanded && (
                    <div className="pickup-details">
                      <p>{location.address}<br />{location.city}</p>
                      <b>Store Hours</b>
                      {location.hours.map((line) => <span key={line}>{line}</span>)}
                      <img src={location.image} alt="" />
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

function ProductsPage({ categories, products, onAdd, copy = storefrontI18n.en }) {
  const initialCategory = new URLSearchParams(window.location.search).get('category') || ''
  const [sort, setSort] = useState('featured')
  const [query, setQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : [])
  const [availability, setAvailability] = useState([])
  const [allergens, setAllergens] = useState([])
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(null)
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const pageSize = 6
  const pageTitle = selectedCategories.length === 1 ? selectedCategories[0] : 'All products'

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (selectedCategories.length === 1) params.set('category', selectedCategories[0])
    else params.delete('category')
    window.history.replaceState(null, '', `${window.location.pathname}${params.size ? `?${params}` : ''}`)
    document.title = `${pageTitle} | LyLy Fresh Market`
  }, [pageTitle, selectedCategories])

  const catalogPriceMax = useMemo(() => {
    const highest = Math.max(...products.map((product) => product.price), 0)
    return Math.max(20, Math.ceil(highest / 10) * 10)
  }, [products])

  const categoryOptions = useMemo(() => {
    const names = new Set(products.map((product) => product.category))
    selectedCategories.forEach((category) => names.add(category))
    return [...names].sort()
  }, [products, selectedCategories])

  const toggle = (setter, value) => {
    setter((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
    setPage(1)
  }

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const upperPrice = priceMax ?? catalogPriceMax
    const result = products.filter((product) => {
      const meta = getCatalogMeta(product)
      return (!normalizedQuery || `${product.name} ${product.category}`.toLowerCase().includes(normalizedQuery))
        && (!selectedCategories.length || selectedCategories.some((category) => categoryIncludesProduct(category, product.category, categories)))
        && (!availability.length || availability.includes(product.stock === 0 ? 'out' : 'in'))
        && product.price >= priceMin
        && product.price <= upperPrice
        && allergens.every((allergen) => meta.allergens.includes(allergen))
    })

    return [...result].sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price
      if (sort === 'price-high') return b.price - a.price
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'name-desc') return b.name.localeCompare(a.name)
      return Number(a.stock === 0) - Number(b.stock === 0) || a.id - b.id
    })
  }, [allergens, availability, catalogPriceMax, categories, priceMax, priceMin, products, query, selectedCategories, sort])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visibleProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const categoryCount = (category) => products.filter((product) => categoryIncludesProduct(category, product.category, categories)).length
  const allergenCount = (allergen) => products.filter((product) => getCatalogMeta(product).allergens.includes(allergen)).length
  const resetFilters = () => {
    setQuery('')
    setSelectedCategories([])
    setAvailability([])
    setAllergens([])
    setPriceMin(0)
    setPriceMax(null)
    setSort('featured')
    setPage(1)
  }

  return (
    <main className="catalog-page">
      <section className="catalog-head container">
        <div className="breadcrumbs"><a href="/">Home</a><span>/</span><a href="/collections">Collections</a><span>/</span><b>{pageTitle}</b></div>
        <h1>{pageTitle}</h1>
        <p>Explore groceries selected for freshness, flavor and everyday ease.</p>
      </section>

      <section className="catalog-toolbar container">
        <label className="catalog-search"><Search size={18} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search this collection" /></label>
        <button className="catalog-filter-button" type="button" onClick={() => setFiltersOpen(true)}><Filter size={17} /> Filters</button>
        <label className="catalog-sort"><span>Sort by:</span><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1) }}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A-Z</option><option value="name-desc">Name: Z-A</option></select></label>
      </section>

      <section className="catalog-layout container">
        {filtersOpen && <button className="catalog-filter-overlay" type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)} />}
        <aside className={`catalog-sidebar ${filtersOpen ? 'open' : ''}`}>
          <div className="catalog-sidebar-head"><b>Filter products</b><button type="button" onClick={() => setFiltersOpen(false)}><X size={18} /></button></div>
          <button className="catalog-reset" type="button" onClick={resetFilters}><RotateCcw size={14} /> Reset all</button>
          <details open>
            <summary>Price</summary>
            <div className="catalog-price-inputs">
              <label><span>$</span><input type="number" min="0" max={catalogPriceMax} value={priceMin} onChange={(event) => { setPriceMin(Math.min(Number(event.target.value), priceMax ?? catalogPriceMax)); setPage(1) }} /></label>
              <i>to</i>
              <label><span>$</span><input type="number" min={priceMin} max={catalogPriceMax} value={priceMax ?? catalogPriceMax} onChange={(event) => { setPriceMax(Math.max(Number(event.target.value), priceMin)); setPage(1) }} /></label>
            </div>
            <div className="catalog-range">
              <input aria-label="Minimum price" type="range" min="0" max={catalogPriceMax} value={priceMin} onChange={(event) => { setPriceMin(Math.min(Number(event.target.value), priceMax ?? catalogPriceMax)); setPage(1) }} />
              <input aria-label="Maximum price" type="range" min="0" max={catalogPriceMax} value={priceMax ?? catalogPriceMax} onChange={(event) => { setPriceMax(Math.max(Number(event.target.value), priceMin)); setPage(1) }} />
            </div>
          </details>
          <details open>
            <summary>Product type</summary>
            {categoryOptions.map((category) => <FilterCheckbox key={category} label={category} count={categoryCount(category)} checked={selectedCategories.includes(category)} onChange={() => toggle(setSelectedCategories, category)} />)}
          </details>
          <details open>
            <summary>Availability</summary>
            <FilterCheckbox label="In stock" count={products.filter((product) => product.stock !== 0).length} checked={availability.includes('in')} onChange={() => toggle(setAvailability, 'in')} />
            <FilterCheckbox label="Out of stock" count={products.filter((product) => product.stock === 0).length} checked={availability.includes('out')} onChange={() => toggle(setAvailability, 'out')} />
          </details>
          <details open>
            <summary>Allergens & dietary</summary>
            {allergenOptions.map((allergen) => <FilterCheckbox key={allergen} label={allergen} count={allergenCount(allergen)} checked={allergens.includes(allergen)} onChange={() => toggle(setAllergens, allergen)} />)}
          </details>
        </aside>

        <div className="catalog-results">
          <div className="catalog-results-head"><b>{filteredProducts.length} products</b><span>Fresh picks from LyLy Market</span></div>
          {visibleProducts.length ? (
            <div className="catalog-grid">{visibleProducts.map((product) => <CatalogProductCard key={product.id} product={product} onAdd={onAdd} copy={copy} />)}</div>
          ) : (
            <div className="catalog-empty"><Search size={30} /><h2>No products found</h2><p>Try changing or clearing your filters.</p><button type="button" onClick={resetFilters}>Reset filters</button></div>
          )}
          {totalPages > 1 && (
            <div className="catalog-pagination">
              <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={16} /> Previous</button>
              {Array.from({ length: totalPages }, (_, index) => <button className={currentPage === index + 1 ? 'active' : ''} type="button" onClick={() => setPage(index + 1)} key={index + 1}>{index + 1}</button>)}
              <button type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Next <ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      </section>

      <section className="catalog-benefits">
        <div><ShoppingBag size={28} /><span><b>Local pickup</b><small>Collect orders when it suits you</small></span></div>
        <div><Package size={28} /><span><b>Local delivery</b><small>Packed with care at every step</small></span></div>
        <div><Leaf size={28} /><span><b>Conscious choices</b><small>Sourced from growers we trust</small></span></div>
        <div><ShieldCheck size={28} /><span><b>Quality checked</b><small>Fresh food for your table</small></span></div>
      </section>
    </main>
  )
}

function ProductDetailPage({ product, products, onAdd, onBuyNow, copy = storefrontI18n.en }) {
  const [selectedVariantId, setSelectedVariantId] = useState(getDefaultVariant(product)?.id || '')
  const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariantId) || getDefaultVariant(product)
  const selected = productSelection(product, selectedVariant)
  const images = productImages(product)
  const [activeImage, setActiveImage] = useState(selected.image || images[0] || product.image)
  const [quantity, setQuantity] = useState(1)
  const meta = getCatalogMeta(product)
  const detailDescription = getProductDetailDescription(product, meta)
  const sale = Boolean(selected.oldPrice)
  const savings = sale ? Number(selected.oldPrice) - Number(selected.price) : 0
  const related = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4)

  useEffect(() => {
    document.title = `${product.name} | LyLy Fresh Market`
  }, [product.name])

  return (
    <main className="product-detail-page">
      <section className="product-detail-layout container">
        <div className="breadcrumbs"><a href="/">Home</a><ChevronRight size={13} /><a href={catalogHref(product.category)}>{product.category}</a><ChevronRight size={13} /><b>{product.name}</b></div>
        <div className="product-detail-gallery">
          <div className="product-detail-main-image">
            <img src={activeImage} alt={product.name} />
          </div>
          {images.length > 1 && (
            <div className="product-detail-thumbs">
              {images.map((image) => <button className={image === activeImage ? 'active' : ''} type="button" onClick={() => setActiveImage(image)} key={image}><img src={image} alt="" /></button>)}
            </div>
          )}
        </div>
        <article className="product-detail-panel">
          <p className="quick-product-price">
            <strong>{formatPrice(selected.price)}</strong>
            {sale && <span><del>{formatPrice(Number(selected.oldPrice))}</del><small>you save {formatPrice(savings)}</small></span>}
          </p>
          <h1>{product.name}</h1>
          <div className="catalog-rating" aria-label={`${meta.rating} out of 5 stars, ${meta.reviews} reviews`}>
            <span>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < meta.rating ? 'currentColor' : 'none'} />)}</span>
            <small>({meta.reviews})</small>
          </div>
          <ProductDetailDescription detail={detailDescription} />

          {productHasVariants(product) ? (
            <div className="quick-product-style detail-options">
              <span>{product.options?.map((option) => option.name).filter(Boolean).join(' / ') || 'Options'}</span>
              {product.variants.map((variant) => {
                const item = productSelection(product, variant)
                return <button className={variant.id === selectedVariant?.id ? 'active' : ''} disabled={item.stock === 0} type="button" onClick={() => { setSelectedVariantId(variant.id); if (item.image) setActiveImage(item.image) }} key={variant.id}>{variantLabel(product, variant)}</button>
              })}
            </div>
          ) : (
            <div className="quick-product-style detail-options"><span>Unit</span><button className="active" type="button">{product.unit}</button></div>
          )}

          <p className="product-detail-stock">{selected.stock > 0 ? `${selected.stock} in stock` : 'Currently unavailable'}</p>
          <div className="quick-product-actions">
            <div className="quick-qty">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={16} /></button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)}><Plus size={16} /></button>
            </div>
            <button className="quick-add-cart" type="button" disabled={selected.stock === 0} onClick={() => onAdd(product, quantity, true, selectedVariant)}>{copy.product.addToCart}</button>
            <button className="quick-buy-now" type="button" disabled={selected.stock === 0} onClick={() => onBuyNow(product, quantity, selectedVariant)}>Buy it now</button>
          </div>
        </article>
      </section>

      {related.length > 0 && (
        <section className="section products-section">
          <div className="container section-heading"><div><p className="eyebrow">Goes well with</p><h2>You may also like</h2></div><a href={catalogHref(product.category)}>View collection <ArrowRight size={17} /></a></div>
          <div className="container product-grid">{related.map((item) => <ProductCard product={item} onAdd={onAdd} copy={copy} key={item.id} />)}</div>
        </section>
      )}
    </main>
  )
}

function AboutPage({ products, onAdd, copy = storefrontI18n.en }) {
  const favorites = products.filter((product) => product.stock !== 0).slice(0, 4)

  useEffect(() => {
    document.title = 'About Us | LyLy Fresh Market'
  }, [])

  return (
    <main className="about-page">
      <section className="about-head container">
        <div className="breadcrumbs"><a href="/">Home</a><ChevronRight size={13} /><b>About Us</b></div>
        <h1>About Us</h1>
      </section>
      <section className="about-intro container">
        <h2>Many local growers and food makers need a simpler way to bring fresh, honest products to everyday shoppers.</h2>
        <p>LyLy Fresh Market connects carefully selected producers with customers who care about freshness, transparency, and practical everyday food. We keep the catalog focused, the sourcing clear, and the delivery experience simple.</p>
        <p>Our work starts with dependable ingredients and ends with a basket that feels easy to trust. From bakery staples to seasonal produce, each product is chosen for quality, consistency, and usefulness in a real kitchen.</p>
      </section>
      <section className="about-feature">
        <div className="container about-feature-row">
          <div>
            <p className="eyebrow">Local resources</p>
            <h2>Fresh food with a closer supply chain.</h2>
            <p>We prioritize producers and distributors that can keep products traceable, reduce unnecessary handling, and deliver better freshness from market to table.</p>
            <a className="dark-button" href="/products">Shop local picks</a>
          </div>
          <img src="https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=900&q=88" alt="Fresh green fern leaf" />
        </div>
      </section>
      <section className="about-feature alternate">
        <div className="container about-feature-row">
          <img src="https://images.unsplash.com/photo-1514517220039-0f8a2d8a6f32?auto=format&fit=crop&w=900&q=88" alt="Natural wood texture" />
          <div>
            <p className="eyebrow">Sustainable choices</p>
            <h2>Better routines, less waste.</h2>
            <p>We build the store around food people actually use, flexible pickup and delivery, and a product range that supports thoughtful weekly shopping.</p>
            <a className="dark-button" href="/delivery">Delivery options</a>
          </div>
        </div>
      </section>
      <section className="section products-section">
        <div className="container section-heading">
          <div><p className="eyebrow">Our favourites</p><h2>Products we reach for often</h2></div>
          <a href="/products">View all products <ArrowRight size={17} /></a>
        </div>
        <div className="container product-grid">{favorites.map((product) => <ProductCard product={product} onAdd={onAdd} copy={copy} key={product.id} />)}</div>
      </section>
    </main>
  )
}

function CollectionsPage({ categories }) {
  const groups = useMemo(() => buildCollectionGroups(categories), [categories])
  const collectionCount = groups.reduce((total, group) => total + group.children.length, 0)

  useEffect(() => {
    document.title = 'Collections | LyLy Fresh Market'
  }, [])

  return (
    <main className="collections-page">
      <section className="collections-head container">
        <div className="breadcrumbs"><a href="/">Home</a><span>/</span><b>Collections</b></div>
        <div className="collections-intro">
          <div>
            <p className="eyebrow">Explore the market</p>
            <h1>Collections</h1>
            <p>Discover fresh groceries organized for an easier everyday shop.</p>
          </div>
          <span>{collectionCount} curated collections</span>
        </div>
      </section>

      <div className="collections-layout container">
        {groups.map((group) => (
          <section className="collection-group" key={group.id || group.name}>
            <div className="collection-group-heading">
              <h2>{group.name}</h2>
              <span>{group.children.length} collections</span>
            </div>
            <div className="collections-grid">
              {group.children.map((category, index) => (
                <a className="collection-card" href={catalogHref(category.name)} key={category.id || category.name}>
                  <div className="collection-card-image">
                    <img src={getCategoryImage(category, index)} alt={category.name} />
                    <span>Explore collection</span>
                  </div>
                  <div className="collection-card-body">
                    <h3>{category.name}</h3>
                    <ArrowRight size={18} />
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="catalog-benefits">
        <div><ShoppingBag size={28} /><span><b>Local pickup</b><small>Collect orders when it suits you</small></span></div>
        <div><Package size={28} /><span><b>Local delivery</b><small>Packed with care at every step</small></span></div>
        <div><Leaf size={28} /><span><b>Conscious choices</b><small>Sourced from growers we trust</small></span></div>
        <div><ShieldCheck size={28} /><span><b>Quality checked</b><small>Fresh food for your table</small></span></div>
      </section>
    </main>
  )
}

const PAYMENT_METHODS = [
  { id: 'momo', label: 'MoMo', logoType: 'momo', promo: 'Discount available on qualifying orders', promoColor: '#a50064' },
  { id: 'zalopay', label: 'ZaloPay', logoType: 'zalopay', promo: 'Flat-rate shipping when paying with ZaloPay', promoColor: '#0068ff' },
  { id: 'shopeepay', label: 'ShopeePay', logoType: 'shopeepay', promo: '5% cashback on your first ShopeePay transaction', promoColor: '#ee4d2d' },
  { id: 'vnpay', label: 'VNPAY-QR', logoType: 'vnpay', promo: 'Scan QR code with any banking app', promoColor: '#1a56a4' },
  { id: 'cod', label: 'Cash on Delivery (COD)', logoType: 'cod', promo: null, promoColor: null },
  { id: 'transfer', label: 'Bank Transfer', logoType: 'transfer', promo: 'Account details shown after order placement', promoColor: null },
]

function PaymentLogo({ type }) {
  if (type === 'momo') return (
    <svg className="pay-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#a50064"/>
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="17" fontWeight="800" fontFamily="Arial,sans-serif">M</text>
    </svg>
  )
  if (type === 'zalopay') return (
    <svg className="pay-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#0068ff"/>
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="17" fontWeight="800" fontFamily="Arial,sans-serif">Z</text>
    </svg>
  )
  if (type === 'shopeepay') return (
    <svg className="pay-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#ee4d2d"/>
      <text x="20" y="27" textAnchor="middle" fill="white" fontSize="13" fontWeight="800" fontFamily="Arial,sans-serif">SPay</text>
    </svg>
  )
  if (type === 'vnpay') return (
    <svg className="pay-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#1a56a4"/>
      <rect x="0" y="27" width="40" height="13" rx="0" fill="#d0001c" ry="0"/>
      <rect x="0" y="27" width="40" height="13" rx="0" ry="8" fill="#d0001c"/>
      <text x="20" y="21" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="Arial,sans-serif">VN</text>
      <text x="20" y="36" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="Arial,sans-serif">PAY</text>
    </svg>
  )
  if (type === 'cod') return (
    <svg className="pay-logo pay-logo-light" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#e8f3ec"/>
      <path d="M10 15h20M10 15v12h20V15M10 15l3-4h14l3 4M16 24v-4h8v4" stroke="#4e795d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  if (type === 'transfer') return (
    <svg className="pay-logo pay-logo-light" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#eef0f5"/>
      <path d="M9 20h22M9 20l4-4M9 20l4 4M31 14H18M31 26H18" stroke="#4a5568" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  return null
}

const DELIVERY_SLOTS = [
  'Sớm nhất có thể (30–60 phút)',
  'Khung 10:00 – 12:00',
  'Khung 12:00 – 14:00',
  'Khung 14:00 – 16:00',
  'Khung 16:00 – 18:00',
  'Khung 18:00 – 20:00',
]

const VN_CITIES = [
  'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng',
  'Biên Hòa', 'Thủ Đức', 'Nha Trang', 'Huế', 'Vũng Tàu',
  'Quy Nhơn', 'Đà Lạt', 'Buôn Ma Thuột', 'Pleiku', 'Vinh',
  'Hạ Long', 'Thái Nguyên', 'Nam Định', 'Thanh Hóa', 'Khác',
]

function CheckoutModal({ items, discounts, initialDiscountCode = '', user, profile = {}, onClose, onComplete, onUpdateQuantity, copy = storefrontI18n.en }) {
  const [form, setForm] = useState({
    name: user ? getAccountName(user, profile) : '', email: user?.email || '', phone: '',
    address: '', apartment: '', city: '', postalCode: '',
    deliveryMethod: 'local', deliverySlot: DELIVERY_SLOTS[0],
    pickupStoreId: storeLocations[0].id,
    paymentMethod: 'momo',
    notes: '',
  })
  const [checkoutDiscountDraft, setCheckoutDiscountDraft] = useState('')
  const [checkoutDiscountCode, setCheckoutDiscountCode] = useState(initialDiscountCode)
  const [checkoutDiscountError, setCheckoutDiscountError] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [order, setOrder] = useState(null)
  const [confirmClose, setConfirmClose] = useState(false)
  const [showAllPayments, setShowAllPayments] = useState(false)

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const baseDeliveryFee = form.deliveryMethod === 'pickup' || subtotal >= 75 ? 0 : 8
  const totals = CartTotals({ subtotal, discountCode: checkoutDiscountCode, discounts, items, deliveryFee: baseDeliveryFee })
  const discount = totals.discount
  const deliveryFee = Math.max(0, baseDeliveryFee - totals.shippingDiscount)
  const tax = (subtotal - discount) * 0.0825
  const total = subtotal - discount + deliveryFee + tax
  const checkoutDiscountHint = discounts.find((d) => d.method !== 'automatic' && isDiscountActive(d))?.code
    ? copy.checkout.discountHint(discounts.find((d) => d.method !== 'automatic' && isDiscountActive(d)).code)
    : ''
  const selectedStore = storeLocations.find((s) => s.id === form.pickupStoreId) || storeLocations[0]

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const applyCheckoutDiscount = () => {
    const normalized = checkoutDiscountDraft.trim().toUpperCase()
    const result = CartTotals({ subtotal, discountCode: normalized, discounts, items, deliveryFee: baseDeliveryFee })
    if (!result.discountObject) { setCheckoutDiscountError(copy.checkout.discountUnavailable); return }
    setCheckoutDiscountCode(normalized)
    setCheckoutDiscountError('')
  }
  const handleClose = () => {
    if (order) { onClose(); return }
    setConfirmClose(true)
  }
  const submit = async (event) => {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    try {
      const createdOrder = await createStorefrontOrder({ ...form, discountCode: checkoutDiscountCode, totals: { subtotal, discount, deliveryFee, tax, total } }, items)
      setOrder(createdOrder)
      setStatus('success')
      onComplete()
    } catch (error) {
      console.error(error)
      setMessage(error.message || copy.checkout.orderError)
      setStatus('error')
    }
  }

  return (
    <div className="checkout-overlay" onMouseDown={(event) => event.target === event.currentTarget && handleClose()}>
      <section className="checkout-modal">
        {confirmClose && (
          <div className="checkout-confirm-close">
            <div className="checkout-confirm-box">
              <h3>Rời trang thanh toán?</h3>
              <p>Thông tin bạn đã nhập sẽ không được lưu lại.</p>
              <div>
                <button type="button" className="checkout-confirm-stay" onClick={() => setConfirmClose(false)}>Tiếp tục thanh toán</button>
                <button type="button" className="checkout-confirm-leave" onClick={onClose}>Rời khỏi</button>
              </div>
            </div>
          </div>
        )}
        <div className="checkout-header">
          <div><p>{copy.checkout.secureCheckout}</p><h2>{order ? copy.checkout.orderReceived : copy.cart.checkout}</h2></div>
          <button type="button" onClick={handleClose} aria-label={copy.checkout.closeCheckout}><X size={20} /></button>
        </div>
        {order ? (
          <div className="checkout-success">
            <ShieldCheck size={42} />
            <p>{copy.checkout.orderCreatedPrefix} <b>{order.order_number}</b> {copy.checkout.orderCreatedSuffix}</p>
            <span>{copy.checkout.confirmation}</span>
            <button type="button" onClick={onClose}>{copy.cart.continueShopping}</button>
          </div>
        ) : (
          <form className="checkout-form" onSubmit={submit}>
            <div className="checkout-main">
              <div className="checkout-fields">
                <div className="checkout-steps">
                  <span className="active">{copy.cart.cart}</span>
                  <span className="active">{copy.checkout.information}</span>
                  <span>{copy.checkout.payment}</span>
                </div>

                <fieldset>
                  <legend>Thông tin liên hệ</legend>
                  <p className="checkout-login-hint">
                    Đã có tài khoản? <button type="button" onClick={() => {}} className="checkout-login-link">Đăng nhập để tự động điền</button>
                  </p>
                  <label><span>Email *</span><input required type="email" name="email" value={form.email} onChange={change} placeholder="you@example.com" /></label>
                  <div className="checkout-grid">
                    <label><span>Họ và tên *</span><input required name="name" value={form.name} onChange={change} placeholder="Nguyễn Văn A" /></label>
                    <label><span>Số điện thoại *</span><input required name="phone" value={form.phone} onChange={change} placeholder="+84 xxx xxx xxx" /></label>
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Giao hàng</legend>
                  <div className="checkout-choice-grid">
                    <label className={form.deliveryMethod === 'local' ? 'selected' : ''}>
                      <input type="radio" name="deliveryMethod" value="local" checked={form.deliveryMethod === 'local'} onChange={change} />
                      <span><Truck size={18} /> Giao tận nơi <b>{subtotal - discount >= 75 ? 'Miễn phí' : formatPrice(8)}</b></span>
                    </label>
                    <label className={form.deliveryMethod === 'pickup' ? 'selected' : ''}>
                      <input type="radio" name="deliveryMethod" value="pickup" checked={form.deliveryMethod === 'pickup'} onChange={change} />
                      <span><Store size={18} /> Nhận tại cửa hàng <b>Miễn phí</b></span>
                    </label>
                  </div>

                  {form.deliveryMethod === 'local' && (
                    <>
                      <div className="checkout-delivery-eta">
                        <Clock3 size={14} />
                        <span>Thời gian giao hàng dự kiến: <b>30 – 60 phút</b></span>
                      </div>
                      <label>
                        <span>Khung giờ nhận hàng mong muốn</span>
                        <select name="deliverySlot" value={form.deliverySlot} onChange={change} className="checkout-select">
                          {DELIVERY_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                        </select>
                      </label>
                      <label><span>Địa chỉ *</span><input required name="address" value={form.address} onChange={change} placeholder="Số nhà, tên đường" /></label>
                      <div className="checkout-grid">
                        <label><span>Tầng / Căn hộ</span><input name="apartment" value={form.apartment} onChange={change} placeholder="Tùy chọn" /></label>
                        <label>
                          <span>Tỉnh / Thành phố *</span>
                          <select required name="city" value={form.city} onChange={change} className="checkout-select">
                            <option value="">Chọn thành phố</option>
                            {VN_CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
                          </select>
                        </label>
                      </div>
                      <label><span>Mã bưu chính</span><input name="postalCode" value={form.postalCode} onChange={change} placeholder="700000" /></label>
                    </>
                  )}

                  {form.deliveryMethod === 'pickup' && (
                    <div className="checkout-pickup-stores">
                      {storeLocations.map((loc) => (
                        <label key={loc.id} className={`checkout-pickup-option ${form.pickupStoreId === loc.id ? 'selected' : ''}`}>
                          <input type="radio" name="pickupStoreId" value={loc.id} checked={form.pickupStoreId === loc.id} onChange={change} />
                          <div className="pickup-option-info">
                            <b>{loc.name}</b>
                            <span>{loc.address}, {loc.city}</span>
                            <small>{loc.ready}</small>
                          </div>
                        </label>
                      ))}
                      <p className="checkout-pickup-note"><MapPin size={13} /> {selectedStore.name}: {selectedStore.address}, {selectedStore.city}</p>
                    </div>
                  )}
                </fieldset>

                <fieldset>
                  <legend>Thanh toán</legend>
                  <div className="checkout-payment-list">
                    {PAYMENT_METHODS.slice(0, 3).map((method) => (
                      <label key={method.id} className={`checkout-payment-option ${form.paymentMethod === method.id ? 'selected' : ''}`}>
                        <input type="radio" name="paymentMethod" value={method.id} checked={form.paymentMethod === method.id} onChange={change} />
                        <PaymentLogo type={method.logoType} />
                        <div className="payment-info">
                          <b>{method.label}</b>
                          {method.promo && <small style={method.promoColor ? { color: method.promoColor } : {}}>{method.promo}</small>}
                        </div>
                      </label>
                    ))}
                    {showAllPayments && PAYMENT_METHODS.slice(3).map((method) => (
                      <label key={method.id} className={`checkout-payment-option ${form.paymentMethod === method.id ? 'selected' : ''}`}>
                        <input type="radio" name="paymentMethod" value={method.id} checked={form.paymentMethod === method.id} onChange={change} />
                        <PaymentLogo type={method.logoType} />
                        <div className="payment-info">
                          <b>{method.label}</b>
                          {method.promo && <small style={method.promoColor ? { color: method.promoColor } : {}}>{method.promo}</small>}
                        </div>
                      </label>
                    ))}
                    <button type="button" className="payment-show-more" onClick={() => setShowAllPayments(!showAllPayments)}>
                      <ChevronDown size={14} style={{ transform: showAllPayments ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                      {showAllPayments ? 'Thu gọn' : `Xem thêm ${PAYMENT_METHODS.length - 3} hình thức khác`}
                    </button>
                  </div>
                  {form.paymentMethod === 'transfer' && (
                    <div className="checkout-transfer-note">
                      <ShieldCheck size={14} />
                      <span>Thông tin số tài khoản và cú pháp chuyển khoản sẽ hiển thị ngay sau khi bạn bấm "Đặt hàng".</span>
                    </div>
                  )}
                  {['momo', 'zalopay', 'shopeepay', 'vnpay'].includes(form.paymentMethod) && (
                    <div className="checkout-transfer-note qr-note">
                      <span>📱 <b>Mobile:</b> App ví sẽ được mở tự động sau khi đặt hàng.</span>
                      <span>💻 <b>Desktop:</b> Mã QR sẽ hiển thị để quét bằng điện thoại.</span>
                    </div>
                  )}
                  <label><span>Ghi chú đơn hàng</span><input name="notes" value={form.notes} onChange={change} placeholder="Hướng dẫn giao hàng hoặc yêu cầu đặc biệt" /></label>
                </fieldset>
              </div>

              <aside className="checkout-summary-panel">
                <h3>Tóm tắt đơn hàng</h3>
                <div className="checkout-review-items">
                  {items.map((item) => (
                    <div className="checkout-review-item" key={item.id}>
                      <img src={item.image} alt="" />
                      <span>
                        <b>{item.name}</b>
                        <small>{item.variantLabel || item.unit}</small>
                        {onUpdateQuantity && (
                          <div className="checkout-qty-ctrl">
                            <button type="button" onClick={() => onUpdateQuantity(item.id, -1)}><Minus size={11} /></button>
                            <em>{item.quantity}</em>
                            <button type="button" onClick={() => onUpdateQuantity(item.id, 1)}><Plus size={11} /></button>
                          </div>
                        )}
                      </span>
                      <strong>{formatPrice(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>
                <div className="checkout-discount"><span>{copy.cart.discountCode}</span></div>
                <DiscountCodeForm
                  value={checkoutDiscountDraft}
                  appliedCode={checkoutDiscountCode}
                  error={checkoutDiscountError}
                  hint={checkoutDiscountHint}
                  onChange={(value) => { setCheckoutDiscountDraft(value); setCheckoutDiscountError('') }}
                  onApply={applyCheckoutDiscount}
                  onRemove={() => { setCheckoutDiscountCode(''); setCheckoutDiscountError('') }}
                  compact
                  copy={copy}
                />
                <div className="checkout-totals">
                  <p><span>Tạm tính</span><b>{formatPrice(subtotal)}</b></p>
                  <p><span>Giảm giá</span><b>-{formatPrice(discount)}</b></p>
                  {totals.shippingDiscount > 0 && <p><span>Giảm phí ship</span><b>-{formatPrice(totals.shippingDiscount)}</b></p>}
                  <p><span>Giao hàng</span><b>{deliveryFee ? formatPrice(deliveryFee) : copy.cart.free}</b></p>
                  <p><span>Thuế ước tính</span><b>{formatPrice(tax)}</b></p>
                  <p className="grand-total"><span>Tổng cộng</span><b>{formatPrice(total)}</b></p>
                </div>
                {message && <p className="checkout-error">{message}</p>}
                <button type="submit" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Đang xử lý...' : 'Đặt hàng'} <ArrowRight size={17} />
                </button>
                <div className="checkout-trust-badges">
                  <span><ShieldCheck size={13} /> Thanh toán bảo mật SSL</span>
                  <span>🔒 Dữ liệu mã hóa 256-bit</span>
                  <span>✓ Xác thực Visa / MC</span>
                </div>
              </aside>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}

const storefrontI18n = {
  en: {
    langLabel: 'English', langCode: 'EN',
    announcement: 'Save 20% with code:',
    nav: { categories: 'Categories', aboutUs: 'About us', ourStores: 'Our stores', ourStoresSub: 'Find locations near you', faq: 'FAQ', faqSub: 'Common questions answered', recipes: 'Recipes', blog: 'Blog' },
    hero: { h1: ['Fresh.', 'Organic.', 'Delivered.'], sub: 'Thoughtfully sourced groceries for everyday living.', cta: 'Shop now' },
    benefits: [
      { label: 'Free local delivery', sub: 'On orders over $75' },
      { label: 'Freshness guaranteed', sub: 'From trusted growers' },
      { label: 'Pickup when it suits', sub: '7 days a week' },
      { label: 'Secure checkout', sub: 'Simple and protected' },
    ],
    sections: { findFav: 'Find your favorites', byCategory: 'Shop by Category', viewAllCat: 'View all categories', lovedBy: 'Loved by locals', bestSellers: 'Best Sellers', shopAll: 'Shop all products', arrowRight: '' },
    search: { placeholder: 'Search for fresh products...', suggestions: 'Product suggestions', noResults: 'No products found.' },
    service: { pickup: 'Picking up?', delivery: 'Need delivery?', seeEstimates: 'See estimates' },
    common: { home: 'Home' },
    product: {
      save: 'Save',
      view: 'View',
      soldOut: 'Sold out',
      chooseOptions: 'Choose options',
      addToCart: 'Add to cart',
      options: 'options',
      onSale: 'On sale',
      fromOptions: 'from options',
      outOfFive: 'out of 5 stars',
      reviews: 'reviews',
      unavailable: 'Currently unavailable',
      localDelivery: 'Available for local delivery',
      closePreview: 'Close product preview',
      optionsLabel: 'Options',
      unit: 'Unit',
      buyNow: 'Buy now',
      viewDetails: 'View full details',
    },
    cart: {
      cart: 'Cart',
      shoppingCart: 'Shopping Cart',
      closeCart: 'Close cart',
      product: 'Product',
      quantity: 'Quantity',
      total: 'Total',
      style: 'Style',
      remove: 'Remove',
      empty: 'Your cart is empty.',
      continueShopping: 'Continue shopping',
      relatedProducts: 'Related products',
      estimateShipping: 'Estimate shipping',
      country: 'Country',
      postalCode: 'Postal/Zip Code',
      estimate: 'Estimate',
      postalRequired: 'Enter a postal or ZIP code to estimate shipping.',
      freeDomesticShipping: 'Free domestic shipping',
      domesticShipping: 'Domestic Shipping (US)',
      freeLocalDelivery: 'Free local delivery',
      localDelivery: 'Local Delivery',
      internationalDelivery: 'International Delivery',
      oneTwoDays: '1-2 business days',
      sameOrNextDay: 'Same day or next day',
      threeFiveDays: '3-5 business days',
      free: 'Free',
      selectStore: 'Select store',
      freeShippingProgress: (amount) => `You are ${amount} away from free shipping.`,
      subtotal: 'Subtotal',
      discounts: 'Discounts',
      orderInstructions: 'Order instructions',
      discountCodes: 'Discount codes',
      discountCode: 'Discount code',
      apply: 'Apply',
      removeDiscount: 'Remove discount code',
      taxNote: 'Tax included. Shipping calculated at checkout.',
      terms: 'I agree to the terms and conditions',
      checkout: 'Checkout',
    },
    checkout: {
      secureCheckout: 'Secure checkout',
      orderReceived: 'Order received',
      information: 'Information',
      payment: 'Payment',
      closeCheckout: 'Close checkout',
      orderCreatedPrefix: 'Your order',
      orderCreatedSuffix: 'has been created.',
      confirmation: 'We will contact you to confirm delivery and payment.',
      discountHint: (code) => `Use code ${code} for a fresh discount`,
      discountUnavailable: 'This discount code is not available.',
      orderError: 'Unable to place your order. Please try again.',
    },
    account: 'Account',
  },
  vi: {
    langLabel: 'Tiếng Việt', langCode: 'VI',
    announcement: 'Tiết kiệm 20% với mã:',
    nav: { categories: 'Danh mục', aboutUs: 'Về chúng tôi', ourStores: 'Cửa hàng', ourStoresSub: 'Tìm địa điểm gần bạn', faq: 'FAQ', faqSub: 'Câu hỏi thường gặp', recipes: 'Công thức', blog: 'Blog' },
    hero: { h1: ['Tươi.', 'Organic.', 'Giao tận nơi.'], sub: 'Thực phẩm tươi sạch, chọn lọc tỉ mỉ cho cuộc sống hàng ngày.', cta: 'Mua ngay' },
    benefits: [
      { label: 'Giao hàng miễn phí', sub: 'Đơn từ $75' },
      { label: 'Đảm bảo tươi sạch', sub: 'Từ nhà vườn uy tín' },
      { label: 'Nhận hàng linh hoạt', sub: '7 ngày trong tuần' },
      { label: 'Thanh toán an toàn', sub: 'Đơn giản & bảo mật' },
    ],
    sections: { findFav: 'Tìm món yêu thích', byCategory: 'Mua theo danh mục', viewAllCat: 'Xem tất cả danh mục', lovedBy: 'Được yêu thích nhất', bestSellers: 'Bán chạy nhất', shopAll: 'Xem tất cả sản phẩm', arrowRight: '' },
    search: { placeholder: 'Tìm kiếm thực phẩm tươi...', suggestions: 'Gợi ý sản phẩm', noResults: 'Không tìm thấy sản phẩm.' },
    service: { pickup: 'Nhận tại cửa hàng?', delivery: 'Giao hàng?', seeEstimates: 'Xem ước tính' },
    common: { home: 'Trang chủ' },
    product: {
      save: 'Lưu',
      view: 'Xem',
      soldOut: 'Hết hàng',
      chooseOptions: 'Chọn tùy chọn',
      addToCart: 'Thêm vào giỏ',
      options: 'tùy chọn',
      onSale: 'Đang giảm giá',
      fromOptions: 'từ tùy chọn',
      outOfFive: 'trên 5 sao',
      reviews: 'đánh giá',
      unavailable: 'Hiện chưa có hàng',
      localDelivery: 'Có thể giao tận nơi',
      closePreview: 'Đóng xem nhanh sản phẩm',
      optionsLabel: 'Tùy chọn',
      unit: 'Đơn vị',
      buyNow: 'Mua ngay',
      viewDetails: 'Xem chi tiết',
    },
    cart: {
      cart: 'Giỏ hàng',
      shoppingCart: 'Giỏ hàng',
      closeCart: 'Đóng giỏ hàng',
      product: 'Sản phẩm',
      quantity: 'Số lượng',
      total: 'Tổng',
      style: 'Phân loại',
      remove: 'Xóa',
      empty: 'Giỏ hàng của bạn đang trống.',
      continueShopping: 'Tiếp tục mua sắm',
      relatedProducts: 'Sản phẩm liên quan',
      estimateShipping: 'Ước tính phí giao hàng',
      country: 'Quốc gia',
      postalCode: 'Mã bưu chính',
      estimate: 'Ước tính',
      postalRequired: 'Nhập mã bưu chính để ước tính phí giao hàng.',
      freeDomesticShipping: 'Miễn phí giao hàng nội địa',
      domesticShipping: 'Giao hàng nội địa (US)',
      freeLocalDelivery: 'Miễn phí giao hàng nội thành',
      localDelivery: 'Giao hàng nội thành',
      internationalDelivery: 'Giao hàng quốc tế',
      oneTwoDays: '1-2 ngày làm việc',
      sameOrNextDay: 'Trong ngày hoặc ngày kế tiếp',
      threeFiveDays: '3-5 ngày làm việc',
      free: 'Miễn phí',
      selectStore: 'Chọn cửa hàng',
      freeShippingProgress: (amount) => `Bạn còn ${amount} để được miễn phí giao hàng.`,
      subtotal: 'Tạm tính',
      discounts: 'Giảm giá',
      orderInstructions: 'Ghi chú đơn hàng',
      discountCodes: 'Mã giảm giá',
      discountCode: 'Mã giảm giá',
      apply: 'Áp dụng',
      removeDiscount: 'Xóa mã giảm giá',
      taxNote: 'Đã bao gồm thuế. Phí giao hàng được tính khi thanh toán.',
      terms: 'Tôi đồng ý với điều khoản và điều kiện',
      checkout: 'Thanh toán',
    },
    checkout: {
      secureCheckout: 'Thanh toán bảo mật',
      orderReceived: 'Đã nhận đơn hàng',
      information: 'Thông tin',
      payment: 'Thanh toán',
      closeCheckout: 'Đóng thanh toán',
      orderCreatedPrefix: 'Đơn hàng',
      orderCreatedSuffix: 'đã được tạo.',
      confirmation: 'Chúng tôi sẽ liên hệ để xác nhận giao hàng và thanh toán.',
      discountHint: (code) => `Dùng mã ${code} để nhận ưu đãi`,
      discountUnavailable: 'Mã giảm giá này không khả dụng.',
      orderError: 'Không thể đặt hàng. Vui lòng thử lại.',
    },
    account: 'Tài khoản',
  },
}

function App() {
  const currentPath = window.location.pathname
  const productDetailMatch = currentPath.match(/^\/products\/([^/]+)/)
  const isProductsPage = currentPath === '/products'
  const isCollectionsPage = currentPath.startsWith('/collections')
  const isCartPage = currentPath.startsWith('/cart')
  const isAccountPage = currentPath.startsWith('/account')
  const isStoresPage = currentPath.startsWith('/our-stores') || currentPath.startsWith('/pages/our-stores')
  const isAboutPage = currentPath.startsWith('/about-us') || currentPath.startsWith('/pages/about-us')
  const isDeliveryPage = currentPath.startsWith('/delivery') || currentPath.startsWith('/pages/delivery')
  const isFaqPage = currentPath.startsWith('/faq') || currentPath.startsWith('/pages/faq')
  const isRecipesPage = currentPath === '/recipes' || currentPath === '/blogs/recipes'
  const isBlogPage = currentPath === '/blog' || currentPath === '/blogs/news'
  const recipeMatch = currentPath.match(/^\/blogs\/recipes\/([^/]+)/)
  const newsMatch = currentPath.match(/^\/blogs\/news\/([^/]+)/)
  const [lang, setLang] = useState(() => localStorage.getItem('lyly-lang') || 'en')
  const t = storefrontI18n[lang]
  const toggleLang = () => {
    const next = lang === 'en' ? 'vi' : 'en'
    setLang(next)
    localStorage.setItem('lyly-lang', next)
  }
  const [products, setProducts] = useState(fallbackProducts)
  const [categories, setCategories] = useState(fallbackCategories)
  const [discounts, setDiscounts] = useState(fallbackDiscounts)
  const [storeArticles, setStoreArticles] = useState(editorialArticles)
  const [storeSettings, setStoreSettings] = useState({})
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lyly-cart') || '[]')
    } catch {
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [quickProduct, setQuickProduct] = useState(null)
  const [pickupOpen, setPickupOpen] = useState(false)
  const [selectedPickup, setSelectedPickup] = useState(storeLocations[0])
  const [discountDraft, setDiscountDraft] = useState('')
  const [appliedDiscountCode, setAppliedDiscountCode] = useState('')
  const [discountError, setDiscountError] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [storefrontUser, setStorefrontUser] = useState(null)
  const [accountProfile, setAccountProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lyly-account-profile') || '{}')
    } catch {
      return {}
    }
  })
  const [accountAddresses, setAccountAddresses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lyly-account-addresses') || '[]')
    } catch {
      return []
    }
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('idle')
  const categoriesCloseTimer = useRef(null)
  const activeArticle = recipeMatch || newsMatch
    ? storeArticles.find((article) => article.slug === (recipeMatch?.[1] || newsMatch?.[1]))
    : null

  useEffect(() => {
    loadPublicProducts()
      .then((data) => data && setProducts(data))
      .catch((error) => console.error('Unable to load products from Supabase.', error))
    loadPublicCategories()
      .then((data) => data?.length && setCategories(data))
      .catch((error) => console.error('Unable to load categories from Supabase.', error))
    loadPublicDiscounts()
      .then((data) => data?.length && setDiscounts(data))
      .catch((error) => console.error('Unable to load discounts from Supabase.', error))
    loadPublicArticles()
      .then((data) => {
        if (!data?.length) return
        const hasRecipes = data.some((article) => article.type === 'recipe')
        const hasNews = data.some((article) => article.type === 'news')
        setStoreArticles([
          ...data,
          ...(!hasRecipes ? editorialArticles.filter((article) => article.type === 'recipe') : []),
          ...(!hasNews ? editorialArticles.filter((article) => article.type === 'news') : []),
        ])
      })
      .catch((error) => console.error('Unable to load articles from Supabase.', error))
    loadStoreSettings()
      .then((data) => data && setStoreSettings(data))
      .catch((error) => console.error('Unable to load store settings from Supabase.', error))
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined

    supabase.auth.getUser()
      .then(({ data }) => setStorefrontUser(data.user || null))
      .catch((error) => console.error('Unable to load storefront user.', error))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setStorefrontUser(session?.user || null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => () => clearTimeout(categoriesCloseTimer.current), [])
  useEffect(() => {
    localStorage.setItem('lyly-cart', JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    localStorage.setItem('lyly-account-profile', JSON.stringify(accountProfile))
  }, [accountProfile])
  useEffect(() => {
    localStorage.setItem('lyly-account-addresses', JSON.stringify(accountAddresses))
  }, [accountAddresses])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const discountHint = discounts.find((discount) => discount.method !== 'automatic' && isDiscountActive(discount))?.code
    ? t.checkout.discountHint(discounts.find((discount) => discount.method !== 'automatic' && isDiscountActive(discount)).code)
    : ''
  const publicGeneralSettings = storeSettings.general || {}
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return []
    return products.filter((product) =>
      `${product.name} ${product.category}`.toLowerCase().includes(query),
    )
  }, [products, search])
  const megaMenuGroups = useMemo(() => buildMegaMenuGroups(categories), [categories])
  const homepageCategories = useMemo(() => getHomepageCategories(categories), [categories])
  const menuItems = useMemo(() => {
    const managedItems = categories
      .filter((category) => category.includeInMenu && !category.parentId)
      .map((category) => ({ label: category.name, href: catalogHref(category.name) }))
    return managedItems.length ? [{ label: t.sections.shopAll, href: '/products' }, ...managedItems] : fallbackMenuItems
  }, [categories, t.sections.shopAll])
  const activeProduct = useMemo(() => {
    if (!productDetailMatch) return null
    const id = productDetailMatch[1].match(/^\d+/)?.[0]
    return products.find((product) => String(product.id) === id) || null
  }, [productDetailMatch, products])

  const addToCart = (product, quantity = 1, openCart = true, variant = getDefaultVariant(product)) => {
    const selected = productSelection(product, variant)
    if (selected.stock === 0) return
    const lineId = cartLineId(product, variant)

    setCart((current) => {
      const found = current.find((item) => item.id === lineId)
      if (found) {
        return current.map((item) =>
          item.id === lineId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...current, { ...product, ...selected, id: lineId, productId: product.id, quantity }]
    })
    setQuickProduct(null)
    if (openCart) setCartOpen(true)
  }

  const openQuickProduct = (product) => {
    if (productSelection(product).stock === 0) return
    setQuickProduct(product)
  }

  const buyNow = (product, quantity = 1, variant = getDefaultVariant(product)) => {
    addToCart(product, quantity, false, variant)
    setCheckoutOpen(true)
  }

  const reorderAccountOrder = (order) => {
    const orderProducts = (order.lineItems || [])
      .map((item) => {
        const product = products.find((candidate) =>
          String(candidate.id) === String(item.productId) ||
          candidate.name.toLowerCase() === String(item.name || '').split(' (')[0].toLowerCase(),
        )
        if (!product || productSelection(product).stock === 0) return null
        return { product, quantity: item.quantity }
      })
      .filter(Boolean)

    if (!orderProducts.length) return

    setCart((current) => {
      let next = [...current]
      orderProducts.forEach(({ product, quantity }) => {
        const variant = getDefaultVariant(product)
        const selected = productSelection(product, variant)
        const lineId = cartLineId(product, variant)
        const found = next.find((item) => item.id === lineId)
        if (found) {
          next = next.map((item) => item.id === lineId ? { ...item, quantity: item.quantity + quantity } : item)
        } else {
          next.push({ ...product, ...selected, id: lineId, productId: product.id, quantity })
        }
      })
      return next
    })
    setCartOpen(true)
  }

  const openCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  const selectPickup = (location) => {
    setSelectedPickup(location)
    setPickupOpen(false)
  }

  const applyDiscount = () => {
    const normalized = discountDraft.trim().toUpperCase()
    if (!normalized) {
      setDiscountError('')
      return
    }
    const result = CartTotals({ subtotal, discountCode: normalized, discounts, items: cart })
    if (!result.discountObject) {
      setDiscountError(t.checkout.discountUnavailable)
      return
    }
    setAppliedDiscountCode(normalized)
    setDiscountError('')
  }

  const removeDiscount = () => {
    setAppliedDiscountCode('')
    setDiscountError('')
  }

  const saveAccountProfile = async (profile) => {
    setAccountProfile(profile)
    if (isSupabaseConfigured && supabase) {
      const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ')
      const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } })
      if (error) console.error('Unable to update storefront profile.', error)
    }
  }

  const saveAccountAddress = (address) => {
    setAccountAddresses((current) => [
      { ...address, id: globalThis.crypto?.randomUUID?.() || `${Date.now()}` },
      ...current.map((item) => address.isDefault ? { ...item, isDefault: false } : item),
    ])
  }

  const signOutAccount = async () => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut()
      if (error) console.error('Unable to sign out storefront user.', error)
    }
    setStorefrontUser(null)
    setAccountOpen(false)
  }

  const updateQuantity = (id, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const submitNewsletter = async (event) => {
    event.preventDefault()
    setNewsletterStatus('submitting')

    try {
      await subscribeToNewsletter(newsletterEmail)
      setNewsletterStatus('success')
      setNewsletterEmail('')
    } catch (error) {
      console.error(error)
      setNewsletterStatus('error')
    }
  }

  const openCategories = () => {
    clearTimeout(categoriesCloseTimer.current)
    setCategoriesOpen(true)
  }

  const closeCategories = () => {
    clearTimeout(categoriesCloseTimer.current)
    setCategoriesOpen(false)
  }

  const closeCategoriesSoon = () => {
    clearTimeout(categoriesCloseTimer.current)
    categoriesCloseTimer.current = setTimeout(() => setCategoriesOpen(false), 180)
  }

  return (
    <div id="top">
      <div className="announcement">
        <div className="social-icons">
          <Mail size={15} />
          <b className="social-mark">f</b>
          <b className="social-mark">ig</b>
        </div>
        <p><ChevronLeft size={16} /> {t.announcement} <b>FRESH20</b> <ChevronRight size={16} /></p>
        <button className="lang-toggle" type="button" onClick={toggleLang}>{t.langCode} <ChevronDown size={13} /></button>
      </div>

      <header>
        <div className="header-main">
          <button className="mobile-only icon-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu />
          </button>
          <Logo />
          <div className="search-wrap">
            <Search size={20} />
            <input
              value={search}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.search.placeholder}
              aria-label={t.search.placeholder}
            />
            {searchOpen && search && (
              <div className="search-results">
                <div className="search-heading">{t.search.suggestions}</div>
                {searchResults.length ? searchResults.slice(0, 5).map((product) => (
                  <button type="button" disabled={product.stock === 0} key={product.id} onClick={() => addToCart(product)}>
                    <img src={product.image} alt="" />
                    <span><b>{product.name}</b><small>{product.category}</small></span>
                    <strong>{product.stock === 0 ? (lang === 'vi' ? 'Hết hàng' : 'Sold out') : formatPrice(product.price)}</strong>
                  </button>
                )) : <p>{t.search.noResults}</p>}
              </div>
            )}
          </div>
          <div className="header-actions">
            <button className="account-button desktop-only" type="button" onClick={() => setAccountOpen(true)}>
              <User size={21} /> {storefrontUser ? getAccountName(storefrontUser, accountProfile) : t.account}
            </button>
            <button className="cart-button" type="button" onClick={() => setCartOpen(true)}>
              <ShoppingCart size={20} />
              <span className="desktop-only">{formatPrice(subtotal)} ({cartCount})</span>
              <em className="mobile-only">{cartCount}</em>
            </button>
          </div>
        </div>
        <div className="header-nav">
          <nav>
            <div
              className={`categories-menu ${categoriesOpen ? 'open' : ''}`}
              onMouseEnter={openCategories}
              onMouseLeave={closeCategoriesSoon}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) closeCategories()
              }}
            >
              <a
                className="categories-trigger"
                href="/products"
                aria-expanded={categoriesOpen}
                aria-controls="categories-mega-menu"
                onClick={closeCategories}
              >
                {t.nav.categories} <ChevronDown size={15} />
              </a>
              <div className="categories-mega" id="categories-mega-menu">
                <div className="mega-menu-inner">
                  {megaMenuGroups.map((group) => (
                    <div className="mega-menu-column" key={group.title}>
                      <h3>{group.title}</h3>
                      {group.items.map((item) => <a href={catalogHref(item.category || group.category)} onClick={closeCategories} key={`${group.title}-${item.label || item}`}>{item.label || item}</a>)}
                      {group.secondary && (
                        <div className="mega-menu-secondary">
                          <h3>{group.secondary.title}</h3>
                          {group.secondary.items.map((item) => <a href={catalogHref(item.category || group.secondary.category)} onClick={closeCategories} key={`${group.secondary.title}-${item.label || item}`}>{item.label || item}</a>)}
                        </div>
                      )}
                    </div>
                  ))}
                  <a className="mega-menu-promo" href="/products" onClick={closeCategories}>
                    <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=88" alt="" />
                    <div>
                      <p>Healthy & Organic</p>
                      <h3>Fresh & Energetic</h3>
                      <span>Learn more</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="simple-nav-menu">
              <a href="/about-us">{t.nav.aboutUs} <ChevronDown size={15} /></a>
              <div className="about-dropdown">
                <a href="/our-stores" className="about-menu-item">
                  <span className="about-menu-icon"><Store size={17} /></span>
                  <span><b>{t.nav.ourStores}</b><small>{t.nav.ourStoresSub}</small></span>
                </a>
                <a href="/faq" className="about-menu-item">
                  <span className="about-menu-icon"><HelpCircle size={17} /></span>
                  <span><b>{t.nav.faq}</b><small>{t.nav.faqSub}</small></span>
                </a>
              </div>
            </div>
            <a href="/recipes">{t.nav.recipes}</a>
            <a href="/blog">{t.nav.blog}</a>
          </nav>
          <div className="service-links">
            <button type="button" onClick={() => setPickupOpen(true)}><Store size={28} /><span><small>{t.service.pickup}</small>{selectedPickup?.name || t.cart.selectStore} <ChevronDown size={14} /></span></button>
            <a href="/delivery"><Package size={28} /><span><small>{t.service.delivery}</small>{t.service.seeEstimates}</span></a>
          </div>
        </div>
      </header>

      {activeProduct ? <ProductDetailPage product={activeProduct} products={products} onAdd={addToCart} onBuyNow={buyNow} copy={t} /> : productDetailMatch ? (
      <main className="catalog-page"><section className="catalog-empty container"><Search size={30} /><h2>Product not found</h2><p>This product is no longer available.</p><a href="/products">Back to products</a></section></main>
      ) : isProductsPage ? <ProductsPage categories={categories} products={products} onAdd={openQuickProduct} copy={t} /> : isCollectionsPage ? <CollectionsPage categories={categories} /> : isStoresPage ? (
      <OurStoresPage />
      ) : isAboutPage ? (
      <AboutPage products={products} onAdd={openQuickProduct} copy={t} />
      ) : isDeliveryPage ? (
      <DeliveryPage onOpenPickup={() => setPickupOpen(true)} />
      ) : isFaqPage ? (
      <FaqPage />
      ) : isRecipesPage ? (
      <BlogIndexPage type="recipe" articles={storeArticles} />
      ) : isBlogPage ? (
      <BlogIndexPage type="news" articles={storeArticles} />
      ) : activeArticle ? (
      <ArticlePage article={activeArticle} articles={storeArticles} />
      ) : isAccountPage ? (
      <AccountPage
        user={storefrontUser}
        profile={accountProfile}
        addresses={accountAddresses}
        products={products}
        copy={t}
        onOpenAccount={() => setAccountOpen(true)}
        onSaveProfile={saveAccountProfile}
        onSaveAddress={saveAccountAddress}
        onReorder={reorderAccountOrder}
        onSignOut={signOutAccount}
      />
      ) : isCartPage ? (
      <CartPage
        cart={cart}
        products={products}
        discounts={discounts}
        discountDraft={discountDraft}
        appliedDiscountCode={appliedDiscountCode}
        discountError={discountError}
        notes={orderNotes}
        termsAccepted={termsAccepted}
        onDiscountDraftChange={(value) => {
          setDiscountDraft(value)
          setDiscountError('')
        }}
        onApplyDiscount={applyDiscount}
        onRemoveDiscount={removeDiscount}
        onNotesChange={setOrderNotes}
        onTermsChange={setTermsAccepted}
        onQuantity={updateQuantity}
        onCheckout={openCheckout}
        onAddRelated={(product) => addToCart(product, 1, true)}
        copy={t}
      />
      ) : (
      <main>
        <section className="hero-section">
          <img className="hero-image" src="/images/lyly-hero.png" alt="Fresh grocery basket filled with fruit and vegetables" />
          <div className="hero-content">
            <p className="rating"><span>★★★★★</span> 4.9 (589)</p>
            <h1>{t.hero.h1[0]}<br />{t.hero.h1[1]}<br />{t.hero.h1[2]}</h1>
            <p className="hero-copy">{t.hero.sub}</p>
            <a className="dark-button" href="/products">{t.hero.cta}</a>
          </div>
          <div className="hero-dots"><i></i><i className="active"></i><i></i></div>
        </section>

        <section className="benefit-bar">
          <div><Truck size={25} /><span><b>{t.benefits[0].label}</b><small>{t.benefits[0].sub}</small></span></div>
          <div><Leaf size={25} /><span><b>{t.benefits[1].label}</b><small>{t.benefits[1].sub}</small></span></div>
          <div><Clock3 size={25} /><span><b>{t.benefits[2].label}</b><small>{t.benefits[2].sub}</small></span></div>
          <div><ShieldCheck size={25} /><span><b>{t.benefits[3].label}</b><small>{t.benefits[3].sub}</small></span></div>
        </section>

        <section className="section container" id="categories">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t.sections.findFav}</p>
              <h2>{t.sections.byCategory}</h2>
            </div>
            <a href="/collections">{t.sections.viewAllCat} <ArrowRight size={17} /></a>
          </div>
          <div className="category-grid">
            {homepageCategories.map((category, index) => (
              <a className="category-card" href={catalogHref(category.name)} key={category.name}>
                <img src={getCategoryImage(category, index)} alt="" />
                <span>{category.name}</span>
                <ArrowRight size={15} />
              </a>
            ))}
          </div>
        </section>

        <section className="promo-grid container">
          <a className="promo-card large" href="/products">
            <img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=88" alt="" />
            <div><p>Save up to 25%</p><h2>Roasted Salmon<br />& Grain Bowl</h2><span>Buy ingredients <ArrowRight size={16} /></span></div>
          </a>
          <a className="promo-card" href={catalogHref('Fruits & Vegetables')}>
            <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=88" alt="" />
            <div><p>Picked today</p><h2>Bright seasonal<br />produce</h2><span>Explore fresh <ArrowRight size={16} /></span></div>
          </a>
        </section>

        <section className="section products-section" id="bestsellers">
          <div className="container section-heading">
            <div>
              <p className="eyebrow">{t.sections.lovedBy}</p>
              <h2>{t.sections.bestSellers}</h2>
            </div>
            <a href="/products">{t.sections.shopAll} <ArrowRight size={17} /></a>
          </div>
          <div className="container product-grid">
            {products.filter((product) => product.stock !== 0).map((product) => <ProductCard product={product} onAdd={openQuickProduct} copy={t} key={product.id} />)}
          </div>
        </section>

        <section className="promise-grid" id="promise">
          <div className="promise-image">
            <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1100&q=88" alt="Market stand full of vegetables" />
          </div>
          <div className="promise-copy">
            <p className="eyebrow">From market to table</p>
            <h2>Good food should feel effortless.</h2>
            <p>We work closely with trusted farms and makers so every LyLy delivery brings honest flavor, dependable quality, and fewer compromises to your kitchen.</p>
            <div className="promise-points">
              <span><Leaf size={20} />Responsibly sourced</span>
              <span><Truck size={20} />Packed with care</span>
              <span><ShieldCheck size={20} />Quality checked</span>
            </div>
            <a className="light-button" href="/about-us">Our story</a>
          </div>
        </section>

        <section className="recipe-banner" id="recipes">
          <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1800&q=88" alt="" />
          <div>
            <p className="eyebrow">What's cooking?</p>
            <h2>Simple ideas.<br />Delicious results.</h2>
            <p>Make tonight's dinner the easiest decision of your day.</p>
            <a className="cream-button" href="/recipes">Browse recipes</a>
          </div>
        </section>

        <section className="section container" id="articles">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Fresh from LyLy</p>
              <h2>Latest Articles</h2>
            </div>
            <a href="/blog">Read the journal <ArrowRight size={17} /></a>
          </div>
          <div className="article-grid">
            {storeArticles.slice(0, 3).map((article) => (
              <a className="article-card" href={article.type === 'recipe' ? `/blogs/recipes/${article.slug}` : `/blogs/news/${article.slug}`} key={article.slug || article.title}>
                <img src={article.image} alt="" />
                <p>{article.category || article.type}</p>
                <h3>{article.title}</h3>
                <span>Read article <ArrowRight size={14} /></span>
              </a>
            ))}
          </div>
        </section>

        <section className="newsletter">
          <div>
            <p className="eyebrow">Stay in season</p>
            <h2>Fresh ideas, straight to your inbox.</h2>
            <p>Recipes, market notes and a little something for your next order.</p>
          </div>
          <form onSubmit={submitNewsletter}>
            <label>
              <span className="sr-only">Email address</span>
              <input type="email" required value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder="Your email address" />
            </label>
            <button type="submit" disabled={newsletterStatus === 'submitting'}>{newsletterStatus === 'success' ? 'Thank you!' : newsletterStatus === 'submitting' ? 'Sending...' : 'Sign me up'} <ArrowRight size={17} /></button>
            {newsletterStatus === 'error' && <p className="newsletter-error">Please try again.</p>}
          </form>
        </section>
      </main>
      )}

      <footer id="footer">
        <div className="footer-main container">
          <div className="footer-brand">
            <Logo />
            <p>{publicGeneralSettings.storeName || 'LyLy Fresh Market'} brings carefully selected groceries to your door.</p>
            <div><a href="#footer"><b className="social-mark">ig</b></a><a href="#footer"><b className="social-mark">f</b></a><a href="#footer"><Mail size={18} /></a></div>
          </div>
          <div><h4>Shop</h4><a href="/collections">Categories</a><a href="/products">Best sellers</a><a href="/products">New arrivals</a><a href="/products">Special offers</a></div>
          <div><h4>About</h4><a href="/about-us">About us</a><a href="/our-stores">Our stores</a><a href="/faq">FAQ</a><a href="/blog">Journal</a><a href="/#footer">Contact</a></div>
          <div><h4>Need help?</h4><a href="/delivery">Delivery & pickup</a><a href="/faq">FAQs</a><a href="/delivery">Returns</a><a href="/account?tab=orders">Track an order</a></div>
          <div className="store-card">
            <MapPin size={22} />
            <span><small>{publicGeneralSettings.country || 'Vietnam'}</small><b>{publicGeneralSettings.contactEmail || 'Find your closest LyLy'}</b></span>
            <ArrowRight size={17} />
          </div>
        </div>
        <div className="footer-bottom container"><span>© 2026 LyLy Market. All rights reserved.</span><span>Privacy &nbsp; Terms &nbsp; Accessibility</span></div>
      </footer>

      {menuOpen && <div className="page-overlay" onClick={() => setMenuOpen(false)} />}
      <aside className={`side-drawer menu-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-header"><Logo /><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button></div>
        <nav>
          {menuItems.map((item) => <a href={item.href} onClick={() => setMenuOpen(false)} key={item.label}>{item.label}<ChevronRight size={16} /></a>)}
          <a href="/about-us" onClick={() => setMenuOpen(false)}>About us<ChevronRight size={16} /></a>
          <a href="/our-stores" onClick={() => setMenuOpen(false)}>Our stores<ChevronRight size={16} /></a>
          <a href="/faq" onClick={() => setMenuOpen(false)}>FAQ<ChevronRight size={16} /></a>
          <a href="/recipes" onClick={() => setMenuOpen(false)}>Recipes<ChevronRight size={16} /></a>
          <a href="/blog" onClick={() => setMenuOpen(false)}>Blog<ChevronRight size={16} /></a>
          <a href="/delivery" onClick={() => setMenuOpen(false)}>Shipping & Delivery<ChevronRight size={16} /></a>
        </nav>
        <div className="menu-footer"><button type="button" onClick={() => { setMenuOpen(false); setAccountOpen(true) }}><User size={18} /> Account</button><a href="/our-stores"><Store size={18} /> Find a store</a><a href="/delivery"><Truck size={18} /> Delivery</a></div>
      </aside>

      {cartOpen && <div className="page-overlay" onClick={() => setCartOpen(false)} />}
      <aside className={`side-drawer cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="drawer-header"><h2>{t.cart.shoppingCart} ({cartCount})</h2><button type="button" onClick={() => setCartOpen(false)} aria-label={t.cart.closeCart}><X /></button></div>
        <div className="cart-items">
          {cart.length ? cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt="" />
              <div>
                <p>{formatPrice(item.price)} {item.oldPrice && <del>{formatPrice(item.oldPrice)}</del>}</p>
                <h3>{item.name}</h3>
                <small>Style: {item.variantLabel || item.unit}</small>
                <div className="quantity">
                  <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={14} /></button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={14} /></button>
                </div>
              </div>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </div>
          )) : (
            <div className="empty-cart"><ShoppingBag size={42} /><h3>{t.cart.empty}</h3><p>{t.product.localDelivery}</p><button type="button" onClick={() => setCartOpen(false)}>{t.cart.continueShopping}</button></div>
          )}
        </div>
        <div className="cart-drawer-panels">
          <details><summary>{t.cart.orderInstructions} <ChevronDown size={18} /></summary><textarea value={orderNotes} onChange={(event) => setOrderNotes(event.target.value)} placeholder={t.cart.orderInstructions} /></details>
          <details><summary>{t.cart.discountCodes} <ChevronDown size={18} /></summary>
            <div className="drawer-discount">
              <DiscountCodeForm
                value={discountDraft}
                appliedCode={appliedDiscountCode}
                error={discountError}
                hint={discountHint}
                onChange={(value) => {
                  setDiscountDraft(value)
                  setDiscountError('')
                }}
                onApply={applyDiscount}
                onRemove={removeDiscount}
                compact
                copy={t}
              />
            </div>
          </details>
        </div>
        <div className="cart-summary">
          {(() => {
            const totals = CartTotals({ subtotal, discountCode: appliedDiscountCode, discounts, items: cart })
            return (
              <>
                <div><span>{t.cart.subtotal}</span><b>{formatPrice(subtotal)}</b></div>
                {totals.discount > 0 && <div className="drawer-discount-line"><span>{t.cart.discounts} <small>{totals.normalized}</small></span><b>-{formatPrice(totals.discount)}</b></div>}
                <div className="drawer-total"><span>{t.cart.total}</span><b>{formatPrice(totals.total)}</b></div>
                <p>{t.cart.taxNote}</p>
              </>
            )
          })()}
          <label className="terms-row"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} /> {t.cart.terms}</label>
          <div className="cart-drawer-actions">
            <a href="/cart" onClick={() => setCartOpen(false)}>{t.cart.shoppingCart}</a>
            <button type="button" disabled={!cart.length || !termsAccepted} onClick={openCheckout}>{t.cart.checkout}</button>
          </div>
        </div>
      </aside>

      {quickProduct && <QuickProductModal product={quickProduct} onAdd={addToCart} onBuyNow={buyNow} onClose={() => setQuickProduct(null)} copy={t} />}
      {accountOpen && <AccountModal user={storefrontUser} profile={accountProfile} onClose={() => setAccountOpen(false)} onSignOut={signOutAccount} />}
      {pickupOpen && <SelectPickupModal selectedId={selectedPickup?.id} onSelect={selectPickup} onClose={() => setPickupOpen(false)} />}
      {checkoutOpen && <CheckoutModal items={cart} discounts={discounts} initialDiscountCode={appliedDiscountCode} user={storefrontUser} profile={accountProfile} onClose={() => setCheckoutOpen(false)} onComplete={() => setCart([])} onUpdateQuantity={updateQuantity} copy={t} />}
      {searchOpen && <button className="search-closer" aria-label="Close search" type="button" onClick={() => setSearchOpen(false)} />}
    </div>
  )
}

export default App
