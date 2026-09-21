import React from 'react';
import { AppView } from '../types';
import { 
  Shield, 
  MapPin, 
  Navigation, 
  GitBranch, 
  CloudRain, 
  ArrowRight, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Radio
} from 'lucide-react';
import chennaiHeroImg from '../assets/images/chennai_urban_rain_1790007078863.jpg';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Civic Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold tracking-tight">
              <Shield className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg tracking-tight text-slate-900 leading-none font-serif">
                AQUAD4C1177
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Chennai Municipal Infrastructure &amp; Hydrology
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('flood-prediction')}
              id="landing-btn-view-map-top"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
            >
              Public Map
            </button>
            <button
              onClick={() => onNavigate('login')}
              id="landing-btn-signin-top"
              className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md transition-colors shadow-xs"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[560px] lg:min-h-[620px] flex items-center justify-center text-white overflow-hidden">
        {/* Subtle realistic urban rain background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={chennaiHeroImg}
            alt="Chennai city arterial road during a calm monsoon evening"
            className="w-full h-full object-cover object-center filter brightness-90"
          />
          {/* Dark translucent overlay for maximum legibility without harsh blackness */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/75 to-slate-950/85"></div>
          {/* Subtle grid pattern texture */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-16 sm:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-medium text-slate-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Civic Hydrology Platform • Greater Chennai Corporation &amp; IMD</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif leading-[1.15] mb-4">
            AQUAD4C1177
          </h1>

          <p className="text-base sm:text-xl font-medium text-sky-200 tracking-wide mb-6">
            Smart Urban Flood &amp; Drainage Intelligence for Chennai
          </p>

          <div className="max-w-2xl mx-auto mb-10 text-slate-300 text-sm sm:text-base leading-relaxed font-normal space-y-1">
            <p className="italic text-slate-200 text-base sm:text-lg">
              &ldquo;Predict flood risk early. Navigate intelligently. Act before flooding becomes severe.&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-slate-400 pt-2">
              A refined civic intelligence system integrating dynamic watershed models, 
              arterial road elevation datasets, and stormwater canal connectivity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('flood-prediction')}
              id="landing-btn-explore"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <span>Explore Flood Intelligence</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('login')}
              id="landing-btn-signin-hero"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
            </button>
          </div>

          {/* Key Metric Highlights in Hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12 pt-8 border-t border-white/15 text-left">
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded border border-white/10">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Focus Region</div>
              <div className="text-sm font-bold text-white mt-0.5">Chennai Metro (15 Zones)</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded border border-white/10">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Sensors</div>
              <div className="text-sm font-bold text-white mt-0.5">Ultrasonic &amp; Radar</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded border border-white/10">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Predictive Window</div>
              <div className="text-sm font-bold text-white mt-0.5">Now to +3 Hours</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded border border-white/10">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Drainage GIS</div>
              <div className="text-sm font-bold text-white mt-0.5">Macro Canals &amp; SWD</div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Four-Feature Section with Professional Line Icons */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">
              Core Capabilities
            </h2>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Four Core Pillars of Chennai Flood Intelligence
            </p>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Designed for citizens navigating daily commutes and municipal engineers managing stormwater assets during monsoon conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: Flood Prediction */}
            <div 
              onClick={() => onNavigate('flood-prediction')}
              className="p-6 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
              id="feature-card-flood-prediction"
            >
              <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-serif group-hover:text-blue-700 transition-colors">
                Flood Prediction
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Interactive Chennai map with clear four-tier risk classification: Low, Moderate, High, and Critical. Real-time water depth estimates and model confidence ratings.
              </p>
              <span className="text-xs font-semibold text-blue-700 inline-flex items-center gap-1 group-hover:underline">
                View Risk Map <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Feature 2: Flood-Time Navigator */}
            <div 
              onClick={() => onNavigate('navigator')}
              className="p-6 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
              id="feature-card-navigator"
            >
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-serif group-hover:text-emerald-700 transition-colors">
                Flood-Time Navigator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Real Chennai road network routing comparing direct arterial paths against lower-risk alternative routes. Explicitly highlights waterlogged road segments.
              </p>
              <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1 group-hover:underline">
                Plan Route <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Feature 3: Drain Connectivity */}
            <div 
              onClick={() => onNavigate('drain-connectivity')}
              className="p-6 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
              id="feature-card-drain-connectivity"
            >
              <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-serif group-hover:text-amber-700 transition-colors">
                Drain Connectivity
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Dedicated GIS layer tracing storm-water drains from street level to main canals. Instantly visualizes blocked culverts, disconnected reaches, and outfall bottlenecks.
              </p>
              <span className="text-xs font-semibold text-amber-700 inline-flex items-center gap-1 group-hover:underline">
                Inspect Drains <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Feature 4: Weather Forecast */}
            <div 
              onClick={() => onNavigate('weather')}
              className="p-6 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
              id="feature-card-weather"
            >
              <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-5 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <CloudRain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-serif group-hover:text-sky-700 transition-colors">
                Weather Forecast
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Hourly 6-hour precipitation estimates and 5-day outlook with direct hydrological linkage: Rainfall → Drainage Capacity Load → Estimated Flood Inundation.
              </p>
              <span className="text-xs font-semibold text-sky-700 inline-flex items-center gap-1 group-hover:underline">
                Check Weather <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Scientific Transparency Banner */}
      <section className="py-12 bg-slate-100 text-slate-700 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Authentic Road Networks</h4>
                <p className="text-slate-600">Routes are computed along actual Chennai road alignments (OMR, GST, Anna Salai) rather than straight lines, factoring in culvert locations.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Dynamic Time Prediction</h4>
                <p className="text-slate-600">Visual timelines from NOW to +3 Hours highlight when peak inundation will occur, giving residents time to protect property and travel safely.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Radio className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Model &amp; Sensor Calibration</h4>
                <p className="text-slate-600">All data explicitly tags origin: Sensor Data, Live GCC Telemetry, or Model Estimate. No fabricated live numbers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Civic Footer */}
      <footer className="mt-auto bg-white py-8 border-t border-slate-200 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">AQUAD4C1177</span>
            <span>•</span>
            <span>Chennai Municipal Hydrology &amp; Drainage Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Greater Chennai Corporation GIS</span>
            <span>•</span>
            <span>IMD Chennai Met Center</span>
            <span>•</span>
            <span>Tamil Nadu SDMA</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
