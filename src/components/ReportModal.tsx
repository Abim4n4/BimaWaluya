import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileText, Share2, Download } from 'lucide-react';
import { CalculationSummary, LinkBudgetConfig } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: CalculationSummary;
  config: LinkBudgetConfig;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  summary,
  config
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isTwoStage = config.topology === 'olt-otb-odc-odp-ont';

  // Generate plain text report formatted for WhatsApp / Telegram field notes
  const generateWhatsAppReport = (): string => {
    let report = `*BIMAWALUYA - LAPORAN PENGUKURAN LINK BUDGET FTTH*\n`;
    report += `=====================================\n`;
    report += `📋 *No. WO*: ${config.workOrderNumber || '-'}\n`;
    report += `👤 *Teknisi*: ${config.technicianName || '-'}\n`;
    report += `📍 *Lokasi/Cluster*: ${config.locationArea || '-'}\n`;
    report += `📅 *Tanggal*: ${config.date}\n`;
    report += `🔗 *Topologi*: ${isTwoStage ? '2-Stage (OLT-OTB-ODC-ODP-ONT)' : '1-Stage (OLT-OTB-ODP-ONT)'}\n`;
    report += `=====================================\n\n`;

    report += `*RINCIAN HASIL UKUR POWER (OPM)*:\n`;
    summary.points.forEach((p, idx) => {
      const theor = p.theoreticalPower > 0 ? `+${p.theoreticalPower}` : `${p.theoreticalPower}`;
      const meas = p.measuredPower !== undefined ? `${p.measuredPower > 0 ? '+' : ''}${p.measuredPower} dBm` : `Belum diukur`;
      const delta = p.delta !== undefined ? ` (Δ ${p.delta > 0 ? '+' : ''}${p.delta} dB)` : '';
      report += `${idx + 1}. *${p.shortCode}* (${p.location}):\n`;
      report += `   - Target Teori: ${theor} dBm (Loss: -${p.lossSegment} dB)\n`;
      report += `   - Ukur OPM: ${meas}${delta}\n`;
    });

    report += `\n=====================================\n`;
    report += `📊 *RINGKASAN & KESIMPULAN*:\n`;
    report += `• Tx SFP OLT: ${summary.txPowerOlt > 0 ? '+' : ''}${summary.txPowerOlt} dBm\n`;
    report += `• Total Loss Teori: -${summary.totalTheoreticalLoss} dB\n`;
    report += `• Rx Power ONT: ${summary.rxPowerOnt} dBm\n`;
    report += `• Safety Margin: +${summary.linkMargin} dB\n`;
    report += `• *Status Kelayakan*: ${summary.status} (${summary.statusMessage})\n`;
    report += `=====================================\n`;
    report += `_Generated via BimaWaluya Link Budget Simulasi • @rhd2026_`;

    return report;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateWhatsAppReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Laporan Hasil Ukur & Link Budget
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                BimaWaluya Link Budget Simulasi &bull; @rhd2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Preview */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
          
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Status Kelayakan:</span>
            <span className={`font-bold px-2 py-0.5 rounded ${
              summary.status === 'PASS'
                ? 'bg-emerald-500/20 text-emerald-400'
                : summary.status === 'WARNING'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-rose-500/20 text-rose-400'
            }`}>
              {summary.status} &bull; Rx ONT: {summary.rxPowerOnt} dBm
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1.5">
              Format Teks Laporan (WhatsApp / Telegram Tim Lapangan):
            </label>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
              {generateWhatsAppReport()}
            </pre>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-500">
            Hak Cipta: <span className="text-cyan-400 font-bold">@rhd2026</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopyText}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Format WA'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
