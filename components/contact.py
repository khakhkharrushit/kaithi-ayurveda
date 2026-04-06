import streamlit as st


def render_contact():
    dark = st.session_state.dark_mode
    bg = "#1A1814" if dark else "#F5F0E8"
    surface = "#252219" if dark else "#FFFFFF"
    text = "#F5EDD8" if dark else "#1C1A16"
    muted = "#A89880" if dark else "#6B5E4E"
    border = "#3A352D" if dark else "#E8DDD0"
    input_bg = "#1A1814" if dark else "#FAF7F2"

    st.components.v1.html(f"""
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@300;400;500&display=swap');
        * {{ margin:0; padding:0; box-sizing:border-box; }}
        body {{ background: {bg}; }}
        .contact {{ padding: 80px 5vw; }}
        .contact-grid {{ display:grid; grid-template-columns: 1fr 1.3fr; gap: 60px; align-items: start; }}
        .eyebrow {{ font-family:'Jost';font-size:0.7rem;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:#C9A96E;margin-bottom:12px; }}
        h2 {{ font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;color:{text};line-height:1.15;margin-bottom:12px; }}
        .divider {{ width:60px;height:2px;background:linear-gradient(90deg,#C9A96E,transparent);margin:20px 0 28px; }}
        p {{ font-family:'Jost';font-size:0.88rem;font-weight:300;color:{muted};line-height:1.9;margin-bottom:32px; }}
        .contact-info {{ display:flex; flex-direction:column; gap:16px; }}
        .info-item {{
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 16px 20px;
            background: {surface};
            border: 1px solid {border};
            border-radius: 12px;
        }}
        .info-icon {{ font-size:1.3rem; }}
        .info-label {{ font-family:'Jost';font-size:0.65rem;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:#C9A96E;margin-bottom:3px; }}
        .info-val {{ font-family:'Jost';font-size:0.85rem;font-weight:300;color:{text}; }}
        .wa-btn {{
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-top: 24px;
            padding: 14px 28px;
            background: #25D366;
            color: white;
            border: none;
            border-radius: 50px;
            font-family: 'Jost', sans-serif;
            font-size: 0.82rem;
            font-weight: 500;
            letter-spacing: 0.1em;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(37,211,102,0.3);
            text-decoration: none;
        }}
        .wa-btn:hover {{ background: #1EBD5A; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(37,211,102,0.4); }}
        /* Form */
        .contact-form {{
            background: {surface};
            border: 1px solid {border};
            border-radius: 20px;
            padding: 36px;
        }}
        .form-title {{ font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:300;color:{text};margin-bottom:24px; }}
        label {{ font-family:'Jost';font-size:0.7rem;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:{muted};display:block;margin-bottom:6px; }}
        input, textarea, select {{
            width: 100%;
            padding: 13px 16px;
            background: {input_bg};
            border: 1px solid {border};
            border-radius: 10px;
            font-family: 'Jost', sans-serif;
            font-size: 0.88rem;
            font-weight: 300;
            color: {text};
            outline: none;
            transition: border-color 0.25s;
            margin-bottom: 18px;
            resize: vertical;
        }}
        input:focus, textarea:focus, select:focus {{ border-color: #C9A96E; }}
        textarea {{ min-height: 100px; }}
        .submit-btn {{
            width: 100%;
            padding: 15px;
            background: #C9A96E;
            color: #1C1A16;
            border: none;
            border-radius: 50px;
            font-family: 'Jost', sans-serif;
            font-size: 0.82rem;
            font-weight: 500;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
        }}
        .submit-btn:hover {{ background: #B8934A; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,169,110,0.35); }}
        .success-msg {{
            display: none;
            text-align: center;
            padding: 20px;
            background: rgba(61,107,79,0.15);
            border: 1px solid rgba(61,107,79,0.3);
            border-radius: 12px;
            color: #3D6B4F;
            font-family: 'Jost';
            font-size: 0.88rem;
            margin-top: 16px;
        }}
        footer {{
            text-align: center;
            padding: 40px 5vw;
            border-top: 1px solid {border};
            background: {bg};
            margin-top: 0;
        }}
        .footer-logo {{ font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:300;color:{text};margin-bottom:8px; }}
        .footer-sub {{ font-family:'Jost';font-size:0.7rem;letter-spacing:0.25em;text-transform:uppercase;color:#C9A96E;margin-bottom:16px; }}
        .footer-copy {{ font-family:'Jost';font-size:0.75rem;color:{muted}; }}
        @media (max-width:768px) {{ .contact-grid {{ grid-template-columns:1fr; }} }}
    </style>
    </head>
    <body>
    <section class="contact" id="contact">
        <div class="contact-grid">
            <div class="contact-left">
                <p class="eyebrow">✦ Get In Touch ✦</p>
                <h2>Let's Talk About<br><em style="font-style:italic;color:#C9A96E;">Wellness</em></h2>
                <div class="divider"></div>
                <p>Questions about ingredients, custom formulations, or wholesale enquiries — we love hearing from our community. Reach out, we'll get back within 24 hours.</p>
                <div class="contact-info">
                    <div class="info-item">
                        <span class="info-icon">📧</span>
                        <div>
                            <div class="info-label">Email</div>
                            <div class="info-val">kaithiayurveda@gmail.com</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">📱</span>
                        <div>
                            <div class="info-label">Phone</div>
                            <div class="info-val">+91 94287 04882</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">📍</span>
                        <div>
                            <div class="info-label">Studio</div>
                            <div class="info-val">Kodinar, Gujarat, India</div>
                        </div>
                    </div>
                </div>
                <a class="wa-btn" href="https://wa.me/919428704882?text=Hi!%20I'm%20interested%20in%20Kaithi%20Ayurveda%20products" target="_blank">
                    💬 &nbsp;Chat on WhatsApp
                </a>
            </div>
            <div class="contact-form">
                <div class="form-title">Send a Message 🌿</div>
                <label>Your Name</label>
                <input type="text" id="name" placeholder="Ananya Sharma">
                <label>Email Address</label>
                <input type="email" id="email" placeholder="you@email.com">
                <label>What would you like to discuss?</label>
                <select id="subject">
                    <option>Product Enquiry</option>
                    <option>Wholesale / Retail Partnership</option>
                    <option>Custom Formulation</option>
                    <option>General Question</option>
                </select>
                <label>Message</label>
                <textarea id="message" placeholder="Tell us how we can help..."></textarea>
                <button class="submit-btn" onclick="handleSubmit()">Send Message ✦</button>
                <div class="success-msg" id="success">
                    ✨ Thank you! We've received your message and will reply within 24 hours.
                </div>
            </div>
        </div>
    </section>
    <footer>
        <div class="footer-logo">🌿 Kaithi Ayurveda</div>
        <div class="footer-sub">Pure · Handmade · Ancient Wisdom</div>
        <div class="footer-copy">© 2025 Kaithi Ayurveda. All rights reserved. Made with 🧡 in India.</div>
    </footer>
    <script>
        function handleSubmit() {{
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const sub = document.getElementById('subject').value;
            const msg = document.getElementById('message').value;
            if (!name || !email || !msg) {{
                alert('Please fill in all fields.');
                return;
            }}
            document.getElementById('success').style.display = 'block';
            window.location.href = `mailto:kaithiayurveda@gmail.com?subject=${{encodeURIComponent(sub + " - Enquiry from " + name)}}&body=${{encodeURIComponent(msg + "\n\nFrom: " + name + " (" + email + ")")}}`;
            setTimeout(() => {{
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('message').value = '';
            }}, 500);
        }}
    </script>
    </body>
    </html>
    """, height=820, scrolling=False)


