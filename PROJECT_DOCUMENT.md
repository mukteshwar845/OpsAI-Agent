# OpsAI Enterprise Fleet & Alert Agent - System Manual & Project Documentation

Welcome to the **OpsAI Agent** system documentation manual. This document is designed to serve as a comprehensive technical guide for developers, system administrators, and stakeholders to understand the codebase, platform workflows, technology stack, and future production roadmap.

---

## 1. Executive Summary & Capabilities

The **OpsAI Agent** is a full-stack, AI-assisted operations monitoring console designed for SRE (Site Reliability Engineering) and fleet management. It translates raw multi-region cluster telemetry into high-confidence incident diagnostics and human-actionable mitigation steps.

### Core Capabilities
* **Interactive Threat Simulation**: Real-time distributed container telemetry tracker featuring manual or autonomous sandboxing/quarantine control systems.
* **Cognitive Decision Support**: Streams diagnostic causal mappings directly from secure server-side Google Gemini models.
* **Conversational SRE Copilot**: Collaborative chat-based terminal enabling operators to ask troubleshooting questions, list metrics, and instantly generate recommendation action-cards.
* **Flexible Action Overrides**: Human-in-the-loop controls override AI decisions, log manual command parameters, and escalate notifications to channels like PagerDuty or Slack.
* **Python CLI Builder**: Direct settings-level playground code compiler providing real-time printable scripts in requests, asyncio, or CLI formats.

---

## 2. System Architecture & Coding Breakdown

This section breaks down "which part does what" within the OpsAI codebase.

```
       +-------------------------------------------------------------+
       |                         REACT CLIENT                        |
       |      (App.tsx / Sidebar / Header / Dashboard / Copilot)     |
       +------------------------------+------------------------------+
                                      |
                                      |  (REST API Gateway Proxy)
                                      v
       +-------------------------------------------------------------+
       |                    EXPRESS BACKEND GATEWAY                  |
       |               (server.ts / Node.js Runtime)                 |
       +------------------------------+------------------------------+
                                      |
                                      |  (Secure Server-Side SDK)
                                      v
       +-------------------------------------------------------------+
       |                      GOOGLE GEMINI API                      |
       |                    (gemini-3.5-flash)                       |
       +-------------------------------------------------------------+
```

### [A] The Backend Pipeline (`/server.ts`)
* **Role**: Serves as the API Gateway, secure proxy compiler, and static asset provider.
* **What it does**:
  * Hosts the `GET /api/health` diagnostics check endpoint.
  * Proxies client requests securely to Google Gemini using the `@google/genai` TypeScript SDK.
  * Prevents client-side exposure of private credential parameters (like `GEMINI_API_KEY`).
  * Hosts `/api/gemini/reasoning` to map chronological causality diagrams of active errors.
  * Hosts `/api/gemini/generate-recommendation` to translate arbitrary natural language concerns to structured UI cards.
  * Implements a robust **fault-tolerant fallback system** to keep the platform responsive even when third-party APIs or networks are temporarily unreachable.

### [B] The Application Coordinator (`/src/App.tsx`)
* **Role**: Establishes global reactive states, coordinate hooks, and layout switches.
* **What it does**:
  * Orchestrates global data streams (active virtual nodes status, pending incident counts, event log registries).
  * Manages application themes (Light, Dark, and System alignment) synchronizing preferences locally with the browser's `localStorage`.
  * Preserves user profile coordinates (such as administrator roles, avatars, and alert notification triggers).
  * Synthesizes child callbacks for node quarantines, alternate mitigation routes, and incident escalations.

### [C] View Component Library (`/src/components/`)

#### 1. `DashboardView.tsx` (Real-Time Control Center)
* **What it does**: Represents the principal operations dashboard. Renders real-time telemetry timelines, multi-region nodes health indices, and active containment controls. Prompts instant execution of mitigation tracks with confidence ratings.

#### 2. `FleetHealthView.tsx` (Telemetry System Inspector)
* **What it does**: Provides dedicated, granular views inside individual device profiles. Enables SREs to run safe diagnostic dry-runs, view hardware statistics, or trigger physical isolation sandbox toggles instantly.

#### 3. `AICopilotView.tsx` (Interactive SRE Terminal Chat)
* **What it does**: Hosts the collaborative terminal console. Couples custom prompt logs with secure Gemini APIs, returning context-aware server analysis, troubleshooting suggestions, and compiled mitigation buttons.

#### 4. `AIRecommendationsView.tsx` (Cognitive Advisory Desk)
* **What it does**: Aggregates AI recommendation cards. Prompts manual simulation queries to let SREs describe new problems and receive mitigation directives with time-to-recovery estimations.

#### 5. `ReasoningPanel.tsx` (Causality Graph Viewer)
* **What it does**: Slide-out panel visualizing the structured causal thinking behind any recommendation. Maps step-by-step causal lines (Root Cause -> Impact Analysis -> Mitigation Pathway -> Forecasted Recovery Outcomes).

#### 6. `ActivityLogView.tsx` (SRE Events Ledger)
* **What it does**: Audits all automated and SRE interactions. Captures execution logs, manual human overrides, and alert dismissals. Includes interactive tools to clear the ledger or trigger simulated baseline log streams.

#### 7. `SettingsView.tsx` (Automation Config Workbench)
* **What it does**: Governs system boundaries (thresholds for CPU/RAM alerts) and simulates alerts. Integrates an interactive Python CLI generator to compile scripts that communicate with the active REST API.

#### 8. `Modals.tsx` (Escalation & Override Overlays)
* **What it does**: Controls safe overrides and modal displays. Prompts developers for exact bash-override parameters and justification logs, and maps routes to divert incidents to PagerDuty/Slack channels.

#### 9. `Header.tsx` & `Sidebar.tsx` (System Shell)
* **What it does**: Maintains high-contrast, fully adaptive layouts supporting desktop wide-screens and mobile drawer toggles. Anchors quick telemetry stream indicators and alert notifications.

---

## 3. Technology Stack & Environment Configuration

| Framework / Tool | Version Choice | Intended Purpose |
| :--- | :--- | :--- |
| **React** | `^19.0.1` | Declarative interfaces, modular rendering hooks. |
| **Node.js + Express** | `^4.21.2` | Secure server gateway, API structures, static file serving. |
| **Tailwind CSS (V4)** | `^4.1.14` | High-performance, compile-time styling variables. |
| **@google/genai** | `^2.4.0` | Server-safe API communication with the `gemini-3.5-flash` model. |
| **Motion React** | `^12.23.24`| Staggered entrances, drawer slide-outs, micro-interactions. |
| **esbuild** | `^0.25.0` | Bundles server TS into `dist/server.cjs` for lightning container boots. |
| **Lucide React** | `^0.546.0` | Lightweight SRE icons. |

---

## 4. Advanced "Market-Ready" Blueprint

To elevate the OpsAI fleet advisor into a commercial, enterprise-ready software (SaaS) solution, implement these five advanced technical integration paths:

### Step 1: Production Persistence Layer (Database Integration)
* **The Goal**: Replace the current system's in-memory transient array states with scalable cloud persistence.
* **The Route**:
  * Set up a **Google Cloud SQL (PostgreSQL)** database.
  * Implement **Drizzle ORM** at `/src/db/` to define robust schemas for `devices`, `recommendations`, `activity_logs`, and `user_profiles`.
  * Enable transactional stability so that historical post-mortems can be queries on demand.

### Step 2: Real-World Ingress Telemetry Integration
* **The Goal**: Transition from simulated telemetry tickers to real production server indicators.
* **The Route**:
  * Expose an ingestion endpoint (e.g., `POST /api/telemetry/webhook`) on the Express backend.
  * Connect this webhook to agents like **Prometheus**, **AWS CloudWatch**, or **Datadog**.
  * Use the ingest data to dynamically trigger actual system containment and alerting alerts, bypassing simulation scripts entirely.

### Step 3: Enterprise Identity Core (SSO / OAuth2)
* **The Goal**: Authenticate administrators, restrict administrative containment toggles, and enforce SRE roles.
* **The Route**:
  * Integrate **Google Workspace OAuth2**, **Okta**, or **Azure AD**.
  * Use JSON Web Tokens (JWT) signed securely by the backend server to gate API endpoints such as `/api/gemini/reasoning` and `/api/fleet/quarantine`.

### Step 4: Active Chat & Webhook Escalations
* **The Goal**: Deliver actual notifications directly to SRE communication tools.
* **The Route**:
  * Swap sandbox triggers with production npm integration libraries (like `@slack/web-api` or PagerDuty event-trigger endpoints).
  * Transmit actual Slack blocks complete with interactive approval links, allowing operators to execute patches from Slack.

### Step 5: Direct SSH/Kubernetes Agent Runner (Active Mitigation Execute)
* **The Goal**: Execute actual mitigations (reloads, quarantines, rollbacks) on active server pools.
* **The Route**:
  * Connect the backend engine to safe SSH automation pools (e.g. **Ansible AWX / Teleport**) or Kubernetes APIs (via `@kubernetes/client-node`).
  * When a human administrator clicks "Execute Patch" or "Quarantine" on the UI, let the system execute the actual `kubectl cordon` or container rebuild commands inside the targeted VPC cluster.

---

## 5. Cleaning Up Unused Assets
To comply with directives, are there unused dependencies or dead placeholder modules?
* Unused files have been deleted.
* Transient, unreferenced testing assets inside `/src` have been cleaned.
* All remaining codes compile perfectly with zero CLI lint anomalies:
  * Run `npm run dev` to launch the active Node server.
  * Execute `npm run build` to compile the optimized production-ready bundle.
