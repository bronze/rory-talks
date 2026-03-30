# Stories Indexing Plan

Stories are collected in `src/content/stories/`. Each file covers one recurring anecdote or example,
with an `appearances` array listing every talk it appears in (video ID + timecode in seconds).

The `/stories` page renders the full index, sorted by number of appearances.

---

## How to index a talk

Spawn a dedicated agent with this prompt:

> Read the transcript at `src/content/transcripts/{VIDEO_ID}.md` in full.
> Also read `src/content/videos/{VIDEO_ID}.md` to get chapter timestamps if available in the description.
>
> Your task: identify every named anecdote, example, or recurring story Rory uses in this talk.
> For each one:
> 1. Give it a short slug (kebab-case, e.g. `doorman-fallacy`)
> 2. Note the approximate timecode in seconds
> 3. Write a 2–3 sentence description (what the story is, what point it illustrates)
>
> Then check `src/content/stories/` for existing story files. If a story already exists there,
> add a new entry to its `appearances` array. If it's new, create a new file following this format:
>
> ```
> ---
> title: "Story Title"
> description: "2–3 sentence description."
> appearances:
>   - video: "VIDEO_ID"
>     timecode: 290
> ---
> ```
>
> Do not modify any other files. Do not touch video or transcript files.
> Run `npm run build` at the end to confirm no errors.

Run agents in batches of 3–4 talks. Wait for each batch to complete before starting the next,
so story file conflicts (two agents editing the same file) don't occur.

---

## Talk index

Check off each talk once its stories have been indexed.

| Done | ID | Title |
|------|----|-------|
| ✅ | md9UAorQ_B0 | The 1776 Lecture: Rory Sutherland on The American Revolution, Adam Smith and Self-Checkouts |
| ⬜ | CgY7k2QkERo | Why You Keep Falling for Ads — Explained by Rory Sutherland |
| ⬜ | Gi673RdyPEw | Rory Sutherland – How human behaviour regularly defies logic and supporting data |
| ✅ | dkLcwHmnPV4 | Rory Sutherland: Sweat the small stuff |
| ✅ | iueVZJVEmEs | Rory Sutherland: Perspective is everything |
| ✅ | 4VuYiEbGQ9Q | The Lost Genius of Irrationality: Rory Sutherland at TEDxOxford |
| ⬜ | hhQRH49Y54k | The psychology of digital marketing |
| ✅ | UirCaM5kg9E | RORY SUTHERLAND'S 10 RULES OF ALCHEMY |
| ✅ | SG-iLV_NJL8 | Rory Sutherland on the Magic of Original Thinking |
| ✅ | Hz3RWxJck68 | The Marketing Secrets Apple & Tesla Always Use |
| ⬜ | DaYTvwe0Wo0 | How Your Brain Gets Tricked By Clever Marketing |
| ⬜ | wqb0f4vmkis | Rory Sutherland: The Psychology of Selling |
| ⬜ | YErOtGMgTNg | What most people miss about marketing |
| ⬜ | 5TvbJzJ4Vs0 | Rory Sutherland - Why Business Is A Casino |
| ⬜ | qvpw4_O25eU | Dirty Little Marketing Secrets That Always Work |
| ⬜ | kiMIEv2BaXs | Scott Galloway vs Rory Sutherland - is the era of brand over? |
| ⬜ | UbJkENiAhyc | Rory Sutherland: Why Logic Is Killing Your Business |
| ⬜ | B8F2f7Yu42E | Brand New: The Best Rory Sutherland Interview You'll Ever Watch |
| ⬜ | lhlS-Wds02M | Rory Sutherland - Alchemy: The Surprising Power of Ideas That Don't Make Sense |
| ⬜ | J6XgR6WsqV4 | The Hidden Risks of Staying in the Wrong Job |
| ⬜ | QBznUHAopxU | Marketing Expert: The Playbook Behind Every Great Campaign |
| ⬜ | xXd-g3EL8ow | 'An appalling way to store money': Rory Sutherland on pensions and property |
| ⬜ | HbNIeLngS6Q | Rory Sutherland: Why Cost Reduction Isn't A Strategy |
| ⬜ | 45JAIkQI8AY | This tiny change made $10 Million |
| ⬜ | sOcIh6sGNhw | Rory Sutherland \| Key Customer Insights for 2026 |
| ⬜ | PfQRHM6rL-M | Rory Sutherland: Why Marketing Is the Weather, Not the Spreadsheet |

---

## Suggested batches

Run these in order. Each batch is 3–4 talks. Complete and commit before starting the next.

**Batch 1** — shorter/well-known talks (lower token cost)
- dkLcwHmnPV4 — Sweat the small stuff
- iueVZJVEmEs — Perspective is everything
- 4VuYiEbGQ9Q — TEDxOxford

**Batch 2**
- UirCaM5kg9E — 10 Rules of Alchemy
- SG-iLV_NJL8 — Magic of Original Thinking
- Hz3RWxJck68 — Marketing Secrets Apple & Tesla Always Use

**Batch 3**
- DaYTvwe0Wo0 — How Your Brain Gets Tricked
- wqb0f4vmkis — Psychology of Selling
- YErOtGMgTNg — What most people miss about marketing

**Batch 4**
- 5TvbJzJ4Vs0 — Why Business Is A Casino
- qvpw4_O25eU — Dirty Little Marketing Secrets
- kiMIEv2BaXs — Scott Galloway vs Rory Sutherland

**Batch 5**
- UbJkENiAhyc — Why Logic Is Killing Your Business
- B8F2f7Yu42E — Brand New
- lhlS-Wds02M — Alchemy lecture

**Batch 6**
- J6XgR6WsqV4 — Hidden Risks of Staying in the Wrong Job
- QBznUHAopxU — Playbook Behind Every Great Campaign
- xXd-g3EL8ow — Pensions and property

**Batch 7**
- HbNIeLngS6Q — Why Cost Reduction Isn't A Strategy
- 45JAIkQI8AY — This tiny change made $10 Million
- sOcIh6sGNhw — Key Customer Insights for 2026

**Batch 8**
- PfQRHM6rL-M — Why Marketing Is the Weather
- Gi673RdyPEw — How human behaviour regularly defies logic
- CgY7k2QkERo — Why You Keep Falling for Ads
- hhQRH49Y54k — Psychology of digital marketing
