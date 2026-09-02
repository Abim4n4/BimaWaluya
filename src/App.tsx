/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LinkBudgetConfig, TopologyType, CalculationSummary } from './types';
import { INITIAL_CONFIG, ISP_PRESETS, SPLITTER_OPTIONS } from './data/standards';
import { calculateLinkBudget } from './utils/calculator';
import { Header } from './components/Header';
import { TopologyVisualizer } from './components/TopologyVisualizer';
import { ParametersPanel } from './components/ParametersPanel';
import { FieldMeasurementTable } from './components/FieldMeasurementTable';
import { DiagnosticCard } from './components/DiagnosticCard';
import { ReportModal } from './components/ReportModal';
import { ReferenceModal } from './components/ReferenceModal';
import { LoginPage } from './components/LoginPage';

interface AuthUser {
  name: string;
  role: string;
  email?: string;
}

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('bmawaluya_auth_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [config, setConfig] = useState<LinkBudgetConfig>(() => {
    try {
      const saved = localStorage.getItem('ftth_link_budget_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<'calculator' | 'measurements' | 'diagnostics'>('calculator');
  const [selectedPointId, setSelectedPointId] = useState<string | undefined>(undefined);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);

  // Save config to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem('ftth_link_budget_config', JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  // Handle Login
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('bmawaluya_auth_user', JSON.stringify(user));
    } catch {
      // ignore
    }
    if (user.name) {
      setConfig((prev) => ({
        ...prev,
        technicianName: user.name
      }));
    }
  };

  // Handle Logout
  const handleLogout = () => {
    if (window.confirm('Keluar dari sesi BimaWaluya Link Budget Simulasi?')) {
      setCurrentUser(null);
      try {
        localStorage.removeItem('bmawaluya_auth_user');
      } catch {
        // ignore
      }
    }
  };

  // Compute live calculations
  const summary: CalculationSummary = calculateLinkBudget(config);

  const handleUpdateConfig = (updated: Partial<LinkBudgetConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleTopologyChange = (topology: TopologyType) => {
    setConfig((prev) => ({
      ...prev,
      topology,
      odpSplitterId: topology === 'olt-otb-odp-ont' && prev.odpSplitterId === 'plc-1-4' ? 'plc-1-8' : prev.odpSplitterId
    }));
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = ISP_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setConfig((prev) => ({
        ...prev,
        ...preset.config
      }));
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset seluruh konfigurasi dan data ukur ke standar awal?')) {
      setConfig({
        ...INITIAL_CONFIG,
        technicianName: currentUser?.name || INITIAL_CONFIG.technicianName
      });
      setSelectedPointId(undefined);
    }
  };

  // If user is not logged in, render the login page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Metrics for the Geometric Balance 4-column footer
  const isTwoStage = config.topology === 'olt-otb-odc-odp-ont';
  const totalFiberDistKm = (
    (Number(config.patchcordOltOtbLengthMeters) || 0) / 1000 +
    (Number(config.feederLengthKm) || 0) +
    (isTwoStage ? (Number(config.distLengthKm) || 0) : 0) +
    ((Number(config.dropCableLengthMeters) || 0) / 1000)
  ).toFixed(2);

  const totalConnectorLossDb = (
    (Number(config.otbConnectorLoss) || 0.25) +
    (isTwoStage ? (Number(config.odcConnectorInLoss) || 0.25) + (Number(config.odcConnectorOutLoss) || 0.25) : 0) +
    (Number(config.odpConnectorInLoss) || 0.25) +
    (Number(config.odpConnectorOutLoss) || 0.25) +
    (Number(config.fastConnectorLoss) || 0.3) +
    (Number(config.rosetLoss) || 0.2)
  ).toFixed(2);

  // Calculate total splitting ratio
  const odcSplitter = SPLITTER_OPTIONS.find((s) => s.id === config.odcSplitterId);
  const odpSplitter = SPLITTER_OPTIONS.find((s) => s.id === config.odpSplitterId);
  const odcRatioNum = odcSplitter && odcSplitter.type === 'PLC' ? parseInt(odcSplitter.name.split(':')[1] || '1') : 1;
  const odpRatioNum = odpSplitter && odpSplitter.type === 'PLC' ? parseInt(odpSplitter.name.split(':')[1] || '8') : 8;
  const totalSplittingRatio = isTwoStage ? `1 : ${odcRatioNum * odpRatioNum}` : `1 : ${odpRatioNum}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Header */}
      <Header
        config={config}
        onTopologyChange={handleTopologyChange}
        onApplyPreset={handleApplyPreset}
        onReset={handleReset}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenReference={() => setIsReferenceOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        
        {/* Active Network Path Schematic */}
        <TopologyVisualizer
          summary={summary}
          config={config}
          selectedPointId={selectedPointId}
          onSelectPoint={(id) => {
            setSelectedPointId(id);
            setActiveTab('measurements');
          }}
        />

        {/* Dynamic Workspace Tabs */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8">
              <ParametersPanel config={config} onChange={handleUpdateConfig} />
            </div>
            <div className="lg:col-span-4 space-y-5">
              <DiagnosticCard summary={summary} config={config} />
            </div>
          </div>
        )}

        {activeTab === 'measurements' && (
          <div className="space-y-5">
            <FieldMeasurementTable
              summary={summary}
              config={config}
              onChange={handleUpdateConfig}
              selectedPointId={selectedPointId}
              onSelectPoint={setSelectedPointId}
            />
            <DiagnosticCard summary={summary} config={config} />
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="space-y-5">
            <DiagnosticCard summary={summary} config={config} />
            <FieldMeasurementTable
              summary={summary}
              config={config}
              onChange={handleUpdateConfig}
              selectedPointId={selectedPointId}
              onSelectPoint={setSelectedPointId}
            />
          </div>
        )}

        {/* Geometric Balance 4-Column Metric Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-1">
          <div className="bg-slate-900 p-3.5 border border-slate-800 rounded-xl">
            <div className="text-[10px] text-slate-500 uppercase mb-1 font-bold tracking-wider">Total Fiber Distance</div>
            <div className="text-lg sm:text-xl font-mono text-white font-bold">{totalFiberDistKm} KM</div>
          </div>

          <div className="bg-slate-900 p-3.5 border border-slate-800 rounded-xl">
            <div className="text-[10px] text-slate-500 uppercase mb-1 font-bold tracking-wider">Total Connector Loss</div>
            <div className="text-lg sm:text-xl font-mono text-white font-bold">{totalConnectorLossDb} DB</div>
          </div>

          <div className="bg-slate-900 p-3.5 border border-slate-800 rounded-xl">
            <div className="text-[10px] text-slate-500 uppercase mb-1 font-bold tracking-wider">Total Splitting Ratio</div>
            <div className="text-lg sm:text-xl font-mono text-white font-bold">{totalSplittingRatio}</div>
          </div>

          <div className="bg-slate-900 p-3.5 border border-cyan-500/40 rounded-xl">
            <div className="text-[10px] text-cyan-400 uppercase mb-1 font-bold tracking-wider">Accumulated Loss</div>
            <div className="text-lg sm:text-xl font-mono text-cyan-300 font-bold">{summary.totalTheoreticalLoss} DB</div>
          </div>
        </div>

      </main>

      {/* Footer with Copyright @rhd2026 */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-4 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="text-slate-300 font-bold">BimaWaluya Link Budget Simulasi</span> &bull; Standar ITU-T G.671 / G.984 GPON
          </div>
          <div className="font-mono text-slate-400 flex items-center space-x-3">
            <span>Role: <strong className="text-cyan-400">{currentUser.role}</strong></span>
            <span className="text-slate-600">|</span>
            <span>Topology: <strong className="text-cyan-400">{config.topology === 'olt-otb-odc-odp-ont' ? '2-Stage (OLT-ODC-ODP)' : '1-Stage Direct (OLT-ODP)'}</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-bold">@rhd2026</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        summary={summary}
        config={config}
      />

      <ReferenceModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />

    </div>
  );
}
