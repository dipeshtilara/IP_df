import streamlit as st
import streamlit.components.v1 as components
import os

# 1. Setup Page Layout
st.set_page_config(
    page_title="Pandas Visualizer",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# 2. Hide Streamlit UI elements (Header, Footer, Padding)
hide_st_style = """
            <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            header {visibility: hidden;}
            .block-container {padding: 0rem;}
            iframe {display: block;}
            </style>
            """
st.markdown(hide_st_style, unsafe_allow_html=True)

def load_visualizer():
    # 3. Read the external files
    # Assumes index.html, style.css, and script.js are in the same folder
    try:
        with open("index.html", "r", encoding="utf-8") as f:
            html_content = f.read()
        with open("style.css", "r", encoding="utf-8") as f:
            css_content = f.read()
        with open("script.js", "r", encoding="utf-8") as f:
            js_content = f.read()

        # 4. Inject CSS and JS into the HTML
        # Replacing the link/script tags with actual content
        full_html = html_content.replace(
            '<link rel="stylesheet" href="style.css">', 
            f'<style>{css_content}</style>'
        ).replace(
            '<script src="script.js"></script>', 
            f'<script>{js_content}</script>'
        )

        # 5. Render the Component
        # We use a high height (e.g., 900) or 'vh' logic
        components.html(full_html, height=900, scrolling=True)
        
    except FileNotFoundError as e:
        st.error(f"Missing file: {e}. Ensure index.html, style.css, and script.js are in the same directory.")

if __name__ == "__main__":
    load_visualizer()
