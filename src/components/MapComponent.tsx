import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  FloodRiskZone, 
  DrainageNetworkItem, 
  SensorStation, 
  RouteOption,
  TransportMode
} from '../types';
import { CHENNAI_CENTER, CHENNAI_DEFAULT_ZOOM, CHENNAI_CANALS } from '../data/chennaiData';

export interface MapLayerVisibility {
  floodRisk: boolean;
  rainfall: boolean;
  drainage: boolean;
  canals: boolean;
  waterlogging: boolean;
  sensors: boolean;
  roads: boolean;
}

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  layers: MapLayerVisibility;
  floodZones?: FloodRiskZone[];
  selectedZoneId?: string | null;
  onSelectZone?: (zone: FloodRiskZone) => void;
  
  drainageItems?: DrainageNetworkItem[];
  selectedDrainId?: string | null;
  onSelectDrain?: (drain: DrainageNetworkItem) => void;
  
  sensors?: SensorStation[];
  selectedSensorId?: string | null;
  onSelectSensor?: (sensor: SensorStation) => void;
  
  // Navigation mode
  activeRoute?: RouteOption | null;
  alternativeRoute?: RouteOption | null;
  selectedRouteType?: 'standard' | 'alternative';
  onSelectRouteType?: (type: 'standard' | 'alternative') => void;
  originCoords?: [number, number] | null;
  destinationCoords?: [number, number] | null;
  originName?: string;
  destinationName?: string;
  transportMode?: TransportMode;
  
  // Map click for location selection
  onMapClick?: (lat: number, lng: number) => void;
  heightClass?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  center = CHENNAI_CENTER,
  zoom = CHENNAI_DEFAULT_ZOOM,
  layers,
  floodZones = [],
  selectedZoneId,
  onSelectZone,
  drainageItems = [],
  selectedDrainId,
  onSelectDrain,
  sensors = [],
  onSelectSensor,
  activeRoute,
  alternativeRoute,
  selectedRouteType = 'standard',
  onSelectRouteType,
  originCoords,
  destinationCoords,
  originName,
  destinationName,
  transportMode = 'four-wheeler',
  onMapClick,
  heightClass = 'h-full min-h-[500px]'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet map instance
    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: true
    });

    // Add clean Carto Positron tile layer (classic, minimal civic cartography)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Zoom control at bottom right for clean UI
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Click handler on map
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center or flyTo when selected zone changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (selectedZoneId && floodZones.length > 0) {
      const target = floodZones.find(z => z.id === selectedZoneId);
      if (target) {
        mapInstanceRef.current.flyTo(target.center, 13.5, { duration: 0.8 });
      }
    }
  }, [selectedZoneId, floodZones]);

  // Update center or flyTo when selected drain changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (selectedDrainId && drainageItems.length > 0) {
      const target = drainageItems.find(d => d.id === selectedDrainId);
      if (target && target.path.length > 0) {
        mapInstanceRef.current.flyTo(target.path[0], 14, { duration: 0.8 });
      }
    }
  }, [selectedDrainId, drainageItems]);

  // Render layers and overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    // Clear previous dynamic layers
    layerGroup.clearLayers();

    // 1. Flood Risk Polygons
    if (layers.floodRisk && floodZones.length > 0) {
      floodZones.forEach(zone => {
        let fillColor = '#16a34a'; // Green = Low
        let borderColor = '#15803d';
        
        if (zone.currentRisk === 'MODERATE') {
          fillColor = '#d97706'; // Amber = Moderate
          borderColor = '#b45309';
        } else if (zone.currentRisk === 'HIGH') {
          fillColor = '#ea580c'; // Orange = High
          borderColor = '#c2410c';
        } else if (zone.currentRisk === 'CRITICAL') {
          fillColor = '#dc2626'; // Red = Critical
          borderColor = '#991b1b';
        }

        const isSelected = selectedZoneId === zone.id;

        const polygon = L.polygon(zone.polygon, {
          color: borderColor,
          weight: isSelected ? 3.5 : 2,
          opacity: 0.9,
          fillColor,
          fillOpacity: isSelected ? 0.45 : 0.25,
          dashArray: isSelected ? undefined : '4, 4'
        });

        // Tooltip
        polygon.bindTooltip(`
          <div class="px-2 py-1 font-sans text-xs">
            <div class="font-semibold text-slate-900">${zone.name}</div>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="inline-block w-2 h-2 rounded-full" style="background-color: ${fillColor}"></span>
              <span class="font-medium text-slate-700">${zone.currentRisk} Risk</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">Depth: ${zone.estimatedWaterDepth}</div>
          </div>
        `, { sticky: true, className: 'leaflet-civic-tooltip' });

        polygon.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          if (onSelectZone) onSelectZone(zone);
        });

        polygon.addTo(layerGroup);

        // Center marker with Risk Pill
        const riskIcon = L.divIcon({
          className: 'custom-risk-marker',
          html: `
            <div class="cursor-pointer transition-transform hover:scale-105 select-none" id="marker-zone-${zone.id}">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 rounded-md border text-xs font-semibold shadow-xs ${
                isSelected ? 'ring-2 ring-slate-800 border-slate-900' : 'border-slate-300'
              }">
                <span class="w-2 h-2 rounded-full" style="background-color: ${fillColor}"></span>
                <span class="text-slate-800 tracking-tight">${zone.name}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded text-white font-bold" style="background-color: ${fillColor}">${zone.currentRisk}</span>
              </div>
            </div>
          `,
          iconSize: [120, 28],
          iconAnchor: [60, 14]
        });

        const marker = L.marker(zone.center, { icon: riskIcon });
        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          if (onSelectZone) onSelectZone(zone);
        });
        marker.addTo(layerGroup);
      });
    }

    // 2. Rainfall Overlay Contours (Semi-transparent radar bands)
    if (layers.rainfall) {
      const rainZones: { center: [number, number]; radius: number; mm: number }[] = [
        { center: [12.9654, 80.2428], radius: 3500, mm: 48 }, // Perungudi
        { center: [12.9815, 80.2180], radius: 3200, mm: 42 }, // Velachery
        { center: [12.9180, 80.0880], radius: 4000, mm: 46 }, // Mudichur
        { center: [13.0418, 80.2341], radius: 2500, mm: 28 }, // T. Nagar
      ];

      rainZones.forEach(rz => {
        L.circle(rz.center, {
          radius: rz.radius,
          color: '#0284c7',
          weight: 1,
          opacity: 0.4,
          fillColor: '#38bdf8',
          fillOpacity: 0.15,
          dashArray: '5, 5'
        }).bindTooltip(`Precipitation Band: ${rz.mm} mm/hr`, { sticky: true }).addTo(layerGroup);
      });
    }

    // 3. Canals & Major Waterways
    if (layers.canals) {
      CHENNAI_CANALS.forEach(canal => {
        const canalColor = canal.status === 'Spilling' ? '#dc2626' : 
                           canal.status === 'Near Bankful' ? '#ea580c' : 
                           canal.status === 'Warning' ? '#0284c7' : '#0369a1';
        
        const polyline = L.polyline(canal.path, {
          color: canalColor,
          weight: 5,
          opacity: 0.85,
          lineJoin: 'round'
        });

        polyline.bindTooltip(`
          <div class="px-2 py-1 font-sans text-xs">
            <div class="font-semibold text-slate-900">${canal.name}</div>
            <div class="text-[11px] text-slate-600">Level: ${canal.waterLevelCurrentM}m / ${canal.capacityLevelM}m</div>
            <div class="text-[10px] font-medium text-slate-500 mt-0.5">Status: ${canal.status} (${canal.flowDirection})</div>
          </div>
        `, { sticky: true });

        polyline.addTo(layerGroup);
      });
    }

    // 4. Drainage Network
    if (layers.drainage && drainageItems.length > 0) {
      drainageItems.forEach(drain => {
        const isSelected = selectedDrainId === drain.id;
        let drainColor = '#2563eb'; // normal blue
        let dashPattern = undefined;

        if (drain.status === 'CONNECTIVITY BLOCKED') {
          drainColor = '#dc2626'; // red
          dashPattern = '6, 4';
        } else if (drain.status === 'DISCONNECTED') {
          drainColor = '#ea580c'; // orange / red dashed
          dashPattern = '6, 4';
        } else if (drain.status === 'NETWORK INFORMATION INCOMPLETE') {
          drainColor = '#64748b'; // grey dashed line
          dashPattern = '4, 4';
        }

        const polyline = L.polyline(drain.path, {
          color: drainColor,
          weight: isSelected ? 5 : 3.5,
          opacity: 0.9,
          dashArray: dashPattern
        });

        polyline.bindTooltip(`
          <div class="px-2 py-1 font-sans text-xs">
            <div class="font-semibold text-slate-900">${drain.code} - ${drain.name}</div>
            <div class="text-[11px] text-slate-600">Status: <span class="font-medium">${drain.status}</span></div>
            <div class="text-[10px] text-slate-500">Ward: ${drain.ward}</div>
          </div>
        `, { sticky: true });

        polyline.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          if (onSelectDrain) onSelectDrain(drain);
        });

        polyline.addTo(layerGroup);

        // Add Red X marker if blocked connection point exists
        if (drain.blockedPoint && (drain.status === 'CONNECTIVITY BLOCKED' || drain.status === 'DISCONNECTED')) {
          const blockedIcon = L.divIcon({
            className: 'blocked-x-marker',
            html: `
              <div class="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white ring-1 ring-red-700 animate-pulse" title="Connection Blocked / Disconnected">
                ✕
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const blockedMarker = L.marker(drain.blockedPoint, { icon: blockedIcon });
          blockedMarker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            if (onSelectDrain) onSelectDrain(drain);
          });
          blockedMarker.addTo(layerGroup);
        }
      });
    }

    // 5. IoT Sensors
    if (layers.sensors && sensors.length > 0) {
      sensors.forEach(sensor => {
        const isWarning = sensor.currentLevelM >= sensor.warningThresholdM;
        const sensorColor = isWarning ? '#ea580c' : '#0284c7';

        const sensorIcon = L.divIcon({
          className: 'custom-sensor-icon',
          html: `
            <div class="flex flex-col items-center cursor-pointer select-none">
              <div class="w-5 h-5 rounded-full ${isWarning ? 'bg-amber-500' : 'bg-blue-600'} text-white flex items-center justify-center shadow-xs border border-white text-[10px] font-bold">
                ▲
              </div>
              <div class="bg-white/95 px-1.5 py-0.5 rounded text-[9px] font-semibold border border-slate-200 shadow-2xs mt-0.5 whitespace-nowrap text-slate-800">
                ${sensor.currentLevelM}m
              </div>
            </div>
          `,
          iconSize: [50, 40],
          iconAnchor: [25, 20]
        });

        const marker = L.marker(sensor.coordinates, { icon: sensorIcon });
        marker.bindTooltip(`
          <div class="px-2 py-1 text-xs">
            <div class="font-semibold text-slate-900">${sensor.name}</div>
            <div class="text-slate-600">Level: ${sensor.currentLevelM} m (Warn: ${sensor.warningThresholdM}m)</div>
            <div class="text-[10px] text-slate-500">Status: ${sensor.telemetryStatus} • ${sensor.lastPing}</div>
          </div>
        `, { sticky: true });

        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          if (onSelectSensor) onSelectSensor(sensor);
        });

        marker.addTo(layerGroup);
      });
    }

    // 6. Navigation Routes (when in Navigator mode)
    if (activeRoute) {
      // Standard Route Line (Normal segments in blue)
      const isStdSelected = selectedRouteType === 'standard';
      const stdPolyline = L.polyline(activeRoute.path, {
        color: isStdSelected ? '#2563eb' : '#94a3b8',
        weight: isStdSelected ? 6 : 4,
        opacity: isStdSelected ? 0.9 : 0.6,
        lineCap: 'round',
        lineJoin: 'round'
      });

      stdPolyline.bindTooltip(`Route A (${activeRoute.name}) - ${activeRoute.etaMinutes} min`, { sticky: true });
      stdPolyline.on('click', () => {
        if (onSelectRouteType) onSelectRouteType('standard');
      });
      stdPolyline.addTo(layerGroup);

      // Highlight Flood-Affected Segments on Route A in Red / Orange
      if (activeRoute.floodAffectedSegments && activeRoute.floodAffectedSegments.length > 0) {
        activeRoute.floodAffectedSegments.forEach(seg => {
          L.polyline(seg, {
            color: '#dc2626', // Red warning segment
            weight: isStdSelected ? 8 : 5,
            opacity: 1,
            dashArray: '8, 6'
          }).bindTooltip('Flood-affected segment: Standing water detected/forecasted', { sticky: true }).addTo(layerGroup);
        });
      }

      // Alternative Lower-Risk Route (in Green / Teal)
      if (alternativeRoute) {
        const isAltSelected = selectedRouteType === 'alternative';
        const altPolyline = L.polyline(alternativeRoute.path, {
          color: isAltSelected ? '#059669' : '#10b981',
          weight: isAltSelected ? 6 : 4,
          opacity: isAltSelected ? 0.95 : 0.65,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: isAltSelected ? undefined : '6, 6'
        });

        altPolyline.bindTooltip(`Alternative Route (Lower Predicted Risk) - ${alternativeRoute.etaMinutes} min`, { sticky: true });
        altPolyline.on('click', () => {
          if (onSelectRouteType) onSelectRouteType('alternative');
        });
        altPolyline.addTo(layerGroup);
      }

      // Helper to generate a prominent "FROM" Symbol pin
      const createFromSymbolIcon = (label?: string) => {
        return L.divIcon({
          className: 'nav-from-symbol-pin',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
              <div style="background: #047857; color: #ffffff; border: 2px solid #ffffff; border-radius: 9999px; padding: 4px 10px; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.25); white-space: nowrap;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background: #6ee7b7; box-shadow: 0 0 0 2px #047857;"></span>
                <span style="letter-spacing: 0.5px;">FROM</span>
                ${label ? `<span style="font-size: 10px; font-weight: 600; opacity: 0.95; max-width: 100px; overflow: hidden; text-overflow: ellipsis; border-left: 1px solid rgba(255,255,255,0.4); padding-left: 6px;">${label}</span>` : ''}
              </div>
              <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #047857; margin-top: -1px;"></div>
              <div style="width: 8px; height: 8px; border-radius: 9999px; background: #047857; border: 2px solid #ffffff; margin-top: -3px;"></div>
            </div>
          `,
          iconSize: [140, 42],
          iconAnchor: [70, 42]
        });
      };

      // Helper to generate a prominent "TO" Symbol pin
      const createToSymbolIcon = (label?: string) => {
        return L.divIcon({
          className: 'nav-to-symbol-pin',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
              <div style="background: #b91c1c; color: #ffffff; border: 2px solid #ffffff; border-radius: 9999px; padding: 4px 10px; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.25); white-space: nowrap;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background: #fca5a5; box-shadow: 0 0 0 2px #b91c1c;"></span>
                <span style="letter-spacing: 0.5px;">TO</span>
                ${label ? `<span style="font-size: 10px; font-weight: 600; opacity: 0.95; max-width: 110px; overflow: hidden; text-overflow: ellipsis; border-left: 1px solid rgba(255,255,255,0.4); padding-left: 6px;">${label}</span>` : ''}
              </div>
              <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #b91c1c; margin-top: -1px;"></div>
              <div style="width: 8px; height: 8px; border-radius: 9999px; background: #b91c1c; border: 2px solid #ffffff; margin-top: -3px;"></div>
            </div>
          `,
          iconSize: [150, 42],
          iconAnchor: [75, 42]
        });
      };

      // 1. Prominent FROM Marker Symbol
      if (activeRoute.path.length > 0) {
        const startPoint = originCoords || activeRoute.path[0];
        const startMarker = L.marker(startPoint, { 
          icon: createFromSymbolIcon(originName || activeRoute.name.split('to')[0]?.trim()), 
          zIndexOffset: 1000 
        });
        startMarker.bindTooltip(`<strong>FROM (Origin):</strong> ${originName || 'Starting Departure Point'}`, { sticky: true });
        startMarker.addTo(layerGroup);

        // 2. Prominent TO Marker Symbol
        const endPoint = destinationCoords || activeRoute.path[activeRoute.path.length - 1];
        const endMarker = L.marker(endPoint, { 
          icon: createToSymbolIcon(destinationName || activeRoute.name.split('to')[1]?.trim()), 
          zIndexOffset: 1000 
        });
        endMarker.bindTooltip(`<strong>TO (Destination):</strong> ${destinationName || 'Arrival Target Point'}`, { sticky: true });
        endMarker.addTo(layerGroup);

        // 3. In-Transit Traveling Vehicle Marker on Route Path
        const chosenPath = (selectedRouteType === 'alternative' && alternativeRoute) 
          ? alternativeRoute.path 
          : activeRoute.path;
        if (chosenPath.length > 2) {
          const midIdx = Math.floor(chosenPath.length * 0.45);
          const vehiclePoint = chosenPath[midIdx];
          const isCar = transportMode !== 'two-wheeler';

          const vehicleIcon = L.divIcon({
            className: 'nav-vehicle-pin',
            html: `
              <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; filter: drop-shadow(0 3px 5px rgba(0,0,0,0.3));">
                <div style="background: #0f172a; color: #ffffff; border: 2px solid #38bdf8; border-radius: 9999px; padding: 3px 8px; font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 4px; white-space: nowrap;">
                  <span>${isCar ? '🚗' : '🏍️'}</span>
                  <span>${isCar ? 'Car En Route' : 'Bike En Route'}</span>
                </div>
                <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid #0f172a; margin-top: -1px;"></div>
              </div>
            `,
            iconSize: [110, 36],
            iconAnchor: [55, 36]
          });
          const vehicleMarker = L.marker(vehiclePoint, { icon: vehicleIcon, zIndexOffset: 950 });
          vehicleMarker.bindTooltip(`<strong>Transit Mode:</strong> ${isCar ? 'Four-Wheeler (Car)' : 'Two-Wheeler (Motorbike)'} en route from FROM to TO`, { sticky: true });
          vehicleMarker.addTo(layerGroup);
        }

        // Fit map bounds to route
        const bounds = L.latLngBounds(activeRoute.path);
        if (alternativeRoute) {
          alternativeRoute.path.forEach(pt => bounds.extend(pt));
        }
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }

    // Origin / Destination explicit markers if given
    if (originCoords && !activeRoute) {
      const startIcon = L.divIcon({
        className: 'nav-from-symbol-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
            <div style="background: #047857; color: #ffffff; border: 2px solid #ffffff; border-radius: 9999px; padding: 4px 10px; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.25); white-space: nowrap;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background: #6ee7b7; box-shadow: 0 0 0 2px #047857;"></span>
              <span style="letter-spacing: 0.5px;">FROM</span>
              ${originName ? `<span style="font-size: 10px; font-weight: 600; opacity: 0.95; max-width: 100px; overflow: hidden; text-overflow: ellipsis; border-left: 1px solid rgba(255,255,255,0.4); padding-left: 6px;">${originName}</span>` : ''}
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #047857; margin-top: -1px;"></div>
            <div style="width: 8px; height: 8px; border-radius: 9999px; background: #047857; border: 2px solid #ffffff; margin-top: -3px;"></div>
          </div>
        `,
        iconSize: [140, 42],
        iconAnchor: [70, 42]
      });
      const originMarker = L.marker(originCoords, { icon: startIcon, zIndexOffset: 1000 });
      originMarker.bindTooltip(`<strong>FROM (Origin):</strong> ${originName || 'Departure'}`, { sticky: true });
      originMarker.addTo(layerGroup);
    }

    if (destinationCoords && !activeRoute) {
      const destIcon = L.divIcon({
        className: 'nav-to-symbol-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
            <div style="background: #b91c1c; color: #ffffff; border: 2px solid #ffffff; border-radius: 9999px; padding: 4px 10px; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.25); white-space: nowrap;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background: #fca5a5; box-shadow: 0 0 0 2px #b91c1c;"></span>
              <span style="letter-spacing: 0.5px;">TO</span>
              ${destinationName ? `<span style="font-size: 10px; font-weight: 600; opacity: 0.95; max-width: 110px; overflow: hidden; text-overflow: ellipsis; border-left: 1px solid rgba(255,255,255,0.4); padding-left: 6px;">${destinationName}</span>` : ''}
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #b91c1c; margin-top: -1px;"></div>
            <div style="width: 8px; height: 8px; border-radius: 9999px; background: #b91c1c; border: 2px solid #ffffff; margin-top: -3px;"></div>
          </div>
        `,
        iconSize: [150, 42],
        iconAnchor: [75, 42]
      });
      const destMarker = L.marker(destinationCoords, { icon: destIcon, zIndexOffset: 1000 });
      destMarker.bindTooltip(`<strong>TO (Destination):</strong> ${destinationName || 'Destination'}`, { sticky: true });
      destMarker.addTo(layerGroup);
    }

  }, [
    layers, 
    floodZones, 
    selectedZoneId, 
    drainageItems, 
    selectedDrainId, 
    sensors, 
    activeRoute, 
    alternativeRoute, 
    selectedRouteType, 
    originCoords, 
    destinationCoords
  ]);

  return (
    <div className={`relative w-full ${heightClass} bg-slate-100 overflow-hidden`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" id="chennai-interactive-map" />
    </div>
  );
};
