import streamlit as st
import base64
import os

# Embedded logo (Kaithi Ayurveda logo, dark green background)
LOGO_B64 = (
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYGBgYHBgcICAcKCwoLCg8ODAwODxYQERAREBYi"
    "FRkVFRkVIh4kHhweJB42KiYmKjY+NDI0PkxERExfWl98fKcBBgYGBgcGBwgIBwoLCgsKDw4M"
    "DA4PFhAREBEQFiIVGRUVGRUiHiQeHB4kHjYqJiYqNj40MjQ+TERETF9aX3x8p//CABEIASwB"
    "LAMBIgACEQEDEQH/xAAwAAEBAAIDAQAAAAAAAAAAAAAAAQUGAgQHAwEBAQEBAAAAAAAAAAAAAAA"
    "AAAECAv/aAAwDAQACEAMQAAAA"
)

def get_logo_src():
    # Try loading from file first
    logo_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "assets", "logo.png")
    )
    if os.path.exists(logo_path):
        with open(logo_path, "rb") as f:
            data = base64.b64encode(f.read()).decode()
        ext = logo_path.rsplit(".", 1)[-1].lower()
        mime = "image/jpeg" if ext in ("jpg", "jpeg") else "image/png"
        return f"data:{mime};base64,{data}"
    
    # Try JPG variant
    for ext in ("jpg", "jpeg"):
        p = logo_path.replace(".png", f".{ext}")
        if os.path.exists(p):
            with open(p, "rb") as f:
                data = base64.b64encode(f.read()).decode()
            return f"data:image/jpeg;base64,{data}"
    
    return None


def render_navbar():
    dark = st.session_state.dark_mode

    logo_src = get_logo_src()

    nav_bg    = "rgba(13,12,10,0.92)"   if dark else "rgba(250,247,242,0.95)"
    border    = "rgba(201,169,110,0.18)" if dark else "rgba(201,169,110,0.25)"
    name_col  = "#F5EDD8"               if dark else "#1C1A16"
    link_col  = "#A89880"               if dark else "#6B5E4E"

    if logo_src:
        logo_html = f"""
        <div style="display:flex;align-items:center;gap:12px;">
            <div style="
                height:44px;width:44px;
                border-radius:50%;
                overflow:hidden;
                flex-shrink:0;
                background:#1a3d20;
                display:flex;align-items:center;justify-content:center;
                box-shadow:0 2px 12px rgba(0,0,0,0.15);
            ">
                <img src="{logo_src}" style="
                    height:100%;width:100%;
                    object-fit:cover;
                " alt="Kaithi Ayurveda Logo"/>
            </div>
            <div style="display:flex;align-items:baseline;gap:7px;line-height:1;">
                <span style="
                    font-family:'Cormorant Garamond',serif;
                    font-size:1.4rem;font-weight:600;
                    color:{name_col};letter-spacing:0.04em;
                ">Kaithi</span>
                <span style="
                    font-family:'Jost',sans-serif;
                    font-size:0.82rem;font-weight:400;
                    letter-spacing:0.28em;text-transform:uppercase;
                    color:#C9A96E;
                ">Ayurveda</span>
            </div>
        </div>"""
    else:
        logo_html = f"""
        <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:1.5rem;">🌿</span>
            <div style="display:flex;align-items:baseline;gap:7px;">
                <span style="font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:600;color:{name_col};letter-spacing:0.05em;">Kaithi</span>
                <span style="font-family:'Jost',sans-serif;font-size:0.78rem;font-weight:400;letter-spacing:0.3em;text-transform:uppercase;color:#C9A96E;">Ayurveda</span>
            </div>
        </div>"""

    st.html(f"""
    <nav style="
        position:fixed;top:0;left:0;right:0;z-index:1000;
        padding:13px 5vw;
        display:flex;align-items:center;justify-content:space-between;
        background:{nav_bg};
        backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
        border-bottom:1px solid {border};
        transition:all 0.3s ease;
    ">
        {logo_html}
        <div style="display:flex;align-items:center;gap:28px;">
            <a class="nav-scroll" data-target="products-anchor" style="cursor:pointer;font-family:'Jost';font-size:0.78rem;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:{link_col};text-decoration:none;">Products</a>
            <a class="nav-scroll" data-target="about-anchor"    style="cursor:pointer;font-family:'Jost';font-size:0.78rem;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:{link_col};text-decoration:none;">Story</a>
            <a class="nav-scroll" data-target="contact-anchor"  style="cursor:pointer;font-family:'Jost';font-size:0.78rem;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:{link_col};text-decoration:none;">Contact</a>
        </div>
    </nav>
    <div style="height:72px;"></div>
    """)

    import streamlit.components.v1 as components
    components.html("""
    <script>
        const parentDoc = window.parent.document;
        setInterval(() => {
            const links = parentDoc.querySelectorAll('.nav-scroll:not(.listening)');
            links.forEach(link => {
                link.classList.add('listening');
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('data-target');
                    const targetEl = parentDoc.getElementById(targetId);
                    if(targetEl) {
                        targetEl.scrollIntoView({behavior: 'smooth', block: 'start'});
                    }
                });
            });
        }, 500);
    </script>
    """, height=0)

    col1, col2, col3 = st.columns([8, 1, 1])
    with col3:
        mode_label = "☀️ Light" if dark else "🌙 Dark"
        if st.button(mode_label, key="dark_mode_toggle"):
            st.session_state.dark_mode = not st.session_state.dark_mode
            st.rerun()
