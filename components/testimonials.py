import streamlit as st


def render_testimonials():
    dark = st.session_state.dark_mode
    bg = "#0D0C0A" if dark else "#FAF7F2"
    surface = "#1A1814" if dark else "#FFFFFF"
    text = "#F5EDD8" if dark else "#1C1A16"
    muted = "#A89880" if dark else "#6B5E4E"
    border = "#3A352D" if dark else "#E8DDD0"

    testimonials = [
        {"name": "prema pandey", "location": "rajkot", "text": "Hey mam! Mene apke face gel shampoo and hair pack use kiya he bahot hi badhīya he and repeat order bhi kiya he and mene apne frnds ko Bhi suggest kiya he.", "rating": 5, "product": "Face Gel & herbal Shampoo", "avatar": "👩"},
        {"name": "hetal makwana", "location": "veraval", "text": "Hello Dr! Me tamara 2 product purchase karya hata: D-tan soap & Shampoo. Banne bauj superb result ape che, soap to marī akhi family badha j use karta thai gya che and shampoo to marī mom ne bau j gamyu che so thankuu so much medam.", "rating": 5, "product": "Detan soap & shampoo", "avatar": "👩"},
        {"name": "Diya", "location": "Ahemdabad", "text": "Hey Nidhi ma'am! I m from Ahemdabad, Dīya this side! Hope you are doing well. I had ordered a combo from you that included a lip balm, body lotion, anti-acne soap, shampoo, and hair pack... After using them, I noticed amazing results! Within just 2-3 hair washes, my hair fall reduced by almost 70% - I was really surprised by how well it worked. Your body lotion is also much more long-lasting compared to others I've used. It keeps my skin soft and moisturized all day, without feeling greasy. The lip balm makes my lips soft and hydrated for hours... And lastly, your anti-acne soap is just excellent! It helped clear my acne and suntan, leaving my skin fresh and glowing. Honestly, I'm very happy with all your products - they're truly effective and worth recommending! Definitely, from now on, I'll always use your products! Thank you.", "rating": 5, "product": "Anti Acne soap", "avatar": "👩"},
        {"name": "Divyesh bajaj", "location": "Junagadh", "text": "Hello, Nīdhi medam! Me tamaru shampoo & Hair pack use kryu che. 2 j var use kryu but mara hairfall dandruff bdhama bov saru result mlyu che... Mara hair silky pn thai gaya 6 pela krta. Hve thi hu tmari j product vaprish.", "rating": 5, "product": "Hair Pack", "avatar": "👦"},
    ]

    stars_html = "★" * 5

    tcard = "".join([f"""
        <div class="t-card">
            <div class="quote-mark">"</div>
            <div class="stars">{stars_html}</div>
            <p class="t-text">{t['text']}</p>
            <div class="t-footer">
                <div class="avatar">{t['avatar']}</div>
                <div>
                    <div class="t-name">{t['name']}</div>
                    <div class="t-loc">📍 {t['location']} · <span style="color:#C9A96E;">{t['product']}</span></div>
                </div>
            </div>
        </div>
    """ for t in testimonials])

    st.components.v1.html(f"""
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        * {{ margin:0; padding:0; box-sizing:border-box; }}
        body {{ background: {bg}; overflow: hidden; }}
        .testimonials {{ padding: 30px 5vw 0; }}
        .section-header {{ text-align:center; margin-bottom: 32px; }}
        .eyebrow {{ font-family:'Jost';font-size:0.7rem;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:#C9A96E;margin-bottom:8px; }}
        h2 {{ font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;color:{text}; }}
        .divider {{ width:60px;height:2px;background:linear-gradient(90deg,#C9A96E,transparent);margin:12px auto; }}
        .t-grid {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            align-items: flex-start;
        }}
        .t-card {{
            background: {surface};
            border: 1px solid {border};
            border-radius: 16px;
            padding: 28px;
            position: relative;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
        }}
        .t-card:hover {{
            transform: translateY(-4px);
            box-shadow: 0 16px 48px rgba(0,0,0,0.1);
            border-color: rgba(201,169,110,0.4);
        }}
        .t-card::before {{
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 2px;
            background: linear-gradient(90deg, #C9A96E, transparent);
        }}
        .quote-mark {{
            font-family: 'Cormorant Garamond', serif;
            font-size: 5rem;
            color: #C9A96E;
            opacity: 0.2;
            position: absolute;
            top: 8px;
            left: 18px;
            line-height: 1;
            pointer-events: none;
        }}
        .stars {{ color: #C9A96E; font-size: 0.9rem; margin-bottom: 14px; }}
        .t-text {{
            font-family: 'Cormorant Garamond', serif;
            font-style: italic;
            font-size: 0.95rem;
            font-weight: 300;
            color: {text};
            line-height: 1.65;
            margin-bottom: 20px;
        }}
        .t-footer {{ display:flex; align-items:center; gap:14px; border-top: 1px solid {border}; padding-top: 16px; }}
        .avatar {{ font-size:2rem; }}
        .t-name {{ font-family:'Jost';font-size:0.85rem;font-weight:500;color:{text}; }}
        .t-loc {{ font-family:'Jost';font-size:0.72rem;font-weight:300;color:{muted};margin-top:3px; }}
        @media (max-width:768px) {{ .t-grid {{ grid-template-columns: 1fr; }} }}
    </style>
    </head>
    <body>
    <section class="testimonials">
        <div class="section-header">
            <p class="eyebrow">✦ Customer Love ✦</p>
            <h2>What Our Community Says</h2>
            <div class="divider"></div>
        </div>
        <div class="t-grid">
            {tcard}
        </div>
    </section>
    </body>
    </html>
    """, height=1000, scrolling=False)


