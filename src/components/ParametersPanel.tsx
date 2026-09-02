import React from 'react';
import {
  Server,
  Box,
  GitFork,
  Network,
  Wifi,
  Sliders
} from 'lucide-react';
import { LinkBudgetConfig, SfpClass, WavelengthType } from '../types';
import { SFP_CLASS_DEFAULTS, WAVELENGTH_ATTENUATION } from '../data/standards';

interface ParametersPanelProps {
  config: LinkBudgetConfig;
  onChange: (updated: Partial<LinkBudgetConfig>) => void;
}

export const ParametersPanel: React.FC<ParametersPanelProps> = ({ config, onChange }) => {
  const isTwoStage = config.topology === 'olt-otb-odc-odp-ont';

  const handleSfpClassChange = (newClass: SfpClass) => {
    const defaultPower = SFP_CLASS_DEFAULTS[newClass].typical;
    onChange({ sfpClass: newClass, sfpTxPower: defaultPower });
  };

  const handleWavelengthChange = (wl: WavelengthType) => {
    const defaultAlpha = WAVELENGTH_ATTENUATION[wl].lossPerKm;
    onChange({ wavelength: wl, fiberLossPerKm: defaultAlpha });
  };

  return (
    <div className="space-y-4">
      
      {/* 1. SFP OLT & Patchcord OTB */}
      <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              1. SFP OLT Transceiver & Optical Source
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
            SOURCE NODE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* SFP Class */}
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
              Kelas Modul SFP
            </label>
            <select
              id="input-sfp-class"
              value={config.sfpClass}
              onChange={(e) => handleSfpClassChange(e.target.value as SfpClass)}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="B+">GPON Class B+ (+1.5 ~ +5 dBm)</option>
              <option value="C+">GPON Class C+ (+3.0 ~ +7 dBm)</option>
              <option value="C++">GPON Class C++ (+6.0 ~ +10 dBm)</option>
              <option value="CUSTOM">Custom Input Tx (dBm)</option>
            </select>
          </div>

          {/* SFP Tx Power */}
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5 flex justify-between">
              <span>SFP Output (dBm)</span>
              <span className="text-cyan-400 font-bold">
                {config.sfpTxPower > 0 ? `+${config.sfpTxPower}` : config.sfpTxPower} dBm
              </span>
            </label>
            <input
              id="input-sfp-tx-power"
              type="number"
              step="0.1"
              value={config.sfpTxPower}
              onChange={(e) => onChange({ sfpTxPower: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-950 text-cyan-400 font-mono font-bold text-xs rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* OLT Port Name */}
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
              Port OLT (Card/PON)
            </label>
            <input
              id="input-olt-port"
              type="text"
              value={config.oltPortName}
              onChange={(e) => onChange({ oltPortName: e.target.value })}
              placeholder="GPON 0/1/1"
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Patchcord Length OLT -> OTB */}
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
              Patchcord OLT-OTB (M)
            </label>
            <input
              id="input-patchcord-len"
              type="number"
              step="1"
              min="1"
              value={config.patchcordOltOtbLengthMeters}
              onChange={(e) => onChange({ patchcordOltOtbLengthMeters: parseFloat(e.target.value) || 1 })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 2. OTB & Feeder Cable */}
      <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              2. OTB Main Distribution & Feeder Cable
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {config.feederLengthKm} KM FIBER
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
              Identitas OTB
            </label>
            <input
              id="input-otb-name"
              type="text"
              value={config.otbName}
              onChange={(e) => onChange({ otbName: e.target.value })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
              Adapter Loss (dB)
            </label>
            <input
              id="input-otb-adapter-loss"
              type="number"
              step="0.05"
              min="0.1"
              value={config.otbConnectorLoss}
              onChange={(e) => onChange({ otbConnectorLoss: parseFloat(e.target.value) || 0.25 })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5 flex justify-between">
              <span>Feeder Length (KM)</span>
              <span className="text-cyan-400 font-bold">{config.feederLengthKm} km</span>
            </label>
            <input
              id="input-feeder-length"
              type="number"
              step="0.1"
              min="0.01"
              value={config.feederLengthKm}
              onChange={(e) => onChange({ feederLengthKm: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
              Sambungan Splice (Titik)
            </label>
            <input
              id="input-feeder-splices"
              type="number"
              min="0"
              step="1"
              value={config.feederSplicesCount}
              onChange={(e) => onChange({ feederSplicesCount: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 3. ODC (Only in 2-Stage Topology) */}
      {isTwoStage && (
        <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                3. ODC Cabinet & Stage-1 Splitter
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
              STAGE 1 SPLIT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
                ID / Lokasi ODC
              </label>
              <input
                id="input-odc-name"
                type="text"
                value={config.odcName}
                onChange={(e) => onChange({ odcName: e.target.value })}
                className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
                Splitter Pasif ODC (Stage-1)
              </label>
              <select
                id="input-odc-splitter"
                value={config.odcSplitterId}
                onChange={(e) => onChange({ odcSplitterId: e.target.value })}
                className="w-full bg-slate-950 text-cyan-300 font-mono text-xs rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
              >
                <optgroup label="Standar Splitter Pasif ODC (Paling Populer)">
                  <option value="plc-1-4">Pasif 1:4 (Nominal 7.20 dB - Standar ODC Telkom/ISP)</option>
                  <option value="plc-1-8">Pasif 1:8 (Nominal 10.50 dB - High Ratio ODC)</option>
                </optgroup>
                <optgroup label="Opsi PLC Lainnya">
                  <option value="plc-1-2">Pasif 1:2 (Nominal 3.60 dB)</option>
                  <option value="plc-1-16">Pasif 1:16 (Nominal 13.80 dB)</option>
                  <option value="plc-1-32">Pasif 1:32 (Nominal 17.00 dB)</option>
                </optgroup>
                <optgroup label="FBT Ratio Asymmetrical (Bus / Pole)">
                  <option value="fbt-5-95-tap">Ratio 5/95 - Tap Drop 5% (13.8 dB)</option>
                  <option value="fbt-5-95-thru">Ratio 5/95 - Through 95% (0.4 dB)</option>
                  <option value="fbt-10-90-tap">Ratio 10/90 - Tap Drop 10% (10.5 dB)</option>
                  <option value="fbt-10-90-thru">Ratio 10/90 - Through 90% (0.6 dB)</option>
                  <option value="fbt-15-85-tap">Ratio 15/85 - Tap Drop 15% (8.8 dB)</option>
                  <option value="fbt-15-85-thru">Ratio 15/85 - Through 85% (0.9 dB)</option>
                  <option value="fbt-20-80-tap">Ratio 20/80 - Tap Drop 20% (7.5 dB)</option>
                  <option value="fbt-20-80-thru">Ratio 20/80 - Through 80% (1.2 dB)</option>
                  <option value="fbt-30-70-tap">Ratio 30/70 - Tap Drop 30% (5.7 dB)</option>
                  <option value="fbt-30-70-thru">Ratio 30/70 - Through 70% (1.8 dB)</option>
                  <option value="fbt-50-50">Ratio 50/50 - Simetris (3.6 dB)</option>
                </optgroup>
                <option value="custom">Custom Redaman Manual (dB)</option>
              </select>
            </div>

            {config.odcSplitterId === 'custom' ? (
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
                  Custom Splitter (dB)
                </label>
                <input
                  id="input-odc-custom-loss"
                  type="number"
                  step="0.1"
                  value={config.odcSplitterCustomLoss || 7.2}
                  onChange={(e) => onChange({ odcSplitterCustomLoss: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5 flex justify-between">
                  <span>Dist. Cable (KM)</span>
                  <span className="text-cyan-400 font-bold">{config.distLengthKm} km</span>
                </label>
                <input
                  id="input-dist-length"
                  type="number"
                  step="0.1"
                  min="0.01"
                  value={config.distLengthKm}
                  onChange={(e) => onChange({ distLengthKm: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. ODP & Stage-2 Splitter */}
      <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {isTwoStage ? '4. ODP Distribution Box & Stage-2 Splitter' : '3. ODP Direct Distribution Splitter'}
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
            {isTwoStage ? 'STAGE 2 SPLIT' : 'DIRECT SPLIT'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
              ID / Tiang ODP
            </label>
            <input
              id="input-odp-name"
              type="text"
              value={config.odpName}
              onChange={(e) => onChange({ odpName: e.target.value })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
              Splitter Pasif ODP (Stage-2 / Direct)
            </label>
            <select
              id="input-odp-splitter"
              value={config.odpSplitterId}
              onChange={(e) => onChange({ odpSplitterId: e.target.value })}
              className="w-full bg-slate-950 text-emerald-300 font-mono text-xs rounded px-3 py-2 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              <optgroup label="Standar Splitter Pasif ODP (Port Pelanggan)">
                <option value="plc-1-8">Pasif 1:8 (Nominal 10.50 dB - 8 Port Standar ODP)</option>
                <option value="plc-1-16">Pasif 1:16 (Nominal 13.80 dB - 16 Port High Density)</option>
                <option value="plc-1-32">Pasif 1:32 (Nominal 17.00 dB - 32 Port / Direct Split)</option>
                <option value="plc-1-64">Pasif 1:64 (Nominal 20.50 dB - 64 Port Max GPON)</option>
              </optgroup>
              <optgroup label="Opsi PLC Lainnya">
                <option value="plc-1-4">Pasif 1:4 (Nominal 7.20 dB - 4 Port)</option>
                <option value="plc-1-2">Pasif 1:2 (Nominal 3.60 dB - 2 Port)</option>
              </optgroup>
              <optgroup label="FBT Ratio (Bus / Cascading Tiang)">
                <option value="fbt-10-90-tap">Ratio 10/90 - Tap Port (10.5 dB)</option>
                <option value="fbt-20-80-tap">Ratio 20/80 - Tap Port (7.5 dB)</option>
                <option value="fbt-30-70-tap">Ratio 30/70 - Tap Port (5.7 dB)</option>
                <option value="fbt-50-50">Ratio 50/50 (3.6 dB)</option>
              </optgroup>
              <option value="custom">Custom Redaman Manual (dB)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
              ODP Adapter Loss (dB)
            </label>
            <input
              id="input-odp-adapter-loss"
              type="number"
              step="0.05"
              min="0.1"
              value={config.odpConnectorOutLoss}
              onChange={(e) => onChange({ odpConnectorOutLoss: parseFloat(e.target.value) || 0.25 })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 5. Drop Cable, Roset & ONT Pelanggan */}
      <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {isTwoStage ? '5. Drop Core, Roset & ONT Target' : '4. Drop Core, Roset & ONT Target'}
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold">
            {config.dropCableLengthMeters} METER DROP
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5 flex justify-between">
              <span>Drop Cable (Meter)</span>
              <span className="text-cyan-400 font-bold">{config.dropCableLengthMeters} m</span>
            </label>
            <input
              id="input-drop-cable-len"
              type="number"
              min="10"
              step="10"
              value={config.dropCableLengthMeters}
              onChange={(e) => onChange({ dropCableLengthMeters: parseFloat(e.target.value) || 10 })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
              Fast Connector (dB)
            </label>
            <input
              id="input-fast-conn-loss"
              type="number"
              step="0.05"
              min="0.1"
              value={config.fastConnectorLoss}
              onChange={(e) => onChange({ fastConnectorLoss: parseFloat(e.target.value) || 0.3 })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
              Roset + Patchcord (dB)
            </label>
            <input
              id="input-roset-loss"
              type="number"
              step="0.05"
              min="0.1"
              value={config.rosetLoss}
              onChange={(e) => onChange({ rosetLoss: parseFloat(e.target.value) || 0.2 })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1.5">
              ID / Pelanggan ONT
            </label>
            <input
              id="input-ont-name"
              type="text"
              value={config.ontName}
              onChange={(e) => onChange({ ontName: e.target.value })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 6. Physical Attenuation Parameters */}
      <section className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 mb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Physical Attenuation Parameters & Constants
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
              Wavelength (λ)
            </label>
            <select
              id="input-wavelength"
              value={config.wavelength}
              onChange={(e) => handleWavelengthChange(e.target.value as WavelengthType)}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:outline-none"
            >
              <option value="1490">1490 nm (Downstream GPON - ~0.25 dB/km)</option>
              <option value="1310">1310 nm (Upstream GPON - ~0.35 dB/km)</option>
              <option value="1550">1550 nm (CATV / OTDR - ~0.22 dB/km)</option>
              <option value="1577">1577 nm (Downstream XG-PON - ~0.24 dB/km)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
              Fiber Loss (dB/km)
            </label>
            <input
              id="input-fiber-loss-per-km"
              type="number"
              step="0.01"
              value={config.fiberLossPerKm}
              onChange={(e) => onChange({ fiberLossPerKm: parseFloat(e.target.value) || 0.25 })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
              Splice Loss (dB/joint)
            </label>
            <input
              id="input-splice-loss"
              type="number"
              step="0.01"
              value={config.spliceLossPerJoint}
              onChange={(e) => onChange({ spliceLossPerJoint: parseFloat(e.target.value) || 0.05 })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
              Safety Margin (dB)
            </label>
            <input
              id="input-safety-margin"
              type="number"
              step="0.5"
              value={config.safetyMargin}
              onChange={(e) => onChange({ safetyMargin: parseFloat(e.target.value) || 2.0 })}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono rounded px-3 py-2 border border-slate-700 focus:outline-none"
            />
          </div>
        </div>
      </section>

    </div>
  );
};
