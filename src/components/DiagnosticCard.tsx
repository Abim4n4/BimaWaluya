import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wrench,
  Info
} from 'lucide-react';
import { CalculationSummary, LinkBudgetConfig } from '../types';

interface DiagnosticCardProps {
  summary: CalculationSummary;
  config: LinkBudgetConfig;
}

export const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ summary, config }) => {
  const isTwoStage = config.topology === 'olt-otb-odc-odp-ont';

  const fiberCableLossTotal =
    (Number(config.feederLengthKm) || 0) * (Number(config.fiberLossPerKm) || 0.25) +
    (isTwoStage ? (Number(config.distLengthKm) || 0) * (Number(config.fiberLossPerKm) || 0.25) : 0) +
    ((Number(config.dropCableLengthMeters) || 0) / 1000) * (Number(config.fiberLossPerKm) || 0.25);

  const connectorAndSpliceLossTotal =
    (Number(config.otbConnectorLoss) || 0.25) +
    (isTwoStage ? (Number(config.odcConnectorInLoss) || 0.25) + (Number(config.odcConnectorOutLoss) || 0.25) : 0) +
    (Number(config.odpConnectorInLoss) || 0.25) +
    (Number(config.odpConnectorOutLoss) || 0.25) +
    (Number(config.fastConnectorLoss) || 0.3) +
    (Number(config.rosetLoss) || 0.2) +
    ((Number(config.feederSplicesCount) || 0) + (isTwoStage ? (Number(config.distSplicesCount) || 0) : 0)) *
      (Number(config.spliceLossPerJoint) || 0.05);

  const splitterLossTotal = Math.max(
    0,
    summary.totalTheoreticalLoss - fiberCableLossTotal - connectorAndSpliceLossTotal
  );

  const splitterPercent = Math.min(100, Math.round((splitterLossTotal / summary.totalTheoreticalLoss) * 100)) || 0;
  const cablePercent = Math.min(100, Math.round((fiberCableLossTotal / summary.totalTheoreticalLoss) * 100)) || 0;
  const connectorPercent = Math.max(0, 100 - splitterPercent - cablePercent);

  return (
    <div className="space-y-4">
      
      {/* Link Budget Analysis Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Link Budget & Sensitivity Evaluation
            </h3>
          </div>

          <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
            summary.status === 'PASS'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : summary.status === 'WARNING'
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            {summary.status}: {summary.statusMessage}
          </span>
        </div>

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Tx SFP OLT</span>
            <div className="text-base font-mono font-bold text-cyan-400 mt-0.5">
              {summary.txPowerOlt > 0 ? `+${summary.txPowerOlt}` : summary.txPowerOlt} dBm
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Class {config.sfpClass}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Total Loss Teori</span>
            <div className="text-base font-mono font-bold text-rose-400 mt-0.5">
              -{summary.totalTheoreticalLoss} dB
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Accumulated</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Rx Power ONT</span>
            <div className={`text-base font-mono font-bold mt-0.5 ${
              summary.status === 'PASS'
                ? 'text-emerald-400'
                : summary.status === 'WARNING'
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}>
              {summary.rxPowerOnt} dBm
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Min: {summary.ontSensitivityMin} dBm</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Safety Margin</span>
            <div className={`text-base font-mono font-bold mt-0.5 ${
              summary.linkMargin >= config.safetyMargin ? 'text-cyan-400' : 'text-amber-400'
            }`}>
              +{summary.linkMargin} dB
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Target: &ge;{config.safetyMargin} dB</span>
          </div>
        </div>

        {/* Loss Component Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-2">
            Loss Distribution Breakdown
          </h4>

          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
            <div
              style={{ width: `${splitterPercent}%` }}
              className="bg-cyan-500 h-full"
              title={`Splitter: ${splitterLossTotal.toFixed(1)} dB (${splitterPercent}%)`}
            />
            <div
              style={{ width: `${cablePercent}%` }}
              className="bg-slate-600 h-full"
              title={`Kabel Optik: ${fiberCableLossTotal.toFixed(2)} dB (${cablePercent}%)`}
            />
            <div
              style={{ width: `${connectorPercent}%` }}
              className="bg-rose-500 h-full"
              title={`Konektor/Splice: ${connectorAndSpliceLossTotal.toFixed(2)} dB (${connectorPercent}%)`}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono mt-2.5 text-slate-400 gap-1.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Splitter: <strong className="text-slate-200">{splitterLossTotal.toFixed(1)} dB ({splitterPercent}%)</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              <span>Kabel FO: <strong className="text-slate-200">{fiberCableLossTotal.toFixed(2)} dB ({cablePercent}%)</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Conn/Splice: <strong className="text-slate-200">{connectorAndSpliceLossTotal.toFixed(2)} dB ({connectorPercent}%)</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Field Diagnostic Suggestions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Field Diagnostic & Corrective Actions
          </h3>
        </div>

        <div className="space-y-2.5 mt-3 text-xs">
          {summary.issues.length === 0 ? (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 font-mono flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Semua titik ukur berada dalam batas redaman toleransi normal standar ITU-T.</span>
            </div>
          ) : (
            summary.issues.map((issue, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex items-start space-x-2.5 ${
                  issue.severity === 'danger'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : issue.severity === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                {issue.severity === 'danger' ? (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 font-mono text-[11px] leading-relaxed">
                  <div className="font-bold flex items-center space-x-2">
                    <span className={issue.severity === 'danger' ? 'text-rose-400' : 'text-amber-400'}>
                      [{issue.pointName}]
                    </span>
                    <span className="text-slate-200">{issue.message}</span>
                  </div>
                  {issue.recommendation && (
                    <div className="text-slate-400 text-[10px]">
                      👉 <span className="text-slate-300">Solusi:</span> {issue.recommendation}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-[11px] text-slate-400 font-mono">
            <span className="text-slate-300 font-bold">Rekomendasi GPON:</span> Daya terima ONT ideal berada di rentang <span className="text-emerald-400 font-bold">-15.0 s/d -23.5 dBm</span>. Batas ambang kritis sensitivitas ONT standar adalah <span className="text-rose-400 font-bold">-27.0 dBm</span>.
          </div>
        </div>
      </div>

    </div>
  );
};
