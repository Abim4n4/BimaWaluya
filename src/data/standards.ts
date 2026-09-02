import { SplitterOption, SfpClass, LinkBudgetConfig } from '../types';

export const SPLITTER_OPTIONS: SplitterOption[] = [
  // Standar PLC Symmetrical
  { id: 'plc-1-2', name: 'PLC Splitter 1:2 (Nominal 3.6 dB)', type: 'PLC', nominalLoss: 3.6, maxLoss: 3.8 },
  { id: 'plc-1-4', name: 'PLC Splitter 1:4 (Nominal 7.2 dB)', type: 'PLC', nominalLoss: 7.2, maxLoss: 7.5 },
  { id: 'plc-1-8', name: 'PLC Splitter 1:8 (Nominal 10.5 dB)', type: 'PLC', nominalLoss: 10.5, maxLoss: 10.8 },
  { id: 'plc-1-16', name: 'PLC Splitter 1:16 (Nominal 13.8 dB)', type: 'PLC', nominalLoss: 13.8, maxLoss: 14.2 },
  { id: 'plc-1-32', name: 'PLC Splitter 1:32 (Nominal 17.0 dB)', type: 'PLC', nominalLoss: 17.0, maxLoss: 17.5 },
  { id: 'plc-1-64', name: 'PLC Splitter 1:64 (Nominal 20.5 dB)', type: 'PLC', nominalLoss: 20.5, maxLoss: 21.0 },

  // FBT Asymmetric / Ratio Splitters (Bus / Tap Topology)
  { id: 'fbt-5-95-tap', name: 'Ratio FBT 5/95 - Tap Port 5% (13.8 dB)', type: 'FBT_RATIO', ratioName: '5/95 Tap', nominalLoss: 13.8, maxLoss: 14.5 },
  { id: 'fbt-5-95-thru', name: 'Ratio FBT 5/95 - Through Port 95% (0.4 dB)', type: 'FBT_RATIO', ratioName: '5/95 Through', nominalLoss: 0.4, maxLoss: 0.6 },
  { id: 'fbt-10-90-tap', name: 'Ratio FBT 10/90 - Tap Port 10% (10.5 dB)', type: 'FBT_RATIO', ratioName: '10/90 Tap', nominalLoss: 10.5, maxLoss: 11.0 },
  { id: 'fbt-10-90-thru', name: 'Ratio FBT 10/90 - Through Port 90% (0.6 dB)', type: 'FBT_RATIO', ratioName: '10/90 Through', nominalLoss: 0.6, maxLoss: 0.8 },
  { id: 'fbt-15-85-tap', name: 'Ratio FBT 15/85 - Tap Port 15% (8.8 dB)', type: 'FBT_RATIO', ratioName: '15/85 Tap', nominalLoss: 8.8, maxLoss: 9.3 },
  { id: 'fbt-15-85-thru', name: 'Ratio FBT 15/85 - Through Port 85% (0.9 dB)', type: 'FBT_RATIO', ratioName: '15/85 Through', nominalLoss: 0.9, maxLoss: 1.1 },
  { id: 'fbt-20-80-tap', name: 'Ratio FBT 20/80 - Tap Port 20% (7.5 dB)', type: 'FBT_RATIO', ratioName: '20/80 Tap', nominalLoss: 7.5, maxLoss: 8.0 },
  { id: 'fbt-20-80-thru', name: 'Ratio FBT 20/80 - Through Port 80% (1.2 dB)', type: 'FBT_RATIO', ratioName: '20/80 Through', nominalLoss: 1.2, maxLoss: 1.5 },
  { id: 'fbt-30-70-tap', name: 'Ratio FBT 30/70 - Tap Port 30% (5.7 dB)', type: 'FBT_RATIO', ratioName: '30/70 Tap', nominalLoss: 5.7, maxLoss: 6.2 },
  { id: 'fbt-30-70-thru', name: 'Ratio FBT 30/70 - Through Port 70% (1.8 dB)', type: 'FBT_RATIO', ratioName: '30/70 Through', nominalLoss: 1.8, maxLoss: 2.1 },
  { id: 'fbt-50-50', name: 'Ratio FBT 50/50 - Port Simetris (3.6 dB)', type: 'FBT_RATIO', ratioName: '50/50', nominalLoss: 3.6, maxLoss: 3.8 },

  // Custom
  { id: 'custom', name: 'Custom Loss (Input Manual dB)', type: 'PLC', nominalLoss: 0, maxLoss: 0 }
];

export const SFP_CLASS_DEFAULTS: Record<SfpClass, { min: number; max: number; typical: number; desc: string }> = {
  'B+': { min: 1.5, max: 5.0, typical: 3.0, desc: 'GPON Class B+ (+1.5 s/d +5.0 dBm)' },
  'C+': { min: 3.0, max: 7.0, typical: 5.0, desc: 'GPON Class C+ (+3.0 s/d +7.0 dBm - Standar Populer)' },
  'C++': { min: 6.0, max: 10.0, typical: 7.5, desc: 'GPON Class C++ (+6.0 s/d +10.0 dBm - High Power)' },
  'CUSTOM': { min: 0.0, max: 15.0, typical: 4.5, desc: 'Custom Transmit Power SFP' }
};

export const WAVELENGTH_ATTENUATION = {
  '1310': { lossPerKm: 0.35, desc: 'Upstream GPON (1310 nm) ~0.35 dB/km' },
  '1490': { lossPerKm: 0.25, desc: 'Downstream GPON (1490 nm) ~0.25 dB/km' },
  '1550': { lossPerKm: 0.22, desc: 'Downstream CATV / OTDR (1550 nm) ~0.22 dB/km' },
  '1577': { lossPerKm: 0.24, desc: 'Downstream XG-PON (1577 nm) ~0.24 dB/km' }
};

export const INITIAL_CONFIG: LinkBudgetConfig = {
  topology: 'olt-otb-odc-odp-ont',
  wavelength: '1490',
  fiberLossPerKm: 0.25,
  spliceLossPerJoint: 0.05,
  connectorLossPerItem: 0.25,
  safetyMargin: 2.0,

  // SFP OLT
  sfpClass: 'C+',
  sfpTxPower: 5.0,
  oltPortName: 'GPON 0/1/1',

  // Patchcord OLT -> OTB
  patchcordOltOtbLengthMeters: 5,
  otbConnectorLoss: 0.25,
  otbName: 'OTB-RACK-01 Port 12',

  // Feeder
  feederLengthKm: 3.5,
  feederSplicesCount: 4,

  // ODC
  odcName: 'ODC-CLT-01 (Kapasitas 144 Core)',
  odcConnectorInLoss: 0.25,
  odcSplitterId: 'plc-1-4',
  odcSplitterCustomLoss: 7.2,
  odcConnectorOutLoss: 0.25,

  // Dist
  distLengthKm: 1.2,
  distSplicesCount: 2,

  // ODP
  odpName: 'ODP-CLT-FA-03 (8 Port)',
  odpConnectorInLoss: 0.25,
  odpSplitterId: 'plc-1-8',
  odpSplitterCustomLoss: 10.5,
  odpConnectorOutLoss: 0.25,

  // Drop
  dropCableLengthMeters: 120,
  fastConnectorLoss: 0.3,
  rosetLoss: 0.2,
  ontName: 'ONT Pelanggan #1042',

  // Measurements
  measuredOltTx: undefined,
  measuredOtbOut: undefined,
  measuredOdcIn: undefined,
  measuredOdcOut: undefined,
  measuredOdpIn: undefined,
  measuredOdpOut: undefined,
  measuredOntRx: undefined,

  technicianName: 'Tim Lapangan FO',
  workOrderNumber: 'WO-FTTH-2026-089',
  date: new Date().toISOString().split('T')[0],
  locationArea: 'Cluster Cempaka Indah Blok B'
};

export interface IspPreset {
  id: string;
  name: string;
  provider: string;
  topology: 'olt-otb-odc-odp-ont' | 'olt-otb-odp-ont';
  description: string;
  config: Partial<LinkBudgetConfig>;
}

export const ISP_PRESETS: IspPreset[] = [
  {
    id: 'telkom-2stage',
    name: 'Standar Telkom / IndiHome (2-Stage 1:4 & 1:8)',
    provider: 'Telkom Indonesia',
    topology: 'olt-otb-odc-odp-ont',
    description: 'Splitter 1:4 di ODC + 1:8 di ODP (Total rasio 1:32). Standar SFP C+ (+5 dBm), target ONT -18 s/d -23 dBm.',
    config: {
      topology: 'olt-otb-odc-odp-ont',
      sfpClass: 'C+',
      sfpTxPower: 5.0,
      odcSplitterId: 'plc-1-4',
      odpSplitterId: 'plc-1-8',
      fiberLossPerKm: 0.25,
      spliceLossPerJoint: 0.05,
      connectorLossPerItem: 0.25,
      feederLengthKm: 3.5,
      distLengthKm: 1.0,
      dropCableLengthMeters: 100
    }
  },
  {
    id: 'telkom-2stage-16',
    name: 'Telkom High Density (2-Stage 1:4 & 1:16)',
    provider: 'Telkom Indonesia',
    topology: 'olt-otb-odc-odp-ont',
    description: 'Splitter 1:4 di ODC + 1:16 di ODP (Total rasio 1:64). Menggunakan SFP C++ (+7.5 dBm).',
    config: {
      topology: 'olt-otb-odc-odp-ont',
      sfpClass: 'C++',
      sfpTxPower: 7.5,
      odcSplitterId: 'plc-1-4',
      odpSplitterId: 'plc-1-16',
      fiberLossPerKm: 0.25,
      feederLengthKm: 4.0,
      distLengthKm: 1.5,
      dropCableLengthMeters: 150
    }
  },
  {
    id: 'direct-odp-1stage',
    name: 'Topologi Direct ODP 1-Stage (OLT-OTB-ODP-ONT)',
    provider: 'ISP Metro / Icon+ / Biznet',
    topology: 'olt-otb-odp-ont',
    description: 'Tanpa ODC, kabel feeder langsung dari OTB ke ODP dengan Splitter 1:8 atau 1:16.',
    config: {
      topology: 'olt-otb-odp-ont',
      sfpClass: 'C+',
      sfpTxPower: 4.5,
      odpSplitterId: 'plc-1-8',
      fiberLossPerKm: 0.25,
      feederLengthKm: 2.0,
      dropCableLengthMeters: 80
    }
  },
  {
    id: 'ratio-cascade-bus',
    name: 'Daisy Chain / FBT Ratio Bus (10/90 ODC + 1:8 ODP)',
    provider: 'Rural / Pole Cascading FTTH',
    topology: 'olt-otb-odc-odp-ont',
    description: 'Topologi tiang serial menggunakan Asymmetrical Splitter FBT Ratio 10/90 untuk sambungan berantai.',
    config: {
      topology: 'olt-otb-odc-odp-ont',
      sfpClass: 'C+',
      sfpTxPower: 5.0,
      odcSplitterId: 'fbt-10-90-tap',
      odpSplitterId: 'plc-1-8',
      feederLengthKm: 1.5,
      distLengthKm: 0.5,
      dropCableLengthMeters: 60
    }
  }
];
