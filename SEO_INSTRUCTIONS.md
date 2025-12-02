Google Search Console & Indexing Guide

1) Deploy the site and get a public URL
   - Deploy to Render (you already have `render.yaml`) or GitHub Pages (static-only).
   - Example: `https://global-care-clinic-web.onrender.com` or `https://your-custom-domain.com`.

2) Replace placeholders in `robots.txt` and `sitemap.xml`
   - Open `sitemap.xml` and `robots.txt` and replace `https://your-domain.example/` with your actual site URL.

3) Confirm files are reachable
   - In a browser visit:
     - `https://your-domain.example/robots.txt`
     - `https://your-domain.example/sitemap.xml`
   - Or run these commands (PowerShell):
     ```powershell
     curl -I https://your-domain.example/
     curl https://your-domain.example/robots.txt
     curl https://your-domain.example/sitemap.xml
     ```

4) Add site to Google Search Console
   - Go to https://search.google.com/search-console
   - Click "Add property" → choose "URL prefix" (enter your full Render URL) OR choose "Domain" (preferred for full coverage) and follow verification steps.
   - Verification: use DNS TXT record (fastest with domain), or use Render's file upload / meta tag options if URL prefix.

5) Submit your sitemap
   - In Search Console select your property → "Sitemaps" → enter `/sitemap.xml` and click "Submit".

6) Request indexing (optional, speeds up process)
   - In Search Console use "URL Inspection" → enter the page URL (e.g., homepage) → "Request indexing".

7) Monitor progress
   - Use Search Console Coverage report to see which pages are indexed and any crawl errors.
   - Use "Performance" report to see clicks, impressions, and queries.

8) Improve discoverability
   - Add unique `<title>` and `<meta name="description">` to each public page.
   - Ensure public pages are reachable without login and have meaningful text content.
   - Add structured data (schema.org) for organization, local business, and articles where appropriate.
   - Create at least one external link from another site (e.g., directory, social profile) to help discovery.

9) Privacy & blocking
   - Do NOT leave `noindex` meta tags on pages you want indexed.
   - If you want the site private, keep it behind authentication or set `robots.txt` to disallow crawling.

If you prefer, I can:
- Replace placeholders in `sitemap.xml` and `robots.txt` after you give the deployed Render URL.
- Verify the files are reachable and run the curl checks.
- Walk you through Search Console verification and sitemap submission step-by-step.

Verification options (quick copy/paste)

- HTML file verification (recommended when using URL-prefix property):
   1. In Search Console choose "HTML file" verification.
   2. Google will provide a file named like `google1234567890abcdef.html`.
   3. Upload that file to your site root — place it at the repo root so it is served at `https://global-care-clinic.onrender.com/google1234567890abcdef.html`.
   4. Click "Verify" in Search Console.

- Meta tag verification (easy for URL-prefix):
   1. Choose "HTML tag" verification in Search Console.
   2. Google supplies a meta tag such as:

       ```html
       <meta name="google-site-verification" content="1234567890abcdef" />
       ```

   3. Add this tag inside the `<head>` of `index.html` (or your main page) and commit.
   4. Click "Verify".

- DNS TXT verification (recommended for domain property):
   1. Choose "Domain" property in Search Console.
   2. Google gives a DNS TXT record to add to your domain provider.
   3. Add the TXT record in your DNS settings and wait for it to propagate, then click "Verify".
