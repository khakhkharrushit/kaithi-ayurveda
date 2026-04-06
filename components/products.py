import streamlit as st

def render_star_rating(rating):
    full  = int(rating)
    half  = 1 if rating - full >= 0.5 else 0
    empty = 5 - full - half
    stars = "★" * full + ("⯨" if half else "") + "☆" * empty
    return stars

def render_products(products):
    dark     = st.session_state.dark_mode
    bg       = "#0D0C0A" if dark else "#FAF7F2"
    surface  = "#1A1814" if dark else "#FFFFFF"
    surface2 = "#252219" if dark else "#F5F0E8"
    text     = "#F5EDD8" if dark else "#1C1A16"
    muted    = "#A89880" if dark else "#6B5E4E"
    border   = "#3A352D" if dark else "#E8DDD0"

    # ── Section Header ─────────────────────────────────────────
    st.html(f"""
    <div id="products-section" style="padding:80px 5vw 40px;background:{bg};">
        <div style="text-align:center;margin-bottom:16px;">
            <p style="font-family:'Jost',sans-serif;font-size:0.7rem;font-weight:500;
                letter-spacing:0.3em;text-transform:uppercase;color:#C9A96E;">
                ✦ Our Collection ✦
            </p>
            <h2 style="font-family:'Cormorant Garamond',serif;font-size:3rem;
                font-weight:300;color:{text};margin-top:8px;">Sacred Formulations</h2>
            <div style="width:60px;height:2px;background:linear-gradient(90deg,#C9A96E,transparent);
                margin:16px auto 20px;"></div>
            <p style="font-family:'Jost',sans-serif;font-weight:300;color:{muted};
                max-width:500px;margin:0 auto;line-height:1.8;">
                Each product is a labor of love — formulated from ancestral knowledge
                and crafted by hand in small batches.
            </p>
        </div>
    </div>
    """)

    # ── Search + Filter ────────────────────────────────────────
    col_search, col_filter = st.columns([3, 1])
    with col_search:
        search = st.text_input("Search", placeholder="🔍  Search products...",
                               key="search_input", label_visibility="collapsed")
        st.session_state.search_query = search.lower()
    with col_filter:
        categories = ["All"] + sorted(set(p["category"] for p in products))
        category   = st.selectbox("Category", categories,
                                  key="category_filter", label_visibility="collapsed")
        st.session_state.filter_category = category

    # ── Filter ──────────────────────────────────────────────────
    q   = st.session_state.search_query
    cat = st.session_state.filter_category
    filtered = [
        p for p in products
        if (not q or q in p["name"].lower() or q in p["short_desc"].lower()
            or q in " ".join(p["ingredients"]).lower())
        and (cat == "All" or p["category"] == cat)
    ]

    if not filtered:
        st.html(f"""
        <div style="text-align:center;padding:60px;color:{muted};font-family:'Jost';">
            No products found for your search.
        </div>""")
        return

    st.html(f"""
    <style>
        .product-card {{
            background: {surface};
            border: 1px solid {border};
            border-radius: 20px;
            padding: 32px 28px;
            margin-bottom: 8px;
            position: relative;
            height: 480px;
            display: flex;
            flex-direction: column;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 8px 30px rgba(0,0,0,0.04);
            cursor: pointer;
        }}
        .product-card:hover {{
            transform: translateY(-8px);
            box-shadow: 0 20px 50px rgba(0,0,0,0.1);
            border-color: #C9A96E;
        }}
        .product-inner {{
            flex: 1;
            display: flex;
            flex-direction: column;
        }}
        .product-desc {{
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
        }}
        .color-bar {{
            position: absolute; top: 0; left: 0; right: 0; height: 3px;
            border-radius: 20px 20px 0 0;
            transition: height 0.3s ease;
        }}
        .product-card:hover .color-bar {{
            height: 6px;
        }}
        .ingredient-pill {{
            display: inline-flex; align-items: center; justify-content: center;
            padding: 4px 12px; border-radius: 20px;
            background: {surface2}; border: 1px solid {border}; font-size: 0.72rem;
            color: {muted}; margin: 3px; font-family: 'Jost', sans-serif;
            transition: all 0.3s ease;
        }}
        .product-card:hover .ingredient-pill {{
            background: rgba(201,169,110,0.08);
            border-color: rgba(201,169,110,0.3);
            color: #C9A96E;
        }}
    </style>
    <div style='padding:0 5vw;background:{bg};'>
    """)

    cols = st.columns(3, gap="medium")
    for i, product in enumerate(filtered):
        with cols[i % 3]:

            # Badge
            badge_html = ""
            if product.get("badge"):
                is_best   = product["badge"] == "Bestseller"
                badge_bg  = "rgba(201,169,110,0.15)" if is_best else "rgba(61,107,79,0.15)"
                badge_col = "#C9A96E"                if is_best else "#3D6B4F"
                badge_bdr = "rgba(201,169,110,0.3)"  if is_best else "rgba(61,107,79,0.3)"
                badge_html = f"""
                <span style="display:inline-block;padding:3px 10px;border-radius:20px;
                    font-size:0.65rem;font-weight:600;letter-spacing:0.1em;
                    text-transform:uppercase;margin-bottom:10px;
                    background:{badge_bg};color:{badge_col};
                    border:1px solid {badge_bdr};">
                    {product['badge']}
                </span>"""

            stars      = render_star_rating(product["rating"])
            ingr_pills = "".join([
                f'<span class="ingredient-pill">{ing}</span>'
                for ing in product["ingredients"][:3]
            ])

            st.html(f"""
            <div class="product-card">
                <div class="color-bar" style="background:linear-gradient(90deg,{product['color']},transparent);"></div>

                <div class="product-inner">
                    <!-- Emoji + Badge row -->
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
                        <div style="font-size:3.5rem;line-height:1;filter:drop-shadow(0 8px 16px rgba(0,0,0,0.1));">{product['emoji']}</div>
                        {badge_html}
                    </div>

                    <!-- Category -->
                    <p style="font-family:'Jost';font-size:0.68rem;font-weight:600;
                        letter-spacing:0.25em;text-transform:uppercase;
                        color:#C9A96E;margin-bottom:8px;">{product['category']}</p>

                    <!-- Name -->
                    <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.7rem;
                        font-weight:400;color:{text};margin-bottom:8px;line-height:1.2;">
                        {product['name']}
                    </h3>

                    <!-- Short desc -->
                    <p class="product-desc" style="font-family:'Jost';font-size:0.85rem;font-weight:300;
                        color:{muted};margin-bottom:16px;line-height:1.7;">
                        {product['short_desc']}
                    </p>
                </div>

                <!-- Bottom Section (Stars, Ingredients, Price) -->
                <div>
                    <!-- Stars + rating -->
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
                        <span style="color:#C9A96E;font-size:0.9rem;">{stars}</span>
                        <span style="font-family:'Jost';font-size:0.75rem;color:{muted};font-weight:400;">
                            {product['rating']} ({product['reviews']} reviews)
                        </span>
                    </div>

                    <!-- Ingredient pills -->
                    <div style="margin-bottom:20px;display:flex;flex-wrap:wrap;gap:2px;">{ingr_pills}</div>

                    <!-- Price -->
                    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-top:auto;border-top:1px solid {border};padding-top:16px;">
                        <div style="display:flex;align-items:baseline;gap:8px;">
                            <span style="font-family:'Cormorant Garamond',serif;
                                font-size:2rem;font-weight:500;color:#C9A96E;">
                                {product['price']}
                            </span>
                            <span style="font-family:'Jost';font-size:0.75rem;
                                color:{muted};font-weight:400;">{product['weight']}</span>
                        </div>
                    </div>
                </div>
            </div>
            """)

            # Buttons (native Streamlit)
            if st.button("View Details", key=f"view_{product['id']}", use_container_width=True):
                st.session_state.selected_product = product
                st.rerun()

    st.html("</div>")
