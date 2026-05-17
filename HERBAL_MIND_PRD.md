# 🌿 Herbal Mind — Product Requirements Document

> **Version:** 1.0  
> **Status:** Active  
> **Project Type:** New Product (Ground-Up)  
> **Last Updated:** April 2026

---

## 1. Project Overview

**Herbal Mind** is an AI-powered educational platform that helps users safely understand herbal remedies, identify herbs, and consult with verified experts. It combines AI-assisted herb recognition, expert-backed research, and community validation to reduce misinformation and build trust in herbal knowledge — without providing medical diagnosis.

### One-Line Summary
> A trusted, centralized herbal intelligence platform that bridges AI speed with human verification.

### Why It Exists
- Growing interest in health, wellness, and natural remedies
- Widespread misinformation and unsafe guidance across the internet
- AI health tools exist but carry low trust
- No single platform holistically solves herbal education, identification, and expert access

---

## 2. Problem Statement

Individuals interested in herbal remedies struggle to safely understand and identify herbs because existing information is **fragmented, unverified, and confusing** — resulting in misuse, safety concerns, and lack of trust in herbal guidance platforms.

---

## 3. Target Users

| User Type | Description |
|-----------|-------------|
| **Everyday Users** | Individuals seeking quick, safe herbal guidance for wellness concerns |
| **Herbal Enthusiasts** | Learners who want to explore herbs, research benefits, and build knowledge |
| **Consultants** | Verified herbal experts who provide guidance and review content |

### Existing Mental Models
Users already rely on Google, YouTube, WhatsApp groups, Instagram pages, and family/traditional knowledge. They bring these expectations:
- "If I upload a picture, tell me what this herb is"
- "AI should answer fast, but humans can verify"
- "Health info should feel careful and safe"
- "I don't want to be diagnosed — just educated"

### Key Design Implication
> Clear boundaries, safety reassurance, and escalation to experts must be **visible everywhere** in the UI.

---

## 4. User Goals

### Primary Goal
Learn about an herb or symptom **safely**.

### Secondary Goals
- Scan an herb with the camera for identification
- Ask the AI a health/herb question
- Read verified research articles
- Engage with the community (comments, saves)
- Chat with a verified consultant
- Track past activity and saved herbs

---

## 5. Core User Flow

```
1. User signs up / logs in
2. User lands on dashboard
3. User chooses one of:
   ├── Scan an herb (camera / image upload)
   ├── Ask AI about a symptom or herb
   └── Browse research articles
4. AI provides educational insight
5. User sees safety notes and clear AI limitations
6. User escalates to a consultant if needed
7. User saves herb or tracks activity
```

---

## 6. Feature Inventory

### 6.1 MVP — Must Have

| Feature | Description |
|---------|-------------|
| **Authentication** | Sign up, log in, profile management |
| **AI Educational Chat** | Ask questions about herbs or symptoms; AI responds with educational, non-diagnostic answers |
| **Herb Image Recognition** | Upload or scan a photo; AI identifies the herb and provides safety notes |
| **Consultant Text Chat** | Escalate to a verified herbal consultant for additional clarity |
| **Blog & Research Hub** | Browse expert-reviewed articles; leave comments |
| **User Dashboard** | Central landing page with activity overview and quick actions |
| **Admin Moderation Tools** | Backend tools for content management and moderation |

### 6.2 Should Have (Phase 2)

| Feature | Description |
|---------|-------------|
| **Herb Saving** | Bookmark herbs for later reference |
| **Activity History** | View past scans, questions, and consultations |
| **Improved Onboarding** | Guided first-run experience explaining capabilities and boundaries |
| **Safety Reminders** | Inline, persistent safety disclaimers throughout the app |

### 6.3 Could Have (Phase 3)

| Feature | Description |
|---------|-------------|
| **Regional Herb Libraries** | Curated herb databases by region/culture |
| **Personalized Learning Paths** | Herb education tracks based on user interest |
| **Consultant Ratings** | User feedback on consultant interactions |

### 6.4 Won't Have (Out of Scope)

- ❌ Medical diagnosis or prescriptions
- ❌ Video or voice consultations
- ❌ E-commerce / herb purchasing

---

## 7. Information Architecture

### Navigation Groups

```
Learn
├── AI Chat
├── Herb Scan
└── Blog Articles

Validate
├── Consultant Chat
├── Expert-Reviewed Tags
└── Safety Notes

Engage
├── Comments
├── Saved Herbs
└── Activity History

Manage
├── User Profile
└── Admin Content Tools (backend only)
```

### Naming Principles
- Simple, accessible language
- Educational framing — not medical (e.g., "Learn about" not "Treat")
- Clear capability boundaries throughout

---

## 8. Technical Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, Tailwind CSS v4 |
| Backend / DB | Convex (serverless functions + database) |
| Auth | Clerk |
| Language | TypeScript (strict mode) |
| UI Components | shadcn/ui |
| AI (Chat) | Groq — LLaMA 3.1 70B |
| AI (Embeddings) | OpenAI — text-embedding-3-small |
| Vector Search | Convex native vector search |
| File Ingestion | Background jobs via Inngest |
| Deployment | Vercel |

---

## 9. UX Writing Standards

### Button Labels
- "Learn about this herb"
- "Ask for expert insight"
- "Scan another herb"

### Error Messages
- "We're not confident enough to identify this herb. Please consult an expert."
- "This information is educational, not medical advice."

### Confirmations
- "Your question has been sent to a verified consultant."
- "This herb information has been reviewed."

---

## 10. Accessibility & Real Conditions

- **Mobile-first** — camera-heavy use case, designed for one-handed interaction
- **Large, readable text** with clear contrast ratios (WCAG AA minimum)
- **Simple language** — no jargon, no clinical terminology
- **Low-data friendly** — optimized for regions with limited connectivity
- **Clear human vs. AI labeling** — always visible which responses come from AI vs. experts

---

## 11. Design Principles

- Calm, trustworthy color palette (greens, neutrals)
- Clear visual hierarchy — primary actions always highlighted
- Minimal decoration — content over chrome
- Safety notes **visually separated** from AI answers
- Human vs. AI responses **clearly labeled** at all times

---

## 12. Success Metrics

### User Metrics
| Metric | Description |
|--------|-------------|
| Task Success Rate | Can users identify herbs successfully? |
| Herb Scan Completion Rate | % of scans that result in a result viewed |
| AI Chat Engagement Rate | Messages per session, return sessions |
| Blog Read & Comment Rate | Engagement with research content |

### Business Metrics
| Metric | Description |
|--------|-------------|
| User Sign-ups | Total registered accounts |
| DAU / MAU | Daily and monthly active users |
| Consultant Sessions Booked | Volume of expert consultations |
| 7-day / 30-day Retention | User return rate |

### Trust Signals
| Signal | Description |
|--------|-------------|
| Reduced AI Abandonment | Users staying through full AI response |
| Consultant Escalation Usage | % of sessions that escalate to a human |
| Positive Safety Feedback | Explicit and implicit positive safety signals |

---

## 13. Build Phases

### Phase 1 — Foundation (Current)
- Project scaffold (Next.js + Convex + Clerk)
- Design system tokens
- GitHub repo + CI setup
- Home page (marketing landing)

### Phase 2 — Core Product
- Authentication flows (sign up, sign in, onboarding)
- User dashboard
- AI educational chat (Groq + RAG pipeline)
- Herb knowledge base (PDF ingestion → Convex vector store)

### Phase 3 — Herb Recognition
- Image upload + AI identification
- Safety score display
- Herb detail pages

### Phase 4 — Consultation Layer
- Consultant chat interface
- Live agent escalation from AI chat
- Consultant dashboard (admin side)

### Phase 5 — Content & Community
- Blog / research article hub
- Comments system
- Herb saving + activity history

### Phase 6 — Admin & Moderation
- Admin content management
- Knowledge base management (PDF uploads)
- User moderation tools

---

## 14. Engineering Conventions

All engineers working on this project must follow these rules:

1. **Never hardcode hex values** — use design tokens from `lib/design-tokens.ts`
2. **Every component has a JSDoc comment** explaining what it renders and why
3. **`"use client"` only where state is needed** — default to server components
4. **All images use `next/image`** with proper `width`, `height`, and `alt`
5. **No inline styles** — Tailwind classes only
6. **No new packages without team discussion** — keep the dependency tree lean
7. **TypeScript strict** — zero `any` types, zero type errors before committing
8. **shadcn/ui for all common UI** — Button, Sheet, Accordion, Dialog, etc.
9. **Section components live in `components/marketing/`** (marketing pages) or `components/dashboard/`** (app pages)
10. **Commit format:** `type(scope): description` — e.g., `feat(hero): add herb scan card component`

---

## 15. Key Decisions Log

| Decision | Rationale |
|----------|-----------|
| Groq over OpenAI for chat | Cheaper, faster for RAG conversations; OpenAI reserved for embeddings only |
| Convex vector search over Pinecone | Keeps backend in one service; sufficient for this use case |
| Inngest for file ingestion | Async background jobs; handles retries; PDF parse → embed → store pipeline |
| No e-commerce in scope | Keeps trust focus — product is educational, not commercial |
| No medical diagnosis | Legal, ethical, and trust reasons; platform is explicitly educational |
| Clerk Organizations deferred | Relevant for team/clinic use cases — defer to Phase 5+ |

---

*This document is the single source of truth for product decisions on Herbal Mind. Any scope changes, new features, or architectural decisions must be reflected here before implementation begins.*
