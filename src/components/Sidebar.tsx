import React from "react";
import { 
  LayoutDashboard, 
  Activity, 
  BrainCircuit, 
  History, 
  ShieldCheck,
  X,
  MessageSquare
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  pendingCount: number;
  isOpen?: boolean;
  onClose?: () => void;
  adminName: string;
  adminRole: string;
  adminAvatar: string;
  onOpenProfile: () => void;
}

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  pendingCount, 
  isOpen = false, 
  onClose,
  adminName,
  adminRole,
  adminAvatar,
  onOpenProfile
}: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "fleet-health", label: "Fleet Health", icon: Activity },
    { id: "ai-copilot", label: "AI Copilot", icon: MessageSquare },
    { id: "ai-recommendations", label: "AI Recommendations", icon: BrainCircuit, badge: pendingCount },
    { id: "activity-log", label: "Activity Log", icon: History },
  ];

  return (
    <aside 
      id="opsai-sidebar"
      className={`fixed left-0 top-0 h-full w-[260px] bg-[#f7f9fb] dark:bg-[#0b0f19] border-r border-[#c6c6cd] dark:border-slate-800 flex flex-col py-8 z-50 font-sans transition-all duration-300 ease-in-out transform lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand & Logo */}
      <div className="px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-black dark:bg-slate-100 text-white dark:text-slate-950 p-1 rounded">
            <ShieldCheck className="w-6 h-6 text-white dark:text-slate-950" />
          </div>
          <div>
            <h1 className="font-sans text-[18px] font-bold text-[#191c1e] dark:text-slate-100 leading-snug">OpsAI Agent</h1>
            <p className="text-[#45464d] dark:text-slate-400 text-[12px]">Enterprise Fleet</p>
          </div>
        </div>

        {/* Mobile close button drawer layout */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#eceef0] dark:hover:bg-slate-800 text-[#45464d] dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            title="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setCurrentTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-6 py-3 transition-all duration-200 text-left ${
                    isActive
                      ? "text-black dark:text-white font-bold border-r-4 border-black dark:border-white bg-white/50 dark:bg-slate-900/40"
                      : "text-[#45464d] dark:text-slate-400 hover:bg-[#eceef0]/60 dark:hover:bg-slate-800/50 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="text-[14px] font-medium">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-black dark:bg-slate-100 text-white dark:text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin Profile Segment */}
      <div className="px-6 mt-auto">
        <button
          type="button"
          onClick={onOpenProfile}
          className="w-full flex items-center p-3 rounded-lg bg-[#f2f4f6] dark:bg-slate-900 hover:bg-[#eceef0]/80 dark:hover:bg-slate-800/80 border border-[#eceef0] dark:border-slate-800 cursor-pointer transition-all text-left"
          title="Click to manage SRE credentials"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#c6c6cd] dark:bg-slate-800 mr-3 shrink-0">
            <img 
              className="object-cover w-full h-full" 
              src={adminAvatar} 
              alt={adminName}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0 flex-grow">
            <p className="font-mono text-[11px] font-semibold text-[#191c1e] dark:text-slate-200 truncate">{adminName}</p>
            <p className="text-[11px] text-[#45464d] dark:text-slate-400 truncate">{adminRole}</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
