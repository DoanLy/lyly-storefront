import { useEffect, useMemo, useState } from 'react'
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

const initialProducts = [
  { id: 1, name: 'Artisan Sourdough Loaf', category: 'Bread & Bakery', sku: 'BRD-1001', price: 6.5, stock: 42, status: 'active', unit: '500g', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=160&q=85' },
  { id: 2, name: 'Organic Hass Avocados', category: 'Fruits & Vegetables', sku: 'FRT-1024', price: 5.9, stock: 68, status: 'active', unit: 'Pack of 3', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=160&q=85' },
  { id: 3, name: 'Sweet Garden Strawberries', category: 'Fruits & Vegetables', sku: 'FRT-1018', price: 4.75, stock: 16, status: 'active', unit: '250g', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=160&q=85' },
  { id: 4, name: 'Farm Fresh Whole Milk', category: 'Dairy & Eggs', sku: 'DRY-1006', price: 3.25, stock: 34, status: 'active', unit: '1 litre', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=160&q=85' },
  { id: 5, name: 'Sun-Kissed Navel Oranges', category: 'Fruits & Vegetables', sku: 'FRT-1029', price: 4.2, stock: 0, status: 'draft', unit: '1kg', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=160&q=85' },
  { id: 6, name: 'Free Range Brown Eggs', category: 'Dairy & Eggs', sku: 'DRY-1011', price: 5.5, stock: 21, status: 'active', unit: '12 eggs', image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=160&q=85' },
  { id: 7, name: 'Fresh Rigatoni Pasta', category: 'Fresh Meals', sku: 'MEA-1015', price: 4.9, stock: 11, status: 'active', unit: '400g', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=160&q=85' },
  { id: 8, name: 'Atlantic Salmon Fillet', category: 'Fresh Meat', sku: 'MEA-1021', price: 14.5, stock: 8, status: 'active', unit: '350g', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=160&q=85' },
]

const orders = [
  { id: '#LY1048', date: '02 Jun, 13:42', customer: 'Emma Wilson', total: 54.2, payment: 'Paid', delivery: 'Packing', items: 5 },
  { id: '#LY1047', date: '02 Jun, 12:16', customer: 'Noah Taylor', total: 82.75, payment: 'Paid', delivery: 'Ready', items: 7 },
  { id: '#LY1046', date: '02 Jun, 10:04', customer: 'Ava Anderson', total: 34.5, payment: 'Pending', delivery: 'Unfulfilled', items: 3 },
  { id: '#LY1045', date: '01 Jun, 18:32', customer: 'Liam Johnson', total: 96.4, payment: 'Paid', delivery: 'Delivered', items: 9 },
  { id: '#LY1044', date: '01 Jun, 16:21', customer: 'Mia Brown', total: 41.85, payment: 'Refunded', delivery: 'Cancelled', items: 4 },
  { id: '#LY1043', date: '01 Jun, 14:47', customer: 'Oliver Davis', total: 67.1, payment: 'Paid', delivery: 'Delivered', items: 6 },
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
  orders: ['Đơn hàng', 'Theo dõi thanh toán, đóng gói và giao hàng của cửa hàng.'],
  customers: ['Khách hàng', 'Xem lịch sử mua sắm và chăm sóc khách hàng LyLy.'],
  marketing: ['Tiếp thị', 'Tạo chiến dịch để khách hàng quay lại với LyLy.'],
  discounts: ['Giảm giá', 'Quản lý mã ưu đãi và chương trình khuyến mại.'],
  content: ['Nội dung', 'Quản lý bài viết và nội dung hiển thị trên storefront.'],
  analytics: ['Phân tích', 'Theo dõi hiệu quả bán hàng và hành vi khách hàng.'],
  locations: ['Điểm bán hàng', 'Cấu hình địa điểm lấy hàng và khu vực giao hàng.'],
  settings: ['Cài đặt', 'Cấu hình vận hành chung cho cửa hàng LyLy.'],
}

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
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

function Dashboard({ tasks, setTasks }) {
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

function ProductsPage({ products, setProducts, onCreate }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState([])
  const visible = products.filter((product) => {
    const matchesQuery = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (filter === 'all' || product.status === filter)
  })
  const removeProduct = (id) => setProducts((current) => current.filter((product) => product.id !== id))
  const toggleAll = () => setSelected(selected.length === visible.length ? [] : visible.map((product) => product.id))
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const removeSelected = () => {
    setProducts((current) => current.filter((product) => !selected.includes(product.id)))
    setSelected([])
  }

  return (
    <>
      <SectionTitle title="Sản phẩm" description={pageMeta.products[1]} action="Thêm sản phẩm" onAction={onCreate} />
      <section className="admin-panel data-panel">
        <div className="data-tabs"><button className="active" type="button">Tất cả</button><button type="button">Đang bán</button><button type="button">Bản nháp</button><button className="add-view" type="button"><Plus size={14} /> Tạo chế độ xem</button></div>
        <div className="table-toolbar">
          <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm sản phẩm" /></label>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">Tất cả trạng thái</option><option value="active">Đang bán</option><option value="draft">Bản nháp</option></select>
          <button type="button"><Filter size={15} /> Bộ lọc</button>
          {selected.length > 0 && <button className="danger-button" type="button" onClick={removeSelected}><Trash2 size={15} /> Xóa {selected.length} mục</button>}
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table product-table">
            <thead><tr><th><input type="checkbox" checked={visible.length > 0 && selected.length === visible.length} onChange={toggleAll} /></th><th>Sản phẩm</th><th>Trạng thái</th><th>Tồn kho</th><th>Danh mục</th><th>Giá</th><th></th></tr></thead>
            <tbody>
              {visible.map((product) => (
                <tr key={product.id}>
                  <td><input type="checkbox" checked={selected.includes(product.id)} onChange={() => toggle(product.id)} /></td>
                  <td><div className="product-cell"><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.sku} · {product.unit}</small></span></div></td>
                  <td><StatusPill>{product.status === 'active' ? 'Active' : 'Draft'}</StatusPill></td>
                  <td><span className={product.stock < 10 ? 'low-stock' : ''}>{product.stock} in stock</span></td>
                  <td>{product.category}</td>
                  <td><b>{money(product.price)}</b></td>
                  <td><button className="row-icon" type="button" onClick={() => removeProduct(product.id)} aria-label={`Delete ${product.name}`}><Trash2 size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && <EmptyHint icon={ShoppingBag} title="Không tìm thấy sản phẩm" copy="Thử thay đổi từ khóa hoặc thêm sản phẩm mới." />}
        </div>
      </section>
    </>
  )
}

function OrdersPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const visible = orders.filter((order) => {
    const matchesQuery = `${order.id} ${order.customer}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (filter === 'all' || order.delivery.toLowerCase() === filter)
  })
  return (
    <>
      <SectionTitle title="Đơn hàng" description={pageMeta.orders[1]} action="Xuất đơn hàng" icon={Download} />
      <section className="metrics-grid">
        <MetricCard label="Tổng đơn hôm nay" value="18" note="+12% so với hôm qua" />
        <MetricCard label="Cần xử lý" value="3" note="2 đơn cần đóng gói" />
        <MetricCard label="Doanh thu hôm nay" value={money(684.75)} note="+8.4% so với hôm qua" />
      </section>
      <section className="admin-panel data-panel">
        <div className="data-tabs"><button className="active" type="button">Tất cả</button><button type="button">Chưa xử lý</button><button type="button">Chưa thanh toán</button><button type="button">Đã giao</button></div>
        <div className="table-toolbar">
          <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm đơn hàng" /></label>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">Tất cả giao hàng</option><option value="packing">Đang đóng gói</option><option value="ready">Sẵn sàng</option><option value="delivered">Đã giao</option><option value="cancelled">Đã hủy</option></select>
          <button type="button"><Filter size={15} /> Bộ lọc</button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th><input type="checkbox" /></th><th>Đơn hàng</th><th>Ngày</th><th>Khách hàng</th><th>Thanh toán</th><th>Giao hàng</th><th>Số món</th><th>Tổng</th></tr></thead>
            <tbody>{visible.map((order) => <tr key={order.id}><td><input type="checkbox" /></td><td><b>{order.id}</b></td><td>{order.date}</td><td>{order.customer}</td><td><StatusPill>{order.payment}</StatusPill></td><td><StatusPill>{order.delivery}</StatusPill></td><td>{order.items}</td><td><b>{money(order.total)}</b></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function CustomersPage() {
  const [query, setQuery] = useState('')
  const visible = customers.filter((customer) => `${customer.name} ${customer.email} ${customer.location}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <>
      <SectionTitle title="Khách hàng" description={pageMeta.customers[1]} action="Thêm khách hàng" />
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

function MarketingPage() {
  return (
    <>
      <SectionTitle title="Tiếp thị" description={pageMeta.marketing[1]} action="Tạo chiến dịch" />
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

function DiscountsPage({ discounts, onCreate }) {
  return (
    <>
      <SectionTitle title="Giảm giá" description={pageMeta.discounts[1]} action="Tạo mã giảm giá" onAction={onCreate} />
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

function ContentPage() {
  return (
    <>
      <SectionTitle title="Nội dung" description={pageMeta.content[1]} action="Viết bài mới" />
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

function AnalyticsPage() {
  const chart = [34, 48, 43, 55, 58, 72, 67, 81, 76, 88, 92, 98]
  return (
    <>
      <SectionTitle title="Phân tích" description={pageMeta.analytics[1]} action="Xuất báo cáo" icon={Download} />
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

function LocationsPage() {
  return (
    <>
      <SectionTitle title="Điểm bán hàng" description={pageMeta.locations[1]} action="Thêm địa điểm" />
      <section className="location-grid">
        <div className="admin-panel location-card"><MapPin size={24} /><div><StatusPill>Active</StatusPill><h3>LyLy Market · Brooklyn</h3><p>68 Greenpoint Avenue<br />Brooklyn, NY 11222</p><span>Pickup · Local delivery · Inventory</span></div><button className="row-icon" type="button"><MoreHorizontal size={17} /></button></div>
        <div className="admin-panel location-card"><MapPin size={24} /><div><StatusPill>Active</StatusPill><h3>LyLy Market · Manhattan</h3><p>214 Spring Street<br />New York, NY 10013</p><span>Pickup · Inventory</span></div><button className="row-icon" type="button"><MoreHorizontal size={17} /></button></div>
      </section>
    </>
  )
}

function SettingsPage() {
  return (
    <>
      <SectionTitle title="Cài đặt" description={pageMeta.settings[1]} />
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

function ProductModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', category: 'Fruits & Vegetables', sku: '', price: '', stock: '', unit: '' })
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = (event) => {
    event.preventDefault()
    onSubmit({ ...form, price: Number(form.price), stock: Number(form.stock), status: 'active', image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=160&q=85' })
  }
  return (
    <Modal title="Thêm sản phẩm mới" onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        <label><span>Tên sản phẩm</span><input required name="name" value={form.name} onChange={change} placeholder="Ví dụ: Organic Baby Spinach" /></label>
        <div><label><span>Danh mục</span><select name="category" value={form.category} onChange={change}><option>Fruits & Vegetables</option><option>Bread & Bakery</option><option>Dairy & Eggs</option><option>Fresh Meals</option></select></label><label><span>SKU</span><input required name="sku" value={form.sku} onChange={change} placeholder="FRT-1030" /></label></div>
        <div><label><span>Giá bán</span><input required min="0" step=".01" type="number" name="price" value={form.price} onChange={change} placeholder="0.00" /></label><label><span>Tồn kho</span><input required min="0" type="number" name="stock" value={form.stock} onChange={change} placeholder="0" /></label></div>
        <label><span>Quy cách</span><input required name="unit" value={form.unit} onChange={change} placeholder="Ví dụ: 250g" /></label>
        <div className="upload-box"><Upload size={19} /><span>Ảnh sản phẩm sẽ được thêm sau khi tạo sản phẩm.</span></div>
        <div className="modal-actions"><button className="admin-secondary" type="button" onClick={onClose}>Hủy</button><button className="admin-primary" type="submit">Thêm sản phẩm</button></div>
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

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="admin-modal">
        <div className="modal-header"><h2>{title}</h2><button type="button" onClick={onClose}><X size={19} /></button></div>
        {children}
      </section>
    </div>
  )
}

function AdminApp() {
  const getPage = () => window.location.pathname.replace(/^\/admin\/?/, '') || 'dashboard'
  const [page, setPage] = useState(getPage)
  const [products, setProducts] = useState(initialProducts)
  const [discounts, setDiscounts] = useState(initialDiscounts)
  const [productModal, setProductModal] = useState(false)
  const [discountModal, setDiscountModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [tasks, setTasks] = useState(['name'])
  const [globalSearch, setGlobalSearch] = useState('')

  const searchMatches = useMemo(() => {
    if (!globalSearch.trim()) return []
    return [
      ...products.slice(0, 3).map((product) => ({ type: 'Sản phẩm', label: product.name, page: 'products' })),
      ...orders.slice(0, 2).map((order) => ({ type: 'Đơn hàng', label: `${order.id} · ${order.customer}`, page: 'orders' })),
      ...customers.slice(0, 2).map((customer) => ({ type: 'Khách hàng', label: customer.name, page: 'customers' })),
    ].filter((item) => `${item.type} ${item.label}`.toLowerCase().includes(globalSearch.toLowerCase()))
  }, [globalSearch, products])

  useEffect(() => {
    const update = () => setPage(getPage())
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
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

  const addProduct = (product) => {
    setProducts((current) => [{ ...product, id: Date.now() }, ...current])
    setProductModal(false)
  }

  const addDiscount = (discount) => {
    setDiscounts((current) => [discount, ...current])
    setDiscountModal(false)
  }

  const renderPage = () => {
    if (page === 'dashboard') return <Dashboard tasks={tasks} setTasks={setTasks} />
    if (page === 'products') return <ProductsPage products={products} setProducts={setProducts} onCreate={() => setProductModal(true)} />
    if (page === 'orders') return <OrdersPage />
    if (page === 'customers') return <CustomersPage />
    if (page === 'marketing') return <MarketingPage />
    if (page === 'discounts') return <DiscountsPage discounts={discounts} onCreate={() => setDiscountModal(true)} />
    if (page === 'content') return <ContentPage />
    if (page === 'analytics') return <AnalyticsPage />
    if (page === 'locations') return <LocationsPage />
    if (page === 'settings') return <SettingsPage />
    return <Dashboard tasks={tasks} setTasks={setTasks} />
  }

  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <button className="admin-mobile-menu" type="button" onClick={() => setMenuOpen(true)}><Menu size={21} /></button>
        <AdminLogo />
        <div className="admin-global-search">
          <Search size={17} />
          <input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng" />
          <kbd>CTRL K</kbd>
          {globalSearch && <div className="global-search-results">{searchMatches.length ? searchMatches.map((item) => <button type="button" onClick={() => { navigate(item.page); setGlobalSearch('') }} key={`${item.type}-${item.label}`}><span>{item.type}</span><b>{item.label}</b><ChevronRight size={15} /></button>) : <p>Không tìm thấy kết quả phù hợp.</p>}</div>}
        </div>
        <div className="topbar-actions">
          <button type="button"><CircleHelp size={18} /></button>
          <button type="button" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18} /><i></i></button>
          <button className="store-switcher" type="button"><span>LY</span><b>LyLy Market</b><ChevronDown size={14} /></button>
        </div>
        {notificationsOpen && <div className="notification-popover"><div><b>Thông báo</b><button type="button" onClick={() => setNotificationsOpen(false)}><X size={14} /></button></div><p><Truck size={16} /> Có 3 đơn hàng mới cần xử lý.</p><p><Package size={16} /> Atlantic Salmon Fillet sắp hết hàng.</p></div>}
      </header>

      <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-mobile-head"><AdminLogo /><button type="button" onClick={() => setMenuOpen(false)}><X size={18} /></button></div>
        <nav>
          {navGroups.map((group, index) => (
            <div className="nav-group" key={index}>
              {group.title && <p>{group.title}<ChevronRight size={13} /></p>}
              {group.items.map((item) => {
                const Icon = item.icon
                return <button className={page === item.id ? 'active' : ''} type="button" onClick={() => navigate(item.id)} key={item.id}><Icon size={17} /><span>{item.label}</span>{item.count && <em>{item.count}</em>}</button>
              })}
            </div>
          ))}
        </nav>
        <button className={`sidebar-settings ${page === 'settings' ? 'active' : ''}`} type="button" onClick={() => navigate('settings')}><Settings size={17} /> Cài đặt</button>
      </aside>

      {menuOpen && <button className="admin-menu-overlay" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" />}
      <main className={`admin-main ${page === 'dashboard' ? 'is-dashboard' : ''}`}>
        {page !== 'dashboard' && <div className="admin-breadcrumb"><button type="button" onClick={() => navigate('dashboard')}>LyLy</button><ChevronRight size={13} /><span>{pageMeta[page]?.[0] || 'Trang chủ'}</span></div>}
        {renderPage()}
      </main>
      {productModal && <ProductModal onClose={() => setProductModal(false)} onSubmit={addProduct} />}
      {discountModal && <DiscountModal onClose={() => setDiscountModal(false)} onSubmit={addDiscount} />}
    </div>
  )
}

export default AdminApp
