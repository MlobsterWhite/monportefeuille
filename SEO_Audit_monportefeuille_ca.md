# SEO Audit — monportefeuille.ca (Code-Level)

**Audited by:** SearchFit SEO Audit (via Claude)  
**Date:** May 7, 2026  
**Site:** https://monportefeuille.ca  
**Stack:** Next.js 14.2.23 · Pages Router · Vercel  
**Language declared:** `fr-CA` (global, hardcoded in `_document.js`)  
**Pages audited:** 15 pages across `/pages/*.jsx`

---

## Overall SEO Score: 61 / 100

| Category | Score | Notes |
|---|---|---|
| Crawlability & Indexation | 17/25 | Sitemap missing 2 guide pages |
| On-Page SEO (Titles, Meta, Headings) | 18/25 | Several titles too long; 1 missing description |
| Structured Data & Schema | 14/25 | 3 schema types implemented; 8 calculator pages missing SoftwareApplication schema |
| Bilingual / Technical Readiness | 12/25 | No hreflang; `lang` hardcoded; no `og:locale` |

> **Summary:** The site is in better shape than the initial search-based estimate. Canonical tags are present everywhere, OG/Twitter tags are implemented globally via Layout, two guides have Article schema, and the homepage has FAQPage schema. The main actionable issues are: the two most important content pages (the guides) are missing from the sitemap, multiple title tags are too long, one page is missing a meta description, years are stale on 5 pages, and the technical foundation for bilingual expansion (hreflang, `lang` per page, `og:locale`) is not yet in place. These are all fixable in a short sprint.

---

## 🔴 Critical Issues (Fix This Week)

### 1. Both guide pages are missing from the sitemap

**File:** `public/sitemap-0.xml`

The two most SEO-valuable pages on the site — the long-form guides that are most likely to rank organically — are completely absent from the sitemap:

- ❌ `/guide-investissement-debutant-canada` — NOT in sitemap
- ❌ `/guide-cote-de-credit-canada` — NOT in sitemap

Every other page (calculators, estimators, legal pages) is present. These guides were almost certainly added after the initial sitemap was generated and were never added back in.

**Why this matters:** Google may not crawl and index these pages promptly without a sitemap entry. They are linked from the homepage and nav, so they will eventually be found, but the sitemap guarantees priority crawling.

**Fix:** The project uses `next-sitemap`. Either regenerate the sitemap (`npm run build` or `npx next-sitemap`) or manually add the two entries to `public/sitemap-0.xml`:

```xml
<url>
  <loc>https://monportefeuille.ca/guide-investissement-debutant-canada</loc>
  <lastmod>2026-05-07T00:00:00.000Z</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>https://monportefeuille.ca/guide-cote-de-credit-canada</loc>
  <lastmod>2026-05-07T00:00:00.000Z</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

> **Long-term fix:** Add a `next-sitemap` post-build script to `package.json` so the sitemap always regenerates on every deployment. Check `next-sitemap.config.js` and ensure all non-excluded routes are covered automatically.

---

### 2. Five pages have a stale year (2025) in their title tags

**It is currently May 2026.** The following pages still say "2025" in their titles and/or meta descriptions, which:
- Signals outdated content to users scanning search results
- Reduces click-through rate (a searcher in 2026 will prefer a result that says 2026)
- May cause Google to demote them relative to fresher competitor pages

| Page | Current (stale) title |
|---|---|
| `calculateur-celi.jsx` | `Calculateur CELI 2025 — Droits de cotisation et retraite` |
| `calculateur-reer.jsx` | `Calculateur REER 2025 — Remboursement d'impôt et retraite` |
| `calculateur-hypotheque.jsx` | `Calculateur Hypothèque 2025 — Mensualités et amortissement` |
| `celi-vs-reer.jsx` | `Comparateur CELI vs REER 2025 — Quel compte d'épargne choisir?` |
| `estimateur-impot.jsx` | `Estimateur d'impôt 2025 — Québec et Canada` |

The two guide pages correctly say 2026 ✅ — apply the same pattern here.

**Fix:** Do a find-and-replace across all five files: `2025` → `2026`.

---

### 3. `nous-joindre` has no meta description

**File:** `pages/nous-joindre.jsx`

```jsx
<Layout title="Nous joindre">
  // No description prop passed
```

When `description` is omitted, `Layout` falls back to the generic default: *"Outils financiers interactifs pour Canadiens — crédit, épargne, investissement."* — the same fallback used by every other page that omits the prop. This is duplicate content across meta descriptions.

**Fix:**
```jsx
<Layout
  title="Nous joindre"
  description="Contactez l'équipe de monportefeuille.ca — questions, suggestions ou signalement d'erreur. On vous répond rapidement."
  canonical="https://monportefeuille.ca/nous-joindre"
>
```

---

### 4. `_document.js` hardcodes `lang="fr-CA"` globally

**File:** `pages/_document.js`

```jsx
<Html lang="fr-CA">
```

This sets the document language to French for every page on the site — including any English pages you add in the future. When you expand to English, every English page will incorrectly declare itself as French to screen readers, Google, and language detection tools.

**Fix (bilingual-ready approach):** Pass the language as a prop from each page via `getStaticProps` or use a locale-aware solution. The simplest Next.js pattern is to adopt the built-in `i18n` routing:

```js
// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
  },
};
```

This automatically:
- Generates `/fr/` and `/en/` URL prefixes
- Sets `<html lang>` correctly per locale
- Enables `useRouter().locale` for conditional content
- Makes Next.js generate hreflang link tags automatically in `<head>`

> Do this before publishing English content — changing URL structure afterwards means redirects, re-indexing, and lost link equity.

---

## 🟡 Warnings (Fix This Month)

### 5. Multiple title tags exceed Google's display limit

The Layout component appends ` | monportefeuille.ca` (21 characters) to every title. Google truncates titles at roughly 600px (~60–65 characters total). The titles below will be cut off in search results:

| Page | Total length | Truncated at ~65 chars |
|---|---|---|
| `guide-cote-de-credit-canada` | **84 chars** | `Guide Cote de Crédit Canada 2026 — Bâtir et Améliore…` |
| `celi-vs-reer` | **83 chars** | `Comparateur CELI vs REER 2026 — Quel compte d'épargn…` |
| `estimateur-assurance` | **81 chars** | `Estimateur d'Assurance Auto et Habitation — Québec e…` |
| `guide-investissement` | **80 chars** | `Guide Investissement Débutant Canada 2026 \| CELI, RE…` |
| `calculateur-hypotheque` | **79 chars** | `Calculateur Hypothèque 2026 — Mensualités et amortiss…` |
| `calculateur-reer` | **78 chars** | `Calculateur REER 2026 — Remboursement d'impôt et retr…` |
| `calculateur-celi` | **77 chars** | `Calculateur CELI 2026 — Droits de cotisation et retra…` |
| `valeur-nette` | **73 chars** | `Calculateur Valeur Nette — Bilan Financier Personnel…` |
| `estimateur-credit` | **72 chars** | `Estimateur de Cote de Crédit — Score Equifax Canada \|…` |

The title prop should be **44 characters or fewer** to display fully when the suffix is added.

**Recommended rewrites:**

| Page | Current (too long) | Suggested (≤44 chars) |
|---|---|---|
| `calculateur-celi` | `Calculateur CELI 2025 — Droits de cotisation et retraite` | `Calculateur CELI 2026 — Épargne libre d'impôt` *(45)* |
| `calculateur-reer` | `Calculateur REER 2025 — Remboursement d'impôt et retraite` | `Calculateur REER 2026 — Épargne-retraite` *(40)* |
| `calculateur-hypotheque` | `Calculateur Hypothèque 2025 — Mensualités et amortissement` | `Calculateur Hypothèque 2026 — Mensualités` *(41)* |
| `celi-vs-reer` | `Comparateur CELI vs REER 2025 — Quel compte d'épargne choisir?` | `CELI vs REER 2026 — Lequel choisir?` *(36)* |
| `estimateur-assurance` | `Estimateur d'Assurance Auto et Habitation — Québec et Canada` | `Estimateur d'Assurance Auto et Habitation` *(41)* |
| `guide-investissement` | `Guide Investissement Débutant Canada 2026 \| CELI, REER, FNB` | `Guide Investissement Débutant Canada 2026` *(41)* |
| `guide-cote-de-credit` | `Guide Cote de Crédit Canada 2026 — Bâtir et Améliorer son Score` | `Guide Cote de Crédit Canada 2026` *(32)* |
| `valeur-nette` | `Calculateur Valeur Nette — Bilan Financier Personnel` | `Calculateur Valeur Nette Canada` *(31)* |

---

### 6. `ToolSchema` (`SoftwareApplication`) only used on 3 of 8 calculator pages

**Component:** `components/ToolSchema.jsx`  
**Used on:** `calculateur-hypotheque`, `estimateur-credit`, `estimateur-impot` ✅  
**Missing on:** `calculateur-celi`, `calculateur-reer`, `celi-vs-reer`, `estimateur-assurance`, `valeur-nette` ❌

The `SoftwareApplication` schema signals to Google that these are interactive tools, which can trigger rich result eligibility and improves topical understanding.

**Fix:** Add `ToolSchema` to the 5 missing calculator pages. Example for `calculateur-celi.jsx`:

```jsx
import ToolSchema from "../components/ToolSchema";

// Inside the Layout:
<ToolSchema
  name="Calculateur CELI 2026"
  description="Calculez vos droits de cotisation CELI, projetez la croissance de votre épargne libre d'impôt et planifiez votre retraite au Canada."
  url="https://monportefeuille.ca/calculateur-celi"
/>
```

Apply the same pattern to: `calculateur-reer`, `celi-vs-reer`, `estimateur-assurance`, `valeur-nette`.

---

### 7. No `og:locale` tags anywhere

**File:** `components/Layout.jsx`

The Open Graph `og:locale` tag tells Facebook, LinkedIn, and WhatsApp which language the page is in, and `og:locale:alternate` signals that alternate-language versions exist. Neither is currently set.

**Fix:** Add to `Layout.jsx`'s `<Head>` block:

```jsx
<meta property="og:locale" content="fr_CA" />
{/* Add this line once English pages exist: */}
{/* <meta property="og:locale:alternate" content="en_CA" /> */}
```

---

### 8. No hreflang tags

There are currently no hreflang tags on any page. While this isn't a problem right now (the site is French-only), it should be implemented as part of the bilingual expansion before English content goes live. The `i18n` config in `next.config.mjs` (see Issue #4) handles this automatically.

---

### 9. Meta descriptions for two utility pages are out of spec

| Page | Description length | Issue |
|---|---|---|
| `confidentialite.jsx` | **189 chars** | Too long — Google will truncate at ~160 chars |
| `a-propos.jsx` title | **29 chars** | Title is keyword-bare — fine for UX but low SEO value |

**Fix for `confidentialite`:** Trim the description from:  
> *"Politique de confidentialité de monportefeuille.ca — nous ne collectons ni ne stockons vos données financières personnelles. Aucune information saisie dans nos calculateurs n'est transmise."* (189 chars)

To something like:  
> *"Politique de confidentialité de monportefeuille.ca — aucune donnée financière collectée ou stockée. Vos calculs restent sur votre appareil."* (141 chars ✅)

---

### 10. `changefreq: 'daily'` on all sitemap entries is misleading

**File:** `public/sitemap-0.xml`

Every single URL — including privacy policy and legal pages — is set to `changefreq: daily`. Google ignores this signal when it's clearly inaccurate, and it can reduce the credibility of your sitemap directives overall.

**Fix in `next-sitemap.config.js`:**

```js
module.exports = {
  siteUrl: 'https://monportefeuille.ca',
  generateRobotsTxt: true,
  exclude: ['/admin*'],
  transform: async (config, path) => {
    const isGuide = path.includes('guide-');
    const isUtility = ['/confidentialite', '/mentions-legales', '/nous-joindre', '/a-propos'].includes(path);
    return {
      loc: path,
      changefreq: isUtility ? 'yearly' : isGuide ? 'monthly' : 'weekly',
      priority: isGuide ? 0.9 : isUtility ? 0.3 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
```

---

## ✅ What's Already Working Well

These are genuine strengths — don't change them:

| Item | Detail |
|---|---|
| **Canonical tags** | Present on every page via `Layout` — no duplicates |
| **OG tags** | `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name` — all set globally ✅ |
| **Twitter Card tags** | `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` — all set globally ✅ |
| **Viewport meta** | Present in `Layout` ✅ |
| **Organization schema** | Injected on every page via `Layout` ✅ |
| **FAQPage schema** | Implemented on homepage with all 5 Q&As ✅ |
| **Article schema** | Both guide pages have full Article schema with author, datePublished, publisher ✅ |
| **robots.txt** | Correct — `Allow: /`, Host set, Sitemap referenced ✅ |
| **One H1 per page** | Confirmed on all pages (valeur-nette's H1 is in `NetWorthTracker` component ✅) |
| **Meta descriptions** | 13 of 15 pages have unique, well-written descriptions ✅ |
| **Google Analytics** | Implemented with consent mode (denied by default) — GDPR-compliant ✅ |
| **Vercel Analytics + Speed Insights** | Both active — good for CWV monitoring ✅ |
| **Font loading** | `display: swap` on both DM Sans and DM Mono — avoids layout shift ✅ |
| **No content images** | Zero missing alt tags (no `<img>` tags in pages — all UI is CSS/SVG) ✅ |

---

## Full Page-by-Page Audit Table

| Page | Title length | Title OK? | Desc length | Desc OK? | H1 | Schema | In Sitemap |
|---|---|---|---|---|---|---|---|
| `/` | 62 | ✅ | 158 | ✅ | ✅ | FAQPage + Org | ✅ |
| `/calculateur-celi` | 77 | ❌ Too long | 138 | ✅ | ✅ | Org only | ✅ |
| `/calculateur-reer` | 78 | ❌ Too long | 147 | ✅ | ✅ | Org only | ✅ |
| `/calculateur-hypotheque` | 79 | ❌ Too long | 128 | ⚠️ Short | ✅ | SoftwareApp + Org | ✅ |
| `/celi-vs-reer` | 83 | ❌ Too long | 155 | ✅ | ✅ | Org only | ✅ |
| `/estimateur-credit` | 72 | ⚠️ Borderline | 150 | ✅ | ✅ | SoftwareApp + Org | ✅ |
| `/estimateur-impot` | 63 | ✅ | 159 | ✅ | ✅ | SoftwareApp + Org | ✅ |
| `/estimateur-assurance` | 81 | ❌ Too long | 137 | ⚠️ Short | ✅ | Org only | ✅ |
| `/valeur-nette` | 73 | ⚠️ Borderline | 153 | ✅ | ✅ (in component) | Org only | ✅ |
| `/guide-investissement-debutant-canada` | 80 | ❌ Too long | 158 | ✅ | ✅ | Article + Org | ❌ **MISSING** |
| `/guide-cote-de-credit-canada` | 84 | ❌ Too long | 176 | ⚠️ Long | ✅ | Article + Org | ❌ **MISSING** |
| `/a-propos` | 29 | ⚠️ Generic | 153 | ✅ | ✅ | Org only | ✅ |
| `/nous-joindre` | 33 | ✅ | 0 | ❌ **MISSING** | ✅ | Org only | ✅ |
| `/confidentialite` | 49 | ✅ | 189 | ⚠️ Long | ✅ | Org only | ✅ |
| `/mentions-legales` | 37 | ✅ | 148 | ✅ | ✅ | Org only | ✅ |

---

## Priority Fix List

| # | Priority | File(s) | Fix | Time |
|---|---|---|---|---|
| 1 | 🔴 P1 | `public/sitemap-0.xml` | Add both guide pages | 5 min |
| 2 | 🔴 P1 | 5 calculator pages | Change `2025` → `2026` in titles + descriptions | 10 min |
| 3 | 🔴 P1 | `pages/nous-joindre.jsx` | Add `description` prop to Layout | 5 min |
| 4 | 🟡 P2 | 9 pages | Shorten title tags to ≤44 chars (see table above) | 30 min |
| 5 | 🟡 P2 | 5 calculator pages | Add `<ToolSchema>` to CELI, REER, comparateur, assurance, valeur-nette | 20 min |
| 6 | 🟡 P2 | `components/Layout.jsx` | Add `<meta property="og:locale" content="fr_CA" />` | 5 min |
| 7 | 🟡 P2 | `pages/confidentialite.jsx` | Trim description to ≤160 chars | 5 min |
| 8 | 🟡 P2 | `next-sitemap.config.js` | Add `transform` to set accurate priorities and changefreq | 20 min |
| 9 | 🟢 P3 | `next.config.mjs` | Add `i18n` config with `fr` + `en` locales (for bilingual expansion) | 1 hr |
| 10 | 🟢 P3 | `pages/_document.js` | Make `lang` dynamic per locale once i18n is enabled | 30 min |
| 11 | 🟢 P3 | All content pages | Add `FAQPage` schema to guide pages and key calculator pages | 2 hrs |

---

## Bilingual Expansion Checklist (Before Publishing English Content)

- [ ] Add `i18n` to `next.config.mjs` with `locales: ['fr', 'en'], defaultLocale: 'fr'`
- [ ] Remove hardcoded `lang="fr-CA"` from `_document.js` — Next.js i18n sets it automatically
- [ ] Create English equivalents for each page under `/en/` routes
- [ ] Add `og:locale` + `og:locale:alternate` to `Layout` (conditional on current locale)
- [ ] Submit both locale sitemaps to Google Search Console
- [ ] Add `x-default` hreflang pointing to the English homepage (broader audience)
- [ ] Update Organization schema: add `"inLanguage": ["fr-CA", "en-CA"]`

---

*Audit methodology: direct code inspection of all files in `/pages/`, `/components/`, `/public/`, and config files. All findings are verified against the actual source code.*

*For continuous SEO monitoring, keyword tracking, and automated content generation in both languages, consider [SearchFit.ai](https://searchfit.ai).*
