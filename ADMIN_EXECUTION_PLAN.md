# ULTIMATE DENTQ ADMIN DASHBOARD MASTER EXECUTION PLAN
**Revision:** Maximum Granularity Deep Dive
**Objective:** Detail every exact file, React state, Supabase query math, CSS requirement, and `i18n t{}` injection points for the entire admin panel and CEO Analytics Suite.

---

## 🌍 GLOBAL PREREQUISITES: i18n TRANSLATION JSON STRUCTURE
Before any component is written, the exact translations must be placed in `src/locales/en.json` and `ar.json`:
```json
{
  "admin": {
    "sidebar": { "dashboard": "Dashboard", "products": "Products", "orders": "Orders", "marketing": "Marketing", "cms": "CMS Settings" },
    "search": { "placeholder": "Search settings, orders, users, products...", "no_results": "No records found." },
    "kpi": { "total_revenue": "Total Revenue", "aov": "Average Order Value", "clv": "Customer Lifetime Value", "cart_abandon": "Cart Abandonment Rate" },
    "status": { "pending": "Pending", "paid": "Paid", "shipped": "Shipped", "delivered": "Delivered", "cancelled": "Cancelled" },
    "products": { "add_new": "Add New Product", "is_featured": "Featured", "stock_alert": "Low Stock" },
    "charts": { "revenue_growth": "Revenue Growth", "promo_usage": "Promo Usage" }
  }
}
```

---

## 📍 PHASE 0: SKELETON LAYOUT & OMNI-SEARCH ALGORITHM

### 1. `src/components/Admin/Layout/AdminLayout.jsx`
- **Logic:** Calls `useUserData()` to verify `isAdmin` state. If false, redirects to `/`.
- **Structure:** `div.admin-wrapper` containing `Sidebar` (left width 250px), `Header` (top height 70px fixed), and `<main><Outlet /></main>` flexed.

### 2. `src/components/Admin/Layout/Sidebar/Sidebar.jsx`
- **Imports:** `lucide-react` (LayoutDashboard, ShoppingBag, Truck, MessageSquare, MegaPhone).
- **State:** `const [isMobileOpen, setIsMobileOpen] = useState(false)`.
- **Text Mapping:** `t('admin.sidebar.products')` applied to `<Link to="/admin/products" />`.

### 3. `src/components/Admin/Layout/Header/Header.jsx` & `SearchBar.jsx`
- **Search State:** `const [searchQuery, setSearchQuery] = useState('')`, `const [results, setResults] = useState({ orders: [], products: [], clients: [], settings: [] })`.
- **Search Algorithm (Debounced):** 
  ```javascript
  // Fires 500ms after user stops typing
  Promise.all([
     supabase.from('Orders').select('id, status').ilike('id', `%${query}%`),
     supabase.from('Products').select('id, nameEn').ilike('nameEn', `%${query}%`),
     supabase.from('Clients').select('id, email, phone').ilike('email', `%${query}%`)
  ])
  ```
- **Text Mapping:** `<input placeholder={t('admin.search.placeholder')} />` natively rendering dropdown recommendations grouped by category.

---

## 🛠️ PHASE 1: CORE E-COMMERCE ENGINE

### 1. Categories Engine (`Categories/CategoryTree.jsx`)
- **Supabase Query:** `supabase.from('Categories').select('*').order('sort_order', { ascending: true })`
- **Recursive Logic:** Map through data where `level === 0`. Then map children where `parent_id` matches the current node `id`.
- **Drag & Drop:** Implement HTML5 Drag/Drop API to swap `sort_order` directly saving to database `onDrop`.

### 2. Products Data Grid (`Products/ProductList.jsx`)
- **Query:** Needs server-side pagination: `.range(from, to)`.
- **UI Details:** Table displaying Image Thumbnail, `nameEn`/`nameAr`, Stock tracker (Red text if `< 5` using `t('admin.products.stock_alert')`), `price`, switches for `is_featured` toggling boolean directly in DB.

### 3. Deep Product Creation Flow (`Products/ProductForm.jsx`)
- **JSONB Variant Logic:** 
  - `sizes`: State `const [sizes, setSizes] = useState([])` mapped to inputs.
  - `colors`: Array of hex codes stored in state mapped to `<input type="color" />`.
- **Financial Auto-calc:** When Admin inputs `original_price` and `discount`, hook automatically executes: `price = original_price - (original_price * discount / 100); profit = price - manual_cost`.
- **Storage Buckets:** File upload iterating over `<input multiple type="file" />`, uploading to `supabase.storage.from('products')`, returning URLs into the `images: text[]` field array.

---

## 🚛 PHASE 2: ORDER & OPERATIONS ARCHITECTURE

### 1. Operations Center (`Orders/OrderList.jsx`)
- **Supabase Query:** Deep Join: `supabase.from('Orders').select('*, Clients(email, phone), GovernoratesShipping(shippingPrice)')`.
- **Filtering Logic:** Dropdowns mapped to constants filtering by `status` string comparison.

### 2. Workflow Timeline (`Orders/OrderDetails.jsx`)
- **Status Mutator:** Buttons shifting state `pending -> paid -> shipped -> delivered`. Updating DB and firing an email trigger to the customer.
- **Cart Decompression:** Read from `Carts.items` JSONB (parsing product IDs and quantities).
- **Math Verification:** UI prints out `amount` = Sum of cart items - `promo_codes.discount` + `GovernoratesShipping.shippingPrice`. 

---

## 🚀 PHASE 3: MARKETING & PROMO CONFIGURATIONS

### 1. Promo Code Engine (`Marketing/PromoCodeManager.jsx`)
- **Form State:** `code_name`, `discount_val`, `type` (`fixed` vs `percentage`), `max_uses`, `expiry_date`.
- **Math Constraint:** Input validation preventing a percentage discount > 100%.

### 2. Banners Configuration (`Marketing/BannerForm.jsx`)
- **Live Preview System:** Right side of the screen renders EXACTLY what the consumer sees via inline styling:
  `<div style={{ background: `linear-gradient(${bg_linear_colors})` }}><h1 style={{color: title_color}}>{t('title')}</h1>...</div>`

---

## 👥 PHASE 4: CMS & CRM DATA 

### 1. Nav Editor (`CMS/NavMenuEditor.jsx`)
- **Logic:** Fetches `navigation_items`. Modifies `section_order` and `item_order` integers. Updates `item_label_en` wrapped for the frontend into `t()`.

### 2. Inbox (`CRM/MessageViewer.jsx`)
- **Realtime Integration:** Hooks mount `supabase.channel('public:ContactForm').on('postgres_changes', {event: 'INSERT'})` to dynamically update the notification bell count in the Header.

---

## 🧠 PHASE 5: THE CEO MASTER ANALYTICS (THE 11 METRICS)

All math here runs inside `services/dashboardService.js` applying massive array aggregations on the client to avoid backend timeouts, then passed to Recharts UI via `hooks/useDashboardStats.js`. Note: all strings in charts passed to `t()`.

### 1. CORE BUSINESS KPIs
- **Revenue Array calculation:** 
  `let totalRev = orders.reduce((acc, o) => acc + (o.total_amount - o.discount + o.shipping_price), 0)`
- **AOV (Average Order Value):** `totalRev / validOrdersCount`
- **Conversion Rate Math:** `(paidOrders.length / totalOrders.length) * 100 + '%'`

### 2. PRODUCT INTELLIGENCE (Product Health Score Formula)
- **Algorithm:** For every product, calculate `Score = (views * 0.1) + (sales_count * 2) + (rating * 10) - (outOfStockPenalty)`.
- If `Score > 80`: Tag as "`High Performer`" UI Badge. If `< 20`: "`At-Risk`".

### 3. CATEGORY ANALYTICS
- **Depth Tracker:** Count nested arrays evaluating `parent_id` arrays to show UI depth limits. Count sum of products assigned to each `slug`.

### 4. CRM & CUSTOMER INTELLIGENCE
- **CLV (Customer Lifetime Value) Algorithm:**
  1. Map all orders by `client_id`.
  2. Sum specific user purchase totals.
  3. UI Top List renders the absolute highest spenders.

### 5. ORDER OPERATIONS
- **Payment Distribution Array:** 
  Iterate `orders.forEach`. Build object: `{ credit: X, paypal: Y, cash: Z }`. Send to Recharts `PieChart`.

### 6. GEOGRAPHICS
- **Revenue per region Math:**
  Join `Orders` with `GovernoratesShipping`. Reduce: `salesByGov[gov.name] += order.amount`. Render into Recharts `BarChart` mapped to `layout="vertical"`.

### 7. MARKETING PERFORMANCE
- **Promo Revenue Leakage:**
  Sum all order `discount` values into single integer called `Lost Revenue`.
  Count array lengths of `promo_codes.used_by_user_ids` to find top promo.

### 8. CMS INSIGHTS
- Read `updated_at` timestamps of `Footer` & `AboutUsData`. Run JS `Date.now() - updated_at` to warn CEO "Content is stale (> 30 days)".

### 9. CART & CONVERSIONS
- Query `Carts`. Filter active carts (`updated_at > last 24 hours` but NOT linked to an Order ID).
- **Cart Abandonment Rate:** `(Abandoned Carts / Total Carts created) * 100`.

### 10. SYSTEM REAL-TIME METRICS
- Mount `supabase.channel` listening for any `INSERT` on `Orders` and `Clients` forcing a live reload of the Dashboard KPI numbers without refreshing.

### 11. ADVANCED BI (Business Health Index)
- **The Ultimate Formula:** 
  `let Index = (RevenueGrowthRatio * 40) + (CartConversionRate * 30) + (ProductHealthAverage * 20) + (CLV_Growth * 10) / 100`
  Generate a gauge dial chart rendering this exact number out of 100 to the CEO.

--- 
**EXECUTION RULE:** When executing, the developer will code exactly along this math blueprint, ensuring no single interface UI is rendered without its corresponding `i18n t('admin.domain.label')` wrap.
