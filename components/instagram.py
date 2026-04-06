import streamlit as st
import base64
import os

def get_image_b64(image_name):
    if not image_name:
        return None
    img_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', image_name)
    if not os.path.exists(img_path):
        return None
    with open(img_path, 'rb') as f:
        data = base64.b64encode(f.read()).decode()
    ext = image_name.rsplit('.', 1)[-1].lower()
    mime = 'image/png' if ext == 'png' else 'image/jpeg'
    return f'data:{mime};base64,{data}'

def render_instagram():
    dark = st.session_state.dark_mode
    bg = "#1A1814" if dark else "#F5F0E8"
    text = "#F5EDD8" if dark else "#1C1A16"
    muted = "#A89880" if dark else "#6B5E4E"


    posts = [
        {"image": "ig_post_1.jpg", "caption": "Kaithi Ayurveda: Pure, handmade, and rooted in ancient wisdom. 🌿"},
        {"image": "ig_post_2.jpg", "caption": "Real results. Fading pigmentation naturally with our botanical formulas. ✨"},
        {"image": "ig_post_3.jpg", "caption": "Freshly cured handmade soaps, enriched with pure herbal extracts. 🧼"},
        {"image": "ig_post_4.jpg", "caption": "Sharing our wellness secrets and handmade creations at the local pop-up! 🧡"},
        {"image": "ig_post_5.jpg", "caption": "Talking all things hair care, natural roots, and pure Ayurveda."},
        {"image": "ig_post_6.jpg", "caption": "Visible healing. Nourishing the skin deeply and naturally with Ayurveda. ✨"},
    ]

    for p in posts:
        p['b64'] = get_image_b64(p['image']) or ''

    posts_html = "".join([f"""
        <div class="insta-post" onmouseover="this.querySelector('.overlay').style.opacity='1'" onmouseout="this.querySelector('.overlay').style.opacity='0'">
            <img src="{p['b64']}" class="post-img" style="object-fit:contain; background: rgba(0,0,0,0.02);" />
            <div class="overlay">
                <div class="overlay-content">
                    <p style="font-family:'Jost';font-size:0.8rem;font-weight:400;color:white;text-align:center;line-height:1.6;">{p['caption']}</p>
                </div>
            </div>
        </div>
    """ for p in posts])

    st.components.v1.html(f"""
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@300;400;500&display=swap');
        * {{ margin:0; padding:0; box-sizing:border-box; }}
        body {{ background: {bg}; }}
        .insta {{ padding: 80px 5vw; }}
        .section-header {{ text-align:center; margin-bottom: 48px; }}
        .eyebrow {{ font-family:'Jost';font-size:0.7rem;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:#C9A96E;margin-bottom:12px; }}
        h2 {{ font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;color:{text}; }}
        .divider {{ width:60px;height:2px;background:linear-gradient(90deg,#C9A96E,transparent);margin:16px auto; }}
        .insta-grid {{
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 10px;
            margin-bottom: 40px;
        }}
        .insta-post {{
            position: relative;
            aspect-ratio: 1;
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            background: rgba(0,0,0,0.03);
            border: 1px solid rgba(0,0,0,0.05);
        }}
        .post-img {{
            width: 100%;
            height: 100%;
            transition: transform 0.4s ease;
        }}
        .insta-post:hover .post-img {{ transform: scale(1.05); }}
        .overlay {{
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.55);
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            border-radius: 12px;
        }}
        .overlay-content {{ text-align: center; padding: 12px; }}
        .follow-btn {{
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0 auto;
            padding: 14px 32px;
            background: linear-gradient(135deg, #833AB4, #C13584, #E1306C, #FD1D1D);
            color: white;
            border: none;
            border-radius: 50px;
            font-family: 'Jost', sans-serif;
            font-size: 0.82rem;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(200,50,100,0.3);
        }}
        .follow-btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(200,50,100,0.5);
        }}
        .handle {{
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.4rem;
            font-style: italic;
            color: #C9A96E;
            margin-bottom: 20px;
        }}
        @media (max-width: 768px) {{ .insta-grid {{ grid-template-columns: repeat(3,1fr); }} }}
    </style>
    </head>
    <body>
    <section class="insta">
        <div class="section-header">
            <p class="eyebrow">✦ Follow Our Journey ✦</p>
            <h2>On Instagram</h2>
            <div class="divider"></div>
            <p class="handle">@kaithi_ayurveda</p>
        </div>
        <div class="insta-grid">
            {posts_html}
        </div>
        <div style="text-align:center;">
            <button class="follow-btn" onclick="window.open('https://www.instagram.com/kaithi_ayurveda?utm_source=qr&igsh=N3AwY2dramgwOTl1','_blank')">
                📸 &nbsp;Follow on Instagram
            </button>
        </div>
    </section>
    </body>
    </html>
    """, height=580, scrolling=False)


