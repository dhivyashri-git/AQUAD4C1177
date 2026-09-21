import React, { useState } from 'react';
import { 
  RouteOption, 
  TransportMode, 
  FloodRiskZone 
} from '../types';
import { 
  CHENNAI_LOCATIONS, 
  ROUTE_A_CENTRAL_TO_VELACHERY, 
  ROUTE_B_CENTRAL_TO_VELACHERY,
  ROUTE_A_GUINDY_TO_OMR,
  ROUTE_B_GUINDY_TO_OMR,
  ChennaiLocation
} from '../data/chennaiData';
import { MapComponent } from './MapComponent';
import { 
  Navigation, 
  MapPin, 
  Car, 
  Bike, 
  Search, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  CornerDownRight, 
  ArrowRight, 
  Check, 
  RefreshCw,
  Info
} from 'lucide-react';

interface NavigatorViewProps {
  floodZones: FloodRiskZone[];
  initialDestinationName?: string;
}

export const NavigatorView: React.FC<NavigatorViewProps> = ({ 
  floodZones, 
  initialDestinationName 
}) => {
  const [fromQuery, setFromQuery] = useState<string>('Chennai Central Railway Station');
  const [toQuery, setToQuery] = useState<string>(
    initialDestinationName || 'Velachery MRTS Station'
  );
  const [transportMode, setTransportMode] = useState<TransportMode>('four-wheeler');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  // Selected routes
  const [activeRoute, setActiveRoute] = useState<RouteOption>(ROUTE_A_CENTRAL_TO_VELACHERY);
  const [alternativeRoute, setAlternativeRoute] = useState<RouteOption>(ROUTE_B_CENTRAL_TO_VELACHERY);
  const [selectedRouteType, setSelectedRouteType] = useState<'standard' | 'alternative'>('standard');

  const [fromSuggestions, setFromSuggestions] = useState<ChennaiLocation[]>([]);
  const [toSuggestions, setToSuggestions] = useState<ChennaiLocation[]>([]);

  // Filter location suggestions
  const handleFromChange = (text: string) => {
    setFromQuery(text);
    if (text.length > 1) {
      setFromSuggestions(
        CHENNAI_LOCATIONS.filter(l => 
          l.name.toLowerCase().includes(text.toLowerCase()) || 
          l.neighborhood.toLowerCase().includes(text.toLowerCase())
        ).slice(0, 4)
      );
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToChange = (text: string) => {
    setToQuery(text);
    if (text.length > 1) {
      setToSuggestions(
        CHENNAI_LOCATIONS.filter(l => 
          l.name.toLowerCase().includes(text.toLowerCase()) || 
          l.neighborhood.toLowerCase().includes(text.toLowerCase())
        ).slice(0, 4)
      );
    } else {
      setToSuggestions([]);
    }
  };

  const handleFindRoute = () => {
    setIsSearching(true);
    // Simulate real Chennai road geometry routing calculation
    setTimeout(() => {
      setIsSearching(false);
      setHasCalculated(true);

      // Dynamically select appropriate road geometry based on query
      if (fromQuery.toLowerCase().includes('guindy') || toQuery.toLowerCase().includes('thoraipakkam')) {
        setActiveRoute(ROUTE_A_GUINDY_TO_OMR);
        setAlternativeRoute(ROUTE_B_GUINDY_TO_OMR);
      } else {
        setActiveRoute(ROUTE_A_CENTRAL_TO_VELACHERY);
        setAlternativeRoute(ROUTE_B_CENTRAL_TO_VELACHERY);
      }
      setSelectedRouteType('standard');
    }, 400);
  };

  const currentActive = selectedRouteType === 'standard' ? activeRoute : alternativeRoute;

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] sm:h-[calc(100vh-6.5rem)] flex flex-col md:flex-row overflow-hidden bg-slate-100">
      {/* Left / Top Floating Navigation Search Panel */}
      <div className="w-full md:w-[380px] lg:w-[420px] bg-white border-b md:border-b-0 md:border-r border-slate-200 shadow-md z-20 flex flex-col shrink-0 overflow-y-auto">
        {/* Navigation Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-700 text-white flex items-center justify-center font-bold">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 font-serif">
                FLOOD-TIME NAVIGATOR
              </h2>
              <p className="text-[11px] text-slate-500">
                Chennai Real Road Geometry &amp; Inundation Routing
              </p>
            </div>
          </div>
        </div>

        {/* Inputs Section */}
        <div className="p-4 space-y-3 border-b border-slate-200">
          {/* FROM Input */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              FROM
            </label>
            <div className="relative">
              <input
                type="text"
                value={fromQuery}
                onChange={(e) => handleFromChange(e.target.value)}
                placeholder="Enter starting location"
                className="w-full text-xs px-3 py-2 pl-8 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 font-medium"
                id="input-nav-from"
              />
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-2.5 top-2.5" />
            </div>
            {fromSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-md shadow-lg mt-1 z-30 overflow-hidden text-xs">
                {fromSuggestions.map(loc => (
                  <div
                    key={loc.id}
                    onClick={() => {
                      setFromQuery(loc.name);
                      setFromSuggestions([]);
                    }}
                    className="p-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                  >
                    <div className="font-semibold text-slate-800">{loc.name}</div>
                    <div className="text-[10px] text-slate-500">{loc.neighborhood} • {loc.type}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TO Input */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-900"></span>
              TO
            </label>
            <div className="relative">
              <input
                type="text"
                value={toQuery}
                onChange={(e) => handleToChange(e.target.value)}
                placeholder="Enter destination"
                className="w-full text-xs px-3 py-2 pl-8 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 font-medium"
                id="input-nav-to"
              />
              <MapPin className="w-4 h-4 text-slate-900 absolute left-2.5 top-2.5" />
            </div>
            {toSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-md shadow-lg mt-1 z-30 overflow-hidden text-xs">
                {toSuggestions.map(loc => (
                  <div
                    key={loc.id}
                    onClick={() => {
                      setToQuery(loc.name);
                      setToSuggestions([]);
                    }}
                    className="p-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                  >
                    <div className="font-semibold text-slate-800">{loc.name}</div>
                    <div className="text-[10px] text-slate-500">{loc.neighborhood} • {loc.type}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transport Mode: [ Two Wheeler ] [ Four Wheeler ] */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Transport
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTransportMode('two-wheeler')}
                id="btn-transport-twowheeler"
                className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  transportMode === 'two-wheeler'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>Two Wheeler</span>
              </button>

              <button
                type="button"
                onClick={() => setTransportMode('four-wheeler')}
                id="btn-transport-fourwheeler"
                className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  transportMode === 'four-wheeler'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Four Wheeler</span>
              </button>
            </div>
            {transportMode === 'two-wheeler' && (
              <p className="text-[10px] text-amber-700 mt-1 font-medium">
                Note: Two-wheelers have strict 0.20m water clearance threshold.
              </p>
            )}
          </div>

          {/* ANIMATED TRANSIT CORRIDOR: FROM ➔ TO (Two-Wheeler / Four-Wheeler) */}
          <div className="p-3 bg-slate-900 rounded-lg text-white space-y-2 shadow-xs border border-slate-800">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Route Transit Simulation
              </span>
              <span className="text-sky-400">
                {transportMode === 'two-wheeler' ? 'Two-Wheeler Mode' : 'Four-Wheeler Mode'}
              </span>
            </div>

            {/* FROM and TO Pin Badges */}
            <div className="flex items-center justify-between text-[11px] font-semibold gap-2">
              <div className="flex items-center gap-1 text-emerald-300 truncate max-w-[45%]">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">FROM: {fromQuery ? fromQuery.split(',')[0].split(' ')[0] : 'Origin'}</span>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
              <div className="flex items-center gap-1 text-sky-300 truncate max-w-[45%] justify-end">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">TO: {toQuery ? toQuery.split(',')[0].split(' ')[0] : 'Destination'}</span>
              </div>
            </div>

            {/* Animated Transit Track */}
            <div className="relative h-9 bg-slate-950/80 rounded-md border border-slate-800 flex items-center px-2 overflow-hidden">
              {/* Dashed Road Centerline */}
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 border-b border-dashed border-slate-700 pointer-events-none"></div>

              {/* Start Pin Indicator */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-sm z-10"></div>

              {/* Destination Pin Indicator */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-sm z-10"></div>

              {/* ANIMATED VEHICLE TRAVELING FROM FROM TO TO */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 animate-vehicle-travel flex items-center gap-1.5 z-20 cursor-default"
                title={transportMode === 'two-wheeler' ? 'Two-wheeler traveling from origin to destination' : 'Four-wheeler traveling from origin to destination'}
              >
                {transportMode === 'two-wheeler' ? (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] shadow-md border border-emerald-300">
                    <Bike className="w-3.5 h-3.5 animate-bounce" />
                    <span className="hidden sm:inline text-[9px] uppercase tracking-wider">2-Wheeler</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500 text-slate-950 font-bold text-[10px] shadow-md border border-sky-300">
                    <Car className="w-3.5 h-3.5 animate-pulse" />
                    <span className="hidden sm:inline text-[9px] uppercase tracking-wider">4-Wheeler</span>
                  </div>
                )}
              </div>
            </div>

            {/* Subtext description */}
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>
                {transportMode === 'two-wheeler'
                  ? '🛵 Two-wheeler moving from FROM to TO'
                  : '🚗 Four-wheeler car traveling from FROM to TO'}
              </span>
              <span className="text-slate-500">
                {transportMode === 'two-wheeler' ? '0.20m max depth' : '0.40m max depth'}
              </span>
            </div>
          </div>

          {/* Find Route Button */}
          <button
            onClick={handleFindRoute}
            disabled={isSearching}
            id="btn-find-route"
            className="w-full py-2.5 px-4 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
          >
            {isSearching ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating Road Inundation...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Find Route</span>
              </>
            )}
          </button>
        </div>

        {/* Route Comparison Results */}
        {hasCalculated && (
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Available Routes
            </div>

            {/* Standard Route Card (Route A) */}
            <div
              onClick={() => setSelectedRouteType('standard')}
              className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                selectedRouteType === 'standard'
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              id="card-route-standard"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span className="font-bold text-slate-900">{activeRoute.title}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 uppercase">
                  Flood Risk: {activeRoute.floodExposure}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 mb-2 font-medium">
                {activeRoute.name}
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-200/70 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">ETA</div>
                  <div className="font-bold text-slate-900 text-sm">{activeRoute.etaMinutes} min</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">Distance</div>
                  <div className="font-bold text-slate-900 text-sm">{activeRoute.distanceKm} km</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">Affected Segments</div>
                  <div className="font-bold text-red-600 text-sm">{activeRoute.affectedSegmentsCount}</div>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-red-800 bg-red-50/80 p-2 rounded border border-red-200 flex items-start gap-1.5 leading-snug">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Flood risk detected along this route.</strong> Estimated water depth up to 0.45 m on {activeRoute.affectedRoadNames.join(', ')}.
                </span>
              </div>
            </div>

            {/* Alternative Route Card (Lower Predicted Risk) */}
            <div
              onClick={() => setSelectedRouteType('alternative')}
              className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                selectedRouteType === 'alternative'
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              id="card-route-alternative"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="font-bold text-slate-900">{alternativeRoute.title}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  {alternativeRoute.floodExposure}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 mb-2 font-medium">
                {alternativeRoute.name}
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-200/70 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">ETA</div>
                  <div className="font-bold text-slate-900 text-sm">{alternativeRoute.etaMinutes} min</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">Distance</div>
                  <div className="font-bold text-slate-900 text-sm">{alternativeRoute.distanceKm} km</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">Affected Segments</div>
                  <div className="font-bold text-emerald-700 text-sm">{alternativeRoute.affectedSegmentsCount}</div>
                </div>
              </div>

              <p className="mt-2 text-[11px] text-slate-600 leading-snug">
                {alternativeRoute.summaryText}
              </p>

              {/* Use Lower-Risk Route Button as mandated by spec */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRouteType('alternative');
                }}
                id="btn-use-lower-risk-route"
                className="w-full mt-3 py-2 px-3 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Use Lower-Risk Route</span>
              </button>
            </div>

            {/* Mandatory Safety Notice */}
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-600 leading-snug">
              <div className="font-semibold text-slate-800 mb-0.5 flex items-center gap-1">
                <Info className="w-3 h-3 text-slate-500" />
                Civic Advisory Notice
              </div>
              Predictions are probabilistic model estimates. Surface runoff conditions may shift rapidly. Never enter standing water of uncertain depth.
            </div>
          </div>
        )}
      </div>

      {/* Map View showing real road geometry */}
      <div className="relative flex-1 w-full h-full">
        <MapComponent
          layers={{
            floodRisk: true,
            rainfall: false,
            drainage: false,
            canals: true,
            waterlogging: true,
            sensors: false,
            roads: true
          }}
          floodZones={floodZones}
          activeRoute={activeRoute}
          alternativeRoute={alternativeRoute}
          selectedRouteType={selectedRouteType}
          onSelectRouteType={(type) => setSelectedRouteType(type)}
          originName={fromQuery}
          destinationName={toQuery}
          transportMode={transportMode}
          heightClass="h-full"
        />

        {/* Floating Route Status Banner on Map */}
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-3 shadow-md max-w-sm text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${selectedRouteType === 'alternative' ? 'bg-emerald-600' : 'bg-blue-600'}`}></span>
            <span className="font-bold text-slate-900">
              {selectedRouteType === 'alternative' ? 'Lower Predicted Flood-Risk Route Active' : 'Direct Arterial Route Active'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-600">
            {selectedRouteType === 'alternative' ? (
              <span className="text-emerald-800 font-medium">
                Corridor elevated along coastal ridge. Zero impassable flood segments predicted.
              </span>
            ) : (
              <span className="text-red-700 font-medium">
                3 flood-affected segments highlighted in red dashed lines along Velachery Main Rd.
              </span>
            )}
          </div>
        </div>

        {/* Road & Symbols Legend on Map */}
        <div className="absolute bottom-6 right-4 z-10 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-md p-2.5 shadow-sm text-[11px]">
          <div className="font-semibold text-slate-700 mb-1.5">Map &amp; Route Legend</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-700 text-white font-bold text-[9px] shadow-xs">FROM</span>
              <span className="text-slate-700 font-medium">Departure Point ({fromQuery})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded-full bg-red-700 text-white font-bold text-[9px] shadow-xs">TO</span>
              <span className="text-slate-700 font-medium">Destination Point ({toQuery})</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <span className="w-5 h-1 bg-blue-600 rounded"></span>
              <span className="text-slate-600">Route A (Direct Corridor)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-1.5 bg-red-600 border-b border-dashed border-white rounded"></span>
              <span className="text-red-700 font-medium">Flood-Affected Section</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-1 bg-emerald-600 rounded"></span>
              <span className="text-emerald-800 font-medium">Safe Alternative Route</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
