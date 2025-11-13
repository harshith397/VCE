#  VCE 

Short description
-----------------

A student portal frontend for Vasavi College that shows attendance, syllabus and marks.

---

Table of contents
- About
- Quick start
- Environment
- Running locally
- Build & Deploy
- Project layout
- Syllabus flow
- Troubleshooting

## About

This repository contains the frontend application for `<<VCE>>`.
It is built with Vite + React + TypeScript and uses Tailwind CSS + shadcn-ui for styling/components.

## Quick start

Prerequisites
- Node.js LTS (16/18+ recommended)
- npm or pnpm

Install and run locally

```
npm install
npm run dev
```

Open the local dev URL shown by Vite (commonly http://localhost:5173).

Build for production

```
npm run build
npm run preview
```

## Environment

This app reads the API base URL from a Vite environment variable.

- `VITE_API_URL` — base URL of your backend API (example: `https://my-backend.onrender.com`)

Create a `.env` file in the project root (do not commit this file). Example:

```
VITE_API_URL=http://localhost:8000
```

The runtime value is read in `src/config/api.ts` as `API_URL`.

## Running the Syllabus flow

- The per-subject button in `src/components/SubjectProgressBar.tsx` fetches syllabus data from the backend at `/get_syllabus` and navigates to `/syllabus/view`, passing the received data via React Router location state.
- The viewer page is implemented in `src/pages/SyllabusViewer.tsx` and expects `location.state.syllabus` (or will fetch using query params when navigated to directly).

Notes about response shapes
- If your backend returns a double-encoded JSON (a JSON string inside a JSON response), the frontend contains a defensive re-parsing step to handle that. Ideally the backend should return a proper JSON object/array.

## Build & Deploy (Render)

This repository includes `render.yaml` with a static site service definition.

Recommended Render settings
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL` set to your production backend.

## Project layout (high level)

- `src/config/api.ts` — central API URL (exports `API_URL`)
- `src/components/SubjectProgressBar.tsx` — per-subject attendance row + Syllabus button
- `src/pages/SyllabusViewer.tsx` — dedicated syllabus viewer page
- `src/pages/Home.tsx` — landing page
- `src/pages/Login.tsx`, `src/pages/Dashboard.tsx`, `src/pages/MarksPage.tsx` — other pages

## Troubleshooting

- No syllabus shown: open DevTools → Network and inspect the request to `/get_syllabus`. Confirm query params (`semester`, `subject_code`, `dept`) and response body. Also check the console for debug logs added to the fetch flow.
- If the app shows parsing errors, check whether the backend response is a JSON string (e.g. `"{...}"`) rather than an object; prefer fixing the backend to return an object.

## Contribution

1. Fork the repository
2. Create a branch: `git checkout -b feat/my-change`
3. Commit and push your branch
4. Open a Pull Request


```
Project: <<VCE>>
Author: <<Medichelme Harshith>>
Repository: <<https://github.com/harshith397/VCE.git>>
Production API: https://college-frontend-qq5e.onrender.com
Development API: http://localhost:8000
```

---


**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/harshith397/VCE.git

# Step 2: Navigate to the project directory.
cd <VCE>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


