import React, { useState } from 'react';
import { 
  AppView, 
  UserProfile 
} from '../types';
import { 
  Shield, 
  MapPin, 
  Navigation, 
  GitBranch, 
  CloudRain, 
  FileText, 
  Bell, 
  User, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  Info,
  HardHat
} from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onSwitchRole?: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  user,
  onLogout,
  onSwitchRole,
  isDemoMode,
  onToggleDemoMode,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Critical Flood Alert: Perungudi & Mudichur',
      time: '12 mins ago',
      type: 'critical',
      desc: 'Estimated water depth reaching 0.45–0.65 m along OMR service lane.'
    },
    {
      id: 'notif-2',
      title: 'Dewatering Pumps Dispatched to Ward 184',
      time: '28 mins ago',
      type: 'info',
      desc: 'GCC South Region engineers deployed mobile 100 HP pump.'
    },
    {
      id: 'notif-3',
      title: 'Adyar River Stage Gauge Reached Warning Level',
      time: '45 mins ago',
      type: 'warning',
      desc: 'Saidapet bridge sensor current level: 3.85 m (Warning: 4.20 m).'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {/* Top Banner for Data Status & Role */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-0.5">
          <span className="flex items-center gap-1 font-semibold text-white tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            GREATER CHENNAI CORPORATION (GCC) &amp; IMD TELEMETRY
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="flex items-center gap-1">
            <span className="text-slate-400">Status:</span>
            <span className="text-slate-200 font-medium">LIVE MODEL ACTIVE</span>
          </span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="hidden md:inline text-slate-400">Last updated: <strong className="text-slate-200">10:42 AM IST</strong></span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleDemoMode}
            id="btn-toggle-demo-mode"
            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase transition-colors ${
              isDemoMode 
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' 
                : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
            }`}
            title="Toggle between live telemetry and verified historical simulation data"
          >
            {isDemoMode ? 'DEMO MODE (VERIFIED)' : 'LIVE TELEMETRY'}
          </button>
          
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span>Operating Region:</span>
            <span className="text-white font-medium">Chennai, TN</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group"
          id="header-brand-logo"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold tracking-tighter shadow-xs group-hover:bg-slate-800 transition-colors">
            <Shield className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 leading-none font-serif">
                AQUAD4C1177
              </span>
              <span className="text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                Chennai
              </span>
            </div>
            <p className="text-[11px] text-slate-500 tracking-tight leading-tight mt-0.5 hidden sm:block">
              Smart Urban Flood &amp; Drainage Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1" id="nav-desktop-tabs">
          <button
            onClick={() => onNavigate('flood-prediction')}
            id="nav-tab-flood-prediction"
            className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              currentView === 'flood-prediction'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Flood Intelligence</span>
          </button>

          <button
            onClick={() => onNavigate('navigator')}
            id="nav-tab-navigator"
            className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              currentView === 'navigator'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Navigator</span>
          </button>

          <button
            onClick={() => onNavigate('drain-connectivity')}
            id="nav-tab-drain-connectivity"
            className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              currentView === 'drain-connectivity'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Drain Connectivity</span>
          </button>

          <button
            onClick={() => onNavigate('weather')}
            id="nav-tab-weather"
            className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              currentView === 'weather'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Weather</span>
          </button>

          <button
            onClick={() => onNavigate('workers')}
            id="nav-tab-workers"
            className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              currentView === 'workers'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HardHat className="w-3.5 h-3.5 text-amber-500" />
            <span>Workers</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            id="nav-tab-reports"
            className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              currentView === 'reports'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Reports</span>
          </button>
        </nav>

        {/* Right Side: Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              id="btn-header-notifications"
              className="relative p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Civic Alerts & Notices"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600"></span>
            </button>

            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg border border-slate-200 shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-2"
                id="panel-notifications-dropdown"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-xs text-slate-900 uppercase tracking-wider">
                      Civic Alerts &amp; Advisories
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">3 Unread</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-md border text-xs ${
                        n.type === 'critical' ? 'bg-red-50/70 border-red-200 text-red-900' :
                        n.type === 'warning' ? 'bg-amber-50/70 border-amber-200 text-amber-900' :
                        'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{n.title}</span>
                        <span className="text-[10px] opacity-75 font-normal">{n.time}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed opacity-90">{n.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 text-center">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('reports');
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View GCC Official Flood Bulletins →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                id="btn-header-user-menu"
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors text-xs text-slate-800"
              >
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-semibold leading-none">{user.name}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                    {user.role === 'admin' ? 'GCC Civic Admin' : 'Citizen'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg border border-slate-200 shadow-lg p-2 z-50 animate-in fade-in"
                  id="panel-user-dropdown"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="font-semibold text-xs text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{user.role === 'admin' ? 'GCC Engineering Admin' : 'Verified Resident'}</span>
                    </div>
                  </div>

                  {onSwitchRole && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onSwitchRole();
                      }}
                      id="btn-switch-role"
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded flex items-center justify-between"
                    >
                      <span>Switch to {user.role === 'admin' ? 'Citizen View' : 'GCC Admin View'}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Toggle</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('reports');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Submitted Reports &amp; Wards</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    id="btn-logout"
                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              id="btn-header-signin"
              className="px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-100 gap-1 bg-slate-50/80">
        <button
          onClick={() => onNavigate('flood-prediction')}
          className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap ${
            currentView === 'flood-prediction' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          Flood Intel
        </button>
        <button
          onClick={() => onNavigate('navigator')}
          className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap ${
            currentView === 'navigator' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          Navigator
        </button>
        <button
          onClick={() => onNavigate('drain-connectivity')}
          className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap ${
            currentView === 'drain-connectivity' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          Drain Connectivity
        </button>
        <button
          onClick={() => onNavigate('weather')}
          className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap ${
            currentView === 'weather' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          Weather
        </button>
        <button
          onClick={() => onNavigate('workers')}
          className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap ${
            currentView === 'workers' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          Workers
        </button>
        <button
          onClick={() => onNavigate('reports')}
          className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap ${
            currentView === 'reports' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          Reports
        </button>
      </div>
    </header>
  );
};
