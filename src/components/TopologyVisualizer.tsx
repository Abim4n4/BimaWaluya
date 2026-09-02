import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Zap } from 'lucide-react';
import { CalculationSummary, NodePointResult, LinkBudgetConfig } from '../types';

interface TopologyVisualizerProps {
  summary: CalculationSummary;
  config: LinkBudgetConfig;
  selectedPointId?: string;
  onSelectPoint?: (pointId: string) => void;
}

export const TopologyVisualizer: React.FC<TopologyVisualizerProps> = ({
  summary,
  config,
  selectedPointId,
  onSelectPoint
}) => {
  const isTwoStage = config.topology === 'olt-otb-odc-odp-ont';

  const getStatusBadge = (point: NodePointResult) => {
    if (point.status === 'optimal') {
      return (
        <span className="inline-flex items-center text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
          <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
          NORMAL
        </span>
      );
    }
    if (point.status === 'warning') {
      return (
        <span className="inline-flex items-center text-[9px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
          <AlertTriangle className="w-2.5 h-2.5 mr-1" />
          WARNING
        </span>
      );
    }
    if (point.status === 'overload') {
      return (
        <span className="inline-flex items-center text-[9px] font-mono font-bold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-1.5 py-0.5 rounded">
          <Zap className="w-2.5 h-2.5 mr-1" />
          OVERLOAD
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[9px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 rounded">
        <XCircle className="w-2.5 h-2.5 mr-1" />
        KRITIS
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Geometric Diagram Canvas Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden shadow-xl">
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Active Network Path
            </h3>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider hidden sm:inline">
              λ {config.wavelength} nm | Margin: {config.safetyMargin} dB
            </span>
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
              summary.status === 'PASS'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : summary.status === 'WARNING'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              {summary.status}: {summary.rxPowerOnt} dBm
            </span>
          </div>
        </div>

        {/* Scrollable Schematic Node Pipeline */}
        <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="flex items-stretch min-w-[700px] space-x-2 relative py-2">
            
            {summary.points.map((point, index) => {
              const isSelected = selectedPointId === point.id;
              const isLast = index === summary.points.length - 1;

              return (
                <React.Fragment key={point.id}>
                  {/* Single Node Card */}
                  <div
                    onClick={() => onSelectPoint && onSelectPoint(point.id)}
                    className={`flex-1 min-w-[125px] p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div>
                      {/* Node Header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase truncate">
                          {point.name}
                        </span>
                        {getStatusBadge(point)}
                      </div>

                      {/* Theoretical Power Value */}
                      <div className="my-1">
                        <div className="text-[9px] text-slate-500 uppercase font-mono">Teori</div>
                        <div className="text-sm font-mono font-bold text-cyan-300">
                          {point.theoreticalPower} <span className="text-[10px] text-slate-400">dBm</span>
                        </div>
                      </div>

                      {/* Actual OPM Measured Power */}
                      <div className="my-1">
                        <div className="text-[9px] text-slate-500 uppercase font-mono">OPM Real</div>
                        {point.measuredPower !== undefined ? (
                          <div className={`text-sm font-mono font-bold ${
                            Math.abs(point.delta) <= 0.8
                              ? 'text-emerald-400'
                              : Math.abs(point.delta) <= 1.5
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}>
                            {point.measuredPower} <span className="text-[10px] text-slate-400">dBm</span>
                          </div>
                        ) : (
                          <div className="text-xs font-mono text-slate-600 italic">Belum diukur</div>
                        )}
                      </div>
                    </div>

                    {/* Step Loss */}
                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500">Step:</span>
                      <span className="text-slate-300 font-bold">-{point.stepLoss} dB</span>
                    </div>
                  </div>

                  {/* Flow Arrow Divider */}
                  {!isLast && (
                    <div className="flex items-center justify-center text-slate-700 px-0.5">
                      <div className="w-2 h-0.5 bg-slate-800"></div>
                      <div className="text-[10px] text-slate-600 font-mono font-bold">&gt;</div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}

          </div>
        </div>

        {/* Legend bar */}
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Pass (&plusmn;0.8 dB)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Warning (0.9 - 1.5 dB)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>Loss Tinggi (&gt;1.5 dB)</span>
            </span>
          </div>

          <div className="text-slate-500 text-[10px]">
            Klik kartu node untuk melompat ke input ukur OPM
          </div>
        </div>

      </div>
    </div>
  );
};
