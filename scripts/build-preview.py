#!/usr/bin/env python3
"""Gera um arquivo HTML único (tudo embutido) a partir do site.

Uso:  python3 scripts/build-preview.py [saida.html]

Serve para pré-visualizar ou enviar a página como um só arquivo,
sem depender da pasta assets/.
"""
import base64
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "preview.html"

html = (ROOT / "index.html").read_text(encoding="utf-8")

# 1. imagens -> data URI
for img in sorted((ROOT / "assets/img").glob("*.svg")):
    data = base64.b64encode(img.read_bytes()).decode("ascii")
    html = html.replace(f"assets/img/{img.name}", f"data:image/svg+xml;base64,{data}")

# 2. CSS e JS -> embutidos
css = (ROOT / "assets/css/styles.css").read_text(encoding="utf-8")
html = html.replace(
    '<link rel="stylesheet" href="assets/css/styles.css">',
    f"<style>\n{css}\n</style>",
)

for js in ("assets/js/config.js", "assets/js/main.js"):
    code = (ROOT / js).read_text(encoding="utf-8")
    html = re.sub(
        rf'<script src="{re.escape(js)}"( defer)?></script>',
        lambda _m, c=code: f"<script>\n{c}\n</script>",
        html,
    )

OUT.write_text(html, encoding="utf-8")
print(f"{OUT}  ({len(html) / 1024:.0f} KB)")
