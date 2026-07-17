# Accident Dashboard — Frontend

A React + Vite dashboard for the [accident-api](../accident-api) backend.
Talks to the API only over HTTP — never touches PostgreSQL directly, per
the task's frontend/backend separation requirement.

---

## Setup & run

```bash
# 1. Install dependencies
cd accident-frontend
npm install

# 2. Point it at your backend
cp .env.example .env
# edit .env if your backend isn't on http://localhost:3000

# 3. Make sure the backend is running first (separate terminal)
#    cd ../accident-api && npm start

# 4. Start the dashboard
npm run dev
```

Open **http://localhost:5173**.

For a production build: `npm run build` → static files land in `dist/`
(serve with any static host, or `npm run preview` to check it locally).

---

## Required backend changes

Two small, additive changes to `accident-api` — neither breaks anything that already exists.

### 1. `latest_year` field on `/aggregates/earliest-year`

Needed by the Dashboard's "Data span" KPI. Open
`accident-api/src/routes/aggregates.js` and replace the `/earliest-year`
handler with this version (adds `MAX(year)` alongside the existing
`MIN(year)`):

```js
router.get('/earliest-year', asyncHandler(async (req, res) => {
  if (req.query.state) {
    const ags = resolveStateAgs(req.query.state);
    if (!ags) throw new ApiError(400, `Unknown state: ${req.query.state}`);
    const { rows } = await pool.query(
      `SELECT MIN(year) AS earliest_year, MAX(year) AS latest_year FROM accidents WHERE state_code = $1`,
      [parseInt(ags, 10)]
    );
    const stateRow = await pool.query('SELECT name FROM regions WHERE ags = $1', [ags]);
    return res.json({
      scope: stateRow.rows[0]?.name ?? ags,
      earliest_year: rows[0].earliest_year,
      latest_year: rows[0].latest_year,
    });
  }

  const { rows } = await pool.query('SELECT MIN(year) AS earliest_year, MAX(year) AS latest_year FROM accidents');
  res.json({
    scope: 'Deutschland (all loaded data)',
    earliest_year: rows[0].earliest_year,
    latest_year: rows[0].latest_year,
  });
}));
```

### 2. `GET /metadata/test-questions`

Needed by the new **Test Questions** tab. This single endpoint computes
the answer to every mandatory, cross-source, and bonus examiner question
server-side and returns them all in one response — see the full code
block in the chat message that introduced this feature (or ask me to
reprint it). Add it to `accident-api/src/routes/metadata.js`, right after
the existing `/indicators` handler.

Each item in the response has the shape:
```json
{
  "id": "saxony-2023",
  "question": "How many accidents involving personal injury occurred in Saxony in 2023?",
  "sources": ["Unfallatlas"],
  "answer": 12513,
  "summary": "12,513 accidents involving personal injury occurred in Saxony in 2023. ..."
}
```
`answer` is a scalar for simple counts, an object for single chained
lookups (e.g. "top district + its rate"), or an array of objects for
ranked/listed results (e.g. the per-district rate comparison) — the
`QuestionCard` component on the frontend adapts its detail view to
whichever shape comes back.

---

## Pages

| Page | What it shows | Backend endpoints used |
|---|---|---|
| **Test Questions** | Every mandatory, cross-source and bonus examiner question, with a plain-English computed answer and a toggle to inspect the underlying rows | `/metadata/test-questions` |
| **Dashboard** | KPIs, accidents-by-state bar chart, national monthly trend line chart | `/aggregates/accidents`, `/aggregates/earliest-year`, `/regions`, `/metadata/indicators`, `/metadata/sources`, `/aggregates/trend` |
| **Map Explorer** | Filterable, clustered map of individual accident points, colour-coded by severity | `/regions` (district dropdown), `/accidents` |
| **Rankings** | Top/bottom N states or districts, bar chart + table | `/aggregates/accidents` (with `sort`/`limit`) |
| **Per-Capita Rates** | Cross-source comparison: official rate/10k vs. our own stored counts, dual-axis chart | `/aggregates/rate-per-10000` |
| **Zero Accidents** | Bonus query: districts with no recorded accidents in a year | `/aggregates/zero-accidents` |
| **Provenance** | ETL import log + searchable indicator catalogue | `/metadata/sources`, `/metadata/indicators` |

---

## Design notes

* **No state management library.** Each page owns its own filter state and
  fetches via a small `useAsync` hook (`src/hooks/useAsync.js`) — the app
  is small enough that Redux/Zustand would be pure overhead.
* **Map Explorer requires an explicit "Load accidents" click** rather than
  auto-fetching on every filter change. The accidents table has 270k+ rows
  and the API caps any single response at 1000 — auto-fetching on each
  keystroke would hammer the backend for no benefit.
* **Marker clustering** (`react-leaflet-cluster`) keeps the map legible
  even at a few hundred points; without it, overlapping circle markers in
  dense cities become an unreadable blob.
* **The Dashboard's trend dropdown is populated dynamically** from
  `/metadata/indicators` rather than hardcoding indicator codes, so it
  keeps working even if the GENESIS source file (and therefore the exact
  generated codes) changes between ETL runs.
* **Styling is plain CSS** (`src/styles/index.css`, CSS variables, no
  framework) — matches the dark theme of the bundled static demo client
  in `accident-api/public/` so screenshots stay visually consistent if you
  use both in the term paper.

---

## Folder structure

```
src/
├── api/client.js          One fetch wrapper, one function per endpoint
├── hooks/useAsync.js       Generic { data, loading, error } fetch hook
├── components/             Sidebar, FilterPanel, AccidentMap, charts, table
├── pages/                   One file per route (see table above)
├── utils/                   states.js (AGS reference), format.js (labels/colours)
└── App.jsx                  Route definitions
```
