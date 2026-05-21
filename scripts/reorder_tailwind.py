#!/usr/bin/env python3
"""Move tailwind.min.css link to load LAST (just before </head>) to win cascade
against custom stylesheets like styles.css which contain rules like .hero-slider
that override Tailwind utilities."""
import re
import glob

html_files = []
html_files.extend(glob.glob('/app/*.html'))
html_files.extend(glob.glob('/app/p/*.html'))
html_files.extend(glob.glob('/app/blog/**/*.html', recursive=True))
html_files.extend(glob.glob('/app/content/**/*.html', recursive=True))
html_files.extend(glob.glob('/app/admin/**/*.html', recursive=True))
html_files.extend(glob.glob('/app/admin-secure/**/*.html', recursive=True))

# Remove the existing tailwind link (with its preload sibling)
preload_pat = re.compile(r'\s*<link\s+rel=["\']preload["\']\s+href=["\']/css/tailwind\.min\.css["\'][^>]*>', re.IGNORECASE)
link_pat    = re.compile(r'\s*<link\s+rel=["\']stylesheet["\']\s+href=["\']/css/tailwind\.min\.css["\'][^>]*>', re.IGNORECASE)

# What to insert just before </head>
insertion = '\n    <!-- Tailwind (compiled, loaded last so utilities win cascade) -->\n    <link rel="stylesheet" href="/css/tailwind.min.css">\n'

modified = 0
for fp in html_files:
    with open(fp,'r',encoding='utf-8') as f: c = f.read()
    original = c
    if '/css/tailwind.min.css' not in c:
        continue
    # Remove existing references
    c = preload_pat.sub('', c)
    c = link_pat.sub('', c)
    # Insert just before </head>
    c = re.sub(r'(\s*</head>)', insertion + r'\1', c, count=1, flags=re.IGNORECASE)
    if c != original:
        with open(fp,'w',encoding='utf-8') as f: f.write(c)
        modified += 1

print(f"✅ Reordered Tailwind link in {modified} files")
