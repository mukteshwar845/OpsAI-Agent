import React from "react";
import { ReasoningChain, Recommendation } from "../types";
import { X, CheckCircle2, HelpCircle, Flame, ArrowRight, Loader } from "lucide-react";

interface ReasoningPanelProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation | null;
  reasoning: ReasoningChain | null;
  isLoading: boolean;
  onExecuteAction: (id: string, actionName: string) => void;
}

export default function ReasoningPanel({
  isOpen,
  onClose,
  recommendation,
  reasoning,
  isLoading,
  onExecuteAction,
}: ReasoningPanelProps) {
  if (!isOpen) return null;

  return (
    <div
      id="reasoning-panel"
      className="fixed right-0 top-0 h-full w-full sm:w-[410px] bg-white dark:bg-[#0f172a] border-l border-[#c6c6cd] dark:border-slate-800 transition-all duration-300 z-50 shadow-2xl flex flex-col animate-slide-up"
    >
      <div className="p-6 flex flex-col h-full overflow-hidden">
        {/* Header Block */}
        <div className="flex items-center justify-between mb-6 border-b border-[#eceef0] dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-sans text-[18px] font-bold text-[#191c1e] dark:text-slate-100 flex items-center space-x-2">
              <span>AI Reasoning Chain</span>
            </h3>
            {recommendation && (
              <div className="flex items-center justify-between text-[11px] text-[#45464d] dark:text-slate-400 font-mono mt-1 w-full gap-2">
                <span>Evaluation target: {recommendation.id}</span>
                <span className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                  Raw Score: {recommendation.confidence}%
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#eceef0] dark:hover:bg-slate-800 text-[#45464d] dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Context Body */}
        {!recommendation ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
            <div className="bg-[#f2f4f6] dark:bg-slate-900 p-4 rounded-full mb-4 text-[#76777d] dark:text-slate-500 animate-bounce">
              <HelpCircle className="w-8 h-8" />
            </div>
            <p className="font-sans text-[14px] font-medium text-[#191c1e] dark:text-slate-100">No Recommendation Selected</p>
            <p className="text-[12px] text-[#45464d] dark:text-slate-400 mt-1">
              Select an item from the queue to view custom diagnostic root causes and step-by-step reasoning.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex-grow flex flex-col justify-center items-center space-y-4">
            <div className="relative">
              <Loader className="w-8 h-8 text-black dark:text-white animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-[13px] font-mono font-medium text-[#191c1e] dark:text-slate-100 animate-pulse">Running live telemetries...</p>
              <p className="text-[11px] text-[#45464d] dark:text-slate-400">Querying Gemini 3.5-flash agent</p>
            </div>
            {/* Shimmer items */}
            <div className="w-full max-w-xs space-y-3 pt-6">
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-5/6"></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ) : reasoning ? (
          <div className="flex-grow overflow-y-auto space-y-6 pr-1">
            {/* Multi-Agent Collaboration Pipeline */}
            <div className="bg-[#0f172a] text-[#f8fafc] p-4 rounded-xl border border-slate-850 space-y-3 shadow-md">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">
                🛡️ Multi-Agent Chain Handoff
              </span>
              <div className="grid grid-cols-3 gap-1 relative">
                {/* Agent 1 */}
                <div className="text-center relative">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 mx-auto flex items-center justify-center text-[12px] font-bold border border-indigo-400">
                    🔍
                  </div>
                  <span className="text-[9px] block font-mono font-medium text-slate-300 mt-1">Telemetry</span>
                  <span className="text-[8px] bg-slate-950 font-bold px-1 text-emerald-400 rounded scale-90 inline-block font-mono">Matched</span>
                </div>
                {/* Agent 2 */}
                <div className="text-center relative">
                  <div className="w-8 h-8 rounded-full bg-purple-600 mx-auto flex items-center justify-center text-[12px] font-bold border border-purple-400">
                    🧠
                  </div>
                  <span className="text-[9px] block font-mono font-medium text-slate-300 mt-1">Reasoning</span>
                  <span className="text-[8px] bg-slate-950 font-bold px-1 text-emerald-400 rounded scale-90 inline-block font-mono">Synthed</span>
                </div>
                {/* Agent 3 */}
                <div className="text-center relative">
                  <div className="w-8 h-8 rounded-full bg-slate-700 mx-auto flex items-center justify-center text-[12px] font-bold border border-slate-500 animate-pulse">
                    ⚖️
                  </div>
                  <span className="text-[9px] block font-mono font-medium text-slate-300 mt-1">Gatekeeper</span>
                  <span className="text-[8px] bg-slate-950 font-bold px-1 text-amber-400 rounded scale-90 inline-block font-mono font-semibold">Gated</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-300 italic text-center leading-normal pt-2 border-t border-slate-850 leading-snug">
                "Telemetry Agent flagged workstation anomaly; Gemini Remediation Agent calculated optimal containment. Gatekeeper routing to human Sys-Admin for final signed verification."
              </p>
            </div>

            {/* Step Timeline */}
            <div className="space-y-6 relative border-l border-slate-100 dark:border-slate-800 pl-4 ml-3">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[29px] top-0.5 w-6 h-6 rounded-full bg-black dark:bg-slate-100 text-white dark:text-slate-950 flex items-center justify-center font-mono text-[11px] font-bold">
                  01
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-[#191c1e] dark:text-slate-100 uppercase tracking-wide font-mono">
                    Pattern Match
                  </h4>
                  <p className="text-[13px] text-[#45464d] dark:text-slate-305 mt-1 leading-relaxed">
                    {reasoning.patternMatch}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[29px] top-0.5 w-6 h-6 rounded-full bg-black dark:bg-slate-100 text-white dark:text-slate-950 flex items-center justify-center font-mono text-[11px] font-bold">
                  02
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-[#191c1e] dark:text-slate-100 uppercase tracking-wide font-mono">
                    Causal Attribution
                  </h4>
                  <p className="text-[13px] text-[#45464d] dark:text-slate-305 mt-1 leading-relaxed">
                    {reasoning.causalAttribution}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[29px] top-0.5 w-6 h-6 rounded-full bg-black dark:bg-slate-100 text-white dark:text-[#ba1a1a] flex items-center justify-center font-mono text-[11px] font-bold">
                  03
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-[#191c1e] dark:text-slate-105 uppercase tracking-wide font-mono">
                    Impact Prediction
                  </h4>
                  <p className="text-[13px] text-[#45464d] dark:text-slate-305 mt-1 leading-relaxed text-[#ba1a1a] dark:text-red-400">
                    {reasoning.impactPrediction}
                  </p>
                </div>
              </div>
            </div>

            {/* Confidence Factors list box */}
            <div className="bg-[#f2f4f6]/80 dark:bg-slate-900/50 p-4 rounded-xl border border-[#eceef0] dark:border-slate-800">
              <h4 className="text-[12px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider mb-2.5 font-sans">
                Confidence Factors
              </h4>
              <ul className="space-y-2 text-[12px] text-[#45464d] dark:text-slate-300">
                {reasoning.confidenceFactors.map((factor, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] mr-2 shrink-0 mt-0.5" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Simulated Action Steps breakdown */}
            {reasoning.executionSteps && reasoning.executionSteps.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-105 dark:border-slate-800">
                <h4 className="text-[12px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider mb-2.5 font-sans">
                  Action Sequence
                </h4>
                <div className="space-y-2">
                  {reasoning.executionSteps.map((step, idx) => (
                    <div key={idx} className="flex text-[12px] text-[#45464d] dark:text-slate-300">
                      <span className="font-mono text-slate-400 dark:text-slate-500 mr-2">{idx + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-grow flex flex-col justify-center items-center text-center">
            <p className="text-[13px] text-[#45464d]">Could not retrieve diagnostics at this time.</p>
          </div>
        )}

        {/* Footer Actions */}
        {recommendation && !isLoading && (
          <div className="mt-auto pt-4 border-t border-[#eceef0] dark:border-slate-800">
            {recommendation.isExecuted ? (
              <div className="w-full bg-[#ecfdf5] dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-[#047857] dark:text-emerald-400 py-3 rounded-xl px-4 text-center font-medium text-[13px] flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#047857] dark:text-emerald-450" />
                <span>Successfully Executed</span>
              </div>
            ) : (
              <button
                onClick={() => onExecuteAction(recommendation.id, recommendation.primaryAction)}
                className="w-full bg-black dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 active:bg-black py-3 rounded-xl font-bold font-sans text-[13px] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Approve All & Execute Actions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
