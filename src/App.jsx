import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Minus,
  Package,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
  Truck,
  User,
  X,
} from 'lucide-react'
import './App.css'
import { createStorefrontOrder, loadPublicProducts, subscribeToNewsletter } from './lib/storeApi'

const categories = [
  { name: 'Bread & Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=85' },
  { name: 'Flour & Baking', image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=700&q=85' },
  { name: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85' },
  { name: 'Fresh Meals & Pizzas', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=85' },
  { name: 'Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=85' },
  { name: 'Fresh Meat', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=700&q=85' },
  { name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=700&q=85' },
  { name: 'Sauces & Marinades', image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=700&q=85' },
]

const fallbackProducts = [
  {
    id: 1,
    name: 'Artisan Sourdough Loaf',
    category: 'Bread & Bakery',
    price: 6.5,
    oldPrice: 8,
    badge: 'Sale',
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
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=90',
  },
  {
    id: 3,
    name: 'Sweet Garden Strawberries',
    category: 'Fruits & Vegetables',
    price: 4.75,
    unit: '250g',
    badge: 'Fresh',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=700&q=90',
  },
  {
    id: 4,
    name: 'Farm Fresh Whole Milk',
    category: 'Dairy & Eggs',
    price: 3.25,
    unit: '1 litre',
    badge: 'Local',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=90',
  },
  {
    id: 5,
    name: 'Sun-Kissed Navel Oranges',
    category: 'Fruits & Vegetables',
    price: 4.2,
    unit: '1kg',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=700&q=90',
  },
  {
    id: 6,
    name: 'Free Range Brown Eggs',
    category: 'Dairy & Eggs',
    price: 5.5,
    unit: '12 eggs',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=700&q=90',
  },
  {
    id: 7,
    name: 'Fresh Rigatoni Pasta',
    category: 'Fresh Meals & Pizzas',
    price: 4.9,
    unit: '400g',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=90',
  },
  {
    id: 8,
    name: 'Atlantic Salmon Fillet',
    category: 'Fresh Meat',
    price: 14.5,
    unit: '350g',
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=700&q=90',
  },
]

const lifestyle = [
  { label: 'Vegan', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=85' },
  { label: 'Gluten-Free', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=700&q=85' },
  { label: 'Paleo', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=85' },
  { label: 'Keto', image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=700&q=85' },
  { label: 'Plant-Based', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=85' },
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

const menuItems = ['Shop all', 'Fruits & vegetables', 'Bread & bakery', 'Dairy & eggs', 'Fresh meals', 'Pantry']

const megaMenuGroups = [
  {
    title: 'Pantry',
    items: ['All', 'Pasta & Noodles', 'Grains & Beans', 'Snacks', 'Oil, Vinegar & Spices', 'Sauces', 'Dressings'],
  },
  {
    title: 'Produce',
    items: ['All', 'Vegetables', 'Fruit', 'Herbs & Aromatics'],
    secondary: {
      title: 'Drinks',
      items: ['All', 'Coffee', 'Tea & Elixirs', 'Juices'],
    },
  },
  {
    title: 'Bakery',
    items: ['All', 'Bread', 'Buns & Rolls', 'Bagels & Breakfast', 'Gluten-Free'],
  },
  {
    title: 'Dairy & Eggs',
    items: ['All', 'Milk & Cream', 'Eggs & Butter', 'Cheese', 'Yogurt & Cultured Dairy', 'Plant-Based'],
  },
]

function formatPrice(value) {
  return `$${value.toFixed(2)}`
}

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="LyLy home">
      <span>LyLy</span>
      <small>FRESH MARKET</small>
    </a>
  )
}

function ProductCard({ product, onAdd }) {
  const [liked, setLiked] = useState(false)

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
        <button className="quick-add" type="button" onClick={() => onAdd(product)}>
          <Plus size={16} />
          <span>Add to cart</span>
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

function CheckoutModal({ items, onClose, onComplete }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [order, setOrder] = useState(null)
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const submit = async (event) => {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const createdOrder = await createStorefrontOrder(form, items)
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
          <div><p>Secure checkout</p><h2>{order ? 'Order received' : 'Complete your order'}</h2></div>
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
            <label><span>Full name</span><input required name="name" value={form.name} onChange={change} /></label>
            <label><span>Email</span><input required type="email" name="email" value={form.email} onChange={change} /></label>
            <label><span>Phone</span><input name="phone" value={form.phone} onChange={change} /></label>
            {message && <p className="checkout-error">{message}</p>}
            <button type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Placing order...' : 'Place order'} <ArrowRight size={17} />
            </button>
          </form>
        )}
      </section>
    </div>
  )
}

function App() {
  const [products, setProducts] = useState(fallbackProducts)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('idle')

  useEffect(() => {
    loadPublicProducts()
      .then((data) => data && setProducts(data))
      .catch((error) => console.error('Unable to load products from Supabase.', error))
  }, [])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return []
    return products.filter((product) =>
      `${product.name} ${product.category}`.toLowerCase().includes(query),
    )
  }, [products, search])

  const addToCart = (product) => {
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
                  <button type="button" key={product.id} onClick={() => addToCart(product)}>
                    <img src={product.image} alt="" />
                    <span><b>{product.name}</b><small>{product.category}</small></span>
                    <strong>{formatPrice(product.price)}</strong>
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
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setCategoriesOpen(false)
              }}
            >
              <button
                className="categories-trigger"
                type="button"
                aria-expanded={categoriesOpen}
                aria-controls="categories-mega-menu"
                onClick={() => setCategoriesOpen((current) => !current)}
              >
                Categories <ChevronDown size={15} />
              </button>
              <div className="categories-mega" id="categories-mega-menu">
                <div className="mega-menu-inner">
                  {megaMenuGroups.map((group) => (
                    <div className="mega-menu-column" key={group.title}>
                      <h3>{group.title}</h3>
                      {group.items.map((item) => <a href="#categories" onClick={() => setCategoriesOpen(false)} key={`${group.title}-${item}`}>{item}</a>)}
                      {group.secondary && (
                        <div className="mega-menu-secondary">
                          <h3>{group.secondary.title}</h3>
                          {group.secondary.items.map((item) => <a href="#categories" onClick={() => setCategoriesOpen(false)} key={`${group.secondary.title}-${item}`}>{item}</a>)}
                        </div>
                      )}
                    </div>
                  ))}
                  <a className="mega-menu-promo" href="#promise" onClick={() => setCategoriesOpen(false)}>
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
            <a href="#promise">About us <ChevronDown size={15} /></a>
            <a href="#recipes">Recipes</a>
            <a href="#articles">Blog</a>
            <a href="#promise">Theme Features</a>
          </nav>
          <div className="service-links">
            <a href="#footer"><Store size={28} /><span><small>Picking up?</small>Select store <ChevronDown size={14} /></span></a>
            <a href="#footer"><Package size={28} /><span><small>Need delivery?</small>See estimates</span></a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <img className="hero-image" src="/images/lyly-hero.png" alt="Fresh grocery basket filled with fruit and vegetables" />
          <div className="hero-content">
            <p className="rating"><span>★★★★★</span> 4.9 (589)</p>
            <h1>Fresh.<br />Organic.<br />Delivered.</h1>
            <p className="hero-copy">Thoughtfully sourced groceries for everyday living.</p>
            <a className="dark-button" href="#bestsellers">Shop now</a>
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
            <a href="#bestsellers">View all categories <ArrowRight size={17} /></a>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <a className="category-card" href="#bestsellers" key={category.name}>
                <img src={category.image} alt="" />
                <span>{category.name}</span>
                <ArrowRight size={15} />
              </a>
            ))}
          </div>
        </section>

        <section className="promo-grid container">
          <a className="promo-card large" href="#bestsellers">
            <img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=88" alt="" />
            <div><p>Save up to 25%</p><h2>Kitchen & Dining<br />Sale</h2><span>Shop the edit <ArrowRight size={16} /></span></div>
          </a>
          <a className="promo-card" href="#bestsellers">
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
            <a href="#bestsellers">Shop all products <ArrowRight size={17} /></a>
          </div>
          <div className="container product-grid">
            {products.map((product) => <ProductCard product={product} onAdd={addToCart} key={product.id} />)}
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

        <section className="section lifestyle-section">
          <div className="container section-heading">
            <div>
              <p className="eyebrow">Food for your way of life</p>
              <h2>Shop By Lifestyle</h2>
            </div>
          </div>
          <div className="container lifestyle-grid">
            {lifestyle.map((item) => (
              <a href="#bestsellers" className="lifestyle-card" key={item.label}>
                <img src={item.image} alt="" />
                <span>{item.label}</span>
              </a>
            ))}
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

      <footer id="footer">
        <div className="footer-main container">
          <div className="footer-brand">
            <Logo />
            <p>Everyday groceries, chosen with care and delivered fresh to your door.</p>
            <div><a href="#footer"><b className="social-mark">ig</b></a><a href="#footer"><b className="social-mark">f</b></a><a href="#footer"><Mail size={18} /></a></div>
          </div>
          <div><h4>Shop</h4><a href="#categories">Categories</a><a href="#bestsellers">Best sellers</a><a href="#bestsellers">New arrivals</a><a href="#bestsellers">Special offers</a></div>
          <div><h4>About</h4><a href="#promise">Our story</a><a href="#articles">Journal</a><a href="#footer">Careers</a><a href="#footer">Contact</a></div>
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
          {menuItems.map((item) => <a href="#categories" onClick={() => setMenuOpen(false)} key={item}>{item}<ChevronRight size={16} /></a>)}
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
