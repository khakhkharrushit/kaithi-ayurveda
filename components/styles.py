import streamlit as st


def inject_global_styles(dark_mode=False):
    bg = "#0D0C0A" if dark_mode else "#FAF7F2"
    surface = "#1A1814" if dark_mode else "#FFFFFF"
    surface2 = "#252219" if dark_mode else "#F5F0E8"
    text_primary = "#F5EDD8" if dark_mode else "#1C1A16"
    text_secondary = "#A89880" if dark_mode else "#6B5E4E"
    border = "#3A352D" if dark_mode else "#E8DDD0"
    gold = "#C9A96E"
    green = "#3D6B4F"
    
    st.html(f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

    :root {{
        --bg: {bg};
        --surface: {surface};
        --surface2: {surface2};
        --text: {text_primary};
        --text-muted: {text_secondary};
        --border: {border};
        --gold: {gold};
        --green: {green};
        --shadow: rgba(0,0,0,0.12);
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}

    .stApp {{
        background: var(--bg) !important;
        font-family: 'Jost', sans-serif !important;
        color: var(--text) !important;
    }}

    /* Hide Streamlit chrome */
    #MainMenu, footer, header {{ visibility: hidden !important; }}
    .stDeployButton {{ display: none !important; }}
    [data-testid="stToolbar"] {{ display: none !important; }}
    [data-testid="stDecoration"] {{ display: none !important; }}
    .block-container {{
        padding: 0 !important;
        max-width: 100% !important;
    }}
    [data-testid="stAppViewContainer"] > section > div {{
        padding: 0 !important;
    }}

    /* Scrollbar */
    ::-webkit-scrollbar {{ width: 6px; }}
    ::-webkit-scrollbar-track {{ background: var(--bg); }}
    ::-webkit-scrollbar-thumb {{ background: var(--gold); border-radius: 3px; }}

    /* Section wrapper */
    .ka-section {{
        padding: 80px 5vw;
        background: var(--bg);
    }}
    .ka-section-alt {{
        padding: 80px 5vw;
        background: var(--surface2);
    }}

    /* Typography */
    .ka-display {{
        font-family: 'Cormorant Garamond', serif;
        font-weight: 300;
        color: var(--text);
        line-height: 1.1;
    }}
    .ka-label {{
        font-family: 'Jost', sans-serif;
        font-weight: 500;
        font-size: 0.7rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: var(--gold);
    }}
    .ka-body {{
        font-family: 'Jost', sans-serif;
        font-weight: 300;
        color: var(--text-muted);
        line-height: 1.8;
    }}

    /* Cards */
    .product-card {{
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 28px;
        cursor: pointer;
        transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        position: relative;
        overflow: hidden;
    }}
    .product-card::before {{
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--gold), var(--green));
        transform: scaleX(0);
        transition: transform 0.35s ease;
        transform-origin: left;
    }}
    .product-card:hover::before {{
        transform: scaleX(1);
    }}
    .product-card:hover {{
        transform: translateY(-6px);
        box-shadow: 0 20px 60px var(--shadow);
        border-color: var(--gold);
    }}

    /* Badge */
    .ka-badge {{
        display: inline-block;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 12px;
    }}
    .badge-bestseller {{
        background: rgba(201,169,110,0.15);
        color: var(--gold);
        border: 1px solid rgba(201,169,110,0.3);
    }}
    .badge-new {{
        background: rgba(61,107,79,0.15);
        color: var(--green);
        border: 1px solid rgba(61,107,79,0.3);
    }}

    /* Buttons */
    .ka-btn {{
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 14px 32px;
        border-radius: 50px;
        font-family: 'Jost', sans-serif;
        font-size: 0.82rem;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
        text-decoration: none;
    }}
    .ka-btn-primary {{
        background: var(--gold);
        color: #1C1A16;
    }}
    .ka-btn-primary:hover {{
        background: #B8934A;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(201,169,110,0.35);
    }}
    .ka-btn-outline {{
        background: transparent;
        color: var(--text);
        border: 1px solid var(--border);
    }}
    .ka-btn-outline:hover {{
        border-color: var(--gold);
        color: var(--gold);
    }}

    /* Input / form */
    .ka-input {{
        width: 100%;
        padding: 14px 18px;
        background: var(--surface2);
        border: 1px solid var(--border);
        border-radius: 10px;
        font-family: 'Jost', sans-serif;
        font-size: 0.9rem;
        color: var(--text);
        outline: none;
        transition: border-color 0.25s;
        margin-bottom: 14px;
    }}
    .ka-input:focus {{ border-color: var(--gold); }}

    /* Pill tags */
    .ka-pill {{
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        background: var(--surface2);
        border: 1px solid var(--border);
        font-size: 0.75rem;
        color: var(--text-muted);
        margin: 3px;
        font-family: 'Jost';
    }}

    /* Stars */
    .star-filled {{ color: var(--gold); }}
    .star-empty {{ color: var(--border); }}

    /* Cart counter */
    .cart-badge {{
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--gold);
        color: #1C1A16;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        box-shadow: 0 8px 30px rgba(201,169,110,0.4);
        cursor: pointer;
        z-index: 999;
        transition: transform 0.2s;
    }}
    .cart-badge:hover {{ transform: scale(1.1); }}

    /* Divider */
    .ka-divider {{
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, var(--gold), transparent);
        margin: 16px 0 28px;
    }}

    /* Glass card */
    .glass-card {{
        background: rgba(255,255,255,0.04);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px;
    }}

    /* Testimonial */
    .testimonial-card {{
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 32px;
        position: relative;
    }}
    .testimonial-card::before {{
        content: '"';
        font-family: 'Cormorant Garamond', serif;
        font-size: 5rem;
        color: var(--gold);
        opacity: 0.3;
        position: absolute;
        top: 10px;
        left: 20px;
        line-height: 1;
    }}

    /* Animations */
    @keyframes fadeUp {{
        from {{ opacity: 0; transform: translateY(30px); }}
        to {{ opacity: 1; transform: translateY(0); }}
    }}
    @keyframes shimmer {{
        0% {{ background-position: -200% center; }}
        100% {{ background-position: 200% center; }}
    }}
    @keyframes pulse-gold {{
        0%, 100% {{ box-shadow: 0 0 0 0 rgba(201,169,110,0.3); }}
        50% {{ box-shadow: 0 0 0 12px rgba(201,169,110,0); }}
    }}
    .fade-up {{ animation: fadeUp 0.6s ease forwards; }}
    .fade-up-1 {{ animation: fadeUp 0.6s 0.1s ease both; }}
    .fade-up-2 {{ animation: fadeUp 0.6s 0.2s ease both; }}
    .fade-up-3 {{ animation: fadeUp 0.6s 0.3s ease both; }}

    /* Counter number */
    .counter-number {{
        font-family: 'Cormorant Garamond', serif;
        font-size: 3.5rem;
        font-weight: 300;
        color: var(--gold);
        line-height: 1;
    }}

    /* Streamlit widget overrides */
    .stTextInput > div > div {{
        background: var(--surface2) !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        color: var(--text) !important;
    }}
    .stSelectbox > div > div {{
        background: var(--surface2) !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
    }}
    .stTextArea > div > textarea {{
        background: var(--surface2) !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        color: var(--text) !important;
    }}
    div[data-testid="stButton"] button {{
        background: var(--gold) !important;
        color: #1C1A16 !important;
        border: none !important;
        border-radius: 50px !important;
        font-family: 'Jost', sans-serif !important;
        font-weight: 500 !important;
        letter-spacing: 0.1em !important;
        padding: 10px 28px !important;
        transition: all 0.3s ease !important;
    }}
    div[data-testid="stButton"] button:hover {{
        background: #B8934A !important;
        transform: translateY(-2px) !important;
    }}
    </style>
    """)


