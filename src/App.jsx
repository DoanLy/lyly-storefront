import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  Truck,
  User,
  X,
} from 'lucide-react'
import './App.css'
import { createStorefrontOrder, loadPublicCategories, loadPublicProducts, subscribeToNewsletter } from './lib/storeApi'

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

const articles = [
  {
    category: 'Kitchen tips',
    title: 'A simpler way to plan your weekly groceries',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85',
  },
  {
    category: 'Recipes',
    title: 'Three bright salads for warmer days',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
  },
  {
    category: 'Local stories',
    title: 'Meet the growers behind our organic greens',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=85',
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

function ProductCard({ product, onAdd }) {
  const [liked, setLiked] = useState(false)
  const soldOut = product.stock === 0

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className={`wish-button ${liked ? 'liked' : ''}`}
          type="button"
          aria-label={`Save ${product.name}`}
          onClick={() => setLiked(!liked)}
        >
          <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <img src={product.image} alt={product.name} />
        <button className="quick-add" type="button" disabled={soldOut} onClick={() => onAdd(product)}>
          {!soldOut && <Plus size={16} />}
          <span>{soldOut ? 'Sold out' : 'Add to cart'}</span>
        </button>
      </div>
      <div className="product-detail">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="product-meta">
          <span>{product.unit}</span>
          <div>
            {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
            <strong>{formatPrice(product.price)}</strong>
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

function CatalogProductCard({ product, onAdd }) {
  const meta = getCatalogMeta(product)
  const soldOut = product.stock === 0
  const sale = Boolean(product.oldPrice)

  return (
    <article className="catalog-product-card">
      <div className="catalog-product-image">
        {(soldOut || sale || product.badge) && (
          <span className={`catalog-product-badge ${soldOut ? 'sold-out' : ''}`}>
            {soldOut ? 'Sold out' : sale ? 'On sale' : product.badge}
          </span>
        )}
        <img src={product.image} alt={product.name} />
      </div>
      <div className="catalog-product-detail">
        <p className="catalog-price">
          {sale && <del>{formatPrice(product.oldPrice)}</del>}
          <strong>{formatPrice(product.price)}</strong>
          <span>/ {product.unit}</span>
        </p>
        <h3>{product.name}</h3>
        <p className="catalog-description">{meta.description}</p>
        <div className="catalog-rating" aria-label={`${meta.rating} out of 5 stars, ${meta.reviews} reviews`}>
          <span>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={13} fill={index < meta.rating ? 'currentColor' : 'none'} />)}</span>
          <small>({meta.reviews})</small>
        </div>
        <button type="button" disabled={soldOut} onClick={() => onAdd(product)}>
          {soldOut ? 'Sold out' : 'Add to cart'}
        </button>
        <p className="catalog-availability"><i /> {soldOut ? 'Currently unavailable' : 'Available for local delivery'}</p>
      </div>
    </article>
  )
}

function ProductsPage({ categories, products, onAdd }) {
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
            <div className="catalog-grid">{visibleProducts.map((product) => <CatalogProductCard key={product.id} product={product} onAdd={onAdd} />)}</div>
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

function CheckoutModal({ items, onClose, onComplete }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    deliveryMethod: 'local',
    paymentMethod: 'cod',
    notes: '',
    discountCode: '',
  })
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [order, setOrder] = useState(null)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = form.discountCode.trim().toUpperCase() === 'FRESH20' ? subtotal * 0.2 : 0
  const deliveryFee = form.deliveryMethod === 'pickup' || subtotal - discount >= 75 ? 0 : 8
  const tax = (subtotal - discount) * 0.0825
  const total = subtotal - discount + deliveryFee + tax
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const submit = async (event) => {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const createdOrder = await createStorefrontOrder({ ...form, totals: { subtotal, discount, deliveryFee, tax, total } }, items)
      setOrder(createdOrder)
      setStatus('success')
      onComplete()
    } catch (error) {
      console.error(error)
      setMessage(error.message || 'Unable to place your order. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="checkout-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="checkout-modal">
        <div className="checkout-header">
          <div><p>Secure checkout</p><h2>{order ? 'Order received' : 'Checkout'}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close checkout"><X size={20} /></button>
        </div>
        {order ? (
          <div className="checkout-success">
            <ShieldCheck size={42} />
            <p>Your order <b>{order.order_number}</b> has been created.</p>
            <span>We will contact you to confirm delivery and payment.</span>
            <button type="button" onClick={onClose}>Continue shopping</button>
          </div>
        ) : (
          <form className="checkout-form" onSubmit={submit}>
            <div className="checkout-main">
              <div className="checkout-fields">
                <div className="checkout-steps">
                  <span className="active">Cart</span>
                  <span className="active">Information</span>
                  <span>Payment</span>
                </div>

                <fieldset>
                  <legend>Contact</legend>
                  <label><span>Email</span><input required type="email" name="email" value={form.email} onChange={change} placeholder="you@example.com" /></label>
                  <div className="checkout-grid">
                    <label><span>Full name</span><input required name="name" value={form.name} onChange={change} placeholder="Jane Smith" /></label>
                    <label><span>Phone</span><input required name="phone" value={form.phone} onChange={change} placeholder="+1 555 0123" /></label>
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Delivery</legend>
                  <div className="checkout-choice-grid">
                    <label className={form.deliveryMethod === 'local' ? 'selected' : ''}>
                      <input type="radio" name="deliveryMethod" value="local" checked={form.deliveryMethod === 'local'} onChange={change} />
                      <span><Truck size={18} /> Local delivery <b>{subtotal - discount >= 75 ? 'Free' : formatPrice(8)}</b></span>
                    </label>
                    <label className={form.deliveryMethod === 'pickup' ? 'selected' : ''}>
                      <input type="radio" name="deliveryMethod" value="pickup" checked={form.deliveryMethod === 'pickup'} onChange={change} />
                      <span><Store size={18} /> Store pickup <b>Free</b></span>
                    </label>
                  </div>
                  {form.deliveryMethod === 'local' && (
                    <>
                      <label><span>Address</span><input required name="address" value={form.address} onChange={change} placeholder="Street address" /></label>
                      <div className="checkout-grid">
                        <label><span>Apt, suite</span><input name="apartment" value={form.apartment} onChange={change} placeholder="Optional" /></label>
                        <label><span>City</span><input required name="city" value={form.city} onChange={change} placeholder="City" /></label>
                      </div>
                      <label><span>Postal code</span><input required name="postalCode" value={form.postalCode} onChange={change} placeholder="10001" /></label>
                    </>
                  )}
                </fieldset>

                <fieldset>
                  <legend>Payment</legend>
                  <div className="checkout-choice-grid">
                    <label className={form.paymentMethod === 'cod' ? 'selected' : ''}>
                      <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === 'cod'} onChange={change} />
                      <span><Package size={18} /> Pay on delivery <b>Manual</b></span>
                    </label>
                    <label className={form.paymentMethod === 'transfer' ? 'selected' : ''}>
                      <input type="radio" name="paymentMethod" value="transfer" checked={form.paymentMethod === 'transfer'} onChange={change} />
                      <span><ShieldCheck size={18} /> Bank transfer <b>Pending</b></span>
                    </label>
                  </div>
                  <label><span>Order notes</span><input name="notes" value={form.notes} onChange={change} placeholder="Delivery instructions or substitutions" /></label>
                </fieldset>
              </div>

              <aside className="checkout-summary-panel">
                <h3>Order summary</h3>
                <div className="checkout-review-items">
                  {items.map((item) => (
                    <div className="checkout-review-item" key={item.id}>
                      <img src={item.image} alt="" />
                      <span><b>{item.name}</b><small>{item.quantity} x {formatPrice(item.price)}</small></span>
                      <strong>{formatPrice(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>
                <label className="checkout-discount"><span>Discount code</span><div><input name="discountCode" value={form.discountCode} onChange={change} placeholder="FRESH20" /><b>Apply</b></div></label>
                <div className="checkout-totals">
                  <p><span>Subtotal</span><b>{formatPrice(subtotal)}</b></p>
                  <p><span>Discount</span><b>-{formatPrice(discount)}</b></p>
                  <p><span>Delivery</span><b>{deliveryFee ? formatPrice(deliveryFee) : 'Free'}</b></p>
                  <p><span>Estimated tax</span><b>{formatPrice(tax)}</b></p>
                  <p className="grand-total"><span>Total</span><b>{formatPrice(total)}</b></p>
                </div>
                {message && <p className="checkout-error">{message}</p>}
                <button type="submit" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Placing order...' : 'Place order'} <ArrowRight size={17} />
                </button>
              </aside>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}

function App() {
  const isProductsPage = window.location.pathname.startsWith('/products')
  const isCollectionsPage = window.location.pathname.startsWith('/collections')
  const [products, setProducts] = useState(fallbackProducts)
  const [categories, setCategories] = useState(fallbackCategories)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('idle')
  const categoriesCloseTimer = useRef(null)

  useEffect(() => {
    loadPublicProducts()
      .then((data) => data && setProducts(data))
      .catch((error) => console.error('Unable to load products from Supabase.', error))
    loadPublicCategories()
      .then((data) => data?.length && setCategories(data))
      .catch((error) => console.error('Unable to load categories from Supabase.', error))
  }, [])

  useEffect(() => () => clearTimeout(categoriesCloseTimer.current), [])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
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
    return managedItems.length ? [{ label: 'Shop all', href: '/products' }, ...managedItems] : fallbackMenuItems
  }, [categories])

  const addToCart = (product) => {
    if (product.stock === 0) return

    setCart((current) => {
      const found = current.find((item) => item.id === product.id)
      if (found) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...current, { ...product, quantity: 1 }]
    })
    setCartOpen(true)
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
        <p><ChevronLeft size={16} /> Save 20% with code: <b>FRESH20</b> <ChevronRight size={16} /></p>
        <span>English <ChevronDown size={14} /></span>
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
              placeholder="Search for fresh products..."
              aria-label="Search products"
            />
            {searchOpen && search && (
              <div className="search-results">
                <div className="search-heading">Product suggestions</div>
                {searchResults.length ? searchResults.slice(0, 5).map((product) => (
                  <button type="button" disabled={product.stock === 0} key={product.id} onClick={() => addToCart(product)}>
                    <img src={product.image} alt="" />
                    <span><b>{product.name}</b><small>{product.category}</small></span>
                    <strong>{product.stock === 0 ? 'Sold out' : formatPrice(product.price)}</strong>
                  </button>
                )) : <p>No products found.</p>}
              </div>
            )}
          </div>
          <div className="header-actions">
            <button className="account-button desktop-only" type="button"><User size={21} /> Account</button>
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
                Categories <ChevronDown size={15} />
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
            <a href="/#promise">About us <ChevronDown size={15} /></a>
            <a href="/#recipes">Recipes</a>
            <a href="/#articles">Blog</a>
          </nav>
          <div className="service-links">
            <a href="/#footer"><Store size={28} /><span><small>Picking up?</small>Select store <ChevronDown size={14} /></span></a>
            <a href="/#footer"><Package size={28} /><span><small>Need delivery?</small>See estimates</span></a>
          </div>
        </div>
      </header>

      {isProductsPage ? <ProductsPage categories={categories} products={products} onAdd={addToCart} /> : isCollectionsPage ? <CollectionsPage categories={categories} /> : (
      <main>
        <section className="hero-section">
          <img className="hero-image" src="/images/lyly-hero.png" alt="Fresh grocery basket filled with fruit and vegetables" />
          <div className="hero-content">
            <p className="rating"><span>★★★★★</span> 4.9 (589)</p>
            <h1>Fresh.<br />Organic.<br />Delivered.</h1>
            <p className="hero-copy">Thoughtfully sourced groceries for everyday living.</p>
            <a className="dark-button" href="/products">Shop now</a>
          </div>
          <div className="hero-dots"><i></i><i className="active"></i><i></i></div>
        </section>

        <section className="benefit-bar">
          <div><Truck size={25} /><span><b>Free local delivery</b><small>On orders over $75</small></span></div>
          <div><Leaf size={25} /><span><b>Freshness guaranteed</b><small>From trusted growers</small></span></div>
          <div><Clock3 size={25} /><span><b>Pickup when it suits</b><small>7 days a week</small></span></div>
          <div><ShieldCheck size={25} /><span><b>Secure checkout</b><small>Simple and protected</small></span></div>
        </section>

        <section className="section container" id="categories">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Find your favorites</p>
              <h2>Shop by Category</h2>
            </div>
            <a href="/collections">View all categories <ArrowRight size={17} /></a>
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
              <p className="eyebrow">Loved by locals</p>
              <h2>Best Sellers</h2>
            </div>
            <a href="/products">Shop all products <ArrowRight size={17} /></a>
          </div>
          <div className="container product-grid">
            {products.filter((product) => product.stock !== 0).map((product) => <ProductCard product={product} onAdd={addToCart} key={product.id} />)}
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
            <a className="light-button" href="#footer">Our story</a>
          </div>
        </section>

        <section className="recipe-banner" id="recipes">
          <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1800&q=88" alt="" />
          <div>
            <p className="eyebrow">What's cooking?</p>
            <h2>Simple ideas.<br />Delicious results.</h2>
            <p>Make tonight's dinner the easiest decision of your day.</p>
            <a className="cream-button" href="#articles">Browse recipes</a>
          </div>
        </section>

        <section className="section container" id="articles">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Fresh from LyLy</p>
              <h2>Latest Articles</h2>
            </div>
            <a href="#articles">Read the journal <ArrowRight size={17} /></a>
          </div>
          <div className="article-grid">
            {articles.map((article) => (
              <a className="article-card" href="#articles" key={article.title}>
                <img src={article.image} alt="" />
                <p>{article.category}</p>
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
            <p>Everyday groceries, chosen with care and delivered fresh to your door.</p>
            <div><a href="#footer"><b className="social-mark">ig</b></a><a href="#footer"><b className="social-mark">f</b></a><a href="#footer"><Mail size={18} /></a></div>
          </div>
          <div><h4>Shop</h4><a href="/collections">Categories</a><a href="/products">Best sellers</a><a href="/products">New arrivals</a><a href="/products">Special offers</a></div>
          <div><h4>About</h4><a href="/#promise">Our story</a><a href="/#articles">Journal</a><a href="/#footer">Careers</a><a href="/#footer">Contact</a></div>
          <div><h4>Need help?</h4><a href="#footer">Delivery & pickup</a><a href="#footer">FAQs</a><a href="#footer">Returns</a><a href="#footer">Track an order</a></div>
          <div className="store-card">
            <MapPin size={22} />
            <span><small>Your neighborhood market</small><b>Find your closest LyLy</b></span>
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
        </nav>
        <div className="menu-footer"><a href="#footer"><User size={18} /> Account</a><a href="#footer"><Store size={18} /> Find a store</a></div>
      </aside>

      {cartOpen && <div className="page-overlay" onClick={() => setCartOpen(false)} />}
      <aside className={`side-drawer cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="drawer-header"><h2>Your Cart</h2><button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X /></button></div>
        <div className="shipping-progress">
          <p>{subtotal >= 75 ? 'You unlocked free delivery.' : `You're ${formatPrice(75 - subtotal)} from free delivery.`}</p>
          <i><span style={{ width: `${Math.min(100, subtotal / 75 * 100)}%` }} /></i>
        </div>
        <div className="cart-items">
          {cart.length ? cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt="" />
              <div>
                <h3>{item.name}</h3>
                <p>{item.unit}</p>
                <strong>{formatPrice(item.price)}</strong>
                <div className="quantity">
                  <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={14} /></button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          )) : (
            <div className="empty-cart"><ShoppingBag size={42} /><h3>Your cart is empty</h3><p>Add something fresh to get started.</p><button type="button" onClick={() => setCartOpen(false)}>Continue shopping</button></div>
          )}
        </div>
        <div className="cart-summary">
          <div><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div>
          <p>Taxes and delivery calculated at checkout.</p>
          <button type="button" disabled={!cart.length} onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}>Checkout <ArrowRight size={17} /></button>
        </div>
      </aside>

      {checkoutOpen && <CheckoutModal items={cart} onClose={() => setCheckoutOpen(false)} onComplete={() => setCart([])} />}
      {searchOpen && <button className="search-closer" aria-label="Close search" type="button" onClick={() => setSearchOpen(false)} />}
    </div>
  )
}

export default App
