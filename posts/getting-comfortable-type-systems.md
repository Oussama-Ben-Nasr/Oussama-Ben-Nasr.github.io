---
layout: layouts/post.njk
title: Getting comfortable with type systems
description: Lessons learned moving from dynamically typed to statically typed languages.
date: 2022-08-12
tags:
  - post
  - Scala
---

I wrote JavaScript for years. I liked it. The feedback loop was tight — write a function, run it, see what happens. Then I tried Scala, and the compiler started arguing with me before I could even run anything.

My first reaction was frustration. My second reaction, a few weeks later, was that I never wanted to go back.

## What a type system is actually doing

A type is a claim about a value. `String` means "this is always text." `Int` means "this is always an integer." The type system verifies those claims at compile time, before a single line of code runs.

<figure>
<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg" font-family="DM Sans, sans-serif">
  <!-- Dynamic lane -->
  <rect x="10" y="10" width="310" height="200" rx="6" fill="#f3f1ec" stroke="#ddd" stroke-width="1.5"/>
  <text x="165" y="35" text-anchor="middle" font-size="11" font-weight="500" fill="#6b6b65">DYNAMIC (JavaScript)</text>

  <rect x="30" y="50" width="270" height="38" rx="4" fill="#fff" stroke="#ddd" stroke-width="1"/>
  <text x="44" y="67" font-size="10" fill="#4a90d9" font-family="Courier New">function</text>
  <text x="100" y="67" font-size="10" fill="#1a1a18" font-family="Courier New"> add(a, b) {</text>
  <text x="44" y="82" font-size="10" fill="#1a1a18" font-family="Courier New">  return a + b;</text>
  <text x="44" y="95" font-size="10" fill="#1a1a18" font-family="Courier New">}</text>

  <rect x="30" y="102" width="270" height="28" rx="4" fill="#fff0ef" stroke="#e57373" stroke-width="1"/>
  <text x="44" y="120" font-size="10" fill="#c62828" font-family="Courier New">add(2, "3")  // "23" 😱</text>

  <rect x="30" y="140" width="270" height="50" rx="4" fill="#fff0ef" stroke="#e57373" stroke-width="1"/>
  <text x="165" y="158" text-anchor="middle" font-size="10" fill="#c62828">Bug discovered at RUNTIME</text>
  <text x="165" y="176" text-anchor="middle" font-size="10" fill="#c62828">(maybe in production)</text>

  <!-- Static lane -->
  <rect x="360" y="10" width="310" height="200" rx="6" fill="#f5ede9" stroke="#c8593a" stroke-width="1.5"/>
  <text x="515" y="35" text-anchor="middle" font-size="11" font-weight="500" fill="#c8593a">STATIC (Scala)</text>

  <rect x="380" y="50" width="270" height="38" rx="4" fill="#fff" stroke="#c8593a" stroke-width="1"/>
  <text x="394" y="67" font-size="10" fill="#4a90d9" font-family="Courier New">def</text>
  <text x="416" y="67" font-size="10" fill="#1a1a18" font-family="Courier New"> add(a: Int, b: Int): Int =</text>
  <text x="394" y="82" font-size="10" fill="#1a1a18" font-family="Courier New">  a + b</text>

  <rect x="380" y="102" width="270" height="28" rx="4" fill="#fff0ef" stroke="#e57373" stroke-width="1"/>
  <text x="394" y="120" font-size="10" fill="#c62828" font-family="Courier New">add(2, "3")  // ← won't compile</text>

  <rect x="380" y="140" width="270" height="50" rx="4" fill="#e8f5e9" stroke="#2e7d5e" stroke-width="1"/>
  <text x="515" y="158" text-anchor="middle" font-size="10" fill="#2e7d5e">Bug caught at COMPILE TIME</text>
  <text x="515" y="176" text-anchor="middle" font-size="10" fill="#2e7d5e">Before code ever runs</text>
</svg>
<figcaption>Dynamic types defer checking to runtime. Static types catch mismatches before the program runs.</figcaption>
</figure>

## The shift in mindset

In JavaScript, you think about what values *will* be at runtime. In Scala, you think about what values *can* be — the set of valid inputs and outputs a function promises to handle.

This changes how you design code. Instead of "I'll check if it's null," you start thinking "let me encode the possibility of absence in the type itself."

```scala
// JavaScript approach: hope for the best
function getUser(id) {
  return db.find(id); // might be null, might be undefined, might crash
}

// Scala approach: encode the possibility
def getUser(id: Int): Option[User] =
  db.find(id) // Option[User]: Some(user) or None — no surprises
```

`Option[User]` forces every caller to handle both cases. You can't call `.name` on an `Option[User]` — the compiler won't let you. You must pattern match or use `map`/`getOrElse` to unwrap it.

## Algebraic Data Types: model your domain precisely

This is where static typing becomes genuinely powerful. You can define types that represent exactly the states your domain has — no more, no less.

```scala
// A payment can only be in one of these states
sealed trait PaymentStatus
case object Pending extends PaymentStatus
case class Completed(transactionId: String) extends PaymentStatus
case class Failed(reason: String) extends PaymentStatus
case class Refunded(amount: Double) extends PaymentStatus
```

Now when you pattern match, the compiler checks exhaustiveness:

```scala
def describe(status: PaymentStatus): String = status match {
  case Pending              => "Awaiting confirmation"
  case Completed(txId)     => s"Confirmed: $txId"
  case Failed(reason)      => s"Failed: $reason"
  case Refunded(amount)    => s"Refunded $amount"
  // Forgot a case? Compiler warns you.
}
```

<figure>
<svg viewBox="0 0 680 180" xmlns="http://www.w3.org/2000/svg" font-family="DM Sans, sans-serif">
  <!-- Root -->
  <rect x="270" y="10" width="140" height="34" rx="4" fill="#1a1a18"/>
  <text x="340" y="31" text-anchor="middle" font-size="11" fill="white" font-weight="500">PaymentStatus</text>

  <!-- Lines -->
  <line x1="340" y1="44" x2="340" y2="65" stroke="#ddd" stroke-width="1.5"/>
  <line x1="80" y1="65" x2="600" y2="65" stroke="#ddd" stroke-width="1.5"/>
  <line x1="80" y1="65" x2="80" y2="86" stroke="#ddd" stroke-width="1.5"/>
  <line x1="240" y1="65" x2="240" y2="86" stroke="#ddd" stroke-width="1.5"/>
  <line x1="440" y1="65" x2="440" y2="86" stroke="#ddd" stroke-width="1.5"/>
  <line x1="600" y1="65" x2="600" y2="86" stroke="#ddd" stroke-width="1.5"/>

  <!-- Leaves -->
  <rect x="20" y="86" width="120" height="34" rx="4" fill="#f3f1ec" stroke="#ddd" stroke-width="1.5"/>
  <text x="80" y="107" text-anchor="middle" font-size="10" fill="#1a1a18">Pending</text>

  <rect x="170" y="86" width="140" height="34" rx="4" fill="#e8f5e9" stroke="#2e7d5e" stroke-width="1.5"/>
  <text x="240" y="107" text-anchor="middle" font-size="10" fill="#2e7d5e">Completed(txId)</text>

  <rect x="370" y="86" width="140" height="34" rx="4" fill="#fff0ef" stroke="#e57373" stroke-width="1.5"/>
  <text x="440" y="107" text-anchor="middle" font-size="10" fill="#c62828">Failed(reason)</text>

  <rect x="540" y="86" width="120" height="34" rx="4" fill="#f5ede9" stroke="#c8593a" stroke-width="1.5"/>
  <text x="600" y="107" text-anchor="middle" font-size="10" fill="#c8593a">Refunded(amt)</text>

  <text x="340" y="158" text-anchor="middle" font-size="10" fill="#6b6b65">sealed = no other subtype can exist outside this file. Exhaustive pattern matching is guaranteed.</text>
</svg>
<figcaption>Sealed trait hierarchy: the compiler knows every possible subtype and will warn you if you miss one in a match.</figcaption>
</figure>

## What I miss from dynamic languages

Honesty: the REPL loop is faster. Prototyping a quick transformation in JavaScript is quicker than setting up types first.

But for anything that lives past a day — anything you'll read again in six months, anything a teammate will touch — the types pay for themselves. They're documentation that the compiler keeps accurate.

## Practical advice for the transition

Start with the happy path. Write the function, let the compiler infer types. Then look at what it inferred and ask whether it captures your intent. Gradually add type annotations where they clarify rather than clutter.

Don't fight the compiler. When it tells you `Option[User]` can't be used as `User`, it's not being pedantic — it's found a potential null pointer exception before it could bite you.
