import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import FleetHealthView from "./components/FleetHealthView";
import AIRecommendationsView from "./components/AIRecommendationsView";
import ActivityLogView from "./components/ActivityLogView";
import SettingsView from "./components/SettingsView";
import ReasoningPanel from "./components/ReasoningPanel";
import AICopilotView from "./components/AICopilotView";
import SystemDocsView from "./components/SystemDocsView";
import { SeeAlternativesModal, OverrideModal, EscalateModal, AdminProfileModal } from "./components/Modals";
import { Recommendation, ReasoningChain, ActivityLogEntry, DeviceStatus } from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("Highest Confidence");

  // Collapse sidebar on switch on mobile
  const handleSetCurrentTab = (tab: string) => {
    setCurrentTab(tab);
    setIsSidebarOpen(false);
  };

  // Theme state choice: light, dark, system
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    return (localStorage.getItem("opsai-theme") as "light" | "dark" | "system") || "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (currentTheme: "light" | "dark" | "system") => {
      root.classList.remove("light", "dark");
      localStorage.setItem("opsai-theme", currentTheme);
      
      if (currentTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(currentTheme);
      }
    };

    applyTheme(theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        const dynamicTheme = e.matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(dynamicTheme);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // Autonomy Dial State
  const [autonomyMode, setAutonomyMode] = useState<"always-ask" | "act-notify" | "fully-autonomous">("always-ask");

  // User/Admin Profile states
  const [adminName, setAdminName] = useState<string>(() => {
    return localStorage.getItem("opsai-admin-name") || "Mukti Code";
  });
  const [adminRole, setAdminRole] = useState<string>(() => {
    return localStorage.getItem("opsai-admin-role") || "System Administrator";
  });
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem("opsai-admin-email") || "mukti.code@gmail.com";
  });
  const [adminAvatar, setAdminAvatar] = useState<string>(() => {
    return localStorage.getItem("opsai-admin-avatar") || 
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAw_PWNyhJ7c5m0MswI-EOBT3syeJ3dTD490KeEjANonktP3rDwpHJBlrHVJ5U0TmSlPlOCOKCTbs1Duop2P6WSzA3rhL265l92GpWYwsIljvb8VSm-RaU7-PtX0JdHdobbAawo80OUN4GrkWGePQc5AYjp6BQIOPozliWzQjQctgfNUNKrmUrGxC1jtSufZDoDOedWkzS1JpXBJ8-GMc-ID93VVXKoVsw6HDidq8TzsSReUFEGyhAOdZHkQQ0Ouwle4t-bssOxpg9D";
  });

  useEffect(() => {
    localStorage.setItem("opsai-admin-name", adminName);
  }, [adminName]);

  useEffect(() => {
    localStorage.setItem("opsai-admin-role", adminRole);
  }, [adminRole]);

  useEffect(() => {
    localStorage.setItem("opsai-admin-email", adminEmail);
  }, [adminEmail]);

  useEffect(() => {
    localStorage.setItem("opsai-admin-avatar", adminAvatar);
  }, [adminAvatar]);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Dialog / Modal States
  const [activeAlternativesRec, setActiveAlternativesRec] = useState<Recommendation | null>(null);
  const [overrideTargetRec, setOverrideTargetRec] = useState<Recommendation | null>(null);
  const [escalateTargetRec, setEscalateTargetRec] = useState<Recommendation | null>(null);

  // Initial Recommendations dataset matching exactly the screenshots with detailed transparency properties
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "#REC-0128",
      title: "Update Security Patch KB502",
      description: "Addresses critical vulnerabilities found across eighty-five percent of fleet hosts by initiating immediate security patching.",
      confidence: 98,
      severity: "medium",
      source: "security patch CVE bulletins from Microsoft catalogs over the past 48 hours",
      sources: [
        "Based on security patch CVE bulletins from Microsoft catalogs over the past 48 hours",
        "Based on active OS packages telemetry from 3,420 device repositories over the past 7 days"
      ],
      estDuration: "12 min",
      primaryAction: "Execute Patch",
      secondaryAction: "View Details",
      influencingFactors: [
        "Direct software scan of OS database catalog packages",
        "Vulnerability databases matched CVE-2026-9040 index",
        "Production canary deployment successfully compiled"
      ],
      alternatives: [
        {
          id: "ALT-01",
          title: "Staggered Minor Upgrades on Canary Sub-group",
          confidence: 84,
          description: "Run KB502 selectively on 10% of nodes first to verify stability.",
          justification: "Lower immediate impact but increases orchestration duration to 2 hours.",
          source: "Canary Deployment Pipeline",
          estDuration: "35 min"
        },
        {
          id: "ALT-02",
          title: "Compensating Firewall Dropdown Rule",
          confidence: 42,
          description: "Inject emergency rules in proxy layer to drop payload signals containing exploit footprints.",
          justification: "Interim fix only; adds 4% latency overhead on high-priority packet networks.",
          source: "Nginx Access Rule",
          estDuration: "35 sec"
        }
      ]
    },
    {
      id: "#REC-0129",
      title: "Quarantine Device LAP-920",
      description: "Quarantines workstation LAP-920 to block unusual outbound traffic spikes that suggest a potential database credential compromise.",
      confidence: 65,
      severity: "medium",
      source: "outbound TCP link telemetry from US-WEST gateways over the past 24 hours",
      sources: [
        "Based on outbound TCP link telemetry from US-WEST gateway ports over the past 24 hours",
        "Based on active DNS event queries from workstation LAP-920 over the past 24 hours",
        "Based on authentication audit indexes from SRE Sentinel Security catalog over the past 4 hours"
      ],
      estDuration: "4 min",
      limitation: "This recommendation has not been validated on this device model (LAP-920 workstation); Insufficient historical data for this device category.",
      primaryAction: "Quarantine",
      secondaryAction: "Compare Logs",
      influencingFactors: [
        "Traffic spikes exceeding 10x baseline on workstation LAP-920",
        "Unscheduled off-hours packet streams to foreign IP subnet blocks",
        "DHCP logs trace active credentials to system administrator keys"
      ],
      alternatives: [
        {
          id: "ALT-03",
          title: "Sandbox Outgoing Payload Limits",
          confidence: 58,
          description: "Throttle workstation network speed limits strictly to 128kbps.",
          justification: "Drops payload rate to protect data while keeping the workstation's administrative console active.",
          source: "BGP Router policies",
          estDuration: "2 min"
        },
        {
          id: "ALT-04",
          title: "Passive Packet Tracking Sequence",
          confidence: 35,
          description: "Enable intensive logging traces on target workstation interfaces without active containment.",
          justification: "Obtains detailed forensic stream context but leaves exfiltration channel actively open.",
          source: "AWS VPC Traffic Mirroring",
          estDuration: "1 min"
        }
      ]
    },
    {
      id: "#REC-0130",
      title: "Roll back Config v2.1",
      description: "Restores service stability by reversing configuration v2.1 to resolve elevated application crash loops across EMEA servers.",
      confidence: 45,
      severity: "high",
      source: "HTTP server response telemetry from EMEA client gateways over the past 3 hours",
      sources: [
        "Based on HTTP 503 gateway crash logs from EMEA proxy nodes over the past 3 hours",
        "Based on deployment commit history logs from configuration repository v2.1 over the past 4 hours"
      ],
      estDuration: "8 min",
      primaryAction: "Execute Rollback",
      secondaryAction: "Dismiss",
      influencingFactors: [
        "40% latency surge correlates with Config v2.1 deployment timestamp",
        "Real-time HTTP 503 gateway errors flagged by core load balancers",
        "Critical crash loops reported on 40% of microservice application tasks"
      ],
      alternatives: [
        {
          id: "ALT-05",
          title: "In-place Gateway Thread Recycler",
          confidence: 38,
          description: "Execute targeted V8 memory stack purges on system gateways to clear sockets.",
          justification: "Temporary memory reclamation; underlying socket leaks in v2.1 codebase will persist.",
          source: "Worker Node Manager CLI",
          estDuration: "45 sec"
        },
        {
          id: "ALT-06",
          title: "Load Balancer Route Bypass",
          confidence: 22,
          description: "Redirect inbound connections around crashing instances into stable cold standby hosts.",
          justification: "Restores partial user connectivity but degrades overall standby region performance metrics.",
          source: "Dynamic Ingress Route53",
          estDuration: "3 min"
        }
      ]
    }
  ]);

  // Devices states mapping
  const [devices, setDevices] = useState<DeviceStatus[]>([
    { id: "LAP-920", name: "LAP-920 Workstation", status: "online", region: "US-WEST", cpu: 44, memory: 78, uptime: 98.4, lastPing: "10s ago" },
    { id: "EMEA-NODE-01", name: "EMEA Edge Core 01", status: "online", region: "EMEA", cpu: 94, memory: 91, uptime: 99.9, lastPing: "2s ago" },
    { id: "EMEA-NODE-02", name: "EMEA Proxy Standby 02", status: "online", region: "EMEA", cpu: 22, memory: 45, uptime: 99.98, lastPing: "12s ago" },
    { id: "US-EAST-01", name: "US-EAST Router Hub", status: "online", region: "US-EAST", cpu: 35, memory: 62, uptime: 99.95, lastPing: "4s ago" },
    { id: "US-WEST-02", name: "US-WEST Database Standby", status: "online", region: "US-WEST", cpu: 12, memory: 34, uptime: 99.99, lastPing: "1s ago" },
    { id: "APAC-STANDBY", name: "APAC Regional Node Core", status: "online", region: "APAC", cpu: 18, memory: 55, uptime: 99.88, lastPing: "5s ago" },
  ]);

  // Initial Logs
  const [logs, setLogs] = useState<ActivityLogEntry[]>([
    { id: "#REC-0130", timestamp: "11:01:22", event: "Incident #REC-0130 detected crash loops on microservices", source: "User Incident Logs", severity: "high", category: "Security" },
    { id: "#REC-0129", timestamp: "11:00:45", event: "LAP-920 outbound link packet audit executed actively", source: "Network Telemetry", severity: "medium", category: "Security" },
    { id: "#CFG-INIT", timestamp: "10:59:12", event: "Sys-Admin authenticated session opened actively", source: "Administrator Identity", severity: "info", category: "Database" },
    { id: "#NET-CORE", timestamp: "10:55:00", event: "All core distributed virtual subnets registered online", source: "System Ingress", severity: "info", category: "Mitigation" }
  ]);

  // Reasoning Drawer state parameters
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [isReasoningOpen, setIsReasoningOpen] = useState<boolean>(false);
  const [reasoningData, setReasoningData] = useState<ReasoningChain | null>(null);
  const [isReasoningLoading, setIsReasoningLoading] = useState<boolean>(false);

  // Playground state parameters
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [lastGenerated, setLastGenerated] = useState<Recommendation | null>(null);

  // Auto-fetch Reasoning on click
  const handleSelectRecommendation = async (rec: Recommendation) => {
    setSelectedRecommendation(rec);
    setIsReasoningOpen(true);
    setIsReasoningLoading(true);

    try {
      const response = await fetch("/api/gemini/reasoning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendation: rec })
      });
      if (response.ok) {
        const data = await response.json();
        setReasoningData(data);
      } else {
        throw new Error("Could not fetch AI reasoning");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsReasoningLoading(false);
    }
  };

  // Triggers Actions e.g., Patching, Quarantine, Rollback
  const handleExecuteAction = (id: string, actionName: string) => {
    const timestampString = new Date().toLocaleTimeString();
    
    // Set recommendations to executed
    setRecommendations((prev) => 
      prev.map((rec) => rec.id === id ? { ...rec, isExecuted: true } : rec)
    );

    // Dynamic operations simulation side-effects
    if (id === "#REC-0129") {
      // Laptop LAP-920 Quarantine
      setDevices((prev) => 
        prev.map((dev) => dev.id === "LAP-920" ? { ...dev, status: "quarantined", cpu: 0 } : dev)
      );
    } else if (id === "#REC-0130") {
      // Configuration Rollback Config v2.1 (EMEA Edge Core 01)
      setDevices((prev) => 
        prev.map((dev) => dev.id === "EMEA-NODE-01" ? { ...dev, cpu: 25, status: "online" } : dev)
      );
    }

    // Append log event
    const recObj = recommendations.find((r) => r.id === id);
    const newLog: ActivityLogEntry = {
      id,
      timestamp: timestampString,
      event: `Execution Success: Approved action '${actionName}' running on targeted nodes.`,
      source: recObj?.source || "OpsAI Autopilot Core",
      severity: "low",
      category: "Mitigation",
    };
    setLogs((prev) => [newLog, ...prev]);

    // Update active Reasoning drawer state as well
    if (selectedRecommendation?.id === id) {
      setSelectedRecommendation((prev) => prev ? { ...prev, isExecuted: true } : null);
    }
  };

  // Dismiss a recommendation
  const handleDismissRecommendation = (id: string) => {
    const timestampString = new Date().toLocaleTimeString();
    setRecommendations((prev) => prev.map((r) => r.id === id ? { ...r, isDismissed: true } : r));
    
    const recObj = recommendations.find((r) => r.id === id);
    const newLog: ActivityLogEntry = {
      id,
      timestamp: timestampString,
      event: `Recommendation alert dismissed by Sys-Admin: ${recObj?.title || ""}`,
      source: "Manual Console",
      severity: "info",
      category: "Mitigation",
    };
    setLogs((prev) => [newLog, ...prev]);

    if (selectedRecommendation?.id === id) {
      setIsReasoningOpen(false);
      setSelectedRecommendation(null);
    }
  };

  // Generate on-demand custom recommendation based on custom prompts
  const handleGenerateCustomRecommendation = async (promptText: string) => {
    setIsGenerating(true);
    setLastGenerated(null);

    // Force tab shift so they inspect results
    setCurrentTab("ai-recommendations");

    try {
      const response = await fetch("/api/gemini/generate-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText, currentCount: recommendations.length })
      });
      if (response.ok) {
        const newRec: Recommendation = await response.json();
        setRecommendations((prev) => [newRec, ...prev]);
        setLastGenerated(newRec);

        // Prepend action log
        const timestampString = new Date().toLocaleTimeString();
        const newLog: ActivityLogEntry = {
          id: newRec.id,
          timestamp: timestampString,
          event: `AI Synthesizer registered new container incident recommendation: ${newRec.title}`,
          source: newRec.source,
          severity: newRec.severity,
          category: "Mitigation"
        };
        setLogs((prev) => [newLog, ...prev]);
      } else {
        throw new Error("Failed to call custom generator module");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Telemetry log random generator (real-time stream simulation)
  const handleTriggerRandomLog = () => {
    const events = [
      "Heap compaction completed on AP-NORTHEAST shards",
      "V8 system thread garbage scavenger collected 145MB memory from US-EAST router host",
      "Dynamic load balancer shifted 12% in ingress paths to AP-NORTHEAST-02 subnet",
      "Nginx reverse security proxy re-verified TLS handshake protocols successfully",
      "Scheduled backup sync snapshot pool initialized on backup standalone mount point"
    ];
    const categories = ["Mitigation", "Database", "Security", "Patching"];
    const sources = ["Telemetry Agent", "Docker Daemon", "Nginx Proxy Server", "AWS CloudTrail"];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomSeverity = (["low", "info"][Math.floor(Math.random() * 2)]) as "low" | "info";

    const timestampString = new Date().toLocaleTimeString();
    const newLog: ActivityLogEntry = {
      id: `#LOG-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: timestampString,
      event: randomEvent,
      source: randomSource,
      severity: randomSeverity,
      category: randomCategory,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Clear or reset logs
  const handleClearLogs = () => {
    setLogs([]);
  };

  // Simulate settings threshold failover
  const handleSimulateCrit = (type: string) => {
    if (type === "database") {
      handleGenerateCustomRecommendation("Standby Postgres database synchronization replication lag exceeded 15 seconds. Active read-write block is threatening SLA guarantees.");
    } else {
      handleGenerateCustomRecommendation("Brute force authentication lockouts reported on administrative login port 22 from suspicious unregistered IP. Immediate containment advised.");
    }
  };

  // Toggle node isolation directly from health catalog
  const handleTestDevice = (id: string) => {
    const timestampString = new Date().toLocaleTimeString();
    const devObj = devices.find((d) => d.id === id);
    const newLog: ActivityLogEntry = {
      id: `#TEST-${id}`,
      timestamp: timestampString,
      event: `Diagnostic query sequence completed on targeted node instances: ${devObj?.name || id}. All metrics passing stable boundaries.`,
      source: "Health Collector Tool",
      severity: "low",
      category: "Mitigation",
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleQuarantineToggle = (id: string) => {
    const timestampString = new Date().toLocaleTimeString();
    setDevices((prev) => 
      prev.map((dev) => {
        if (dev.id === id) {
          const nextStatus = dev.status === "quarantined" ? "online" : "quarantined";
          
          const newLog: ActivityLogEntry = {
            id: `#SEC-ISO`,
            timestamp: timestampString,
            event: nextStatus === "quarantined" 
              ? `Manual Isolation Override Action Executed: workstation ${dev.name} placed in sandbox subnet quarantine.`
              : `Manual Isolation Override Revoked: workstation ${dev.name} restored to baseline operations.`,
            source: "Sys-Admin Panel",
            severity: nextStatus === "quarantined" ? "medium" : "low",
            category: "Security",
          };
          setLogs((prev) => [newLog, ...prev]);

          return { ...dev, status: nextStatus };
        }
        return dev;
      })
    );
  };

  // Confirm Override Handler
  const handleConfirmOverride = (recId: string, customCommand: string, overrideReason: string) => {
    const timestampString = new Date().toLocaleTimeString();
    
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId
          ? {
              ...r,
              isExecuted: true,
              isOverridden: true,
              overrideDetails: { command: customCommand, reason: overrideReason },
            }
          : r
      )
    );

    const recObj = recommendations.find((r) => r.id === recId);
    const newLog: ActivityLogEntry = {
      id: recId,
      timestamp: timestampString,
      event: `OVERRIDE EXECUTED: Rejected AI advice '${recObj?.title}' for command: [ ${customCommand} ]. Reason: ${overrideReason}`,
      source: "Manual Human Override",
      severity: "high",
      category: "Security",
    };
    setLogs((prev) => [newLog, ...prev]);

    if (selectedRecommendation?.id === recId) {
      setSelectedRecommendation((prev) =>
        prev ? { ...prev, isExecuted: true, isOverridden: true, overrideDetails: { command: customCommand, reason: overrideReason } } : null
      );
    }
  };

  // Confirm Escalation Handler
  const handleConfirmEscalate = (recId: string, assignedTeam: string, comment: string) => {
    const timestampString = new Date().toLocaleTimeString();

    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, isEscalated: true, escalatedTo: assignedTeam } : r))
    );

    const recObj = recommendations.find((r) => r.id === recId);
    const newLog: ActivityLogEntry = {
      id: recId,
      timestamp: timestampString,
      event: `ESCALATION CREATED: '${recObj?.title}' routed to [ ${assignedTeam} ]. Context: ${comment || "None provided"}`,
      source: "Escalation Hub Agent",
      severity: "medium",
      category: "Mitigation",
    };
    setLogs((prev) => [newLog, ...prev]);

    if (selectedRecommendation?.id === recId) {
      setSelectedRecommendation((prev) => (prev ? { ...prev, isEscalated: true, escalatedTo: assignedTeam } : null));
    }
  };

  // Choose Alternative Track Handler
  const handleChooseAlternative = (recId: string, altTitle: string) => {
    const timestampString = new Date().toLocaleTimeString();

    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, isExecuted: true, title: `${altTitle} (Secondary Track)` } : r))
    );

    const recObj = recommendations.find((r) => r.id === recId);
    const newLog: ActivityLogEntry = {
      id: recId,
      timestamp: timestampString,
      event: `TRACK CHANGE: Bypassed primary recommendation '${recObj?.title}' to execute secondary track: ${altTitle}`,
      source: "Alternative Route Selector",
      severity: "medium",
      category: "Mitigation",
    };
    setLogs((prev) => [newLog, ...prev]);

    if (selectedRecommendation?.id === recId) {
      setSelectedRecommendation((prev) => (prev ? { ...prev, isExecuted: true, title: `${altTitle} (Secondary Track)` } : null));
    }
    setActiveAlternativesRec(null);
  };

  const handleAddNewRecommendation = (rec: {
    title: string;
    description: string;
    confidence: number;
    severity: "high" | "medium" | "low";
    source: string;
    primaryAction: string;
    secondaryAction: string;
    estDuration?: string;
    limitation?: string;
  }) => {
    const nextIdNumber = 128 + recommendations.length;
    const nextId = `#REC-0${nextIdNumber}`;
    const newRec: Recommendation = {
      id: nextId,
      estDuration: rec.estDuration || "5 min",
      ...rec,
      influencingFactors: [
        "Interactive SRE Copilot diagnostic request",
        "Manual chat consultation assessment logs",
        "Factual correlation index matching system rule triggers"
      ],
      alternatives: [
        {
          id: `ALT-C01`,
          title: `Postpone "${rec.title}" execution`,
          confidence: Math.max(10, rec.confidence - 20),
          description: "Delay operational adjustments to continue diagnostic profiling and metric observation.",
          justification: "Avoids sudden system restarts but extends mitigation latency.",
          source: "SRE Recommendation Alternatives",
          estDuration: "1 hour"
        }
      ]
    };
    setRecommendations((prev) => [newRec, ...prev]);
  };

  const handleAddNewLog = (event: string, source: string, severity: "low" | "medium" | "high", category: string) => {
    const timestampString = new Date().toLocaleTimeString();
    const newLog: ActivityLogEntry = {
      id: `#LOG-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: timestampString,
      event,
      source,
      severity,
      category
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Filter recommendations based on global search in Header
  const activeRecommendations = recommendations.filter((r) => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-[#080b11] text-[#191c1e] dark:text-slate-100 font-sans antialiased overflow-x-hidden transition-colors duration-200">
      
      {/* Mobile Sidebar overlay backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/45 backdrop-blur-xs z-40 transition-opacity duration-300"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={handleSetCurrentTab} 
        pendingCount={recommendations.filter(r => !r.isExecuted && !r.isDismissed).length} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        adminName={adminName}
        adminRole={adminRole}
        adminAvatar={adminAvatar}
        onOpenProfile={() => setIsAdminModalOpen(true)}
      />

      {/* Header Panel */}
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onGenerateCustom={handleGenerateCustomRecommendation}
        isGenerating={isGenerating}
        theme={theme}
        onChangeTheme={setTheme}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        currentTab={currentTab}
        setCurrentTab={handleSetCurrentTab}
      />

      {/* Central Screen Body */}
      <main className="ml-0 lg:ml-[260px] pt-24 px-4 sm:px-8 pb-12 w-full lg:w-[calc(100%-260px)] min-h-[calc(100vh-64px)] transition-all duration-300">
        {currentTab === "dashboard" && (
          <DashboardView 
            recommendations={activeRecommendations}
            selectedRecommendation={selectedRecommendation}
            onSelectRecommendation={handleSelectRecommendation}
            onExecute={handleExecuteAction}
            onDismiss={handleDismissRecommendation}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            autonomyMode={autonomyMode}
            setAutonomyMode={setAutonomyMode}
            onOpenAlternatives={setActiveAlternativesRec}
            onOpenOverride={setOverrideTargetRec}
            onOpenEscalate={setEscalateTargetRec}
          />
        )}

        {currentTab === "fleet-health" && (
          <FleetHealthView 
            devices={devices}
            onTestDevice={handleTestDevice}
            onQuarantineToggle={handleQuarantineToggle}
          />
        )}

        {currentTab === "ai-copilot" && (
          <AICopilotView 
            onAddRecommendation={handleAddNewRecommendation}
            onAddLog={handleAddNewLog}
            adminName={adminName}
            adminAvatar={adminAvatar}
          />
        )}

        {currentTab === "ai-recommendations" && (
          <AIRecommendationsView 
            onGenerateCustom={handleGenerateCustomRecommendation}
            isGenerating={isGenerating}
            lastGenerated={lastGenerated}
            count={recommendations.length}
          />
        )}

        {currentTab === "activity-log" && (
          <ActivityLogView 
            logs={logs}
            onTriggerRandomLog={handleTriggerRandomLog}
            onClearLogs={handleClearLogs}
          />
        )}

        {currentTab === "settings" && (
          <SettingsView 
            userEmail={adminEmail}
            onSimulateCrit={handleSimulateCrit}
            theme={theme}
            onChangeTheme={setTheme}
          />
        )}

        {currentTab === "system-docs" && (
          <SystemDocsView />
        )}
      </main>

      {/* Slide-out AI Reasoning Drawer */}
      <ReasoningPanel 
        isOpen={isReasoningOpen}
        onClose={() => setIsReasoningOpen(false)}
        recommendation={selectedRecommendation}
        reasoning={reasoningData}
        isLoading={isReasoningLoading}
        onExecuteAction={handleExecuteAction}
      />

      {/* Interactive Mandated Dialogs */}
      <SeeAlternativesModal
        isOpen={activeAlternativesRec !== null}
        onClose={() => setActiveAlternativesRec(null)}
        recommendation={activeAlternativesRec}
        onChooseAlternative={handleChooseAlternative}
      />

      <OverrideModal
        isOpen={overrideTargetRec !== null}
        onClose={() => setOverrideTargetRec(null)}
        recommendation={overrideTargetRec}
        onConfirmOverride={handleConfirmOverride}
      />

      <EscalateModal
        isOpen={escalateTargetRec !== null}
        onClose={() => setEscalateTargetRec(null)}
        recommendation={escalateTargetRec}
        onConfirmEscalate={handleConfirmEscalate}
      />

      <AdminProfileModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        adminName={adminName}
        setAdminName={setAdminName}
        adminRole={adminRole}
        setAdminRole={setAdminRole}
        adminEmail={adminEmail}
        setAdminEmail={setAdminEmail}
        adminAvatar={adminAvatar}
        setAdminAvatar={setAdminAvatar}
        onAddLog={handleAddNewLog}
      />
    </div>
  );
}

