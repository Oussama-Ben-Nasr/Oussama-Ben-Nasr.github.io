---
layout: layouts/post.njk
title: Learning Scala through Advent of Code
description: How solving daily puzzles accelerated my functional programming intuition in ways no tutorial could.
date: 2022-12-10
tags:
  - post
  - Scala
---

Every December, thousands of developers open their laptops at midnight to race through algorithmic puzzles. I did Advent of Code 2022 in Scala — a language I'd been circling for months but never committed to. It turned out to be the fastest way to learn I've ever tried.

## Why puzzles teach better than tutorials

Tutorials show you the happy path. Puzzles put you in a corner and make you find a way out. When day 5 of AoC hands you a stack-rearrangement problem, you don't have the luxury of skipping the "collections" chapter. You need `List`, `Stack`, `foldLeft`, and you need them *now*.

<figure>
<svg viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg" font-family="DM Sans, sans-serif">
  <!-- Tutorial path -->
  <rect x="20" y="20" width="140" height="200" rx="6" fill="#f3f1ec" stroke="#ddd" stroke-width="1.5"/>
  <text x="90" y="45" text-anchor="middle" font-size="11" font-weight="500" fill="#6b6b65">TUTORIAL</text>
  <rect x="35" y="58" width="110" height="24" rx="3" fill="#e8e0d8"/>
  <text x="90" y="74" text-anchor="middle" font-size="10" fill="#6b6b65">Chapter 1: Syntax</text>
  <rect x="35" y="88" width="110" height="24" rx="3" fill="#e8e0d8"/>
  <text x="90" y="104" text-anchor="middle" font-size="10" fill="#6b6b65">Chapter 2: Types</text>
  <rect x="35" y="118" width="110" height="24" rx="3" fill="#e8e0d8"/>
  <text x="90" y="134" text-anchor="middle" font-size="10" fill="#6b6b65">Chapter 3: Collections</text>
  <rect x="35" y="148" width="110" height="24" rx="3" fill="#e8e0d8"/>
  <text x="90" y="164" text-anchor="middle" font-size="10" fill="#6b6b65">Chapter 4: FP</text>
  <rect x="35" y="178" width="110" height="24" rx="3" fill="#ddd" stroke-dasharray="4,2" stroke-width="1"/>
  <text x="90" y="194" text-anchor="middle" font-size="10" fill="#aaa">Chapter 5: ...</text>

  <!-- Arrow -->
  <text x="185" y="125" font-size="28" fill="#c8593a">→</text>

  <!-- Puzzle path -->
  <rect x="220" y="20" width="440" height="220" rx="6" fill="#fff" stroke="#c8593a" stroke-width="1.5"/>
  <text x="440" y="45" text-anchor="middle" font-size="11" font-weight="500" fill="#c8593a">ADVENT OF CODE — DAY 5</text>

  <!-- Puzzle stacks -->
  <g transform="translate(240, 65)">
    <text font-size="10" fill="#6b6b65" font-weight="500">Input stacks:</text>
    <!-- Stack 1 -->
    <rect x="0" y="20" width="36" height="20" rx="2" fill="#c8593a"/>
    <text x="18" y="34" text-anchor="middle" font-size="11" fill="white" font-weight="500">N</text>
    <rect x="0" y="42" width="36" height="20" rx="2" fill="#c8593a" opacity=".8"/>
    <text x="18" y="56" text-anchor="middle" font-size="11" fill="white" font-weight="500">Z</text>
    <rect x="0" y="64" width="36" height="20" rx="2" fill="#c8593a" opacity=".6"/>
    <text x="18" y="78" text-anchor="middle" font-size="11" fill="white" font-weight="500">P</text>
    <!-- Stack 2 -->
    <rect x="46" y="20" width="36" height="20" rx="2" fill="#4a90d9"/>
    <text x="64" y="34" text-anchor="middle" font-size="11" fill="white" font-weight="500">D</text>
    <rect x="46" y="42" width="36" height="20" rx="2" fill="#4a90d9" opacity=".8"/>
    <text x="64" y="56" text-anchor="middle" font-size="11" fill="white" font-weight="500">C</text>
    <!-- Stack 3 -->
    <rect x="92" y="20" width="36" height="20" rx="2" fill="#2e7d5e"/>
    <text x="110" y="34" text-anchor="middle" font-size="11" fill="white" font-weight="500">M</text>
    <!-- Labels -->
    <text x="18" y="102" text-anchor="middle" font-size="9" fill="#aaa">1</text>
    <text x="64" y="102" text-anchor="middle" font-size="9" fill="#aaa">2</text>
    <text x="110" y="102" text-anchor="middle" font-size="9" fill="#aaa">3</text>
  </g>

  <!-- Code snippet -->
  <rect x="375" y="60" width="265" height="155" rx="4" fill="#1a1a18"/>
  <text x="390" y="82" font-size="10" fill="#6b9e6b" font-family="Courier New">// You need this RIGHT NOW</text>
  <text x="390" y="100" font-size="10" fill="#e8947a" font-family="Courier New">val</text>
  <text x="415" y="100" font-size="10" fill="#e8e8e2" font-family="Courier New"> stacks = input</text>
  <text x="390" y="118" font-size="10" fill="#e8e8e2" font-family="Courier New">  .foldLeft(Map.empty) {</text>
  <text x="390" y="136" font-size="10" fill="#e8e8e2" font-family="Courier New">    (acc, move) =&gt;</text>
  <text x="390" y="154" font-size="10" fill="#e8e8e2" font-family="Courier New">      acc.updated(</text>
  <text x="390" y="172" font-size="10" fill="#e8e8e2" font-family="Courier New">        move.to,</text>
  <text x="390" y="190" font-size="10" fill="#4a90d9" font-family="Courier New">        crates ::: rest)</text>
  <text x="390" y="207" font-size="10" fill="#e8e8e2" font-family="Courier New">  }</text>
</svg>
<figcaption>Tutorial: linear chapters you can skip. AoC: you need everything at once, right now.</figcaption>
</figure>

## The FP concepts that finally clicked

### Pattern matching is not just a switch statement

Coming from JavaScript, I thought pattern matching was syntactic sugar for `switch`. Scala showed me how wrong I was. You can match on case classes, destructure nested structures, and guard with conditions — all in one expression that the compiler checks exhaustively.

```scala
sealed trait Move
case class Push(from: Int, to: Int, count: Int) extends Move
case class Pop(stack: Int) extends Move

def apply(stacks: Map[Int, List[Char]], move: Move): Map[Int, List[Char]] =
  move match {
    case Push(from, to, n) =>
      val (moving, rest) = stacks(from).splitAt(n)
      stacks
        .updated(from, rest)
        .updated(to, moving.reverse ::: stacks(to))
    case Pop(stack) =>
      stacks.updated(stack, stacks(stack).tail)
  }
```

The compiler will warn you if you add a new `Move` subtype and forget to handle it. No runtime surprises.

### `foldLeft` as a loop replacement

Before AoC, I used `foldLeft` when I thought it was "the Scala thing to do." After solving fifteen puzzles with it, I understood it intuitively — it's a loop that builds up a value without mutation.

<figure>
<svg viewBox="0 0 680 160" xmlns="http://www.w3.org/2000/svg" font-family="DM Sans, sans-serif">
  <text x="20" y="30" font-size="12" font-weight="500" fill="#1a1a18">List(1, 2, 3, 4).foldLeft(0)(_ + _)</text>
  <!-- Steps -->
  <g transform="translate(20, 50)">
    <!-- acc=0 -->
    <rect x="0" y="0" width="70" height="36" rx="4" fill="#f3f1ec" stroke="#ddd" stroke-width="1"/>
    <text x="35" y="14" text-anchor="middle" font-size="9" fill="#6b6b65">acc</text>
    <text x="35" y="30" text-anchor="middle" font-size="14" font-weight="500" fill="#1a1a18">0</text>

    <text x="85" y="22" font-size="12" fill="#c8593a">+1</text>
    <line x1="80" y1="18" x2="105" y2="18" stroke="#c8593a" stroke-width="1.5" marker-end="url(#arr)"/>

    <rect x="110" y="0" width="70" height="36" rx="4" fill="#f5ede9" stroke="#c8593a" stroke-width="1"/>
    <text x="145" y="14" text-anchor="middle" font-size="9" fill="#c8593a">acc</text>
    <text x="145" y="30" text-anchor="middle" font-size="14" font-weight="500" fill="#c8593a">1</text>

    <text x="195" y="22" font-size="12" fill="#c8593a">+2</text>
    <line x1="190" y1="18" x2="215" y2="18" stroke="#c8593a" stroke-width="1.5"/>

    <rect x="220" y="0" width="70" height="36" rx="4" fill="#f5ede9" stroke="#c8593a" stroke-width="1"/>
    <text x="255" y="14" text-anchor="middle" font-size="9" fill="#c8593a">acc</text>
    <text x="255" y="30" text-anchor="middle" font-size="14" font-weight="500" fill="#c8593a">3</text>

    <text x="305" y="22" font-size="12" fill="#c8593a">+3</text>
    <line x1="300" y1="18" x2="325" y2="18" stroke="#c8593a" stroke-width="1.5"/>

    <rect x="330" y="0" width="70" height="36" rx="4" fill="#f5ede9" stroke="#c8593a" stroke-width="1"/>
    <text x="365" y="14" text-anchor="middle" font-size="9" fill="#c8593a">acc</text>
    <text x="365" y="30" text-anchor="middle" font-size="14" font-weight="500" fill="#c8593a">6</text>

    <text x="415" y="22" font-size="12" fill="#c8593a">+4</text>
    <line x1="410" y1="18" x2="435" y2="18" stroke="#c8593a" stroke-width="1.5"/>

    <rect x="440" y="0" width="80" height="36" rx="4" fill="#1a1a18" stroke="#1a1a18" stroke-width="1"/>
    <text x="480" y="14" text-anchor="middle" font-size="9" fill="#e8947a">result</text>
    <text x="480" y="30" text-anchor="middle" font-size="14" font-weight="500" fill="white">10</text>
  </g>

  <text x="20" y="130" font-size="11" fill="#6b6b65">No mutation. No index variable. No off-by-one errors. Just a value accumulating through transformations.</text>
</svg>
<figcaption>foldLeft visualised: each element transforms the accumulator, producing a new value at every step.</figcaption>
</figure>

## What I shipped by day 25

By the end of the month I had written parsers using `split` and regex combinators, graph traversal with `BFS` implemented in pure Scala, dynamic programming with memoization using `Map` as a cache, and coordinate systems using `case class Point(x: Int, y: Int)` with operator overloading.

None of this came from a tutorial. It came from needing it.

## The key takeaway

If you want to learn a language, find a problem space that forces you to use all of it. AoC is perfect for this because every day is a different domain: strings, graphs, geometry, simulation. You can't stay in your comfort zone.

Start with day 1. Don't look at others' solutions until you've submitted your own. The struggle is the lesson.
