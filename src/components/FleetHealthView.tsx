import React, { useState } from "react";
import { DeviceStatus } from "../types";
import { 
  Activity, 
  Cpu, 
  Database, 
  Server, 
  AlertOctagon, 
  CheckCircle2, 
  Play, 
  RotateCw, 
  Search, 
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  GitBranch,
  ShieldCheck
} from "lucide-react";

interface FleetHealthProps {
  devices: DeviceStatus[];
  onTestDevice: (id: string) => void;
  onQuarantineToggle: (id: string) => void;
}

export default function FleetHealthView({ devices, onTestDevice, onQuarantineToggle }: FleetHealthProps) {
  const [filterRegion, setFilterRegion] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [testingId, setTestingId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("scraper");

  const filteredDevices = devices.filter((dev) => {
    const matchesRegion = filterRegion === "All" || dev.region === filterRegion;
    const matchesStatus = filterStatus === "All" || dev.status === filterStatus;
    const matchesSearch = dev.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dev.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesStatus && matchesSearch;
  });

  const runLocalTest = (id: string) => {
    setTestingId(id);
    onTestDevice(id);
    setTimeout(() => {
      setTestingId(null);
    }, 1500);
  };

  // Aggregated calculations
  const avgCpu = Math.round(devices.reduce((acc, current) => acc + current.cpu, 0) / devices.length);
  const avgMemory = Math.round(devices.reduce((acc, current) => acc + current.memory, 0) / devices.length);
  const quarantinedCount = devices.filter((d) => d.status === "quarantined").length;
  const activeCount = devices.filter((d) => d.status === "online").length;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Overview stats header */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white dark:bg-[#0f172a] p-5 rounded-xl border border-[#c6c6cd] dark:border-slate-800 shadow-sm flex items-center space-x-4 transition-colors">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-[#45464d] dark:text-slate-400 font-bold uppercase tracking-wider">Active Tasks</p>
            <p className="text-[22px] font-bold text-[#191c1e] dark:text-slate-100 font-mono">{activeCount} Nodes</p>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white dark:bg-[#0f172a] p-5 rounded-xl border border-[#c6c6cd] dark:border-slate-800 shadow-sm flex items-center space-x-4 transition-colors">
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-lg">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-[#45464d] dark:text-slate-400 font-bold uppercase tracking-wider">Quarantined Hubs</p>
            <p className="text-[22px] font-bold text-[#191c1e] dark:text-slate-100 font-mono">{quarantinedCount} Nodes</p>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white dark:bg-[#0f172a] p-5 rounded-xl border border-[#c6c6cd] dark:border-slate-800 shadow-sm flex items-center space-x-4 transition-colors">
          <div className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[11px] text-[#45464d] dark:text-slate-400 font-bold uppercase tracking-wider">Avg Core Load</p>
            <p className="text-[22px] font-bold text-[#191c1e] dark:text-slate-100 font-mono">{avgCpu}%</p>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white dark:bg-[#0f172a] p-5 rounded-xl border border-[#c6c6cd] dark:border-slate-800 shadow-sm flex items-center space-x-4 transition-colors">
          <div className="p-3 bg-[#d0e1fb]/40 dark:bg-indigo-950/45 text-[#54647a] dark:text-indigo-400 rounded-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-[#45464d] dark:text-slate-400 font-bold uppercase tracking-wider">Average Mem Pool</p>
            <p className="text-[22px] font-bold text-[#191c1e] dark:text-slate-100 font-mono">{avgMemory}%</p>
          </div>
        </div>
      </div>

      {/* Multi-Agent Collaboration Pipeline - Hackathon Stretch Goal */}
      <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors space-y-4">
        <div>
          <span className="text-[10px] bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-2.5 py-0.5 rounded font-mono uppercase tracking-widest font-bold">
            Multi-Agent Transparency Trace
          </span>
          <h3 className="text-[16px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider mt-2.5">
            Collaborative AI Remediation Chain
          </h3>
          <p className="text-[12px] text-[#45464d] dark:text-slate-350 leading-relaxed max-w-4xl">
            See how specialized agents coordinate telemetry monitoring, signature extraction, mitigation blueprint design, and SRE audit logging. Click on any agent to inspect its context.
          </p>
        </div>

        {/* Visual Map timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {[
            {
              id: "scraper",
              name: "MetricScraper Agent",
              role: "Fleet Monitoring",
              status: "Idle - Ingesting stats",
              desc: "Ingests continuous device logs & system performance loops. Triggers parsing if any metric is anomalous.",
              context: "Checked 3,420 nodes across global zones. Checked memory allocations.",
              input: "Raw performance logs & metrics logs",
              output: "Telemetry JSON frame payload",
              icon: Cpu,
            },
            {
              id: "matcher",
              name: "SignaturesMatcher Agent",
              role: "Anomaly Classification",
              status: "Analyzing cluster logs",
              desc: "Matches real-time logs against known signature sets. Computes qualitative confidence indexes.",
              context: "Deduced a memory pattern leak (84% confidence match score) on US-EAST container pool.",
              input: "Telemetry JSON frame payload",
              output: "Classified signature pattern data",
              icon: AlertOctagon,
            },
            {
              id: "architect",
              name: "BlueprintsArchitect Agent",
              role: "Mitigation Design",
              status: "Synthesizing plans",
              desc: "Builds non-technical, readable remediation blueprints, estimates durations, and clarifies system execution boundaries.",
              context: "Estimated a 15-minute diagnostic safe sandbox rollout patch to correct cluster drift.",
              input: "Classified signature pattern data",
              output: "Mitigation asset card details & limitations warnings",
              icon: Sparkles,
            },
            {
              id: "sentinel",
              name: "AuditSentinel Agent",
              role: "Human Oversight Gate",
              status: "Securing approvals",
              desc: "Captures user-submitted approvals, manual commands, and overrides to secure and register pristine audit trails.",
              context: "Recorded admin profile updates and quarantine actions to the physical log file system.",
              input: "Admin commands, approvals, or overrides",
              output: "Structured SRE activity journal trails",
              icon: ShieldCheck,
            }
          ].map((agent, index, array) => {
            const Icon = agent.icon;
            const isSelected = selectedAgentId === agent.id;
            return (
              <div key={agent.id} className="relative flex flex-col md:flex-row items-center">
                {/* Connection Line */}
                {index < array.length - 1 && (
                  <div className="hidden md:block absolute top-7 -right-2 w-4 h-[1.5px] bg-slate-300 dark:bg-slate-700 z-0"></div>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`w-full z-10 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "bg-slate-950 dark:bg-slate-900 border-slate-950 dark:border-slate-800 text-white shadow-md scale-[1.02]"
                      : "bg-[#f2f4f6]/40 dark:bg-slate-950 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-[#f2f4f6]/80 dark:hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-1.5 rounded ${isSelected ? "bg-slate-800 text-white dark:bg-slate-800" : "bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-300"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <p className="text-[12px] font-bold font-mono truncate">{agent.name}</p>
                      <p className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>{agent.role}</p>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Agent info presentation */}
        {(() => {
          const activeAgent = [
            {
              id: "scraper",
              name: "MetricScraper Agent",
              role: "Fleet Monitoring",
              status: "Online - Ingesting system metrics",
              desc: "Ingests continuous device logs & system performance loops. Triggers parsing if any metric is anomalous.",
              context: "Checked 3,420 nodes across global zones. Checked memory allocations.",
              input: "Raw performance logs & metrics logs",
              output: "Telemetry JSON frame payload",
              icon: Cpu,
            },
            {
              id: "matcher",
              name: "SignaturesMatcher Agent",
              role: "Anomaly Classification",
              status: "Online - Analyzing cluster logs",
              desc: "Matches real-time logs against known signature sets. Computes qualitative confidence indexes.",
              context: "Deduced a memory pattern leak (84% confidence match score) on US-EAST container pool.",
              input: "Telemetry JSON frame payload",
              output: "Classified signature pattern data",
              icon: AlertOctagon,
            },
            {
              id: "architect",
              name: "BlueprintsArchitect Agent",
              role: "Mitigation Design",
              status: "Online - Synthesizing plans",
              desc: "Builds non-technical, readable remediation blueprints, estimates durations, and clarifies system execution boundaries.",
              context: "Estimated a 15-minute diagnostic safe sandbox rollout patch to correct cluster drift.",
              input: "Classified signature pattern data",
              output: "Mitigation asset card details & limitations warnings",
              icon: Sparkles,
            },
            {
              id: "sentinel",
              name: "AuditSentinel Agent",
              role: "Human Oversight Gate",
              status: "Online - Securing approvals",
              desc: "Captures user-submitted approvals, manual commands, and overrides to secure and register pristine audit trails.",
              context: "Recorded admin profile updates and quarantine actions to the physical log file system.",
              input: "Admin commands, approvals, or overrides",
              output: "Structured SRE activity journal trails",
              icon: ShieldCheck,
            }
          ].find(a => a.id === selectedAgentId);

          if (!activeAgent) return null;
          const ActiveIcon = activeAgent.icon;

          return (
            <div className="bg-slate-50 dark:bg-slate-950/20 rounded-xl p-4 border border-[#eceef0] dark:border-slate-805/70 flex flex-col md:flex-row gap-4 justify-between items-start text-xs font-sans">
              <div className="space-y-2 flex-grow max-w-xl">
                <div className="flex items-center space-x-2">
                  <ActiveIcon className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-bold text-slate-900 dark:text-slate-100">{activeAgent.name} Status context</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 animate-pulse">
                    {activeAgent.status}
                  </span>
                </div>
                <p className="text-slate-650 dark:text-slate-300 leading-relaxed">
                  {activeAgent.desc}
                </p>
                <div className="text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 font-mono text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-350">Live Task Context:</span> "{activeAgent.context}"
                </div>
              </div>

              <div className="w-full md:w-64 shrink-0 font-mono text-[10px] space-y-2 select-none">
                <div className="p-2 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/30 rounded">
                  <span className="text-slate-400 block uppercase font-bold tracking-wider text-[9px]">Agent Inflow (Input)</span>
                  <span className="text-slate-750 dark:text-slate-300">{activeAgent.input}</span>
                </div>
                <div className="p-2 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/30 rounded">
                  <span className="text-slate-400 block uppercase font-bold tracking-wider text-[9px]">Agent Outflow (Output)</span>
                  <span className="text-slate-750 dark:text-slate-300">{activeAgent.output}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Interactive controller catalog table */}
      <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="p-5 border-b border-[#eceef0] dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/20">
          <div>
            <h3 className="text-[16px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider">Active Fleet Catalog</h3>
            <p className="text-[12px] text-[#45464d] dark:text-slate-350">Targeted control rules for container cluster instances.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#45464d] dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search node ID..."
                className="pl-9 pr-4 py-1.5 bg-white dark:bg-slate-900 border border-[#c6c6cd] dark:border-slate-800 rounded text-[12px] placeholder-[#45464d] dark:placeholder-slate-500 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-black w-[180px]"
              />
            </div>

            {/* Region Filter */}
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-[#c6c6cd] dark:border-slate-800 text-[#191c1e] dark:text-slate-100 rounded px-2 py-1.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
            >
              <option value="All" className="dark:bg-slate-900">All Regions</option>
              <option value="EMEA" className="dark:bg-slate-900">EMEA Region</option>
              <option value="US-EAST" className="dark:bg-slate-900">US-EAST Region</option>
              <option value="US-WEST" className="dark:bg-slate-900">US-WEST Region</option>
              <option value="APAC" className="dark:bg-slate-900">APAC Region</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-[#c6c6cd] dark:border-slate-800 text-[#191c1e] dark:text-slate-100 rounded px-2 py-1.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
            >
              <option value="All" className="dark:bg-slate-900">All States</option>
              <option value="online" className="dark:bg-slate-900">Online Only</option>
              <option value="quarantined" className="dark:bg-slate-900">Quarantined Only</option>
              <option value="maintenance" className="dark:bg-slate-900">Maintenance Only</option>
            </select>
          </div>
        </div>

        {/* Database Grid list table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#eceef0] dark:border-slate-850 bg-slate-50 dark:bg-slate-950/40 text-[11px] font-bold text-[#45464d] dark:text-slate-300 uppercase font-mono">
                <th className="py-3 px-5">Instance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">CPU Core Load</th>
                <th className="py-3 px-4">RAM Alloc</th>
                <th className="py-3 px-4">Uptime Metrics</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef0] dark:divide-slate-800 text-[13px]">
              {filteredDevices.map((dev) => {
                const isTested = testingId === dev.id;

                // Status Badge Color definitions
                let badgeClass = "";
                if (dev.status === "online") {
                  badgeClass = "bg-emerald-50 text-emerald-700 border border-emerald-100";
                } else if (dev.status === "quarantined") {
                  badgeClass = "bg-red-50 text-red-700 border border-red-100";
                } else {
                  badgeClass = "bg-amber-50 text-amber-700 border border-amber-100";
                }

                return (
                  <tr key={dev.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-900 text-[#45464d] dark:text-slate-300 rounded">
                          <Server className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-[#191c1e] dark:text-slate-100">{dev.name}</p>
                          <p className="text-[11px] text-[#45464d] dark:text-slate-400 font-mono">{dev.id}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${badgeClass}`}>
                        {dev.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#45464d] dark:text-slate-300 font-semibold">{dev.region}</td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1 w-32">
                        <div className="flex justify-between text-[11px] font-mono text-[#45464d] dark:text-slate-300">
                          <span>{dev.cpu}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${dev.cpu > 85 ? "bg-[#ba1a1a]" : dev.cpu > 65 ? "bg-amber-500 animate-pulse" : "bg-indigo-600 dark:bg-indigo-550"}`}
                            style={{ width: `${dev.cpu}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-800 dark:text-slate-200">{dev.memory}%</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#45464d] dark:text-slate-300">
                      {dev.uptime}%
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => runLocalTest(dev.id)}
                          disabled={isTested}
                          className="flex items-center space-x-1 border border-[#c6c6cd] dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-black dark:hover:border-slate-650 active:bg-slate-50 text-[11px] font-medium py-1 px-2.5 rounded cursor-pointer disabled:opacity-50 transition-all font-mono text-[#191c1e] dark:text-slate-250"
                          title="Execute light debug test suite"
                        >
                          {isTested ? (
                            <>
                              <RotateCw className="w-3 h-3 animate-spin text-indigo-600 dark:text-indigo-400" />
                              <span>Testing...</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 text-[#505f76] dark:text-slate-400" />
                              <span>Microtest</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onQuarantineToggle(dev.id)}
                          className={`text-[11px] font-mono font-bold py-1 px-2.5 rounded border cursor-pointer transition-all ${
                            dev.status === "quarantined"
                              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
                              : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/60"
                          }`}
                        >
                          {dev.status === "quarantined" ? "Revoke Isolation" : "Isolate Node"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredDevices.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#45464d]">
                    No device nodes conform to selected filter specifications.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
