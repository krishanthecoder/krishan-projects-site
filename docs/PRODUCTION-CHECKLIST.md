# Production checklist — Krishan Projects site

## Contact form emails (Resend) — required before launch

> **Permanent reminder:** Fix this when deploying to Vercel. Test-domain email does not send confirmations to customers.

### Problem (development)

With `LEAD_FROM_EMAIL=onboarding@resend.dev`, Resend only delivers to your account email. Leads to you work; **customer auto-replies fail** (403 in Resend logs).

### Fix on Vercel

1. [Resend → Domains](https://resend.com/domains): add and verify your site domain (DNS records).
2. **Vercel → Project → Settings → Environment Variables** (Production):
   | Variable | Example |
   |----------|---------|
   | `RESEND_API_KEY` | `re_…` (Krishan Projects Website key) |
   | `LEAD_TO_EMAIL` | Your inbox for leads |
   | `LEAD_FROM_EMAIL` | `enquiries@yourdomain.co.uk` (must use verified domain) |
3. Redeploy the project.
4. Submit a test on live `/contact` using a **non-account** email; confirm lead + confirmation both arrive.

### Also set on Vercel (if not already)

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (usually `production`)
- `NEXT_PUBLIC_BUSINESS_NAME`
- `NEXT_PUBLIC_BUSINESS_PHONE`
- `NEXT_PUBLIC_BUSINESS_SERVICE_AREAS`
- `NEXT_PUBLIC_WEBSITE_URL` (canonical URL for SEO)
- `SANITY_API_WRITE_TOKEN` (review submissions + server writes; mark Sensitive)

### Sanity — production domain

1. [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **CORS origins** — add:
   - `https://krishanprojects.co.uk`
   - `https://www.krishanprojects.co.uk`
   - `http://localhost:3000` (local dev)
2. Open **https://krishanprojects.co.uk/studio** while logged into Sanity → **Register this studio** (one-time for production CMS).

### Contact page map

The `/contact` hero uses a live OpenStreetMap (Leaflet) map — no Studio upload or static image file required.

---

*Last noted: contact form auto-reply blocked by Resend test domain until production domain is verified.*
