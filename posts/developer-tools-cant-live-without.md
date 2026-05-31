---
layout: layouts/post.njk
title: The developer tools I can't live without
description: A curated list of CLI tools, plugins, and utilities that make me significantly faster.
date: 2022-06-14
tags:
  - post
  - Tooling
---

Tools compound. A small improvement to something you do fifty times a day multiplies fast. Here are the tools that have actually changed how I work — not the ones I tried once and forgot.

## Terminal: the foundation

### `fzf` — fuzzy finder

`fzf` is a command-line fuzzy finder that integrates with your shell. Press `Ctrl+R` and your history becomes an interactive, searchable list. Press `Ctrl+T` and the same thing happens for file paths.

```bash
# Without fzf: remember exact command and scroll history
# With fzf: Ctrl+R, type a few letters, hit Enter

# Find and open any file in the project
vim $(fzf)

# Preview files as you browse
fzf --preview 'cat {}'
```

If you install nothing else from this list, install `fzf`.

### `ripgrep` (`rg`) — code search

`rg` is a replacement for `grep` that respects `.gitignore`, searches recursively by default, and is significantly faster. The output is also much more readable.

```bash
# grep: verbose, slow, shows binary files
grep -r --include="*.scala" "foldLeft" .

# rg: clean, fast, gitignore-aware
rg "foldLeft" --type scala
```

<figure>
<svg viewBox="0 0 680 160" xmlns="http://www.w3.org/2000/svg" font-family="DM Sans, sans-serif">
  <rect x="10" y="10" width="660" height="140" rx="6" fill="#1a1a18"/>
  <text x="30" y="38" font-size="11" fill="#6b9e6b" font-family="Courier New">$ rg "foldLeft" --type scala</text>

  <text x="30" y="62" font-size="11" fill="#4a90d9" font-family="Courier New">src/main/Parser.scala</text>
  <text x="30" y="80" font-size="11" fill="#6b6b65" font-family="Courier New">12:</text>
  <text x="62" y="80" font-size="11" fill="#e8e8e2" font-family="Courier New">    .foldLeft(Map.empty[String, Int]) { (acc, item) =&gt;</text>

  <text x="30" y="104" font-size="11" fill="#4a90d9" font-family="Courier New">src/main/Processor.scala</text>
  <text x="30" y="122" font-size="11" fill="#6b6b65" font-family="Courier New">47:</text>
  <text x="62" y="122" font-size="11" fill="#e8e8e2" font-family="Courier New">  val total = transactions.foldLeft(0.0)(_ + _.amount)</text>

  <text x="30" y="146" font-size="11" fill="#6b6b65" font-family="Courier New">2 matches in 2 files</text>
</svg>
<figcaption>ripgrep output: filename highlighted, line numbers shown, only relevant results — no noise.</figcaption>
</figure>

### `bat` — better `cat`

`bat` is `cat` with syntax highlighting, line numbers, and git integration. I've aliased `cat` to `bat` and haven't looked back.

```bash
# Shows code with syntax highlighting
bat src/main/MyFile.scala

# Works great with fzf preview
fzf --preview 'bat --color=always {}'
```

### `z` — directory jumping

`z` tracks which directories you visit most and lets you jump to them by typing a substring.

```bash
# Instead of: cd ~/projects/work/backend/src/main
z backend
# Jumps to the most-visited directory matching "backend"
```

## Editor: VS Code extensions

### Error Lens

Inline error and warning display — no more hovering to see what's wrong. The message appears right next to the offending line.

### GitLens

Shows who wrote every line of code, when, and from which commit — inline, without leaving the editor. Indispensable for working in a codebase you didn't write alone.

### File Nesting

Groups related files in the explorer: `Component.tsx`, `Component.test.tsx`, and `Component.module.css` nest under one entry. Dramatically reduces sidebar noise.

## Git workflow tools

### `git log --oneline --graph --decorate`

Aliased to `git lg`. Shows a compact visual branch graph:

```bash
# In ~/.gitconfig:
[alias]
  lg = log --oneline --graph --decorate --all
```

### Conventional commits

Not a tool — a convention. Every commit message starts with a type: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`. This makes history scannable and enables automatic changelog generation.

```bash
feat: add reading time filter to post layout
fix: close missing div in hero section
docs: update README with new build instructions
```

## The selection principle

I only add a tool permanently if I notice I'm using it every day after a week. Most tools I try don't make it past that filter. The ones that do tend to stick for years.

The goal isn't an impressive dotfiles repo. It's a workflow that's frictionless enough to stay out of the way of the actual work.
