import { 
  FloodRiskZone, 
  DrainageNetworkItem, 
  WeatherData, 
  SensorStation, 
  CivicReport,
  RouteOption,
  WorkerCrew,
  WorkerTask
} from '../types';

// Chennai center coordinates [lat, lng]
export const CHENNAI_CENTER: [number, number] = [13.0475, 80.2185];
export const CHENNAI_DEFAULT_ZOOM = 12;

// Standard Chennai Locations for Navigation & Search
export interface ChennaiLocation {
  id: string;
  name: string;
  neighborhood: string;
  coords: [number, number];
  type: 'Transit Hub' | 'Residential' | 'IT Corridor' | 'Commercial' | 'Civic Office';
}

export const CHENNAI_LOCATIONS: ChennaiLocation[] = [
  { id: 'loc-1', name: 'Chennai Central Railway Station', neighborhood: 'Park Town', coords: [13.0827, 80.2754], type: 'Transit Hub' },
  { id: 'loc-2', name: 'Ripon Building (GCC HQ)', neighborhood: 'Periyamet', coords: [13.0839, 80.2728], type: 'Civic Office' },
  { id: 'loc-3', name: 'T. Nagar Bus Terminus', neighborhood: 'T. Nagar', coords: [13.0418, 80.2341], type: 'Commercial' },
  { id: 'loc-4', name: 'Velachery MRTS Station', neighborhood: 'Velachery', coords: [12.9815, 80.2180], type: 'Transit Hub' },
  { id: 'loc-5', name: 'Guindy Kathipara Junction', neighborhood: 'Guindy', coords: [13.0067, 80.2025], type: 'Transit Hub' },
  { id: 'loc-6', name: 'OMR Thoraipakkam Junction', neighborhood: 'Thoraipakkam', coords: [12.9372, 80.2372], type: 'IT Corridor' },
  { id: 'loc-7', name: 'Saidapet Metro / Bridge', neighborhood: 'Saidapet', coords: [13.0213, 80.2231], type: 'Commercial' },
  { id: 'loc-8', name: 'Madipakkam Koot Road', neighborhood: 'Madipakkam', coords: [12.9647, 80.1989], type: 'Residential' },
  { id: 'loc-9', name: 'Perungudi Toll Plaza', neighborhood: 'Perungudi', coords: [12.9654, 80.2428], type: 'IT Corridor' },
  { id: 'loc-10', name: 'Semmancheri Signal', neighborhood: 'Semmancheri', coords: [12.8712, 80.2241], type: 'Residential' },
  { id: 'loc-11', name: 'Koyambedu CMBT', neighborhood: 'Koyambedu', coords: [13.0694, 80.1948], type: 'Transit Hub' },
  { id: 'loc-12', name: 'Adyar Signal (L.B. Road)', neighborhood: 'Adyar', coords: [13.0064, 80.2575], type: 'Commercial' },
  { id: 'loc-13', name: 'Tambaram Railway Station', neighborhood: 'Tambaram', coords: [12.9249, 80.1278], type: 'Transit Hub' },
];

// Flood Risk Zones across Chennai
export const CHENNAI_FLOOD_ZONES: FloodRiskZone[] = [
  {
    id: 'zone-velachery',
    name: 'Velachery',
    zoneNumber: 13,
    ward: 'Ward 177 / 178',
    currentRisk: 'HIGH',
    expectedWindow: 'Next 1–2 hours',
    estimatedWaterDepth: '0.25–0.45 m',
    rainfallRate: '42 mm/hr',
    confidence: 78,
    dataSource: 'MODEL ESTIMATE',
    lastUpdated: '10:42 AM',
    center: [12.9815, 80.2180],
    polygon: [
      [12.9930, 80.2100],
      [12.9910, 80.2320],
      [12.9730, 80.2310],
      [12.9670, 80.2150],
      [12.9740, 80.2030],
    ],
    timeline: [
      { label: 'NOW', timeStr: '10:42 AM', risk: 'LOW', waterDepth: '0.05–0.10 m', rainfallRate: '18 mm/hr', confidence: 92 },
      { label: '+30 MIN', timeStr: '11:12 AM', risk: 'MODERATE', waterDepth: '0.15–0.25 m', rainfallRate: '32 mm/hr', confidence: 86 },
      { label: '+1 HR', timeStr: '11:42 AM', risk: 'HIGH', waterDepth: '0.25–0.45 m', rainfallRate: '42 mm/hr', confidence: 78 },
      { label: '+2 HR', timeStr: '12:42 PM', risk: 'CRITICAL', waterDepth: '0.45–0.65 m', rainfallRate: '54 mm/hr', confidence: 74 },
      { label: '+3 HR', timeStr: '01:42 PM', risk: 'HIGH', waterDepth: '0.35–0.50 m', rainfallRate: '28 mm/hr', confidence: 70 },
    ],
    affectedRoads: ['Velachery Main Road', '100 Feet Bypass Road', 'Vijayanagar Bus Stand Junction', 'Tansi Nagar 5th Street'],
    keyVulnerabilities: 'Depressed lake catchment buffer, delayed run-off towards Pallikaranai marsh due to culvert constriction.',
    recommendedAction: 'Deploy mobile diesel dewatering pumps at Vijayanagar underpass; divert low-clearance vehicles.'
  },
  {
    id: 'zone-madipakkam',
    name: 'Madipakkam & Balaiah Nagar',
    zoneNumber: 14,
    ward: 'Ward 187',
    currentRisk: 'HIGH',
    expectedWindow: 'Next 45–90 min',
    estimatedWaterDepth: '0.30–0.55 m',
    rainfallRate: '39 mm/hr',
    confidence: 82,
    dataSource: 'MODEL ESTIMATE',
    lastUpdated: '10:42 AM',
    center: [12.9647, 80.1989],
    polygon: [
      [12.9750, 80.1900],
      [12.9730, 80.2090],
      [12.9550, 80.2080],
      [12.9520, 80.1920],
      [12.9630, 80.1850],
    ],
    timeline: [
      { label: 'NOW', timeStr: '10:42 AM', risk: 'MODERATE', waterDepth: '0.15–0.25 m', rainfallRate: '24 mm/hr', confidence: 89 },
      { label: '+30 MIN', timeStr: '11:12 AM', risk: 'HIGH', waterDepth: '0.25–0.40 m', rainfallRate: '36 mm/hr', confidence: 84 },
      { label: '+1 HR', timeStr: '11:42 AM', risk: 'HIGH', waterDepth: '0.30–0.55 m', rainfallRate: '39 mm/hr', confidence: 82 },
      { label: '+2 HR', timeStr: '12:42 PM', risk: 'HIGH', waterDepth: '0.35–0.50 m', rainfallRate: '30 mm/hr', confidence: 76 },
      { label: '+3 HR', timeStr: '01:42 PM', risk: 'MODERATE', waterDepth: '0.20–0.30 m', rainfallRate: '20 mm/hr', confidence: 72 },
    ],
    affectedRoads: ['Madipakkam Main Road', 'Balaiah Nagar Link Road', 'Koot Road Junction'],
    keyVulnerabilities: 'Lack of macro-drain link to South Buckingham Canal; stormwater back-propagation from surplus channels.',
    recommendedAction: 'Activate GCC Ward 187 quick-response team; monitor Veerangal Odai confluence.'
  },
  {
    id: 'zone-perungudi',
    name: 'Perungudi & Kandanchavadi',
    zoneNumber: 14,
    ward: 'Ward 184',
    currentRisk: 'CRITICAL',
    expectedWindow: 'Immediate (Next 30 min)',
    estimatedWaterDepth: '0.40–0.65 m',
    rainfallRate: '48 mm/hr',
    confidence: 85,
    dataSource: 'SENSOR DATA',
    lastUpdated: '10:42 AM',
    center: [12.9654, 80.2428],
    polygon: [
      [12.9780, 80.2360],
      [12.9760, 80.2540],
      [12.9550, 80.2510],
      [12.9530, 80.2370],
    ],
    timeline: [
      { label: 'NOW', timeStr: '10:42 AM', risk: 'HIGH', waterDepth: '0.30–0.45 m', rainfallRate: '38 mm/hr', confidence: 91 },
      { label: '+30 MIN', timeStr: '11:12 AM', risk: 'CRITICAL', waterDepth: '0.40–0.65 m', rainfallRate: '48 mm/hr', confidence: 85 },
      { label: '+1 HR', timeStr: '11:42 AM', risk: 'CRITICAL', waterDepth: '0.50–0.70 m', rainfallRate: '50 mm/hr', confidence: 83 },
      { label: '+2 HR', timeStr: '12:42 PM', risk: 'HIGH', waterDepth: '0.35–0.50 m', rainfallRate: '32 mm/hr', confidence: 79 },
      { label: '+3 HR', timeStr: '01:42 PM', risk: 'MODERATE', waterDepth: '0.20–0.30 m', rainfallRate: '15 mm/hr', confidence: 75 },
    ],
    affectedRoads: ['OMR Service Lanes', 'Kallukuttai Access Road', 'Seevaram 1st Main Rd'],
    keyVulnerabilities: 'Disconnected culvert segment D-104 towards Buckingham Canal causing storm-water ponding.',
    recommendedAction: 'Emergency bypass trench opened at Ch. 3+200; civic barriers placed at service road.'
  },
  {
    id: 'zone-tnagar',
    name: 'T. Nagar (G.N. Chetty Road)',
    zoneNumber: 10,
    ward: 'Ward 136',
    currentRisk: 'MODERATE',
    expectedWindow: 'Next 2–3 hours',
    estimatedWaterDepth: '0.15–0.30 m',
    rainfallRate: '28 mm/hr',
    confidence: 80,
    dataSource: 'LIVE DATA',
    lastUpdated: '10:42 AM',
    center: [13.0418, 80.2341],
    polygon: [
      [13.0490, 80.2260],
      [13.0480, 80.2450],
      [13.0330, 80.2430],
      [13.0340, 80.2250],
    ],
    timeline: [
      { label: 'NOW', timeStr: '10:42 AM', risk: 'LOW', waterDepth: '0.05–0.10 m', rainfallRate: '14 mm/hr', confidence: 93 },
      { label: '+30 MIN', timeStr: '11:12 AM', risk: 'LOW', waterDepth: '0.10–0.15 m', rainfallRate: '20 mm/hr', confidence: 88 },
      { label: '+1 HR', timeStr: '11:42 AM', risk: 'MODERATE', waterDepth: '0.15–0.25 m', rainfallRate: '28 mm/hr', confidence: 83 },
      { label: '+2 HR', timeStr: '12:42 PM', risk: 'MODERATE', waterDepth: '0.20–0.30 m', rainfallRate: '32 mm/hr', confidence: 80 },
      { label: '+3 HR', timeStr: '01:42 PM', risk: 'LOW', waterDepth: '0.10–0.15 m', rainfallRate: '12 mm/hr', confidence: 77 },
    ],
    affectedRoads: ['G.N. Chetty Road', 'Bazullah Road', 'Usman Road Underpass'],
    keyVulnerabilities: 'Mambalam Canal capacity bottleneck during peak tides; micro-siltation at road grating.',
    recommendedAction: 'Automated flood gates at Mambalam Canal monitoring station active.'
  },
  {
    id: 'zone-semmancheri',
    name: 'Semmancheri & Sholinganallur',
    zoneNumber: 15,
    ward: 'Ward 197',
    currentRisk: 'HIGH',
    expectedWindow: 'Next 1 hour',
    estimatedWaterDepth: '0.35–0.50 m',
    rainfallRate: '41 mm/hr',
    confidence: 81,
    dataSource: 'MODEL ESTIMATE',
    lastUpdated: '10:42 AM',
    center: [12.8712, 80.2241],
    polygon: [
      [12.8850, 80.2150],
      [12.8830, 80.2360],
      [12.8600, 80.2330],
      [12.8610, 80.2130],
    ],
    timeline: [
      { label: 'NOW', timeStr: '10:42 AM', risk: 'MODERATE', waterDepth: '0.15–0.25 m', rainfallRate: '22 mm/hr', confidence: 90 },
      { label: '+30 MIN', timeStr: '11:12 AM', risk: 'HIGH', waterDepth: '0.25–0.40 m', rainfallRate: '34 mm/hr', confidence: 85 },
      { label: '+1 HR', timeStr: '11:42 AM', risk: 'HIGH', waterDepth: '0.35–0.50 m', rainfallRate: '41 mm/hr', confidence: 81 },
      { label: '+2 HR', timeStr: '12:42 PM', risk: 'CRITICAL', waterDepth: '0.45–0.60 m', rainfallRate: '46 mm/hr', confidence: 76 },
      { label: '+3 HR', timeStr: '01:42 PM', risk: 'HIGH', waterDepth: '0.30–0.45 m', rainfallRate: '24 mm/hr', confidence: 71 },
    ],
    affectedRoads: ['OMR Link Road', 'Semmancheri Housing Board Arterial', 'Ezhil Nagar Cut'],
    keyVulnerabilities: 'Marshland edge topography, unlined secondary drainage channel near Buckingham canal.',
    recommendedAction: 'High capacity tractor pumps positioned along canal berm.'
  },
  {
    id: 'zone-mudichur',
    name: 'Mudichur & Varadharajapuram',
    zoneNumber: 12,
    ward: 'Outer South GCC / Tambaram',
    currentRisk: 'CRITICAL',
    expectedWindow: 'Immediate (Active)',
    estimatedWaterDepth: '0.50–0.80 m',
    rainfallRate: '46 mm/hr',
    confidence: 87,
    dataSource: 'SENSOR DATA',
    lastUpdated: '10:42 AM',
    center: [12.9180, 80.0880],
    polygon: [
      [12.9320, 80.0760],
      [12.9300, 80.1020],
      [12.9050, 80.0980],
      [12.9040, 80.0740],
    ],
    timeline: [
      { label: 'NOW', timeStr: '10:42 AM', risk: 'CRITICAL', waterDepth: '0.50–0.80 m', rainfallRate: '46 mm/hr', confidence: 87 },
      { label: '+30 MIN', timeStr: '11:12 AM', risk: 'CRITICAL', waterDepth: '0.60–0.90 m', rainfallRate: '52 mm/hr', confidence: 84 },
      { label: '+1 HR', timeStr: '11:42 AM', risk: 'CRITICAL', waterDepth: '0.65–0.95 m', rainfallRate: '50 mm/hr', confidence: 80 },
      { label: '+2 HR', timeStr: '12:42 PM', risk: 'HIGH', waterDepth: '0.45–0.70 m', rainfallRate: '35 mm/hr', confidence: 78 },
      { label: '+3 HR', timeStr: '01:42 PM', risk: 'HIGH', waterDepth: '0.35–0.55 m', rainfallRate: '22 mm/hr', confidence: 73 },
    ],
    affectedRoads: ['Mudichur Road', 'Manimangalam Highway', 'Rayappa Nagar Cross'],
    keyVulnerabilities: 'Adyar River headwaters overflow, low terrain natural flood basin.',
    recommendedAction: 'NDRF / SDRF and GCC boat squads stationed; arterial traffic diverted via Outer Ring Road.'
  },
  {
    id: 'zone-saidapet',
    name: 'Saidapet & Maraimalai Adigal Bridge',
    zoneNumber: 9,
    ward: 'Ward 142',
    currentRisk: 'MODERATE',
    expectedWindow: 'Next 3 hours',
    estimatedWaterDepth: '0.15–0.25 m',
    rainfallRate: '25 mm/hr',
    confidence: 84,
    dataSource: 'LIVE DATA',
    lastUpdated: '10:42 AM',
    center: [13.0213, 80.2231],
    polygon: [
      [13.0290, 80.2150],
      [13.0270, 80.2330],
      [13.0130, 80.2310],
      [13.0140, 80.2140],
    ],
    timeline: [
      { label: 'NOW', timeStr: '10:42 AM', risk: 'LOW', waterDepth: '0.05–0.10 m', rainfallRate: '15 mm/hr', confidence: 91 },
      { label: '+30 MIN', timeStr: '11:12 AM', risk: 'LOW', waterDepth: '0.08–0.15 m', rainfallRate: '20 mm/hr', confidence: 87 },
      { label: '+1 HR', timeStr: '11:42 AM', risk: 'MODERATE', waterDepth: '0.12–0.20 m', rainfallRate: '24 mm/hr', confidence: 85 },
      { label: '+2 HR', timeStr: '12:42 PM', risk: 'MODERATE', waterDepth: '0.15–0.25 m', rainfallRate: '25 mm/hr', confidence: 84 },
      { label: '+3 HR', timeStr: '01:42 PM', risk: 'LOW', waterDepth: '0.10–0.18 m', rainfallRate: '16 mm/hr', confidence: 79 },
    ],
    affectedRoads: ['Anna Salai Saidapet Stretch', 'Jones Road Subway', 'Aranganathan Subway'],
    keyVulnerabilities: 'Subway stormwater pump sumps vulnerable to grid fluctuations; Adyar riverbank proximity.',
    recommendedAction: 'Backup diesel gensets on standby at Aranganathan and Jones Road subways.'
  },
  {
    id: 'zone-kolathur',
    name: 'Kolathur & Jawahar Nagar',
    zoneNumber: 6,
    ward: 'Ward 64',
    currentRisk: 'LOW',
    expectedWindow: 'Next 4+ hours',
    estimatedWaterDepth: '0.05–0.15 m',
    rainfallRate: '16 mm/hr',
    confidence: 88,
    dataSource: 'STATIC GIS',
    lastUpdated: '10:42 AM',
    center: [13.1180, 80.2130],
    polygon: [
      [13.1290, 80.2030],
      [13.1270, 80.2240],
      [13.1070, 80.2220],
      [13.1090, 80.2020],
    ],
    timeline: [
      { label: 'NOW', timeStr: '10:42 AM', risk: 'LOW', waterDepth: '0.02–0.05 m', rainfallRate: '12 mm/hr', confidence: 94 },
      { label: '+30 MIN', timeStr: '11:12 AM', risk: 'LOW', waterDepth: '0.05–0.10 m', rainfallRate: '14 mm/hr', confidence: 91 },
      { label: '+1 HR', timeStr: '11:42 AM', risk: 'LOW', waterDepth: '0.05–0.15 m', rainfallRate: '16 mm/hr', confidence: 88 },
      { label: '+2 HR', timeStr: '12:42 PM', risk: 'MODERATE', waterDepth: '0.15–0.20 m', rainfallRate: '22 mm/hr', confidence: 82 },
      { label: '+3 HR', timeStr: '01:42 PM', risk: 'LOW', waterDepth: '0.10–0.15 m', rainfallRate: '14 mm/hr', confidence: 79 },
    ],
    affectedRoads: ['Paper Mills Road', 'SRP Koil Street'],
    keyVulnerabilities: 'Otteri Nullah tail-end drainage capacity.',
    recommendedAction: 'Normal monitoring; grates clear of municipal solid waste.'
  }
];

// Actual Chennai Road Geometry Coordinates for Real Routing
// Route: Chennai Central to Velachery MRTS
// Standard Route A (Anna Salai -> Saidapet -> Guindy -> Velachery Main Road) -> Heavy flood at Velachery / Saidapet
export const ROUTE_A_CENTRAL_TO_VELACHERY: RouteOption = {
  id: 'route-a',
  name: 'Via Anna Salai & Velachery Main Road',
  type: 'standard',
  title: 'Direct Arterial Route A',
  etaMinutes: 32,
  distanceKm: 11.4,
  floodExposure: 'HIGH',
  affectedSegmentsCount: 3,
  affectedRoadNames: ['Anna Salai Saidapet Subway', 'Guindy Race Course Cut', 'Velachery 100ft Bypass Rd'],
  // Realistic path points along Chennai roads: Central -> Mount Road -> DMS -> Nandanam -> Saidapet -> Guindy -> Velachery
  path: [
    [13.0827, 80.2754], // Chennai Central
    [13.0760, 80.2700], // Evening Bazaar
    [13.0670, 80.2620], // Royapettah / Anna Salai
    [13.0550, 80.2520], // Thousand Lights
    [13.0450, 80.2450], // DMS / Teynampet
    [13.0330, 80.2370], // Nandanam Signal
    [13.0213, 80.2231], // Saidapet Bridge (FLOODED SEGMENT 1)
    [13.0120, 80.2120], // Little Mount
    [13.0067, 80.2025], // Guindy Kathipara
    [12.9960, 80.2080], // Guindy Race Course Rd (FLOODED SEGMENT 2)
    [12.9880, 80.2140], // Velachery Bypass Rd (FLOODED SEGMENT 3)
    [12.9815, 80.2180], // Velachery MRTS
  ],
  floodAffectedSegments: [
    // Saidapet Bridge to Little Mount
    [[13.0213, 80.2231], [13.0120, 80.2120]],
    // Guindy Race Course stretch
    [[13.0067, 80.2025], [12.9960, 80.2080]],
    // Velachery Bypass approach
    [[12.9880, 80.2140], [12.9815, 80.2180]],
  ],
  summaryText: 'Flood risk detected along this route. 3 affected road segments with estimated water depth up to 0.45 m near Velachery Bypass and Saidapet.'
};

// Alternative Lower Predicted Risk Route (Via Santhome / Foreshore Estate / Kamarajar Salai -> Adyar Bridge -> Sardar Patel Rd -> Taramani Link Rd)
export const ROUTE_B_CENTRAL_TO_VELACHERY: RouteOption = {
  id: 'route-b',
  name: 'Via Coastal Coastal Corridor & Taramani Elevated Link',
  type: 'alternative',
  title: 'Lower Predicted Flood-Risk Route',
  etaMinutes: 36,
  distanceKm: 12.1,
  floodExposure: 'LOWER PREDICTED RISK',
  affectedSegmentsCount: 0,
  affectedRoadNames: [],
  path: [
    [13.0827, 80.2754], // Chennai Central
    [13.0780, 80.2840], // Chennai Beach / Port
    [13.0650, 80.2820], // Marina Beach / Kamarajar Promenade (High elevation ridge)
    [13.0500, 80.2800], // Light House
    [13.0330, 80.2760], // Santhome High Road
    [13.0180, 80.2680], // Foreshore / MRC Nagar
    [13.0064, 80.2575], // Adyar Signal (Dry high-capacity bridge)
    [12.9980, 80.2450], // Gandhi Nagar / Sardar Patel Rd
    [12.9900, 80.2350], // IIT Madras North Gate
    [12.9850, 80.2280], // Taramani Link Road (Elevated storm line)
    [12.9815, 80.2180], // Velachery MRTS Destination
  ],
  floodAffectedSegments: [],
  summaryText: 'Lower predicted flood-risk route. Elevated coastal and university corridor with operating gravity macro-drains. No waterlogged road segments predicted for the next 2 hours.'
};

// Additional Route: Guindy Kathipara to OMR Thoraipakkam
export const ROUTE_A_GUINDY_TO_OMR: RouteOption = {
  id: 'route-c',
  name: 'Via Velachery 100ft Road & Medavakkam Cut',
  type: 'standard',
  title: 'Standard Route via Velachery',
  etaMinutes: 28,
  distanceKm: 9.8,
  floodExposure: 'HIGH',
  affectedSegmentsCount: 2,
  affectedRoadNames: ['Vijayanagar Junction', 'Kallukuttai Cross'],
  path: [
    [13.0067, 80.2025], // Guindy
    [12.9940, 80.2120], // Phoenix Marketcity stretch
    [12.9815, 80.2180], // Vijayanagar Velachery (FLOODED)
    [12.9654, 80.2428], // Perungudi West (FLOODED)
    [12.9372, 80.2372], // Thoraipakkam
  ],
  floodAffectedSegments: [
    [[12.9940, 80.2120], [12.9815, 80.2180]],
    [[12.9815, 80.2180], [12.9654, 80.2428]],
  ],
  summaryText: 'Flood risk detected along this route. High water accumulation at Vijayanagar underpass.'
};

export const ROUTE_B_GUINDY_TO_OMR: RouteOption = {
  id: 'route-d',
  name: 'Via Sardar Patel Road & OMR Expressway Flyover',
  type: 'alternative',
  title: 'Lower Predicted Flood-Risk Route',
  etaMinutes: 31,
  distanceKm: 10.9,
  floodExposure: 'LOWER PREDICTED RISK',
  affectedSegmentsCount: 0,
  affectedRoadNames: [],
  path: [
    [13.0067, 80.2025], // Guindy Kathipara
    [13.0110, 80.2200], // Little Mount Flyover
    [13.0064, 80.2400], // Anna University / Sardar Patel Rd
    [12.9950, 80.2520], // Madhya Kailash Junction (OMR Start)
    [12.9750, 80.2500], // Tidel Park Elevated Expressway
    [12.9550, 80.2470], // Kandanchavadi Flyover
    [12.9372, 80.2372], // Thoraipakkam
  ],
  floodAffectedSegments: [],
  summaryText: 'Lower predicted flood-risk route. Utilizes grade-separated flyovers avoiding surface drainage inundation.'
};

// Chennai Major Canals and Waterways Geometry
export interface CanalFeature {
  id: string;
  name: string;
  type: 'Major Canal' | 'River Basin' | 'Surplus Channel' | 'Estuary';
  waterLevelCurrentM: number;
  capacityLevelM: number;
  status: 'Normal' | 'Warning' | 'Near Bankful' | 'Spilling';
  flowDirection: string;
  path: [number, number][];
}

export const CHENNAI_CANALS: CanalFeature[] = [
  {
    id: 'canal-buckingham-south',
    name: 'South Buckingham Canal',
    type: 'Major Canal',
    waterLevelCurrentM: 2.8,
    capacityLevelM: 3.2,
    status: 'Near Bankful',
    flowDirection: 'North to Kovalam Basin',
    path: [
      [13.0100, 80.2600],
      [12.9900, 80.2540],
      [12.9680, 80.2470],
      [12.9450, 80.2430],
      [12.9150, 80.2380],
      [12.8750, 80.2320],
      [12.8300, 80.2250],
    ]
  },
  {
    id: 'canal-adyar-river',
    name: 'Adyar River',
    type: 'River Basin',
    waterLevelCurrentM: 4.1,
    capacityLevelM: 5.5,
    status: 'Warning',
    flowDirection: 'West to Bay of Bengal at Foreshore Estate',
    path: [
      [12.9400, 80.1100], // Tambaram / Chembarambakkam outflow
      [12.9800, 80.1600], // Anakaputhur
      [13.0067, 80.2025], // Guindy Kathipara
      [13.0213, 80.2231], // Saidapet Bridge
      [13.0160, 80.2480], // Kotturpuram
      [13.0100, 80.2600], // Adyar Estuary (Bay of Bengal)
    ]
  },
  {
    id: 'canal-cooum-river',
    name: 'Cooum River',
    type: 'River Basin',
    waterLevelCurrentM: 3.4,
    capacityLevelM: 4.8,
    status: 'Normal',
    flowDirection: 'West to Napier Bridge',
    path: [
      [13.0720, 80.1700], // Koyambedu
      [13.0750, 80.2100], // Aminjikarai
      [13.0710, 80.2400], // Chetpet
      [13.0740, 80.2680], // Egmore
      [13.0690, 80.2850], // Napier Bridge (Bay of Bengal)
    ]
  },
  {
    id: 'canal-otteri-nullah',
    name: 'Otteri Nullah',
    type: 'Major Canal',
    waterLevelCurrentM: 2.1,
    capacityLevelM: 2.7,
    status: 'Warning',
    flowDirection: 'West to North Buckingham Canal',
    path: [
      [13.0900, 80.2100], // Villivakkam
      [13.0950, 80.2350], // Perambur
      [13.0920, 80.2600], // Basin Bridge confluence
    ]
  },
  {
    id: 'canal-mambalam-canal',
    name: 'Mambalam Canal',
    type: 'Surplus Channel',
    waterLevelCurrentM: 1.8,
    capacityLevelM: 2.2,
    status: 'Near Bankful',
    flowDirection: 'T. Nagar to Adyar River Confluence',
    path: [
      [13.0450, 80.2350], // Panagal Park
      [13.0350, 80.2310], // T. Nagar
      [13.0240, 80.2260], // Saidapet Confluence
    ]
  },
  {
    id: 'canal-veerangal-odai',
    name: 'Veerangal Odai Drain',
    type: 'Surplus Channel',
    waterLevelCurrentM: 2.4,
    capacityLevelM: 2.6,
    status: 'Spilling',
    flowDirection: 'Adambakkam to Pallikaranai Marsh',
    path: [
      [12.9880, 80.1980], // Adambakkam Lake
      [12.9780, 80.2070], // Vanuvampet
      [12.9690, 80.2160], // Velachery Lake surplus
      [12.9550, 80.2230], // Pallikaranai Marsh
    ]
  }
];

// Detailed Drainage Network Segments (with Connected, Blocked, Disconnected, Incomplete)
export const CHENNAI_DRAINAGE_NETWORK: DrainageNetworkItem[] = [
  {
    id: 'drain-d104',
    code: 'DRAIN D-104',
    name: 'Perungudi Industrial Link Macro Drain',
    type: 'main-drain',
    status: 'CONNECTIVITY BLOCKED',
    area: 'Perungudi',
    ward: 'Ward 184',
    capacityCusecs: 140,
    currentFlowPercentage: 94,
    lastVerified: '21 Sep 2026, 09:30 AM',
    path: [
      [12.9680, 80.2380], // Street origin
      [12.9660, 80.2410], // Local drain collector
      [12.9645, 80.2440], // Main arterial culvert
      [12.9635, 80.2465], // Target canal junction (Cut-off)
    ],
    blockedPoint: [12.9645, 80.2440],
    downstreamConnection: 'Not detected',
    possibleImpact: 'Reduced drainage capacity. Stormwater back-flooding into Perungudi residential zone and OMR service lane.',
    networkHierarchy: {
      street: 'Perungudi Industrial Estate Road 3',
      localDrain: 'SWD Sector 4 Box Culvert',
      mainDrain: 'OMR East Collector Conduit D-104',
      canal: 'South Buckingham Canal Ch. 4+150',
      isBlockedAtMainDrainToCanal: true,
    },
    technicalDetails: {
      channelWidth: '2.4 m Precast RCC',
      gradient: '1 in 850 (Adverse Silt Slope)',
      sedimentSiltLevel: '68% cross-sectional occlusion',
      lastDesilted: '14 May 2026 (Pre-monsoon phase 1)',
      pumpingStationSupport: 'No permanent pump; mobile 100 HP diesel pump required',
    }
  },
  {
    id: 'drain-v202',
    code: 'DRAIN V-202',
    name: 'Velachery 100ft Surplus Channel',
    type: 'storm-water',
    status: 'CONNECTED',
    area: 'Velachery',
    ward: 'Ward 178',
    capacityCusecs: 220,
    currentFlowPercentage: 62,
    lastVerified: '21 Sep 2026, 09:45 AM',
    path: [
      [12.9870, 80.2110],
      [12.9830, 80.2160],
      [12.9770, 80.2220],
      [12.9690, 80.2270],
    ],
    downstreamConnection: 'Pallikaranai Marshland Outfall B',
    possibleImpact: 'Normal active gravity discharge. Continuous outflow maintained.',
    networkHierarchy: {
      street: '100 Feet Bypass Road North',
      localDrain: 'Velachery East Lateral SWD',
      mainDrain: 'Vijayanagar Trunk Channel V-202',
      canal: 'Pallikaranai Marsh Wetland Channel',
      isBlockedAtMainDrainToCanal: false,
    },
    technicalDetails: {
      channelWidth: '3.6 m Twin Cell Box Drain',
      gradient: '1 in 600 (Adequate gravity head)',
      sedimentSiltLevel: '14% (Cleared post-desiltation)',
      lastDesilted: '02 Aug 2026',
      pumpingStationSupport: 'Supported by GCC Velachery Pumping Well 2',
    }
  },
  {
    id: 'drain-m310',
    code: 'DRAIN M-310',
    name: 'Madipakkam Balaiah Nagar Disconnected Swale',
    type: 'storm-water',
    status: 'DISCONNECTED',
    area: 'Madipakkam',
    ward: 'Ward 187',
    capacityCusecs: 85,
    currentFlowPercentage: 98,
    lastVerified: '20 Sep 2026, 04:15 PM',
    path: [
      [12.9690, 80.1940],
      [12.9660, 80.1980],
      [12.9630, 80.2010],
    ],
    blockedPoint: [12.9630, 80.2010],
    downstreamConnection: 'Not detected',
    possibleImpact: 'Reduced drainage capacity. Inundation of Balaiah Nagar 4th Main Road with standing water up to 0.45 m.',
    networkHierarchy: {
      street: 'Balaiah Nagar 2nd Avenue',
      localDrain: 'Ward 187 U-Drain',
      mainDrain: 'Madipakkam South Collector M-310',
      canal: 'Veerangal Odai Connection (Missing 280m link)',
      isBlockedAtLocalDrain: false,
      isBlockedAtMainDrainToCanal: true,
    },
    technicalDetails: {
      channelWidth: '1.8 m Open Masonry Drain',
      gradient: 'Incomplete invert levels',
      sedimentSiltLevel: '42% siltation with utility cable crossings',
      lastDesilted: '22 Jan 2026',
      pumpingStationSupport: 'Requires manual suction tanker',
    }
  },
  {
    id: 'drain-s405',
    code: 'DRAIN S-405',
    name: 'Saidapet Jones Road Subway Drain',
    type: 'main-drain',
    status: 'CONNECTED',
    area: 'Saidapet',
    ward: 'Ward 142',
    capacityCusecs: 160,
    currentFlowPercentage: 55,
    lastVerified: '21 Sep 2026, 08:20 AM',
    path: [
      [13.0260, 80.2180],
      [13.0230, 80.2210],
      [13.0200, 80.2240],
    ],
    downstreamConnection: 'Adyar River Left Embankment Outfall 8',
    possibleImpact: 'Active automated submersible pumps pumping water directly into Adyar River.',
    networkHierarchy: {
      street: 'Jones Road Subway Sump',
      localDrain: 'Dual 20 HP Submersible Suction',
      mainDrain: 'Saidapet High Pressure Rising Main S-405',
      canal: 'Adyar River (Maraimalai Adigal Bridge)',
      isBlockedAtMainDrainToCanal: false,
    },
    technicalDetails: {
      channelWidth: '600 mm Cast Iron Rising Main',
      gradient: 'Pressurized pumping line',
      sedimentSiltLevel: '8% (Filter chamber clean)',
      lastDesilted: '18 Sep 2026',
      pumpingStationSupport: 'Dual 20 HP pumps with automated float switches',
    }
  },
  {
    id: 'drain-k512',
    code: 'DRAIN K-512',
    name: 'Kallukuttai Informal Channel',
    type: 'storm-water',
    status: 'NETWORK INFORMATION INCOMPLETE',
    area: 'Perungudi / Kallukuttai',
    ward: 'Ward 184',
    capacityCusecs: 60,
    currentFlowPercentage: 80,
    lastVerified: '12 Sep 2026, 11:00 AM',
    path: [
      [12.9730, 80.2290],
      [12.9700, 80.2330],
      [12.9680, 80.2360],
    ],
    downstreamConnection: 'Network information incomplete',
    possibleImpact: 'Connectivity data unavailable. Uncharted micro-channels may cause localized pooling during heavy bursts.',
    networkHierarchy: {
      street: 'Kallukuttai Rail Boundary Street',
      localDrain: 'Unlined Earthen Swale',
      mainDrain: 'Unknown Collector',
      canal: 'Connectivity data unavailable',
    },
    technicalDetails: {
      channelWidth: 'Irregular 1.2–2.0 m unlined',
      gradient: 'Unsurveyed',
      sedimentSiltLevel: 'High weed infestation',
      lastDesilted: 'Data unavailable',
      pumpingStationSupport: 'None',
    }
  },
  {
    id: 'drain-t108',
    code: 'DRAIN T-108',
    name: 'T. Nagar GN Chetty Collector',
    type: 'main-drain',
    status: 'CONNECTED',
    area: 'T. Nagar',
    ward: 'Ward 136',
    capacityCusecs: 190,
    currentFlowPercentage: 70,
    lastVerified: '21 Sep 2026, 10:15 AM',
    path: [
      [13.0450, 80.2380],
      [13.0410, 80.2360],
      [13.0370, 80.2340],
    ],
    downstreamConnection: 'Mambalam Canal Inflow Structure 4',
    possibleImpact: 'Moderate flow rate; stormwater draining into Mambalam Canal via automated silt traps.',
    networkHierarchy: {
      street: 'G.N. Chetty Road North',
      localDrain: 'GCC Modular Perforated SWD',
      mainDrain: 'GN Chetty Trunk Box Drain T-108',
      canal: 'Mambalam Canal Outfall',
      isBlockedAtMainDrainToCanal: false,
    },
    technicalDetails: {
      channelWidth: '2.8 m RCC Covered Box Drain',
      gradient: '1 in 700',
      sedimentSiltLevel: '22%',
      lastDesilted: '29 Aug 2026',
      pumpingStationSupport: 'Equipped with hydro-jetting access chambers',
    }
  },
  {
    id: 'drain-sm701',
    code: 'DRAIN SM-701',
    name: 'Semmancheri Housing Board Outfall Canal',
    type: 'outlet',
    status: 'CONNECTIVITY BLOCKED',
    area: 'Semmancheri',
    ward: 'Ward 197',
    capacityCusecs: 110,
    currentFlowPercentage: 92,
    lastVerified: '21 Sep 2026, 07:50 AM',
    path: [
      [12.8760, 80.2190],
      [12.8730, 80.2240],
      [12.8700, 80.2280],
    ],
    blockedPoint: [12.8730, 80.2240],
    downstreamConnection: 'Not detected',
    possibleImpact: 'Downstream drainage connection was not detected. Culvert mouth blocked by construction debris at OMR link bridge.',
    networkHierarchy: {
      street: 'Semmancheri Tsunami Quarters Road',
      localDrain: 'Open U-channel Link',
      mainDrain: 'Semmancheri Outfall Conduit SM-701',
      canal: 'South Buckingham Canal Reach 12',
      isBlockedAtMainDrainToCanal: true,
    },
    technicalDetails: {
      channelWidth: '2.0 m Open Masonry',
      gradient: '1 in 900',
      sedimentSiltLevel: '74% blockage at pipe culvert headwall',
      lastDesilted: '10 Feb 2026',
      pumpingStationSupport: 'Emergency backhoe machine requested by Ward engineer',
    }
  }
];

// Chennai Real-time / Forecast Weather Data
export const CHENNAI_WEATHER_DATA: WeatherData = {
  location: 'Chennai (Meenambakkam & Nungambakkam IMD Stations)',
  temperatureC: 28.6,
  feelsLikeC: 33.2,
  rainfallCurrentMmHr: 38.4,
  humidityPercent: 91,
  windKmh: 26,
  windDirection: 'North-East (Monsoon Trough)',
  rainProbabilityPercent: 88,
  barometricPressureHpa: 1004.2,
  lastUpdated: '10:42 AM',
  next6Hours: [
    { timeStr: '11 AM', tempC: 28.6, rainProbability: 88, rainfallMm: 38.4, condition: 'Heavy Rain', windKmh: 26 },
    { timeStr: '12 PM', tempC: 28.0, rainProbability: 92, rainfallMm: 44.0, condition: 'Heavy Showers', windKmh: 28 },
    { timeStr: '01 PM', tempC: 27.5, rainProbability: 95, rainfallMm: 52.5, condition: 'Intense Downpour', windKmh: 32 },
    { timeStr: '02 PM', tempC: 27.2, rainProbability: 90, rainfallMm: 46.0, condition: 'Heavy Rain', windKmh: 30 },
    { timeStr: '03 PM', tempC: 27.8, rainProbability: 75, rainfallMm: 28.0, condition: 'Moderate Showers', windKmh: 24 },
    { timeStr: '04 PM', tempC: 28.2, rainProbability: 60, rainfallMm: 16.5, condition: 'Scattered Rain', windKmh: 20 },
  ],
  fiveDayForecast: [
    { 
      dateStr: 'Today, 21 Sep', 
      condition: 'Heavy Rain & Thunderstorms', 
      tempMinC: 25, 
      tempMaxC: 29, 
      rainProbability: 92, 
      expectedRainfallMm: '110–145 mm',
      floodAssumption: {
        floodMayOccur: true,
        probabilityLevel: 'CRITICAL',
        assumptionHeadline: 'Flood May Occur on this Day: Severe Inundation Alert',
        rationale: 'Combined impact of 110–145 mm storm precipitation with high tide surge at Kovalam & Ennore mouths will induce severe surface ponding in low elevation catchments.',
        vulnerableZones: ['Velachery East (Ward 178)', 'Madipakkam Balaiah Nagar', 'Perungudi Marsh Boundary', 'Semmancheri Tsunami Quarters', 'Mudichur Varadarajapuram'],
        workerStandbyLevel: 'Level 3: Full Emergency Mobilization',
        assignedWorkersCount: 142,
        recommendedCivicPrecaution: 'Avoid subway underpasses and arterial Velachery Main Road. Standby boats & 100HP pumps deployed by GCC.'
      }
    },
    { 
      dateStr: 'Tue, 22 Sep', 
      condition: 'Continuous Moderate to Heavy Rain', 
      tempMinC: 24, 
      tempMaxC: 28, 
      rainProbability: 85, 
      expectedRainfallMm: '75–100 mm',
      floodAssumption: {
        floodMayOccur: true,
        probabilityLevel: 'HIGH',
        assumptionHeadline: 'Flood May Occur on this Day: Persistent Waterlogging Hazard',
        rationale: 'Saturated soil from day 1 rain will yield 85% runoff directly into choked local drains, slowing drainage recession in South Chennai basins.',
        vulnerableZones: ['Madipakkam Lowlands', 'Kallukuttai Rail Fringe', 'Saidapet Jones Road Subway', 'Mudichur Outer Ring Road'],
        workerStandbyLevel: 'Level 3: Full Emergency Mobilization',
        assignedWorkersCount: 110,
        recommendedCivicPrecaution: 'Heavy vehicle transit only on elevated OMR/GST corridors; keep sump pumps operational.'
      }
    },
    { 
      dateStr: 'Wed, 23 Sep', 
      condition: 'Intermittent Showers', 
      tempMinC: 25, 
      tempMaxC: 30, 
      rainProbability: 70, 
      expectedRainfallMm: '35–55 mm',
      floodAssumption: {
        floodMayOccur: true,
        probabilityLevel: 'MODERATE',
        assumptionHeadline: 'Flood May Occur: Localized Bottleneck Surcharge',
        rationale: 'Localized flash runoff concentrated around under-capacity culverts and unlinked drainage reaches (D-104 & M-310).',
        vulnerableZones: ['Saidapet Subway Sump', 'Perungudi Industrial Road 3', 'Madipakkam 4th Main'],
        workerStandbyLevel: 'Level 2: High Alert Standby',
        assignedWorkersCount: 65,
        recommendedCivicPrecaution: 'Exercise caution near culverts and desilting machinery operations.'
      }
    },
    { 
      dateStr: 'Thu, 24 Sep', 
      condition: 'Partly Cloudy with Passing Rain', 
      tempMinC: 26, 
      tempMaxC: 32, 
      rainProbability: 45, 
      expectedRainfallMm: '15–25 mm',
      floodAssumption: {
        floodMayOccur: false,
        probabilityLevel: 'LOW',
        assumptionHeadline: 'Low Flood Probability: Controlled Drainage Recession',
        rationale: 'Canal stage levels subsiding below warning marks; municipal pump stations returning to standard gravity flow discharge.',
        vulnerableZones: ['Minor roadside water accumulation only'],
        workerStandbyLevel: 'Level 1: Routine Standby',
        assignedWorkersCount: 28,
        recommendedCivicPrecaution: 'Normal traffic operations; post-storm silt inspection ongoing.'
      }
    },
    { 
      dateStr: 'Fri, 25 Sep', 
      condition: 'Mostly Dry & Humid', 
      tempMinC: 26, 
      tempMaxC: 33, 
      rainProbability: 25, 
      expectedRainfallMm: '5–10 mm',
      floodAssumption: {
        floodMayOccur: false,
        probabilityLevel: 'LOW',
        assumptionHeadline: 'Minimal Flood Probability: Clear Runoff & Stability',
        rationale: 'Dry atmospheric conditions and open outfall gates facilitating complete clearance of stormwater.',
        vulnerableZones: ['None anticipated'],
        workerStandbyLevel: 'Level 1: Routine Standby',
        assignedWorkersCount: 16,
        recommendedCivicPrecaution: 'Full clearance of city transit corridors.'
      }
    },
  ],
  floodConnection: {
    rainForecastSummary: 'Heavy rainfall expected during the next 2 hours across South Chennai and OMR coastal belt.',
    potentialImpact: 'HIGHER FLOOD RISK',
    rainfallRateDesc: 'Peak precipitation rate of 44–52 mm/hr will exceed standard surface runoff absorptive threshold (25 mm/hr).',
    drainageLoadDesc: 'Critical trunk canals (South Buckingham, Mambalam, Veerangal Odai) projected to hit 92%–100% capacity by 12:45 PM.',
    floodRiskDesc: 'Severe waterlogging anticipated in Velachery, Madipakkam, Perungudi, and Mudichur catchments with standing water 0.30–0.65 m.',
    catchmentsAtRisk: ['Velachery Basin', 'Perungudi Marsh Fringe', 'Madipakkam Lowlands', 'Mudichur Adyar Basin', 'Semmancheri Sholinganallur']
  }
};

// GCC IoT Telemetry Sensor Stations
export const CHENNAI_SENSORS: SensorStation[] = [
  {
    id: 'sensor-1',
    name: 'Saidapet Bridge Ultrasonic Stage Gauge',
    location: 'Adyar River Pier 4',
    coordinates: [13.0213, 80.2231],
    sensorType: 'Ultrasonic Water Level',
    currentLevelM: 3.85,
    warningThresholdM: 4.20,
    dangerThresholdM: 5.00,
    batteryStatus: '98% (Solar Float)',
    telemetryStatus: 'ONLINE',
    lastPing: '2 mins ago'
  },
  {
    id: 'sensor-2',
    name: 'Velachery Lake Surplus Weir Telemetry',
    location: '100ft Road Culvert',
    coordinates: [12.9815, 80.2180],
    sensorType: 'Ultrasonic Water Level',
    currentLevelM: 2.35,
    warningThresholdM: 2.10,
    dangerThresholdM: 2.50,
    batteryStatus: '94%',
    telemetryStatus: 'ONLINE',
    lastPing: 'Just now'
  },
  {
    id: 'sensor-3',
    name: 'Buckingham Canal Lock Gate Sensor',
    location: 'Thoraipakkam Outfall',
    coordinates: [12.9372, 80.2372],
    sensorType: 'Radar Velocity',
    currentLevelM: 2.65,
    warningThresholdM: 2.50,
    dangerThresholdM: 3.10,
    batteryStatus: '89%',
    telemetryStatus: 'ONLINE',
    lastPing: '4 mins ago'
  },
  {
    id: 'sensor-4',
    name: 'Mambalam Canal Automated Sluice Station',
    location: 'T. Nagar Panagal Park',
    coordinates: [13.0418, 80.2341],
    sensorType: 'In-line Flow',
    currentLevelM: 1.70,
    warningThresholdM: 1.80,
    dangerThresholdM: 2.20,
    batteryStatus: '100% (Grid + Inverter)',
    telemetryStatus: 'ONLINE',
    lastPing: '1 min ago'
  },
  {
    id: 'sensor-5',
    name: 'Kotturpuram River Gauge',
    location: 'Turnbulls Road Bend',
    coordinates: [13.0160, 80.2480],
    sensorType: 'Ultrasonic Water Level',
    currentLevelM: 3.10,
    warningThresholdM: 4.00,
    dangerThresholdM: 4.80,
    batteryStatus: '92%',
    telemetryStatus: 'ONLINE',
    lastPing: '3 mins ago'
  }
];

// Civic Reports & Response Tracking
export const CHENNAI_REPORTS: CivicReport[] = [
  {
    id: 'rep-101',
    title: 'Culvert blockage by construction silt at D-104',
    category: 'Blocked Drain',
    location: 'Perungudi OMR Service Lane',
    ward: 'Ward 184',
    reportedAt: '21 Sep, 09:12 AM',
    status: 'Dispatched',
    priority: 'Critical',
    reporterType: 'GCC Field Inspector'
  },
  {
    id: 'rep-102',
    title: 'Water accumulation of 0.35m at Vijayanagar underpass',
    category: 'Waterlogging',
    location: 'Velachery Bypass Road',
    ward: 'Ward 178',
    reportedAt: '21 Sep, 09:40 AM',
    status: 'Investigating',
    priority: 'High',
    reporterType: 'Citizen'
  },
  {
    id: 'rep-103',
    title: 'Submersible dewatering pump trip at Jones Road subway',
    category: 'Blocked Drain',
    location: 'Saidapet Jones Road',
    ward: 'Ward 142',
    reportedAt: '21 Sep, 08:55 AM',
    status: 'Cleared',
    priority: 'High',
    reporterType: 'Automated Sensor Alert'
  },
  {
    id: 'rep-104',
    title: 'Weed choking in Veerangal Odai near Balaiah Nagar',
    category: 'Canal Siltation',
    location: 'Madipakkam Link',
    ward: 'Ward 187',
    reportedAt: '21 Sep, 07:30 AM',
    status: 'Dispatched',
    priority: 'Medium',
    reporterType: 'Citizen'
  }
];

// GCC Municipal Field Worker Crews
export const CHENNAI_WORKER_CREWS: WorkerCrew[] = [
  {
    id: 'crew-01',
    crewName: 'GCC Rapid Dewatering Unit 04',
    unitCode: 'GCC-RDU-04',
    supervisor: 'Er. K. Murugan (Junior Engineer)',
    phone: '+91 94440 21004',
    memberCount: 14,
    vehicleAssigned: 'Super Sucker Jetting Tanker TN-01-G-4421',
    specialization: 'Emergency Dewatering',
    currentStatus: 'Active On Site',
    assignedWard: 'Ward 184 (Perungudi)'
  },
  {
    id: 'crew-02',
    crewName: 'Stormwater Desilting Excavator Team B',
    unitCode: 'GCC-EXC-02',
    supervisor: 'Er. R. Selvam (Assistant Engineer)',
    phone: '+91 94440 31802',
    memberCount: 10,
    vehicleAssigned: 'JCB 3DX Heavy Excavator & Tipper TN-01-G-7812',
    specialization: 'Canal Desilting',
    currentStatus: 'Active On Site',
    assignedWard: 'Ward 197 (Semmancheri)'
  },
  {
    id: 'crew-03',
    crewName: 'Velachery-Madipakkam Rapid Response Squad',
    unitCode: 'GCC-VMR-03',
    supervisor: 'P. Anbarasan (Senior Sanitary Inspector)',
    phone: '+91 94440 45013',
    memberCount: 16,
    vehicleAssigned: 'Mobile Diesel Suction Pump Trailer TN-01-G-1988',
    specialization: 'Culvert Linkage & Bypass',
    currentStatus: 'Active On Site',
    assignedWard: 'Ward 187 (Madipakkam)'
  },
  {
    id: 'crew-04',
    crewName: 'Central Canals Sluice & Sump Operations Squad',
    unitCode: 'GCC-SLU-01',
    supervisor: 'M. Govindaraj (PWD Mechanical Overseer)',
    phone: '+91 94440 88921',
    memberCount: 8,
    vehicleAssigned: 'Hydraulic Winch & Generator Van TN-01-G-3310',
    specialization: 'Sluice Gate Operation',
    currentStatus: 'Standby at Depo',
    assignedWard: 'Ward 142 (Saidapet)'
  },
  {
    id: 'crew-05',
    crewName: 'Zone 13 Adyar Emergency Reserve Crew',
    unitCode: 'GCC-RES-13',
    supervisor: 'T. Dinakaran (Work Inspector)',
    phone: '+91 94440 92055',
    memberCount: 12,
    vehicleAssigned: 'Flood Response Rescue Truck TN-01-G-5561',
    specialization: 'Emergency Dewatering',
    currentStatus: 'Standby at Depo',
    assignedWard: 'Ward 178 (Velachery)'
  }
];

// Initial Worker Tasks / Work History Log
export const CHENNAI_WORKER_TASKS: WorkerTask[] = [
  {
    id: 'task-w-101',
    crewId: 'crew-01',
    crewName: 'GCC Rapid Dewatering Unit 04',
    supervisor: 'Er. K. Murugan',
    drainCode: 'DRAIN D-104',
    area: 'Perungudi Industrial Link Macro Drain',
    ward: 'Ward 184',
    workType: 'Clear Blockage & Restore Connectivity',
    status: 'In Progress',
    assignedDate: '21 Sep 2026, 09:40 AM',
    targetCompletion: 'Today, 02:00 PM',
    weatherAssumptionLink: 'Assigned due to Day 1 Flood Prediction (110–145 mm storm forecast)',
    equipmentUsed: 'Super Sucker Jetting Tanker + 100 HP High-Volume Diesel Dewatering Pump',
    notes: 'Excavating construction debris and hydraulic jetting 68% silt occlusion at D-104 culvert head to establish connection to South Buckingham Canal.',
    connectivityRestored: false
  },
  {
    id: 'task-w-102',
    crewId: 'crew-02',
    crewName: 'Stormwater Desilting Excavator Team B',
    supervisor: 'Er. R. Selvam',
    drainCode: 'DRAIN SM-701',
    area: 'Semmancheri Housing Board Outfall Canal',
    ward: 'Ward 197',
    workType: 'Culvert Bypass Trenching',
    status: 'In Progress',
    assignedDate: '21 Sep 2026, 08:30 AM',
    targetCompletion: 'Today, 01:30 PM',
    weatherAssumptionLink: 'Assigned due to Weather Flood Impact Cascade: 92% Canal load at South Buckingham',
    equipmentUsed: 'JCB 3DX Heavy Excavator & Tipper',
    notes: 'Trenching a 120m emergency bypass channel around choked culvert mouth at OMR link bridge to divert rising floodwaters into South Buckingham Canal Reach 12.',
    connectivityRestored: false
  },
  {
    id: 'task-w-103',
    crewId: 'crew-03',
    crewName: 'Velachery-Madipakkam Rapid Response Squad',
    supervisor: 'P. Anbarasan',
    drainCode: 'DRAIN M-310',
    area: 'Madipakkam Balaiah Nagar Disconnected Swale',
    ward: 'Ward 187',
    workType: 'Emergency Dewatering 100HP Pump',
    status: 'In Progress',
    assignedDate: '21 Sep 2026, 08:00 AM',
    targetCompletion: 'Today, 03:30 PM',
    weatherAssumptionLink: 'Assigned due to Day 1 & Day 2 Flood Occurrence Assumption for Madipakkam lowlands',
    equipmentUsed: 'Mobile Diesel Suction Pump Trailer + 8-inch Layflat Delivery Hose',
    notes: 'Pumping water across missing 280m missing link directly over highway median into Veerangal Odai surplus channel.',
    connectivityRestored: false
  },
  {
    id: 'task-w-104',
    crewId: 'crew-04',
    crewName: 'Central Canals Sluice & Sump Operations Squad',
    supervisor: 'M. Govindaraj',
    drainCode: 'DRAIN S-405',
    area: 'Saidapet Jones Road Subway Drain',
    ward: 'Ward 142',
    workType: 'Clear Blockage & Restore Connectivity',
    status: 'Completed - Connected',
    assignedDate: '21 Sep 2026, 06:15 AM',
    targetCompletion: '21 Sep 2026, 08:45 AM',
    weatherAssumptionLink: 'Assigned pre-monsoon burst warning for Adyar River basin',
    equipmentUsed: 'Hydro-Jetting Rig & Dual 20 HP Submersible Pump servicing',
    notes: 'Debris cleared from subway sump intake grating. Automated float switches tested. Gravity and pumped connection to Adyar River verified 100% operational.',
    connectivityRestored: true
  },
  {
    id: 'task-w-105',
    crewId: 'crew-01',
    crewName: 'GCC Rapid Dewatering Unit 04',
    supervisor: 'Er. K. Murugan',
    drainCode: 'DRAIN V-202',
    area: 'Velachery 100ft Surplus Channel',
    ward: 'Ward 178',
    workType: 'Siltation Removal',
    status: 'Completed - Connected',
    assignedDate: '20 Sep 2026, 02:00 PM',
    targetCompletion: '20 Sep 2026, 06:30 PM',
    weatherAssumptionLink: 'Preventative desilting prior to 21 Sep thunderstorm alert',
    equipmentUsed: 'Bobcat Skid Loader & Manual Desilting Team',
    notes: 'Trash rack desilted. Twin cell box drain flow unobstructed to Pallikaranai marshland outfall.',
    connectivityRestored: true
  }
];

