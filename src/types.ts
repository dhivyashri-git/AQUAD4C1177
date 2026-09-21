export type AppView = 
  | 'landing'
  | 'login'
  | 'flood-prediction'
  | 'navigator'
  | 'drain-connectivity'
  | 'weather'
  | 'reports'
  | 'workers'
  | 'admin-workers';

export type UserRole = 'citizen' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation?: string;
  ward?: string;
  division?: string;
}

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type DataSourceType = 
  | 'LIVE DATA'
  | 'STATIC GIS'
  | 'HISTORICAL DATA'
  | 'SENSOR DATA'
  | 'MODEL ESTIMATE';

export interface TimelineStep {
  label: string; // 'NOW' | '+30 MIN' | '+1 HR' | '+2 HR' | '+3 HR'
  timeStr: string;
  risk: RiskLevel;
  waterDepth: string;
  rainfallRate: string;
  confidence: number;
}

export interface FloodRiskZone {
  id: string;
  name: string;
  zoneNumber: number;
  ward: string;
  currentRisk: RiskLevel;
  expectedWindow: string; // e.g. "Next 1–2 hours"
  estimatedWaterDepth: string; // e.g. "0.25–0.45 m"
  rainfallRate: string; // e.g. "42 mm/hr"
  confidence: number; // e.g. 78
  dataSource: DataSourceType;
  lastUpdated: string;
  center: [number, number]; // [lat, lng]
  polygon: [number, number][]; // boundary coordinates
  timeline: TimelineStep[];
  affectedRoads: string[];
  keyVulnerabilities: string;
  recommendedAction: string;
}

export type TransportMode = 'two-wheeler' | 'four-wheeler';

export interface RouteOption {
  id: string;
  name: string;
  type: 'standard' | 'alternative';
  title: string;
  etaMinutes: number;
  distanceKm: number;
  floodExposure: 'HIGH' | 'MODERATE' | 'LOWER PREDICTED RISK';
  affectedSegmentsCount: number;
  affectedRoadNames: string[];
  path: [number, number][];
  floodAffectedSegments: [number, number][][];
  summaryText: string;
}

export type ConnectivityStatus = 
  | 'CONNECTED'
  | 'CONNECTIVITY BLOCKED'
  | 'DISCONNECTED'
  | 'NETWORK INFORMATION INCOMPLETE';

export interface DrainageNetworkItem {
  id: string;
  code: string; // e.g. "DRAIN D-104"
  name: string;
  type: 'storm-water' | 'main-drain' | 'canal' | 'outlet';
  status: ConnectivityStatus;
  area: string;
  ward: string;
  capacityCusecs: number;
  currentFlowPercentage: number;
  lastVerified: string;
  path: [number, number][];
  blockedPoint?: [number, number];
  downstreamConnection: string; // e.g. "Not detected" or "Buckingham Canal"
  possibleImpact: string;
  networkHierarchy: {
    street: string;
    localDrain: string;
    mainDrain: string;
    canal: string;
    isBlockedAtMainDrainToCanal?: boolean;
    isBlockedAtLocalDrain?: boolean;
  };
  technicalDetails?: {
    channelWidth: string;
    gradient: string;
    sedimentSiltLevel: string;
    lastDesilted: string;
    pumpingStationSupport?: string;
  };
  assignedWorkerCrew?: string;
  assignedTaskId?: string;
  workStatus?: 'NORMAL' | 'WORKERS_ASSIGNED' | 'IN_PROGRESS' | 'RESTORED';
}

export interface HourlyWeather {
  timeStr: string; // e.g. "12 PM"
  tempC: number;
  rainProbability: number; // percentage
  rainfallMm: number;
  condition: string;
  windKmh: number;
}

export interface FloodOccurrenceAssumption {
  floodMayOccur: boolean;
  probabilityLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  assumptionHeadline: string; // e.g. "Flood May Occur on this Day: Heavy Runoff in Low-Lying Catchments"
  rationale: string; // Hydrological explanation
  vulnerableZones: string[];
  workerStandbyLevel: 'Level 1: Routine Standby' | 'Level 2: High Alert Standby' | 'Level 3: Full Emergency Mobilization';
  assignedWorkersCount: number;
  recommendedCivicPrecaution: string;
}

export interface DailyWeather {
  dateStr: string; // e.g. "Mon, 22 Sep"
  condition: string;
  tempMinC: number;
  tempMaxC: number;
  rainProbability: number;
  expectedRainfallMm: string;
  floodAssumption: FloodOccurrenceAssumption;
}

export interface WeatherData {
  location: string;
  temperatureC: number;
  feelsLikeC: number;
  rainfallCurrentMmHr: number;
  humidityPercent: number;
  windKmh: number;
  windDirection: string;
  rainProbabilityPercent: number;
  barometricPressureHpa: number;
  lastUpdated: string;
  next6Hours: HourlyWeather[];
  fiveDayForecast: DailyWeather[];
  floodConnection: {
    rainForecastSummary: string;
    potentialImpact: 'LOWER FLOOD RISK' | 'MODERATE FLOOD RISK' | 'HIGHER FLOOD RISK';
    rainfallRateDesc: string;
    drainageLoadDesc: string;
    floodRiskDesc: string;
    catchmentsAtRisk: string[];
  };
}

export interface SensorStation {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  sensorType: 'Ultrasonic Water Level' | 'Radar Velocity' | 'Rain Gauge' | 'In-line Flow';
  currentLevelM: number;
  warningThresholdM: number;
  dangerThresholdM: number;
  batteryStatus: string;
  telemetryStatus: 'ONLINE' | 'STANDBY' | 'MAINTENANCE';
  lastPing: string;
}

export interface CivicReport {
  id: string;
  title: string;
  category: 'Waterlogging' | 'Blocked Drain' | 'Canal Siltation' | 'Manhole Overflow';
  location: string;
  ward: string;
  reportedAt: string;
  status: 'Investigating' | 'Dispatched' | 'Cleared';
  priority: 'High' | 'Medium' | 'Critical';
  reporterType: 'Citizen' | 'GCC Field Inspector' | 'Automated Sensor Alert';
}

// Workers & Field Operations Models
export interface WorkerCrew {
  id: string;
  crewName: string;
  unitCode: string; // e.g. "GCC-UNIT-04"
  supervisor: string;
  phone: string;
  memberCount: number;
  vehicleAssigned: string; // e.g. "Super Sucker De-silting Unit TN-01-G-4421"
  specialization: 'Canal Desilting' | 'Emergency Dewatering' | 'Culvert Linkage & Bypass' | 'Sluice Gate Operation';
  currentStatus: 'On Duty - Dispatched' | 'Standby at Depo' | 'Active On Site' | 'Resting';
  assignedWard: string;
}

export interface WorkerTask {
  id: string;
  crewId: string;
  crewName: string;
  supervisor: string;
  drainCode?: string; // e.g. "DRAIN D-104"
  area: string;
  ward: string;
  workType: 'Clear Blockage & Restore Connectivity' | 'Emergency Dewatering 100HP Pump' | 'Culvert Bypass Trenching' | 'Siltation Removal';
  status: 'Assigned' | 'In Progress' | 'Completed - Connected' | 'Scheduled';
  assignedDate: string; // e.g. "Today, 10:15 AM"
  targetCompletion: string;
  weatherAssumptionLink: string; // Link to weather flood occurrence assumption, e.g. "Assigned due to Heavy Rain Prediction (Day 1 Flood Alert)"
  equipmentUsed: string;
  notes: string;
  connectivityRestored: boolean;
}
