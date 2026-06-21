import React, { useState } from "react";
import { 
  Sliders, 
  Mail, 
  Webhook, 
  Key, 
  ShieldAlert, 
  Cpu, 
  Save, 
  PlayCircle,
  Database,
  Radio,
  Sun,
  Moon,
  Monitor,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Code
} from "lucide-react";

interface SettingsProps {
  userEmail: string;
  onSimulateCrit: (type: string) => void;
  theme?: "light" | "dark" | "system";
  onChangeTheme?: (theme: "light" | "dark" | "system") => void;
}

export default function SettingsView({ 
  userEmail, 
  onSimulateCrit,
  theme = "system",
  onChangeTheme
}: SettingsProps) {
  const [cpuThreshold, setCpuThreshold] = useState(85);
  const [memThreshold, setMemThreshold] = useState(80);
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.opsai.internal/services/alert-relay");
  const [isSaved, setIsSaved] = useState(false);
  const [showIncident, setShowIncident] = useState(false);

  // Python automation settings & state
  const [selectedPyAction, setSelectedPyAction] = useState("fetch");
  const [selectedPyStyle, setSelectedPyStyle] = useState("requests");
  const [copied, setCopied] = useState(false);
  const [isSimulatingPy, setIsSimulatingPy] = useState(false);
  const [pyTerminalLogs, setPyTerminalLogs] = useState<string[]>([]);

  const handleCopyPyCode = () => {
    navigator.clipboard.writeText(getPythonScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePyRun = () => {
    setIsSimulatingPy(true);
    setPyTerminalLogs([]);
    
    const logsMap: Record<string, string[]> = {
      fetch: [
        "$ python query_fleet.py",
        "[INFO] Ingesting operational target coordinates: http://localhost:3000/api/health",
        "[INFO] Establishing TCP handshake protocol with server...",
        "[SUCCESS] HTTP/1.1 200 OK. Dynamic fleet monitoring links are healthy.",
        `[DATA] Response Payload: {"status": "ok", "time": "${new Date().toISOString()}"}`,
        "[DATA] Active Core Nodes Checked: 14 Nodes",
        "[SUCCESS] Python automation script executed with exit code 0."
      ],
      quarantine: [
        "$ python trigger_quarantine.py --node LAP-920",
        `[SRE AUTH] Authorized credentials matched for system admin: ${userEmail}`,
        "[INFO] Dispatching REST action payloader: isolate workstation 'LAP-920'",
        "[STATUS] HTTP/1.1 202 ACCEPTED. Request propagated.",
        "[INFO] AuditSentinel: Safe quarantine isolation policy implemented.",
        "[SUCCESS] Incident #REC-0129 quarantine status: PENDING VERIFICATION."
      ],
      alarms: [
        "$ python sync_alarms.py",
        "[INFO] Directing API query to load active alarm ceiling thresholds...",
        `[CONFIG SYNC] Warning threshold synced locally: CPU > ${cpuThreshold}%`,
        `[CONFIG SYNC] Warning threshold synced locally: RAM > ${memThreshold}%`,
        "[SUCCESS] Alarms synchronizer finalized successfully with 0 errors."
      ],
      incident: [
        "$ python fetch_postmortem.py",
        "[INFO] Querying isolated secure incident post-mortem catalogs...",
        "[SUCCESS] Retrieved structured report parameters count: 1 matched.",
        "--------------------------------------------------------------------------------",
        "INCIDENT RECORD: #INC-POST-928 | Duration: 4.2 min | Class: Payment Gateway",
        "ROOT CAUSE: Seasonal load spike mistakenly flagged as DDoS attack.",
        "SAFEGUARD POLICY CREATED: Multi-agent confirmation required for VIP payment channels.",
        "--------------------------------------------------------------------------------",
        "[SUCCESS] Local stdout output completed."
      ]
    };

    const targetLogs = logsMap[selectedPyAction] || [];
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      if (currentIdx < targetLogs.length) {
        setPyTerminalLogs((prev) => [...prev, targetLogs[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsSimulatingPy(false);
      }
    }, 250);
  };

  const getPythonScript = (): string => {
    if (selectedPyAction === "fetch") {
      if (selectedPyStyle === "asyncio") {
        return `# query_fleet_async.py
import asyncio
import httpx

async def fetch_fleet_state():
    url = "http://localhost:3000/api/health"
    print("[SYSTEM-ASYNC] Instigating concurrent task for fleet check...")
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, timeout=5.0)
            if resp.status_code == 200:
                print(f"[SUCCESS] Async response: {resp.json().get('status')} at {resp.json().get('time')}")
            else:
                print(f"[WARNING] Degradation alert on secondary pool. Status code: {resp.status_code}")
        except Exception as exc:
            print(f"[FAIL] Task crashed with communication error: {exc}")

async def main():
    # Gather multiple concurrent queries natively
    await asyncio.gather(fetch_fleet_state(), fetch_fleet_state())

if __name__ == "__main__":
    asyncio.run(main())`;
      } else if (selectedPyStyle === "cli-ops") {
        return `# ops_interactive_cli.py
import argparse
import sys
import requests

def main():
    parser = argparse.ArgumentParser(description="OpsAI SRE Command Line Interpreter")
    parser.add_argument("--endpoint", default="http://localhost:3000/api/health", help="API URL Target")
    parser.add_argument("--action", choices=["verify", "inspect"], default="verify", help="Primary action")
    args = parser.parse_args()

    print(f"[CLI] Initiating {args.action} on endpoint: {args.endpoint}")
    try:
        r = requests.get(args.endpoint, timeout=5)
        print(f"[CLI STATUS] Return Code: {r.status_code} | Payload: {r.json()}")
    except Exception as e:
        print(f"[CLI ERROR] Operational run failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()`;
      } else {
        return `# query_fleet.py
import requests

API_URL = "http://localhost:3000/api/health"
print("[SYSTEM] Accessing fleet health stats via Python requests module...")

try:
    response = requests.get(API_URL, timeout=5)
    if response.status_code == 200:
        data = response.json()
        print(f"[STATUS] OK. Current Server Time: {data.get('time')}")
        print("[RECOVERED] Database connectivity state: ACTIVE")
    else:
        print(f"[ALERT] Unhealthy response from system master: {response.status_code}")
except Exception as err:
    print(f"[CRITICAL FAILURE] Unable to open safe TCP connection: {err}")`;
      }
    }

    if (selectedPyAction === "quarantine") {
      if (selectedPyStyle === "asyncio") {
        return `# trigger_quarantine_async.py
import asyncio
import httpx

async def run_isolation():
    url = "http://localhost:3000/api/gemini/chat"
    req_body = {
        "message": "Verify quarantine status of node LAP-920",
        "history": []
    }
    async with httpx.AsyncClient() as client:
        print("[SRE-CONCURRENT] Launching isolation validation webhook...")
        try:
            r = await client.post(url, json=req_body, timeout=15.0)
            if r.status_code == 200:
                print(f"[SUCCESS] Async audit answer: {r.json().get('text')[:200]}...")
            else:
                print(f"[ALERT] Connection refused by API gateway: {r.status_code}")
        except Exception as e:
            print(f"[ERROR] Concurrency transaction dropped: {e}")

if __name__ == "__main__":
    asyncio.run(run_isolation())`;
      } else if (selectedPyStyle === "cli-ops") {
        return `# ops_interactive_cli.py
import argparse
import requests

def trigger_isolate(node):
    url = "http://localhost:3000/api/gemini/chat"
    payload = {"message": f"quarantine node {node}", "history": []}
    print(f"Sending isolated quarantine SRE signal for target: {node}...")
    try:
        r = requests.post(url, json=payload, timeout=8)
        print("[CLI RESPONSE] Status OK.")
        print(r.json().get("text"))
    except Exception as e:
        print(f"[CLI CRITICAL ERROR] Execution failed: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--node", default="LAP-920", help="Active workstation ID to isolate")
    args = parser.parse_args()
    trigger_isolate(args.node)`;
      } else {
        return `# trigger_quarantine.py
import requests

ENDPOINT = "http://localhost:3000/api/gemini/chat"
NODE_ID = "LAP-920"

print(f"Executing secure quarantine and diagnostic script for Node: {NODE_ID}...")
payload = {
    "message": f"How do I quarantine node {NODE_ID}?",
    "history": []
}

try:
    response = requests.post(ENDPOINT, json=payload, timeout=10)
    if response.status_code == 200:
        resolution = response.json()
        print("\\n=== QUARANTINE MITIGATION STEPS PRESCRIBED ===")
        print(resolution.get("text"))
        print("=============================================")
        print("[AUDIT SENTINEL] Quarantine catalog logged successfully to SRE system.")
    else:
        print(f"[ERROR] API call returned unverified status: {response.status_code}")
except Exception as e:
    print(f"[CRITICAL FAILURE] Network interface alert: {e}")`;
      }
    }

    if (selectedPyAction === "alarms") {
      if (selectedPyStyle === "asyncio") {
        return `# sync_alarms_async.py
import asyncio
import httpx

async def pull_alarms():
    print("[LOG-ASYNC] Pulling system alarms concurrently...")
    async with httpx.AsyncClient() as c:
        try:
            r = await c.get("http://localhost:3000/api/health")
            print(f"[SYNC] System clock verified at: {r.json().get('time')}")
            print(f" -> Local CPU Threshold: {cpuThreshold}%")
            print(f" -> Local RAM Threshold: {memThreshold}%")
        except Exception as e:
            print(f"[ERR] Sync thread failed: {e}")

if __name__ == "__main__":
    asyncio.run(pull_alarms())`;
      } else if (selectedPyStyle === "cli-ops") {
        return `# ops_interactive_cli.py
import argparse

def print_thresholds():
    print("=== OpsAI Warning Metrics Monitor ===")
    print(" -> CPU ALARM BOUNDARY: ${cpuThreshold}%")
    print(" -> RAM ALARM BOUNDARY: ${memThreshold}%")
    print(" -> Connection Webhooks Channels: ACTIVE")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--details", action="store_true", help="Print advanced limits")
    args = parser.parse_args()
    print_thresholds()`;
      } else {
        return `# sync_alarms.py
import requests

print("[SYSTEM] Fetching current alert threshold bindings from SRE settings controller...")
try:
    r = requests.get("http://localhost:3000/api/health", timeout=5)
    if r.status_code == 200:
        print("[SYNC SUCCESS] Loaded alarm boundaries:")
        print(f" -> Recommended Trigger: CPU > {cpuThreshold}%, RAM > {memThreshold}%")
        print(" -> Alarm Subnet Channels: slack-webhooks-active")
except Exception as e:
    print(f"[ALERT] Cloud sync error: {e}")`;
      }
    }

    // Default: selectedPyAction === "incident"
    if (selectedPyStyle === "asyncio") {
      return `# fetch_postmortem_async.py
import asyncio

async def get_incident_audit():
    print("[INDEXING INCIDENTS] Connecting to isolated audit logs...")
    await asyncio.sleep(0.5)
    print("[SUCCESS] SRE Incident report #INC-POST-928 indexed: Status is audited.")

if __name__ == "__main__":
    asyncio.run(get_incident_audit())`;
    } else if (selectedPyStyle === "cli-ops") {
      return `# ops_interactive_cli.py
import argparse

def main():
    print("=== OpsAI Post-Mortem Search CLI ===")
    print("Incident ID: #INC-POST-928 | Impact Class: payment")
    print("Root Cause: Seasonal flash sale spike mistakenly flagged as DDoS.")
    print("Mitigation Action: Autopilot quarantine parameter update successfully logged.")

if __name__ == "__main__":
    main()`;
    } else {
      return `# fetch_postmortem.py
import requests

print("Fetching post-mortem analysis from secure incident database for #INC-POST-928...")
try:
    print("[SUCCESS] Incident logs retrieved.")
    print("\\n--------------------------------------------------------------")
    print("INCIDENT ID: #INC-POST-928")
    print("WHAT HAPPENED: AI Autopilot Quarantine triggered on Payment Gateway Node 04.")
    print("ROOT CAUSE: Seasonal load spike mistakenly flagged as DDoS attack.")
    print("SAFEGUARD REVISION: Enforced multi-agent verification for VIP nodes.")
    print("--------------------------------------------------------------")
except Exception as e:
    print(f"[UNSUCCESSFUL] Could not extract incident catalog logs: {e}")`;
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-12 gap-6 animate-fade-in font-sans">
      {/* Left Settings inputs (7 cols) */}
      <div className="col-span-12 lg:col-span-12 xl:col-span-7 space-y-6">
        
        {/* Interactive Theme Preferences Panel */}
        <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5">
            <Sun className="w-5 h-5 text-amber-500" />
            <h3 className="text-[16px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider">
              Theme & Aesthetic Preferences
            </h3>
          </div>
          <p className="text-[13px] text-[#45464d] dark:text-slate-300">
            Set your preferred interface palette default. Selecting "Auto" uses your computer's native system mode configurations.
          </p>

          <div className="grid grid-cols-3 gap-3.5 pt-1">
            <button
              type="button"
              onClick={() => onChangeTheme?.("light")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                theme === "light"
                  ? "border-black dark:border-white bg-[#eceef0] dark:bg-slate-800"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              <Sun className={`w-5 h-5 ${theme === "light" ? "text-amber-500" : "text-slate-400"}`} />
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#191c1e] dark:text-slate-100 font-mono">Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeTheme?.("dark")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                theme === "dark"
                  ? "border-indigo-600 dark:border-indigo-400 bg-slate-900 text-white"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              <Moon className={`w-5 h-5 ${theme === "dark" ? "text-indigo-400" : "text-slate-400"}`} />
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#191c1e] dark:text-slate-100 font-mono">Dark Mode</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeTheme?.("system")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                theme === "system"
                  ? "border-emerald-600 dark:border-emerald-400 bg-slate-100 dark:bg-slate-800"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              <Monitor className={`w-5 h-5 ${theme === "system" ? "text-emerald-500" : "text-slate-400"}`} />
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#191c1e] dark:text-slate-100 font-mono">Auto (System)</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center space-x-2.5 mb-2">
            <Sliders className="w-5 h-5 text-[#505f76] dark:text-slate-400" />
            <h3 className="text-[16px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider">
              Telemetry Alarm Configuration
            </h3>
          </div>

          <p className="text-[13px] text-[#45464d] dark:text-slate-300 leading-relaxed">
            Configure system thresholds below. When active fleet telemetry exceeds these metrics, OpsAI automatically generates diagnostic alerts and recommends containment.
          </p>

          <div className="space-y-4">
            {/* CPU Range */}
            <div>
              <div className="flex justify-between text-[12px] font-mono text-slate-700 dark:text-slate-300 font-bold mb-1">
                <span>CPU UTILIZATION WARNING SHIELD</span>
                <span>{cpuThreshold}%</span>
              </div>
              <input 
                type="range"
                min="50"
                max="98"
                step="5"
                value={cpuThreshold}
                onChange={(e) => setCpuThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-black dark:accent-indigo-500"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Recommended baseline is 85% CPU core ceiling before auto-scaling triggers.</p>
            </div>

            {/* RAM Range */}
            <div>
              <div className="flex justify-between text-[12px] font-mono text-slate-700 dark:text-slate-300 font-bold mb-1">
                <span>RAM THRESHOLD CEILING</span>
                <span>{memThreshold}%</span>
              </div>
              <input 
                type="range"
                min="50"
                max="95"
                step="5"
                value={memThreshold}
                onChange={(e) => setMemThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-black dark:accent-indigo-500"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Triggers active heap inspection routines upon surpassing specified percentage.</p>
            </div>

            {/* Webhook */}
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-slate-700 dark:text-slate-300">
                Slack/Teams Notification Webhook URL
              </label>
              <div className="relative">
                <Webhook className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input 
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-[#f2f4f6] dark:bg-slate-900 text-[13px] border border-[#c6c6cd] dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 font-mono text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>
            </div>

            {/* Email default override */}
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-slate-700 dark:text-slate-300">
                System Administrator Incident Email Address
              </label>
              <div className="relative opacity-85">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email"
                  value={userEmail}
                  disabled
                  title="Configured during environment bootstrap"
                  className="w-full bg-slate-50 dark:bg-slate-950 text-[13px] border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 font-mono text-slate-500 dark:text-slate-400"
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Retrieved securely from environment session settings. All catastrophic system failovers alert this address.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {isSaved ? (
              <span className="text-[12px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50 animate-pulse">
                Configuration assets saved!
              </span>
            ) : (
              <div></div>
            )}
            
            <button
              type="submit"
              className="bg-black dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-[13px] font-bold py-2 px-5 rounded-xl flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save System Baseline</span>
            </button>
          </div>
        </form>
      </div>

      {/* Right Security & Simulation (5 cols) */}
      <div className="col-span-12 lg:col-span-12 xl:col-span-5 space-y-6">
        
        {/* API key diagnostics */}
        <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5">
            <Key className="w-5 h-5 text-indigo-650 dark:text-indigo-400" />
            <h3 className="text-[15px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider">
              Credentials Security
            </h3>
          </div>

          <p className="text-[12px] text-[#45464d] dark:text-slate-300 leading-relaxed">
            Credential configurations are loaded server-side exclusively. No secrets are shipped in development browser segments.
          </p>

          <div className="space-y-2.5 text-[12px] font-mono">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
              <span className="text-[#45464d] dark:text-slate-400" title="Secret for server-side Google GenAI">process.env.GEMINI_API_KEY</span>
              <span className="text-emerald-700 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/40 font-bold uppercase text-[9px]">
                Configured
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
              <span className="text-[#45464d] dark:text-slate-400">process.env.NODE_ENV</span>
              <span className="text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/40 font-bold uppercase text-[9px]">
                development
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
              <span className="text-[#45464d] dark:text-slate-400" title="Reverse proxy ingress port bound strictly to 3000">INGRESS PORT</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold text-[10px]">3000 (Proxy Target)</span>
            </div>
          </div>
        </div>

        {/* Operational Telemetry Injector block */}
        <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5">
            <Radio className="w-5 h-5 text-[#ba1a1a]" />
            <h3 className="text-[15px] font-bold text-[#ba1a1a] dark:text-red-400 uppercase tracking-wider">
              Simulate Failure Vectors
            </h3>
          </div>

          <p className="text-[11px] text-[#45464d] dark:text-slate-300 leading-relaxed">
            Test active remediation workflows by simulating real-time system anomalies. Injecting a critical failure will append an outstanding card into the recommendations queue.
          </p>

          <div className="grid grid-cols-2 gap-3.5">
            <button
              onClick={() => onSimulateCrit("database")}
              className="flex items-center justify-center space-x-1.5 p-3.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-800 dark:text-red-300 text-[12px] font-bold transition-all cursor-pointer text-center font-sans"
            >
              <Database className="w-4 h-4 shrink-0 text-red-500" />
              <span>Simulate DB Lag</span>
            </button>

            <button
              onClick={() => onSimulateCrit("security")}
              className="flex items-center justify-center space-x-1.5 p-3.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-800 dark:text-amber-300 text-[12px] font-bold transition-all cursor-pointer text-center font-sans"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Simulate Breach</span>
            </button>
          </div>
        </div>

        {/* Stretch Goal: AI Incident Card Post-Mortem Simulator */}
        <div className="bg-slate-900 border-2 border-red-950 p-6 rounded-2xl shadow-lg text-white space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-900 text-white font-mono text-[9px] px-2.5 py-0.5 rounded-bl font-semibold uppercase tracking-wider">
            SRE Guard Sandbox
          </div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h3 className="text-[14px] font-bold uppercase tracking-wider font-sans">
              AI Incident Post-Mortem Card
            </h3>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Simulate a high-fidelity incident summary card generated when an autonomous AI agent action accidentally causes an unintended production outcome. Useful for SRE post-mortems.
          </p>

          {/* Trigger simulator button */}
          <button
            type="button"
            onClick={() => {
              // Toggle or generate the simulated incident card state on screen
              setShowIncident(!showIncident);
            }}
            className="w-full bg-slate-100 hover:bg-slate-205 text-slate-950 font-bold font-sans text-[11px] py-2 px-4 rounded-xl transition-all cursor-pointer text-center uppercase tracking-wide"
          >
            {showIncident ? "Collapse Incident Diagnostics" : "Simulate Unintended Outcome Post-Mortem"}
          </button>

          {showIncident && (
            <div className="space-y-3 pt-3 border-t border-slate-800 text-[12px] animate-fade-in text-slate-200 leading-relaxed font-sans">
              <div className="flex justify-between items-center text-[10px] font-mono text-red-400 font-bold bg-red-950/40 p-2 rounded-lg border border-red-900/30">
                <span>INCIDENT ID: #INC-POST-928</span>
                <span>STATUS: FILE UNDER AUDIT</span>
              </div>

              <div>
                <strong className="text-slate-400 text-[10px] uppercase font-mono tracking-wider block">1. What Happened (Unintended Outcome)</strong>
                <p className="text-slate-200 text-[11px] mt-0.5">
                  AI Autopilot Quarantine script triggered on production Payment Gateway Node 04, disconnecting core microtransaction ports for 4.2 minutes during peak hours.
                </p>
              </div>

              <div>
                <strong className="text-slate-400 text-[10px] uppercase font-mono tracking-wider block">2. Why It Happened (Root Cause)</strong>
                <p className="text-slate-200 text-[11px] mt-0.5">
                  Scheduled seasonal flash-sale load spike produced 15,000 parallel ingress tokens, which the telemetry agent mistakenly flagged as a malicious brute-force DDoS cascade.
                </p>
              </div>

              <div>
                <strong className="text-slate-400 text-[10px] uppercase font-mono tracking-wider block">3. Safeguard That Failed</strong>
                <p className="text-red-300 text-[11px] mt-0.5 font-medium">
                  Rate-of-change safety limits did not check node business traffic catalogs (payment class) and bypassed manual authentication thresholds because latency metrics were spiking concurrently.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px]">
                <strong className="text-amber-400 text-[10px] uppercase font-mono tracking-wider block mb-1">🛡️ Safeguard Revision Policy Created</strong>
                <ul className="space-y-1 list-disc pl-4 text-slate-300">
                  <li>Enforce mandatory multi-agent cross-verification for VIP payment nodes.</li>
                  <li>Incorporate calendared commercial sale windows directly into telemetry baselines.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Dynamic Python SDK & SRE Automation Workbench - Perfect Python Experience */}
      <div className="col-span-12 bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] bg-indigo-650 dark:bg-indigo-600 text-white px-2.5 py-0.5 rounded font-mono uppercase tracking-widest font-bold">
              Python Automation Hub
            </span>
            <h3 className="text-[16px] font-bold text-[#191c1e] dark:text-slate-100 uppercase tracking-wider mt-2">
              Python SRE Automation & CLI Workbench
            </h3>
            <p className="text-[12px] text-[#45464d] dark:text-slate-350 leading-relaxed">
              Integrate the OpsAI Enterprise Fleet with your local Python automation scripts, container initialization loops, or SRE cron-jobs. Select an action below to instantly compile production-ready script files.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 shrink-0">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600 dark:bg-indigo-400"></span>
            </span>
            <span className="text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-400 uppercase">Python 3.11+ SDK Ready</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Controls column */}
          <div className="lg:col-span-5 space-y-5">
            {/* Step 1: Select Automation Goal */}
            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-slate-705 dark:text-slate-300">
                1. Select Operational Target
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "fetch", label: "Query Fleet Status", desc: "GET /api/health logs" },
                  { id: "quarantine", label: "Quarantine Workstation", desc: "POST /chat sandboxing" },
                  { id: "alarms", label: "Inspect Alarm Thresholds", desc: "Sync RAM/CPU specs" },
                  { id: "incident", label: "Fetch Post-Mortem Info", desc: "Incident #928 logs" }
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => {
                      setSelectedPyAction(act.id);
                      setPyTerminalLogs([]);
                    }}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedPyAction === act.id
                        ? "border-indigo-650 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/25 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-100 dark:ring-indigo-950/40"
                        : "border-slate-205 dark:border-slate-805 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
                    }`}
                  >
                    <p className="text-[12px] font-bold">{act.label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{act.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select SRE Script Style */}
            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-slate-705 dark:text-slate-305">
                2. Python Library Pattern
              </label>
              <div className="flex bg-[#f2f4f6] dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                {[
                  { id: "requests", label: "requests" },
                  { id: "asyncio", label: "asyncio/httpx" },
                  { id: "cli-ops", label: "CLI Tool" }
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      setSelectedPyStyle(style.id);
                      setPyTerminalLogs([]);
                    }}
                    className={`flex-grow text-center text-[11px] py-2 font-bold font-mono rounded-lg transition-all cursor-pointer ${
                      selectedPyStyle === style.id
                        ? "bg-white dark:bg-slate-850 text-black dark:text-white shadow-xs"
                        : "text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick SRE Guide / Instruction for Python users */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/30 rounded-lg border border-[#eceef0] dark:border-slate-800/80 text-[11px] text-[#45464d] dark:text-slate-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-205">
                🛠️ Instant Execution Ready
              </p>
              <p className="leading-relaxed">
                OpsAI's Python integrations require no custom SDK compilation steps. The templates above map directly to the active REST gateway nodes. Copy the script or click the sandbox below to check mock interpreter feedback.
              </p>
            </div>
          </div>

          {/* Terminal / Code Presentation column */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="bg-slate-950 dark:bg-black rounded-lg border border-slate-800 overflow-hidden flex flex-col flex-grow min-h-[300px]">
              {/* Code/Terminal tabs */}
              <div className="bg-slate-900 border-b border-slate-850 px-4 py-2.5 flex items-center justify-between selection:bg-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold ml-2">
                    {selectedPyStyle === "cli-ops" ? "ops_interactive_cli.py" : selectedPyAction === "fetch" ? "query_fleet.py" : selectedPyAction === "quarantine" ? "trigger_quarantine.py" : selectedPyAction === "alarms" ? "sync_alarms.py" : "fetch_postmortem.py"}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCopyPyCode}
                    className="p-1 px-2.5 rounded bg-slate-805 text-[11px] font-bold font-mono text-slate-350 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer border border-slate-800"
                    title="Copy Python Code"
                  >
                    {copied ? <span className="text-emerald-400 font-bold">Copied!</span> : <span>Copy Code</span>}
                  </button>
                </div>
              </div>

              {/* Code Render */}
              <div className="p-4 flex-grow font-mono text-[11.5px] text-slate-300 overflow-x-auto overflow-y-auto max-h-[280px] select-text bg-[#030712]">
                <pre className="text-left whitespace-pre">{getPythonScript()}</pre>
              </div>
            </div>

            {/* Simulated Live Interpreter (Execution Preview) */}
            <div className="bg-slate-950 border border-slate-850 rounded-lg p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Interactive Local Sandbox
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-slate-800 text-indigo-300">
                    BETA SIMULATOR
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSimulatePyRun}
                  disabled={isSimulatingPy}
                  className={`bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-mono font-bold text-[11px] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center space-x-1.5 ${isSimulatingPy ? "animate-pulse" : ""}`}
                >
                  <span>{isSimulatingPy ? "Executing Code..." : "Dry Run Script in Browser"}</span>
                </button>
              </div>

              {pyTerminalLogs.length > 0 ? (
                <div className="bg-black/95 rounded-lg p-3 font-mono text-[11px] text-[#38bdf8] border border-slate-850 space-y-1.5 max-h-[140px] overflow-y-auto animate-fade-in list-none text-left">
                  {pyTerminalLogs.map((log, index) => (
                    <li key={index} className="leading-relaxed">
                      {log}
                    </li>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-sans italic leading-relaxed text-left">
                  No active simulation log. Click "Dry Run" to watch the safe browser sandbox compile and print Python logs step-by-step.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

