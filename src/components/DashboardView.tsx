import React from "react";
import { Recommendation } from "../types";
import { 
  Activity, 
  Database, 
  Clock, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  X, 
  Undo, 
  Zap, 
  ArrowRight,
  Sliders,
  Sparkles,
  ShieldAlert,
  Send,
  GitBranch,
  ShieldAlert as ShieldIcon
} from "lucide-react";

interface DashboardViewProps {
  recommendations: Recommendation[];
  selectedRecommendation: Recommendation | null;
  onSelectRecommendation: (rec: Recommendation) => void;
  onExecute: (id: string, actionName: string) => void;
  onDismiss: (id: string) => void;
  filterBy: string;
  setFilterBy: (filter: string) => void;
  autonomyMode: "always-ask" | "act-notify" | "fully-autonomous";
  setAutonomyMode: (mode: "always-ask" | "act-notify" | "fully-autonomous") => void;
  onOpenAlternatives: (rec: Recommendation) => void;
  onOpenOverride: (rec: Recommendation) => void;
  onOpenEscalate: (rec: Recommendation) => void;
}

export default function DashboardView({
  recommendations,
  selectedRecommendation,
  onSelectRecommendation,
  onExecute,
  onDismiss,
  filterBy,
  setFilterBy,
  autonomyMode,
  setAutonomyMode,
  onOpenAlternatives,
  onOpenOverride,
  onOpenEscalate,
}: DashboardViewProps) {
  // Sort or filter recommendations
  const filteredRecs = [...recommendations]
    .filter((r) => !r.isDismissed)
    .sort((a, b) => {
      if (filterBy === "Highest Confidence") {
        return b.confidence - a.confidence;
      } else {
        // High severity first
        const priority = { high: 3, medium: 2, low: 1 };
        return priority[b.severity] - priority[a.severity];
      }
    });

  const pendingCount = recommendations.filter((r) => !r.isExecuted && !r.isDismissed).length;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top section: Fleet Summary Header Banner */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-[#191c1e] dark:text-slate-55 text-[28px] font-bold tracking-tight">Fleet Summary</h2>
          <p className="text-[#45464d] dark:text-slate-300 text-[15px] mt-1">
            Real-time status for distributed enterprise infrastructure.
          </p>
        </div>
        <div className="flex space-x-4 shrink-0">
          <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 p-4 rounded-xl min-w-[150px] shadow-sm">
            <p className="text-[11px] text-[#45464d] dark:text-slate-400 font-bold uppercase tracking-wider">Total Devices</p>
            <p className="text-[28px] font-bold text-[#191c1e] dark:text-slate-100 mt-1 leading-none font-mono">3,420</p>
          </div>
          <div className="bg-[#131b2e] dark:bg-slate-950 p-4 rounded-xl min-w-[150px] shadow-md border border-[#2d3133] dark:border-slate-800">
            <p className="text-[11px] text-[#7c839b] font-bold uppercase tracking-wider">Pending Actions</p>
            <p className="text-[28px] font-bold text-white mt-1 leading-none font-mono">{pendingCount}</p>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left column (3 cols) */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-5">
          
          {/* Autonomy Dial Widget */}
          <div className="bg-white dark:bg-[#0f172a] border-2 border-slate-900 dark:border-slate-850 p-5 rounded-2xl shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-slate-950 dark:bg-slate-800 text-white font-mono text-[9px] px-2.5 py-0.5 rounded-bl font-semibold uppercase tracking-wider">
              Autopilot Dial
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <Sliders className="w-5 h-5 text-slate-800 dark:text-slate-200" />
              <h3 className="text-[13px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider">Autonomy Calibration</h3>
            </div>
            
            <p className="text-[11px] text-[#45464d] dark:text-slate-300 leading-relaxed mb-4">
              Calibrate operational clearance of the OpsAI remediation daemon across active node pools.
            </p>

            {/* Dial selectors */}
            <div className="space-y-2">
              <button
                onClick={() => setAutonomyMode("always-ask")}
                className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                  autonomyMode === "always-ask"
                    ? "bg-slate-950 dark:bg-slate-900 text-white border-slate-950 dark:border-slate-800 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-105 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Always Ask</span>
                  {autonomyMode === "always-ask" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </div>
                <p className={`text-[10px] mt-1 ${autonomyMode === "always-ask" ? "text-slate-300" : "text-slate-500"}`}>
                  Strict validation gate. All containment paths require manual token authorization.
                </p>
              </button>

              <button
                onClick={() => setAutonomyMode("act-notify")}
                className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                  autonomyMode === "act-notify"
                    ? "bg-slate-950 dark:bg-slate-900 text-white border-slate-950 dark:border-slate-800 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-105 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Act & Notify</span>
                  {autonomyMode === "act-notify" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </div>
                <p className={`text-[10px] mt-1 ${autonomyMode === "act-notify" ? "text-slate-300" : "text-slate-500"}`}>
                  AI handles Low/Med incidents autonomously. High-Severity incidents still enforce review gating.
                </p>
              </button>

              <button
                onClick={() => setAutonomyMode("fully-autonomous")}
                className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                  autonomyMode === "fully-autonomous"
                    ? "bg-gradient-to-r from-red-950 to-indigo-950 dark:from-red-900 dark:to-indigo-900 text-white border-slate-900 dark:border-slate-800 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Full Sandbox Pilot</span>
                  {autonomyMode === "fully-autonomous" && <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />}
                </div>
                <p className={`text-[10px] mt-1 ${autonomyMode === "fully-autonomous" ? "text-slate-300" : "text-slate-500"}`}>
                  Continuous automated sandboxing. Autonomous dispatch, post-containment telemetry reports.
                </p>
              </button>
            </div>

            {/* Adaptivity explanation footer band */}
            <div className="mt-4 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 text-[10px] text-[#45464d] dark:text-slate-300 leading-normal font-medium">
              <span className="font-bold text-slate-950 dark:text-white uppercase tracking-wider font-mono">Interface Adaptation Mode: </span>
              {autonomyMode === "always-ask" && "Standard high-contrast control matrices mounted. Actions default to human queue."}
              {autonomyMode === "act-notify" && "Autopilot indicators active on low-severity targets. High-impact targets restricted to manual fallback."}
              {autonomyMode === "fully-autonomous" && "Sandbox safety guidelines active. High-risk actions bypass authorization and log immediately."}
            </div>
          </div>

          {/* Fleet Health stats panel */}
          <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[13px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider">Fleet Health</h3>
              <Activity className="w-5 h-5 text-[#45464d] dark:text-slate-400" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[12px] text-[#45464d] dark:text-slate-300 mb-1.5">
                  <span className="font-medium">Uptime</span>
                  <span className="font-mono font-bold">99.98%</span>
                </div>
                <div className="w-full h-1 bg-[#eceef0] dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "99.98%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[12px] text-[#45464d] dark:text-slate-300 mb-1.5">
                  <span className="font-medium">Security Score</span>
                  <span className="font-mono font-bold">82/100</span>
                </div>
                <div className="w-full h-1 bg-[#eceef0] dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#131b2e] dark:bg-indigo-500 rounded-full" style={{ width: "82%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[12px] text-[#45464d] dark:text-slate-300 mb-1.5">
                  <span className="font-medium">AI Trust Score</span>
                  <span className="font-mono font-bold">94%</span>
                </div>
                <div className="w-full h-1 bg-[#eceef0] dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#eceef0] dark:border-slate-800 flex items-center justify-between text-[11px] text-[#45464d] dark:text-slate-400">
              <span className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1" /> Core Nodes Sync OK
              </span>
              <span className="font-mono text-[10px]">v1.4.2</span>
            </div>
          </div>

          {/* Fleet Distribution Map container */}
          <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 p-5 rounded-xl shadow-sm overflow-hidden relative min-h-[220px] flex flex-col justify-between">
            <div className="relative z-10">
              <h3 className="text-[13px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider">Fleet Distribution</h3>
              <p className="text-[11px] text-[#45464d] dark:text-slate-300 mt-0.5">Global region coverage</p>
            </div>
            
            {/* High fidelity image hotlinked from layout assets */}
            <div className="absolute inset-0 top-14">
              <img 
                className="object-cover w-full h-full opacity-65 dark:opacity-40 hover:scale-105 transition-transform duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDomjLoak3VJjM5tZwgpjY5s3_wuV5rmmt7yWeqCrjGd56Q6MBky1gylANqjGe0y_TR81fZvfpLofc4sgat_ZnNVJLGZXIOA9bnbqTr7HZqIwv9VkuBEdLJjA-nrvSPsUFtG6kr9bwMHImrCs8W0sJwreimkLPwnPnUmY4x6mfjD9TjE7vbCTch57viOtcAkibzfawHKmvrCYp_BG5F181QqDUG6SSjTObWDAMnw0mQn8HqfOwtxc67AOnQRCrHZTc6fnGWOreswpzm" 
                alt="Stylized global fleet map dots"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="relative z-10 pt-16 flex items-center justify-between text-[11px] font-mono font-medium text-[#45464d] dark:text-slate-300 bg-gradient-to-t from-white via-white/80 dark:from-[#0f172a] dark:via-[#0f172a]/80 to-transparent p-1 rounded">
              <span>EU: 1.4K Tasks</span>
              <span>US: 1.1K Tasks</span>
              <span>AP: 0.9K Tasks</span>
            </div>
          </div>
        </div>

        {/* Center column (9 cols) */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider flex items-center space-x-1.5">
              <span>AI recommendations Queue</span>
              {filteredRecs.length > 0 && (
                <span className="text-[10px] bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-2 py-0.5 rounded-full font-mono font-medium">
                  {filteredRecs.length} active
                </span>
              )}
            </h3>
            
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-[#45464d] dark:text-slate-300 uppercase tracking-wider font-bold">Sort Filter:</span>
              <select 
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="bg-[#f2f4f6] dark:bg-slate-900 text-[11px] border border-[#c6c6cd] dark:border-slate-800 rounded px-2.5 py-1 font-semibold text-[#191c1e] dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer uppercase tracking-wider transition-colors"
              >
                <option>Highest Confidence</option>
                <option>Severity</option>
              </select>
            </div>
          </div>

          {/* Cards Queue */}
          {filteredRecs.length === 0 ? (
            <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-[14px] font-bold text-[#191c1e] dark:text-slate-100">Recommendations Queue Entirely Clear</p>
              <p className="text-[12px] text-[#45464d] dark:text-slate-300 max-w-md">
                No active actions pending manual authentication. All systems are operating optimally under telemetry specifications.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecs.map((rec) => {
                const isSelected = selectedRecommendation?.id === rec.id;
                
                // FR-2: Confidence Display with contextualized qualitative labels
                let confidenceLabel = "";
                let confidenceDescNote = "";
                let confidenceBgColor = "";
                let confidenceTextColor = "";
                let borderBarColor = "";

                if (rec.confidence >= 80) {
                  confidenceLabel = "High Confidence";
                  confidenceBgColor = "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40";
                  confidenceTextColor = "text-emerald-800 dark:text-emerald-300";
                  borderBarColor = "bg-emerald-500";
                  confidenceDescNote = rec.influencingFactors?.[0] || "Influenced by direct software scans & model historical patterns.";
                } else if (rec.confidence >= 55) {
                  confidenceLabel = "Moderate Confidence";
                  confidenceBgColor = "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40";
                  confidenceTextColor = "text-amber-800 dark:text-amber-300";
                  borderBarColor = "bg-amber-500";
                  confidenceDescNote = rec.influencingFactors?.[0] || "Influenced by general system heuristics, model template drift.";
                } else {
                  confidenceLabel = "Review Recommended";
                  confidenceBgColor = "bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40";
                  confidenceTextColor = "text-red-800 dark:text-red-300";
                  borderBarColor = "bg-red-500";
                  confidenceDescNote = rec.influencingFactors?.[0] || "Requires senior verification. Device parameters show divergence.";
                }

                // Autonomy application adaptation representation
                const isLowMed = rec.severity !== "high";
                const isAutonomousExecuted = autonomyMode === "fully-autonomous" || (autonomyMode === "act-notify" && isLowMed);

                return (
                  <div 
                    key={rec.id}
                    id={`rec-card-${rec.id}`}
                    onClick={() => onSelectRecommendation(rec)}
                    className={`bg-white dark:bg-[#0f172a] border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer relative ${
                      isSelected ? "border-black dark:border-slate-100 ring-1 ring-black dark:ring-slate-100" : "border-[#c6c6cd] dark:border-slate-800"
                    }`}
                  >
                    {/* Top colored strip indicators */}
                    <div className={`h-1.5 w-full ${borderBarColor}`}></div>

                    {/* Autonomy Active Overlay Banner */}
                    {isAutonomousExecuted && !rec.isExecuted && (
                      <div className="bg-slate-900 dark:bg-slate-950 text-white px-4 py-1 text-[10px] font-mono flex items-center justify-between border-b border-slate-800 dark:border-slate-900">
                        <span className="flex items-center">
                          <Zap className="w-3 h-3 text-amber-400 mr-1.5 animate-pulse" />
                          <span>Autopilot Active: This action triggers asynchronously on timer completion</span>
                        </span>
                        <span className="bg-indigo-900 border border-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 rounded px-1 text-[9px] uppercase font-bold">
                          Autonomy bypass active
                        </span>
                      </div>
                    )}

                    {/* Card Content Row */}
                    <div className="p-5 flex flex-col xl:flex-row gap-5 items-start justify-between">
                      <div className="flex-grow space-y-2.5">
                        
                        {/* TAGS BLOCK */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wide border ${confidenceBgColor} ${confidenceTextColor}`}>
                            {confidenceLabel}
                          </span>
                          <span className="text-[#45464d] dark:text-slate-400 font-mono text-[11px] font-bold">{rec.id}</span>
                          
                          {rec.severity === "high" && (
                            <span className="bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                              CRITICAL HIGH-IMPACT
                            </span>
                          )}

                          {rec.isEscalated && (
                            <span className="bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider animate-pulse">
                              ESCALATED ➔ {rec.escalatedTo}
                            </span>
                          )}

                          {rec.isOverridden && (
                            <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                              OVERRIDDEN BY ADMIN
                            </span>
                          )}
                        </div>

                        {/* TITLE & DESCRIPTION */}
                        <div>
                          <h4 className="text-[17px] font-bold text-[#191c1e] dark:text-slate-100 leading-snug group-hover:text-black dark:group-hover:text-white transition-colors flex items-center space-x-1">
                            <span>{rec.title}</span>
                          </h4>
                          <p className="text-[13px] text-[#45464d] dark:text-slate-300 mt-1 pr-4 leading-relaxed">
                            {rec.description}
                          </p>
                        </div>

                        {/* FR-2: Display a one-line note on confidence influencing factors */}
                        <div className="bg-slate-50/80 dark:bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                          <span className="font-mono text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 shrink-0">Influencing:</span>
                          <span className="truncate italic">"{confidenceDescNote}"</span>
                        </div>

                        {/* FR-4: Known Limitations Disclosures */}
                        {rec.limitation ? (
                          <div className="flex items-start bg-amber-50/40 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200/50 dark:border-amber-900/40 max-w-3xl">
                            <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 mr-2 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-[#45464d] dark:text-slate-300">
                              <strong className="font-bold text-amber-800 dark:text-amber-352 font-mono uppercase tracking-wider">Known Limitation disclaimer:</strong> {rec.limitation}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-start bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/60 max-w-3xl">
                            <CheckCircle2 className="w-4 h-4 text-slate-500 mr-2 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              <strong className="font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">Verification catalog:</strong> Verified cleanly against baseline fleet configurations with no identified performance limitations.
                            </p>
                          </div>
                        )}

                        {/* FR-3: Data Source Attribution list in plain language format */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 max-w-3xl">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 font-mono flex items-center">
                            <Database className="w-3.5 h-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <span>Telemetry Source Attribution</span>
                          </p>
                          <div className="flex flex-col gap-1 text-[11px] text-[#45464d] dark:text-slate-400 font-mono">
                            {rec.sources && rec.sources.length > 0 ? (
                              rec.sources.map((src, sIdx) => (
                                <span key={sIdx} className="flex items-start">
                                  <span className="text-indigo-500 mr-1.5 shrink-0">•</span>
                                  <span>{src}</span>
                                </span>
                              ))
                            ) : (
                              <span className="flex items-center font-semibold">
                                <span>Based on </span>
                                <span className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-100 dark:border-slate-800 ml-1 font-bold">
                                  {rec.source}
                                </span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center pt-1 text-[11px] text-[#45464d] dark:text-slate-400 font-mono">
                            <Clock className="w-3.5 h-3.5 mr-1 text-[#76777d]" />
                            <span>Estimated Execution Duration:</span>
                            <strong className="text-slate-900 dark:text-slate-100 ml-1">{rec.estDuration}</strong>
                          </div>
                        </div>

                      </div>

                      {/* FR-5: Unified Human-in-the-Loop 5-Controls Matrix block */}
                      <div 
                        className="flex flex-col gap-2 w-full xl:w-[220px] shrink-0 pt-4 xl:pt-0 border-t xl:border-t-0 xl:border-l xl:pl-5 border-slate-200 dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()} // Stop click bubbling from selecting row
                      >
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Human-in-the-Loop Controls</p>
                        
                        {/* 1. APPROVE ACTION */}
                        {rec.isExecuted ? (
                          <div className="w-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/40 text-[#047857] dark:text-emerald-400 py-2.5 rounded-xl text-center font-bold text-[12px] flex items-center justify-center space-x-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="uppercase tracking-wider">Action Executed</span>
                          </div>
                        ) : rec.isEscalated ? (
                          <div className="w-full bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/45 text-indigo-700 dark:text-indigo-400 py-2 rounded-xl text-center font-bold text-[11px] flex items-center justify-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Awaiting Senior Review</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => onExecute(rec.id, rec.primaryAction)}
                            className="w-full bg-slate-950 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-950 py-2 px-3 rounded-xl text-[12px] font-bold tracking-wider transition-all cursor-pointer text-center uppercase flex items-center justify-center space-x-1"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600 mr-0.5" />
                            <span>Approve & Execute</span>
                          </button>
                        )}
                        
                        <div className="grid grid-cols-2 gap-1.5">
                          {/* 2. OVERRIDE CONTROL */}
                          <button
                            onClick={() => onOpenOverride(rec)}
                            disabled={rec.isExecuted || rec.isEscalated}
                            className="bg-white dark:bg-slate-900 border border-[#c6c6cd] dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 text-[#191c1e] dark:text-slate-300 py-1.5 px-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all cursor-pointer text-center uppercase"
                            title="Reject this agent advice and provide manual terminal commands"
                          >
                            Override
                          </button>

                          {/* 3. SEE ALTERNATIVES */}
                          <button
                            onClick={() => onOpenAlternatives(rec)}
                            className="bg-white dark:bg-slate-900 border border-[#c6c6cd] dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-[#191c1e] dark:text-slate-300 py-1.5 px-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all cursor-pointer text-center uppercase flex items-center justify-center space-x-0.5"
                            title="Compare 2-3 other diagnostic routes estimated by the agent"
                          >
                            <GitBranch className="w-3 h-3 text-indigo-500" />
                            <span>Alternatives</span>
                          </button>
                        </div>

                        {/* 4. ESCALATE & ROUTE TRIGGER */}
                        {/* High impact default logic prompt visualization */}
                        {rec.severity === "high" && !rec.isExecuted && !rec.isEscalated && (
                          <div className="p-2 border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/15 rounded-xl text-[10px] text-red-800 dark:text-red-400 mb-0.5">
                            <Info className="w-3.5 h-3.5 text-red-600 inline mr-1" />
                            <span><strong>Policy Default:</strong> High-Impact action. Escalated review strongly advised.</span>
                          </div>
                        )}

                        <button
                          onClick={() => onOpenEscalate(rec)}
                          disabled={rec.isExecuted || rec.isEscalated}
                          className="w-full border border-slate-900 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-slate-950 dark:text-slate-100 py-1.5 px-3 rounded-lg text-[11px] font-bold tracking-wide cursor-pointer text-center uppercase"
                          title="Route this recommendation to tier-3 response queues or managers"
                        >
                          Escalate Queue
                        </button>

                        <div className="flex justify-between items-center px-1 mt-1 font-mono text-[10px]">
                          {/* 5. ASK WHY / EXPAND PANEL */}
                          <button
                            onClick={() => onSelectRecommendation(rec)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-all font-semibold outline-none cursor-pointer flex items-center"
                          >
                            <HelpCircle className="w-3 h-3 mr-0.5" /> Explain ("Ask Why")
                          </button>

                          {!rec.isExecuted && (
                            <button
                              onClick={() => onDismiss(rec.id)}
                              className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-all font-semibold cursor-pointer"
                            >
                              Dismiss Alert
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

