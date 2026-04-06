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

def render_about():
    dark = st.session_state.dark_mode
    bg = "#1A1814" if dark else "#F5F0E8"
    text = "#F5EDD8" if dark else "#1C1A16"
    muted = "#A89880" if dark else "#6B5E4E"
    surface = "#252219" if dark else "#FFFFFF"
    border = "#3A352D" if dark else "#E8DDD0"
    
    founder_b64 = get_image_b64("founder.jpg") or ""
    logo_b64 = get_image_b64("logo.jpg") or ""

    st.components.v1.html(f"""
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        * {{ margin:0; padding:0; box-sizing:border-box; }}
        body {{ background: {bg}; font-family: 'Jost', sans-serif; }}
        .about {{ padding: 60px 4vw; max-width: 1200px; margin: 0 auto; }}
        
        .section-block {{ margin-bottom: 120px; }}
        
        .about-grid, .founder-grid {{
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 60px;
            align-items: center;
        }}
        
        .image-container {{
            position: relative;
            height: 580px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }}
        
        .about-main-img {{
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 20px;
            border: 2px solid {'rgba(201,169,110,0.5)' if dark else 'rgba(201,169,110,0.6)'};
            transition: transform 0.4s ease;
        }}
        .about-main-img:hover {{
            transform: scale(1.02);
        }}
        
        .founder-img {{
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 20px;
            border: 2px solid {'rgba(201,169,110,0.5)' if dark else 'rgba(201,169,110,0.6)'};
            transition: transform 0.4s ease;
        }}
        .founder-img:hover {{
            transform: scale(1.02);
        }}
        
        .eyebrow {{
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: #C9A96E;
            margin-bottom: 16px;
        }}
        
        h2 {{
            font-family: 'Cormorant Garamond', serif;
            font-size: 3.2rem;
            font-weight: 300;
            color: {text};
            line-height: 1.15;
            margin-bottom: 16px;
        }}
        
        .divider {{
            width: 80px;
            height: 2px;
            background: linear-gradient(90deg, #C9A96E, transparent);
            margin: 20px 0 28px;
        }}
        
        p {{
            font-weight: 400;
            font-size: 1.05rem;
            color: {muted};
            line-height: 1.8;
            margin-bottom: 20px;
        }}
        
        .highlight-text {{
            font-weight: 500; 
            color:{text}; 
            margin-top:24px;
            font-size: 1.1rem;
        }}
        
        .value-list {{
            display: flex;
            flex-direction: column;
            gap: 14px;
            margin-top: 32px;
        }}
        
        .value-item {{
            display: flex;
            align-items: center;
            gap: 16px;
            background: {surface};
            padding: 16px 20px;
            border-radius: 12px;
            border: 1px solid {border};
            box-shadow: 0 4px 10px rgba(0,0,0,0.02);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }}
        .value-item:hover {{
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.05);
        }}
        
        .value-icon {{
            color: #C9A96E;
            font-size: 1.1rem;
            font-weight: bold;
        }}
        
        .value-title {{
            font-size: 0.95rem;
            font-weight: 500;
            color: {text};
        }}
        
        .signature-box {{
            margin-top: 40px;
            padding: 24px;
            background: {'rgba(201,169,110,0.04)' if dark else 'rgba(201,169,110,0.08)'};
            border-left: 4px solid #C9A96E;
            border-radius: 0 12px 12px 0;
        }}
        
        .signature-text {{
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.6rem;
            font-weight: 600;
            font-style: italic;
            color: #C9A96E;
            margin: 0;
            line-height: 1.4;
        }}
        
        @media (max-width: 900px) {{
            .about-grid, .founder-grid {{ grid-template-columns: 1fr; }}
            .image-container {{ height: 400px; margin-bottom: 20px; }}
            .section-block {{ margin-bottom: 80px; }}
        }}
    </style>
    </head>
    <body>
    <section class="about" id="about-section">
        
        <!-- Our Story Section -->
        <div class="section-block">
            <div class="about-grid">
                <div class="image-container">
                    <img src="{logo_b64}" class="about-main-img" alt="Kaithi Ayurveda Logo" />
                </div>
                <div class="text-content">
                    <p class="eyebrow">🌿 OUR STORY (Kaithi Ayurveda)</p>
                    <h2>Born from the roots of ancient India</h2>
                    <div class="divider"></div>
                    
                    <p>Kaithi Ayurveda was not created in a lab — it was born in a home, from tradition, care, and centuries-old wisdom.</p>
                    <p>What began as handwritten Ayurvedic recipes passed down through generations slowly transformed into a purpose — to bring authentic, natural healing back into modern lives.</p>
                    <p>Every formulation is inspired by classical Ayurvedic texts and refined with practical experience. We believe that true beauty and wellness come from balance — not chemicals, not shortcuts.</p>
                    <p>At Kaithi Ayurveda, each product is handcrafted in small batches, rooted in natural herbs and traditional methods, and designed to restore harmony between body, skin, and mind.</p>
                    
                    <p class="highlight-text">This is not just skincare or haircare.<br>This is a journey back to your natural self.</p>
                    
                    <div class="value-list">
                        <div class="value-item">
                            <div class="value-icon">✔</div>
                            <div class="value-title">Wildcrafted &amp; Natural Ingredients</div>
                        </div>
                        <div class="value-item">
                            <div class="value-icon">✔</div>
                            <div class="value-title">Small-Batch Handmade Formulations</div>
                        </div>
                        <div class="value-item">
                            <div class="value-icon">✔</div>
                            <div class="value-title">Rooted in Ayurvedic Texts &amp; Practice</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Founder Story Section -->
        <div class="section-block">
            <div class="founder-grid">
                <div class="image-container">
                    <img src="{founder_b64}" class="founder-img" alt="Dr. Nidhi Khakhkhar" />
                </div>
                <div class="text-content">
                    <p class="eyebrow">👩‍⚕️ FOUNDER STORY (Dr. Nidhi Khakhkhar)</p>
                    <h2>Crafted with knowledge. Delivered with care.</h2>
                    <div class="divider"></div>
                    
                    <p>Kaithi Ayurveda is led by Dr. Nidhi Khakhkhar (BAMS) — a passionate Ayurvedic doctor, practitioner, and believer in the power of natural healing.</p>
                    <p>With deep knowledge of Ayurveda and real-world clinical experience, she blends ancient science with modern understanding to create solutions that truly work.</p>
                    <p>Her journey is not just professional — it is personal.</p>
                    
                    <p>From treating skin concerns to helping people regain confidence, her goal has always been simple:<br>
                    <span style="font-weight: 600; color:{text};">👉 To make Ayurveda practical, effective, and accessible for everyone.</span></p>
                    
                    <div class="value-list">
                        <div class="value-item">
                            <div class="value-icon">✦</div>
                            <div class="value-title">Authentic Ayurvedic formulations</div>
                        </div>
                        <div class="value-item">
                            <div class="value-icon">✦</div>
                            <div class="value-title">Honest, result-driven care</div>
                        </div>
                        <div class="value-item">
                            <div class="value-icon">✦</div>
                            <div class="value-title">A personal touch in every product</div>
                        </div>
                    </div>
                    
                    <div class="signature-box">
                        <p class="signature-text">“By Dr. Nidhi — with love, care, and the power of Ayurveda.”</p>
                    </div>
                </div>
            </div>
        </div>

    </section>
    </body>
    </html>
    """, height=1600, scrolling=True)


