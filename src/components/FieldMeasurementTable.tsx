import React from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  RotateCcw,
  Info
} from 'lucide-react';
import { CalculationSummary, LinkBudgetConfig } from '../types';

interface FieldMeasurementTableProps {
  summary: CalculationSummary;
  config: LinkBudgetConfig;
  onChange: (updated: Partial<LinkBudgetConfig>) => void;
  selectedPointId?: string;
  onSelectPoint?: (pointId: string) => void;
}

export const FieldMeasurementTable: React.FC<FieldMeasurementTableProps> = ({
  summary,
  config,
  onChange,
  selectedPointId,
  onSelectPoint
}) => {
  const isTwoStage = config.topology === 'olt-otb-odc-odp-ont';

  const handleSimulateFill = () => {
    const isTwo = config.topology === 'olt-otb-odc-odp-ont';
    const pointMap: Record<string, number> = {};
    summary.points.forEach((p) => {
      pointMap[p.id] = p.theoreticalPower;
    });

    onChange({
      measuredOltTx: pointMap['olt-tx'],
      measuredOtbOut: pointMap['otb-out'],
      measuredOdcIn: isTwo ? pointMap['odc-in'] : undefined,
      measuredOdcOut: isTwo ? pointMap['odc-out'] : undefined,
      measuredOdpIn: pointMap['odp-in'],
      measuredOdpOut: pointMap['odp-out'],
      measuredOntRx: pointMap['ont-rx']
    });
  };

  const handleClearMeasurements = () => {
    onChange({
      measuredOltTx: undefined,
      measuredOtbOut: undefined,
      measuredOdcIn: undefined,
      measuredOdcOut: undefined,
      measuredOdpIn: undefined,
      measuredOdpOut: undefined,
      measuredOntRx: undefined
    });
  };

  const handleMeasurementChange = (pointId: string, valueStr: string) => {
    const val = valueStr.trim() === '' ? undefined : parseFloat(valueStr);
    switch (pointId) {
      case 'olt-tx':
        onChange({ measuredOltTx: val });
        break;
      case 'otb-out':
        onChange({ measuredOtbOut: val });
        break;
      case 'odc-in':
        onChange({ measuredOdcIn: val });
        break;
      case 'odc-out':
        onChange({ measuredOdcOut: val });
        break;
      case 'odp-in':
        onChange({ measuredOdpIn: val });
        break;
      case 'odp-out':
        onChange({ measuredOdpOut: val });
        break;
      case 'ont-rx':
        onChange({ measuredOntRx: val });
        break;
    }
  };

  const getMeasurementValue = (pointId: string): number | string => {
    switch (pointId) {
      case 'olt-tx':
        return config.measuredOltTx !== undefined ? config.measuredOltTx : '';
      case 'otb-out':
        return config.measuredOtbOut !== undefined ? config.measuredOtbOut : '';
      case 'odc-in':
        return config.measuredOdcIn !== undefined ? config.measuredOdcIn : '';
      case 'odc-out':
        return config.measuredOdcOut !== undefined ? config.measuredOdcOut : '';
      case 'odp-in':
        return config.measuredOdpIn !== undefined ? config.measuredOdpIn : '';
      case 'odp-out':
        return config.measuredOdpOut !== undefined ? config.measuredOdpOut : '';
      case 'ont-rx':
        return config.measuredOntRx !== undefined ? config.measuredOntRx : '';
      default:
        return '';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Field Measurement Matrix & Optical Power Meter (OPM)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Pencatatan real-time daya terukur vs perhitungan teoritis di tiap connection point.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="btn-simulate-fill"
            onClick={handleSimulateFill}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-400 text-xs font-mono font-bold rounded border border-slate-700 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Isi Nilai Teori</span>
          </button>

          <button
            id="btn-clear-opm"
            onClick={handleClearMeasurements}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 text-xs font-mono rounded border border-slate-700 transition"
            title="Kosongkan Semua Data Ukur"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Field WO Metadata Header */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-[10px] text-slate-500 uppercase font-mono font-bold mb-1">Nomor Work Order (WO)</label>
          <input
            type="text"
            value={config.workOrderNumber}
            onChange={(e) => onChange({ workOrderNumber: e.target.value })}
            placeholder="WO-2026-FTTH-001"
            className="w-full bg-slate-900 text-slate-200 font-mono px-2.5 py-1.5 rounded border border-slate-700 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 uppercase font-mono font-bold mb-1">Teknisi / Splicer</label>
          <input
            type="text"
            value={config.technicianName}
            onChange={(e) => onChange({ technicianName: e.target.value })}
            placeholder="Nama teknisi"
            className="w-full bg-slate-900 text-slate-200 font-mono px-2.5 py-1.5 rounded border border-slate-700 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 uppercase font-mono font-bold mb-1">Cluster / Lokasi</label>
          <input
            type="text"
            value={config.locationArea}
            onChange={(e) => onChange({ locationArea: e.target.value })}
            placeholder="Cluster / Jalan"
            className="w-full bg-slate-900 text-slate-200 font-mono px-2.5 py-1.5 rounded border border-slate-700 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 uppercase font-mono font-bold mb-1">Tanggal Pengukuran</label>
          <input
            type="date"
            value={config.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="w-full bg-slate-900 text-slate-200 font-mono px-2.5 py-1.5 rounded border border-slate-700 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Geometric Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800">
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                Node Connection Point
              </th>
              <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                Segment Loss
              </th>
              <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                Teori (dBm)
              </th>
              <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest min-w-[150px]">
                Hasil OPM (dBm)
              </th>
              <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                Delta (Δ dB)
              </th>
              <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="text-sm font-mono divide-y divide-slate-800/60">
            {summary.points.map((point, idx) => {
              const isSelected = selectedPointId === point.id;
              const hasMeasurement = point.measuredPower !== undefined;
              const isTarget = point.id === 'ont-rx';
              const isSource = point.id === 'olt-tx';

              return (
                <tr
                  key={point.id}
                  onClick={() => onSelectPoint && onSelectPoint(point.id)}
                  className={`transition-colors cursor-pointer ${
                    isTarget
                      ? 'bg-cyan-500/5 hover:bg-cyan-500/10'
                      : isSelected
                      ? 'bg-slate-800/80'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Point Details */}
                  <td className="px-6 py-3.5 text-white font-sans">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                      <span className={`font-medium ${isTarget ? 'text-cyan-400 font-bold uppercase tracking-wider text-xs' : ''}`}>
                        {point.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {point.location}
                    </div>
                  </td>

                  {/* Segment Loss */}
                  <td className="px-6 py-3.5 text-right text-rose-400">
                    {point.lossSegment > 0 ? `-${point.lossSegment} dB` : '--'}
                  </td>

                  {/* Theoretical Power */}
                  <td className={`px-6 py-3.5 text-right font-bold ${
                    isSource ? 'text-cyan-400' : isTarget ? 'text-cyan-300 text-base' : 'text-slate-200'
                  }`}>
                    {point.theoreticalPower > 0 ? `+${point.theoreticalPower}` : point.theoreticalPower}
                  </td>

                  {/* OPM Input */}
                  <td className="px-6 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center space-x-1">
                      <input
                        id={`input-opm-${point.id}`}
                        type="number"
                        step="0.1"
                        placeholder="--"
                        value={getMeasurementValue(point.id)}
                        onChange={(e) => handleMeasurementChange(point.id, e.target.value)}
                        className={`w-24 text-center font-mono text-xs font-bold px-2 py-1.5 rounded border focus:outline-none transition ${
                          hasMeasurement
                            ? 'bg-slate-950 text-cyan-400 border-cyan-500'
                            : 'bg-slate-950 border-slate-700 text-slate-400'
                        }`}
                      />
                    </div>
                  </td>

                  {/* Delta */}
                  <td className="px-6 py-3.5 text-right">
                    {point.delta !== undefined ? (
                      <span
                        className={`font-bold ${
                          Math.abs(point.delta) <= 0.8
                            ? 'text-emerald-400'
                            : Math.abs(point.delta) <= 1.5
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {point.delta > 0 ? `+${point.delta}` : point.delta} dB
                      </span>
                    ) : (
                      <span className="text-slate-600">--</span>
                    )}
                  </td>

                  {/* Status Badge in Geometric theme */}
                  <td className="px-6 py-3.5 text-center">
                    {isSource ? (
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded border border-emerald-500/30">
                        SOURCE
                      </span>
                    ) : isTarget ? (
                      <span className={`text-[10px] font-bold px-3 py-1 rounded font-mono ${
                        point.status === 'optimal'
                          ? 'bg-cyan-500 text-slate-950'
                          : point.status === 'warning'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-rose-500 text-white'
                      }`}>
                        {point.status === 'optimal' ? 'PASS' : point.status === 'warning' ? 'WARN' : 'FAIL'}
                      </span>
                    ) : point.status === 'optimal' ? (
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Normal</span>
                    ) : point.status === 'warning' ? (
                      <span className="text-amber-400 text-[10px] uppercase font-bold">Loss Delta</span>
                    ) : (
                      <span className="text-rose-400 text-[10px] uppercase font-bold">Defect</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Notes */}
      <div className="p-4 bg-slate-950/70 border-t border-slate-800 text-xs text-slate-400 font-mono flex items-start space-x-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          Batas toleransi deviasi OPM standar ISP adalah &plusmn;1.0 dB. Selisih &gt; 1.5 dB mengindikasikan konektor kotor, macrobending, atau splice loss tinggi.
        </span>
      </div>
    </div>
  );
};
