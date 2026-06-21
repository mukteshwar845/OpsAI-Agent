import React, { useState } from "react";
import { Search, Radio, Bell, Shield, Sparkles, Menu, X, Check, Trash2, Settings } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onGenerateCustom: (prompt: string) => void;
  isGenerating: boolean;
  theme: "light" | "dark" | "system";
  onChangeTheme: (theme: "light" | "dark" | "system") => void;
  onOpenSidebar: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  onGenerateCustom,
  isGenerating,
  theme,
  onChangeTheme,
  onOpenSidebar,
  currentTab,
  setCurrentTab
}: HeaderProps) {
  const [inputValue, setInputValue] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showStatsPopover, setShowStatsPopover] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "n-1", text: "Critical load warning on EMEA Edge Core 01 (94% CPU)", type: "high", time: "5m ago", read: false },
    { id: "n-2", text: "Security quarantine check initiated on LAP-920", type: "medium", time: "18m ago", read: false },
    { id: "n-3", text: "New autonomous recommendation compiled: KB502 patch update", type: "low", time: "32m ago", read: true },
    { id: "n-4", text: "Remote tunnel protocol handshake established securely", type: "info", time: "1h ago", read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDismissNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotif = () => {
    setNotifications([]);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(inputValue);
    }
  };

  const handleTriggerAI = () => {
    if (inputValue.trim()) {
      onGenerateCustom(inputValue);
      setInputValue("");
    }
  };

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-260px)] h-16 bg-[#f7f9fb] dark:bg-[#0b0f19] border-b border-[#c6c6cd] dark:border-slate-800 flex justify-between items-center px-3 sm:px-6 z-40 transition-colors duration-200">
      <div className="flex items-center space-x-1.5 sm:space-x-4 flex-grow min-w-0 max-w-[120px] xs:max-w-[170px] sm:max-w-xs md:max-w-md lg:max-w-lg">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-1.5 sm:p-2 rounded-lg text-[#45464d] dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-[#eceef0]/60 dark:hover:bg-slate-800/50 cursor-pointer focus:outline-none transition-all flex-shrink-0"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-grow min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] dark:text-slate-400 w-4 h-4 hidden sm:block" />
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (e.target.value.trim().length < 8) {
                setSearchQuery(e.target.value);
              }
            }}
            onKeyDown={handleSearchKeyPress}
            placeholder="Search & AI..."
            className="w-full bg-[#f2f4f6] dark:bg-slate-900 border-none rounded-lg pl-3 sm:pl-10 pr-2 sm:pr-24 py-1.5 sm:py-2 text-[13px] sm:text-[14px] leading-tight text-[#191c1e] dark:text-slate-100 placeholder-[#45464d] dark:placeholder-slate-400 focus:ring-1 focus:ring-[#76777d] dark:focus:ring-slate-700 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all duration-200"
          />

          {inputValue.trim().length > 6 && (
            <button
              onClick={handleTriggerAI}
              disabled={isGenerating}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 text-[10px] sm:text-[11px] font-semibold px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-md flex items-center space-x-1 sm:space-x-1.5 disabled:opacity-50 transition-colors cursor-pointer"
              title="Generate new containment card using server-side Gemini AI"
            >
              <Sparkles className="w-3 h-3 text-amber-300 dark:text-amber-655 animate-pulse hidden xs:inline" />
              <span>{isGenerating ? "..." : "AI"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Right indicators & Theme switcher */}
      <div className="flex items-center flex-row flex-nowrap space-x-1 sm:space-x-3 flex-shrink-0">
        
        {/* Quick Theme Dropdown Control */}
        <div className="flex items-center" title="Select UI Palette">
          <select
            value={theme}
            onChange={(e) => onChangeTheme(e.target.value as "light" | "dark" | "system")}
            className="bg-[#f2f4f6] dark:bg-slate-900 text-[#191c1e] dark:text-slate-100 text-[9px] sm:text-[10px] font-bold py-0.5 px-1 sm:py-1 sm:px-1.5 rounded-lg border border-[#c6c6cd] dark:border-slate-800 outline-none cursor-pointer focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-mono uppercase tracking-wider"
          >
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="system">💻 Auto</option>
          </select>
        </div>

        {/* Signal beacon */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => { setShowStatsPopover(!showStatsPopover); setShowNotifDropdown(false); }}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-850 transition-all cursor-pointer border border-transparent active:scale-95"
            title="Telemetry Stream Online (Click to view pipeline stats)"
          >
            <div className="relative flex items-center justify-center">
              <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-[#45464d] dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
          </button>

          {showStatsPopover && (
            <div className="absolute right-0 mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xl w-64 z-[90] animate-fade-in font-sans text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">Live Telemetry Pipeline</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px] text-[#191c1e] dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-450">Latency Index:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">12 ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-505 dark:text-slate-455">Traffic Ingress:</span>
                  <span className="text-indigo-600 dark:text-indigo-404 font-bold">142 p/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-505 dark:text-slate-455">Pinging Nodes:</span>
                  <span className="text-indigo-600 dark:text-indigo-404 font-bold">6 Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-505 dark:text-slate-455">Integrity:</span>
                  <span className="text-emerald-600 dark:text-emerald-405 font-bold">99.98%</span>
                </div>
              </div>
              <p className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-550 leading-relaxed">
                Live stream online. Click the beacon again to toggle statistics overlay.
              </p>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => { setShowNotifDropdown(!showNotifDropdown); setShowStatsPopover(false); }}
            className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-850 transition-all cursor-pointer border border-transparent active:scale-95"
            title="System Alert Notifications (Click to review)"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#45464d] dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#ba1a1a] rounded-full"></span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-80 z-[100] animate-fade-in font-sans text-xs overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/35 flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Alert Queue ({unreadCount})</span>
                {notifications.length > 0 && (
                  <div className="flex space-x-2.5 shrink-0">
                    <button 
                      type="button"
                      onClick={handleMarkAllRead} 
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      Read All
                    </button>
                    <button 
                      type="button"
                      onClick={handleClearAllNotif} 
                      className="text-[10px] text-red-600 dark:text-red-400 font-bold hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-slate-400 dark:text-slate-500 italic">No unresolved alerts in pipeline.</p>
                ) : (
                  notifications.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n))}
                      className={`p-3 text-[11px] leading-relaxed cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 flex justify-between gap-3 ${
                        !item.read ? "bg-indigo-50/20 dark:bg-indigo-950/10 font-semibold" : "text-[#45464d] dark:text-slate-400"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="text-slate-800 dark:text-slate-200">{item.text}</p>
                        <span className="text-[9px] font-mono text-slate-400 dark:text-slate-550">{item.time}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => handleDismissNotif(item.id, e)} 
                        className="text-slate-400 hover:text-red-500 shrink-0 self-start p-0.5 rounded transition-all cursor-pointer"
                        title="Dismiss alert notification"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Shifted Settings Action Button to Top Right Corner */}
        <button
          type="button"
          onClick={() => setCurrentTab("settings")}
          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer border active:scale-95 group relative flex-shrink-0 ${
            currentTab === "settings"
              ? "bg-indigo-600 text-white border-transparent scale-[1.05] shadow-md shadow-indigo-500/20"
              : "bg-[#f2f4f6]/65 dark:bg-slate-900/65 text-[#45464d] dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-850 border-[#c6c6cd] dark:border-slate-800"
          }`}
          title="System & Automation Settings"
        >
          <Settings className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 group-hover:rotate-[60deg] ${
            currentTab === "settings" ? "animate-spin-slow" : ""
          }`} />
          <span className="sr-only">Settings</span>
        </button>

        {/* Security badge status */}
        <div className="flex items-center justify-center w-8 h-8 sm:w-auto p-1 sm:px-2 rounded-lg text-[#45464d] dark:text-slate-400 hover:text-black dark:hover:text-white transition-all hover:scale-[1.03]" title="System Sentinel Guard">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50 ml-1.5">
            Secure
          </span>
        </div>
      </div>
    </header>
  );
}
