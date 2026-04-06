import streamlit as st


def render_hero():
    dark = st.session_state.dark_mode
    bg1 = "#0D0C0A" if dark else "#FAF7F2"
    bg2 = "#1A1814" if dark else "#F0E8DA"
    text_col = "#F5EDD8" if dark else "#1C1A16"
    
    st.components.v1.html(f"""
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        * {{ margin:0; padding:0; box-sizing:border-box; }}
        body {{ background: {bg1}; overflow: hidden; }}
        
        .hero {{
            width: 100%;
            height: 92vh;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }}
        
        /* Animated gradient background */
        .hero-bg {{
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at 20% 50%, {'rgba(61,107,79,0.25)' if dark else 'rgba(61,107,79,0.12)'} 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 20%, {'rgba(201,169,110,0.2)' if dark else 'rgba(201,169,110,0.15)'} 0%, transparent 50%),
                        radial-gradient(ellipse at 60% 80%, {'rgba(139,107,71,0.15)' if dark else 'rgba(139,107,71,0.1)'} 0%, transparent 40%),
                        linear-gradient(135deg, {bg1} 0%, {bg2} 100%);
            animation: bgShift 8s ease-in-out infinite alternate;
        }}
        @keyframes bgShift {{
            0% {{ filter: hue-rotate(0deg); }}
            100% {{ filter: hue-rotate(5deg) brightness(1.03); }}
        }}
        
        /* Floating botanical elements */
        .leaf {{
            position: absolute;
            font-size: 3rem;
            opacity: 0.06;
            animation: float linear infinite;
            user-select: none;
        }}
        @keyframes float {{
            0% {{ transform: translateY(110vh) rotate(0deg); opacity: 0; }}
            10% {{ opacity: 0.06; }}
            90% {{ opacity: 0.06; }}
            100% {{ transform: translateY(-10vh) rotate(360deg); opacity: 0; }}
        }}
        
        /* Decorative circle */
        .hero-circle {{
            position: absolute;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            border: 1px solid {'rgba(201,169,110,0.12)' if dark else 'rgba(201,169,110,0.2)'};
            animation: spinSlow 30s linear infinite;
        }}
        .hero-circle::before {{
            content: '';
            position: absolute;
            inset: 30px;
            border-radius: 50%;
            border: 1px dashed {'rgba(201,169,110,0.08)' if dark else 'rgba(201,169,110,0.15)'};
        }}
        @keyframes spinSlow {{
            from {{ transform: rotate(0deg); }}
            to {{ transform: rotate(360deg); }}
        }}
        
        .hero-content {{
            position: relative;
            z-index: 10;
            text-align: center;
            max-width: 820px;
            padding: 0 24px;
        }}
        
        .hero-eyebrow {{
            font-family: 'Jost', sans-serif;
            font-size: 0.7rem;
            font-weight: 500;
            letter-spacing: 0.35em;
            text-transform: uppercase;
            color: #C9A96E;
            margin-bottom: 24px;
            animation: fadeUp 0.8s 0.2s both;
        }}
        @keyframes fadeUp {{
            from {{ opacity: 0; transform: translateY(20px); }}
            to {{ opacity: 1; transform: translateY(0); }}
        }}
        
        .hero-title {{
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(3.5rem, 8vw, 7rem);
            font-weight: 300;
            color: {text_col};
            line-height: 1.05;
            margin-bottom: 12px;
            animation: fadeUp 0.8s 0.4s both;
        }}
        .hero-title em {{
            font-style: italic;
            color: #C9A96E;
        }}
        .hero-title .line2 {{
            font-style: italic;
            font-weight: 300;
            font-size: clamp(2.8rem, 6.5vw, 5.5rem);
        }}
        
        .hero-sub {{
            font-family: 'Jost', sans-serif;
            font-size: 0.95rem;
            font-weight: 300;
            letter-spacing: 0.06em;
            color: {'#A89880' if dark else '#6B5E4E'};
            margin: 24px 0 40px;
            animation: fadeUp 0.8s 0.6s both;
        }}
        
        .hero-actions {{
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
            animation: fadeUp 0.8s 0.8s both;
        }}
        
        .btn-primary {{
            padding: 15px 36px;
            background: #C9A96E;
            color: #1C1A16;
            border: none;
            border-radius: 50px;
            font-family: 'Jost', sans-serif;
            font-size: 0.8rem;
            font-weight: 500;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(201,169,110,0.3);
        }}
        .btn-primary:hover {{
            background: #B8934A;
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(201,169,110,0.45);
        }}
        
        .btn-secondary {{
            padding: 15px 36px;
            background: transparent;
            color: {text_col};
            border: 1px solid {'rgba(201,169,110,0.3)' if dark else 'rgba(28,26,22,0.25)'};
            border-radius: 50px;
            font-family: 'Jost', sans-serif;
            font-size: 0.8rem;
            font-weight: 400;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
        }}
        .btn-secondary:hover {{
            border-color: #C9A96E;
            color: #C9A96E;
        }}
        
        .hero-scroll {{
            position: absolute;
            bottom: 32px;
            left: 50%;
            transform: translateX(-50%);
            animation: bounce 2s ease-in-out infinite, fadeUp 1s 1.2s both;
        }}
        @keyframes bounce {{
            0%, 100% {{ transform: translateX(-50%) translateY(0); }}
            50% {{ transform: translateX(-50%) translateY(-8px); }}
        }}
        .scroll-line {{
            width: 1px;
            height: 50px;
            background: linear-gradient(to bottom, #C9A96E, transparent);
            margin: 0 auto 8px;
        }}
        .scroll-text {{
            font-family: 'Jost', sans-serif;
            font-size: 0.6rem;
            letter-spacing: 0.2em;
            color: #C9A96E;
            text-transform: uppercase;
        }}
        
        /* Premium glassmorphic ingredient tags with complex variable drift */
        .ingredient-float {{
            position: absolute;
            padding: 8px 18px;
            background: linear-gradient(135deg, {'rgba(255,255,255,0.06)' if dark else 'rgba(255,255,255,0.95)'} 0%, {'rgba(255,255,255,0.01)' if dark else 'rgba(255,255,255,0.6)'} 100%);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid {'rgba(201,169,110,0.3)' if dark else 'rgba(201,169,110,0.45)'};
            border-radius: 40px;
            font-family: 'Jost', sans-serif;
            font-size: 0.85rem;
            font-weight: 500;
            color: {'#E5D3B3' if dark else '#5A4C3A'};
            letter-spacing: 0.1em;
            box-shadow: 0 8px 32px {'rgba(0,0,0,0.2)' if dark else 'rgba(201,169,110,0.15)'};
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
            animation: drift var(--duration) cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;
            cursor: pointer;
        }}
        
        .ingredient-float:hover {{
            border-color: #C9A96E;
            box-shadow: 0 12px 40px {'rgba(201,169,110,0.25)' if dark else 'rgba(201,169,110,0.35)'};
            background: {'rgba(201,169,110,0.1)' if dark else 'rgba(255,255,255,1)'};
            z-index: 20;
            animation-play-state: paused;
        }}

        @keyframes drift {{
            0% {{ transform: translate(0, 0) rotate(0deg) scale(1); }}
            33% {{ transform: translate(var(--x1), var(--y1)) rotate(var(--r1)) scale(1.02); }}
            66% {{ transform: translate(var(--x2), var(--y2)) rotate(var(--r2)) scale(0.98); }}
            100% {{ transform: translate(var(--x3), var(--y3)) rotate(var(--r3)) scale(1.04); }}
        }}
    </style>
    </head>
    <body>
    <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-circle"></div>
        
        <!-- Floating leaves -->
        <div class="leaf" style="left:10%;animation-duration:12s;animation-delay:0s;">🌿</div>
        <div class="leaf" style="left:25%;animation-duration:15s;animation-delay:3s;font-size:2rem;">🌺</div>
        <div class="leaf" style="left:60%;animation-duration:10s;animation-delay:1s;">🌱</div>
        <div class="leaf" style="left:80%;animation-duration:13s;animation-delay:5s;font-size:2.5rem;">🍃</div>
        <div class="leaf" style="left:45%;animation-duration:11s;animation-delay:2s;font-size:1.5rem;">✨</div>
        
        <!-- Floating ingredient tags -->
        <div class="ingredient-float" style="top:22%; left:12%; --duration: 18s; --x1: 20px; --y1: -30px; --r1: 5deg; --x2: -15px; --y2: -10px; --r2: -3deg; --x3: 10px; --y3: -40px; --r3: 2deg;">
            <span style="font-size: 1.1rem;">🌱</span> Ashwagandha
        </div>
        <div class="ingredient-float" style="top:32%; right:14%; --duration: 22s; --x1: -25px; --y1: 30px; --r1: -4deg; --x2: 20px; --y2: 15px; --r2: 5deg; --x3: -15px; --y3: 40px; --r3: -2deg;">
            <span style="font-size: 1.1rem;">✨</span> Saffron
        </div>
        <div class="ingredient-float" style="bottom:28%; left:10%; --duration: 20s; --x1: 30px; --y1: 20px; --r1: 3deg; --x2: -20px; --y2: -25px; --r2: -4deg; --x3: 25px; --y3: 10px; --r3: 5deg;">
            <span style="font-size: 1.1rem;">🌿</span> Bhringraj
        </div>
        <div class="ingredient-float" style="bottom:24%; right:10%; --duration: 19s; --x1: -20px; --y1: -30px; --r1: -5deg; --x2: 25px; --y2: -10px; --r2: 4deg; --x3: -10px; --y3: -45px; --r3: -3deg;">
            <span style="font-size: 1.1rem;">🌸</span> Sandalwood
        </div>
        <div class="ingredient-float" style="top:18%; right:30%; --duration: 24s; --x1: 15px; --y1: 25px; --r1: 2deg; --x2: -25px; --y2: -15px; --r2: -5deg; --x3: 20px; --y3: -20px; --r3: 3deg;">
            <span style="font-size: 1.1rem;">🍃</span> Tulsi
        </div>
        <div class="ingredient-float" style="bottom:18%; left:30%; --duration: 21s; --x1: -15px; --y1: -25px; --r1: -2deg; --x2: 25px; --y2: 15px; --r2: 5deg; --x3: -20px; --y3: 20px; --r3: -3deg;">
            <span style="font-size: 1.1rem;">🌿</span> Rosemary
        </div>
        
        <div class="hero-content">
            <p class="hero-eyebrow">✦ Est. 2025 &nbsp;·&nbsp; Handcrafted in India ✦</p>
            <h1 class="hero-title">
                Pure.<em> Handmade.</em><br>
                <span class="line2">Ancient Wisdom.</span>
            </h1>
            <p class="hero-sub">
                Botanicals sourced from sacred forests &amp; Himalayan foothills,<br>
                crafted by artisans who honor the Vedic tradition.
            </p>
            <div class="hero-actions">
                <button class="btn-primary" onclick="scrollParentTo('products-anchor')">
                    Explore Products
                </button>
                <button class="btn-secondary" onclick="scrollParentTo('about-anchor')">
                    Our Story
                </button>
            </div>
        </div>
        
        <div class="hero-scroll">
            <div class="scroll-line"></div>
            <div class="scroll-text">Scroll</div>
        </div>
    </section>
    
    <script>
        function scrollParentTo(elementId) {{
            try {{
                const target = window.parent.document.getElementById(elementId);
                if (target) {{
                    target.scrollIntoView({{behavior: 'smooth', block: 'start'}});
                }}
            }} catch(e) {{
                console.error("Scroll communication failed", e);
            }}
        }}
    </script>
    </body>
    </html>
    """, height=700, scrolling=False)


