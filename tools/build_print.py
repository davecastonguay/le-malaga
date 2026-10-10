"""Rebuild the printable PDFs from content.js.

Run from the repo root:  python3 tools/build_print.py
Needs Playwright with Chromium (pip install playwright && playwright install chromium).
Writes print/guide-fr.pdf, print/guide-en.pdf, print/guide-es.pdf and print/qr-autocollants.pdf.
Run it again whenever the text in content.js changes, and commit the new PDFs.
"""
import functools, http.server, os, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(os.path.join(ROOT, "print"), exist_ok=True)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
handler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{srv.server_port}/"

jobs = [(f"print.html?lang={l}", f"print/guide-{l}.pdf") for l in ("fr", "en", "es")]
jobs.append(("qr.html", "print/qr-autocollants.pdf"))
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    for url, out in jobs:
        pg.goto(base + url, wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        pg.pdf(path=os.path.join(ROOT, out), format="Letter", print_background=True, prefer_css_page_size=True)
        print("wrote", out)
    b.close()
srv.shutdown()
if errors:
    raise SystemExit("JavaScript errors: " + "; ".join(errors))
