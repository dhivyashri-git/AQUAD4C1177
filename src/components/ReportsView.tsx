import React, { useState } from 'react';
import { CivicReport, UserProfile } from '../types';
import { CHENNAI_REPORTS } from '../data/chennaiData';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Download, 
  Filter, 
  MapPin, 
  Building2, 
  Send,
  X,
  Clock,
  Check
} from 'lucide-react';

interface ReportsViewProps {
  user: UserProfile | null;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ user }) => {
  const [reports, setReports] = useState<CivicReport[]>(CHENNAI_REPORTS);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Waterlogging' | 'Blocked Drain' | 'Canal Siltation' | 'Manhole Overflow'>('Waterlogging');
  const [newLocation, setNewLocation] = useState('');
  const [newWard, setNewWard] = useState('Ward 178 (Velachery)');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [exportNotice, setExportNotice] = useState(false);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation) return;

    const createdReport: CivicReport = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      category: newCategory,
      location: newLocation,
      ward: newWard,
      reportedAt: 'Just now',
      status: 'Investigating',
      priority: 'High',
      reporterType: user?.role === 'admin' ? 'GCC Field Inspector' : 'Citizen'
    };

    setReports([createdReport, ...reports]);
    setShowSubmitModal(false);
    setNewTitle('');
    setNewLocation('');
  };

  const handleUpdateStatus = (id: string, newStatus: 'Investigating' | 'Dispatched' | 'Cleared') => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const filteredReports = reports.filter(r => {
    if (filterCategory === 'ALL') return true;
    return r.category === filterCategory;
  });

  const handleExportGIS = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-6.5rem)] bg-slate-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                CIVIC FLOOD REPORTS &amp; FIELD DISPATCH
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 uppercase">
                GCC ICCC System
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Greater Chennai Corporation Ward Rapid Response &amp; Grievance Tracking
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportGIS}
              id="btn-export-gis-reports"
              className="px-3 py-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export GIS Report</span>
            </button>

            <button
              onClick={() => setShowSubmitModal(true)}
              id="btn-submit-new-report"
              className="px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Flooding / Blockage</span>
            </button>
          </div>
        </div>

        {exportNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Chennai Municipal Hydrological GIS CSV &amp; GeoJSON report generated successfully.</span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Filter by:
          </span>
          {['ALL', 'Waterlogging', 'Blocked Drain', 'Canal Siltation'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0 ${
                filterCategory === cat ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {filteredReports.map(rep => (
            <div 
              key={rep.id}
              className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[10px]">{rep.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    rep.priority === 'Critical' ? 'bg-red-100 text-red-800 border border-red-200' :
                    rep.priority === 'High' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                    'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {rep.priority}
                  </span>
                  <span className="font-bold text-slate-900 text-sm font-sans">{rep.title}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {rep.location} ({rep.ward})
                  </span>
                  <span>•</span>
                  <span>Reported by: <strong>{rep.reporterType}</strong></span>
                  <span>•</span>
                  <span>{rep.reportedAt}</span>
                </div>
              </div>

              {/* Status & Admin Action */}
              <div className="flex items-center gap-2 shrink-0 sm:border-l sm:border-slate-100 sm:pl-4">
                <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  rep.status === 'Cleared' ? 'bg-emerald-100 text-emerald-800' :
                  rep.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {rep.status}
                </span>

                {user?.role === 'admin' && (
                  <select
                    value={rep.status}
                    onChange={(e) => handleUpdateStatus(rep.id, e.target.value as any)}
                    className="text-[11px] p-1 rounded border border-slate-300 bg-slate-50 font-medium"
                  >
                    <option value="Investigating">Set: Investigating</option>
                    <option value="Dispatched">Set: Dispatched</option>
                    <option value="Cleared">Set: Cleared</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Report Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                  CITIZEN &amp; FIELD INCIDENT REPORT
                </div>
                <div className="text-base font-bold font-serif">
                  Report Waterlogging or Drain Blockage
                </div>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Issue Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2 rounded border border-slate-300 text-xs bg-white"
                >
                  <option value="Waterlogging">Waterlogging / Inundation on Road</option>
                  <option value="Blocked Drain">Blocked Storm-water Drain / Culvert</option>
                  <option value="Canal Siltation">Canal Siltation &amp; Garbage Choke</option>
                  <option value="Manhole Overflow">Manhole / Chamber Backflow</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Location Details</label>
                <input
                  type="text"
                  placeholder="e.g. Velachery 100ft Road Near Bus Stand"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ward / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Ward 178 (Velachery) / Zone 13"
                  value={newWard}
                  onChange={(e) => setNewWard(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Short Description</label>
                <textarea
                  placeholder="Describe water depth, vehicle stoppage, or culvert blockage..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  rows={3}
                  className="w-full p-2 rounded border border-slate-300 text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-3 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-slate-900 text-white font-semibold hover:bg-slate-800"
                >
                  Submit to GCC Rapid Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
