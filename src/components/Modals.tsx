import React, { useState } from "react";
import { Recommendation } from "../types";
import { X, Check, ShieldAlert, ArrowRight, ShieldCheck, HelpCircle, AlertCircle, Sparkles, Send } from "lucide-react";

interface AlternativesModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation | null;
  onChooseAlternative: (recId: string, altTitle: string) => void;
}

export function SeeAlternativesModal({
  isOpen,
  onClose,
  recommendation,
  onChooseAlternative,
}: AlternativesModalProps) {
  if (!isOpen || !recommendation) return null;

  const defaultAlts = [
    {
      id: "ALT-01",
      title: "Soft Recycle Target Containers",
      confidence: 68,
      description: "Recycle the task threads gracefuly without full container tear-down.",
      justification: "Maintains network endpoints but doesn't resolve permanent patch compliance.",
      source: "Container Lifecycle daemon",
      estDuration: "1.5 min",
    },
    {
      id: "ALT-02",
      title: "Compensating Firewall Dropdown Rule",
      confidence: 42,
      description: "Inject emergency rules in proxy layer to drop payload signals containing exploit footprints.",
      justification: "Interim fix only; adds 4% latency overhead on high-priority packet networks.",
      source: "Nginx Access Rule",
      estDuration: "35 sec",
    }
  ];

  const alternatives = recommendation.alternatives || defaultAlts;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
      <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 w-[calc(100%-2rem)] sm:w-full sm:max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#eceef0] dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/25">
          <div>
            <h3 className="font-sans text-[16px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>AI Considered Alternatives</span>
            </h3>
            <p className="text-[11px] text-[#45464d] dark:text-slate-400 font-mono mt-0.5">
              Comparative analysis for target: {recommendation.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-[#45464d] dark:text-slate-400 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <p className="text-[13px] text-[#45464d] dark:text-slate-300 leading-relaxed">
            OpsAI evaluated alternative trajectories prior to surfacing the primary recommendation. 
            Review details side-by-side. You have human clearance to override the primary recommendation with any item below.
          </p>

          {/* Core Chosen vs Alternatives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Original recommended action */}
            <div className="border-2 border-indigo-500 rounded-xl p-4 bg-indigo-50/40 dark:bg-indigo-950/20 relative">
              <div className="absolute top-2 right-2 bg-indigo-600 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Recommended Choice
              </div>
              <span className="font-mono text-[10px] text-indigo-700 dark:text-indigo-400 font-bold block mb-1">
                PRIMARY TARGET (Confidence: {recommendation.confidence}%)
              </span>
              <h4 className="text-[14px] font-extrabold text-[#191c1e] dark:text-slate-100">{recommendation.title}</h4>
              <p className="text-[12px] text-[#45464d] dark:text-slate-300 mt-2 leading-relaxed">
                {recommendation.description}
              </p>
              <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-950 flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                <span>Est: {recommendation.estDuration}</span>
                <span>Source: {recommendation.source}</span>
              </div>
            </div>

            {/* Right: Explaining comparative justification */}
            <div className="border border-[#c6c6cd] dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#45464d] dark:text-slate-400 font-bold block mb-1">
                  AGENT COMPARATIVE RATIONALE
                </span>
                <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "The primary choice represents the lowest-risk remediation route. Other vectors either do not resolve the systematic root defect, or introduce high latency on parallel transactional gateways."
                </p>
              </div>
              <div className="mt-4 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-[#45464d] dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 inline mr-1.5" />
                <span>Standard mitigation playbooks advise compliance patch rollouts.</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#45464d] dark:text-slate-400 pt-3">
            Available Secondary Tracks
          </p>

          {/* Custom alternative cards list */}
          <div className="space-y-3.5">
            {alternatives.map((alt, idx) => {
              // Color formatting
              let badgeColor = alt.confidence >= 75 ? "bg-emerald-50 dark:bg-emerald-950/35 text-emerald-800 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40" : "bg-amber-50 dark:bg-amber-950/35 text-amber-800 dark:text-amber-400 border-amber-100 dark:border-amber-900/40";
              return (
                <div key={idx} className="border border-[#c6c6cd] dark:border-slate-800 rounded-xl p-4 hover:border-black dark:hover:border-slate-505 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900/50">
                  <div className="space-y-1 flex-grow">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${badgeColor} border`}>
                        {alt.confidence}% confidence
                      </span>
                      <span className="text-[11px] font-mono text-[#45464d] dark:text-slate-400">{alt.id || `ALT-0${idx + 1}`}</span>
                    </div>
                    <h5 className="font-bold text-[13px] text-[#191c1e] dark:text-slate-100">{alt.title}</h5>
                    <p className="text-[12px] text-[#45464d] dark:text-slate-300 leading-relaxed">
                      {alt.description}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <strong className="dark:text-slate-300">Consequence: </strong> {alt.justification}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-stretch md:items-end gap-2 w-full md:w-auto">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 text-right">Est: {alt.estDuration}</span>
                    <button
                      onClick={() => onChooseAlternative(recommendation.id, alt.title)}
                      className="bg-black dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-950 text-[11px] font-mono font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer text-center"
                    >
                      Trigger Target Track
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#eceef0] dark:border-slate-800 bg-slate-50 dark:bg-slate-950/25 flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          <span>ALL DEVIATIONS ARE LOGGED AUDITABLY</span>
          <button
            onClick={onClose}
            className="text-[12px] font-sans font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-305 cursor-pointer"
          >
            Keep Recommended Primary action
          </button>
        </div>

      </div>
    </div>
  );
}

// Override Modal Component
interface OverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation | null;
  onConfirmOverride: (recId: string, customCommand: string, overrideReason: string) => void;
}

export function OverrideModal({
  isOpen,
  onClose,
  recommendation,
  onConfirmOverride,
}: OverrideModalProps) {
  const [customCommand, setCustomCommand] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [errorInput, setErrorInput] = useState("");

  if (!isOpen || !recommendation) return null;

  const suggestScripts = [
    { label: "Restart and bypass warning shell", cmd: `systemctl restart docker-daemon && curl -X POST https://api.opsai/v1/recycle/${recommendation.id}` },
    { label: "Soft isolate cluster gateway", cmd: `iptables -A INPUT -s ${recommendation.id === "#REC-0129" ? "192.168.10.92" : "10.0.4.15"} -j DROP` },
    { label: "Purge heap socket stack", cmd: "node --expose-gc -e 'global.gc(); process.exit(0)'" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommand.trim()) {
      setErrorInput("A directive CLI command command sequence is required.");
      return;
    }
    if (!overrideReason.trim()) {
      setErrorInput("A justification reason statement is mandatory for compliance.");
      return;
    }

    onConfirmOverride(recommendation.id, customCommand, overrideReason);
    setCustomCommand("");
    setOverrideReason("");
    setErrorInput("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
      <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 w-[calc(100%-2rem)] sm:w-full sm:max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eceef0] dark:border-slate-800 flex items-center justify-between bg-red-50/50 dark:bg-red-950/20">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans text-[15px] font-bold text-red-900 dark:text-red-200 uppercase tracking-wider">
                Reject & Manual Override
              </h3>
              <p className="text-[11px] text-red-700 dark:text-red-400 font-mono">
                Intervention required on: {recommendation.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-red-105 dark:hover:bg-red-900/60 text-[#45464d] dark:text-slate-400 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-[12px] text-[#45464d] dark:text-slate-350 leading-relaxed">
            By triggering a manual override, you suppress the AI recommended mitigation <strong>"{recommendation.title}"</strong>. 
            Enter the custom terminal command sequence or action descriptions you intend to run instead.
          </p>

          <div className="space-y-4">
            {/* Custom Command Input */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-[#45464d] dark:text-slate-400 mb-1">
                Manual Operations Command Script (CLI / Directive)
              </label>
              <textarea
                value={customCommand}
                onChange={(e) => {
                  setCustomCommand(e.target.value);
                  setErrorInput("");
                }}
                rows={2}
                placeholder="e.g. systemctl restart system-ingress-pool.service --force"
                className="w-full bg-[#1e293b] text-[#f8fafc] font-mono text-[12px] rounded-lg p-3 placeholder-[#64748b] focus:ring-1 focus:ring-red-400 outline-none leading-relaxed resize-none"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <p className="text-[10px] text-[#45464d] dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Quick Script Templates</p>
              <div className="flex flex-col gap-1.5">
                {suggestScripts.map((sc, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCustomCommand(sc.cmd)}
                    className="text-left bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[11px] px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 truncate font-mono cursor-pointer"
                  >
                    {sc.label}: <span className="text-indigo-605 dark:text-indigo-400 font-medium">{sc.cmd}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reason input */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-[#45464d] dark:text-slate-400 mb-1">
                Security Compliance Reason for Override
              </label>
              <input
                type="text"
                value={overrideReason}
                onChange={(e) => {
                  setOverrideReason(e.target.value);
                  setErrorInput("");
                }}
                placeholder="Device hardware profiles clash / Out of scope container replica"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-[#c6c6cd] dark:border-slate-800 rounded-lg px-3 py-2 text-[12px] placeholder-[#76777d] dark:placeholder-slate-500 text-[#191c1e] dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 outline-none"
              />
            </div>

            {errorInput && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-[11px] text-red-700 dark:text-red-400 rounded border border-red-100 dark:border-red-900/40 flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorInput}</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="pt-4 border-t border-[#eceef0] dark:border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#f2f4f6] dark:bg-slate-800 hover:bg-[#eceef0] dark:hover:bg-slate-700 text-[#191c1e] dark:text-slate-200 text-[12px] font-semibold py-1.5 px-4 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-650 hover:bg-red-700 text-white text-[12px] font-bold py-1.5 px-5 rounded-xl flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Verify & Execute Override</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Escalate Modal Component
interface EscalateModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation | null;
  onConfirmEscalate: (recId: string, assignedTeam: string, comment: string) => void;
}

export function EscalateModal({
  isOpen,
  onClose,
  recommendation,
  onConfirmEscalate,
}: EscalateModalProps) {
  const [assignedTeam, setAssignedTeam] = useState("Tier-3 SRE Architecture");
  const [comment, setComment] = useState("");

  if (!isOpen || !recommendation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmEscalate(recommendation.id, assignedTeam, comment);
    setComment("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
      <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 w-[calc(100%-2rem)] sm:w-full sm:max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eceef0] dark:border-slate-800 flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-950/20">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 rounded-lg">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans text-[15px] font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                Escalate Recommendation
              </h3>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-mono">
                Routing ticket for: {recommendation.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-indigo-105 dark:hover:bg-indigo-900/60 text-[#45464d] dark:text-slate-400 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-[12px] text-[#45464d] dark:text-slate-350 leading-relaxed">
            Due to the critical nature or moderate confidence of <strong>"{recommendation.title}"</strong>, 
            send this diagnostic card to a senior engineering or security team queue for auxiliary sign-off.
          </p>

          <div className="space-y-4.5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-[#45464d] dark:text-slate-400 mb-1">
                Target Escalation Team / Queue channel
              </label>
              <select
                value={assignedTeam}
                onChange={(e) => setAssignedTeam(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-[#c6c6cd] dark:border-slate-850 rounded-lg px-3 py-2 text-[12px] font-medium text-[#191c1e] dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-950 cursor-pointer"
              >
                <option value="Tier-3 SRE Architecture" className="dark:bg-slate-905">Tier-3 SRE Architecture Pool</option>
                <option value="DevSecOps Threat Response" className="dark:bg-slate-905">DevSecOps Threat Response Guild</option>
                <option value="Database Incident Director" className="dark:bg-slate-905">Database Incident Director</option>
                <option value="Associate Security Lead Analyst" className="dark:bg-slate-905">Associate Security Lead Analyst</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-[#45464d] dark:text-slate-400 mb-1">
                Escalation Note / Context
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Requesting second tier compliance inspect on the outgoing payloads before we quarantine LAP-920 completely."
                className="w-full bg-[#f2f4f6] dark:bg-slate-900 text-[12px] border border-[#c6c6cd] dark:border-slate-800 rounded-lg p-3 placeholder-[#76777d] dark:placeholder-slate-500 text-[#191c1e] dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 outline-none leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-[#eceef0] dark:border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#f2f4f6] dark:bg-slate-800 hover:bg-[#eceef0] dark:hover:bg-slate-700 text-[#191c1e] dark:text-slate-205 text-[12px] font-semibold py-1.5 px-4 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-705 text-white text-[12px] font-bold py-1.5 px-5 rounded-xl flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirm Escalation Link</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminName: string;
  setAdminName: (name: string) => void;
  adminRole: string;
  setAdminRole: (role: string) => void;
  adminEmail: string;
  setAdminEmail: (email: string) => void;
  adminAvatar: string;
  setAdminAvatar: (avatar: string) => void;
  onAddLog: (event: string, source: string, severity: "low" | "medium" | "high", category: string) => void;
}

export function AdminProfileModal({
  isOpen,
  onClose,
  adminName,
  setAdminName,
  adminRole,
  setAdminRole,
  adminEmail,
  setAdminEmail,
  adminAvatar,
  setAdminAvatar,
  onAddLog
}: AdminProfileModalProps) {
  const [tempName, setTempName] = useState(adminName);
  const [tempRole, setTempRole] = useState(adminRole);
  const [tempEmail, setTempEmail] = useState(adminEmail);
  const [tempAvatar, setTempAvatar] = useState(adminAvatar);
  const [activeSessionCount, setActiveSessionCount] = useState(3);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminName(tempName);
    setAdminRole(tempRole);
    setAdminEmail(tempEmail);
    setAdminAvatar(tempAvatar);

    // Call logging interface
    onAddLog(
      `Admin Profile changed: Set name to "${tempName}" and role to "${tempRole}"`,
      "Security Sentinel Core",
      "low",
      "Configuration"
    );

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  const avatarsList = [
    { label: "SRE Leader", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw_PWNyhJ7c5m0MswI-EOBT3syeJ3dTD490KeEjANonktP3rDwpHJBlrHVJ5U0TmSlPlOCOKCTbs1Duop2P6WSzA3rhL265l92GpWYwsIljvb8VSm-RaU7-PtX0JdHdobbAawo80OUN4GrkWGePQc5AYjp6BQIOPozliWzQjQctgfNUNKrmUrGxC1jtSufZDoDOedWkzS1JpXBJ8-GMc-ID93VVXKoVsw6HDidq8TzsSReUFEGyhAOdZHkQQ0Ouwle4t-bssOxpg9D" },
    { label: "AI Specialist", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
    { label: "Threat Inspector", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
    { label: "Operations Tech", url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200" }
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110] animate-fade-in text-slate-800 dark:text-slate-100">
      <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 w-[calc(100%-2rem)] sm:w-full sm:max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eceef0] dark:border-slate-800 flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-950/20">
          <div>
            <h3 className="font-sans text-[15px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-widest flex items-center space-x-1.5">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Admin Profile Manager</span>
            </h3>
            <p className="text-[11px] text-[#45464d] dark:text-slate-400 font-mono mt-0.5">
              Secure SRE Sentinel Console (Read/Write)
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-[#45464d] dark:text-slate-400 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-col items-center space-y-2 pb-2">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500 bg-slate-100 relative">
              <img src={tempAvatar} alt="Active avatar selection" className="w-full h-full object-cover" />
            </div>
            <p className="text-[11px] font-mono text-[#45464d] dark:text-slate-400">Choose Fleet Avatar Profile</p>
            <div className="flex space-x-2">
              {avatarsList.map((av, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setTempAvatar(av.url)}
                  className={`w-7 h-7 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                    tempAvatar === av.url ? "border-indigo-600 scale-110" : "border-slate-300 dark:border-slate-800 hover:scale-105"
                  }`}
                  title={av.label}
                >
                  <img src={av.url} alt="Option avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-[#45464d] dark:text-slate-400 mb-1">
                Full Display Name
              </label>
              <input
                type="text"
                required
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full bg-[#f2f4f6] dark:bg-slate-900 text-[13px] border border-[#c6c6cd] dark:border-slate-800 rounded-lg px-3 py-1.5 placeholder-[#76777d] dark:placeholder-slate-500 text-[#191c1e] dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-[#45464d] dark:text-slate-400 mb-1">
                Assigned Role / Title
              </label>
              <input
                type="text"
                required
                value={tempRole}
                onChange={(e) => setTempRole(e.target.value)}
                className="w-full bg-[#f2f4f6] dark:bg-slate-900 text-[13px] border border-[#c6c6cd] dark:border-slate-800 rounded-lg px-3 py-1.5 placeholder-[#76777d] dark:placeholder-slate-500 text-[#191c1e] dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-[#45464d] dark:text-slate-400 mb-1">
                Registered Contact Email
              </label>
              <input
                type="email"
                required
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="w-full bg-[#f2f4f6] dark:bg-slate-900 text-[13px] border border-[#c6c6cd] dark:border-slate-800 rounded-lg px-3 py-1.5 placeholder-[#76777d] dark:placeholder-slate-500 text-[#191c1e] dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 outline-none font-mono"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-[#eceef0] dark:border-slate-800 text-[11px] font-mono leading-normal text-slate-500 dark:text-slate-400 flex justify-between items-center">
              <span>ACTIVE SYSTEM WORKSTATIONS</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/30">
                {activeSessionCount} SESSIONS
              </span>
            </div>
          </div>

          {/* Success Dialog bar */}
          {isSaved && (
            <div className="text-[12px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-800 rounded-lg py-1.5 px-3 font-semibold text-center animate-pulse">
              Admin Profile Saved Successfully! Updating sidebar layout...
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-[#eceef0] dark:border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#f2f4f6] dark:bg-slate-800 hover:bg-[#eceef0] dark:hover:bg-slate-700 text-[#191c1e] dark:text-slate-205 text-[12px] font-semibold py-1.5 px-4 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90 text-[12px] font-bold py-1.5 px-5 rounded-xl cursor-pointer"
            >
              Save Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
