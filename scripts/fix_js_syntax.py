#!/usr/bin/env python3
"""Fix widespread JS syntax errors: missing parentheses in function declarations,
IIFEs, arrow functions, and method calls."""
import re
import glob
import sys

# Patterns to fix
patterns = [
    # function name { → function name() {
    (re.compile(r'\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\{'), r'function \1() {'),
    # async function name { → async function name() {
    (re.compile(r'\basync\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\{'), r'async function \1() {'),
    # (function { → (function() {  (IIFE)
    (re.compile(r'\(function\s+\{'), r'(function() {'),
    # ", => {" → ", () => {"  (callback arrow missing args)
    (re.compile(r',\s*=>\s*\{'), r', () => {'),
    # "( => {" → "(() => {"  (arrow with leading paren only)
    (re.compile(r'\(\s*=>\s*\{'), r'(() => {'),
    # window.dataLayer = window.dataLayer | []  → || []
    (re.compile(r'(window\.dataLayer\s*=\s*window\.dataLayer\s*)\|(\s*\[\])'), r'\1||\2'),
    # e.preventDefault; → e.preventDefault();
    (re.compile(r'\b([a-zA-Z_$][a-zA-Z0-9_$]*)\.preventDefault;'), r'\1.preventDefault();'),
    # e.stopPropagation; → e.stopPropagation();
    (re.compile(r'\b([a-zA-Z_$][a-zA-Z0-9_$]*)\.stopPropagation;'), r'\1.stopPropagation();'),
    # new Date; → new Date();
    (re.compile(r'\bnew\s+Date\s*;'), r'new Date();'),
    # new Date) → new Date()) when used as arg
    (re.compile(r"\bnew\s+Date\s*\)"), r'new Date())'),
]

# Files to process: HTML + JS (excluding node_modules and minified files)
files = []
files.extend(glob.glob('/app/*.html'))
files.extend(glob.glob('/app/p/*.html'))
files.extend(glob.glob('/app/blog/**/*.html', recursive=True))
files.extend(glob.glob('/app/admin/**/*.html', recursive=True))
files.extend(glob.glob('/app/admin-secure/**/*.html', recursive=True))
files.extend(glob.glob('/app/*.js'))
files.extend(glob.glob('/app/js/**/*.js', recursive=True))

# Skip these (already correct or minified)
skip = ['node_modules', '.min.js', 'tailwind.min.css', '/p/']

# Avoid double-replacement: New Date()) — only fix new Date; cases
patterns[-1] = (re.compile(r'XXNEVERMATCH'), r'')  # disable

total_changes = 0
files_changed = 0
for fp in files:
    if any(s in fp for s in skip):
        continue
    try:
        with open(fp,'r',encoding='utf-8') as f:
            content = f.read()
        original = content
        local_changes = 0
        for pat, rep in patterns:
            new = pat.sub(rep, content)
            if new != content:
                # Count matches
                local_changes += len(pat.findall(content))
            content = new

        if content != original:
            with open(fp,'w',encoding='utf-8') as f:
                f.write(content)
            files_changed += 1
            total_changes += local_changes
            print(f"  ✓ {fp} — {local_changes} fixes")
    except Exception as e:
        print(f"  ERR {fp}: {e}", file=sys.stderr)

print(f"\n✅ Files changed: {files_changed}")
print(f"📊 Total syntax fixes: {total_changes}")
