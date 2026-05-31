---
layout: layouts/post.njk
title: Building a blog with Eleventy and Nunjucks
description: A walkthrough of the stack powering this site — static generation, templates, and GitHub Pages deployment.
date: 2022-11-15
tags:
  - post
  - Eleventy
---

This blog runs on [Eleventy](https://11ty.dev) — a static site generator that takes Markdown files and Nunjucks templates and outputs a folder of plain HTML. No runtime. No server. No database. Just files.

Here's how it all fits together, and why I chose this stack.

## The mental model: data flows into templates

Eleventy is essentially a data pipeline. Markdown files carry content and frontmatter. Templates describe structure. Eleventy merges them and writes HTML to disk.

<figure>
<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg" font-family="DM Sans, sans-serif">
  <!-- Stage 1: Sources -->
  <rect x="10" y="30" width="130" height="160" rx="6" fill="#f3f1ec" stroke="#ddd" stroke-width="1.5"/>
  <text x="75" y="52" text-anchor="middle" font-size="11" font-weight="500" fill="#6b6b65">SOURCES</text>
  <rect x="22" y="62" width="106" height="28" rx="3" fill="#fff" stroke="#ddd" stroke-width="1"/>
  <text x="75" y="80" text-anchor="middle" font-size="10" fill="#1a1a18">posts/*.md</text>
  <rect x="22" y="98" width="106" height="28" rx="3" fill="#fff" stroke="#ddd" stroke-width="1"/>
  <text x="75" y="116" text-anchor="middle" font-size="10" fill="#1a1a18">_data/*.json</text>
  <rect x="22" y="134" width="106" height="28" rx="3" fill="#fff" stroke="#ddd" stroke-width="1"/>
  <text x="75" y="152" text-anchor="middle" font-size="10" fill="#1a1a18">_includes/*.njk</text>
  <rect x="22" y="170" width="106" height="12" rx="2" fill="#e8e0d8"/>
  <text x="75" y="180" text-anchor="middle" font-size="9" fill="#6b6b65">frontmatter, global data</text>

  <!-- Arrow 1 -->
  <path d="M 145 110 L 185 110" stroke="#c8593a" stroke-width="2" marker-end="url(#a)"/>
  <defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#c8593a"/></marker></defs>

  <!-- Stage 2: Eleventy -->
  <rect x="188" y="50" width="130" height="120" rx="6" fill="#1a1a18"/>
  <text x="253" y="78" text-anchor="middle" font-size="11" font-weight="500" fill="white">ELEVENTY</text>
  <text x="253" y="100" text-anchor="middle" font-size="10" fill="#6b9e6b">Data cascade</text>
  <text x="253" y="118" text-anchor="middle" font-size="10" fill="#e8947a">Template engine</text>
  <text x="253" y="136" text-anchor="middle" font-size="10" fill="#4a90d9">Collection build</text>
  <text x="253" y="154" text-anchor="middle" font-size="10" fill="#e8e8e2">HTML write</text>

  <!-- Arrow 2 -->
  <path d="M 322 110 L 362 110" stroke="#c8593a" stroke-width="2" marker-end="url(#a)"/>

  <!-- Stage 3: Output -->
  <rect x="365" y="30" width="130" height="160" rx="6" fill="#f5ede9" stroke="#c8593a" stroke-width="1.5"/>
  <text x="430" y="52" text-anchor="middle" font-size="11" font-weight="500" fill="#c8593a">_site/</text>
  <rect x="377" y="62" width="106" height="24" rx="3" fill="#fff" stroke="#c8593a" stroke-width="1"/>
  <text x="430" y="78" text-anchor="middle" font-size="10" fill="#1a1a18">index.html</text>
  <rect x="377" y="92" width="106" height="24" rx="3" fill="#fff" stroke="#c8593a" stroke-width="1"/>
  <text x="430" y="108" text-anchor="middle" font-size="10" fill="#1a1a18">posts/my-post/index.html</text>
  <rect x="377" y="122" width="106" height="24" rx="3" fill="#fff" stroke="#c8593a" stroke-width="1"/>
  <text x="430" y="138" text-anchor="middle" font-size="10" fill="#1a1a18">about/index.html</text>
  <rect x="377" y="152" width="106" height="24" rx="3" fill="#fff" stroke="#c8593a" stroke-width="1"/>
  <text x="430" y="168" text-anchor="middle" font-size="10" fill="#1a1a18">css/style.css</text>

  <!-- Arrow 3 -->
  <path d="M 499 110 L 539 110" stroke="#c8593a" stroke-width="2" marker-end="url(#a)"/>

  <!-- Stage 4: GitHub Pages -->
  <rect x="542" y="70" width="130" height="80" rx="6" fill="#2e7d5e"/>
  <text x="607" y="100" text-anchor="middle" font-size="11" font-weight="500" fill="white">GitHub Pages</text>
  <text x="607" y="120" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.75)">Serves static files</text>
  <text x="607" y="138" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.75)">Zero runtime cost</text>
</svg>
<figcaption>Eleventy's build pipeline: sources merge into the data cascade, template engine renders HTML, GitHub Pages serves it.</figcaption>
</figure>

## Project structure

```
.
├── _includes/
│   └── layouts/
│       ├── base.njk       ← HTML shell, nav, footer
│       └── post.njk       ← Post wrapper (extends base)
├── _data/                 ← Global data files (JSON/JS)
├── css/
│   └── style.css
├── posts/
│   ├── posts.njk          ← /posts/ index page
│   └── my-first-post.md   ← A post
├── about/
│   └── index.md
├── index.njk              ← Homepage
└── .eleventy.js           ← Config
```

## Nunjucks template inheritance

The base layout wraps every page. The post layout extends the base and adds article-specific chrome. This is achieved with Eleventy's `layout` frontmatter key — not Nunjucks `extends` directly (though you can use chained layouts).

```njk
{# _includes/layouts/base.njk #}
<!DOCTYPE html>
<html lang="en">
<head>
  <title>{{ title }} — My Blog</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav>...</nav>
  <main>{{ content | safe }}</main>
  <footer>...</footer>
</body>
</html>
```

```njk
{# _includes/layouts/post.njk #}
---
layout: layouts/base.njk
---
<article>
  <h1>{{ title }}</h1>
  <p>{{ page.date | dateFormat }}</p>
  {{ content | safe }}
</article>
```

## Custom filters in `.eleventy.js`

Nunjucks filters are how you transform data in templates. Eleventy lets you add your own.

```js
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("dateFormat", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("MMM yyyy")
  );

  eleventyConfig.addFilter("readingTime", (content) => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(words / 200);
  });
};
```

## Deploying to GitHub Pages

The simplest deploy: push `_site/` directly. The cleaner way: use GitHub Actions to build on push and deploy automatically.

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: 18 }
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```

Push to `main`, Actions builds, `gh-pages` branch updates, site goes live. That's the whole pipeline.

## Why not Next.js or Gatsby?

Because I don't need them. A blog is documents and links. Eleventy outputs HTML and CSS. There's no JavaScript bundle to ship, no hydration to wait for, no framework to update. Pages load instantly.

The right tool for the job is usually the simplest one that works.
