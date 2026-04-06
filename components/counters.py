import streamlit as st

def render_counters():
    dark = st.session_state.dark_mode
    bg = "#1A1814" if dark else "#F5F0E8"
    surface = "#252219" if dark else "#FFFFFF"
    text = "#F5EDD8" if dark else "#1C1A16"
    muted = "#A89880" if dark else "#6B5E4E"

    st.components.v1.html(f"""
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500;600&display=swap');
        
        * {{ margin:0; padding:0; box-sizing:border-box; }}
        body {{ background: {bg}; overflow: hidden; }}
        
        .counters-wrapper {{
            padding: 80px 4vw;
            display: flex;
            justify-content: center;
        }}
        
        .counters {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
            max-width: 1200px;
            width: 100%;
        }}
        
        .counter-card {{
            background: linear-gradient(145deg, {'rgba(201,169,110,0.06)' if dark else 'rgba(255,255,255,0.7)'}, {'rgba(201,169,110,0.02)' if dark else 'rgba(250,247,242,0.9)'});
            border: 1px solid {'rgba(201,169,110,0.25)' if dark else 'rgba(201,169,110,0.4)'};
            border-radius: 28px;
            padding: 50px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 10px 40px {'rgba(0,0,0,0.2)' if dark else 'rgba(201,169,110,0.1)'};
            cursor: pointer;
        }}
        
        .counter-card::before {{
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 50%; height: 100%;
            background: linear-gradient(to right, transparent, {'rgba(201,169,110,0.15)' if dark else 'rgba(201,169,110,0.3)'}, transparent);
            transform: skewX(-25deg);
            transition: all 0.8s ease;
        }}
        
        .counter-card:hover {{
            transform: translateY(-15px) scale(1.02);
            border-color: #C9A96E;
            box-shadow: 0 24px 60px {'rgba(201,169,110,0.25)' if dark else 'rgba(201,169,110,0.3)'};
        }}
        
        .counter-card:hover::before {{
            left: 200%;
        }}
        
        .counter-icon {{
            font-size: 3rem;
            margin-bottom: 24px;
            display: inline-block;
            transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            filter: drop-shadow(0 8px 16px rgba(201,169,110,0.3));
        }}
        
        .counter-card:hover .counter-icon {{
            transform: scale(1.25) rotate(8deg);
        }}
        
        .counter-num {{
            font-family: 'Cormorant Garamond', serif;
            font-size: 4.5rem;
            font-weight: 300;
            line-height: 1;
            margin-bottom: 16px;
            background: linear-gradient(45deg, #C9A96E 30%, {'#E5D3B3' if dark else '#8E7341'} 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0px 4px 20px rgba(201,169,110,0.2);
            display: flex;
            align-items: baseline;
            justify-content: center;
        }}
        
        .counter-suffix {{
            font-size: 2.8rem;
            margin-left: 4px;
            background: linear-gradient(45deg, #C9A96E 30%, {'#E5D3B3' if dark else '#8E7341'} 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        
        .counter-label {{
            font-family: 'Jost', sans-serif;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: {text};
            margin-top: 8px;
        }}
        
        .counter-sub {{
            font-family: 'Jost', sans-serif;
            font-size: 0.8rem;
            font-weight: 400;
            color: {muted};
            margin-top: 12px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.4s ease 0.1s;
        }}
        
        .counter-card:hover .counter-sub {{
            opacity: 1;
            transform: translateY(0);
        }}

        @media (max-width: 900px) {{
            .counters {{ grid-template-columns: 1fr; gap: 30px; }}
            .counter-card {{ padding: 40px 20px; }}
        }}
    </style>
    </head>
    <body>
    <div class="counters-wrapper">
        <div class="counters">
            <div class="counter-card" title="Handcrafted Products">
                <span class="counter-icon">🧪</span>
                <div class="counter-num"><span class="count" data-target="15">0</span><span class="counter-suffix">+</span></div>
                <div class="counter-label">Handcrafted Products</div>
                <div class="counter-sub">Small-batch & artisanal</div>
            </div>
            <div class="counter-card" title="Natural Ingredients">
                <span class="counter-icon">🌱</span>
                <div class="counter-num"><span class="count" data-target="100">0</span><span class="counter-suffix">%</span></div>
                <div class="counter-label">Natural Ingredients</div>
                <div class="counter-sub">Sourced from the wild</div>
            </div>
            <div class="counter-card" title="1 Year of Tradition">
                <span class="counter-icon">⭐</span>
                <div class="counter-num"><span class="count" data-target="1">0</span></div>
                <div class="counter-label">1 Year of Tradition</div>
                <div class="counter-sub">Rooted in Vedic wisdom</div>
            </div>
        </div>
    </div>
    
    <script>
        const counters = document.querySelectorAll('.count');
        
        // Easing function for smoother counting
        const easeOutQuad = t => t * (2 - t);
        
        const observer = new IntersectionObserver((entries) => {{
            entries.forEach(entry => {{
                if (entry.isIntersecting) {{
                    const el = entry.target;
                    const target = parseInt(el.dataset.target);
                    const duration = 2500; // 2.5 seconds
                    let start = null;
                    
                    const step = (timestamp) => {{
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const percentage = Math.min(progress / duration, 1);
                        
                        // Apply easing
                        const current = target * easeOutQuad(percentage);
                        
                        el.textContent = Math.floor(current).toLocaleString();
                        
                        if (progress < duration) {{
                            window.requestAnimationFrame(step);
                        }} else {{
                            el.textContent = target.toLocaleString();
                        }}
                    }};
                    
                    window.requestAnimationFrame(step);
                    observer.unobserve(el);
                }}
            }});
        }}, {{ threshold: 0.3 }});
        
        counters.forEach(c => observer.observe(c));
    </script>
    </body>
    </html>
    """, height=420, scrolling=False)


