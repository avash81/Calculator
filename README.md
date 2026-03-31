# CalcPro.NP — Nepal's Institutional 75+ Tool Suite (2026)

The most comprehensive, high-performance online calculator platform for Nepal. 75+ precision-engineered calculators for Finance, Health, Academic, and Technical sectors.

**Live:** [https://calcpro.com.np](https://calcpro.com.np) | **Audit Score:** 98% (Lighthouse)

---

## 🚀 What's New in v4.0 (2026 Production Hub)
- ✅ **75+ High-Precision Tools** — Expanded from 37+ to a complete multi-pillar suite.
- ✅ **Institutional 6-Column Hub** — High-density, professional navigation hub (Finance, Health, Academic, Technical, Support).
- ✅ **Manual Entry Engine (Lag-Free)** — Replaced native browser date pickers with high-speed numeric keyboard entry.
- ✅ **Universal Reset / Backspace** — One-click clear engine added to all high-traffic tools (GPA, EMI, Age, BMI, Tax).
- ✅ **Timeless SEO Architecture** — Year-generic routing with dynamic FY-aware logic (e.g., Nepal Tax 2082/83).
- ✅ **Ultra-Compact Professional Footer** — Removed redundant whitespace for desktop-density and mobile-first stacks.

---

## 🛠️ Project Architecture & Tool Stack
| Layer | Core Technology |
|---|---|
| **Framework** | Next.js 14.2 (App Router) / React 18 |
| **Logic Engine** | TypeScript 5 (Strict) |
| **Styling** | Tailwind CSS v3 + CalcPro-Vibrant Tokens |
| **Math Hub** | `src/utils/math/safeEval.ts` (Recursive Descent Parser) |
| **Blog System** | Firebase Firestore + Markdown (gray-matter) |
| **Accuracy Suite** | Jest + React Testing Library (89 Verified Cases) |

---

## 🏗️ Project Structure (Developer Guide)
```text
src/
├── app/
│   ├── page.tsx              # SEO-Optimized Hero Landing
│   ├── layout.tsx            # Root Server Layout (Metadata)
│   └── calculator/
│       └── [slug]/           # The Tool Engine [slug]/page.tsx & Calculator.tsx
├── components/
│   ├── layout/               # High-Density 6-Column Footer & Mega-Navbar
│   ├── calculator/           # Modular Hub (CalcWrapper, CalcFAQ, ShareResult)
│   └── ui/                   # Reusable shadcn-inspired professional atoms
├── data/
│   ├── calculators.tsx       # The 75+ Master Tool Registry
│   └── nepal-tax-slabs.json  # Real-time IRD fiscal data
└── utils/math/
    ├── country-rules/        # Nepal-specific regulatory logic (Tax, SSF)
    └── safeEval.ts           # The "Zero-Eval" secure mathematical parser
```

---

## 🛠️ Development & Deployment Workflow
1. **Initialize Engine**: `npm install`
2. **Local Debugging**: `npm run dev` (Port 3004 default)
3. **Accuracy Audit**: `npm test` (**89 Cases must pass before any push**)
4. **Style Verification**: `npm run lint` (**Strict zero-tolerance for errors**)
5. **Production Build**: `npm run build`
6. **Deploy**: Vercel/Self-host as high-performance SSR/Client Hybrid.

---

## 📈 SEO & Growth Best Practices
- **JSON-LD Schema**: Every tool (`Calculator.tsx`) includes a `JsonLd` component for search engine snippets.
- **Dynamic Crumbs**: All tools use the `crumbs` array in `CalcWrapper` for local categorization.
- **FY-Persistence**: Routes are timeless (e.g., `/nepal-income-tax`) while content is updated annually in `src/data/`.

---

## 🛡️ Security & Privacy
- **Zero-Storage**: No user data (Taxable income, health data, loan amounts) is stored on our servers.
- **No-Eval Policy**: Native `eval()` is strictly prohibited; all math is piped through the secure parser.
- **SSL Performance**: Fully optimized for HTTPS and Asia-Oceania regional caches.

---

© 2026 CalcPro.NP — Precision Engineering for Nepal.
