---
name: start
description: Start the Vite dev server for this portfolio site so the user can view it locally in a browser. Use when the user asks to preview, view, see, or check out the site/portfolio locally, or to "start localhost" / "run the dev server".
---

# Start

Starts the local dev server for this portfolio (Vite + React) so the user can view their site in a browser.

## Steps

1. Check if a dev server is already running on the expected port (default Vite port 5173) by trying to reach `http://localhost:5173`. If something is already serving there, just report the URL — don't start a second instance.
2. Otherwise, start the server in the background from the repo root:
   ```
   export PATH="/opt/homebrew/bin:$PATH"; npm run dev
   ```
   The PATH export is needed because this shell doesn't source `~/.zprofile` (where Homebrew's shellenv lives), so `node`/`npm` aren't found without it. Run this with `run_in_background: true` (or equivalent) since it's a long-lived process — never block waiting on it. If `node_modules` is missing (npm run dev fails with "vite: command not found"), run `export PATH="/opt/homebrew/bin:$PATH"; npm install` first, then retry.
3. Read the process output to confirm the actual URL Vite prints (it's usually `http://localhost:5173/`, but Vite bumps the port if that one's taken — always confirm from the log rather than assuming).
4. Tell the user the URL so they can open it themselves. Do not attempt to open a browser window on their behalf.
5. Leave the server running — do not stop it after reporting the URL. If the user later asks to stop it, stop the background process.
