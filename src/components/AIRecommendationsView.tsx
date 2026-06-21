import React, { useState } from "react";
import { Recommendation } from "../types";
import { 
  Sparkles, 
  Cpu, 
  Database, 
  ShieldAlert, 
  MessageSquare, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  Code2,
  CheckCircle2,
  ListRestart
} from "lucide-react";

interface AIRecommendationsViewProps {
  onGenerateCustom: (prompt: string) => void;
  isGenerating: boolean;
  lastGenerated: Recommendation | null;
  count: number;
}

export default function AIRecommendationsView({
  onGenerateCustom,
  isGenerating,
  lastGenerated,
  count
}: AIRecommendationsViewProps) {
  const [promptInput, setPromptInput] = useState("");

  const templates = [
    {
      title: "Memory leak in node task pool",
      prompt: "Memory usage is climbing linearly on API gateway nodes in US-EAST-02. Garbage collection fails to reclaim space. Telemetry suspects connection retention pools.",
      icon: Cpu,
    },
    {
      title: "Postgres transaction deadlocks",
      prompt: "High locking contention on user_sessions table. Alternating update transactions on index are inducing deadlocks, blocking 15% of concurrent writes.",
      icon: Database,
    },
    {
      title: "Compromised credential breach",
      prompt: "AWS Access key audit signals suspicious login from outside corporate IP proxies. Key was used to download metadata, rotate credentials advice required.",
      icon: ShieldAlert,
    },
  ];

  const handleTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    onGenerateCustom(promptInput);
    setPromptInput("");
  };

  return (
    <div className="grid grid-cols-12 gap-6 animate-fade-in font-sans">
      {/* Left Input Console (7 cols) */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 p-6 rounded-xl shadow-sm transition-colors">
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="p-1.5 bg-black dark:bg-slate-100 text-white dark:text-slate-950 rounded">
              <Sparkles className="w-5 h-5 text-amber-300 dark:text-amber-600 animate-pulse" />
            </div>
            <h3 className="text-[16px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider">
              AI Incident Investigator
            </h3>
          </div>
          <p className="text-[13px] text-[#45464d] dark:text-slate-300 leading-relaxed mb-5">
            Describe any system logs, performance degradation, deployment failures, or security discrepancies. 
            The system will call Gemini 3.5-flash server-side on your behalf to classify confidence, severity, and output structured mitigation blueprints.
          </p>

          {/* Form */}
          <form onSubmit={handleTrigger} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-[#45464d] dark:text-slate-400 mb-1.5">
                Incident Diagnostics Prompt
              </label>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={4}
                required
                placeholder="Describe the incident (e.g., 'API latency spiked to 4.2s post v3.2 deploying, CloudWatch reports 99th percentile pool exhaustion...')"
                className="w-full bg-[#f2f4f6] dark:bg-slate-900 text-[13px] border border-[#c6c6cd] dark:border-slate-800 rounded-xl p-4 placeholder-[#76777d] dark:placeholder-slate-500 text-[#191c1e] dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-black dark:focus:ring-slate-750 focus:outline-none resize-none leading-relaxed transition-all"
              />
            </div>

            <button
               type="submit"
              disabled={isGenerating || !promptInput.trim()}
              className="w-full bg-black dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 text-[13px] font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isGenerating ? "Synthesized Audit Executing..." : "Synthesize Remediation Card"}</span>
            </button>
          </form>

          {/* Preset templates */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#45464d] dark:text-slate-400 mb-3">
              Incident Presets
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {templates.map((tmpl, idx) => {
                const Icon = tmpl.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPromptInput(tmpl.prompt)}
                    className="flex flex-col items-start p-3 text-left bg-[#f2f4f6]/50 dark:bg-slate-900/45 hover:bg-[#eceef0] dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/60 rounded-xl transition-all cursor-pointer text-[#191c1e] dark:text-slate-150"
                  >
                    <Icon className="w-4 h-4 mb-2 text-[#505f76] dark:text-slate-400" />
                    <span className="text-[12px] font-bold truncate w-full">{tmpl.title}</span>
                    <span className="text-[10px] text-[#45464d] dark:text-slate-450 line-clamp-2 mt-1 leading-snug">
                      {tmpl.prompt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Output Inspector & Preview (5 cols) */}
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 p-6 rounded-xl shadow-sm min-h-[380px] flex flex-col transition-colors">
          <h3 className="text-[13px] font-mono uppercase font-bold tracking-wider text-[#45464d] dark:text-slate-350 border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4 flex items-center justify-between">
            <span>Remediation Blueprint</span>
            {lastGenerated && (
              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 px-2 py-0.5 rounded font-normal font-sans tracking-normal normal-case animate-pulse">
                Generated & Added
              </span>
            )}
          </h3>

          {isGenerating ? (
            <div className="flex-grow flex flex-col justify-center items-center space-y-4">
              <div className="w-8 h-8 rounded-full border-2 border-slate-100 dark:border-slate-800 border-t-black dark:border-t-white animate-spin"></div>
              <div className="text-center space-y-1">
                <p className="text-[13px] font-mono font-medium text-slate-800 dark:text-slate-250 animate-pulse">
                  Prompting LLM Tokenizers...
                </p>
                <p className="text-[11px] text-[#45464d] dark:text-slate-400">
                  Classifying parameters with gemini-3.5-flash
                </p>
              </div>
            </div>
          ) : lastGenerated ? (
            <div className="flex-grow flex flex-col justify-between space-y-5 animate-fade-in">
              <div className="space-y-4">
                {/* Result card header */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/30 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                  
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1 text-[#45464d] dark:text-slate-400 pl-2">
                    <span>{lastGenerated.id}</span>
                    <span>CONFIDENCE: {lastGenerated.confidence}%</span>
                  </div>
                  
                  <h4 className="text-[14px] font-bold text-[#191c1e] dark:text-slate-100 pl-2">{lastGenerated.title}</h4>
                  <p className="text-[12px] text-[#45464d] dark:text-slate-300 mt-1.5 leading-relaxed pl-2">
                    {lastGenerated.description}
                  </p>
                  
                  {lastGenerated.limitation && (
                    <div className="mt-3 bg-white dark:bg-slate-900 p-2.5 rounded text-[11px] border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-350 pl-2">
                      <strong className="text-amber-600 dark:text-amber-450">Warning:</strong> {lastGenerated.limitation}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider font-mono text-[#505f76] dark:text-slate-400 mt-3.5 border-t border-slate-200/60 dark:border-slate-800/60 pt-2.5 pl-2">
                    <span>{lastGenerated.source}</span>
                    <span>EST: {lastGenerated.estDuration}</span>
                  </div>
                </div>

                {/* API Classifications specifications feedback details */}
                <div className="space-y-2.5 text-[12px]">
                  <p className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#45464d] dark:text-slate-400">
                    Extracted Telemetry Meta
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded">
                      <span className="text-[#45464d] dark:text-slate-400 block">Severity:</span>
                      <span className="font-bold text-[#191c1e] dark:text-slate-100 uppercase">{lastGenerated.severity}</span>
                    </div>

                    <div className="p-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded">
                      <span className="text-[#45464d] dark:text-slate-400 block">Autopilot:</span>
                      <span className="font-bold text-[#191c1e] dark:text-slate-100">
                        {lastGenerated.confidence >= 80 ? "SECURELY PERMITTED" : "APPROVAL REQUIRED"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live JSON log representation */}
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-[#45464d] dark:text-slate-400">
                    <span className="uppercase tracking-wider font-mono font-bold">Raw LLM Response Schema</span>
                    <span className="flex items-center font-mono lowercase">
                      <Code2 className="w-3.5 h-3.5 mr-1" /> json
                    </span>
                  </div>
                  <pre className="bg-[#1e293b] text-[#f8fafc] rounded-xl p-3 scrollbar-none font-mono text-[10px] overflow-x-auto max-h-[140px]">
                    {JSON.stringify(lastGenerated, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Status footer banner */}
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-[#047857] dark:text-emerald-400 p-3 rounded-lg border border-emerald-100 dark:border-emerald-850/40 text-[12px] font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Simulated remediation blueprint registered successfully!</span>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col justify-center items-center text-center px-4 space-y-3">
              <div className="p-3.5 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400 dark:text-slate-500">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="font-sans text-[13px] font-bold text-[#191c1e] dark:text-slate-100">No Custom Blueprints Generated</p>
                <p className="text-[11px] text-[#45464d] dark:text-slate-400">
                  Describe an Operational anomaly on the left to inject dynamic mitigation assets.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
