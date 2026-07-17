# 🚗 German Road Accident Dashboard (Frontend)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)

A modern, responsive React + Vite dashboard for visualizing German road accident data. This project serves as the frontend for the [Accident API](https://github.com/khushal-senghani/-OpenDataIntegration_accidentsFrontend) backend.

**Note:** This application communicates with the API entirely over HTTP and never connects to the PostgreSQL database directly, strictly adhering to frontend/backend separation requirements.

---

## 📑 Table of Contents
- [Features](#-features)
- [Pages & Capabilities](#-pages--capabilities)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Required Backend Changes](#-required-backend-changes)
- [Design Notes](#-design-notes)

---

## ✨ Features
- **Interactive Data Visualization:** View trends, accident aggregates, and per-capita rates using Recharts.
- **Geospatial Mapping:** Filterable, clustered map of individual accident points, color-coded by severity using Leaflet.
- **Dynamic Filtering:** Examine data across different years, states, and accident types.
- **Test Questions Evaluator:** Inspect answers to mandatory, cross-source, and bonus queries directly from the UI.
- **Dark Mode UI:** A sleek, plain CSS (custom properties) dark theme that stays visually consistent without relying on heavy UI frameworks.

---

## 🗺️ Pages & Capabilities

| Page | What it shows | Backend endpoints used |
|---|---|---|
| **Test Questions** | Every mandatory, cross-source and bonus examiner question, with a plain-English computed answer and a toggle to inspect the underlying rows. | `/metadata/test-questions` |
| **Dashboard** | KPIs, accidents-by-state bar chart, national monthly trend line chart. | `/aggregates/accidents`, `/aggregates/earliest-year`, `/regions`, `/metadata/indicators`, `/metadata/sources`, `/aggregates/trend` |
| **Map Explorer** | Filterable, clustered map of individual accident points, colour-coded by severity. | `/regions` (district dropdown), `/accidents` |
| **Rankings** | Top/bottom N states or districts, bar chart + table. | `/aggregates/accidents` (with `sort`/`limit`) |
| **Per-Capita Rates** | Cross-source comparison: official rate/10k vs. our own stored counts, dual-axis chart. | `/aggregates/rate-per-10000` |
| **Zero Accidents** | Bonus query: districts with no recorded accidents in a year. | `/aggregates/zero-accidents` |
| **Provenance** | ETL import log + searchable indicator catalogue. | `/metadata/sources`, `/metadata/indicators` |

---

## 🛠️ Tech Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Charting:** Recharts
- **Maps:** Leaflet & React-Leaflet (with `react-leaflet-cluster` for marker clustering)
- **Styling:** Vanilla CSS (CSS Variables)

---

## 🚀 Getting Started

### 1. Install Dependencies
Clone the repository and install the required npm packages:
```bash
git clone https://github.com/khushal-senghani/-OpenDataIntegration_accidentsFrontend.git
cd -OpenDataIntegration_accidentsFrontend
npm install
```

### 2. Configure Environment Variables
Copy the example environment file and configure it to point to your local backend API.
```bash
cp .env.example .env
```
*(Edit `.env` if your backend isn't running on `http://localhost:3000`)*

### 3. Start the Backend API
Make sure your backend is running in a separate terminal:
```bash
# cd ../accident-api && npm start
```

### 4. Start the Development Server
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

### 5. Production Build
To create a production-ready build:
```bash
npm run build
npm run preview # To preview the production build locally
```

---

## 📂 Project Structure

```text
src/
├── api/client.js          # Fetch wrapper & API endpoint functions
├── hooks/useAsync.js      # Generic { data, loading, error } fetch hook
├── components/            # Reusable UI (Sidebar, FilterPanel, AccidentMap, charts, table)
├── pages/                 # Route views (Dashboard, MapExplorer, etc.)
├── utils/                 # Helpers (states.js for AGS reference, format.js for labels/colours)
├── styles/                # Global CSS (index.css)
└── App.jsx                # Route definitions & layout wrapper
```

---

## ⚠️ Required Backend Changes

Two small, additive changes to `accident-api` are required for this frontend to fully function. Neither breaks anything that already exists.

### 1. `latest_year` field on `/aggregates/earliest-year`

Needed by the Dashboard's "Data span" KPI. Open `accident-api/src/routes/aggregates.js` and replace the `/earliest-year` handler with this version (adds `MAX(year)` alongside the existing `MIN(year)`):

```javascript
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

Needed by the new **Test Questions** tab. This single endpoint computes the answer to every mandatory, cross-source, and bonus examiner question server-side and returns them all in one response. Add it to `accident-api/src/routes/metadata.js`, right after the existing `/indicators` handler.

Each item in the response has the following shape:
```json
{
  "id": "saxony-2023",
  "question": "How many accidents involving personal injury occurred in Saxony in 2023?",
  "sources": ["Unfallatlas"],
  "answer": 12513,
  "summary": "12,513 accidents involving personal injury occurred in Saxony in 2023. ..."
}
```
*`answer` is a scalar for simple counts, an object for single chained lookups, or an array of objects for ranked/listed results. The `QuestionCard` component on the frontend adapts its detail view to whichever shape comes back.*

---

## 🎨 Design Notes

* **No state management library:** Each page owns its own filter state and fetches via a small `useAsync` hook (`src/hooks/useAsync.js`). The app is small enough that Redux or Zustand would be pure overhead.
* **Explicit Fetching:** Map Explorer requires an explicit "Load accidents" click rather than auto-fetching on every filter change. The accidents table has 270k+ rows and the API caps any single response at 1000 — auto-fetching on each keystroke would hammer the backend.
* **Marker Clustering:** `react-leaflet-cluster` keeps the map legible even at a few hundred points; without it, overlapping circle markers in dense cities become an unreadable blob.
* **Dynamic Menus:** The Dashboard's trend dropdown is populated dynamically from `/metadata/indicators` rather than hardcoding indicator codes, so it keeps working even if the GENESIS source file changes between ETL runs.
* **Vanilla Styling:** Styling is plain CSS (`src/styles/index.css`), utilizing CSS variables without any framework. This matches the dark theme of the bundled static demo client in `accident-api/public/` so screenshots stay visually consistent if you use both.
