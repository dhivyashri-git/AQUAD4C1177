import React, { useState } from 'react';
import { DrainageNetworkItem, ConnectivityStatus, WorkerCrew } from '../types';
import { CHENNAI_WORKER_CREWS } from '../data/chennaiData';
import { MapComponent } from './MapComponent';
import { 
  GitBranch, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  ArrowDown, 
  Info, 
  FileText, 
  SlidersHorizontal,
  X,
  ExternalLink,
  Wrench,
  Users,
  HardHat,
  Link,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface DrainConnectivityViewProps {
  initialAreaName?: string;
  onDispatchWorkOrder?: (drain: DrainageNetworkItem) => void;
  onNavigateToWorkersDashboard?: () => void;
  drainageList: DrainageNetworkItem[];
  onUpdateDrain: (updatedDrain: DrainageNetworkItem) => void;
}

export const DrainConnectivityView: React.FC<DrainConnectivityViewProps> = ({
  initialAreaName,
  onDispatchWorkOrder,
  onNavigateToWorkersDashboard,
  drainageList,
  onUpdateDrain
}) => {
  // Find initial drain or default to D-104 (Perungudi)
  const initialDrain = initialAreaName 
    ? drainageList.find(d => d.area.toLowerCase().includes(initialAreaName.toLowerCase())) || drainageList[0]
    : drainageList[0]; // D-104

  const [selectedDrain, setSelectedDrain] = useState<DrainageNetworkItem | null>(initialDrain);
  const [showTechnicalDetailsModal, setShowTechnicalDetailsModal] = useState<boolean>(false);
  const [showAssignWorkersModal, setShowAssignWorkersModal] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Quick Worker Assignment state
  const [selectedCrewId, setSelectedCrewId] = useState<string>(CHENNAI_WORKER_CREWS[0].id);
  const [workInstructions, setWorkInstructions] = useState<string>('Clear culvert silt and excavate emergency bypass');

  const filteredDrains = drainageList.filter(d => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'BLOCKED') return d.status === 'CONNECTIVITY BLOCKED' || d.status === 'DISCONNECTED';
    if (filterStatus === 'CONNECTED') return d.status === 'CONNECTED';
    if (filterStatus === 'INCOMPLETE') return d.status === 'NETWORK INFORMATION INCOMPLETE';
    return true;
  });

  const getStatusBadge = (status: ConnectivityStatus, workStatus?: string) => {
    if (workStatus === 'IN_PROGRESS' || workStatus === 'WORKERS_ASSIGNED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 animate-pulse">
          <HardHat className="w-3.5 h-3.5 text-amber-700" />
          CREW WORKING
        </span>
      );
    }

    switch (status) {
      case 'CONNECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            CONNECTED
          </span>
        );
      case 'CONNECTIVITY BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-100 text-red-800 text-xs font-bold border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            CONNECTIVITY BLOCKED
          </span>
        );
      case 'DISCONNECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
            DISCONNECTED
          </span>
        );
      case 'NETWORK INFORMATION INCOMPLETE':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            NETWORK INFORMATION INCOMPLETE
          </span>
        );
    }
  };

  // Action: Assign Workers to Blocked Drain
  const handleAssignWorkersSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrain) return;

    const crew = CHENNAI_WORKER_CREWS.find(c => c.id === selectedCrewId) || CHENNAI_WORKER_CREWS[0];
    
    const updated: DrainageNetworkItem = {
      ...selectedDrain,
      assignedWorkerCrew: crew.crewName,
      workStatus: 'IN_PROGRESS',
      lastVerified: 'Just now (Crew Deployed)'
    };

    onUpdateDrain(updated);
    setSelectedDrain(updated);
    setShowAssignWorkersModal(false);

    setSuccessToast(`Workers Assigned: ${crew.crewName} dispatched to ${selectedDrain.code}.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Action: Add Connectivity & Restore Link
  const handleRestoreConnectivity = () => {
    if (!selectedDrain) return;

    const targetCanalName = selectedDrain.networkHierarchy.canal.includes('unavailable') 
      ? 'South Buckingham Canal Outfall Channel' 
      : selectedDrain.networkHierarchy.canal;

    const updated: DrainageNetworkItem = {
      ...selectedDrain,
      status: 'CONNECTED',
      workStatus: 'RESTORED',
      downstreamConnection: `Restored Link: Connected to ${targetCanalName} via Bypass Box Culvert`,
      blockedPoint: undefined,
      networkHierarchy: {
        ...selectedDrain.networkHierarchy,
        canal: targetCanalName,
        isBlockedAtMainDrainToCanal: false,
        isBlockedAtLocalDrain: false
      },
      possibleImpact: 'Normal active gravity outflow restored. Floodwaters draining cleanly into canal basin.',
      lastVerified: 'Just now (Link Established)'
    };

    onUpdateDrain(updated);
    setSelectedDrain(updated);

    setSuccessToast(`Connectivity established for ${selectedDrain.code}! Downstream link to ${targetCanalName} is now active.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] sm:h-[calc(100vh-6.5rem)] flex flex-col md:flex-row overflow-hidden bg-slate-100">
      {/* Left Drainage Inspection Sidebar */}
      <div className="w-full md:w-[380px] lg:w-[410px] bg-white border-b md:border-b-0 md:border-r border-slate-200 shadow-md z-20 flex flex-col shrink-0 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-amber-700 text-white flex items-center justify-center font-bold">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 font-serif">
                CANAL / DRAIN CONNECTIVITY
              </h2>
              <p className="text-[11px] text-slate-500">
                Stormwater Runoff &amp; Outfall Structural Verification
              </p>
            </div>
          </div>
        </div>

        {/* Success Toast Notification */}
        {successToast && (
          <div className="p-2.5 bg-emerald-50 border-b border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium">{successToast}</span>
          </div>
        )}

        {/* Quick Filter Pill Tabs */}
        <div className="p-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-1 overflow-x-auto text-[11px]">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
              filterStatus === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Channels ({drainageList.length})
          </button>
          <button
            onClick={() => setFilterStatus('BLOCKED')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
              filterStatus === 'BLOCKED' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Blocked / Disconnected
          </button>
          <button
            onClick={() => setFilterStatus('CONNECTED')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
              filterStatus === 'CONNECTED' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Connected
          </button>
          <button
            onClick={() => setFilterStatus('INCOMPLETE')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
              filterStatus === 'INCOMPLETE' ? 'bg-slate-700 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Incomplete
          </button>
        </div>

        {/* Drains List Selection (Clickable) */}
        <div className="p-3 space-y-2 border-b border-slate-200 max-h-48 overflow-y-auto">
          {filteredDrains.map(drain => {
            const isSelected = selectedDrain?.id === drain.id;
            return (
              <div
                key={drain.id}
                onClick={() => setSelectedDrain(drain)}
                className={`p-2.5 rounded-md border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-semibold' 
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold">{drain.code}</span>
                    <span className="text-[10px] opacity-80">({drain.area})</span>
                  </div>
                  <div className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'} truncate max-w-[200px]`}>
                    {drain.name}
                  </div>
                </div>

                <div className="text-right">
                  {drain.workStatus === 'IN_PROGRESS' ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-950">
                      CREW ON SITE
                    </span>
                  ) : (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      drain.status === 'CONNECTED' ? 'bg-emerald-100 text-emerald-800' :
                      drain.status === 'CONNECTIVITY BLOCKED' ? 'bg-red-100 text-red-800' :
                      drain.status === 'DISCONNECTED' ? 'bg-orange-100 text-orange-800' :
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {drain.status.includes('BLOCKED') ? 'BLOCKED' : 
                       drain.status.includes('DISCONNECTED') ? 'DISCONNECTED' : 
                       drain.status.includes('CONNECTED') ? 'CONNECTED' : 'INCOMPLETE'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Drain Detailed Information Panel */}
        {selectedDrain && (
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* Header with Code & Status */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {selectedDrain.code}
                </span>
                {getStatusBadge(selectedDrain.status, selectedDrain.workStatus)}
              </div>
              <h3 className="font-bold text-xs text-slate-800">
                {selectedDrain.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                Area: {selectedDrain.area} • {selectedDrain.ward}
              </p>
            </div>

            {/* Workers Assigned Banner if applicable */}
            {selectedDrain.assignedWorkerCrew && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-[11px] text-amber-950 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <HardHat className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 block">Municipal Field Crew Dispatched:</span>
                    <span>{selectedDrain.assignedWorkerCrew}</span>
                  </div>
                </div>
                {onNavigateToWorkersDashboard && (
                  <button
                    onClick={onNavigateToWorkersDashboard}
                    className="text-[10px] text-blue-700 hover:underline font-bold shrink-0 mt-0.5"
                  >
                    View Logs →
                  </button>
                )}
              </div>
            )}

            {/* Spec Requirement: Visual Network Tree */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Hydrological Discharge Hierarchy
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                {/* Level 1: Street */}
                <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                  <div className="truncate">
                    <span className="text-slate-500 font-semibold">Street:</span>{' '}
                    <span className="text-slate-800 font-sans">{selectedDrain.networkHierarchy.street}</span>
                  </div>
                </div>

                <div className="flex justify-center text-slate-400">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>

                {/* Level 2: Local Drain */}
                <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <div className="truncate">
                    <span className="text-slate-500 font-semibold">Local Drain:</span>{' '}
                    <span className="text-slate-800 font-sans">{selectedDrain.networkHierarchy.localDrain}</span>
                  </div>
                </div>

                <div className="flex justify-center text-slate-400">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>

                {/* Level 3: Main Drain */}
                <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <div className="truncate">
                    <span className="text-slate-500 font-semibold">Main Drain:</span>{' '}
                    <span className="text-slate-800 font-sans">{selectedDrain.networkHierarchy.mainDrain}</span>
                  </div>
                </div>

                {/* Transition to Canal: Downstream connection check */}
                {selectedDrain.status === 'CONNECTIVITY BLOCKED' || selectedDrain.status === 'DISCONNECTED' ? (
                  <>
                    <div className="flex justify-center text-red-600 font-bold text-sm my-0.5">
                      ✕
                    </div>

                    <div className="flex items-center gap-2 p-1.5 bg-red-50 rounded border border-red-300 text-red-900">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      <div className="truncate">
                        <span className="font-semibold text-red-700">Target Canal:</span>{' '}
                        <span className="font-sans line-through opacity-75">{selectedDrain.networkHierarchy.canal}</span>
                      </div>
                    </div>
                  </>
                ) : selectedDrain.status === 'NETWORK INFORMATION INCOMPLETE' ? (
                  <>
                    <div className="flex justify-center text-slate-400 text-sm my-0.5">
                      ?
                    </div>

                    <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded border border-slate-300 text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                      <div className="truncate font-sans text-[11px]">
                        Connectivity data unavailable
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center text-emerald-600">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex items-center gap-2 p-1.5 bg-emerald-50 rounded border border-emerald-300 text-emerald-900">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <div className="truncate">
                        <span className="font-semibold text-emerald-700">Canal / Outlet:</span>{' '}
                        <span className="font-sans">{selectedDrain.networkHierarchy.canal}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Downstream Connection Message */}
            <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
              selectedDrain.status === 'CONNECTIVITY BLOCKED' || selectedDrain.status === 'DISCONNECTED'
                ? 'bg-red-50/80 border-red-200 text-red-900'
                : selectedDrain.status === 'CONNECTED'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="font-bold text-[11px] mb-1">
                {selectedDrain.status === 'CONNECTIVITY BLOCKED' || selectedDrain.status === 'DISCONNECTED' ? (
                  <span>Downstream Connection: Not detected</span>
                ) : selectedDrain.status === 'CONNECTED' ? (
                  <span>Downstream Connection: Verified ({selectedDrain.downstreamConnection})</span>
                ) : (
                  <span>Downstream Connection: Network information incomplete</span>
                )}
              </div>
              <p className="text-[11px] opacity-90">
                <strong>Possible Impact:</strong> {selectedDrain.possibleImpact}
              </p>
              <div className="text-[10px] opacity-75 mt-1">
                Last verified: {selectedDrain.lastVerified}
              </div>
            </div>

            {/* USER REQUEST REQUIREMENT: "Add connectivity if not connected assign workers" */}
            {selectedDrain.status !== 'CONNECTED' ? (
              <div className="space-y-2 p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Channel Not Connected — Required Civic Action</span>
                </div>
                <p className="text-[10px] text-amber-800">
                  Assign field personnel to inspect and clear culvert blockage, or restore downstream bypass link.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {/* Button 1: Assign Workers */}
                  <button
                    type="button"
                    onClick={() => setShowAssignWorkersModal(true)}
                    id="btn-assign-workers-drain"
                    className="py-2 px-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <HardHat className="w-3.5 h-3.5 text-amber-400" />
                    <span>Assign Workers</span>
                  </button>

                  {/* Button 2: Add Connectivity */}
                  <button
                    type="button"
                    onClick={handleRestoreConnectivity}
                    id="btn-add-connectivity-restore"
                    className="py-2 px-2.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Add Connectivity</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="font-bold block">Active Drainage Linkage</span>
                  <span className="text-[10px] text-emerald-700">Outflow functioning normally into downstream receptor.</span>
                </div>
              </div>
            )}

            {/* Spec: Keep Technical information inside [ View Details ] */}
            <div>
              <button
                type="button"
                onClick={() => setShowTechnicalDetailsModal(true)}
                id="btn-view-drain-details"
                className="w-full py-2 px-3 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>[ View Details ] Technical Engineering Data</span>
              </button>
            </div>

            {/* Quick link to Workers Dashboard */}
            {onNavigateToWorkersDashboard && (
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={onNavigateToWorkersDashboard}
                  className="text-[11px] text-slate-600 hover:text-slate-900 font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <span>View All Field Crews in Workers Dashboard</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Map View Showing Drainage Layers */}
      <div className="relative flex-1 w-full h-full">
        <MapComponent
          layers={{
            floodRisk: false,
            rainfall: false,
            drainage: true,
            canals: true,
            waterlogging: true,
            sensors: false,
            roads: true
          }}
          drainageItems={filteredDrains}
          selectedDrainId={selectedDrain?.id || null}
          onSelectDrain={(drain) => setSelectedDrain(drain)}
          heightClass="h-full"
        />

        {/* Floating Drainage Legend on Map */}
        <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-md p-3 shadow-md text-xs max-w-xs">
          <div className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[10px]">
            Drainage Visual Key
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-1 bg-blue-600 rounded"></span>
              <span className="text-slate-700">Connected Drainage Line</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-1 bg-red-600 border-b border-dashed border-white rounded"></span>
              <span className="text-red-700 font-medium">Disconnected / Red Segment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[9px]">
                ✕
              </div>
              <span className="text-red-700 font-medium">Blocked Connection Marker</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-1 bg-slate-400 border-b border-dashed border-white rounded"></span>
              <span className="text-slate-600">Unknown / Grey Dashed Line</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <span className="w-6 h-2 bg-sky-700 rounded"></span>
              <span className="text-slate-700">Major Arterial Canals</span>
            </div>
          </div>
        </div>
      </div>

      {/* ASSIGN WORKERS MODAL (For Unconnected Drains) */}
      {showAssignWorkersModal && selectedDrain && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  MUNICIPAL WORKERS ALLOCATION
                </div>
                <div className="text-base font-bold font-serif">
                  Assign Crew to {selectedDrain.code}
                </div>
              </div>
              <button 
                onClick={() => setShowAssignWorkersModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignWorkersSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Target Channel &amp; Area</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedDrain.name} ({selectedDrain.area})</div>
                <div className="text-[11px] text-red-600 font-medium">Status: {selectedDrain.status}</div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Select Municipal Field Worker Crew
                </label>
                <select
                  value={selectedCrewId}
                  onChange={(e) => setSelectedCrewId(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-slate-300 text-xs bg-white text-slate-900 font-medium"
                >
                  {CHENNAI_WORKER_CREWS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.crewName} ({c.memberCount} Personnel • {c.supervisor})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Work Order Description / Instructions
                </label>
                <textarea
                  value={workInstructions}
                  onChange={(e) => setWorkInstructions(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-md border border-slate-300 text-xs"
                  required
                />
              </div>

              <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900">
                <strong>Flood Preparedness Link:</strong> Deployment logged under Greater Chennai Corporation Stormwater Special Response Team for Today's rainfall emergency.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignWorkersModal(false)}
                  className="px-3.5 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-slate-900 text-white font-semibold hover:bg-slate-800"
                >
                  Dispatch Crew Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Technical Engineering Dialog Modal (Opened via [ View Details ]) */}
      {showTechnicalDetailsModal && selectedDrain && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          id="modal-drain-technical-details"
        >
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] text-sky-400 font-bold uppercase tracking-widest font-mono">
                  GCC GIS ASSET PROFILE
                </div>
                <div className="text-base font-bold font-serif">
                  {selectedDrain.code} • {selectedDrain.name}
                </div>
              </div>
              <button
                onClick={() => setShowTechnicalDetailsModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Channel Cross-Section</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedDrain.technicalDetails?.channelWidth || '2.4 m Precast RCC'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Hydraulic Gradient</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedDrain.technicalDetails?.gradient || '1 in 800'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Design Capacity</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedDrain.capacityCusecs} Cusecs
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Current Flow Volume</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedDrain.currentFlowPercentage}% of Capacity
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Sediment / Siltation Status</span>
                  <span className="font-medium text-slate-800">
                    {selectedDrain.technicalDetails?.sedimentSiltLevel || 'Routine silt level'}
                  </span>
                </div>

                <div className="p-2.5 rounded border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Last Desilting Cycle</span>
                  <span className="font-medium text-slate-800">
                    {selectedDrain.technicalDetails?.lastDesilted || 'Pre-monsoon verification'}
                  </span>
                </div>

                <div className="p-2.5 rounded border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Pumping Station &amp; Sump Support</span>
                  <span className="font-medium text-slate-800">
                    {selectedDrain.technicalDetails?.pumpingStationSupport || 'Gravity flow dependent'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-[11px] text-blue-900">
                <strong>Municipal Action Note:</strong> Routine telemetry inspection verified by Greater Chennai Corporation Special Works Division under Smart Cities Urban Flood Mitigation Plan.
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowTechnicalDetailsModal(false)}
                className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
