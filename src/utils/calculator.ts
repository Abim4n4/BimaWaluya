import { LinkBudgetConfig, CalculationSummary, NodePointResult, DiagnosticIssue } from '../types';
import { SPLITTER_OPTIONS } from '../data/standards';

export function getSplitterLoss(splitterId: string, customLoss?: number): number {
  if (splitterId === 'custom') {
    return Number(customLoss) || 0;
  }
  const found = SPLITTER_OPTIONS.find((s) => s.id === splitterId);
  return found ? found.nominalLoss : 0;
}

export function getSplitterName(splitterId: string): string {
  const found = SPLITTER_OPTIONS.find((s) => s.id === splitterId);
  return found ? found.name : 'Splitter';
}

export function calculateLinkBudget(config: LinkBudgetConfig): CalculationSummary {
  const isTwoStage = config.topology === 'olt-otb-odc-odp-ont';
  const points: NodePointResult[] = [];
  const issues: DiagnosticIssue[] = [];

  // Constants
  const alpha = Number(config.fiberLossPerKm) || 0.25; // dB/km
  const spliceLoss = Number(config.spliceLossPerJoint) || 0.05; // dB/joint
  const connLoss = Number(config.connectorLossPerItem) || 0.25; // dB/conn

  // 1. Point 1: Keluaran SFP OLT (Tx OLT)
  const txOlt = Number(config.sfpTxPower) || 5.0;
  let currentTheoreticalPower = txOlt;
  let totalLoss = 0;

  const measuredOlt = config.measuredOltTx !== undefined && !isNaN(config.measuredOltTx) ? Number(config.measuredOltTx) : undefined;
  const deltaOlt = measuredOlt !== undefined ? Number((measuredOlt - txOlt).toFixed(2)) : undefined;

  let oltStatus: NodePointResult['status'] = 'optimal';
  if (measuredOlt !== undefined) {
    if (Math.abs(deltaOlt || 0) > 1.5) {
      oltStatus = 'warning';
      issues.push({
        severity: 'warning',
        pointName: 'SFP OLT (Tx Port)',
        message: `Output Tx SFP OLT terukur (${measuredOlt} dBm) berselisih ${deltaOlt} dB dari spesifikasi (${txOlt} dBm).`,
        recommendation: 'Periksa kebersihan ferrule SFP, modul optical transceiver OLT, atau ganti SFP jika daya pancar melemah.'
      });
    }
  }

  points.push({
    id: 'olt-tx',
    title: 'Keluaran SFP OLT (Tx)',
    shortCode: 'SFP OLT',
    location: config.oltPortName || 'Port OLT',
    lossSegment: 0,
    lossAccumulated: 0,
    theoreticalPower: Number(txOlt.toFixed(2)),
    measuredPower: measuredOlt,
    delta: deltaOlt,
    status: oltStatus,
    description: `Daya pancar (Tx Optical Power) langsung dari modul SFP OLT.`,
    iconName: 'Server'
  });

  // 2. Point 2: Keluaran OTB (Out OTB)
  // Segment: Patchcord dari SFP OLT ke adapter OTB
  const patchcordLoss = ((Number(config.patchcordOltOtbLengthMeters) || 5) / 1000) * alpha;
  const otbConnLoss = Number(config.otbConnectorLoss) || connLoss;
  const segment1Loss = Number((patchcordLoss + otbConnLoss).toFixed(3));

  totalLoss += segment1Loss;
  currentTheoreticalPower -= segment1Loss;
  const outOtbTheor = Number(currentTheoreticalPower.toFixed(2));

  const measuredOtb = config.measuredOtbOut !== undefined && !isNaN(config.measuredOtbOut) ? Number(config.measuredOtbOut) : undefined;
  const deltaOtb = measuredOtb !== undefined ? Number((measuredOtb - outOtbTheor).toFixed(2)) : undefined;

  let otbStatus: NodePointResult['status'] = 'optimal';
  if (measuredOtb !== undefined) {
    if ((deltaOtb || 0) < -1.0) {
      otbStatus = 'warning';
      issues.push({
        severity: 'warning',
        pointName: 'Keluaran OTB (Out OTB)',
        message: `Redaman di OTB lebih tinggi dari teori (${deltaOtb} dB).`,
        recommendation: 'Bersihkan adapter SC/UPC/APC di OTB menggunakan One-Click Cleaner dan periksa lekukan patchcord di rack.'
      });
    }
  }

  points.push({
    id: 'otb-out',
    title: 'Keluaran OTB (Out OTB)',
    shortCode: 'OUT OTB',
    location: config.otbName || 'Port OTB',
    lossSegment: segment1Loss,
    lossAccumulated: Number(totalLoss.toFixed(2)),
    theoreticalPower: outOtbTheor,
    measuredPower: measuredOtb,
    delta: deltaOtb,
    status: otbStatus,
    description: `Setelah patchcord (${config.patchcordOltOtbLengthMeters}m) dan adapter OTB (-${segment1Loss} dB).`,
    iconName: 'Box'
  });

  if (isTwoStage) {
    // 3. Point 3: Masukan / IN ODC
    // Segment: Kabel Feeder (Panjang Km * alpha) + Fusion Splices di Closure / Feeder + Connector In ODC
    const feederCableLoss = (Number(config.feederLengthKm) || 0) * alpha;
    const feederSpliceLoss = (Number(config.feederSplicesCount) || 0) * spliceLoss;
    const odcConnInLoss = Number(config.odcConnectorInLoss) || connLoss;
    const segment2Loss = Number((feederCableLoss + feederSpliceLoss + odcConnInLoss).toFixed(3));

    totalLoss += segment2Loss;
    currentTheoreticalPower -= segment2Loss;
    const inOdcTheor = Number(currentTheoreticalPower.toFixed(2));

    const measuredOdcIn = config.measuredOdcIn !== undefined && !isNaN(config.measuredOdcIn) ? Number(config.measuredOdcIn) : undefined;
    const deltaOdcIn = measuredOdcIn !== undefined ? Number((measuredOdcIn - inOdcTheor).toFixed(2)) : undefined;

    let odcInStatus: NodePointResult['status'] = 'optimal';
    if (measuredOdcIn !== undefined) {
      if ((deltaOdcIn || 0) < -1.5) {
        odcInStatus = 'warning';
        issues.push({
          severity: 'danger',
          pointName: 'Masukan ODC (IN ODC)',
          message: `Loss kabel feeder menuju ODC tinggi (Drop ${deltaOdcIn} dB).`,
          recommendation: 'Kemungkinan terjadi microbending pada jalur kabel feeder, joint box closure bermasalah, atau konektor pigtail input ODC kotor/rusak.'
        });
      }
    }

    points.push({
      id: 'odc-in',
      title: 'Keluaran / Masukan IN ODC',
      shortCode: 'IN ODC',
      location: `${config.odcName || 'ODC'} (Port Input)`,
      lossSegment: segment2Loss,
      lossAccumulated: Number(totalLoss.toFixed(2)),
      theoreticalPower: inOdcTheor,
      measuredPower: measuredOdcIn,
      delta: deltaOdcIn,
      status: odcInStatus,
      description: `Kabel Feeder ${config.feederLengthKm} km + ${config.feederSplicesCount} splicing + konektor in (-${segment2Loss} dB).`,
      iconName: 'FolderDown'
    });

    // 4. Point 4: Keluaran OUT ODC
    // Segment: Splitter ODC + Connector Out ODC
    const odcSplitterLoss = getSplitterLoss(config.odcSplitterId, config.odcSplitterCustomLoss);
    const odcConnOutLoss = Number(config.odcConnectorOutLoss) || connLoss;
    const segment3Loss = Number((odcSplitterLoss + odcConnOutLoss).toFixed(3));

    totalLoss += segment3Loss;
    currentTheoreticalPower -= segment3Loss;
    const outOdcTheor = Number(currentTheoreticalPower.toFixed(2));

    const measuredOdcOut = config.measuredOdcOut !== undefined && !isNaN(config.measuredOdcOut) ? Number(config.measuredOdcOut) : undefined;
    const deltaOdcOut = measuredOdcOut !== undefined ? Number((measuredOdcOut - outOdcTheor).toFixed(2)) : undefined;

    let odcOutStatus: NodePointResult['status'] = 'optimal';
    if (measuredOdcOut !== undefined) {
      if ((deltaOdcOut || 0) < -1.5) {
        odcOutStatus = 'warning';
        issues.push({
          severity: 'danger',
          pointName: 'Keluaran ODC (OUT ODC)',
          message: `Daya output splitter ODC drop melebihi toleransi standar (${deltaOdcOut} dB).`,
          recommendation: 'Cek port splitter ODC. Jika port lain normal, kemungkinan port ini mengalami cacat fisik atau adapter cassette kotor.'
        });
      }
    }

    points.push({
      id: 'odc-out',
      title: 'Keluaran OUT ODC',
      shortCode: 'OUT ODC',
      location: `${config.odcName || 'ODC'} (Port Output Splitter)`,
      lossSegment: segment3Loss,
      lossAccumulated: Number(totalLoss.toFixed(2)),
      theoreticalPower: outOdcTheor,
      measuredPower: measuredOdcOut,
      delta: deltaOdcOut,
      status: odcOutStatus,
      description: `Splitter ODC (${getSplitterName(config.odcSplitterId)}) -${odcSplitterLoss} dB + konektor out (-${segment3Loss} dB).`,
      iconName: 'GitFork'
    });

    // 5. Point 5: Masukan / IN ODP
    // Segment: Kabel Distribusi (Panjang Km * alpha) + Splicing + Connector In ODP
    const distCableLoss = (Number(config.distLengthKm) || 0) * alpha;
    const distSpliceLoss = (Number(config.distSplicesCount) || 0) * spliceLoss;
    const odpConnInLoss = Number(config.odpConnectorInLoss) || connLoss;
    const segment4Loss = Number((distCableLoss + distSpliceLoss + odpConnInLoss).toFixed(3));

    totalLoss += segment4Loss;
    currentTheoreticalPower -= segment4Loss;
    const inOdpTheor = Number(currentTheoreticalPower.toFixed(2));

    const measuredOdpIn = config.measuredOdpIn !== undefined && !isNaN(config.measuredOdpIn) ? Number(config.measuredOdpIn) : undefined;
    const deltaOdpIn = measuredOdpIn !== undefined ? Number((measuredOdpIn - inOdpTheor).toFixed(2)) : undefined;

    let odpInStatus: NodePointResult['status'] = 'optimal';
    if (measuredOdpIn !== undefined) {
      if ((deltaOdpIn || 0) < -1.5) {
        odpInStatus = 'warning';
        issues.push({
          severity: 'warning',
          pointName: 'Masukan ODP (IN ODP)',
          message: `Redaman kabel distribusi menuju ODP berlebih (${deltaOdpIn} dB).`,
          recommendation: 'Periksa sambungan tray ODC, slack tiang kabel distribusi, atau kuncian klem tiang yang terlalu kencang (clamping stress).'
        });
      }
    }

    points.push({
      id: 'odp-in',
      title: 'Keluaran / Masukan IN ODP',
      shortCode: 'IN ODP',
      location: `${config.odpName || 'ODP'} (Pigtail Input)`,
      lossSegment: segment4Loss,
      lossAccumulated: Number(totalLoss.toFixed(2)),
      theoreticalPower: inOdpTheor,
      measuredPower: measuredOdpIn,
      delta: deltaOdpIn,
      status: odpInStatus,
      description: `Kabel Distribusi ${config.distLengthKm} km + ${config.distSplicesCount} splicing + konektor in (-${segment4Loss} dB).`,
      iconName: 'FolderDown'
    });
  } else {
    // Topology 2: OLT -> OTB -> ODP -> ONT (Direct Feeder ke ODP)
    const feederDirectCableLoss = (Number(config.feederLengthKm) || 0) * alpha;
    const feederDirectSpliceLoss = (Number(config.feederSplicesCount) || 0) * spliceLoss;
    const odpDirectConnInLoss = Number(config.odpConnectorInLoss) || connLoss;
    const segmentDirectLoss = Number((feederDirectCableLoss + feederDirectSpliceLoss + odpDirectConnInLoss).toFixed(3));

    totalLoss += segmentDirectLoss;
    currentTheoreticalPower -= segmentDirectLoss;
    const inOdpTheor = Number(currentTheoreticalPower.toFixed(2));

    const measuredOdpIn = config.measuredOdpIn !== undefined && !isNaN(config.measuredOdpIn) ? Number(config.measuredOdpIn) : undefined;
    const deltaOdpIn = measuredOdpIn !== undefined ? Number((measuredOdpIn - inOdpTheor).toFixed(2)) : undefined;

    let odpInStatus: NodePointResult['status'] = 'optimal';
    if (measuredOdpIn !== undefined) {
      if ((deltaOdpIn || 0) < -1.5) {
        odpInStatus = 'warning';
        issues.push({
          severity: 'warning',
          pointName: 'Masukan ODP (IN ODP Direct)',
          message: `Redaman kabel feeder langsung menuju ODP berlebih (${deltaOdpIn} dB).`,
          recommendation: 'Periksa tarikan kabel tiang dan splicing di joint closure.'
        });
      }
    }

    points.push({
      id: 'odp-in',
      title: 'Keluaran / Masukan IN ODP (Direct)',
      shortCode: 'IN ODP',
      location: `${config.odpName || 'ODP'} (Port Input Direct)`,
      lossSegment: segmentDirectLoss,
      lossAccumulated: Number(totalLoss.toFixed(2)),
      theoreticalPower: inOdpTheor,
      measuredPower: measuredOdpIn,
      delta: deltaOdpIn,
      status: odpInStatus,
      description: `Feeder Langsung ${config.feederLengthKm} km + ${config.feederSplicesCount} splicing + konektor in (-${segmentDirectLoss} dB).`,
      iconName: 'FolderDown'
    });
  }

  // 6. Point 6: Keluaran OUT ODP
  // Segment: Splitter ODP + Connector Out ODP (Adapter port ODP)
  const odpSplitterLoss = getSplitterLoss(config.odpSplitterId, config.odpSplitterCustomLoss);
  const odpConnOutLoss = Number(config.odpConnectorOutLoss) || connLoss;
  const segment5Loss = Number((odpSplitterLoss + odpConnOutLoss).toFixed(3));

  totalLoss += segment5Loss;
  currentTheoreticalPower -= segment5Loss;
  const outOdpTheor = Number(currentTheoreticalPower.toFixed(2));

  const measuredOdpOut = config.measuredOdpOut !== undefined && !isNaN(config.measuredOdpOut) ? Number(config.measuredOdpOut) : undefined;
  const deltaOdpOut = measuredOdpOut !== undefined ? Number((measuredOdpOut - outOdpTheor).toFixed(2)) : undefined;

  let odpOutStatus: NodePointResult['status'] = 'optimal';
  if (measuredOdpOut !== undefined) {
    if ((deltaOdpOut || 0) < -1.5) {
      odpOutStatus = 'warning';
      issues.push({
        severity: 'danger',
        pointName: 'Keluaran ODP (OUT ODP Port)',
        message: `Daya output port ODP terukur (${measuredOdpOut} dBm) terlalu rendah (${deltaOdpOut} dB dari teori).`,
        recommendation: 'Coba tes port lain pada ODP. Jika hanya port ini yang drop, bersihkan adapter ODP atau ganti port drop pelanggan.'
      });
    }
  }

  points.push({
    id: 'odp-out',
    title: 'Keluaran OUT ODP (Port Distribusi)',
    shortCode: 'OUT ODP',
    location: `${config.odpName || 'ODP'} (Port Distribusi)`,
    lossSegment: segment5Loss,
    lossAccumulated: Number(totalLoss.toFixed(2)),
    theoreticalPower: outOdpTheor,
    measuredPower: measuredOdpOut,
    delta: deltaOdpOut,
    status: odpOutStatus,
    description: `Splitter ODP (${getSplitterName(config.odpSplitterId)}) -${odpSplitterLoss} dB + adapter port ODP (-${segment5Loss} dB).`,
    iconName: 'Network'
  });

  // 7. Point 7: Penerimaan di ONT (Rx Power ONT)
  // Segment: Drop Cable (Meters * alpha) + Fast Connector + Roset Optik + Patchcord ONT
  const dropCableKm = (Number(config.dropCableLengthMeters) || 100) / 1000;
  const dropCableLoss = dropCableKm * alpha;
  const fastConnLoss = Number(config.fastConnectorLoss) || 0.3;
  const rosetLoss = Number(config.rosetLoss) || 0.2;
  const segment6Loss = Number((dropCableLoss + fastConnLoss + rosetLoss).toFixed(3));

  totalLoss += segment6Loss;
  currentTheoreticalPower -= segment6Loss;
  const ontTheor = Number(currentTheoreticalPower.toFixed(2));

  const measuredOnt = config.measuredOntRx !== undefined && !isNaN(config.measuredOntRx) ? Number(config.measuredOntRx) : undefined;
  const deltaOnt = measuredOnt !== undefined ? Number((measuredOnt - ontTheor).toFixed(2)) : undefined;

  // ONT Status check
  const activeOntPower = measuredOnt !== undefined ? measuredOnt : ontTheor;
  let ontStatus: NodePointResult['status'] = 'optimal';

  if (activeOntPower > -8.0) {
    ontStatus = 'overload';
    issues.push({
      severity: 'danger',
      pointName: 'ONT Pelanggan (Rx Power)',
      message: `Daya Rx ONT terlalu tinggi (${activeOntPower} dBm > -8 dBm). Berisiko merusak receiver photo-diode ONT.`,
      recommendation: 'Pasang Optical Attenuator (5 dB / 10 dB) atau sesuaikan rasio splitter sebelum terhubung ke ONT.'
    });
  } else if (activeOntPower >= -23.5) {
    ontStatus = 'optimal'; // -8 s/d -23.5 dBm
  } else if (activeOntPower >= -27.0) {
    ontStatus = 'warning'; // -23.5 s/d -27 dBm
    issues.push({
      severity: 'warning',
      pointName: 'ONT Pelanggan (Rx Power)',
      message: `Daya Rx ONT (${activeOntPower} dBm) mendekati batas sensitivitas standar (-27 dBm).`,
      recommendation: 'Cek terminasi Fast Connector di Roset atau tekukan drop cable di rumah pelanggan.'
    });
  } else {
    ontStatus = 'critical'; // < -27 dBm (LOS / Link Down)
    issues.push({
      severity: 'danger',
      pointName: 'ONT Pelanggan (Rx Power)',
      message: `Daya Rx ONT KRITIS (${activeOntPower} dBm < -27 dBm). Internet berpotensi LOS (Loss of Signal) atau sering RTO!`,
      recommendation: 'Wajib perbaikan lapangan: pasang ulang Fast Connector, cek redaman tiap titik dari ODP ke ODC.'
    });
  }

  points.push({
    id: 'ont-rx',
    title: 'Penerimaan ONT (Rx Power)',
    shortCode: 'ONT RX',
    location: config.ontName || 'Roset / Port PON ONT',
    lossSegment: segment6Loss,
    lossAccumulated: Number(totalLoss.toFixed(2)),
    theoreticalPower: ontTheor,
    measuredPower: measuredOnt,
    delta: deltaOnt,
    status: ontStatus,
    description: `Drop cable (${config.dropCableLengthMeters}m) + Fast Connector + Roset Optik (-${segment6Loss} dB).`,
    iconName: 'Wifi'
  });

  // Summary Metrics
  const ontSensitivityMin = -27.0; // dBm standard GPON ONT threshold
  const ontSensitivityMax = -8.0;
  const linkMargin = Number((activeOntPower - ontSensitivityMin).toFixed(2));

  let status: CalculationSummary['status'] = 'PASS';
  let statusMessage = 'Kualitas Link Sangat Bagus (Standar ISP Terpenuhi)';

  if (activeOntPower > ontSensitivityMax) {
    status = 'FAIL';
    statusMessage = 'Daya Terlalu Kuat (Optical Overload > -8 dBm)';
  } else if (activeOntPower < ontSensitivityMin) {
    status = 'FAIL';
    statusMessage = 'Link Kritis / Redaman Terlalu Tinggi (Loss of Signal / LOS)';
  } else if (activeOntPower < -23.5) {
    status = 'WARNING';
    statusMessage = 'Redaman Cukup Tinggi (Margin Tipis, Disarankan Optimasi)';
  }

  const totalActualLoss = (measuredOlt !== undefined && measuredOnt !== undefined)
    ? Number((measuredOlt - measuredOnt).toFixed(2))
    : undefined;

  return {
    txPowerOlt: txOlt,
    totalTheoreticalLoss: Number(totalLoss.toFixed(2)),
    rxPowerOnt: ontTheor,
    totalActualLoss,
    linkMargin,
    ontSensitivityMin,
    ontSensitivityMax,
    status,
    statusMessage,
    points,
    issues
  };
}
