import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Send, Calendar, Settings as SettingsIcon, TrendingUp } from "lucide-react";
import PostGenerator from "@/components/PostGenerator";
import ScheduleManager from "@/components/ScheduleManager";
import Settings from "@/components/Settings";

export default function App() {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-yellow-500/30">
      {/* Sidebar / Navigation */}
      <div className="fixed left-0 top-0 h-full w-64 border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <TrendingUp className="text-zinc-950 w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SquareAI</h1>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("generate")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "generate" ? "bg-yellow-500 text-zinc-950 font-medium" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            }`}
          >
            <Send className="w-5 h-5" />
            Post Generator
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "schedule" ? "bg-yellow-500 text-zinc-950 font-medium" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            }`}
          >
            <Calendar className="w-5 h-5" />
            Schedule
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "settings" ? "bg-yellow-500 text-zinc-950 font-medium" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
            <p className="text-xs text-zinc-500 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-sm font-medium">System Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:ml-64 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 flex justify-between items-end">
            <div>
              <p className="text-yellow-500 font-medium text-sm mb-1 uppercase tracking-widest">Dashboard</p>
              <h2 className="text-3xl font-bold">
                {activeTab === "generate" && "Create New Post"}
                {activeTab === "schedule" && "Manage Schedule"}
                {activeTab === "settings" && "Account Settings"}
              </h2>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-zinc-500 text-sm">Welcome back,</p>
              <p className="font-medium">Binance Creator</p>
            </div>
          </header>

          <div className="transition-all duration-300">
            {activeTab === "generate" && <PostGenerator />}
            {activeTab === "schedule" && <ScheduleManager />}
            {activeTab === "settings" && <Settings />}
          </div>
        </div>
      </main>

      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}
