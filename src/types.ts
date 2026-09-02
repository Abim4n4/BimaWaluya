export type TopologyType = 'olt-otb-odc-odp-ont' | 'olt-otb-odp-ont';

export type SfpClass = 'B+' | 'C+' | 'C++' | 'CUSTOM';

export type WavelengthType = '1310' | '1490' | '1550' | '1577';

export interface SplitterOption {
  id: string;
  name: string;
  type: 'PLC' | 'FBT_RATIO';
  ratioName?: string;
  nominalLoss: number; // in dB
  maxLoss: number; // in dB
  directivityLoss?: number; // for ratio through port
  tapLoss?: number; // for ratio drop port
}

export interface NodePointResult {
  id: string;
  title: string;
  shortCode: string;
  location: string;
  lossSegment: number; // dB loss in this segment
  lossAccumulated: number; // total cumulative loss up to this point
  theoreticalPower: number; // dBm expected at this point
  measuredPower?: number; // actual measured dBm from OPM
  delta?: number; // measured - theoretical
  status: 'optimal' | 'warning' | 'critical' | 'unmeasured' | 'overload';
  description: string;
  iconName: string;
}

export interface LinkBudgetConfig {
  topology: TopologyType;
  wavelength: WavelengthType;
  fiberLossPerKm: number; // default ~0.25 - 0.35 dB/km
  spliceLossPerJoint: number; // default ~0.05 dB/joint
  connectorLossPerItem: number; // default ~0.25 dB/connector
  safetyMargin: number; // default ~2.0 - 3.0 dB

  // SFP OLT
  sfpClass: SfpClass;
  sfpTxPower: number; // dBm (e.g. +4.5)
  oltPortName: string;

  // Patchcord OLT -> OTB
  patchcordOltOtbLengthMeters: number;
  otbConnectorLoss: number;
  otbName: string;

  // Feeder Cable (OTB -> ODC or OTB -> ODP)
  feederLengthKm: number;
  feederSplicesCount: number;

  // ODC (only in Topology 1)
  odcName: string;
  odcConnectorInLoss: number;
  odcSplitterId: string;
  odcSplitterCustomLoss?: number;
  odcConnectorOutLoss: number;

  // Distribution Cable (ODC -> ODP or OTB -> ODP)
  distLengthKm: number;
  distSplicesCount: number;

  // ODP
  odpName: string;
  odpConnectorInLoss: number;
  odpSplitterId: string;
  odpSplitterCustomLoss?: number;
  odpConnectorOutLoss: number;

  // Drop Core (ODP -> Roset / ONT)
  dropCableLengthMeters: number;
  fastConnectorLoss: number;
  rosetLoss: number;
  ontName: string;

  // Field real measurements (OPM reading in dBm)
  measuredOltTx?: number;
  measuredOtbOut?: number;
  measuredOdcIn?: number;
  measuredOdcOut?: number;
  measuredOdpIn?: number;
  measuredOdpOut?: number;
  measuredOntRx?: number;

  // Metadata
  technicianName: string;
  workOrderNumber: string;
  date: string;
  locationArea: string;
}

export interface CalculationSummary {
  txPowerOlt: number; // dBm
  totalTheoreticalLoss: number; // dB
  rxPowerOnt: number; // dBm
  totalActualLoss?: number; // dB
  linkMargin: number; // dB
  ontSensitivityMin: number; // -27 dBm
  ontSensitivityMax: number; // -8 dBm
  status: 'PASS' | 'WARNING' | 'FAIL';
  statusMessage: string;
  points: NodePointResult[];
  issues: DiagnosticIssue[];
}

export interface DiagnosticIssue {
  severity: 'info' | 'warning' | 'danger';
  pointName: string;
  message: string;
  recommendation: string;
}
