const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'kaithi.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    role TEXT DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    mrp INTEGER NOT NULL,
    category TEXT NOT NULL,
    short_desc TEXT,
    description TEXT,
    ingredients TEXT, -- JSON array
    benefits TEXT, -- JSON array
    how_made TEXT,
    video_url TEXT,
    images TEXT, -- JSON array
    badge TEXT,
    rating REAL DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 120,
    weight TEXT,
    emoji TEXT,
    color TEXT,
    bottle_type TEXT,
    certifications TEXT, -- JSON array
    stock INTEGER DEFAULT 100,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    subtotal INTEGER NOT NULL,
    discount_amount INTEGER DEFAULT 0,
    coupon_code TEXT,
    shipping_fee INTEGER DEFAULT 0,
    total_amount INTEGER NOT NULL,
    payment_method TEXT NOT NULL, -- 'razorpay', 'upi', 'cod', 'test'
    payment_status TEXT DEFAULT 'pending', -- 'paid', 'pending', 'failed'
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    order_status TEXT DEFAULT 'Placed', -- 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    tracking_number TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    image TEXT,
    weight TEXT,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    user_id INTEGER,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    verified_buyer INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER,
    discount_flat INTEGER,
    min_order INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS email_otps (
    email TEXT PRIMARY KEY,
    otp TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  );
`);

// Seed default admin and sample customer
const adminCheck = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@kaithi.com');
if (!adminCheck) {
  const adminHash = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO users (name, email, password_hash, phone, address, city, state, pincode, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Dr. Nidhi Khakhkhar (Admin)',
    'admin@kaithi.com',
    adminHash,
    '+91 9428704882',
    'Ravi Complex, Avni Apartment',
    'Kodinar',
    'Gujarat',
    '362720',
    'admin'
  );

  const customerHash = bcrypt.hashSync('user123', 10);
  db.prepare(`
    INSERT INTO users (name, email, password_hash, phone, address, city, state, pincode, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Aarav Sharma',
    'customer@example.com',
    customerHash,
    '+91 9876543210',
    'Flat 402, Green Heritage Heights, MG Road',
    'Mumbai',
    'Maharashtra',
    '400001',
    'customer'
  );
}

// Seed default coupons
const couponCheck = db.prepare('SELECT COUNT(*) as count FROM coupons').get();
if (couponCheck.count === 0) {
  const insertCoupon = db.prepare(`
    INSERT INTO coupons (code, discount_percent, discount_flat, min_order, active)
    VALUES (?, ?, ?, ?, 1)
  `);
  insertCoupon.run('FIRST10', 10, null, 199);
  insertCoupon.run('AYURVEDA20', 20, null, 499);
  insertCoupon.run('GLOW50', null, 50, 299);
}

// Seed all 18 authentic products
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (productCount.count === 0) {
  const INITIAL_PRODUCTS = [
    {
      id: 4,
      name: "High-Potency Herbal Hair Oil",
      price: 300,
      mrp: 350,
      category: "Hair Care",
      short_desc: "Neelibringraj-Gunjadi formula via Kshir Pak Vidhi",
      description: "True to authentic Ayurvedic practices, this High-Potency Herbal Hair Oil is crafted using the ancient 'Kshir Pak Vidhi' — a meticulous formulation process where therapeutic herbs like Neelibringraj and Gunjadi are slowly boiled in pure milk and cold-pressed oils. This sacred infusion method extracts the deepest botanical potencies, creating an elixir that actively reduces hair fall, stimulates rich new growth, and profoundly nourishes the roots.",
      ingredients: ["Neelibringraj", "Gunjadi", "Pure Milk (Kshir Pak base)", "Amla", "Cold-pressed Sesame Oil"],
      benefits: ["Reduces Hair Fall", "Promotes Hair Growth", "Strengthens Hair Roots", "Nourishes Scalp", "Helps Control Dandruff"],
      how_made: "Prepared over several hours using the 'Kshir Pak Vidhi' technique — raw botanical herbs are repeatedly slow-boiled in pure milk until the moisture evaporates, leaving behind a highly concentrated, deeply nourishing therapeutic oil residue.",
      video_url: "https://www.youtube.com/embed/wcpJaFkW5v8",
      images: ["herbal_hair_oil.jpg", "herbal_hair_oil_3.jpg", "herbal_hair_oil_4.jpg"],
      badge: "Bestseller",
      rating: 4.9,
      reviews_count: 512,
      weight: "100ml",
      emoji: "🌿",
      color: "#4A7027",
      bottle_type: "dropper",
      certifications: ["100% Ayurvedic", "Kshir Pak Vidhi", "Handmade", "Chemical Free"]
    },
    {
      id: 7,
      name: "Herbal Shampoo",
      price: 250,
      mrp: 299,
      category: "Hair Care",
      short_desc: "SLS & Paraben Free handmade gentle cleanser",
      description: "Kaithi Ayurveda's Hand Made Herbal Shampoo is a revival of the ancient Indian hair-care ritual. Formulated from five sacred herbs—Amla, Reetha, Shikakai, Aloevera, and Bhringraj—this gentle cleanser works in harmony with your scalp's natural oils. Free from SLS, parabens, and synthetic surfactants, it cleanses without stripping, leaving hair naturally silky, smooth, and lustrous.",
      ingredients: ["Amla", "Reetha", "Shikakai", "Aloevera", "Bhringraj"],
      benefits: ["Hair Growth & Strengthening", "Hair Fall Protection", "Anti Dandruff", "Silky, Smooth & Shiny Hair", "SLS & Paraben Free", "Gentle Everyday Cleanser"],
      how_made: "Reetha and Shikakai are simmered in spring water overnight to release their natural saponins, creating a foaming base without any synthetic detergents. Amla is cold-pressed and added fresh for maximum Vitamin C potency. Bhringraj leaf extract is prepared through steam distillation and blended at carefully controlled temperatures.",
      video_url: "",
      images: ["shampoo_view_1.jpg", "shampoo_view_2.jpg", "shampoo_view_3.jpg", "shampoo_view_4.jpg"],
      badge: "Bestseller",
      rating: 4.9,
      reviews_count: 528,
      weight: "200ml",
      emoji: "🌿",
      color: "#3D6B4F",
      bottle_type: "pump",
      certifications: ["SLS Free", "Paraben Free", "Handmade", "Ayurvedic"]
    },
    {
      id: 8,
      name: "Herbal Rice Water Shampoo",
      price: 250,
      mrp: 299,
      category: "Hair Care",
      short_desc: "Supports hair growth & adds mirror shine",
      description: "Formulated with the ancient secrets of fermented Organic Rice Water, Aloe Vera, Amla, Rosemary, Flaxseeds, and Neem, this gentle cleanser revitalizes dull, limp hair. It significantly supports hair growth, reduces structural damage, and soothes the scalp while deeply improving hair texture.",
      ingredients: ["Organic Rice", "Aloe Vera", "Amla", "Rosemary", "Flaxseeds", "Neem"],
      benefits: ["Supports Hair Growth", "Adds Shine & Smoothness", "Reduces Damage", "Soothes the Scalp", "Improves Hair Texture", "SLS & Paraben Free"],
      how_made: "Organic rice is soaked and fermented carefully to unleash powerful amino acids and vitamins. This nutrient-rich water is blended with active extracts of rosemary, neem, and fresh aloe vera gel to create a pure, Ayurvedic cleansing rhythm.",
      video_url: "",
      images: ["rw_shampoo_3.jpg", "rw_shampoo_2.jpg", "rw_shampoo_1.jpg"],
      badge: "New",
      rating: 4.9,
      reviews_count: 412,
      weight: "200ml",
      emoji: "🌾",
      color: "#2A3A2C",
      bottle_type: "pump",
      certifications: ["SLS Free", "Paraben Free", "Handmade", "Ayurvedic"]
    },
    {
      id: 9,
      name: "Herbal Hibiscus Shampoo",
      price: 200,
      mrp: 250,
      category: "Hair Care",
      short_desc: "Adds moisture, volume & delays premature graying",
      description: "Richly formulated with the vibrant essence of Hibiscus, Aloe vera, Amla, Bhringraj, and Rosemary, this potent botanical blend naturally supports healthy hair growth. It deeply adds moisture and shine, effectively delays premature graying, and adds volume and thickness.",
      ingredients: ["Hibiscus", "Aloe Vera", "Amla", "Bhringraj", "Rosemary"],
      benefits: ["Supports Hair Growth", "Adds Moisture & Shine", "Delays Premature Graying", "Adds Volume & Thickness", "Reduces Dandruff & Scalp Irritation", "SLS & Paraben Free"],
      how_made: "Freshly handpicked hibiscus flowers and leaves are gently cold-pressed and infused with the potent trio of Amla, Bhringraj, and Rosemary to preserve their vibrant phytonutrients. This ruby-red infusion is carefully folded into a soothing aloe vera base.",
      video_url: "https://www.youtube.com/embed/sq9ePNMWaQE",
      images: ["hibiscus_4.jpg", "hibiscus_3.jpg", "hibiscus_2.jpg", "hibiscus_1.jpg"],
      badge: "Popular",
      rating: 4.9,
      reviews_count: 341,
      weight: "200ml",
      emoji: "🌺",
      color: "#8C223A",
      bottle_type: "pump",
      certifications: ["SLS Free", "Paraben Free", "Handmade", "Ayurvedic"]
    },
    {
      id: 10,
      name: "Detan Soap",
      price: 60,
      mrp: 80,
      category: "Body Care",
      short_desc: "Handmade organic bar to gently remove sun tan",
      description: "Crafted meticulously under the guidance of Dr. Nidhi Khakhkhar, this 100% organic Detan Soap is a natural, floral, and deeply nourishing bath bar designed to gently lift away stubborn sun tan and restore your skin's innate glow. Blending time-tested Ayurvedic herbs, this handmade formulation provides intense hydration.",
      ingredients: ["100% Organic Soap Base", "Licorice Extract", "Sandalwood", "Turmeric", "Floral Extracts", "Aloe Vera", "Almond Oil"],
      benefits: ["Gently Removes Sun Tan", "Nourishes & Hydrates Skin", "Soothes Sun Damage", "Improves Uneven Skin Tone", "Calming Floral Aroma", "100% Organic & Handmade"],
      how_made: "Organic floral extracts and powerful detanning Ayurvedic herbs are gently folded into a cold-pressed organic soap base. It is then slow-cured for weeks to lock in moisture before being hand-wrapped.",
      video_url: "",
      images: ["detan_soap_1.jpg", "detan_soap_2.jpg"],
      badge: "Handmade",
      rating: 4.8,
      reviews_count: 115,
      weight: "100g",
      emoji: "🧼",
      color: "#1C5632",
      bottle_type: "soap",
      certifications: ["100% Organic", "Handmade", "Ayurvedic"]
    },
    {
      id: 11,
      name: "Anti Acne Soap",
      price: 60,
      mrp: 80,
      category: "Face Care",
      short_desc: "Handmade organic bar to clear acne and blemishes",
      description: "Formulated following Ayurvedic principles, our Anti Acne Soap is an intensive clarifying bar designed to combat frequent breakouts and soothe active inflammation. Made from a 100% organic base, this handmade soap merges powerful antibacterial herbs like Neem and Tulsi with skin-repairing botanicals.",
      ingredients: ["100% Organic Soap Base", "Neem Extract", "Tulsi (Holy Basil)", "Tea Tree Oil", "Sandalwood", "Aloe Vera"],
      benefits: ["Clears Active Acne & Pimples", "Reduces Blemishes & Dark Spots", "Soothes Skin Inflammation", "Deep Cleanses Pores", "Antibacterial & Antifungal", "100% Organic & Handmade"],
      how_made: "Potent anti-acne Ayurvedic herbs are gently cold-processed into a pure organic soap base to ensure the vital botanical compounds remain active. Naturally slow-cured for maximum efficacy.",
      video_url: "",
      images: ["anti_acne_soap_1.jpg", "anti_acne_soap_2.jpg"],
      badge: "Handmade",
      rating: 4.7,
      reviews_count: 128,
      weight: "100g",
      emoji: "🌿",
      color: "#2A5934",
      bottle_type: "soap",
      certifications: ["100% Organic", "Handmade", "Ayurvedic"]
    },
    {
      id: 12,
      name: "Red Rose Soap",
      price: 60,
      mrp: 80,
      category: "Body Care",
      short_desc: "Handmade organic bar for deep hydration and floral luxury",
      description: "Experience true Ayurvedic luxury with our Red Rose Soap. Formulated from a 100% organic base, this handmade bar is infused with the essence of fresh red roses to soothe, deeply hydrate, and rejuvenate your skin. Its natural floral properties draw moisture into the skin while providing a calming romantic aroma.",
      ingredients: ["100% Organic Soap Base", "Red Rose Extract", "Rose Essential Oil", "Almond Oil", "Aloe Vera"],
      benefits: ["Deeply Hydrates & Softens Skin", "Luxurious Floral Aroma", "Soothes Skin Irritations", "Nourishes with Natural Oils", "Improves Skin Elasticity", "100% Organic & Handmade"],
      how_made: "Fresh red rose extracts and essential oils are slowly cold-processed into a pure organic soap base. This ensures delicate floral properties remain intact. Naturally cured and hand-wrapped.",
      video_url: "",
      images: ["red_rose_soap_1.jpg", "red_rose_soap_2.jpg"],
      badge: "Popular",
      rating: 4.8,
      reviews_count: 204,
      weight: "100g",
      emoji: "🌹",
      color: "#A01B34",
      bottle_type: "soap",
      certifications: ["100% Organic", "Handmade", "Ayurvedic"]
    },
    {
      id: 13,
      name: "Lavender Rose Soap",
      price: 60,
      mrp: 80,
      category: "Body Care",
      short_desc: "Handmade botanical bar for deep relaxation and skin harmony",
      description: "Unwind your body and mind with our exquisite Lavender Rose Soap. This hand-poured formulation marries the deep, soothing essence of mountain lavender with the intense hydration and romantic allure of red roses. Rooted in an organic base, it creates a deeply nourishing, fragrant lather.",
      ingredients: ["100% Organic Soap Base", "Lavender Extract", "Rose Petal Extract", "Lavender Essential Oil", "Sweet Almond Oil"],
      benefits: ["Calms the Nervous System", "Deeply Softens & Hydrates", "Improves Skin Elasticity", "Rich Floral & Herbal Aroma", "Gently Washes Away Impurities", "100% Organic & Handmade"],
      how_made: "Pure extracts of lavender and rose are cold-processed into an organic plant-based matrix to ensure the delicate aromatherapeutic oils remain unbroken. Naturally slow-cured.",
      video_url: "",
      images: ["lavender_rose_soap_1.jpg", "lavender_rose_soap_2.jpg"],
      badge: "Handmade",
      rating: 4.9,
      reviews_count: 182,
      weight: "100g",
      emoji: "🪻",
      color: "#843B80",
      bottle_type: "soap",
      certifications: ["100% Organic", "Handmade", "Ayurvedic"]
    },
    {
      id: 14,
      name: "Pink Rose Soap",
      price: 60,
      mrp: 80,
      category: "Body Care",
      short_desc: "Handmade botanical bar for gentle brightening and nourishment",
      description: "Embrace the delicate beauty of our Pink Rose Soap. Cultivated for sensitive and dull skin, this 100% organic handmade bar is enriched with the pure extract of light pink roses. It offers a gentle, non-stripping cleanse that actively brightens the complexion while leaving behind a lingering, subtle blush-floral scent.",
      ingredients: ["100% Organic Soap Base", "Pink Rose Extract", "Rose Water", "Coconut Oil", "Shea Butter"],
      benefits: ["Gently Brightens Complexion", "Soothes Sensitive Skin", "Provides a Subtle Blush-Floral Scent", "Nourishes with Natural Oils", "Non-stripping Cleanse", "100% Organic & Handmade"],
      how_made: "We cold-press delicate pink rose petals and blend them seamlessly into an organic plant-based soap matrix enriched with shea butter. Once poured and naturally slow-cured, each soap is individually wrapped.",
      video_url: "",
      images: ["pink_rose_soap_1.jpg", "pink_rose_soap_2.jpg", "pink_rose_soap_3.jpg"],
      badge: "Handmade",
      rating: 4.8,
      reviews_count: 156,
      weight: "100g",
      emoji: "🌸",
      color: "#D16B87",
      bottle_type: "soap",
      certifications: ["100% Organic", "Handmade", "Ayurvedic"]
    },
    {
      id: 15,
      name: "Saffron Soap",
      price: 60,
      mrp: 85,
      category: "Face Care",
      short_desc: "Handmade organic bar for a radiant, golden complexion",
      description: "Unlock a naturally luminous glow with our Saffron Soap. Crafted meticulously with deeply treasured pure Kashmiri Saffron, this incredibly rich organic bar is a powerhouse of antioxidants. It intensely brightens the skin tone, reduces pigmentation, and delivers a deeply nourishing, luxurious wash.",
      ingredients: ["100% Organic Soap Base", "Pure Kashmiri Saffron (Kesar)", "Sandalwood Extract", "Vitamin E", "Almond Oil", "Raw Honey"],
      benefits: ["Illuminates & Brightens Skin", "Reduces Dark Spots & Pigmentation", "Rich in Antioxidants", "Deeply Nourishes the Skin Barrier", "Leaves a Gentle Floral Scent", "100% Organic & Handmade"],
      how_made: "Pure strands of Kashmiri saffron and sandalwood extract are steeped slowly and carefully cold-processed into a nutrient-rich organic base, granting the soap its signature golden hue.",
      video_url: "",
      images: ["saffron_soap_1.jpg", "saffron_soap_2.jpg"],
      badge: "Bestseller",
      rating: 4.9,
      reviews_count: 312,
      weight: "100g",
      emoji: "✨",
      color: "#D37326",
      bottle_type: "soap",
      certifications: ["100% Organic", "Handmade", "Ayurvedic"]
    },
    {
      id: 16,
      name: "Alovera Soap",
      price: 60,
      mrp: 80,
      category: "Body Care",
      short_desc: "Handmade organic bar for profound hydration and skin soothing",
      description: "Quench your skin with the ultimate hydrating powerhouse. Our pure Alovera Soap pairs incredibly soothing, fresh aloe vera gel with a deeply nourishing 100% organic soap base. Perfect for irritated or remarkably dry skin, it heals instantly upon contact and locks in natural moisture.",
      ingredients: ["100% Organic Soap Base", "Fresh Aloe Vera Gel", "Vitamin E", "Neem Extract", "Plant Glycerin"],
      benefits: ["Profoundly Hydrates & Soothes", "Calms Skin Irritation & Sunburns", "Locks in Essential Moisture", "Promotes a Cooling Sensation", "Gentle for Sensitive Skin", "100% Organic & Handmade"],
      how_made: "We extract pure gel from fresh organic aloe vera leaves and slowly fold it into an organic cold-pressed plant base. Naturally slow-cured and wrapped by hand.",
      video_url: "",
      images: ["aloe_vera_soap_1.jpg", "aloe_vera_soap_2.jpg"],
      badge: "Handmade",
      rating: 4.8,
      reviews_count: 189,
      weight: "100g",
      emoji: "🌵",
      color: "#81B622",
      bottle_type: "soap",
      certifications: ["100% Organic", "Handmade", "Ayurvedic"]
    },
    {
      id: 17,
      name: "Orange Soap",
      price: 60,
      mrp: 80,
      category: "Body Care",
      short_desc: "Handmade Vitamin C bar for an energizing, radiant cleanse",
      description: "Awaken your senses with our vibrant Orange Soap. Infused with pure citrus extracts and powerful Vitamin C, this energizing 100% organic handmade bar delivers a profoundly refreshing cleanse. It naturally exfoliates dead cells and brightens your natural complexion.",
      ingredients: ["100% Organic Soap Base", "Sweet Orange Extract", "Orange Peel Oil", "Vitamin C", "Glycerin"],
      benefits: ["Energizes & Refreshes Skin", "Rich in Brightening Vitamin C", "Naturally Clears Excess Oil", "Uplifting Citrus-Floral Aroma", "Gently Exfoliates Dead Cells", "100% Organic & Handmade"],
      how_made: "Raw fresh orange extracts and cold-pressed citrus oils are delicately folded into an organic soap base with zero heat, preserving volatile Vitamin C compounds.",
      video_url: "",
      images: ["orange_soap_1.jpg", "orange_soap_2.jpg"],
      badge: "Handmade",
      rating: 4.7,
      reviews_count: 218,
      weight: "120g",
      emoji: "🍊",
      color: "#D77A23",
      bottle_type: "soap",
      certifications: ["100% Organic", "Handmade", "Ayurvedic"]
    },
    {
      id: 18,
      name: "Lemon Soap",
      price: 60,
      mrp: 80,
      category: "Body Care",
      short_desc: "Handmade botanical bar for a deeply clarifying & zesty cleanse",
      description: "Purify and clarify your skin with our refreshing Lemon Soap. Naturally astringent and packed with botanical antioxidants, this 100% organic handmade bar cuts through deeply trapped impurities and excess oils effortlessly.",
      ingredients: ["100% Organic Soap Base", "Lemon Peel Extract", "Lemon Essential Oil", "Vitamin C", "Glycerin"],
      benefits: ["Deeply Clarifies & Cleanses", "Naturally Tightens Pores", "Cuts Through Excess Oils", "Zesty, Invigorating Citrus Scent", "Rich in Natural Antioxidants", "100% Organic & Handmade"],
      how_made: "Freshly grated lemon peel and essential citrus oils are carefully cold-pressed into a clear organic soap base, ensuring natural botanical astringents remain active.",
      video_url: "",
      images: ["lemon_soap_1.jpg", "lemon_soap_2.jpg", "lemon_soap_3.jpg"],
      badge: "Handmade",
      rating: 4.8,
      reviews_count: 164,
      weight: "100g",
      emoji: "🍋",
      color: "#D4BB24",
      bottle_type: "soap",
      certifications: ["100% Organic", "Handmade", "Ayurvedic"]
    },
    {
      id: 19,
      name: "Sandalwood Soap",
      price: 60,
      mrp: 85,
      category: "Body Care",
      short_desc: "Handmade traditional bar featuring premium sandalwood (Chandan)",
      description: "Step into a timeless Ayurvedic ritual with our pure Sandalwood Soap. Revered for centuries, Sandalwood (Chandan) is a powerful natural coolant that actively soothes inflamed, acne-prone, or sun-damaged skin.",
      ingredients: ["100% Organic Soap Base", "Premium Sandalwood Extract", "Sandalwood Essential Oil", "Almond Oil", "Raw Honey"],
      benefits: ["Actively Soothes Body Heat & Inflammation", "Iconic Earthy & Calming Aroma", "Clarifies Blemishes Naturally", "Balances Oily & Dry Skin", "Cools Sun-damaged Skin", "100% Organic & Handmade"],
      how_made: "Fine sandalwood extracts and pure oils are folded into an organic plant-based matrix without the use of harsh heat, preserving soothing Chandan compounds.",
      video_url: "",
      images: ["sandalwood_soap_1.jpg", "sandalwood_soap_2.jpg", "sandalwood_soap_3.jpg"],
      badge: "Bestseller",
      rating: 4.9,
      reviews_count: 310,
      weight: "100g",
      emoji: "🪵",
      color: "#63432B",
      bottle_type: "soap",
      certifications: ["100% Organic", "Handmade", "Ayurvedic"]
    },
    {
      id: 20,
      name: "Fairness Face Pack",
      price: 120,
      mrp: 150,
      category: "Face Care",
      short_desc: "Enriched with Avocado & Cucumber for a brightened skin tone",
      description: "Reveal your inner radiance with our 100% natural, homemade Fairness Face Pack. Expertly enriched with the deep, creamy nourishment of Avocado and the cooling hydration of fresh Cucumber, this botanical powder mask is designed to brighten your complexion naturally.",
      ingredients: ["Avocado Extract", "Cucumber Extract", "Turmeric", "Sandalwood Powder", "Almond Grind", "Multani Mitti"],
      benefits: ["Actively Brightens Skin Tone", "Provides Deep Pore Cleansing", "Intensely Hydrating Formula", "Suitable for All Skin Types", "Repairs and Rejuvenates Dull Skin", "100% Natural & Homemade"],
      how_made: "Extracts of avocado, cucumber, and turmeric are finely milled into a dry mask base that requires zero artificial preservatives. Mix with rose water or raw milk to activate.",
      video_url: "",
      images: ["fairness_face_pack_1.jpg", "fairness_face_pack_2.jpg", "fairness_face_pack_3.jpg", "fairness_face_pack_4.jpg"],
      badge: "100% Natural",
      rating: 4.9,
      reviews_count: 142,
      weight: "50g",
      emoji: "🥑",
      color: "#3B7D48",
      bottle_type: "pouch",
      certifications: ["100% Natural", "Homemade", "Ayurvedic"]
    },
    {
      id: 21,
      name: "Detan Face Pack",
      price: 90,
      mrp: 120,
      category: "Face Care",
      short_desc: "100% Ayurvedic Sun Tan Removal formula with Sandalwood & Turmeric",
      description: "Reverse sun damage and restore your natural glow with our authentic Detan Face Pack. This 100% Ayurvedic powder blends the potent cooling properties of Sandalwood with the deep healing and brightening effects of Turmeric.",
      ingredients: ["Pure Sandalwood Extract", "Wild Turmeric (Kasturi Haldi)", "Lemon Peel Extract", "Multani Mitti", "Rose Petal Powder"],
      benefits: ["Actively Removes Sun Tan", "Cools and Soothes Sun-Exposed Skin", "100% Ayurvedic Natural De-Tan", "Clears Blemishes & Dark Spots", "Enhances Natural Skin Radiance", "Free from Bleaching Agents"],
      how_made: "Premium sandalwood twigs and wild turmeric roots are finely milled into a versatile, active clay base, preserving the potent sun-damage reversing enzymes.",
      video_url: "",
      images: ["detan_face_pack_1.jpg", "detan_face_pack_2.jpg", "detan_face_pack_3.jpg"],
      badge: "100% Ayurvedic",
      rating: 4.8,
      reviews_count: 187,
      weight: "50g",
      emoji: "☀️",
      color: "#AC7A3E",
      bottle_type: "pouch",
      certifications: ["100% Ayurvedic", "Natural De-Tan", "Homemade"]
    },
    {
      id: 22,
      name: "Ayurvedic Hair Pack",
      price: 150,
      mrp: 180,
      category: "Hair Care",
      short_desc: "100% natural and homemade powder mask for deep root nourishment",
      description: "Revitalize your roots and drastically reduce hair fall with our Ayurvedic Hair Pack. Created from a deeply traditional blend of 100% natural, sun-dried herbs like Hibiscus, Amla, and Fenugreek (Methi) seeds.",
      ingredients: ["Dried Hibiscus Petals", "Amla (Indian Gooseberry)", "Fenugreek Seeds (Methi)", "Brahmi Powder", "Bhringraj Powder", "Coconut Oil Traces"],
      benefits: ["Actively Reduces Hair Fall", "Adds Brilliant Natural Shine", "Delivers Deep Root Nourishment", "Strengthens Hair Follicles", "Suitable for All Hair Types", "100% Natural & Homemade"],
      how_made: "Hand-selected dried herbs are ground to preserve their vital phytochemicals. Mix with yogurt or oil to activate nutrients right before application.",
      video_url: "",
      images: ["hair_pack_1.jpg", "hair_pack_2.jpg", "hair_pack_3.jpg"],
      badge: "100% Natural",
      rating: 4.9,
      reviews_count: 258,
      weight: "100g",
      emoji: "🌱",
      color: "#8F6740",
      bottle_type: "pouch",
      certifications: ["100% Natural", "Homemade", "Ayurvedic"]
    },
    {
      id: 23,
      name: "Ayurvedic Face Gel",
      price: 150,
      mrp: 190,
      category: "Face Care",
      short_desc: "Pure Aloe Vera based hydrating gel for a naturally glowing face",
      description: "Experience deep, lightweight hydration with our Herbal & Homemade Ayurvedic Face Gel. Built perfectly upon a pure Aloe Vera base, this exquisitely soothing gel absorbs instantly into the skin without leaving any greasy residue. Flawlessly clears skin.",
      ingredients: ["Pure Aloe Vera Gel Extract", "Vitamin E", "Rose Water Extract", "Glycerin", "Natural Preservatives"],
      benefits: ["Intensely Hydrates without Greasiness", "Cools and Soothes Irritated Skin", "Promotes a Clear Glowing Complexion", "100% Paraben Free and Safe", "Perfect for Daily AM/PM Use", "Herbal & Homemade Care"],
      how_made: "Raw mucilage extracted from fresh organic Aloe Vera leaves is gently homogenized with soothing rose water and Vitamin E at perfectly stable temperatures.",
      video_url: "https://www.youtube.com/embed/u6xEDjkJIrY",
      images: ["face_gel_1.jpg", "face_gel_2.jpg", "face_gel_3.jpg"],
      badge: "Paraben Free",
      rating: 4.9,
      reviews_count: 195,
      weight: "50g",
      emoji: "🪴",
      color: "#ACBB3B",
      bottle_type: "jar",
      certifications: ["Pure Aloe Extract", "Paraben Free", "Homemade"]
    }
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, name, price, mrp, category, short_desc, description, ingredients, benefits,
      how_made, video_url, images, badge, rating, reviews_count, weight, emoji, color,
      bottle_type, certifications
    ) VALUES (
      @id, @name, @price, @mrp, @category, @short_desc, @description, @ingredients, @benefits,
      @how_made, @video_url, @images, @badge, @rating, @reviews_count, @weight, @emoji, @color,
      @bottle_type, @certifications
    )
  `);

  const insertReview = db.prepare(`
    INSERT INTO reviews (product_id, user_name, rating, comment, verified_buyer, created_at)
    VALUES (?, ?, ?, ?, 1, datetime('now', '-3 days'))
  `);

  for (const p of INITIAL_PRODUCTS) {
    insertProduct.run({
      ...p,
      rating: 0,
      reviews_count: 0,
      ingredients: JSON.stringify(p.ingredients),
      benefits: JSON.stringify(p.benefits),
      images: JSON.stringify(p.images),
      certifications: JSON.stringify(p.certifications || [])
    });
  }
}

// Seed sample past orders so Admin and Customer can view realistic tracking immediately
const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get();
if (orderCount.count === 0) {
  const sampleOrder = db.prepare(`
    INSERT INTO orders (
      order_number, user_id, customer_name, customer_email, customer_phone,
      shipping_address, city, state, pincode, subtotal, discount_amount, coupon_code,
      shipping_fee, total_amount, payment_method, payment_status, order_status,
      tracking_number, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-2 days'))
  `).run(
    'KA-892104',
    2,
    'Aarav Sharma',
    'customer@example.com',
    '+91 9876543210',
    'Flat 402, Green Heritage Heights, MG Road',
    'Mumbai',
    'Maharashtra',
    '400001',
    550,
    55,
    'FIRST10',
    0,
    495,
    'razorpay',
    'paid',
    'Shipped',
    'DELHIVERY-992147192'
  );

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image, weight)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertItem.run(sampleOrder.lastInsertRowid, 4, 'High-Potency Herbal Hair Oil', 300, 1, 'herbal_hair_oil.jpg', '100ml');
  insertItem.run(sampleOrder.lastInsertRowid, 7, 'Herbal Shampoo', 250, 1, 'shampoo_view_1.jpg', '200ml');
}

module.exports = db;
