import streamlit as st
import streamlit.components.v1 as components
import base64
import os


def get_label_b64(label_image):
    """Read a label image from assets/ and return a base64 data URL."""
    if not label_image:
        return None
    img_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets", label_image)
    if not os.path.exists(img_path):
        return None
    with open(img_path, "rb") as f:
        data = base64.b64encode(f.read()).decode()
    ext = label_image.rsplit(".", 1)[-1].lower()
    mime = "image/png" if ext == "png" else "image/jpeg"
    return f"data:{mime};base64,{data}"


def render_product_gallery(product):
    images = product.get('images', [])
    product_color = product.get('color', '#3D6B4F')
    product_name = product.get('name', '')
    product_emoji = product.get('emoji', '')
    if not images and product.get('label_image'):
        images = [product.get('label_image')]
        
    b64_images = [get_label_b64(img) for img in images]
    b64_images = [i for i in b64_images if i]
    
    if not b64_images:
        components.html(f"""
        <div style="width:100%;height:420px;background:{product_color};display:flex;align-items:center;justify-content:center;border-radius:16px;">
            <h2 style="color:white;font-family:sans-serif;opacity:0.5;">{product_emoji} {product_name}</h2>
        </div>
        """, height=440)
        return

    imgs_js_array = "[" + ",".join([f"'{img}'" for img in b64_images]) + "]"
    thumbs_html = "".join([f'<img class="thumb {"active" if i==0 else ""}" data-idx="{i}" src="{img}" />' for i, img in enumerate(b64_images)])
    
    components.html(f"""
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        * {{ margin:0; padding:0; box-sizing:border-box; }}
        body {{ background: transparent; overflow: hidden; font-family: sans-serif; }}
        #gallery-container {{
            width: 100%; height: 530px;
            position: relative; border-radius: 16px; overflow: hidden;
            background: #F9F9F9;
            display: flex; flex-direction: column;
        }}
        #main-image-container {{
            flex: 1;
            display: flex; align-items: center; justify-content: center;
            padding: 20px;
            position: relative;
            height: calc(100% - 70px);
        }}
        #main-image {{
            max-width: 100%; height: 100%;
            object-fit: contain;
            border-radius: 8px;
            transition: opacity 0.3s ease;
        }}
        .nav-btn {{
            position: absolute; top: 50%; transform: translateY(-50%);
            background: rgba(201,169,110,0.15); border: 1px solid rgba(201,169,110,0.3);
            color: #C9A96E; border-radius: 50%; width: 40px; height: 40px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; font-size: 1.5rem; transition: background 0.2s; outline: none;
            z-index: 10;
        }}
        .nav-btn:hover {{ background: rgba(201,169,110,0.4); }}
        #prev-btn {{ left: 10px; }}
        #next-btn {{ right: 10px; }}
        
        #thumbnails {{
            display: flex; gap: 8px; padding: 10px;
            background: rgba(0,0,0,0.02); align-items: center; justify-content: center;
            overflow-x: auto; border-top: 1px solid rgba(0,0,0,0.05);
        }}
        .thumb {{
            width: 50px; height: 50px; border-radius: 6px;
            object-fit: cover; cursor: pointer; border: 2px solid transparent;
            opacity: 0.6; transition: all 0.2s;
        }}
        .thumb.active {{
            border-color: #C9A96E; opacity: 1; transform: scale(1.05);
        }}
        .viewer-hint {{
            position: absolute; top: 14px; right: 14px;
            padding: 5px 12px;
            background: rgba(201,169,110,0.1); border: 1px solid rgba(201,169,110,0.2);
            border-radius: 20px; font-family: sans-serif; font-size: 0.62rem;
            color: rgba(201,169,110,0.7); letter-spacing: 0.1em;
        }}
    </style>
    </head>
    <body>
    <div id="gallery-container">
        <div class="viewer-hint">📷 Image Gallery</div>
        <div id="main-image-container">
            <button id="prev-btn" class="nav-btn">‹</button>
            <img id="main-image" src="{b64_images[0]}" />
            <button id="next-btn" class="nav-btn">›</button>
        </div>
        <div id="thumbnails">
            {thumbs_html}
        </div>
    </div>

    <script>
        const images = {imgs_js_array};
        let currIdx = 0;
        const mainImg = document.getElementById('main-image');
        const thumbs = document.querySelectorAll('.thumb');
        
        function updateGallery(idx) {{
            currIdx = (idx + images.length) % images.length;
            mainImg.style.opacity = 0;
            setTimeout(() => {{
                mainImg.src = images[currIdx];
                mainImg.style.opacity = 1;
            }}, 150);
            thumbs.forEach(t => t.classList.remove('active'));
            thumbs[currIdx].classList.add('active');
        }}

        document.getElementById('prev-btn').addEventListener('click', () => updateGallery(currIdx - 1));
        document.getElementById('next-btn').addEventListener('click', () => updateGallery(currIdx + 1));
        
        thumbs.forEach(t => {{
            t.addEventListener('click', (e) => {{
                updateGallery(parseInt(e.target.dataset.idx));
            }});
        }});
        
        let startX = 0;
        const container = document.getElementById('main-image-container');
        container.addEventListener('touchstart', e => startX = e.touches[0].clientX);
        container.addEventListener('touchend', e => {{
            let endX = e.changedTouches[0].clientX;
            if(startX - endX > 50) updateGallery(currIdx + 1);
            else if(endX - startX > 50) updateGallery(currIdx - 1);
        }});
    </script>
    </body>
    </html>
    """, height=550)


def render_product_detail(product):
    dark = st.session_state.dark_mode

    # Force the main window to scroll to the top automatically upon rendering this view.
    components.html("""
    <script>
        setTimeout(() => {
            const doc = window.parent ? window.parent.document : document;
            if (window.parent) window.parent.scrollTo(0, 0);
            
            // Look for Streamlit's native scroll containers
            const stMain = doc.querySelector('[data-testid="stMain"]');
            if (stMain) stMain.scrollTop = 0;
            
            const mainApp = doc.querySelector('.stApp');
            if (mainApp) mainApp.scrollTop = 0;
        }, 50);
        setTimeout(() => {
            const doc = window.parent ? window.parent.document : document;
            const stMain = doc.querySelector('[data-testid="stMain"]');
            if (stMain) stMain.scrollTop = 0;
        }, 300); // Double-catch in case of delayed layout shifts
    </script>
    """, height=0)

    bg      = "#0D0C0A" if dark else "#FAF7F2"
    surface = "#1A1814" if dark else "#FFFFFF"
    surface2= "#252219" if dark else "#F5F0E8"
    text    = "#F5EDD8" if dark else "#1C1A16"
    muted   = "#A89880" if dark else "#6B5E4E"
    border  = "#3A352D" if dark else "#E8DDD0"

    bottle_type = product.get("bottle_type", "jar")

    # Load label image if available
    label_b64 = get_label_b64(product.get("label_image"))

    # ── Back Button ────────────────────────────────────────────
    if st.button("← Back to Products", key="back_btn"):
        st.session_state.selected_product = None
        st.rerun()

    # ── Hero Header ────────────────────────────────────────────
    st.html(f"""
    <div style="padding:16px 5vw 0;background:{bg};">
        <p style="font-family:'Jost';font-size:0.65rem;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:#C9A96E;margin-bottom:4px;">{product['category']}</p>
        <h1 style="font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:300;color:{text};margin-bottom:6px;">{product['emoji']} &nbsp;{product['name']}</h1>
        <p style="font-family:'Jost';font-size:0.9rem;font-weight:300;color:{muted};margin-bottom:20px;">{product['short_desc']}</p>
    </div>
    """)

    # ── Certification Badges ───────────────────────────────────
    certs = product.get("certifications", [])
    if certs:
        badge_items = "".join([f"""
        <span style="display:inline-flex;align-items:center;gap:5px;
            padding:5px 14px;border-radius:30px;
            background:rgba(61,107,79,0.12);border:1px solid rgba(61,107,79,0.3);
            font-family:'Jost',sans-serif;font-size:0.68rem;font-weight:500;
            letter-spacing:0.08em;color:#3D6B4F;margin:3px;">
            ✓ {c}
        </span>""" for c in certs])
        st.html(f"""
        <div style="padding:0 5vw 20px;background:{bg};">
            <div style="display:flex;flex-wrap:wrap;gap:4px;">{badge_items}</div>
        </div>""")

    # ── Two-Column Layout ──────────────────────────────────────
    col_left, col_right = st.columns([1, 1], gap="large")

    with col_left:
        st.html(f"""
        <div style="background:{surface};border:1px solid {border};border-radius:20px;overflow:hidden;margin-bottom:8px;">
        """)

        render_product_gallery(product)

        st.html(f"""
        <div style="padding:12px 20px;border-top:1px solid {border};text-align:center;">
            <p style="font-family:'Jost';font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase;color:{muted};">
                📸 Product Image Gallery · Desktop & Mobile
            </p>
        </div>
        </div>
        """)

        # ── Quick Specs card ───────────────────────────────────
        net_vol = product.get("net_volume") or product.get("weight", "—")
        mrp     = product.get("mrp") or product.get("price", "—")
        mfr     = product.get("manufacturer", "Kaithi Ayurveda")
        contact = product.get("contact", "+91 9428704882")
        email   = product.get("email", "kaithiayurveda@gmail.com")

        st.html(f"""
        <div style="background:{surface};border:1px solid {border};border-radius:16px;padding:22px 24px;margin-top:12px;">
            <p style="font-family:'Jost';font-size:0.65rem;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#C9A96E;margin-bottom:14px;">📋 Product Details</p>
            <table style="width:100%;border-collapse:collapse;font-family:'Jost';font-size:0.82rem;">
                <tr style="border-bottom:1px solid {border};">
                    <td style="padding:7px 0;color:{muted};font-weight:400;">Net Volume</td>
                    <td style="padding:7px 0;color:{text};font-weight:500;text-align:right;">{net_vol}</td>
                </tr>
                <tr style="border-bottom:1px solid {border};">
                    <td style="padding:7px 0;color:{muted};">MRP</td>
                    <td style="padding:7px 0;color:#C9A96E;font-weight:600;text-align:right;">{mrp} <span style="font-size:0.68rem;color:{muted};">(incl. of taxes)</span></td>
                </tr>
                <tr style="border-bottom:1px solid {border};">
                    <td style="padding:7px 0;color:{muted};">Manufactured By</td>
                    <td style="padding:7px 0;color:{text};font-weight:500;text-align:right;">{mfr}</td>
                </tr>
                <tr style="border-bottom:1px solid {border};">
                    <td style="padding:7px 0;color:{muted};">Contact</td>
                    <td style="padding:7px 0;color:{text};text-align:right;">{contact}</td>
                </tr>
                <tr>
                    <td style="padding:7px 0;color:{muted};">Email</td>
                    <td style="padding:7px 0;text-align:right;"><a href="mailto:{email}" style="color:#C9A96E;text-decoration:none;">{email}</a></td>
                </tr>
            </table>
        </div>
        """)

    with col_right:
        # Price & Rating
        st.html(f"""
        <div style="margin-bottom:24px;">
            <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:8px;">
                <span style="font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:300;color:#C9A96E;">{product['price']}</span>
                <span style="font-family:'Jost';font-size:0.78rem;color:{muted};">{product['weight']} &nbsp;·&nbsp; incl. of taxes</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
                <span style="color:#C9A96E;font-size:1rem;">{'★' * int(product['rating'])}{'☆' * (5 - int(product['rating']))}</span>
                <span style="font-family:'Jost';font-size:0.8rem;color:{muted};">{product['rating']} · {product['reviews']} reviews</span>
            </div>
        </div>
        """)

        # CTA Buttons
        wa_weight = product.get('weight', '')
        wa_msg = f"Hi! I'm interested in ordering the {product['name']}. ({wa_weight})"
        st.link_button("💌 WhatsApp Order", f"https://wa.me/919428704882?text={wa_msg}", use_container_width=True)

        # About
        st.html(f"""
        <div style="margin-top:24px;padding:20px 22px;background:{surface};border:1px solid {border};border-radius:14px;">
            <p style="font-family:'Jost';font-size:0.65rem;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#C9A96E;margin-bottom:10px;">About</p>
            <p style="font-family:'Jost';font-size:0.88rem;font-weight:300;color:{muted};line-height:1.9;">{product['description']}</p>
        </div>
        """)

        # Key Ingredients
        ingr_pills = "".join([f"""
        <span style="display:inline-block;padding:5px 14px;border-radius:20px;
            background:{surface2};border:1px solid {border};
            font-size:0.78rem;color:{muted};margin:3px;font-family:Jost;">🌿 {ing}</span>
        """ for ing in product['ingredients']])
        st.html(f"""
        <div style="margin-top:20px;padding:20px 22px;background:{surface};border:1px solid {border};border-radius:14px;">
            <p style="font-family:'Jost';font-size:0.65rem;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#C9A96E;margin-bottom:10px;">Key Ingredients</p>
            <div>{ingr_pills}</div>
        </div>
        """)

        # Benefits
        benefits_html = "".join([f"""
        <li style="font-family:Jost;font-size:0.85rem;font-weight:300;color:{muted};
            margin-bottom:8px;line-height:1.6;display:flex;align-items:flex-start;gap:8px;">
            <span style="color:#3D6B4F;font-weight:600;margin-top:1px;">✓</span>{b}
        </li>""" for b in product['benefits']])
        st.html(f"""
        <div style="margin-top:20px;padding:20px 22px;background:{surface};border:1px solid {border};border-radius:14px;">
            <p style="font-family:'Jost';font-size:0.65rem;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#C9A96E;margin-bottom:10px;">Benefits</p>
            <ul style="list-style:none;padding:0;margin:0;">{benefits_html}</ul>
        </div>
        """)

    # ── How It's Made ──────────────────────────────────────────
    st.html(f"""
    <div style="background:{surface2};border:1px solid {border};border-radius:16px;padding:32px;margin-top:28px;">
        <p style="font-family:'Jost';font-size:0.65rem;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#C9A96E;margin-bottom:12px;">🏺 How It's Made</p>
        <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.15rem;font-weight:300;color:{text};line-height:1.9;">{product['how_made']}</p>
    </div>
    """)

    # ── Video Section ──────────────────────────────────────────
    if product.get("video_url"):
        st.html(f"""
        <div style="margin-top:28px;">
            <p style="font-family:'Jost';font-size:0.65rem;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#C9A96E;margin-bottom:16px;">🎬 Watch It Being Made</p>
        </div>
        """)

        components.html(f"""
        <div style="border-radius:16px;overflow:hidden;border:1px solid {'#3A352D' if dark else '#E8DDD0'};">
            <iframe width="100%" height="320"
                src="{product['video_url']}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen style="display:block;">
            </iframe>
        </div>
        """, height=340)
