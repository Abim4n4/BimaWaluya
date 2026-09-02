import React from 'react';
import { Activity, BookOpen, FileText, RotateCcw, Sparkles, Sliders, LogOut, UserCheck } from 'lucide-react';
import { TopologyType, LinkBudgetConfig } from '../types';
import { ISP_PRESETS } from '../data/standards';

interface HeaderProps {
  config: LinkBudgetConfig;
  onTopologyChange: (topology: TopologyType) => void;
  onApplyPreset: (presetId: string) => void;
  onReset: () => void;
  onOpenReport: () => void;
  onOpenReference: () => void;
  activeTab: 'calculator' | 'measurements' | 'diagnostics';
  onTabChange: (tab: 'calculator' | 'measurements' | 'diagnostics') => void;
  currentUser?: { name: string; role: string } | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onTopologyChange,
  onApplyPreset,
  onReset,
  onOpenReport,
  onOpenReference,
  activeTab,
  onTabChange,
  currentUser,
  onLogout
}) => {
  return (
    <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-200 sticky top-0 z-30 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top brand & system status row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Title in Geometric Balance Style */}
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
                BimaWaluya <span className="text-cyan-400">Link Budget Simulasi</span>
              </h1>
            </div>
            <p className="text-slate-400 text-xs mt-0.5 font-mono tracking-tight">
              Pengukuran Loss dBm & Perhitungan Rasio Redaman Lapangan &bull; {config.topology === 'olt-otb-odc-odp-ont' ? '2-Stage (OLT-OTB-ODC-ODP-ONT)' : '1-Stage (OLT-OTB-ODP-ONT)'}
            </p>
          </div>

          {/* System Status & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Logged in User Profile Info */}
            {currentUser && (
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] font-bold text-slate-200 truncate max-w-[120px]">{currentUser.name}</div>
                  <div className="text-[9px] font-mono text-cyan-400">{currentUser.role}</div>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition ml-1"
                    title="Logout / Ganti User"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Presets dropdown */}
            <div>
              <select
                id="isp-preset-select"
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer transition font-mono"
                onChange={(e) => {
                  if (e.target.value) {
                    onApplyPreset(e.target.value);
                  }
                }}
                value=""
              >
                <option value="" disabled>⚡ Preset Standar ISP...</option>
                {ISP_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.provider}: {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reference Button */}
            <button
              id="btn-ref-standards"
              onClick={onOpenReference}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition"
              title="Tabel Standar Redaman ITU-T"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Tabel ITU-T</span>
            </button>

            {/* Report Button */}
            <button
              id="btn-field-report"
              onClick={onOpenReport}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition active:scale-95 tracking-wide shadow-md shadow-cyan-600/20"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>SAVE REPORT</span>
            </button>

            {/* Reset */}
            <button
              id="btn-reset-config"
              onClick={onReset}
              className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-lg transition"
              title="Reset Konfigurasi"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Bar: Topologies & Module Views */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Topology Tabs with Geometric Indicator */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              id="tab-topologi-1"
              onClick={() => onTopologyChange('olt-otb-odc-odp-ont')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-2 border ${
                config.topology === 'olt-otb-odc-odp-ont'
                  ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-300 font-bold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${config.topology === 'olt-otb-odc-odp-ont' ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
              <span>Topologi 1 (OLT - ODC - ODP)</span>
            </button>

            <button
              id="tab-topologi-2"
              onClick={() => onTopologyChange('olt-otb-odp-ont')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-2 border ${
                config.topology === 'olt-otb-odp-ont'
                  ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-300 font-bold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${config.topology === 'olt-otb-odp-ont' ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
              <span>Topologi 2 (OLT - ODP Direct)</span>
            </button>
          </div>

          {/* View Mode Selectors */}
          <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              id="view-calculator-tab"
              onClick={() => onTabChange('calculator')}
              className={`px-3 py-1.5 rounded font-medium transition flex items-center space-x-1.5 ${
                activeTab === 'calculator'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              } font-mono`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Desain & Parameter</span>
            </button>
            <button
              id="view-measurements-tab"
              onClick={() => onTabChange('measurements')}
              className={`px-3 py-1.5 rounded font-medium transition flex items-center space-x-1.5 ${
                activeTab === 'measurements'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              } font-mono`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Ukur Lapangan (OPM)</span>
            </button>
            <button
              id="view-diagnostics-tab"
              onClick={() => onTabChange('diagnostics')}
              className={`px-3 py-1.5 rounded font-medium transition flex items-center space-x-1.5 ${
                activeTab === 'diagnostics'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              } font-mono`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analisa & Diagnosa</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
