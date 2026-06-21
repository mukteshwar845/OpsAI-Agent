# Technical Requirements Document (TRD)

## OpsAI Enterprise Fleet & Alert Agent - System Architecture & Technical Specifications

This document outlines the system architecture, code-level capabilities, technology stack, and active/passive integration connections for the **OpsAI Agent** application.

---

## 1. System Overview & Core Capabilities

The OpsAI Agent application is a high-availability, full-stack, AI-assisted operational monitoring panel designed for enterprise cloud, container, and computer fleet managers. It parses telemetry anomalies, tracks fleet health scores, flags security incidents, logs operations, and translates alerts into human-actionable recommendations.

### Key Capabilities
1. **Interactive Real-Time Simulation Panel**: Dynamic dashboard showcasing multi-region nodes, detailed device statuses, memory/CPU trends, and instant quarantine control flows.
2. **AI-Powered Diagnostics**: Formulates granular causal paths using the modern Google Gemini API via server-side secure endpoints.
3. **Conversational SRE Copilot Chat**: Interactive conversational console powered by `gemini-3.5-flash` with contextual prompt filters, live telemetry readings, and executable action bindings.
4. **Manual Analysis Input Engine**: Empowers engineers to type specific diagnostic complaints (e.g., memory leak, high latency) and receive immediate contextual Recommendation Cards.
5. **Interactive Action Overrides & Custom Escalations**: Enables human-in-the-loop review to edit commands, write execution justifications, or forward anomalies directly to Slack/PagerDuty models.
6. **Universal Layout Compatibility**: Multi-tier adaptive styling engine prioritizing mobile touchscreen gestures (Android/iOS) and responsive workspace configurations on laptop/desktop monitor profiles.

---

## 2. Technology Stack & Framework Choices

| Layer | Technology | Version | Primary Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Runtime** | **React** | `^19.0.1` | Declarative UI views, component states, and modern hooks. |
| **Backend Runtime** | **Node.js** | `>=18` | Host environment for server-side endpoints and asset delivery. |
| **CSS Compiler** | **Tailwind CSS (V4)** | `^4.1.14` | Styling utility compiler with `@tailwind` directives. |
| **Build / Dev Automation** | **Vite / tsx** | `^6.2.3` | High-fidelity bundling, hot-loading web asset pipelines, and TS on-the-fly execution. |
| **TS Server Bundler** | **esbuild** | `^0.25.0` | Packs backend TypeScript `server.ts` into a self-contained CommonJS `dist/server.cjs`. |
| **Server Framework** | **Express.js** | `^4.21.2` | Exposes lightweight, secure API endpoints. |
| **Vector Library** | **Lucide React** | `^0.546.0` | Consistent, accessible, light-weight SVG vector iconography. |
| **Animation Engine** | **Motion** | `^12.23.24` | Fluid element entrances, slide-ups, accordion layouts, and drawer transitions. |

---

## 3. Active Connections vs. Not Used / Standby Elements

### 🟢 Active Connections (Fully Configured & Functional)
1. **REST API Proxy Gateway**: 
   - A secure server-side bridge between the React Client and Express host.
   - Restricts API credentials to backend execution boundaries (never exposed in source codes or browser dev consoles).
2. **Google Gemini GenAI SDK**:
   - Integrates the modern `@google/genai` library pointing directly to `gemini-3.5-flash`.
   - Connected server-side through `process.env.GEMINI_API_KEY`.
   - Contains a robust **fault-tolerant graceful fallback engine** that continues generating highly relevant incident reports even if the API Key is offline.
3. **Client-Side Theme Persistence Connection**:
   - Synchronizes light, dark, or system preference settings cleanly with the browser's `localStorage` state container.

### 🔴 Not Used / Standby Components (Simulated / Staged for Future Integration)
1. **Durable Database Layer (SQL/NoSQL)**: 
   - **Status**: *Not Used/Simulated*.
   - **Detail**: There is currently no database server (like PostgreSQL, MySQL, or Firebase Firestore) running. The state is transiently maintained in React runtime memories and memory logs on the Express app layer.
2. **Third-Party Identity & SSO Providers (OAuth / Okta / Azure AD)**:
   - **Status**: *Not Used/Simulated*.
   - **Detail**: Application uses immediate, unauthenticated console panels suitable for demo workspaces.
3. **Production Webhook Channels (Slack API, PagerDuty Trigger SDKs)**:
   - **Status**: *Simulated*.
   - **Detail**: "Escalate Incident" or forwarding recommendations to team managers executes interactive animations and registers entries in local logs, but does not transmit outbound network webhooks to external URLs.

---

## 4. Key API Endpoints & Interfaces

### Backend Endpoints (`server.ts`)
*   **`GET /api/health`**: Diagnostic baseline returning timestamps.
*   **`POST /api/gemini/reasoning`**: Consumes Recommendation contexts and streams diagnostic causal mappings.
*   **`POST /api/gemini/generate-recommendation`**: Accepts arbitrary diagnostic inputs to construct complete, UI-compatible Recommendations with estimated recovery durations.
*   **`POST /api/gemini/chat`**: Connects to the server-side `@google/genai` model `gemini-3.5-flash` with conversation history and returns secure diagnostic replies with fallback routines.

### Core Data Models (`src/types.ts`)
*   `Recommendation`: Manages details, confidence thresholds, actions, status overrides, and custom restrictions.
*   `ReasoningChain`: Structuring pattern matches, temporal link associations, forecasts, and action steps.
*   `DeviceStatus`: Controls container/device parameters (regions, uptime, memory, cpu states).

---

## 5. Interface Design & Responsiveness Principles
*   **Android & Mobile Friendliness**: Added modular dynamic burger drawer slide-outs for standard navigation, expanded touch-interactive targets, and scroll-aligned overflow grids for dense telemetry tables.
*   **Laptop & Window Scaling**: Includes dual-pane bento grids matching high horizontal densities, structured side navigation menus, and clean relative text sizes.
