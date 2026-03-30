# CalcPro.NP — Nepal's Free Calculator Suite

Nepal's most comprehensive online calculator platform.
37+ free calculators for finance, Nepal tax rules, health, education, and science.

**Live:** https://calcpro.com.np | **Repo:** github.com/avash81/Calculator

---

## What's New in v2.0

- ✅ **Live calculator on homepage** — Google-style widget above fold on mobile
- ✅ **Math Solver** — Algebra | Trigonometry | Calculus tabs (like Google)
- ✅ **AI Step-by-Step** — Claude API explains math solutions
- ✅ **Security fixed** — Removed eval(), using safe math evaluator
- ✅ **Nepal tax bug fixed** — Insurance cap corrected: 400,000 → 40,000 NPR
- ✅ **Homepage SEO** — generateMetadata now on homepage
- ✅ **Mobile-first** — iOS zoom fix, touch targets 44px+, safe area

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v3 + cp-* tokens |
| Math Engine | Custom safeEval() — no eval() |
| Database | Firebase Firestore (blog only) |
| Auth | Firebase Auth (admin only) |
| AI | Anthropic Claude API (Math Solver) |
| Testing | Jest + React Testing Library |
| Hosting | Vercel |

---

## Quick Start

```bash
git clone https://github.com/avash81/Calculator
cd Calculator
npm install
cp .env.local.example .env.local
# Fill Firebase credentials in .env.local
npm run dev
# Open http://localhost:3000
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage — server (SEO metadata)
│   ├── HomePageClient.tsx    # Homepage — client (interactive)
│   ├── layout.tsx            # Root layout: Navbar + Footer + MobileNav
│   ├── globals.css           # Tailwind + CSS vars + mobile fixes
│   ├── sitemap.ts            # Auto sitemap.xml
│   ├── robots.ts             # Search engine rules
│   └── calculator/
│       └── [slug]/
│           ├── page.tsx      # SEO metadata (server component)
│           └── Calculator.tsx # UI + logic (client component)
├── components/
│   ├── home/
│   │   └── HomeCalculator.tsx  # ⭐ Live calc widget on homepage
│   ├── calculator/
│   │   ├── CalcWrapper.tsx     # REQUIRED wrapper for all calcs
│   │   ├── CalcFAQ.tsx         # FAQ + JSON-LD schema
│   │   └── ShareResult.tsx     # Share buttons
│   └── layout/
│       ├── Navbar.tsx          # Fixed nav + mega dropdown
│       ├── Footer.tsx          # Dark footer
│       └── MobileNav.tsx       # Fixed bottom nav (mobile)
├── utils/math/
│   ├── safeEval.ts            # ⭐ Safe math evaluator (no eval!)
│   ├── finance.ts             # EMI, SIP, compound formulas
│   ├── health.ts              # BMI, BMR, ideal weight
│   └── country-rules/
│       └── nepal.ts           # Nepal IRD tax formulas
└── data/
    ├── calculators.tsx         # Master list of all calculators
    └── nepal-tax-slabs.json   # IRD tax data by fiscal year
```

---

## Security

- **No eval()** — All math uses `safeEval()` (recursive descent parser)
- **Firebase credentials** — Environment variables only, never hardcoded
- **Security headers** — X-Frame-Options, X-Content-Type-Options, Permissions-Policy
- **Input validation** — All user inputs sanitized before math operations

---

## Nepal Tax Rules (Verified)

| Calculator | Source | FY |
|---|---|---|
| Income Tax | Nepal IRD (ird.gov.np) | 2082/83 |
| Salary/SSF | Social Security Fund (ssf.gov.np) | 2082/83 |
| VAT 13% | IRD Nepal | Current |
| Home Loan | NRB Reference Rate (nrb.org.np) | Current |

---

## Adding a New Calculator

1. Create `src/app/calculator/[slug]/page.tsx` (metadata, server)
2. Create `src/app/calculator/[slug]/Calculator.tsx` (UI, client)
3. Add entry to `src/data/calculators.tsx`
4. Add slug to `src/app/sitemap.ts`

See CONTRIBUTING.md for detailed template.

---

## Scripts

```bash
npm run dev    # localhost:3000
npm run build  # Production build
npm run lint   # ESLint
npm run test   # Jest tests
```
