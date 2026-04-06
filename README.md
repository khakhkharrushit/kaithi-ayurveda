# 🌿 Kaithi Ayurveda — Premium Streamlit Web App

A luxury Ayurvedic brand experience built with Streamlit + embedded Three.js 3D.

---

## 🚀 Quick Start

```bash
# 1. Clone or copy the project folder
cd kaithi_ayurveda

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run locally
streamlit run app.py
```

---

## 📁 Project Structure

```
kaithi_ayurveda/
├── app.py                         # Main entry point
├── requirements.txt
├── .streamlit/config.toml         # Theme config
├── data/
│   └── products.py                # Product data (JSON-style dicts)
└── components/
    ├── styles.py                  # Global CSS injection
    ├── navbar.py                  # Fixed top navigation
    ├── hero.py                    # Hero section with animations
    ├── counters.py                # Animated stats counters
    ├── products.py                # Product grid with search/filter
    ├── product_detail.py          # Full detail page + 3D viewer
    ├── about.py                   # Brand story section
    ├── videos.py                  # Process video section
    ├── instagram.py               # Instagram feed grid
    ├── testimonials.py            # Customer reviews
    └── contact.py                 # Contact form + footer
```

---

## ➕ Adding a New Product

Open `data/products.py` and add a new dict to the `PRODUCTS` list:

```python
{
    "id": 7,                          # Unique integer ID
    "name": "Rose Water Toner",
    "price": "₹249",
    "category": "Face Care",          # Used for filter dropdown
    "short_desc": "Steam-distilled Bulgarian rose toner",
    "description": "Full description here...",
    "ingredients": ["Rose Petals", "Witch Hazel", "Glycerin"],
    "benefits": ["Tightens pores", "Hydrates", "Balances pH"],
    "how_made": "Description of the artisanal process...",
    "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID",
    "badge": "New",                   # "" | "New" | "Bestseller"
    "rating": 4.7,
    "reviews": 88,
    "weight": "100ml",
    "emoji": "🌹",
    "color": "#E8A0A0",              # Hex color for 3D jar + card accent
},
```

**That's it.** The product will auto-appear in the grid, search, and filter.

---

## 🌐 Adding a Real 3D Model (GLB/GLTF)

The 3D viewer currently uses procedurally generated Three.js geometry.
Here's how to upgrade to a real product model:

### Option A: Use Google's `<model-viewer>` (Easiest)

1. Export your product as `.glb` (Blender → File → Export → glTF 2.0)
2. Host the file on a CDN (e.g., Cloudflare R2, AWS S3, or Firebase Storage)
3. In `components/product_detail.py`, replace the Three.js iframe with:

```python
components.html(f"""
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
<model-viewer
    src="https://your-cdn.com/models/{product['id']}.glb"
    alt="{product['name']}"
    auto-rotate
    camera-controls
    shadow-intensity="1"
    style="width:100%;height:400px;border-radius:16px;background:#FAF7F2;"
    exposure="1.2"
    ar>
</model-viewer>
""", height=420)
```

4. Add `"3d_model": "https://your-cdn.com/models/product1.glb"` to each product dict.

### Option B: Load GLB in Three.js (Advanced)

1. Host your `.glb` file on a public CDN
2. In `product_detail.py`, add the GLTFLoader:

```javascript
// Add to Three.js script:
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('https://your-cdn.com/model.glb', function(gltf) {
    scene.add(gltf.scene);
    // Optionally auto-rotate
});
```

### Option C: AR-Ready on Mobile

Use `<model-viewer>` with `ar` and `ar-modes="webxr scene-viewer"` for AR view on Android.

---

## 🌍 Deploy to Streamlit Cloud

1. Push project to a GitHub repo
2. Go to https://share.streamlit.io
3. Connect your repo → select `app.py` as entrypoint
4. Done! Free hosting.

---

## 🎨 Customization Cheatsheet

| What to change | Where |
|---|---|
| Brand colors | `components/styles.py` → CSS variables |
| Dark/light theme defaults | `app.py` → `st.session_state.dark_mode = True/False` |
| Product data | `data/products.py` |
| Hero tagline | `components/hero.py` → `.hero-title` |
| About story | `components/about.py` |
| Instagram handle | `components/instagram.py` → `.handle` |
| WhatsApp number | `components/contact.py` → `wa.me/` link |
| Video embeds | Replace YouTube embed URLs in `data/products.py` and `components/videos.py` |

---

## 📦 Tech Stack

- **Streamlit** — Python web framework
- **Three.js r128** — 3D product viewer (via CDN in `components.html`)
- **Google Fonts** — Cormorant Garamond + Jost
- **Pure CSS animations** — no extra JS libraries needed
- **session_state** — cart, dark mode, selected product

---

*Built with 🌿 for Kaithi Ayurveda*
