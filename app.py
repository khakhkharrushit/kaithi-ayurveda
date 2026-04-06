import warnings
import logging
# Force reload
# Force reload
# Force reload
# Force reload

# Suppress st.components.v1.html deprecation spam
warnings.filterwarnings("ignore")
for logger_name in ["streamlit", "streamlit.runtime", "streamlit.elements"]:
    logging.getLogger(logger_name).setLevel(logging.ERROR)

import streamlit as st
import json
from components.styles import inject_global_styles
from components.hero import render_hero
from components.products import render_products
from components.about import render_about
from components.videos import render_videos
from components.instagram import render_instagram
from components.testimonials import render_testimonials
from components.contact import render_contact
from components.counters import render_counters
from components.navbar import render_navbar
from data.products import PRODUCTS

st.set_page_config(
    page_title="Kaithi Ayurveda — Pure. Handmade. Ancient.",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Initialize session state
if "dark_mode" not in st.session_state:
    st.session_state.dark_mode = False
if "selected_product" not in st.session_state:
    st.session_state.selected_product = None
if "search_query" not in st.session_state:
    st.session_state.search_query = ""
if "filter_category" not in st.session_state:
    st.session_state.filter_category = "All"

inject_global_styles(st.session_state.dark_mode)
render_navbar()

if st.session_state.selected_product is not None:
    from components.product_detail import render_product_detail
    render_product_detail(st.session_state.selected_product)
else:
    render_hero()
    render_counters()
    st.html('<div id="products-anchor"></div>')
    render_products(PRODUCTS)
    st.html('<div id="about-anchor"></div>')
    render_about()
    render_videos()
    render_instagram()
    render_testimonials()
    st.html('<div id="contact-anchor"></div>')
    render_contact()
