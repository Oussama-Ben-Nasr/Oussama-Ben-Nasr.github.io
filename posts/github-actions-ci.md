---
layout: layouts/post.njk
title: Why I switched to GitHub Actions for CI
description: Breaking down what changed in my workflow after moving from manual deploys to automated pipelines.
date: 2022-10-08
tags:
  - post
  - Tooling
---

For a long time, my deploy workflow was: run `npm run build`, check the output, `git push`, done. This works until it doesn't — a broken build slips through, or you forget to build before pushing, or a collaborator pushes from a different machine and produces different output.

GitHub Actions fixed all of this by moving build logic into the repository itself.

## What CI actually solves

CI (Continuous Integration) isn't about automating deploys. It's about making the build and test process a shared, reproducible contract that lives alongside your code — not in your head.

<figure>
<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg" font-family="DM Sans, sans-serif">
  <!-- Without CI -->
  <text x="20" y="25" font-size="11" font-weight="500" fill="#6b6b65">WITHOUT CI</text>
  <g transform="translate(20, 38)">
    <rect x="0" y="0" width="80" height="36" rx="4" fill="#f3f1ec" stroke="#ddd" stroke-width="1.5"/>
    <text x="40" y="22" text-anchor="middle" font-size="10" fill="#1a1a18">git push</text>
    <path d="M84 18 L104 18" stroke="#ddd" stroke-width="1.5" stroke-dasharray="4,2"/>
    <rect x="108" y="0" width="80" height="36" rx="4" fill="#f3f1ec" stroke="#ddd" stroke-width="1.5"/>
    <text x="148" y="15" text-anchor="middle" font-size="9" fill="#6b6b65">build locally</text>
    <text x="148" y="30" text-anchor="middle" font-size="9" fill="#6b6b65">(maybe)</text>
    <path d="M192 18 L212 18" stroke="#ddd" stroke-width="1.5" stroke-dasharray="4,2"/>
    <rect x="216" y="0" width="80" height="36" rx="4" fill="#f3f1ec" stroke="#ddd" stroke-width="1.5"/>
    <text x="256" y="15" text-anchor="middle" font-size="9" fill="#6b6b65">copy to server</text>
    <text x="256" y="30" text-anchor="middle" font-size="9" fill="#6b6b65">(manually)</text>
    <rect x="320" y="0" width="80" height="36" rx="4" fill="#fff0ef" stroke="#e57373" stroke-width="1.5"/>
    <text x="360" y="15" text-anchor="middle" font-size="9" fill="#c62828">💥 broken</text>
    <text x="360" y="29" text-anchor="middle" font-size="9" fill="#c62828">in prod</text>
  </g>

  <!-- With CI -->
  <text x="20" y="115" font-size="11" font-weight="500" fill="#c8593a">WITH GITHUB ACTIONS</text>
  <g transform="translate(20, 128)">
    <rect x="0" y="0" width="80" height="36" rx="4" fill="#f5ede9" stroke="#c8593a" stroke-width="1.5"/>
    <text x="40" y="22" text-anchor="middle" font-size="10" fill="#c8593a">git push</text>

    <path d="M84 18 L104 18" stroke="#c8593a" stroke-width="1.5"/>
    <rect x="108" y="0" width="80" height="36" rx="4" fill="#f5ede9" stroke="#c8593a" stroke-width="1.5"/>
    <text x="148" y="15" text-anchor="middle" font-size="9" fill="#c8593a">Actions</text>
    <text x="148" y="29" text-anchor="middle" font-size="9" fill="#c8593a">triggers</text>

    <path d="M192 18 L212 18" stroke="#c8593a" stroke-width="1.5"/>
    <rect x="216" y="0" width="80" height="36" rx="4" fill="#f5ede9" stroke="#c8593a" stroke-width="1.5"/>
    <text x="256" y="15" text-anchor="middle" font-size="9" fill="#c8593a">npm ci</text>
    <text x="256" y="29" text-anchor="middle" font-size="9" fill="#c8593a">npm run build</text>

    <path d="M300 18 L320 18" stroke="#c8593a" stroke-width="1.5"/>
    <!-- fork: success and fail -->
    <path d="M320 18 L340 6" stroke="#2e7d5e" stroke-width="1.5"/>
    <path d="M320 18 L340 30" stroke="#e57373" stroke-width="1.5"/>

    <rect x="344" y="0" width="80" height="24" rx="4" fill="#e8f5e9" stroke="#2e7d5e" stroke-width="1.5"/>
    <text x="384" y="16" text-anchor="middle" font-size="9" fill="#2e7d5e">✓ deploy live</text>

    <rect x="344" y="24" width="80" height="24" rx="4" fill="#fff0ef" stroke="#e57373" stroke-width="1.5"/>
    <text x="384" y="40" text-anchor="middle" font-size="9" fill="#c62828">✗ fail + notify</text>
  </g>

  <text x="20" y="215" font-size="10" fill="#6b6b65">The build runs in a clean, reproducible environment every single time. Broken builds never reach production.</text>
</svg>
<figcaption>Manual deploys vs. CI: Actions runs the build in an isolated environment and only promotes on success.</figcaption>
</figure>

## Anatomy of a workflow file

A GitHub Actions workflow lives at `.github/workflows/something.yml`. It defines triggers, jobs, and steps.

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]          # trigger on push to main
  pull_request:
    branches: [main]          # also run on PRs (but don't deploy)

jobs:
  build:
    runs-on: ubuntu-latest    # clean VM each run

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm           # cache node_modules across runs

      - name: Install dependencies
        run: npm ci            # clean install from lockfile

      - name: Build site
        run: npm run build

      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'   # only on main push
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```

## `npm ci` vs `npm install`

Notice I used `npm ci`, not `npm install`. This is intentional. `npm ci` installs exactly what's in `package-lock.json`, fails if there's a mismatch, and never modifies the lockfile. It's made for automated environments.

`npm install` resolves and may update the lockfile — fine on your machine, unpredictable in CI.

## Secrets and tokens

`GITHUB_TOKEN` is automatically available in every Actions run — you don't need to create it. For external services (Netlify tokens, API keys), add them under **Settings → Secrets → Actions** and reference them as `${{ secrets.MY_SECRET }}`.

## The payoff

After setting this up, I stopped thinking about deploys. Push to main, green check appears, site updates. Push a broken change, red X, email notification, site untouched.

That's the point. CI makes the state of your site a function of your code — not your memory.
