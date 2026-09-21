import React, { useState } from 'react';
import { WorkerCrew, WorkerTask, UserProfile, DrainageNetworkItem } from '../types';
import { 
  CHENNAI_WORKER_CREWS, 
  CHENNAI_WORKER_TASKS,
  CHENNAI_DRAINAGE_NETWORK 
} from '../data/chennaiData';
import { 
  HardHat, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Wrench, 
  Phone, 
  Truck, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  CloudRain, 
  Calendar, 
  ArrowRight, 
  Check, 
  X,
  Building2,
  Users,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface WorkersAdminViewProps {
  user: UserProfile | null;
  onNavigateToDrain?: (areaName: string) => void;
  onRestoreConnectivity?: (drainCode: string) => void;
  tasksList: WorkerTask[];
  onAddTask: (task: WorkerTask) => void;
  onCompleteTask: (taskId: string) => void;
}

export const WorkersAdminView: React.FC<WorkersAdminViewProps> = ({
  user,
  onNavigateToDrain,
  onRestoreConnectivity,
  tasksList,
  onAddTask,
  onCompleteTask
}) => {
  const [crews] = useState<WorkerCrew[]>(CHENNAI_WORKER_CREWS);
  const [activeTab, setActiveTab] = useState<'tasks' | 'crews'>('tasks');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);

  // New task form state
  const [selectedCrewId, setSelectedCrewId] = useState<string>(crews[0].id);
  const [selectedDrainCode, setSelectedDrainCode] = useState<string>('DRAIN D-104');
  const [workType, setWorkType] = useState<WorkerTask['workType']>('Clear Blockage & Restore Connectivity');
  const [taskNotes, setTaskNotes] = useState<string>('');
  const [equipmentInput, setEquipmentInput] = useState<string>('Super Sucker Unit & 100 HP Mobile Pump');

  const filteredTasks = tasksList.filter(task => {
    if (filterStatus !== 'ALL' && task.status !== filterStatus) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        task.area.toLowerCase().includes(q) ||
        task.crewName.toLowerCase().includes(q) ||
        task.supervisor.toLowerCase().includes(q) ||
        (task.drainCode && task.drainCode.toLowerCase().includes(q)) ||
        task.weatherAssumptionLink.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const inProgressCount = tasksList.filter(t => t.status === 'In Progress').length;
  const completedCount = tasksList.filter(t => t.status.includes('Completed')).length;
  const totalPersonnel = crews.reduce((acc, c) => acc + c.memberCount, 0);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const crew = crews.find(c => c.id === selectedCrewId) || crews[0];
    const drain = CHENNAI_DRAINAGE_NETWORK.find(d => d.code === selectedDrainCode) || CHENNAI_DRAINAGE_NETWORK[0];

    const newTask: WorkerTask = {
      id: `task-w-${Date.now().toString().slice(-4)}`,
      crewId: crew.id,
      crewName: crew.crewName,
      supervisor: crew.supervisor,
      drainCode: drain.code,
      area: `${drain.name} (${drain.area})`,
      ward: drain.ward,
      workType,
      status: 'In Progress',
      assignedDate: 'Just now',
      targetCompletion: 'Today within 3 hours',
      weatherAssumptionLink: 'Assigned due to Weather Flood Impact: 92% Canal load at South Buckingham',
      equipmentUsed: equipmentInput || crew.vehicleAssigned,
      notes: taskNotes || `Dispatched to inspect and resolve hydraulic connectivity for ${drain.code}.`,
      connectivityRestored: false
    };

    onAddTask(newTask);
    setShowAssignModal(false);
    setTaskNotes('');
  };

  const handleMarkDone = (taskId: string, drainCode?: string) => {
    onCompleteTask(taskId);
    if (drainCode && onRestoreConnectivity) {
      onRestoreConnectivity(drainCode);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-6.5rem)] bg-slate-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                <HardHat className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                WORKERS DASHBOARD &amp; FIELD HISTORY
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 uppercase">
                GCC Operations Command
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Municipal Field Personnel Tracking, Flood Task Allocations &amp; Drainage Restoration History
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAssignModal(true)}
              id="btn-open-assign-workers-modal"
              className="px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Assign Workers / Dispatch Crew</span>
            </button>
          </div>
        </div>

        {/* Flood Alert Weather Assumption Correlation Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-white border border-amber-200 text-xs shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <CloudRain className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Weather-Driven Task Dispatch Matrix</span>
                  <span className="text-[10px] px-2 py-0.2 bg-red-100 text-red-800 rounded font-bold uppercase">
                    Level 3 Full Mobilization
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Worker crews are deployed in direct response to the <strong>Day 1 &amp; Day 2 Flood Occurrence Assumption</strong> (110–145 mm storm precipitation). 
                  Priority focus is restoring severed connectivity at <strong>D-104 (Perungudi)</strong>, <strong>M-310 (Madipakkam)</strong>, and <strong>SM-701 (Semmancheri)</strong> before peak runoff at 12:45 PM.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 bg-white/90 p-2.5 rounded-lg border border-amber-200 text-center">
              <div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Total Field Personnel</div>
                <div className="text-lg font-bold text-slate-900">{totalPersonnel}</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Active In Field</div>
                <div className="text-lg font-bold text-amber-700">{inProgressCount} Crews</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Restored Links</div>
                <div className="text-lg font-bold text-emerald-700">{completedCount} Drains</div>
              </div>
            </div>
          </div>
        </div>

        {/* View Tabs: Tasks History vs Active Crews */}
        <div className="flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'tasks' 
                  ? 'border-slate-900 text-slate-900' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Assigned Work &amp; Task History ({tasksList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('crews')}
              className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'crews' 
                  ? 'border-slate-900 text-slate-900' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Municipal Worker Crews ({crews.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: WORKERS HISTORY & LIVE TASK LOGS */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            {/* Filters and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center gap-1 overflow-x-auto">
                <span className="text-slate-400 font-medium text-[11px] mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Filter:
                </span>
                {['ALL', 'In Progress', 'Completed - Connected'].map(st => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                      filterStatus === st 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st === 'Completed - Connected' ? 'Restored / Completed' : st}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search drain, crew or ward..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 pl-8 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>

            {/* Task History Cards List */}
            <div className="space-y-3">
              {filteredTasks.map(task => {
                const isInProgress = task.status === 'In Progress';
                const isCompleted = task.status.includes('Completed');

                return (
                  <div 
                    key={task.id}
                    className={`p-4 rounded-xl border text-xs transition-all ${
                      isInProgress 
                        ? 'bg-white border-amber-300 shadow-xs' 
                        : 'bg-white/80 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          {task.drainCode && (
                            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-900 text-white">
                              {task.drainCode}
                            </span>
                          )}
                          <h3 className="font-bold text-sm text-slate-900">
                            {task.area}
                          </h3>
                          <span className="text-[11px] text-slate-500 font-medium">
                            • {task.ward}
                          </span>
                        </div>
                        <div className="text-slate-600 font-medium mt-0.5">
                          Task: <strong className="text-slate-800">{task.workType}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase border ${
                          isInProgress 
                            ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' 
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}>
                          {isInProgress ? 'Field Crew Active' : 'Connectivity Restored'}
                        </span>
                      </div>
                    </div>

                    {/* Mid Details: Crew & Equipment & Weather Correlation */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 text-[11px] border-b border-slate-100">
                      <div>
                        <span className="text-slate-400 font-semibold uppercase block text-[10px]">Assigned Worker Crew</span>
                        <div className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                          <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{task.crewName}</span>
                        </div>
                        <div className="text-slate-500 mt-0.5">Supervisor: {task.supervisor}</div>
                      </div>

                      <div>
                        <span className="text-slate-400 font-semibold uppercase block text-[10px]">Heavy Machinery &amp; Equipment</span>
                        <div className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                          <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{task.equipmentUsed}</span>
                        </div>
                        <div className="text-slate-500 mt-0.5">Assigned: {task.assignedDate}</div>
                      </div>

                      <div>
                        <span className="text-slate-400 font-semibold uppercase block text-[10px]">Weather Flood Rationale</span>
                        <div className="font-medium text-purple-900 flex items-start gap-1 mt-0.5 bg-purple-50 p-1.5 rounded border border-purple-200">
                          <CloudRain className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{task.weatherAssumptionLink}</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Notes & Action Buttons */}
                    <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="text-slate-600 text-[11px] flex-1">
                        <strong>Progress Notes:</strong> {task.notes}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onNavigateToDrain && task.drainCode && (
                          <button
                            onClick={() => onNavigateToDrain(task.area)}
                            className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <span>Inspect on Drain Map</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {isInProgress && (
                          <button
                            onClick={() => handleMarkDone(task.id, task.drainCode)}
                            className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Mark Completed &amp; Restore Link</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE CREWS OVERVIEW */}
        {activeTab === 'crews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crews.map(crew => (
              <div 
                key={crew.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between text-xs space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {crew.unitCode}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      crew.currentStatus === 'Active On Site' 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {crew.currentStatus}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 font-sans">
                    {crew.crewName}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Specialization: <strong className="text-slate-700">{crew.specialization}</strong>
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Supervisor / Officer:</span>
                    <span className="font-semibold text-slate-900">{crew.supervisor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Emergency Phone:</span>
                    <span className="font-mono text-blue-700 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {crew.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Personnel Strength:</span>
                    <span className="font-semibold text-slate-900">{crew.memberCount} Certified Workers</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Assigned Ward:</span>
                    <span className="font-semibold text-slate-900">{crew.assignedWard}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 text-slate-700 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate font-medium">{crew.vehicleAssigned}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedCrewId(crew.id);
                      setShowAssignModal(true);
                    }}
                    className="w-full py-2 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Assign this Crew to a Blocked Area</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: ASSIGN WORKERS TO DRAIN / FLOOD TASK */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  MUNICIPAL FIELD DISPATCH
                </div>
                <div className="text-base font-bold font-serif">
                  Assign Workers &amp; Restore Drainage Connectivity
                </div>
              </div>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-5 space-y-3.5 text-xs">
              {/* Select Crew */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Assign Municipal Field Crew
                </label>
                <select
                  value={selectedCrewId}
                  onChange={(e) => setSelectedCrewId(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-slate-300 text-xs bg-white text-slate-900 font-medium"
                >
                  {crews.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.crewName} ({c.memberCount} Workers • {c.supervisor})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Drain Selection */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Target Drain / Channel
                </label>
                <select
                  value={selectedDrainCode}
                  onChange={(e) => setSelectedDrainCode(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-slate-300 text-xs bg-white text-slate-900 font-medium"
                >
                  {CHENNAI_DRAINAGE_NETWORK.map(d => (
                    <option key={d.id} value={d.code}>
                      {d.code} - {d.name} ({d.area}) - Status: {d.status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Type */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Operational Task Type
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value as any)}
                  className="w-full p-2.5 rounded-md border border-slate-300 text-xs bg-white text-slate-900 font-medium"
                >
                  <option value="Clear Blockage & Restore Connectivity">Clear Blockage &amp; Restore Connectivity</option>
                  <option value="Emergency Dewatering 100HP Pump">Emergency Dewatering 100HP Pump</option>
                  <option value="Culvert Bypass Trenching">Culvert Bypass Trenching</option>
                  <option value="Siltation Removal">Siltation Removal</option>
                </select>
              </div>

              {/* Equipment Used */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Equipment / Vehicle Allocated
                </label>
                <input
                  type="text"
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                  placeholder="e.g. Super Sucker Jetting Tanker + High-Volume Dewatering Pump"
                  className="w-full p-2.5 rounded-md border border-slate-300 text-xs"
                  required
                />
              </div>

              {/* Weather Rationale Hint */}
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900">
                <strong>Weather Assumption Link:</strong> Automatically tagged to Today's Heavy Rain Forecast (Day 1 Flood Alert) for accountability and emergency audit logs.
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Task Instructions / Site Notes
                </label>
                <textarea
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  rows={2}
                  placeholder="Specify culvert mouth location, bypass alignment, or utility safety measures..."
                  className="w-full p-2.5 rounded-md border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-3.5 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-slate-900 text-white font-semibold hover:bg-slate-800"
                >
                  Dispatch Crew &amp; Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
