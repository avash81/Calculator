# CALCPRO.NP — GEMINI FINAL AUDIT & GO-LIVE PROMPT
## Platform: Google AI Studio (Gemini 2.5 Pro)
## Purpose: Check EVERY function, button, path, loading, speed before going live

---

## HOW TO USE THIS PROMPT

Paste the prompt block below into Google AI Studio.
Gemini will work through all 12 phases systematically.
Apply every fix immediately. Export to GitHub when all phases show ✅.

---

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  CALCPRO.NP — PRE-LAUNCH COMPLETE AUDIT PROMPT                             ║
║  Check every function · every button · every path · every loading state     ║
║  Speed · Mobile · Accuracy · Security · SEO — everything before going live  ║
╚══════════════════════════════════════════════════════════════════════════════╝

You are a senior engineer doing a complete pre-launch audit of CalcPro.NP.
Go through ALL 12 phases. Fix every issue found. Show complete file content.
Apply each fix immediately. Report status after each phase.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — FIREBASE CRASH FIX (fixes the auth/invalid-api-key error)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

READ src/lib/firebase.ts

PROBLEM: Firebase crashes with auth/invalid-api-key when .env.local
is missing or has placeholder values.

REWRITE src/lib/firebase.ts with lazy initialization:

'use client' is NOT needed here — this is a utility module.

The fix: check if env vars are real before calling initializeApp().
If not configured, return null from getDb() and getFirebaseAuth().
Calculator pages never use Firebase so they work fine without it.
Only blog + admin need Firebase.

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

function isConfigured(): boolean {
  const k = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !!(k && k !== 'your_api_key_here' && k.length > 10);
}

let _app: FirebaseApp | null = null;
function getApp(): FirebaseApp | null {
  if (!isConfigured()) return null;
  if (_app) return _app;
  if (getApps().length > 0) { _app = getApps()[0]; return _app; }
  try {
    _app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
    return _app;
  } catch { return null; }
}

export function getDb(): Firestore | null {
  const app = getApp();
  if (!app) return null;
  try { return getFirestore(app, process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID); }
  catch { return null; }
}
export function getFirebaseAuth(): Auth | null {
  const app = getApp();
  if (!app) return null;
  try { return getAuth(app); } catch { return null; }
}
export const db = getDb();
export const auth = getFirebaseAuth();
export enum OperationType {
  CREATE='create', UPDATE='update', DELETE='delete',
  LIST='list', GET='get', WRITE='write',
}
export function handleFirestoreError(e: unknown, op: OperationType, r: string): void {
  if (process.env.NODE_ENV === 'development') console.error(`Firestore ${op} on '${r}':`, e);
}

THEN: Fix all blog + admin pages that use db directly:
  FIND:  collection(db, 'posts')
  FIX:   const dbInst = getDb(); if (!dbInst) { setLoading(false); return; }
         collection(dbInst, 'posts')

THEN: Fix admin login to use getFirebaseAuth():
  FIND:  signInWithEmailAndPassword(auth, ...)
  FIX:   const authInst = getFirebaseAuth();
         if (!authInst) { setError('Firebase not configured'); return; }
         signInWithEmailAndPassword(authInst, ...)

Show all updated files.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — ALL CALCULATOR FUNCTIONS: ACCURACY TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

READ every Calculator.tsx file. Verify the math formula.
Test each with known inputs. Fix any wrong results.

NEPAL CALCULATORS — Rule-based (must match Nepal government):
  nepal-income-tax:
    Test: NPR 800,000 annual, single, no deductions
    Expected: NPR 34,500 total tax (1%×5L=5000 + 10%×2L=20000 + 20%×47500=9500)
    Check: insurance cap = Math.min(40000, ...) NOT 400000
    Check: SSF waiver applies only to first slab

  nepal-salary:
    Test: Basic NPR 50,000/month
    SSF Employee = 50000 × 11% = 5500
    SSF Employer = 50000 × 20% = 10000
    CIT Employee = 50000 × 10% = 5000 (if enrolled)
    Net = 50000 - 5500 - 5000 - tax = verify result

  nepal-vat:
    Test: NPR 1000 price, add VAT mode → NPR 1130
    Test: NPR 1130 inclusive, remove VAT → NPR 1000
    Nepal VAT = exactly 13%

  nepali-date:
    Test: AD 2024-04-13 → BS 2081-01-01
    Test: BS 2081-01-01 → AD 2024-04-13
    These MUST match exactly.

UNIVERSAL CALCULATORS — Follow international formulas:
  loan-emi:
    Formula: EMI = P×R×(1+R)^N / ((1+R)^N-1)
    Test: NPR 1,000,000 at 12%/yr for 10 years
    Expected monthly EMI: NPR 14,347
    R = 12/12/100 = 0.01, N = 120

  bmi:
    Formula: weight(kg) / height(m)²
    Test: 70kg, 170cm → BMI = 70/(1.7²) = 70/2.89 = 24.2
    Category: Normal Weight (18.5–24.9)

  sip-calculator:
    Formula: FV = P × [((1+r)^n-1)/r] × (1+r)
    Test: NPR 5000/month, 12%/yr, 10 years
    Expected: ~NPR 11,61,695

  compound-interest:
    Formula: A = P(1+r/n)^(nt)
    Test: NPR 100,000 at 10%/yr for 5 years monthly
    Expected: NPR 164,701

  bmi, bmr: WHO/Mifflin-St Jeor formulas — verify correct

  gpa:
    Nepal TU: A+=4.0, A=3.7, B+=3.3, B=3.0, C+=2.5, C=2.0, D=1.5, F=0
    Weighted average = Σ(gradePoints × credits) / Σ(credits)
    Test: 3 subjects — A+(4.0)×3cr + B(3.0)×3cr + C+(2.5)×3cr = 28.5/9 = 3.17

For each calculator with a wrong result, show the fix.
Show corrected calcTax/calcEMI/calcBMI function.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — ALL BUTTONS: CLICK TESTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Check every interactive element across all files.

NAVBAR buttons:
  □ Logo → navigates to "/"
  □ Calculators button → opens/closes dropdown on click
  □ Dropdown closes when clicking outside (useEffect mousedown)
  □ Dropdown closes when route changes (useEffect on pathname)
  □ Nepal Tools link → /calculator/nepal-income-tax
  □ Blog link → /blog
  □ Dark/light toggle → switches theme, saves to localStorage
  □ Get Started → /calculator/nepal-income-tax
  □ Hamburger → opens mobile slide menu
  □ Mobile menu items → navigate and close menu
  □ Body scroll locked when mobile menu open

HOMEPAGE buttons:
  □ Search input → filters calculators, shows dropdown
  □ Search results → navigates to calculator and clears search
  □ Nepal tool cards → navigate to correct calculator
  □ Category links → navigate to /calculator?cat=[id]
  □ Calculator links → navigate to /calculator/[slug]
  □ HomeCalculator buttons → all numbers and operators work
  □ HomeCalculator AC → clears display
  □ HomeCalculator = → computes result using safeEval
  □ HomeCalculator backspace → removes last char
  □ Maths solver toggle → shows/hides solver panel
  □ Solver tabs → switches Algebra/Trig/Calculus
  □ Example equations → populates solver input
  □ AI Explain → calls Claude API, shows result

CALCULATOR PAGE buttons (check each):
  □ All number inputs → updates calculation in real-time
  □ All sliders → updates input value and calculation
  □ Toggle buttons (Single/Married, Male/Female) → updates results
  □ SSF toggle → deducts SSF and waives SST
  □ Print button → window.print() works
  □ Share buttons → opens WhatsApp/Facebook/copy correctly
  □ FAQ accordion → expands/collapses on click
  □ Related calculator links → navigate correctly
  □ Breadcrumb links → navigate correctly

MOBILE NAV buttons:
  □ Home → "/"
  □ Tools → "/calculator"
  □ Nepal → "/calculator/nepal-income-tax"
  □ Blog → "/blog"
  □ Search → "/calculator?search=1"
  □ Active state highlights correct item based on pathname

For every button that is broken, show the fix.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — ALL ROUTES AND PATHS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verify every route has a working page.tsx with a default export.

REQUIRED ROUTES:
  / ........................ HomePageClient renders
  /calculator .............. CalculatorsList page
  /calculator/[slug] ....... 37 individual pages
  /blog .................... Blog listing (Firebase optional)
  /blog/[slug] ............. Blog post (Firebase optional)
  /admin ................... Dashboard (requires auth)
  /admin/login ............. Login form
  /admin/posts ............. Posts list
  /admin/posts/new ......... New post form
  /admin/posts/edit/[slug] . Edit post form
  /pricing ................. Pricing page
  /privacy ................. Privacy policy
  /terms ................... Terms of service
  /search .................. Search page
  /sitemap ................. HTML sitemap

CALCULATOR ROUTES (all 37 must exist):
  nepal-income-tax, nepal-salary, nepal-vat, nepali-date,
  nepal-home-loan, nepal-provident-fund,
  loan-emi, sip-calculator, fd-calculator, compound-interest,
  simple-interest, cagr-calculator, discount-calculator, savings,
  bmi, bmr, ideal-weight, body-fat, calorie-calculator,
  pregnancy-due-date, water-intake,
  gpa, cgpa, percentage, attendance, marks-needed,
  age-calculator, unit-converter,
  scientific-calculator, fraction-calculator, quadratic-solver,
  standard-deviation, logarithm-calculator,
  password-generator, qr-generator, word-counter, tip-calculator,
  number-to-words, roman-numerals

For each missing page — CREATE it with real working content.
No placeholders. No "coming soon".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5 — LOADING STATES (every async operation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every page that fetches data MUST show a loading state.
Every heavy operation MUST show feedback.

CHECK and FIX these loading states:

1. Route-level loading (Next.js App Router):
   src/app/loading.tsx → full-page skeleton (exists, verify content)
   src/app/calculator/loading.tsx → calculator skeleton (exists, verify)

2. Blog page loading:
   Blog list → show skeleton cards while fetching from Firestore
   Blog post → show skeleton while loading
   If Firebase not configured → show "Blog coming soon" gracefully

3. AI Explain button in HomeCalculator:
   While Claude API call is running: show spinner + "Solving..." text
   On success: show formatted answer
   On error: show "AI unavailable. Try again." (not a crash)

4. Calculator computations:
   useDebounce(300ms) on all heavy inputs — no UI freeze on fast typing
   Large amortization tables: show first 12 rows, "Show all" button

5. QR Generator:
   Show loading spinner while QR code generates
   Show error if input is empty

6. Image loading: all Next.js <Image> must have width/height and placeholder

7. Mobile speed: verify no large animations blocking initial render

FIX: Add proper loading skeleton to blog page:
  const [loading, setLoading] = useState(true);
  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-5 bg-gray-200 rounded w-4/5 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );

Show updated blog/page.tsx, blog/[slug]/page.tsx, HomeCalculator.tsx.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 6 — MOBILE PERFORMANCE (speed is #1 priority for Nepal users)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nepal users are on 4G/3G mobile. Page must be fast.

CHECK globals.css has:
  @media (max-width: 768px) {
    input, select, textarea { font-size: 16px !important; } /* No iOS zoom */
  }
  button { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }

CHECK every calculator page:
  □ Results show ABOVE inputs on mobile (flex-col-reverse)
  □ All buttons: min-h-[44px] (Apple HIG touch targets)
  □ All number inputs: inputMode="numeric" or inputMode="decimal"
  □ Tables: wrapped in overflow-x-auto for horizontal scroll
  □ No heavy animations (Framer Motion) blocking initial render

CHECK layout.tsx:
  □ Navbar/Footer/MobileNav use dynamic imports (ssr:false)
  □ This defers non-critical code from initial bundle

CHECK next.config.js:
  □ compress: true
  □ poweredByHeader: false
  □ images.formats: ['image/avif', 'image/webp']
  □ Cache headers on /calculator/:path* (86400 seconds)

ADD to next.config.js experimental:
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion'],
  }

FIX HomePageClient.tsx hero section for mobile:
  CURRENT: Large h1 + tall padding → calculator not visible above fold
  FIX: 
    h1 text: text-base sm:text-lg (smaller on mobile)
    padding: py-4 (not py-16)
    HomeCalculator component: shown FIRST in the DOM on mobile

FIX: Remove or lazy-load motion animations on mobile:
  const isMobile = window.innerWidth < 768;
  Use motion only on desktop for EMI/SIP animated results

Show updated globals.css, next.config.js, layout.tsx.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 7 — SEO COMPLETENESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Check every page for SEO requirements:

1. Homepage (src/app/page.tsx):
   □ generateMetadata exports unique title
   □ description 120-160 chars with Nepal keywords
   □ openGraph.type = 'website'
   □ alternates.canonical = 'https://calcpro.com.np'

2. Every calculator page.tsx:
   □ Unique title (not duplicate of another page)
   □ Description includes primary keyword
   □ canonicalUrl = correct page URL
   □ Calculator.tsx has JsonLd type="calculator"
   □ Calculator.tsx has CalcFAQ with 4+ questions (enables rich snippets)

3. sitemap.ts:
   □ All 37 calculator slugs listed
   □ Nepal calculators priority: 0.95
   □ Other calculators priority: 0.85
   □ Homepage priority: 1.0
   □ changeFrequency correct

4. robots.ts:
   □ Disallow: ['/admin/', '/api/admin/']
   □ Allow: ['/']
   □ Sitemap URL included

5. layout.tsx metadata:
   □ metadataBase is set: new URL('https://calcpro.com.np')
   □ Default OG image configured

ADD metadataBase to layout.tsx:
  export const metadata: Metadata = {
    metadataBase: new URL('https://calcpro.com.np'),
    title: { default: 'CalcPro.NP', template: '%s | CalcPro.NP' },
    ...
  };

Show updated layout.tsx and sitemap.ts.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 8 — CODE STRUCTURE & COMMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every file must follow this structure standard:

FILE HEADER (top of every .tsx/.ts file):
  /**
   * @fileoverview [Name] — CalcPro.NP
   * [One-line description]
   * [If Nepal-specific]: @nepalRule [Authority] FY 2082/83
   * @component (for React components)
   */

FUNCTION COMMENTS:
  /**
   * [What this function does]
   * @param name - [description]
   * @returns [description]
   * @example calcEMI(1000000, 12, 120) // 14347
   */

INLINE COMMENTS on complex logic:
  // Nepal IRD: SSF contributors get SST waiver on first slab
  // Formula: EMI = P×R×(1+R)^N / ((1+R)^N-1)

Add @fileoverview to these files (show each complete with comments):
  1. src/utils/math/safeEval.ts — already has good JSDoc
  2. src/components/home/HomeCalculator.tsx
  3. src/app/HomePageClient.tsx
  4. src/components/calculator/CalcWrapper.tsx
  5. src/components/calculator/CalcFAQ.tsx
  6. src/components/layout/Navbar.tsx
  7. src/components/layout/Footer.tsx
  8. src/components/layout/MobileNav.tsx
  9. src/data/calculators.tsx
  10. src/lib/calcMeta.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 9 — SECURITY FINAL CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scan the ENTIRE codebase:
  □ Zero eval() calls (except inside safeEval.ts parser logic — that's safe)
  □ Zero Function() constructor calls
  □ No hardcoded API keys or passwords in source files
  □ firebase-applet-config.json in .gitignore (or deleted)
  □ .env.local in .gitignore
  □ All external links have rel="noopener noreferrer"
  □ No console.log with sensitive data

next.config.js security headers present:
  □ X-Frame-Options: DENY
  □ X-Content-Type-Options: nosniff
  □ Referrer-Policy: strict-origin-when-cross-origin
  □ Permissions-Policy: camera=(), microphone=(), geolocation=()

If any missing — fix and show updated next.config.js.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 10 — ERROR HANDLING (what users see when things go wrong)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Check these error states work correctly:

1. src/app/error.tsx — global error boundary:
   □ Shows user-friendly message (not stack trace)
   □ Has "Try again" button that calls reset()
   □ Has "Back to Home" link
   □ 'use client' directive at top

2. src/app/not-found.tsx — 404 page:
   □ Shows helpful message
   □ Search bar to find calculators
   □ Links to popular calculators
   □ No broken images or missing icons

3. Calculator input errors:
   □ If user enters negative number → show validation message
   □ If division by zero → show "Invalid input" not "Infinity"
   □ If user clears all inputs → show default state gracefully

4. Firebase/Network errors:
   □ Blog page when offline → show "Unable to load posts. Check connection."
   □ AI Explain when API fails → show "AI unavailable" (not crash)
   □ QR Generator when input empty → show validation message

5. safeEval returning 'Error':
   □ Calculator display shows "Error" in red (not a blank screen)
   □ AC button clears error and resets

Add to safeEval usage in HomeCalculator:
  const result = safeEval(equation, { isDeg });
  if (result === 'Error') {
    setDisplay('Error');
    setEquation('');
    return;
  }

Show updated error.tsx, not-found.tsx, HomeCalculator.tsx error handling.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 11 — ACCESSIBILITY (WCAG 2.1 AA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Check these accessibility requirements:

1. All buttons have accessible labels:
   □ Icon-only buttons: aria-label="Clear all" / aria-label="Delete"
   □ Toggle buttons: aria-pressed={isPressed}
   □ Calculator display: aria-live="polite" (announces results to screen readers)

2. All form inputs:
   □ <label> elements with htmlFor matching input id
   □ OR aria-label on the input directly
   □ Error messages: role="alert" for immediate announcement

3. Keyboard navigation:
   □ All interactive elements reachable by Tab
   □ :focus-visible ring visible (in globals.css)
   □ No keyboard traps (mobile menu closes with Escape)

4. Color contrast:
   □ All text on white background passes 4.5:1 ratio
   □ Blue (#1B4FBD) on white: PASS
   □ Gray text (#6B7280) on white: 4.6:1 PASS
   □ Red (#E31837) on white: PASS

5. Images:
   □ All <Image> have alt text
   □ Decorative images: alt=""

Add to globals.css:
  :focus-visible {
    outline: 2px solid #1B4FBD;
    outline-offset: 2px;
    border-radius: 4px;
  }
  :focus:not(:focus-visible) { outline: none; }

Show updated globals.css accessibility section.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 12 — FINAL GO-LIVE CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run through every item. Fix anything marked NO.

FUNCTIONALITY:
  □ Homepage loads without errors
  □ HomeCalculator widget works (all buttons)
  □ Math Solver panel opens and closes
  □ Algebra/Trig/Calculus tabs switch correctly
  □ AI Explain calls Claude API and shows result
  □ Search filters calculators correctly
  □ All 37 calculator pages load without 404
  □ Nepal Income Tax: NPR 800K single → NPR 34,500 ✓
  □ EMI: 1M at 12% for 10yr → NPR 14,347/mo ✓
  □ BMI: 70kg 170cm → 24.2 Normal ✓
  □ VAT: 1000 + 13% → 1130 ✓
  □ Nepali Date: AD 2024-04-13 → BS 2081-01-01 ✓
  □ Blog page loads (shows empty state if no Firebase)
  □ Admin login shows (Firebase error handled gracefully)

MOBILE (test at 375px):
  □ Calculator visible above fold without scrolling
  □ All buttons 44px+ touch targets
  □ No horizontal overflow on any page
  □ Mobile nav fixed at bottom of screen
  □ iOS: no zoom on input focus (16px font size)
  □ Nepal tools scroll horizontally

SECURITY:
  □ Zero eval() in codebase (except safeEval.ts parser)
  □ No API keys in source code
  □ Firebase config in .env.local (not committed)
  □ X-Frame-Options header present

SEO:
  □ Homepage has generateMetadata
  □ All calculator pages have unique metadata
  □ sitemap.xml generates all URLs
  □ JSON-LD schema on calculator pages

PERFORMANCE:
  □ useMemo on all calculations
  □ useDebounce(300ms) on slider inputs
  □ compress: true in next.config.js
  □ Dynamic imports for Navbar, Footer, MobileNav

COMMIT MESSAGE:
  "feat: complete pre-launch audit — all systems verified

  Phase 1: Firebase lazy init — no crash without .env.local
  Phase 2: All 37 calculator formulas verified and tested
  Phase 3: All buttons tested — nav, calc, mobile, share
  Phase 4: All routes verified — no 404 pages
  Phase 5: Loading states on all async operations
  Phase 6: Mobile speed optimized — 375px above-fold calc
  Phase 7: SEO complete — all pages have metadata
  Phase 8: JSDoc comments on all key files
  Phase 9: Security scan passed — zero eval()
  Phase 10: Error boundaries and graceful failures
  Phase 11: WCAG 2.1 AA accessibility compliance
  Phase 12: Full go-live checklist verified

  READY FOR PRODUCTION DEPLOYMENT"

  ╔═══════════════════════════════════════════════════════════╗
  ║  CALCPRO.NP — PRE-LAUNCH STATUS REPORT                  ║
  ╠═══════════════════════════════════════════════════════════╣
  ║  Phase 1:  Firebase crash fixed       ✅ / ❌            ║
  ║  Phase 2:  All calculators accurate   ✅ / ❌            ║
  ║  Phase 3:  All buttons working        ✅ / ❌            ║
  ║  Phase 4:  All routes valid           ✅ / ❌            ║
  ║  Phase 5:  Loading states complete    ✅ / ❌            ║
  ║  Phase 6:  Mobile speed optimized     ✅ / ❌            ║
  ║  Phase 7:  SEO metadata complete      ✅ / ❌            ║
  ║  Phase 8:  Code comments added        ✅ / ❌            ║
  ║  Phase 9:  Security audit passed      ✅ / ❌            ║
  ║  Phase 10: Error handling complete    ✅ / ❌            ║
  ║  Phase 11: Accessibility WCAG AA      ✅ / ❌            ║
  ║  Phase 12: Go-live checklist passed   ✅ / ❌            ║
  ╠═══════════════════════════════════════════════════════════╣
  ║  READY FOR VERCEL PRODUCTION DEPLOY:  YES / NO          ║
  ╚═══════════════════════════════════════════════════════════╝
```
