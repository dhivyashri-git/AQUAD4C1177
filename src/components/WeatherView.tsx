import React, { useState } from 'react';
import { WeatherData } from '../types';
import { CHENNAI_WEATHER_DATA } from '../data/chennaiData';
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  Compass, 
  ArrowRight, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Layers,
  HardHat,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Play,
  Square,
  AlertOctagon,
  Power,
  RotateCcw,
  Cpu,
  Filter,
  Zap,
  Waves
} from 'lucide-react';

interface WeatherViewProps {
  onNavigateToFloodMap?: () => void;
  onNavigateToWorkers?: () => void;
}

export const WeatherView: React.FC<WeatherViewProps> = ({ 
  onNavigateToFloodMap,
  onNavigateToWorkers 
}) => {
  const data: WeatherData = CHENNAI_WEATHER_DATA;
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(0); // Default expand today

  // Drainage Sump Motor & Auto Cleaning System State (Weather Automated)
  const [motorState, setMotorState] = useState<'RUNNING' | 'STOPPED' | 'EMERGENCY_STOPPED'>('RUNNING');
  const [autoCleaningProcess, setAutoCleaningProcess] = useState<'STARTED' | 'GONE'>('STARTED');
  const [autoSyncWeather, setAutoSyncWeather] = useState<boolean>(true);
  const [actionNotice, setActionNotice] = useState<string>(
    'Weather Inundation Automated Action: Continuous rainfall (38.4 mm/hr) triggered Sump Motor Array #1 & #2 and initiated Culvert Auto-Cleaning.'
  );

  const handleStartMotor = () => {
    setMotorState('RUNNING');
    setActionNotice('Manual Command: Drainage Pump Motors #1 & #2 STARTED. Discharge rate: 12,500 L/min into Buckingham Canal.');
  };

  const handleStopMotor = () => {
    setMotorState('STOPPED');
    setActionNotice('Manual Command: Drainage Pump Motors STOPPED. Sump gates closed into gravity flow mode.');
  };

  const handleEmergencyStop = () => {
    setMotorState('EMERGENCY_STOPPED');
    setAutoCleaningProcess('GONE');
    setActionNotice('EMERGENCY CUT-OFF ACTIVATED: All drainage motors & motorized culvert rakes immediately halted.');
  };

  const handleToggleAutoCleaning = () => {
    if (autoCleaningProcess === 'STARTED') {
      setAutoCleaningProcess('GONE');
      setActionNotice('Auto-Cleaning Process: Finished / Gone (Rotary culvert desilting screen cycled and parked).');
    } else {
      setAutoCleaningProcess('STARTED');
      setActionNotice('Auto-Cleaning Process: STARTED (High-pressure water jets and trash rakes active).');
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-6.5rem)] bg-slate-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                CHENNAI WEATHER &amp; PRECIPITATION
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                IMD Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Regional Meteorological Centre, Nungambakkam &amp; Doppler Weather Radar (DWR) Chennai
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Observation: <strong>{data.lastUpdated} IST</strong>
          </div>
        </div>

        {/* Current Conditions Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              Current Conditions
            </span>
            <span className="text-xs text-slate-400">
              Station: Meenambakkam Airport / Nungambakkam Observatory
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                <CloudRain className="w-9 h-9" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 font-serif tracking-tight">
                  {data.temperatureC}°C
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  Heavy Rain &amp; Thunderstorms
                </div>
                <div className="text-xs text-slate-400">
                  Relative Humidity: {data.humidityPercent}%
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                Precipitation Runoff Rate
              </div>
              <div className="text-2xl font-bold text-blue-900 font-mono">
                {data.rainfallCurrentMmHr} mm/hr
              </div>
              <div className="text-slate-400 text-[11px]">
                Peak rate recorded at Nungambakkam
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                Precipitation Intensity
              </div>
              <div className="text-lg font-bold text-red-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                Torrential Downpour
              </div>
              <div className="text-slate-400 text-[11px]">
                Rain Probability: {data.rainProbabilityPercent}%
              </div>
            </div>

            <div className="space-y-1.5 text-xs border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-3 md:pt-0">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5" /> Wind Speed:</span>
                <span className="font-semibold">{data.windKmh} km/h</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5" /> Direction:</span>
                <span className="font-semibold">{data.windDirection}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5" /> Pressure:</span>
                <span className="font-semibold">{data.barometricPressureHpa} hPa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spec Section 10: Clear Visual Bridge Connecting Weather to Flood Risk */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
                HYDROLOGICAL IMPACT CORRELATION (WEATHER → DRAINAGE → FLOOD)
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 uppercase">
                {data.floodConnection.potentialImpact}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 font-serif">
              Why current weather increases urban flood probability
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {data.floodConnection.rainForecastSummary}
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Step 1: Rainfall Rate */}
              <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 relative">
                <div className="text-xs font-bold text-blue-900 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-blue-600" />
                    1. Rainfall Rate
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-mono">
                    Weather Data
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 mb-1">
                  44–52 mm/hr Peak
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {data.floodConnection.rainfallRateDesc}
                </p>
              </div>

              {/* Step 2: Drainage Load */}
              <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200 relative">
                <div className="text-xs font-bold text-amber-900 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-600" />
                    2. Drainage Load
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-mono">
                    Hydro Model
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 mb-1">
                  92%–100% Channel Volume
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {data.floodConnection.drainageLoadDesc}
                </p>
              </div>

              {/* Step 3: Flood Risk */}
              <div className="p-4 rounded-lg bg-red-50/50 border border-red-200 relative">
                <div className="text-xs font-bold text-red-900 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    3. Flood Risk
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-800 rounded font-mono">
                    Flood Estimate
                  </span>
                </div>
                <div className="text-sm font-bold text-red-900 mb-1">
                  High to Critical Inundation
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {data.floodConnection.floodRiskDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-500">
              Catchments under high vulnerability:{' '}
              <strong className="text-slate-800">{data.floodConnection.catchmentsAtRisk.join(', ')}</strong>
            </div>

            <div className="flex items-center gap-2">
              {onNavigateToWorkers && (
                <button
                  onClick={onNavigateToWorkers}
                  id="btn-weather-view-workers"
                  className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium flex items-center gap-1.5 transition-colors shrink-0 text-xs"
                >
                  <HardHat className="w-3.5 h-3.5 text-amber-600" />
                  <span>View Dispatched Workers</span>
                </button>
              )}

              {onNavigateToFloodMap && (
                <button
                  onClick={onNavigateToFloodMap}
                  id="btn-weather-view-risk-map"
                  className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium flex items-center gap-1.5 transition-colors shrink-0 text-xs"
                >
                  <span>Inspect on Live Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* NEXT 6 HOURS (Mandated by Spec Section 10) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
                NEXT 6 HOURS HOURLY FORECAST
              </h2>
            </div>
            <span className="text-xs text-slate-400">Short-Range Forecast Model</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
            {data.next6Hours.map((hour, idx) => (
              <div 
                key={hour.timeStr}
                className={`p-3 rounded-lg border text-xs transition-colors ${
                  idx === 0 || idx === 1
                    ? 'bg-blue-50/60 border-blue-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-bold text-slate-900 text-sm mb-1">{hour.timeStr}</div>
                <div className="text-xs text-slate-500 mb-2">{hour.condition}</div>
                
                <div className="text-lg font-bold text-slate-900 mb-1">{hour.tempC}°C</div>
                
                <div className="flex items-center justify-center gap-1 text-purple-700 font-semibold mb-1">
                  <Droplets className="w-3 h-3" />
                  <span>{hour.rainProbability}%</span>
                </div>

                <div className="text-[11px] font-mono font-bold text-blue-700">
                  {hour.rainfallMm} mm
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5-DAY WEATHER & MONSOON FORECAST WITH FLOOD OCCURRENCE ASSUMPTIONS */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
                5-DAY WEATHER &amp; FLOOD OCCURRENCE ASSUMPTIONS
              </h2>
            </div>
            <span className="text-xs text-slate-400">IMD Projection with Watershed Flood Inference</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Click any day below to inspect the <strong>Flood Occurrence Assumption</strong>, vulnerable catchments, and municipal field worker standby protocols assigned for that day.
          </p>

          <div className="space-y-3 text-xs">
            {data.fiveDayForecast.map((day, idx) => {
              const isExpanded = expandedDayIndex === idx;
              const assumption = day.floodAssumption;
              const willFloodOccur = assumption?.floodMayOccur ?? false;

              return (
                <div 
                  key={day.dateStr}
                  className={`rounded-xl border transition-all ${
                    willFloodOccur
                      ? isExpanded 
                        ? 'bg-amber-50/50 border-amber-300 shadow-xs' 
                        : 'bg-white border-amber-200 hover:border-amber-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Summary Row */}
                  <div 
                    onClick={() => setExpandedDayIndex(isExpanded ? null : idx)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-36 font-bold text-slate-900 text-sm">
                        {day.dateStr}
                      </div>

                      {/* Flood May Occur Assumption Badge */}
                      {willFloodOccur ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-100 text-red-900 border border-red-300 text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3 text-red-700" />
                          FLOOD MAY OCCUR ON THIS DAY
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          LOW FLOOD PROBABILITY
                        </span>
                      )}
                    </div>

                    <div className="flex-1 text-slate-600 font-medium sm:px-4">
                      {day.condition}
                    </div>

                    <div className="flex items-center gap-5 sm:justify-end text-right shrink-0">
                      <div className="w-18 text-slate-700 font-semibold">
                        {day.tempMinC}° / {day.tempMaxC}°C
                      </div>

                      <div className="w-20">
                        <span className="text-purple-700 font-bold">{day.rainProbability}%</span>
                        <span className="text-[10px] text-slate-400 block">Rain prob</span>
                      </div>

                      <div className="w-24 font-bold text-blue-700">
                        {day.expectedRainfallMm}
                      </div>

                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Flood Assumption Details */}
                  {isExpanded && assumption && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-200/80 space-y-3 bg-white/70 rounded-b-xl animate-in fade-in">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <AlertCircle className={`w-4 h-4 ${willFloodOccur ? 'text-red-600' : 'text-emerald-600'}`} />
                          <span>{assumption.assumptionHeadline}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                            assumption.probabilityLevel === 'CRITICAL' 
                              ? 'bg-red-100 text-red-900 border-red-300'
                              : assumption.probabilityLevel === 'HIGH'
                              ? 'bg-orange-100 text-orange-900 border-orange-300'
                              : assumption.probabilityLevel === 'MODERATE'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}>
                            Risk Level: {assumption.probabilityLevel}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                        <strong>Hydrological Rationale:</strong> {assumption.rationale}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                        <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                            Vulnerable Catchments &amp; Wards
                          </span>
                          <span className="font-medium text-slate-800 mt-0.5 block">
                            {assumption.vulnerableZones.join(', ')}
                          </span>
                        </div>

                        <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                            GCC Field Personnel Standby Protocol
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-slate-800">
                            <HardHat className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{assumption.workerStandbyLevel} ({assumption.assignedWorkersCount} Personnel)</span>
                          </div>
                        </div>
                      </div>

                      {/* Civic Precaution & Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                        <div className="text-[11px] text-slate-600">
                          <strong>Advisory:</strong> {assumption.recommendedCivicPrecaution}
                        </div>

                        {onNavigateToWorkers && (
                          <button
                            onClick={onNavigateToWorkers}
                            className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                          >
                            <HardHat className="w-3.5 h-3.5 text-amber-400" />
                            <span>View Workers Assigned for this Day</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AUTOMATED DRAINAGE PUMP & AUTO CLEANING CONTROL SYSTEM */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-blue-100 text-blue-800">
                  <Zap className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 font-serif">
                  Automated Drainage Pump &amp; Auto Cleaning Control
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Weather-Integrated SCADA: Automatically operates sump motors and culvert trash rakes during heavy rainfall
              </p>
            </div>

            {/* Current Real-time Process Status Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Motor Status Badge */}
              <div className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 border ${
                motorState === 'RUNNING'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : motorState === 'STOPPED'
                  ? 'bg-slate-100 text-slate-700 border-slate-300'
                  : 'bg-red-100 text-red-800 border-red-300 animate-pulse'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  motorState === 'RUNNING' ? 'bg-emerald-500 animate-ping' : motorState === 'STOPPED' ? 'bg-slate-400' : 'bg-red-600'
                }`}></span>
                <span>Motor: {motorState === 'RUNNING' ? 'RUNNING' : motorState === 'STOPPED' ? 'STOPPED' : 'EMERGENCY STOPPED'}</span>
              </div>

              {/* Auto Cleaning Process Status Badge */}
              <div className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 border ${
                autoCleaningProcess === 'STARTED'
                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                  : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}>
                <Filter className="w-3.5 h-3.5" />
                <span>Auto Cleaning: {autoCleaningProcess === 'STARTED' ? 'PROCESS STARTED' : 'PROCESS GONE / IDLE'}</span>
              </div>
            </div>
          </div>

          {/* Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-md border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Dewatering Pumps</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block font-mono">
                {motorState === 'RUNNING' ? '4 / 4 Units Active' : motorState === 'STOPPED' ? '0 / 4 Standby' : '0 / 4 Halted'}
              </span>
              <span className="text-[10px] text-slate-500">12,500 L/min capacity</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-md border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Culvert Trash Rake</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {autoCleaningProcess === 'STARTED' ? 'Active Jet Desilting' : 'Desilting Inactive'}
              </span>
              <span className="text-[10px] text-slate-500">Prevents canal mouth clogs</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-md border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Weather Automation Trigger</span>
              <span className="font-bold text-emerald-700 text-sm mt-0.5 block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Auto-Actuate &gt; 30 mm/hr
              </span>
              <span className="text-[10px] text-slate-500">Current: {data.rainfallCurrentMmHr} mm/hr</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-md border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Discharge Channel</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">
                South Buckingham Canal
              </span>
              <span className="text-[10px] text-slate-500">Gravity + Pump Assist</span>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {/* Start Motor Button */}
            <button
              onClick={handleStartMotor}
              id="btn-start-motor"
              disabled={motorState === 'RUNNING'}
              className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Motor</span>
            </button>

            {/* Stop Motor Button */}
            <button
              onClick={handleStopMotor}
              id="btn-stop-motor"
              disabled={motorState === 'STOPPED'}
              className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Motor</span>
            </button>

            {/* Emergency Stop Button */}
            <button
              onClick={handleEmergencyStop}
              id="btn-emergency-stop"
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer border border-red-700"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Emergency Stop</span>
            </button>

            {/* Toggle Auto-Cleaning Process (Start / Gone) */}
            <button
              onClick={handleToggleAutoCleaning}
              id="btn-toggle-auto-cleaning"
              className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                autoCleaningProcess === 'STARTED'
                  ? 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${autoCleaningProcess === 'STARTED' ? 'animate-spin' : ''}`} />
              <span>
                {autoCleaningProcess === 'STARTED' ? 'Auto Cleaning: Set to Gone / Stop' : 'Auto Cleaning: Start Process'}
              </span>
            </button>
          </div>

          {/* System Dynamic Status Log */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0"></span>
            <div>
              <span className="font-semibold text-slate-900">System Activity: </span>
              <span>{actionNotice}</span>
            </div>
          </div>
        </div>

        {/* Clear Disclaimer */}
        <div className="p-3 rounded bg-slate-100 border border-slate-200 text-[11px] text-slate-500 text-center">
          Weather data sourced from Regional Meteorological Centre (RMC) Chennai. Hydrological run-off estimates calculated via AQUAD4C1177 watershed dynamic simulations.
        </div>
      </div>
    </div>
  );
};
