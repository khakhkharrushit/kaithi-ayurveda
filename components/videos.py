import streamlit as st


def render_videos():
    dark = st.session_state.dark_mode
    bg = "#0D0C0A" if dark else "#FAF7F2"
    surface = "#1A1814" if dark else "#FFFFFF"
    text = "#F5EDD8" if dark else "#1C1A16"
    muted = "#A89880" if dark else "#6B5E4E"
    border = "#3A352D" if dark else "#E8DDD0"

    def format_video_url(url):
        if not url: return {"type": "empty", "url": ""}
        if "youtube.com" in url or "youtu.be" in url:
            # Transform Shorts/Share links into safe embed links
            if "youtube.com/shorts/" in url:
                video_id = url.split("youtube.com/shorts/")[1].split("?")[0]
                url = f"https://www.youtube.com/embed/{video_id}"
            elif "youtu.be/" in url:
                video_id = url.split("youtu.be/")[1].split("?")[0]
                url = f"https://www.youtube.com/embed/{video_id}"
            
            sep = "&" if "?" in url else "?"
            return {"type": "youtube", "url": url + f"{sep}controls=0&modestbranding=1&rel=0"}
        if url.endswith(".mp4"):
            return {"type": "local", "url": url}
        return {"type": "unknown", "url": url}

    videos = [
        {"title": "🌿 Kaithi Ayurveda — Healing Naturally, Transforming Lives", "desc": "Ancient wisdom. Modern results.Trust Ayurveda. Trust the process. 💫", "url": "https://www.youtube.com/embed/PuRbpIp7-Ac", "duration": "0:43", "emoji": "🌱"},
        {"title": "Handcrafted with Care 🧼 | Kaithi Ayurveda Soaps", "desc": "Every bar is made with love, packed with purity, and crafted for your skin 🌱", "url": "https://www.youtube.com/embed/0Wj3S7jUo6M", "duration": ":15", "emoji": "📦"},
        {"title": "From Herbs to Hair Oil 🌿✨", "desc": "Watch how our handmade Ayurvedic hair oil is crafted with tradition and precision for stronger, healthier hair.", "url": "https://www.youtube.com/embed/2doTKUSCmiY", "duration": "1:16", "emoji": "🧴"},
    ]

    import os
    import base64
    video_cards_html = ""
    for v in videos:
        parsed = format_video_url(v['url'])
        if parsed['type'] == 'local':
            # Load local mp4 as base64 to bypass server limitations
            vid_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', parsed['url'])
            if os.path.exists(vid_path):
                with open(vid_path, 'rb') as file:
                    b64_vid = base64.b64encode(file.read()).decode()
                player = f'<video src="data:video/mp4;base64,{b64_vid}" controls controlsList="nodownload" preload="metadata" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;"></video>'
            else:
                player = f'<div style="color:#C9A96E; padding: 20px; display:flex; align-items:center; justify-content:center; height:100%; text-align:center;">Video file "{parsed["url"]}" not found in assets/</div>'
        elif parsed['type'] == 'youtube':
            player = f'<iframe src="{parsed["url"]}" loading="lazy" allow="autoplay; fullscreen; encrypted-media"></iframe>'
        else:
            player = f'<div style="color:#C9A96E; padding: 20px; display:flex; align-items:center; justify-content:center; height:100%; text-align:center;">Unsupported Link. Please use YouTube or Local .mp4</div>'
            
        video_cards_html += f"""
            <div class="video-card">
                <div class="video-thumb">
                    {player}
                    <div class="duration">{v['duration']}</div>
                </div>
                <div class="video-info">
                    <div class="video-emoji">{v['emoji']}</div>
                    <div class="video-title">{v['title']}</div>
                    <div class="video-desc">{v['desc']}</div>
                </div>
            </div>
        """

    st.components.v1.html(f"""
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@300;400;500&display=swap');
        * {{ margin:0; padding:0; box-sizing:border-box; }}
        body {{ background: {bg}; }}
        .videos {{ padding: 80px 5vw; }}
        .section-header {{ text-align:center; margin-bottom: 48px; }}
        .eyebrow {{ font-family:'Jost';font-size:0.7rem;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:#C9A96E;margin-bottom:12px; }}
        h2 {{ font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;color:{text};margin-bottom:12px; }}
        .divider {{ width:60px;height:2px;background:linear-gradient(90deg,#C9A96E,transparent);margin:0 auto 16px; }}
        .subtitle {{ font-family:'Jost';font-weight:300;font-size:0.88rem;color:{muted};max-width:480px;margin:0 auto;line-height:1.8; }}
        .video-grid {{ display:grid;grid-template-columns:repeat(3,1fr);gap:24px; }}
        .video-card {{
            background: {surface};
            border: 1px solid {border};
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.35s ease;
            cursor: default;
        }}
        .video-card:hover {{
            transform: translateY(-6px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.12);
            border-color: #C9A96E;
        }}
        .video-thumb {{
            position: relative;
            width: 100%;
            padding-top: 56.25%;
            background: {'#252219' if dark else '#F0E8DA'};
            overflow: hidden;
        }}
        .video-thumb iframe {{
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            border: none;
        }}
        .duration {{
            position: absolute;
            bottom: 15px;
            right: 15px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 3px 8px;
            border-radius: 6px;
            font-family: 'Jost';
            font-size: 0.7rem;
            letter-spacing: 0.05em;
            pointer-events: none;
            z-index: 10;
        }}
        .video-info {{ padding: 20px; }}
        .video-emoji {{ font-size: 1.3rem; margin-bottom: 8px; }}
        .video-title {{ font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:400;color:{text};margin-bottom:8px;line-height:1.2; }}
        .video-desc {{ font-family:'Jost';font-size:0.78rem;font-weight:300;color:{muted};line-height:1.7; }}
        @media (max-width:768px) {{ .video-grid {{ grid-template-columns:1fr; }} }}
    </style>
    </head>
    <body>
    <section class="videos">
        <div class="section-header">
            <p class="eyebrow">✦ Craft & Process ✦</p>
            <h2>Watch Us Make It</h2>
            <div class="divider"></div>
            <p class="subtitle">Every drop has a story. Peek behind the scenes of our ancient crafting rituals.</p>
        </div>
        <div class="video-grid">
            {video_cards_html}
        </div>
    </section>
    </body>
    </html>
    """, height=660, scrolling=False)


