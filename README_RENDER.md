Render one-click deploy instructions

How to deploy this project to Render (full-stack: frontend + backend):

1) Push your repository to GitHub
   - Ensure the repo contains this `render.yaml` at the project root.
   - Recommended branch name: `main` (or adjust `branch:` in `render.yaml`).

2) Import the repo to Render
   - Go to https://dashboard.render.com and sign in.
   - Click "New" → "Import from GitHub".
   - Choose your repository and follow the prompts.
   - Render will detect `render.yaml` and create the service configured there.

3) Fill required environment variables / secrets
   - In the Render creation UI you will be asked to set environment variables. Set at least:
     - `JWT_SECRET` (required) — a random secret string for signing JWTs.
     - Optional SMTP settings if you want outgoing email:
       - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `NOTIFY_EMAIL`.
   - For production, mark SMTP credentials and JWT secret as secrets (Render UI will hide values).

4) Deploy and verify
   - After import, Render will run `npm install` and `npm start` as defined in `render.yaml`.
   - Visit the service URL provided by Render. The server serves both the frontend and API.
   - Health check path: `/api/health` (returns status JSON).

Notes and tips
- Static frontend only: If you prefer to host only the static site (no backend) on GitHub Pages, deploy the repo to GitHub Pages and point frontend API requests to your backend hosted on Render/another host.
- Environment: `render.yaml` sets `env: node` and `startCommand: npm start` (uses `server.js`).
- Port: Render sets the `PORT` environment variable automatically; `server.js` reads `process.env.PORT || 3000`.
- If you rename your default branch, update the `branch:` in `render.yaml` or choose the branch from Render UI.

Security
- Do NOT commit sensitive secrets to Git. Use Render's secrets UI or environment variables instead.

Example JWT secret generator (Node):

```js
require('crypto').randomBytes(48).toString('hex');
```

That's it — once Render finishes the build you'll have a live site URL you can share publicly.