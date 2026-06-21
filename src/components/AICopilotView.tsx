import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Terminal, 
  Bot, 
  User, 
  Sparkles, 
  AlertCircle, 
  PlusCircle, 
  Zap, 
  ArrowRight,
  CheckCircle2, 
  Layers,
  Volume2,
  Trash2,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  executableAction?: {
    type: "create_recommendation" | "purge_cache" | "override_replicas" | "quarantine";
    payload: any;
    label: string;
    isExecuted: boolean;
  };
}

interface AICopilotViewProps {
  onAddRecommendation: (rec: {
    title: string;
    description: string;
    confidence: number;
    severity: "high" | "medium" | "low";
    source: string;
    primaryAction: string;
    secondaryAction: string;
    limitation?: string;
  }) => void;
  onAddLog: (event: string, source: string, severity: "low" | "medium" | "high", category: string) => void;
  adminName: string;
  adminAvatar: string;
}

export default function AICopilotView({ onAddRecommendation, onAddLog, adminName, adminAvatar }: AICopilotViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "wel-1",
      role: "assistant",
      text: "Hello! I am **OpsAI Copilot**, your enterprise SRE alerting companion. I possess full real-time reading access to your host operating networks, pending anomalies in microservice containers, and auto-recommendation lists.\n\nAsk me queries such as:\n- *How do I quarantine node LAP-920?*\n- *Explain the EMEA container memory leak anomaly.*\n- *How can I scale container replicas to address load spikes?*\n- *What triggers the 91% global Fleet Health rating?*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    { label: "Quarantine LAP-920", query: "How do I quarantine node LAP-920?" },
    { label: "EMEA Memory Leak", query: "Explain the EMEA container memory leak anomaly." },
    { label: "High CPU Scaling", query: "How do I scale container replicas to absorb performance spikes?" },
    { label: "Check Fleet Vitals", query: "Summarize the 91% global Fleet Health score drivers." }
  ];

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const textToSend = customQuery || inputText;
    if (!textToSend.trim() || isLoading) return;

    // Add User Message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error("API responded with an error");
      }

      const data = await response.json();
      
      // Determine if custom executable actions should attach based on reply contents
      let executableAction: ChatMessage["executableAction"] = undefined;
      const responseLower = data.text.toLowerCase();

      if (responseLower.includes("quarantine")) {
        executableAction = {
          type: "quarantine",
          label: "Deploy Quarantine Security Card",
          payload: {
            title: "Isolate Rogue Outbound Link Node",
            description: "Anomalous data egress stream triggered network lockdown. Quarantines laptop terminal endpoints instantly.",
            confidence: 96,
            severity: "high",
            source: "SRE Chat Directive",
            primaryAction: "Isolate LAP-920 Node",
            secondaryAction: "Lock Host Credentials",
            limitation: "Wipes volatile connection sockets during network block."
          },
          isExecuted: false
        };
      } else if (responseLower.includes("memory") || responseLower.includes("leak") || responseLower.includes("heap")) {
        executableAction = {
          type: "purge_cache",
          label: "Deploy Dynamic Cache Purge Card",
          payload: {
            title: "Perform Direct GC Memory Sweep",
            description: "Forced Garbage Collection session to dump stale middleware connection pools.",
            confidence: 85,
            severity: "medium",
            source: "SRE Chat Directive",
            primaryAction: "Trigger Forced GC Block",
            secondaryAction: "Query Pool Allocation",
            limitation: "Causes momentary API handler delays (approx 350ms)."
          },
          isExecuted: false
        };
      } else if (responseLower.includes("scale") || responseLower.includes("replicas") || responseLower.includes("cpu")) {
        executableAction = {
          type: "override_replicas",
          label: "Deploy Custom AutoScaler Overrides",
          payload: {
            title: "Scale Core microservice Replicas",
            description: "Elevates running operational nodes dynamically from 4 up to 8 core containers.",
            confidence: 98,
            severity: "high",
            source: "SRE Chat Directive",
            primaryAction: "Apply Scale Factor v8",
            secondaryAction: "Examine System Nodes",
            limitation: "Binds additional CPU resources from reserved shared memory."
          },
          isExecuted: false
        };
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        executableAction
      };

      setMessages((prev) => [...prev, assistantMsg]);

    } catch (error) {
      console.error("Failed to connect with chat server API:", error);
      // Fallback message
      const fallbackMsg: ChatMessage = {
        id: `asst-err-${Date.now()}`,
        role: "assistant",
        text: "I encountered a connection fallback timeout. Let me coordinate directly with our SRE telemetry. Type any core keyword like **quarantine**, **memory leak**, or **CPU high load** to proceed instantly through standard offline procedural loops.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteActionInChat = (messageId: string, action: ChatMessage["executableAction"]) => {
    if (!action) return;

    // Trigger Recommendation Creation block
    onAddRecommendation(action.payload);

    // Register inside user Activity Log
    onAddLog(
      `SRE Chat generated Custom Recommendation: "${action.payload.title}"`,
      action.payload.source,
      action.payload.severity,
      "Mitigation"
    );

    // Update state to lock button and show success indication
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId && msg.executableAction
          ? {
              ...msg,
              executableAction: {
                ...msg.executableAction,
                isExecuted: true
              }
            }
          : msg
      )
    );
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "wel-1",
        role: "assistant",
        text: "Conversation cleared. Ready for diagnostic evaluation! What enterprise SRE alert segment or node profile shall we debug next?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in font-sans min-h-[calc(100vh-180px)]">
      
      {/* LEFT: Central Chat Interface Block */}
      <div className="lg:col-span-3 bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-[calc(100vh-200px)] overflow-hidden transition-colors">
        
        {/* Chat Header bar */}
        <div className="px-6 py-4 border-b border-[#eceef0] dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg">
              <Bot className="w-5 h-5 text-white dark:text-black" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                OpsAI Diagnostic Copilot
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h3>
              <p className="text-[11px] text-[#45464d] dark:text-slate-400 font-mono">MODEL-CLASS: gemini-3.5-flash</p>
            </div>
          </div>
          
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg hover:bg-[#eceef0] dark:hover:bg-slate-800 text-[#45464d] dark:text-slate-400 hover:text-red-500 transition-colors"
            title="Clear Chat Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Message Feeds Area */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isAssistant = msg.role === "assistant";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-start gap-3.5 ${!isAssistant ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Sender Avatar */}
                  {isAssistant ? (
                    <div className="p-2 rounded-xl flex-shrink-0 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                      <Bot className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-800 bg-[#eceef0] dark:bg-slate-800">
                      <img src={adminAvatar} alt={adminName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}

                  {/* Bubble content */}
                  <div className={`max-w-[80%] space-y-2`}>
                    {/* Role title and timestamp */}
                    <div className={`flex items-center gap-2 text-[11px] text-[#45464d] dark:text-slate-400 ${
                      !isAssistant ? "justify-end" : "justify-start"
                    }`}>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {isAssistant ? "SRE Copilot AI" : adminName}
                      </span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Outer Text Bubble Box */}
                    <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed transition-all ${
                      isAssistant 
                        ? "bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-800/40" 
                        : "bg-black dark:bg-[#1e293b] text-white border border-transparent dark:border-slate-800 shadow-sm"
                    }`}>
                      {/* Robust markup block processing tool (Bullet lines rendering nicely) */}
                      <div className="whitespace-pre-line space-y-1">
                        {msg.text.split("\n").map((line, idx) => {
                          let formattedLine = line;
                          // Handle simple bold tokens: **text**
                          const isBold = line.startsWith("**") && line.endsWith("**");
                          if (line.includes("**")) {
                            const segments = line.split("**");
                            return (
                              <p key={idx} className="text-[13px]">
                                {segments.map((part, pIdx) => 
                                  pIdx % 2 === 1 
                                    ? <strong key={pIdx} className="font-semibold text-black dark:text-white font-sans">{part}</strong>
                                    : <span key={pIdx}>{part}</span>
                                )}
                              </p>
                            );
                          }

                          // Render code/telemetry-like bullet prompts elegantly
                          if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
                            return (
                              <li key={idx} className="list-disc list-inside text-[13px] text-slate-700 dark:text-slate-300 pl-1.5 my-0.5">
                                {line.replace(/^[-*]\s+/, "")}
                              </li>
                            );
                          }

                          // Render numeric steps nicely
                          if (/^\d+\.\s/.test(line.trim())) {
                            return (
                              <p key={idx} className="text-[13px] text-slate-700 dark:text-slate-300 pl-1.5 my-0.5 font-sans">
                                {line}
                              </p>
                            );
                          }

                          return <p key={idx} className="text-[13px]">{line}</p>;
                        })}
                      </div>

                      {/* Display attachment executable prompt box */}
                      {msg.executableAction && (
                        <div className="mt-4 pt-3.5 border-t border-[#eceef0] dark:border-slate-800 flex flex-col gap-2.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#45464d] dark:text-slate-400 font-mono">
                            <Layers className="w-3.5 h-3.5 text-indigo-500" />
                            <span>REC DIRECTIVE PARSED (EST: {msg.executableAction.payload.estDuration})</span>
                          </div>

                          <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-[#eceef0] dark:border-slate-800 shadow-2xs">
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-sans">
                              {msg.executableAction.payload.title}
                            </h4>
                            <p className="text-[11px] text-[#45464d] dark:text-slate-400 mt-1">
                              {msg.executableAction.payload.description}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                                CONF: {msg.executableAction.payload.confidence}%
                              </span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded leading-none ${
                                msg.executableAction.payload.severity === "high"
                                  ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                                  : "bg-amber-55 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                              }`}>
                                {msg.executableAction.payload.severity.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleExecuteActionInChat(msg.id, msg.executableAction)}
                            disabled={msg.executableAction.isExecuted}
                            className={`w-full py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              msg.executableAction.isExecuted
                                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
                                : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-98"
                            }`}
                          >
                            {msg.executableAction.isExecuted ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Interactive Recommendation Synthesized
                              </>
                            ) : (
                              <>
                                <PlusCircle className="w-3.5 h-3.5" />
                                {msg.executableAction.label}
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing Loading Indicator block */}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-xl flex-shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="max-w-[70%] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/45 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-[#eceef0] dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20">
          <form onSubmit={(e) => handleSubmit(e)} className="flex gap-2.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Copilot: 'How do I quarantine node LAP-920?' or query microservices..."
              className="flex-grow bg-white dark:bg-slate-900 border border-[#c6c6cd] dark:border-slate-800 px-4 py-2 rounded-xl text-xs placeholder-[#45464d] dark:placeholder-slate-500 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-black w-full"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:scale-100 px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Transmit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: Status Monitor Sidebar Panel */}
      <div className="space-y-6 lg:col-span-1">
        
        {/* Quick Click Prompts */}
        <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#eceef0] dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Suggested Diagnostics</h4>
          </div>
          
          <div className="flex flex-col gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSubmit(undefined, preset.query)}
                className="w-full text-left p-2.5 bg-slate-50 hover:bg-indigo-50/50 dark:bg-slate-900 dark:hover:bg-indigo-950/30 border border-[#eceef0] dark:border-slate-800 rounded-xl text-[11px] font-medium text-slate-800 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-between cursor-pointer group"
              >
                <span>{preset.label}</span>
                <ArrowRight className="w-3 h-3 text-[#45464d] dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Operational Intelligence Card */}
        <div className="bg-white dark:bg-[#0f172a] border border-[#c6c6cd] dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#eceef0] dark:border-slate-800">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Live Telemetry Pipeline</h4>
          </div>
          
          {/* SRE Terminal Logs or Metrics */}
          <div className="space-y-3 font-mono text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-[#45464d] dark:text-slate-400">FLEET RATING:</span>
              <span className="text-emerald-500 font-semibold">91.4% (EXCELLENT)</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[#45464d] dark:text-slate-400">INTELLIGENT RECS:</span>
              <span className="text-indigo-500 font-semibold">AUTOMATED SYNTH</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#45464d] dark:text-slate-400">SECURITY POSTURE:</span>
              <span className="text-amber-500 font-semibold">AUDITING INBOUNDS</span>
            </div>
            
            {/* Visual Mini Stats block representing the fleet */}
            <div className="mt-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-[#eceef0] dark:border-slate-800 text-[10px] space-y-1.5 leading-relaxed text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span>EMEA region: **STABLE**</span>
              </p>
              <p className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>APAC region: **STABLE**</span>
              </p>
              <p className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block animate-pulse"></span>
                <span>LAP-920 node: **QUARANTINED PENDING**</span>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
