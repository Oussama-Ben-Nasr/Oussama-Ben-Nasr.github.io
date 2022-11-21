---
title: Conway's game of life
description: Specification and implementation of a simple grid simulation.
tags: post
date: 2022-11-21
layout: layouts/post.njk
---

imagine a 2D world composed of cells where each cell can be either alive or dead at any given point in time.

Rules are simple:

1. A living cell with 2 or 3 living neighbouring cells survives.
2. A dead cell with exactly 3 living neighbouring alive cells becomes alive.
3. Any other cell not fulfilling 1. and 2. shall remain or become dead.
