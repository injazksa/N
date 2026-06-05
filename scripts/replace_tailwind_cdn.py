#!/usr/bin/env python3
"""Replace Tailwind CDN with compiled CSS across all HTML files."""
import re
import glob
import sys

# Collect all HTML files
html_files = []
html_files.extend(glob.glob('/app/*.html'))
html_files.extend(glob.glob('/app/p/*.html'))
html_files.extend(glob.glob('/app/blog/**/*.html', recursive=True))
html_files.extend(glob.glob('/app/content/**/*.html', recursive=True))
html_files.extend(glob.glob('/app/admin/**/*.html', recursive=True))
html_files.extend(glob.glob('/app/admin-secure/**/*.html', recursive=True))

# Patterns to remove
cdn_pattern = re.compile(
    r'\s*<script\s+src=["\']https://cdn\.tailwindcss\.com[^"\']*["\']\s*>\s*</script>',
    re.IGNORECASE
)
# Inline tailwind.config block (only those that have tailwind.config = inside)
config_pattern = re.compile(
    r'\s*<script>\s*tailwind\.config\s*=\s*\{[^<]*?\}\s*</script>',
    re.IGNORECASE | re.DOTALL
)

# Local CSS link to insert (with preload for performance)
replacement = '\n    <link rel="preload" href="/css/tailwind.min.css" as="style">\n    <link rel="stylesheet" href="/css/tailwind.min.css">'

modified = 0
skipped = 0
for fp in html_files:
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        original = content

        if 'cdn.tailwindcss.com' not in content:
            skipped += 1
            continue

        # Remove the inline tailwind.config script first
        content = config_pattern.sub('', content)
        # Replace the CDN script with our local link
        content = cdn_pattern.sub(replacement, content, count=1)

        if content != original:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)
            modified += 1
    except Exception as e:
        print(f"ERR on {fp}: {e}", file=sys.stderr)

print(f"✅ Modified: {modified}")
print(f"⏭️  Skipped: {skipped}")
print(f"📊 Total HTML files scanned: {len(html_files)}")
