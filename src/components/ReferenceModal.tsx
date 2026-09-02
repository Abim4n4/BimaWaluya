import React from 'react';
import { X, BookOpen, Layers, Info, CheckCircle2 } from 'lucide-react';
import { SPLITTER_OPTIONS } from '../data/standards';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tabel Standar Redaman Optik (ITU-T & Telkom)</h3>
              <p className="text-xs text-slate-400">Pedoman spesifikasi redaman komponen pasif FTTH di lapangan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Section 1: Tabel Redaman PLC Splitter */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 mb-2.5 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>1. Standar Redaman PLC Splitter Simetris (ITU-T G.671)</span>
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Tipe Splitter</th>
                    <th className="py-2.5 px-3">Rasio Pembagian</th>
                    <th className="py-2.5 px-3">Loss Nominal (dB)</th>
                    <th className="py-2.5 px-3">Loss Maksimal (dB)</th>
                    <th className="py-2.5 px-3">Umum Digunakan Pada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">PLC 1:2</td>
                    <td className="py-2.5 px-3 font-mono">50% / 50%</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">~3.6 dB</td>
                    <td className="py-2.5 px-3 font-mono">3.8 dB</td>
                    <td className="py-2.5 px-3 text-slate-400">Branching Feeder / Joint Closure</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">PLC 1:4</td>
                    <td className="py-2.5 px-3 font-mono">25% per port</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">~7.2 dB</td>
                    <td className="py-2.5 px-3 font-mono">7.5 dB</td>
                    <td className="py-2.5 px-3 text-slate-400">ODC Stage-1 (Standar Telkom/IndiHome)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">PLC 1:8</td>
                    <td className="py-2.5 px-3 font-mono">12.5% per port</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">~10.5 dB</td>
                    <td className="py-2.5 px-3 font-mono">10.8 dB</td>
                    <td className="py-2.5 px-3 text-slate-400">ODP 8 Port / Stage-2</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">PLC 1:16</td>
                    <td className="py-2.5 px-3 font-mono">6.25% per port</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">~13.8 dB</td>
                    <td className="py-2.5 px-3 font-mono">14.2 dB</td>
                    <td className="py-2.5 px-3 text-slate-400">ODP 16 Port / High Density</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">PLC 1:32</td>
                    <td className="py-2.5 px-3 font-mono">3.12% per port</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">~17.0 dB</td>
                    <td className="py-2.5 px-3 font-mono">17.5 dB</td>
                    <td className="py-2.5 px-3 text-slate-400">1-Stage Direct Splitter ODC/ODP</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">PLC 1:64</td>
                    <td className="py-2.5 px-3 font-mono">1.56% per port</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">~20.5 dB</td>
                    <td className="py-2.5 px-3 font-mono">21.0 dB</td>
                    <td className="py-2.5 px-3 text-slate-400">GPON Max Ratio</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: FBT Ratio Asymmetric Splitters */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 mb-2.5 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>2. Standar Redaman FBT Ratio Asymmetric (Topologi Bus / Serial Tiang)</span>
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Tipe Rasio</th>
                    <th className="py-2.5 px-3">Loss Port Tap / Drop</th>
                    <th className="py-2.5 px-3">Loss Port Through (Lanjut)</th>
                    <th className="py-2.5 px-3">Karakteristik Penggunaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">FBT Ratio 5/95</td>
                    <td className="py-2.5 px-3 font-mono text-rose-300">5% (~13.8 dB)</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-300">95% (~0.4 dB)</td>
                    <td className="py-2.5 px-3 text-slate-400">ODP Tiang Pertama pada jalur bus panjang</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">FBT Ratio 10/90</td>
                    <td className="py-2.5 px-3 font-mono text-rose-300">10% (~10.5 dB)</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-300">90% (~0.6 dB)</td>
                    <td className="py-2.5 px-3 text-slate-400">ODP Tiang Awal / Menengah</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">FBT Ratio 15/85</td>
                    <td className="py-2.5 px-3 font-mono text-rose-300">15% (~8.8 dB)</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-300">85% (~0.9 dB)</td>
                    <td className="py-2.5 px-3 text-slate-400">ODP Menengah</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">FBT Ratio 20/80</td>
                    <td className="py-2.5 px-3 font-mono text-rose-300">20% (~7.5 dB)</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-300">80% (~1.2 dB)</td>
                    <td className="py-2.5 px-3 text-slate-400">ODP Menengah ke Ujung</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">FBT Ratio 30/70</td>
                    <td className="py-2.5 px-3 font-mono text-rose-300">30% (~5.7 dB)</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-300">70% (~1.8 dB)</td>
                    <td className="py-2.5 px-3 text-slate-400">ODP Mendekati Ujung Jalur</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">FBT Ratio 50/50</td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">50% (~3.6 dB)</td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">50% (~3.6 dB)</td>
                    <td className="py-2.5 px-3 text-slate-400">Cabang Dua Ujung Jalur Bus</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Serat Optik, Konektor & Splicing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Fiber Attenuation Table */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                Redaman Serat Optik (dB/km)
              </h5>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span>1310 nm (Upstream GPON)</span>
                  <span className="font-mono text-cyan-300">0.32 - 0.35 dB/km</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span>1490 nm (Downstream GPON)</span>
                  <span className="font-mono text-cyan-300">0.22 - 0.25 dB/km</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span>1550 nm (CATV / OTDR)</span>
                  <span className="font-mono text-cyan-300">0.19 - 0.22 dB/km</span>
                </div>
                <div className="flex justify-between">
                  <span>1577 nm (XG-PON / 10G)</span>
                  <span className="font-mono text-cyan-300">0.23 - 0.25 dB/km</span>
                </div>
              </div>
            </div>

            {/* Passive Components Loss Table */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                Konektor & Splicing Sambungan
              </h5>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span>Fusion Splicer (Core-to-Core)</span>
                  <span className="font-mono text-emerald-300">&le; 0.05 dB/joint</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span>Adapter SC/UPC / SC/APC</span>
                  <span className="font-mono text-cyan-300">&le; 0.25 - 0.30 dB</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span>Fast Connector (Manual)</span>
                  <span className="font-mono text-amber-300">&le; 0.30 - 0.50 dB</span>
                </div>
                <div className="flex justify-between">
                  <span>Mechanical Splice (Darurat)</span>
                  <span className="font-mono text-amber-300">&le; 0.20 - 0.40 dB</span>
                </div>
              </div>
            </div>

          </div>

          {/* Section 4: Standar Kelayakan Rx ONT */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <h5 className="font-bold text-slate-200 uppercase tracking-wider mb-2">
              Standar Batas Daya Terima ONT (Rx Power ONT)
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                <div className="font-bold text-sm">-15.0 s/d -23.5 dBm</div>
                <div className="text-[11px] text-emerald-400 mt-0.5">Sangat Ideal / Standar ISP</div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300">
                <div className="font-bold text-sm">-23.6 s/d -27.0 dBm</div>
                <div className="text-[11px] text-amber-400 mt-0.5">Cukup / Perlu Monitoring</div>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300">
                <div className="font-bold text-sm">&lt; -27.0 dBm (atau &gt; -8 dBm)</div>
                <div className="text-[11px] text-rose-400 mt-0.5">Kritis / Rusak (LOS / Overload)</div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Standar Internasional ITU-T G.671 & G.984</span>
          <span className="text-cyan-400 font-bold">@rhd2026</span>
        </div>

      </div>
    </div>
  );
};
