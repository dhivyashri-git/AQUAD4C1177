import React, { useState, useEffect } from 'react';
import { 
  FloodRiskZone, 
  RiskLevel, 
  TimelineStep, 
  SensorStation 
} from '../types';
import { 
  MapComponent, 
  MapLayerVisibility 
} from './MapComponent';
import { 
  Layers, 
  Clock, 
  AlertTriangle, 
  CloudRain, 
  Waves, 
  MapPin, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  Sliders, 
  X,
  Compass,
  ArrowUpRight,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Activity,
  AlertCircle
} from 'lucide-react';

interface FloodPredictionViewProps {
  floodZones: FloodRiskZone[];
  sensors: SensorStation[];
  onNavigateToNavigator?: (destinationName: string) => void;
  onNavigateToDrain?: (areaName: string) => void;
}

export const FloodPredictionView: React.FC<FloodPredictionViewProps> = ({
  floodZones,
  sensors,
  onNavigateToNavigator,
  onNavigateToDrain
}) => {
  // Layer visibility state (default: Flood Risk + Roads as required by prompt)
  const [layers, setLayers] = useState<MapLayerVisibility>({
    floodRisk: true,
    rainfall: false,
    drainage: false,
    canals: true,
    waterlogging: true,
    sensors: true,
    roads: true,
  });

  const [selectedZone, setSelectedZone] = useState<FloodRiskZone | null>(
    floodZones.find(z => z.id === 'zone-madipakkam') || floodZones.find(z => z.id === 'zone-velachery') || floodZones[0]
  );

  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number>(0);
  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(false);
  const [isSimulatingRise, setIsSimulatingRise] = useState<boolean>(false);
  const [panelTab, setPanelTab] = useState<'monitor' | 'details'>('monitor');

  // Automated water level rising simulation loop
  useEffect(() => {
    if (!isSimulatingRise || !selectedZone) return;
    const interval = setInterval(() => {
      setSelectedTimelineIndex(prev => (prev + 1) % selectedZone.timeline.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isSimulatingRise, selectedZone]);

  const toggleLayer = (layerKey: keyof MapLayerVisibility) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const getRiskBadgeColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-red-600 text-white border-red-700';
      case 'HIGH':
        return 'bg-orange-500 text-white border-orange-600';
      case 'MODERATE':
        return 'bg-amber-500 text-white border-amber-600';
      case 'LOW':
      default:
        return 'bg-emerald-600 text-white border-emerald-700';
    }
  };

  const activeTimelineStep: TimelineStep = selectedZone 
    ? selectedZone.timeline[selectedTimelineIndex] || selectedZone.timeline[0]
    : { label: 'NOW', timeStr: '10:42 AM', risk: 'LOW', waterDepth: '0.05 m', rainfallRate: '15 mm/hr', confidence: 90 };

  // Calculate onset and critical flood projection times
  const rainfallStartedTime = selectedZone?.id === 'zone-madipakkam'
    ? 'Today at 10:18 AM'
    : selectedZone?.id === 'zone-velachery'
    ? 'Today at 10:15 AM'
    : selectedZone?.id === 'zone-semmancheri'
    ? 'Today at 10:30 AM'
    : 'Today at 10:20 AM';

  const peakFloodStep = selectedZone?.timeline.find(t => t.risk === 'CRITICAL' || t.risk === 'HIGH') || selectedZone?.timeline[2];
  const peakOccurrenceTime = `Today at ${peakFloodStep?.timeStr || '11:45 AM'}`;

  // Calculate rising water gauge height percentage
  const getGaugeHeightPercent = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return 92;
      case 'HIGH':
        return 72;
      case 'MODERATE':
        return 48;
      case 'LOW':
      default:
        return 22;
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] sm:h-[calc(100vh-6.5rem)] flex flex-col overflow-hidden bg-slate-100">
      {/* 1. Large Chennai Map (The main visual element) */}
      <div className="relative flex-1 w-full h-full">
        <MapComponent
          layers={layers}
          floodZones={floodZones}
          selectedZoneId={selectedZone?.id || null}
          onSelectZone={(zone) => {
            setSelectedZone(zone);
            setSelectedTimelineIndex(0);
          }}
          sensors={sensors}
          heightClass="h-full"
        />

        {/* 2. Small floating overview chips across top of map (NOT 15+ cards) */}
        <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-2">
          {/* Left: 4 Floating Summary Indicators */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
            {/* Chip 1: Flood Risk */}
            <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-md px-3 py-1.5 shadow-sm text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span className="text-slate-500 font-medium">Flood Risk:</span>
              <span className="font-bold text-slate-900">2 Critical, 3 High Zones</span>
            </div>

            {/* Chip 2: Rainfall */}
            <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-md px-3 py-1.5 shadow-sm text-xs flex items-center gap-2">
              <CloudRain className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-slate-500 font-medium">Precipitation:</span>
              <span className="font-bold text-slate-900">38.4 mm/hr (Heavy)</span>
            </div>

            {/* Chip 3: Next Flood Window */}
            <div className="hidden sm:flex bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-md px-3 py-1.5 shadow-sm text-xs items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-slate-500 font-medium">Peak Flood Window:</span>
              <span className="font-bold text-slate-900">Next 1–2 Hours</span>
            </div>

            {/* Chip 4: Drain Connectivity */}
            <div className="hidden md:flex bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-md px-3 py-1.5 shadow-sm text-xs items-center gap-2">
              <Waves className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-slate-500 font-medium">Drain Network:</span>
              <span className="font-bold text-red-600">D-104 Blocked</span>
            </div>
          </div>

          {/* Right: Layer Control Toggle & Location Jump */}
          <div className="pointer-events-auto flex items-center gap-2 ml-auto">
            {/* Location selector dropdown for quick jump */}
            <select
              value={selectedZone?.id || ''}
              onChange={(e) => {
                const target = floodZones.find(z => z.id === e.target.value);
                if (target) {
                  setSelectedZone(target);
                  setSelectedTimelineIndex(0);
                }
              }}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded-md px-2.5 py-1.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-800 cursor-pointer font-medium"
              id="select-flood-zone-dropdown"
            >
              <option value="" disabled>Select Chennai Zone...</option>
              {floodZones.map(z => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.currentRisk})
                </option>
              ))}
            </select>

            {/* Toggle Layers Drawer Button */}
            <button
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              id="btn-toggle-layers-panel"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 border shadow-sm transition-colors ${
                showLayerPanel 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </button>
          </div>
        </div>

        {/* QUICK CITIZEN VILLAGE / LOCALITY CHECKER (Mandated: Madipakkam / "marikam" and village areas) */}
        <div className="absolute top-16 left-4 z-20 pointer-events-auto flex items-center gap-1.5 overflow-x-auto max-w-[calc(100vw-2rem)] py-1 px-2 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-lg shadow-sm text-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 pr-1 border-r border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            Citizen Area Check:
          </span>
          {[
            { id: 'zone-madipakkam', label: 'Madipakkam (Marikam)', highlight: true },
            { id: 'zone-velachery', label: 'Velachery' },
            { id: 'zone-semmancheri', label: 'Semmancheri' },
            { id: 'zone-perungudi', label: 'Perungudi' },
            { id: 'zone-kolathur', label: 'Kolathur' },
            { id: 'zone-saidapet', label: 'Saidapet' },
          ].map(chip => {
            const isSelected = selectedZone?.id === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => {
                  const target = floodZones.find(z => z.id === chip.id);
                  if (target) {
                    setSelectedZone(target);
                    setSelectedTimelineIndex(0);
                    setPanelTab('monitor');
                  }
                }}
                id={`btn-chip-${chip.id}`}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-xs'
                    : chip.highlight
                    ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-bold'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {chip.highlight && !isSelected && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>}
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Floating Layer Control Panel (When opened) */}
        {showLayerPanel && (
          <div 
            className="absolute top-16 right-4 z-30 w-64 bg-white rounded-lg border border-slate-200 shadow-md p-3 text-xs animate-in fade-in"
            id="panel-layer-controls"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Map Layers
              </span>
              <button 
                onClick={() => setShowLayerPanel(false)}
                className="text-slate-400 hover:text-slate-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 hover:bg-slate-50 rounded">
                <span className="font-medium text-slate-800">Flood Risk Zones</span>
                <input
                  type="checkbox"
                  checked={layers.floodRisk}
                  onChange={() => toggleLayer('floodRisk')}
                  className="rounded text-slate-900 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 hover:bg-slate-50 rounded">
                <span className="font-medium text-slate-800">Rainfall Radar Band</span>
                <input
                  type="checkbox"
                  checked={layers.rainfall}
                  onChange={() => toggleLayer('rainfall')}
                  className="rounded text-slate-900 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 hover:bg-slate-50 rounded">
                <span className="font-medium text-slate-800">Drainage Network</span>
                <input
                  type="checkbox"
                  checked={layers.drainage}
                  onChange={() => toggleLayer('drainage')}
                  className="rounded text-slate-900 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 hover:bg-slate-50 rounded">
                <span className="font-medium text-slate-800">Canals &amp; Waterways</span>
                <input
                  type="checkbox"
                  checked={layers.canals}
                  onChange={() => toggleLayer('canals')}
                  className="rounded text-slate-900 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 hover:bg-slate-50 rounded">
                <span className="font-medium text-slate-800">Waterlogging Points</span>
                <input
                  type="checkbox"
                  checked={layers.waterlogging}
                  onChange={() => toggleLayer('waterlogging')}
                  className="rounded text-slate-900 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 hover:bg-slate-50 rounded">
                <span className="font-medium text-slate-800">IoT Level Sensors</span>
                <input
                  type="checkbox"
                  checked={layers.sensors}
                  onChange={() => toggleLayer('sensors')}
                  className="rounded text-slate-900 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 hover:bg-slate-50 rounded">
                <span className="font-medium text-slate-800">Road Corridors</span>
                <input
                  type="checkbox"
                  checked={layers.roads}
                  onChange={() => toggleLayer('roads')}
                  className="rounded text-slate-900 focus:ring-0"
                />
              </label>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>Default: Risk + Roads</span>
              <button
                onClick={() => setLayers({
                  floodRisk: true,
                  rainfall: false,
                  drainage: false,
                  canals: true,
                  waterlogging: true,
                  sensors: true,
                  roads: true,
                })}
                className="text-blue-600 hover:underline font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Legend Overlay at bottom left of map */}
        <div className="absolute bottom-6 left-4 z-20 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-md p-2.5 shadow-sm text-xs">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Flood Risk Scale
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-[11px] font-medium text-slate-700">Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-[11px] font-medium text-slate-700">Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-[11px] font-medium text-slate-700">High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span className="text-[11px] font-medium text-slate-700">Critical</span>
            </div>
          </div>
        </div>

        {/* 3. Compact Floating Information Panel for Selected Zone with Live Water Level Rise Monitor */}
        {selectedZone && (
          <div 
            className="absolute bottom-6 right-4 z-20 w-84 sm:w-96 bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2"
            id="panel-selected-flood-zone"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-slate-900 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-sky-400 flex items-center gap-1.5">
                    <span>FLOOD MONITORING SYSTEM</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  </div>
                  <div className="text-base font-bold font-serif leading-tight mt-0.5">
                    {selectedZone.name}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {selectedZone.ward} • Zone {selectedZone.zoneNumber}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${getRiskBadgeColor(activeTimelineStep.risk)}`}>
                    {activeTimelineStep.risk}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {selectedZone.dataSource}
                  </span>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setPanelTab('monitor')}
                  id="tab-rising-water-monitor"
                  className={`flex-1 py-1 px-2 rounded font-semibold text-center transition-colors flex items-center justify-center gap-1.5 ${
                    panelTab === 'monitor'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Rising Water Monitor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPanelTab('details')}
                  id="tab-zone-details"
                  className={`flex-1 py-1 px-2 rounded font-semibold text-center transition-colors ${
                    panelTab === 'details'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>Roads &amp; Details</span>
                </button>
              </div>
            </div>

            {/* TAB 1: RISING WATER LEVEL MONITORING SYSTEM */}
            {panelTab === 'monitor' && (
              <div className="p-4 space-y-3 text-xs">
                {/* Rainfall Onset & Critical Flood Occurrence Banner */}
                <div className="p-2.5 bg-red-50/80 border border-red-200 rounded-md space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <strong>Rainfall Started:</strong>
                    </span>
                    <span className="font-semibold text-slate-800">{rainfallStartedTime}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-red-200/60">
                    <span className="text-red-900 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 animate-pulse" />
                      <span>Red Flood May Occur:</span>
                    </span>
                    <span className="font-bold text-red-700 bg-red-100/90 px-1.5 py-0.5 rounded">
                      {peakOccurrenceTime}
                    </span>
                  </div>
                  <div className="text-[10px] text-red-800 leading-tight">
                    Estimated flood window: <strong>{selectedZone.expectedWindow}</strong>
                  </div>
                </div>

                {/* VISUAL RISING WATER MONITORING GAUGE */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-red-600" />
                      Live Water Level Gauge
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Rising Rate: +14 cm/hr
                    </span>
                  </div>

                  <div className="flex items-center gap-4 py-1">
                    {/* Calibrated Vertical Rising Gauge Chamber */}
                    <div className="relative w-14 h-32 bg-white rounded-md border-2 border-slate-300 flex flex-col justify-end p-1 shadow-inner shrink-0 overflow-hidden">
                      {/* Gauge Calibration Marks */}
                      <div className="absolute inset-y-1 right-1 flex flex-col justify-between text-[8px] font-mono text-slate-400 pointer-events-none select-none z-10">
                        <span className="text-red-600 font-bold">0.6m</span>
                        <span className="text-orange-600 font-bold">0.4m</span>
                        <span className="text-amber-600">0.2m</span>
                        <span className="text-emerald-600">0.0m</span>
                      </div>

                      {/* Red Threshold Line */}
                      <div className="absolute top-[28%] inset-x-0 border-b border-dashed border-red-400 z-10 pointer-events-none"></div>

                      {/* THE RISING WATER COLUMN */}
                      <div 
                        style={{ height: `${getGaugeHeightPercent(activeTimelineStep.risk)}%` }}
                        className={`w-full rounded-sm transition-all duration-700 ease-out relative flex flex-col justify-between ${
                          activeTimelineStep.risk === 'CRITICAL'
                            ? 'bg-gradient-to-t from-red-700 via-red-600 to-red-500 shadow-md shadow-red-500/50'
                            : activeTimelineStep.risk === 'HIGH'
                            ? 'bg-gradient-to-t from-orange-600 to-red-500'
                            : activeTimelineStep.risk === 'MODERATE'
                            ? 'bg-gradient-to-t from-amber-500 to-orange-400'
                            : 'bg-gradient-to-t from-emerald-600 to-teal-400'
                        }`}
                      >
                        {/* Animated Water Surface Waves */}
                        <div className="w-full h-1.5 bg-white/40 animate-water-wave rounded-full"></div>
                        <div className="text-center text-[9px] font-bold text-white leading-none pb-1 drop-shadow-xs font-mono">
                          {activeTimelineStep.risk === 'CRITICAL' ? 'RED' : ''}
                        </div>
                      </div>
                    </div>

                    {/* Telemetry Status Beside Gauge */}
                    <div className="flex-1 space-y-1.5">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Water Depth at {activeTimelineStep.timeStr}</span>
                        <div className="text-xl font-bold font-mono text-slate-900 leading-tight mt-0.5">
                          {activeTimelineStep.waterDepth}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          activeTimelineStep.risk === 'CRITICAL' ? 'bg-red-600 animate-ping' : activeTimelineStep.risk === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500'
                        }`}></span>
                        <span className={`font-bold text-xs ${
                          activeTimelineStep.risk === 'CRITICAL' ? 'text-red-700' : activeTimelineStep.risk === 'HIGH' ? 'text-orange-700' : 'text-amber-700'
                        }`}>
                          {activeTimelineStep.risk === 'CRITICAL' ? 'Red Inundation Occurs' : `${activeTimelineStep.risk} Risk Stage`}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-600 leading-tight">
                        {activeTimelineStep.risk === 'CRITICAL'
                          ? 'Roads fully submerged. Low-clearance transit completely impassable.'
                          : activeTimelineStep.risk === 'HIGH'
                          ? 'Water rising rapidly onto sidewalks and arterial carriage widths.'
                          : 'Early runoff gathering towards local culverts.'}
                      </p>
                    </div>
                  </div>

                  {/* SIMULATE WATER RISE CONTROLLER */}
                  <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsSimulatingRise(!isSimulatingRise)}
                      id="btn-simulate-water-rise"
                      className={`px-3 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSimulatingRise
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isSimulatingRise ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause Rise</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Simulate Water Rise</span>
                        </>
                      )}
                    </button>

                    <span className="text-[10px] text-slate-500">
                      Step: <strong>{activeTimelineStep.label}</strong> ({activeTimelineStep.timeStr})
                    </span>
                  </div>
                </div>

                {/* Timeline Step Controls */}
                <div className="grid grid-cols-5 gap-1 text-center" id="flood-timeline-controls">
                  {selectedZone.timeline.map((step, idx) => {
                    const isStepActive = selectedTimelineIndex === idx;
                    let dotColor = 'bg-emerald-600';
                    if (step.risk === 'MODERATE') dotColor = 'bg-amber-500';
                    if (step.risk === 'HIGH') dotColor = 'bg-orange-500';
                    if (step.risk === 'CRITICAL') dotColor = 'bg-red-600';

                    return (
                      <button
                        key={step.label}
                        onClick={() => {
                          setSelectedTimelineIndex(idx);
                          setIsSimulatingRise(false);
                        }}
                        className={`p-1.5 rounded text-[10px] border transition-all cursor-pointer ${
                          isStepActive 
                            ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-2xs' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-semibold">{step.label}</div>
                        <div className="flex items-center justify-center gap-1 my-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                          <span className={`text-[9px] font-bold ${isStepActive ? 'text-white' : 'text-slate-800'}`}>
                            {step.risk.slice(0, 4)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {onNavigateToNavigator && (
                    <button
                      onClick={() => onNavigateToNavigator(selectedZone.name)}
                      id="btn-navigate-avoid-zone"
                      className="flex-1 py-1.5 px-2.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Plan Safe Route</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onNavigateToDrain && (
                    <button
                      onClick={() => onNavigateToDrain(selectedZone.name)}
                      id="btn-inspect-zone-drains"
                      className="py-1.5 px-2.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
                    >
                      Inspect Drains
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: ROADS & DETAILED METRICS */}
            {panelTab === 'details' && (
              <div className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200/80">
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Expected Flooding Window</div>
                    <div className="font-bold text-slate-900 mt-0.5">{selectedZone.expectedWindow}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Estimated Water Depth</div>
                    <div className="font-bold text-slate-900 mt-0.5">{activeTimelineStep.waterDepth}</div>
                  </div>
                  <div className="mt-1">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Rainfall Rate</div>
                    <div className="font-bold text-slate-900 mt-0.5">{activeTimelineStep.rainfallRate}</div>
                  </div>
                  <div className="mt-1">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Model Confidence</div>
                    <div className="font-bold text-slate-900 mt-0.5">{activeTimelineStep.confidence}%</div>
                  </div>
                </div>

                {/* Affected Road Corridors */}
                <div className="text-[11px]">
                  <span className="font-semibold text-slate-700">Affected Road Segments: </span>
                  <span className="text-slate-600">
                    {selectedZone.affectedRoads.slice(0, 3).join(', ')}
                  </span>
                </div>

                {/* Vulnerability & Action */}
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700">
                  <strong>Vulnerability:</strong> {selectedZone.keyVulnerabilities}
                </div>

                {/* Disclaimer */}
                <div className="p-2 bg-amber-50/70 border border-amber-200 rounded text-[10px] text-amber-900 leading-snug">
                  <strong>Disclaimer:</strong> Flood predictions are model estimates and may change as rainfall and drainage conditions change.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

