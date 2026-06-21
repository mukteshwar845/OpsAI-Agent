import React, { useState } from "react";
import { ActivityLogEntry } from "../types";
import { 
  History, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  SlidersHorizontal,
  ChevronDown,
  Download,
  Terminal,
  Play,
  ShieldAlert,
  FileText,
  Clock,
  ExternalLink,
  BookOpen
} from "lucide-react";

interface ActivityLogProps {
  logs: ActivityLogEntry[];
  onTriggerRandomLog: () => void;
  onClearLogs: () => void;
}

export default function ActivityLogView({ logs, onTriggerRandomLog, onClearLogs }: ActivityLogProps) {
  const [currLogSubTab, setCurrLogSubTab] = useState<"audit_trail" | "post_mortems">("audit_trail");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterSeverity, setFilterSeverity] = useState("All");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || log.category === filterCategory;
    const matchesSeverity = filterSeverity === "All" || log.severity === filterSeverity;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const exportCSV = () => {
    const headers = ["ID", "Timestamp", "Event", "Source", "Severity", "Category"];
    const rows = filteredLogs.map((l) => [l.id, l.timestamp, l.event, l.source, l.severity, l.category]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `opsai_fleet_log_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const incidentPostMortems = [
    {
      id: "INC-POST-928",
      title: "Transient Payment Gateway Port Isolation",
      timestamp: "2026-06-20 14:32:10 UTC",
      whatHappened: "The OpsAI quarantine microservice triggered an automated isolating command on EMEA-PAYMENT-NODE-04. This disconnected key transactional inbound/outbound TCP ports, producing connection timeouts for 4.2 minutes during peak workloads.",
      whyItHappened: "A sudden promotional flash-sale generated a legitimate 15,000 requests/sec traffic burst. The telemetry daemon misinterpreted this rapid spike as a hostile distributed brute-force rate attack, immediately bypassing normal alert gates.",
      safeguardFailed: "Threshold limits checked raw rate changes without validating node business class labels (e.g. bypass restrictions for core payment pathways) and overrode manual validations since server latency was elevated.",
      revisions: [
        "Construct multi-agent consensus checks: Isolated commands on financial nodes require separate verification tokens from the DevSecOps Threat team.",
        "Incorporate commercial promotion calendars into primary baseline heuristics to accommodate seasonal spikes."
      ]
    },
    {
      id: "INC-POST-402",
      title: "Replication Node Destruction Cycle",
      timestamp: "2026-06-19 09:15:45 UTC",
      whatHappened: "The SRE Autopilot daemon destroyed 3 redundant cluster containers in the database host group EMEA-WEST-01, causing dynamic failover actions and slow query delays across regional clients.",
      whyItHappened: "A scheduled physical fiber-cable swap by datacenter field engineers induced local delays. The SRE heartbeat monitors failed to complete verification queries within the rigid 100ms timeout boundary, marking the nodes dead.",
      safeguardFailed: "Reboot and replica destruction triggers lacked dependencies checking regional maintenance updates, failing to cross-verify physical datacenter health APIs before destroying virtual replicas.",
      revisions: [
        "Augment heartbeat timeouts from 100ms to 450ms during verified maintenance intervals.",
        "Integrate external datacenter vendor maintenance status feeds directly into the AI pre-flight authorization check."
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 pb-px">
        <button
          onClick={() => setCurrLogSubTab("audit_trail")}
          className={`px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider font-sans border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
            currLogSubTab === "audit_trail"
              ? "border-black dark:border-slate-100 text-black dark:text-white"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Operational Audit Trails</span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ml-1.5 px-1.5 py-0.5 rounded text-[11px] font-mono leading-none font-bold">
            {filteredLogs.length}
          </span>
        </button>
        <button
          onClick={() => setCurrLogSubTab("post_mortems")}
          className={`px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider font-sans border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
            currLogSubTab === "post_mortems"
              ? "border-red-600 dark:border-red-500 text-red-600 dark:text-red-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>AI Safeguard Post-Mortems</span>
          <span className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 ml-1.5 px-1.5 py-0.5 rounded text-[11px] font-mono leading-none font-bold">
            {incidentPostMortems.length}
          </span>
        </button>
      </div>

      {currLogSubTab === "audit_trail" ? (
        <>
          {/* Search and Filters Strip */}
          <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between transition-colors">
            <div className="flex flex-wrap items-center gap-3 flex-grow">
              <div className="relative flex-grow max-w-md">
                <Search className="w-4 h-4 text-[#45464d] dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activity events, incidents, sources..."
                  className="pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-900 border border-[#c6c6cd] dark:border-slate-800 rounded-lg text-[13px] placeholder-[#45464d] dark:placeholder-slate-500 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-black w-full"
                />
              </div>

              {/* Category Dropdown */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 text-[12px] text-[#191c1e] dark:text-slate-200 border border-[#c6c6cd] dark:border-slate-800 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
              >
                <option value="All" className="dark:bg-slate-900">All Categories</option>
                <option value="Security" className="dark:bg-slate-900">Security Checks</option>
                <option value="Mitigation" className="dark:bg-slate-900">Mitigations</option>
                <option value="Patching" className="dark:bg-slate-900">Patch Runs</option>
                <option value="Database" className="dark:bg-slate-900">Database Tasks</option>
              </select>

              {/* Severity Dropdown */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 text-[12px] text-[#191c1e] dark:text-slate-200 border border-[#c6c6cd] dark:border-slate-800 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
              >
                <option value="All" className="dark:bg-slate-900">All Severities</option>
                <option value="high" className="dark:bg-slate-900">High Severity</option>
                <option value="medium" className="dark:bg-slate-900">Medium Severity</option>
                <option value="low" className="dark:bg-slate-900">Low Severity</option>
                <option value="info" className="dark:bg-slate-900">Info States</option>
              </select>
            </div>

            {/* Action Triggers */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={onTriggerRandomLog}
                className="bg-[#eceef0] hover:bg-[#e0e3e5] dark:bg-slate-800 dark:hover:bg-slate-700 active:bg-[#eceef0] text-black dark:text-slate-200 text-[12px] font-bold py-1.5 px-3 rounded-lg flex items-center space-x-1 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
                title="Inject active streaming operational updates"
              >
                <Play className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                <span>Telemetry Feed</span>
              </button>

              <button
                onClick={exportCSV}
                className="bg-black hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-950 text-[12px] font-bold py-1.5 px-3 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              
              <button
                onClick={onClearLogs}
                className="text-[11px] text-[#45464d] dark:text-slate-400 hover:text-[#ba1a1a] dark:hover:text-red-400 p-1 font-semibold transition-colors cursor-pointer"
              >
                Truncate System Logs
              </button>
            </div>
          </div>

          {/* Main High-Density Table */}
          <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors">
            <div className="px-5 py-3.5 bg-slate-50/50 dark:bg-slate-950/40 border-b border-[#eceef0] dark:border-slate-800 flex items-center justify-between text-[#45464d] dark:text-slate-300">
              <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                Audit Trails (Showing {filteredLogs.length} Events)
              </span>
              <span className="flex items-center text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <Terminal className="w-3.5 h-3.5 mr-1" /> DB Node: active
              </span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#eceef0] dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10 text-[11px] font-bold text-[#45464d] dark:text-slate-300 uppercase font-mono">
                    <th className="py-2.5 px-5">Incident ID</th>
                    <th className="py-2.5 px-4 w-40">Timestamp</th>
                    <th className="py-2.5 px-4">Event Statement</th>
                    <th className="py-2.5 px-4">Source context</th>
                    <th className="py-2.5 px-4 w-28">Severity</th>
                    <th className="py-2.5 px-5 w-32">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans text-[13px] text-slate-850 dark:text-slate-200">
                  {filteredLogs.map((log, idx) => {
                    const isEven = idx % 2 === 0;

                    let severityColor = "";
                    let severityDot = "";
                    if (log.severity === "high") {
                      severityColor = "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/25 border border-red-100 dark:border-red-900/40";
                      severityDot = "bg-red-500";
                    } else if (log.severity === "medium") {
                      severityColor = "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/25 border border-amber-100 dark:border-amber-900/40";
                      severityDot = "bg-amber-500";
                    } else if (log.severity === "low") {
                      severityColor = "text-[#54647a] dark:text-slate-300 bg-[#d0e1fb]/20 dark:bg-slate-900/40 border border-[#b7c8e1] dark:border-slate-800";
                      severityDot = "bg-[#505f76]";
                    } else {
                      severityColor = "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800";
                      severityDot = "bg-slate-400";
                    }

                    return (
                      <tr 
                        key={log.id + idx} 
                        className={`hover:bg-[#f7f9fb]/80 dark:hover:bg-slate-800/40 transition-colors ${isEven ? "bg-white dark:bg-[#0f172a]" : "bg-[#f7f9fb]/30 dark:bg-slate-900/20"}`}
                      >
                        <td className="py-3 px-5 font-mono text-[11px] font-bold text-slate-900 dark:text-slate-100">
                          {log.id}
                        </td>

                        <td className="py-3 px-4 text-[#45464d] dark:text-slate-300 font-mono text-[11px] whitespace-nowrap">
                          {log.timestamp}
                        </td>

                        <td className="py-3 px-4 font-semibold text-[#191c1e] dark:text-slate-100 text-[13px]">
                          {log.event}
                        </td>

                        <td className="py-3 px-4 text-[#45464d] dark:text-slate-300 font-semibold">
                          {log.source}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono leading-none ${severityColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${severityDot}`}></span>
                            {log.severity}
                          </span>
                        </td>

                        <td className="py-3 px-5 whitespace-nowrap">
                          <span className="text-[11px] font-bold bg-[#eceef0] dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {log.category}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#45464d]">
                        No activity entries match chosen filter criteria. Use the 'Telemetry Feed' button to populate system traces.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span>AI Guard Post-Mortem Card Sandbox</span>
            </h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              When autonomous actions yield unintended performance outcomes or triggers violate local safety limits, the system produces a structured post-mortem card representing what occurred, why, and what custom safeguard fail-safe policy has been modified to prevent recurrence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {incidentPostMortems.map((post) => (
              <div key={post.id} className="bg-white dark:bg-[#0f172a] border-2 border-[#c6c6cd] dark:border-slate-800/80 p-6 rounded-2xl shadow-md space-y-4 flex flex-col justify-between transition-all hover:shadow-lg">
                <div className="space-y-4 font-sans">
                  
                  {/* Card ID Indicator */}
                  <div className="flex justify-between items-center bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-2.5 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="font-mono text-[11px] font-bold text-red-700 dark:text-red-400">{post.id}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold bg-amber-500/20 text-amber-805 dark:text-amber-400 px-2 py-0.5 rounded">
                      Audited Safely
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[16px] font-extrabold text-[#191c1e] dark:text-slate-100">{post.title}</h4>
                    <p className="font-mono text-[10px] text-slate-400 mt-0.5">{post.timestamp}</p>
                  </div>

                  {/* 1. What Happened */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      1. What Happened (Unintended Outcome)
                    </span>
                    <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      {post.whatHappened}
                    </p>
                  </div>

                  {/* 2. Why It Happened */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      2. Why It Happened (Root Cause)
                    </span>
                    <p className="text-[13px] text-slate-700 dark:text-slate-305 leading-relaxed font-sans">
                      {post.whyItHappened}
                    </p>
                  </div>

                  {/* 3. Safeguard that Failed */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-red-500 tracking-wider block">
                      3. Safeguard That Failed
                    </span>
                    <p className="text-[13px] text-red-800 dark:text-red-400 font-medium leading-relaxed font-sans">
                      {post.safeguardFailed}
                    </p>
                  </div>

                  {/* 4. Safeguard Revision Policy Created */}
                  <div className="p-4 bg-slate-950 text-white rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-mono text-[10px] text-slate-300 uppercase tracking-widest font-bold">
                        Safeguard Revision Policy Committed
                      </span>
                    </div>
                    <ul className="space-y-1.5 pl-4 list-disc text-[12px] text-slate-350 leading-relaxed font-sans">
                      {post.revisions.map((rev, i) => (
                        <li key={i}>{rev}</li>
                      ))}
                    </ul>
                  </div>

                </div>

                <div className="pt-3 border-t border-slate-105 dark:border-slate-800/80 flex justify-between items-center text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Sign-off: Lead Architect SRE</span>
                  <div className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                    <span>Export Report</span>
                    <ExternalLink className="w-3" />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
