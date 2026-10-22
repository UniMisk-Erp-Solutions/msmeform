# MSME Subsidy Estimator

Estimator and guide for the Gujarat MSME incentive scheme under Viksit Gujarat Industrial Policy 2026
(capital subsidy, interest subsidy, power tariff, yearly and overall ceilings, EPF).

Built with React 18 and Vite.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to dist/
npm run preview    # serves dist/ on http://localhost:4173
```

## Deploy on Vercel

1. Import this repository in Vercel.
2. Framework preset: **Vite** (detected automatically from `vercel.json`).
3. Build command `npm run build`, output directory `dist`. No environment variables are needed.

## Structure

- `src/calc.js` – calculation engine (slabs, ceilings, EPF) and money formatting
- `src/App.jsx` – estimator form and results
- `src/Sections.jsx` – information sections (incentives, comparison, support schemes, FAQ)
- `src/SiteChrome.jsx` – header and footer
- `src/talukas.json` – Category A / B taluka list (268 talukas)
- `public/theme/` – logo and background images
