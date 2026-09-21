---
# try also 'default' to start simple
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
#background: /imgs/banner2026.png # https://cover.sli.dev
# some information about your slides (markdown enabled)
layout: cover
title: "Macroscopic Design of Swarms with Collective State Machines"
# info provides ..
info: |
  ## Macroscopic Design of Swarms with Collective State Machines
  Talk for ICCCI 2026 (Springer LNAI).

  Aguzzi, Audrito, Girau, Torta, Casadei — University of Bologna / University of Turin
# apply UnoCSS classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable Comark Syntax: https://comark.dev/syntax/markdown
comark: true
# duration of the presentation
duration: 15min
mdc: true
---

# Macroscopic Design of Swarms<br>with Collective State Machines

<div class="mt-4 text-lg opacity-80">
G. Aguzzi<sup>1</sup>, G. Audrito<sup>2</sup>, R. Girau<sup>1</sup>, G. Torta<sup>2</sup>, <b>R. Casadei</b><sup>1</sup>
</div>
<div class="mt-2 text-sm opacity-60">
<sup>1</sup> <b>University of Bologna, Italy</B> &nbsp;·&nbsp; <sup>2</sup> University of Turin, Italy
</div>

<div class="mt-8 text-sm opacity-50">
ICCCI 2026 — Computational Collective Intelligence
</div>

---
layout: center
---

# Context — macro-programming &amp; FoMaSE project

<!-- This work is carried out within **FoMaSE -- Foundations for Macro-programming-based Software Engineering** -->

<!-- <v-clicks> -->

- Project **FoMaSE -- Foundations for Macro-programming-based Software Engineering**
  - FIS3 Starting Grant (Italian Science Fund) — PI **Roberto Casadei** (UNIBO), **1.1M€**, **2026–2031**
  <!-- - Team: 1 Associate Prof., 4 post-docs, 2 PhDs
  - Investigates the **micro–macro link** in **artificial collective intelligence**: how to engineer collective behaviour at the **macro level**
  - Aims at **principled, predictable software engineering** for autonomous collectives (robot swarms, sensor networks, smart-city services, …)
  -->
  - Investigates **macro-level programming** (i.e. a program **targets an entire collective** of devices)<CiteInSlide id="DBLP:journals/csur/Casadei23" />
    - as a way to build **artificial collective intelligence** 
    - and implications in software engineering / AI
  - **<https://fis3-fomase.github.io>**

<v-click>

- Looking for collaborations!

</v-click>

<!-- </v-clicks> 

<v-click>

<div class="mt-6 p-3 rounded bg-blue-500/10 border border-blue-500/30">
This talk presents <b>cFSM</b>, a FoMaSE contribution towards macro-programming <i>which collective task</i> a swarm is doing — <a href="https://fis3-fomase.github.io/">fis3-fomase.github.io</a>
</div>

</v-click>

-->

---
layout: default
---

# Contribution at a glance

<Quadrants :labels="['BACKGROUND', 'EXAMPLE', 'EXPERIMENTS', 'TAKEAWAYS']">

<template #top-left>

</template>

<template #top-right>

</template>

<template #bottom-left>

</template>

<template #bottom-right>

</template>

</Quadrants>

---
layout: default
---

# Motivation: Macro-programming collectives

<!-- Groups of situated agents (robot swarms, sensor networks) that must **solve problems together**, sensing and acting **locally** only -->

<div class="text-sm leading-tight">

* Positioning: programming language (PL) approaches to artificial collective intelligence (ACI)
* Focus/goal: design and implement collective behaviour *at macro-level*
* Case study: a **swarm** has to
    * stay **idle** at the base
    * when **alarm** event $\to$ **search-and-rescue** 
    * when **attack** event $\to$ **defend** the base (higher priority)

</div>



<div style="height: 250px; display: flex; justify-content: center; overflow: hidden;">
<CaseStudyScene style="height: 100%; width: auto;" />
</div>

<!--

<div class="text-sm">
<v-clicks>

- **Macro-programming** (e.g. *aggregate computing*) lets us program the *collective*, not each individual agent
- Multi-agent behaviour is often modelled with **finite state machines** — but states/transitions describe a *single* agent
- Missing: a principled way to make the **whole swarm** agree on *which collective task* it is doing, right now

</v-clicks>
</div>

<v-click>

<div class="mt-1 p-1 rounded bg-blue-500/10 border border-blue-500/30 text-sm">
💡 <b>Idea</b>: lift FSMs to the collective level — <i>collective finite state machines</i> (cFSM), where <b>states = collective behaviours</b> and the network reaches <b>agreement</b> on state transitions.
</div>

</v-click>

-->

---
layout: default
---

# Background -- Aggregate Computing (AC)

AC is a **functional** macro-programming paradigm composing functions computing **fields** (device $\to$ value)<Cite id="DBLP:journals/computer/BealPV15" />

<div class="visual-box visual-box-wide" style="margin: 0 auto 0.2rem;">
  <AggregateFlow />
</div>

<div class="grid grid-cols-2 gap-6 mt-4">
<div>

Each device runs **sense-compute-interact** rounds:

<v-clicks>

1. **Sense**: read sensors + non-expired msgs from neighbours
2. **Compute**: evaluate the (same) aggregate program
3. **Interact**: send the result to neighbours &amp; act on it

</v-clicks>

</div>
<div>

  <LocalRoundLoop :click="$clicks" />

</div>
</div>


<!--

Rounds are **asynchronous** and unsynchronised -- the language is designed to self-stabilise despite:

- message loss
- device loss
- topology/network changes

-->

<!--
<div class="mt-4 text-sm opacity-70">
Implemented here in <b>ScaFi</b>, a Scala-internal DSL for aggregate/field computing.
</div>
-->

---
layout: default
---

# Background -- Event structures

The execution of an aggregate system can be modelled, in general, as an **augmented event structure**:<Cite id="Audrito2024fgcs-processes" />

$$
\mathbf{E} = \langle E, \leadsto, d, s \rangle
$$

<div class="text-sm opacity-80 -mt-1">

$E$: events (sense-compute-interact rounds) &nbsp;·&nbsp; $\leadsto$: messaging relation &nbsp;·&nbsp; $d$: event $\to$ device &nbsp;·&nbsp; $s$: event $\to$ sensor status

</div>

- transitive closure of $\leadsto$ gives a **causality** partial order $<$
- each event has a finite **causal past** and (dynamically) a finite **causal future**

<EventStructure class="mt-2" />

<div class="text-xs text-center opacity-60 -mt-1">nodes = events of each device over time · edges = the messaging relation ⤳</div>

---
layout: default
---

# Collective Finite State Machines (cFSM)

A cFSM is a tuple $\mathcal{M} = (Pr, S, (pr^\star, s^\star), P)$:

<v-clicks>

- $Pr$: totally ordered **priorities**
- $S$: totally ordered set of **collective states** (e.g. `Wander`, `Solve`, …)
- $(pr^\star, s^\star)$: the **initial** prioritised state
- $P : S \to \mathbf{P}$: each state runs a **collective program**
    - on every event, the program produces a new *prioritised state* $(pr', s') \in Pr \times S$

</v-clicks>

<v-click>

<div class="mt-6 p-3 rounded bg-blue-500/10 border border-blue-500/30">
Unlike a classic FSM: the whole network must <b>collectively decide</b> which proposed transition wins — this is what priorities are for.
</div>

</v-click>

---
layout: default
---

# Reaching agreement — Histories

A single "current state" per device isn't enough to guarantee convergence: we compare whole **histories**.

- **History**: sequence of prioritised states starting at $(pr^\star,s^\star)$, with no immediate repeats (except possibly a final self-loop, to remember "stay here")

$$h = [(pr_1,s_1), \dots, (pr_N, s_N)]$$

- **Extending** a history with a new proposal $(pr_{new}, s_{new})$: append it — unless the history already ends in a self-loop, in which case that trailing entry is *replaced*

<div class="mt-4 text-sm opacity-70">
⇒ self-loops don't make histories grow — length only grows with <i>actual</i> state changes.
</div>

---
layout: default
---

# Reaching agreement — Ordering & execution

Histories are compared **lexicographically**, by (priority, state) pairs: $h <_H h'$.

At every event $\epsilon$, a device computes:

<v-clicks>

- **input history** = the **maximum** history among its neighbours' latest outputs
- **active state** = last state of the input history
- **output history** = input history **extended** with $P(\text{active state})$'s proposal

</v-clicks>

<v-click>

<div class="mt-6 p-3 rounded bg-green-500/10 border border-green-500/30">
✅ Always propagating the <b>max</b> history means: the highest-priority transition anyone proposes eventually reaches — and is adopted by — the whole network. This is the core convergence mechanism.
</div>

</v-click>

---
layout: default
---

# Keeping it practical — Compacted histories

Unbounded histories don't scale. Old, already-agreed-upon entries can be safely **forgotten**.

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

A **compacted history** keeps only:

- the $N_K$ most recent prioritised states (+ timestamps)
- a count $N_F$ of how many were forgotten

Comparison pads the forgotten prefix with **wildcards** `(?,?,?)` — sequences with an incompatible, *older*, prefix are discarded.

</div>
<div>

- forgetting threshold $\Delta T$; always keep ≥ 2 entries (to still detect self-loops)
- if $\Delta T$ ≥ network reachability time → **same outcome** as with full histories

</div>
</div>

<div class="mt-4 text-sm opacity-70">
⇒ bounded memory, same guarantees — validated experimentally next.
</div>

---
layout: default
---

# Case study — Search & rescue swarm

A swarm of drones patrols a base, searching for a target when an alarm is raised, and defending the base if attacked.

<div class="grid grid-cols-2 gap-4 items-center">
<div>

- 4 collective states: `Wait`, `Wander`, `Solve`, `Defend`
- standard transitions: priority $-t$ &nbsp;(favour **earlier** proposals)
- attack → `Defend`: priority $\infty$ &nbsp;(**preempts** any other task, from any state)

</div>
<CfsmDiagram />
</div>

---
layout: default
---

# Case study — ScaFi implementation

The `cfsm` combinator gives a reusable FSM-like structure: state ↦ (movement logic, transition rule). Built on **ScaFi**<CiteInSlide id="DBLP:journals/softx/CasadeiVAP22" /> and **MacroSwarm**<CiteInSlide id="DBLP:journals/lmcs/AguzziCV25" />.

```scala {2-8|10-15}
protected def movementLogic(): Point3D = {
  val basePos = getBasePosition()
  val result = cfsm[MovementState](Wait()) {
    case Wait()   => handleWait(basePos)
    case Wander() => handleWander()
    case Defend() => handleDefend(basePos)
    case Solve()  => handleSolve()
  } // --- transition handlers ---
  updateStats(result.state)
  result.velocity
}

private def handleDefend(base: Point3D): Next[MovementState] =
  if (baseDefended) { Wait() } // transition, default priority -t
  else { Defend().updateVelocity(goto(base)) } // self-loop
```

<div class="text-sm opacity-70 mt-1">Drone movement (via <b>MacroSwarm</b>) and target detection (via <b>gradients</b>) plug into the same collective program.</div>

---
layout: default
---

# Case study — swarm snapshots

<div class="grid grid-cols-4 gap-3 mt-4">
<div class="text-center"><img src="/imgs/plots/waiting.png" class="rounded" /><div class="text-sm mt-1">🔴 <b>Wait</b> (base)</div></div>
<div class="text-center"><img src="/imgs/plots/wandering.png" class="rounded" /><div class="text-sm mt-1">🟠 <b>Wander</b> (search)</div></div>
<div class="text-center"><img src="/imgs/plots/solving.png" class="rounded" /><div class="text-sm mt-1">🟢 <b>Solve</b> (rescue target)</div></div>
<div class="text-center"><img src="/imgs/plots/defending.png" class="rounded" /><div class="text-sm mt-1">🟩 <b>Defend</b> (protect base)</div></div>
</div>

<div class="mt-6 text-sm opacity-70">
Simulated in <b>Alchemist</b> with <b>ScaFi</b> + <b>MacroSwarm</b>: 40–160 drones, 500×500 m area, 100 m sensing range.
</div>

---
layout: default
---

# Evaluation setup

**Goals**: (i) *correctness* — does the swarm converge to the right state? (ii) *resilience* — under asynchrony & conflicting proposals? (iii) *practical history-independence* — bounded memory?

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

**Metrics** (tracked over time):
- **state occupancy**: fraction of agents per state
- **disagreement rate**: ≥1 agent off the majority state
- **history size**: avg. kept entries $N_K$

</div>
<div>

**Varied parameters** (128 runs × 4000s each):
- swarm size $N \in \{40, 160\}$
- comm. radius $R \in \{75, 100\}$ m
- history window $H \in \{1200s, \infty\}$
- round-frequency variability $k \in \{4,7,10\}$

</div>
</div>

<div class="mt-4 text-sm opacity-70">3 alarms (t=1100,2300,3500s) + 1 base attack (t=2400s, deliberately overlapping the 2nd mission) to stress-test priority-based conflict resolution.</div>

---
layout: default
---

# Results — correctness & resilience

<div class="text-center">
<img src="/imgs/plots/legend_only_by_history_conn0.2_var10.png" class="mx-auto" style="height:1.3em" />
<img src="/imgs/plots/states_plus_disagreement_plus_historysize_by_history_conn0.2_var10.png" class="mx-auto" style="height:270px" />
</div>

<div class="grid grid-cols-2 gap-3 mt-1 text-xs leading-snug">
<div>

- ✅ swarm cleanly flips `Wait→Wander→Solve→Wait` per alarm — occupancy jumps to **1.0** (full consensus)
- ⚔️ the concurrent attack at t=2400s correctly **preempts** `Wander`/`Solve` in favour of `Defend` (priority $\infty$)

</div>
<div>

- 📉 disagreement spikes only **transiently** during transitions, then returns to 0
- 💾 history size **stabilises** (bounded) rather than growing — practical history-independence confirmed

</div>
</div>

---
layout: default
---

# Results — robustness to variability & scale

<img src="/imgs/plots/states_comparison_conn0.2_by_variability_drones40.png" class="mx-auto" style="height:260px" />

<div class="grid grid-cols-2 gap-3 mt-1 text-xs leading-snug">
<div>

- 🔀 curves for $k=4$ (async) nearly **overlap** $k=10$ (near-sync): convergence is largely insensitive to timing variability
- 📶 lower connectivity (R=75m, prev. slide) only widens the **transient**, doesn't break correctness

</div>
<div>

- 📈 same holds at 160 drones (not shown), with slightly **faster** convergence — target found sooner in a denser swarm
- ⇒ the cFSM mechanism scales without extra tuning

</div>
</div>

---
layout: default
---

# Conclusion

<v-clicks>

- **cFSM**: a collective FSM meta-model — collective states + priority-based agreement on transitions
- formalised over **augmented event structures**, implemented as a reusable layer on **ScaFi** aggregate programs
- swarm case study: **correct**, **resilient** to asynchrony/conflicts, and **history-independent** in practice (bounded memory)

</v-clicks>

<v-click>

### Future work
- **parametric** states (carrying data, not just labels)
- a catalogue of **priority-assignment patterns** (leader-based, timestamp-based, context/consensus-based)
- integrating the **concurrency** dimension via aggregate processes

</v-click>


---
layout: center
class: text-center
---



# Thank you!

<div class="mt-4 text-sm opacity-70">
Code, data & analysis scripts:<br>
<a href="https://github.com/cric96/experiments-2025-collective-state-machines">github.com/cric96/experiments-2025-collective-state-machines</a>
</div>

<div class="mt-4 text-sm opacity-70">
Supported by the Italian Science Fund (FIS3) project <b>FoMaSE (Foundations for Macro-programming-based Software Engineering)</b> -- <a href="https://fis3-fomase.github.io/">fis3-fomase.github.io</a>
</div>

<div class="mt-8 opacity-50 text-sm">Questions?</div>


---
layout: default
---

# References

<Bibliography />
