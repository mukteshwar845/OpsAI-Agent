import React, { useState } from "react";
import { 
  BookOpen, 
  Download, 
  Printer, 
  Terminal, 
  Cpu, 
  Database, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Key, 
  MessageSquare,
  FileText,
  Clock,
  Sparkles,
  Server
} from "lucide-react";

export default function SystemDocsView() {
  const [activeSection, setActiveSection] = useState<string>("all");
  const [expandedSection, setExpandedSection] = useState<Record<string, boolean>>({
    arch: true,
    tech: true,
    market: true
  });

  const toggleExpand = (sect: string) => {
    setExpandedSection(prev => ({ ...prev, [sect]: !prev[sect] }));
  };

  // Human-friendly trigger to download Markdown documentation
  const handleDownloadMD = () => {
    const markdownContent = `
# OpsAI Enterprise Fleet & Alert Agent - Technical Documentation
Created for: SRE Operators & Administrators
Timestamp: ${new Date().toLocaleString()}

Complete architectural specifications and system manual. Please refer to /PROJECT_DOCUMENT.md on your deployment environment.
`;
    const blob = new Blob([markdownContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "OpsAI_System_Manual.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Human-friendly trigger to print the screen as PDF
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div id="opsai-system-docs" className="space-y-6 font-sans">
      
      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 p-6 rounded-xl shadow-xs transition-colors">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] bg-indigo-600 dark:bg-indigo-500 text-white px-2.5 py-0.5 rounded font-mono uppercase tracking-widest font-bold">
              Engineering Manual
            </span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 px-2 py-0.5 rounded font-mono font-semibold">
              v1.0.0
            </span>
          </div>
          <h2 className="text-[20px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-tight mt-2">
            OpsAI System Architecture & Technical Specifications
          </h2>
          <p className="text-[12px] text-[#45464d] dark:text-slate-400">
            A granular blueprint detailing system integration, codebase structure, and advanced market-ready scaling steps.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDownloadMD}
            className="px-3.5 py-2 rounded-lg bg-[#f2f4f6] dark:bg-slate-800 text-[#191c1e] dark:text-slate-100 hover:bg-[#eceef0] dark:hover:bg-slate-750 font-bold text-[11px] font-mono border border-[#c6c6cd] dark:border-slate-700 flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
            title="Download detailed text document"
          >
            <Download className="w-4 h-4" />
            <span>Download .TXT SDK Guide</span>
          </button>
          
          <button
            type="button"
            onClick={handlePrintPDF}
            className="px-3.5 py-2 rounded-lg bg-black dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-slate-850 dark:hover:bg-slate-200 font-bold text-[11px] font-mono flex items-center space-x-2 transition-all cursor-pointer active:scale-95 shadow-sm shadow-indigo-500/10"
            title="Trigger native page print/export as PDF"
          >
            <Printer className="w-4 h-4 animate-pulse" />
            <span>Print or Export as PDF file</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Bento Cards of Information */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Quick Readme Card: Executive Summary */}
        <div className="md:col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
            <h3 className="text-[13px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-500" />
              Executive Outline
            </h3>
            <p className="text-[12px] leading-relaxed text-[#45464d] dark:text-slate-350">
              The OpsAI Agent application serves as an operational safety board. By monitoring multi-region telemetry anomalies, it leverages Gemini 3.5 Flash to automatically recommend remedies, outline causality diagnostics, and allow human overrides with full audit logs.
            </p>
            
            <div className="border-t border-[#eceef0] dark:border-slate-800 pt-3 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Codebase Files:</span>
                <span className="font-bold text-slate-800 dark:text-slate-202">~14 core modules</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Main Entrypoints:</span>
                <span className="font-bold text-slate-801 dark:text-slate-202">server.ts / App.tsx</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Auth & DB Status:</span>
                <span className="font-bold text-amber-500">Transient (Staged)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gemini LLM Level:</span>
                <span className="font-bold text-indigo-500">Gemini-3.5-Flash</span>
              </div>
            </div>
          </div>

          {/* Technology Vector Stack */}
          <div className="bg-[#0b0f19] text-slate-100 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Active TS Stack
              </h3>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                Compiled
              </span>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-805 space-y-1">
                <p className="font-bold text-slate-100">Frontend View Engine</p>
                <p className="text-[10px] text-slate-400">React 19, Motion, Recharts</p>
              </div>
              
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-805 space-y-1">
                <p className="font-bold text-slate-101">Backend Controller API</p>
                <p className="text-[10px] text-slate-400">Express Gate, tsx, esbuild</p>
              </div>

              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-805 space-y-1">
                <p className="font-bold text-emerald-401">LLM / Cognitive Layer</p>
                <p className="text-[10px] text-slate-400">@google/genai (TypeScript SDK)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Explanation Panels */}
        <div className="md:col-span-12 lg:col-span-8 space-y-6">
          
          {/* Section A: Which part does what */}
          <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleExpand("arch")}
              className="w-full px-5 py-4 bg-[#f2f4f6]/50 dark:bg-slate-900/35 border-b border-[#eceef0] dark:border-slate-800 flex items-center justify-between font-bold text-[13px] uppercase tracking-wider text-slate-800 dark:text-slate-101 cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Server className="w-4.5 h-4.5 text-indigo-500" />
                Codebase Component Breakdown (Which Part Does What)
              </span>
              {expandedSection.arch ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSection.arch && (
              <div className="p-5 space-y-4 divide-y divide-slate-100 dark:divide-slate-800 animate-fade-in select-text">
                <div className="space-y-1 pb-3">
                  <p className="text-[12.5px] font-bold text-indigo-700 dark:text-indigo-400 font-mono">1. Backend API Proxy (server.ts)</p>
                  <p className="text-[12px] leading-relaxed text-[#45464d] dark:text-slate-300">
                    Provides server-safe, headless integration. Securely hosts API routing interfaces to isolate API credentials, connects with Google's modern Gemini SDK with fallback algorithms, and serves compiled client static assets.
                  </p>
                </div>
                
                <div className="space-y-1 pt-3 pb-3">
                  <p className="text-[12.5px] font-bold text-indigo-700 dark:text-indigo-400 font-mono">2. Application Hub (App.tsx)</p>
                  <p className="text-[12px] leading-relaxed text-[#45464d] dark:text-slate-300">
                    Coordinates global reactive states (distributed virtual devices data, theme settings, SRE credentials). Acts as the main router orchestrating state transitions.
                  </p>
                </div>

                <div className="space-y-1 pt-3 pb-3">
                  <p className="text-[12.5px] font-bold text-indigo-700 dark:text-indigo-400 font-mono">3. Dashboard View (components/DashboardView.tsx)</p>
                  <p className="text-[12px] leading-relaxed text-[#45464d] dark:text-slate-300">
                    Renders the visual multi-region map nodes summary, health indices, and current quarantine logs. Contains interactive triggers so operators can select recommendations easily.
                  </p>
                </div>

                <div className="space-y-1 pt-3 pb-3">
                  <p className="text-[12.5px] font-bold text-indigo-700 dark:text-indigo-400 font-mono">4. SRE Copilot Chat (components/AICopilotView.tsx)</p>
                  <p className="text-[12px] leading-relaxed text-[#45464d] dark:text-slate-300">
                    Interactive diagnostic chat driven by Gemini. Lets operators query active logs and execute real-time mitigation actions natively during live troubleshooting discussions.
                  </p>
                </div>

                <div className="space-y-1 pt-3">
                  <p className="text-[12.5px] font-bold text-indigo-700 dark:text-indigo-400 font-mono">5. Causal Graph Panel (components/ReasoningPanel.tsx)</p>
                  <p className="text-[12px] leading-relaxed text-[#45464d] dark:text-slate-300">
                    Visualizes step-by-step causal paths explaining exactly why Gemini made a specific operational recommendation. Shows root causes, timelines of events, and safety guard justifications.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section B: How it works (Data Flow) */}
          <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleExpand("tech")}
              className="w-full px-5 py-4 bg-[#f2f4f6]/50 dark:bg-slate-900/35 border-b border-[#eceef0] dark:border-slate-800 flex items-center justify-between font-bold text-[13px] uppercase tracking-wider text-slate-800 dark:text-slate-101 cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4.5 h-4.5 text-indigo-500" />
                Technical Working Mechanism & Data Flow
              </span>
              {expandedSection.tech ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSection.tech && (
              <div className="p-5 space-y-4 animate-fade-in leading-relaxed text-[12px] text-[#45464d] dark:text-slate-300 select-text">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px] text-center">
                  <div className="p-3 bg-indigo-50/40 dark:bg-slate-900/60 rounded-lg border border-indigo-100 dark:border-slate-800 space-y-1">
                    <p className="font-bold text-indigo-700 dark:text-indigo-400">1. INPUT telemetry</p>
                    <p className="text-[10px] text-slate-500 leading-normal">Virtual telemetry tickers trigger alert limits (CPU &gt; threshold).</p>
                  </div>
                  
                  <div className="p-3 bg-indigo-50/40 dark:bg-slate-900/60 rounded-lg border border-indigo-100 dark:border-slate-800 space-y-1">
                    <p className="font-bold text-indigo-700 dark:text-indigo-400">2. SECURE RESOLVER</p>
                    <p className="text-[10px] text-slate-500 leading-normal">Client triggers `/api/gemini/reasoning` to proxy data cleanly to Gemini API.</p>
                  </div>

                  <div className="p-3 bg-indigo-50/40 dark:bg-slate-900/60 rounded-lg border border-indigo-100 dark:border-slate-800 space-y-1">
                    <p className="font-bold text-indigo-700 dark:text-indigo-400">3. COGNITIVE FEEDBACK</p>
                    <p className="text-[10px] text-slate-500 leading-normal">Response formats dynamic causal chains, timelines, and quarantine rules.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/25 border border-[#eceef0] dark:border-slate-850 rounded-lg space-y-1 mt-2">
                  <p className="font-bold text-slate-800 dark:text-slate-205 flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    Offline Autonomic Fallback Protocol
                  </p>
                  <p className="text-[11px] leading-relaxed mb-1">
                    The Express server implements a built-in offline resiliency layer. If the cloud Gemini connection fails or a credentials key is absent, the backend invokes a secure local diagnostic engine to compile structured recommendations instantly, preventing app failure.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section C: Advanced Market Ready Steps */}
          <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleExpand("market")}
              className="w-full px-5 py-4 bg-[#f2f4f6]/50 dark:bg-slate-900/35 border-b border-[#eceef0] dark:border-slate-800 flex items-center justify-between font-bold text-[13px] uppercase tracking-wider text-slate-800 dark:text-slate-101 cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                Advanced "Market-Ready" Upgrade Roadmap
              </span>
              {expandedSection.market ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSection.market && (
              <div className="p-5 space-y-5 animate-fade-in leading-relaxed text-[12px] text-[#45464d] dark:text-slate-300 select-text">
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 shrink-0 font-mono flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 font-mono text-[12.5px]">Production Persistence Layer (Database Integration)</h4>
                    <p className="text-[11.5px] mt-0.5 text-[#5c5d64] dark:text-slate-400">
                      Connect a live **Google Cloud SQL (PostgreSQL)** database using **Drizzle ORM** at `/src/db/` to define schemas for `devices`, `recommendations`, and audit logs, securing audit logs and operations history permanently.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-101 shrink-0 font-mono flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 font-mono text-[12.5px]">Real Ingress Webhook Monitors</h4>
                    <p className="text-[11.5px] mt-0.5 text-[#5c5d64] dark:text-slate-400">
                      Expose an intake route (e.g., `POST /api/telemetry/webhook`) connecting the framework directly to prometheus alerts, Grafana telemetry monitors, or AWS CloudWatch triggers, driving recommendations with true alerts.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-101 shrink-0 font-mono flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 font-mono text-[12.5px]">Enterprise Single Sign-On (SSO / IAM)</h4>
                    <p className="text-[11.5px] mt-0.5 text-[#5c5d64] dark:text-slate-400">
                      Introduce OAuth2 credentials blocks (like Google Workspace, Active Directory, or Okta credentials) to secure authentication, enforce access scopes, and trace administrative containment actions directly to active SRE profiles.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-101 shrink-0 font-mono flex items-center justify-center font-bold text-xs">
                    04
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 font-mono text-[12.5px]">Active Containment Runners (Kubernetes & SSH Ansible)</h4>
                    <p className="text-[11.5px] mt-0.5 text-[#5c5d64] dark:text-slate-400">
                      Bind the backend with Kubernetes `@kubernetes/client-node` or secure SSH execution agents. When an SRE authorizes an action (e.g., quarantine), the runner executes actual active `kubectl cordon` or load balancer redirection parameters in safety networks.
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
