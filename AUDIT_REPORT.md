# CalcPro.NP — Detailed Audit Report (Security, Correctness, Performance, Supply Chain)

## Executive Summary
This audit reviewed CalcPro.NP’s Next.js 14 App Router codebase with Firebase-backed content/admin tooling and a math/AI solver surface. The highest-risk areas were:
- **Admin authorization & filesystem writes** (`/api/admin/posts/*`): previously reachable without a verified admin session; also vulnerable to path traversal via unsanitized `slug`.
- **Stored XSS via public content rendering** (`dangerouslySetInnerHTML` + regex-to-HTML conversion): content from Firestore could inject malicious HTML/URLs.
- **AI proxy abuse & secret leakage** (`/api/ai/solve`): input validation was weak and the Gemini API key was previously placed in the URL.
- **Secret exposure in the browser** (`NEXT_PUBLIC_ADMIN_SECRET_TOKEN`).

As part of this implementation, the above issues were fixed with concrete code changes and expanded unit tests. Build and tests now pass, and lint passes (warnings only).

## Findings by Severity (Prioritized)

### Critical
1. **Admin API auth bypass + cookie minting abuse**
   - **Impact:** Unauthenticated clients could call admin session/cookie minting and mutate or read filesystem-backed content.
   - **Where:**
     - `src/middleware.ts` (only guarded `/admin/*` initially; `/api/admin/*` was not uniformly enforced)
     - `src/app/api/admin/session/route.ts` (previously minted `admin_token` without validating caller identity)
     - `src/app/api/admin/posts/route.ts`, `src/app/api/admin/posts/[slug]/route.ts` (filesystem read/write without authorization gating)
   - **Fix implemented:**
     - Added `src/lib/auth.ts` with `getAdminSession()` + `requireAdmin()` (verifies `admin_token` JWT signature and role).
     - Updated `src/middleware.ts` to protect `/admin/*` and sensitive `/api/admin/*` endpoints.
     - Updated `/api/admin/session` to require a valid Firebase `idToken`, then read the caller’s `users/{uid}` role via Firestore REST before signing a scoped `admin_token`.
     - Updated admin login/setup flows to send a verified `idToken` to `/api/admin/session`.
     - Updated `/api/admin/posts/*` to require `requireAdmin()` for both reads and writes.

2. **Path traversal / arbitrary filesystem access via `slug`**
   - **Impact:** When combined with admin bypass, unsanitized `slug` could escape `content/blog` and read/delete arbitrary files.
   - **Where:**
     - `src/app/api/admin/posts/route.ts` (POST write path)
     - `src/app/api/admin/posts/[slug]/route.ts` (GET/DELETE path)
   - **Fix implemented:**
     - Pinned both routes to Node runtime: `export const runtime = 'nodejs'`.
     - Added strict slug allowlist validation: `^[a-z0-9-]{1,80}$`.
     - Enforced root-directory containment with `path.resolve()` + prefix validation before any read/write.

3. **Stored XSS in public blog/guide pages**
   - **Impact:** Malicious HTML/JS stored in Firestore could be converted via regex and injected into the DOM using `dangerouslySetInnerHTML`.
   - **Where:**
     - `src/app/blog/[slug]/PageClient.tsx` (regex-to-HTML + `dangerouslySetInnerHTML`)
     - `src/app/blog/[slug]/BlogPostContent.tsx` (regex-to-HTML + `dangerouslySetInnerHTML`)
     - `src/app/guide/[slug]/GuidePage.tsx` (regex-to-HTML + `dangerouslySetInnerHTML`)
   - **Fix implemented:**
     - Escaped Firestore markdown content before regex-to-HTML conversion.
     - Sanitized link/image URLs (allowlist for `http(s)`, `/`, `#`); rejected `javascript:`/`data:`/`vbscript:`.
     - Escaped/sanitized image URL fields (`imageMiddle`, `imageTop`, `imageBottom`) before HTML/JSX injection.
     - Also escaped admin SEO preview input before injecting via `dangerouslySetInnerHTML`:
       - `src/app/admin/seo-pages/new/page.tsx`

### High
4. **AI solver abuse + key leakage + weak request/response safety**
   - **Impact:** Potential key leakage (via URL), abuse of the endpoint, and unsafe output rendering if ever used as HTML.
   - **Where:** `src/app/api/ai/solve/route.ts`
   - **Fix implemented:**
     - Validated `query` type and enforced max length (`<=800 chars`).
     - Added basic in-memory per-IP rate limiting (10 req/min).
     - Added timeout (`AbortController`).
     - Switched Gemini key from URL query param to header: `x-goog-api-key`.
     - Sanitized output by stripping HTML tags and truncating to a bounded word count.

5. **Secret exposure to the browser via `NEXT_PUBLIC_ADMIN_SECRET_TOKEN`**
   - **Impact:** Server-side admin secret could be exposed to anyone loading the client bundle.
   - **Where:** `src/app/admin/setup/page.tsx`
   - **Fix implemented:**
     - Removed `NEXT_PUBLIC_ADMIN_SECRET_TOKEN` usage from the client.
     - Added a server-only verifier endpoint: `src/app/api/admin/setup/route.ts`.
     - Updated middleware allowlist to permit `/api/admin/setup` without `admin_token`.

6. **CSP overly risky for modern browsers**
   - **Impact:** `unsafe-eval` increases exploitability if any injection primitive exists.
   - **Where:** `next.config.js`
   - **Fix implemented:**
     - Removed `script-src 'unsafe-eval'` (kept `unsafe-inline` due to existing inline scripts).

### Medium
7. **Correctness: SSF deduction policy bug (boundary + cap issues)**
   - **Impact:** SSF deduction could be wrong for certain inputs (`0` treated as unset; custom SSF wasn’t capped).
   - **Where:** `src/utils/math/country-rules/nepal.ts`
   - **Fix implemented:**
     - Replaced `ssfAmountInput || ...` with nullish coalescing.
     - Enforced policy max cap even when custom SSF is provided.
   - **Test coverage added:**
     - `src/__tests__/math/nepal.test.ts`

### Low / Informational
8. **Performance hotspot: Firestore “fetch-all then scan/filter”**
   - **Impact:** Increased server CPU/network and slower TTFB for `blog/[slug]` and `guide/[slug]` pages at scale.
   - **Where:**
     - `src/lib/firestore-rest.ts`
     - `src/app/blog/[slug]/page.tsx`
     - `src/app/guide/[slug]/page.tsx`
   - **Recommendation:**
     - Prefer querying by `slug` (or using structured REST filtering) to avoid scanning large collections.

9. **UX/Perf warnings: `<img>` usage instead of `next/image`**
   - **Where:** various blog/guide components.
   - **Recommendation:** migrate high-traffic images to `next/image` with safe remote patterns.

10. **Missing calculator implementations**
   - **Impact:** Users navigating to missing slugs would hit 404s.
   - **Registry vs routes:**
     - Registry has **70** calculator slugs
     - Implemented routes exist for **61**
     - Missing **10** slugs:
       - `area-calculator`, `bmi-child`, `decimal-to-fraction`, `nepal-tds-calculator`, `nepse-bonus-tax`, `paint-cost-calculator`, `see-gpa-calculator`, `simple-calculator`, `sleep-calculator`, `solar-requirement`

## Dependency & Supply-Chain Risk Summary
`npm audit` reported **12 vulnerabilities** (1 critical, 7 high). The most urgent issues are Next.js advisories affecting cache key confusion, middleware/authorization bypass patterns, and DoS vectors.

Current `package.json` pins:
- `next: 14.2.3`
- `eslint-config-next: 14.2.3`

Recommended minimal safe upgrade path:
- Upgrade `next` to **14.2.35**+ and align `eslint-config-next` to the same version.
- Re-run `npm audit` after the Next patch upgrade (often resolves multiple transitive ranges).
- Prefer running `npm audit fix` (non-`--force`) first; avoid `npm audit fix --force` unless you accept breaking changes (the audit suggests breaking upgrades such as a newer `jest-environment-jsdom`).

Additional high-severity transitive findings to track after the Next upgrade:
- `lodash` (code injection via `_.template`, prototype pollution)
- `glob` (command injection vectors)
- `minimatch` (ReDoS)
- `@tootallnate/once` (incorrect control flow scoping)

## Verification Checklist
Evidence from this workspace:
1. `npm test` → PASS (98/98)
2. `npm run lint` → PASS (warnings only)
3. `npm run build` → PASS

Recommended smoke tests:
- Admin protection:
  - Call `POST /api/admin/posts` without `admin_token` → `401/403`
  - Attempt path traversal slug (e.g. `../x`) → `400 Invalid slug`
- Admin session bootstrap:
  - Call `/admin/setup` with an invalid secret → `403`
  - With valid setup (including Firestore `users/{uid}.role`), ensure `/api/admin/session` mints `admin_token` successfully
- Stored content XSS:
  - Store a blog/guide post containing `javascript:` link and `<script>` tags; confirm rendered HTML does not execute
- AI endpoint safety:
  - Send an overlong query → `413`
  - Confirm responses contain plain text and never HTML/JS fragments

