import React, { useState, useEffect } from 'react';
import { AppView, UserProfile, DrainageNetworkItem, WorkerTask } from './types';
import { 
  CHENNAI_FLOOD_ZONES, 
  CHENNAI_SENSORS,
  CHENNAI_DRAINAGE_NETWORK,
  CHENNAI_WORKER_TASKS
} from './data/chennaiData';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { FloodPredictionView } from './components/FloodPredictionView';
import { NavigatorView } from './components/NavigatorView';
import { DrainConnectivityView } from './components/DrainConnectivityView';
import { WeatherView } from './components/WeatherView';
import { ReportsView } from './components/ReportsView';
import { WorkersAdminView } from './components/WorkersAdminView';

export default function App() {
  // Initialize view from URL path if available
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/login') return 'login';
      if (path === '/dashboard' || path === '/flood-prediction') return 'flood-prediction';
      if (path === '/navigator') return 'navigator';
      if (path === '/drain-connectivity') return 'drain-connectivity';
      if (path === '/weather') return 'weather';
      if (path === '/workers' || path === '/admin') return 'workers';
      if (path === '/reports') return 'reports';
    }
    return 'landing';
  });

  // Default logged-in user profile (can be switched to GCC Admin or logged out)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'usr-cit-01',
    name: 'K. Rajasekaran',
    email: 'citizen@chennaiflow.gov.in',
    role: 'citizen',
    designation: 'Resident & Commuter',
    ward: 'Ward 178 (Velachery East)',
    division: 'Zone 13 Adyar'
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [navDestinationParam, setNavDestinationParam] = useState<string>('Velachery MRTS Station');
  const [drainAreaParam, setDrainAreaParam] = useState<string>('Perungudi');

  // Centralized interactive State for Drains & Workers
  const [drainageList, setDrainageList] = useState<DrainageNetworkItem[]>(CHENNAI_DRAINAGE_NETWORK);
  const [workerTasks, setWorkerTasks] = useState<WorkerTask[]>(CHENNAI_WORKER_TASKS);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/login') setCurrentView('login');
      else if (path === '/navigator') setCurrentView('navigator');
      else if (path === '/drain-connectivity') setCurrentView('drain-connectivity');
      else if (path === '/weather') setCurrentView('weather');
      else if (path === '/workers' || path === '/admin') setCurrentView('workers');
      else if (path === '/reports') setCurrentView('reports');
      else if (path === '/dashboard' || path === '/flood-prediction') setCurrentView('flood-prediction');
      else setCurrentView('landing');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      const path = view === 'landing' ? '/' : `/${view}`;
      window.history.pushState(null, '', path);
    }
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    navigateTo('flood-prediction');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigateTo('login');
  };

  const handleSwitchRole = () => {
    if (!currentUser) return;
    if (currentUser.role === 'citizen') {
      setCurrentUser({
        id: 'usr-admin-01',
        name: 'Er. S. Sundaram, M.E.',
        email: 'admin@chennai.gov.in',
        role: 'admin',
        designation: 'Executive Engineer (Stormwater Drains & Canals)',
        ward: 'Greater Chennai Corporation HQ (Ripon Building)',
        division: 'South Region Special Works'
      });
    } else {
      setCurrentUser({
        id: 'usr-cit-01',
        name: 'K. Rajasekaran',
        email: 'citizen@chennaiflow.gov.in',
        role: 'citizen',
        designation: 'Resident & Commuter',
        ward: 'Ward 178 (Velachery East)',
        division: 'Zone 13 Adyar'
      });
    }
  };

  // Drainage update handler
  const handleUpdateDrain = (updatedDrain: DrainageNetworkItem) => {
    setDrainageList(prev => prev.map(d => d.id === updatedDrain.id ? updatedDrain : d));

    // If workers are newly assigned or status changed, sync to workerTasks
    if (updatedDrain.assignedWorkerCrew && updatedDrain.workStatus === 'IN_PROGRESS') {
      setWorkerTasks(prev => {
        const existingIdx = prev.findIndex(t => t.drainCode === updatedDrain.code && t.status === 'In Progress');
        if (existingIdx >= 0) return prev;

        const newTask: WorkerTask = {
          id: `task-w-${Date.now().toString().slice(-4)}`,
          crewId: 'crew-01',
          crewName: updatedDrain.assignedWorkerCrew || 'GCC Rapid Dewatering Unit 04',
          supervisor: 'Er. K. Murugan',
          drainCode: updatedDrain.code,
          area: `${updatedDrain.name} (${updatedDrain.area})`,
          ward: updatedDrain.ward,
          workType: 'Clear Blockage & Restore Connectivity',
          status: 'In Progress',
          assignedDate: 'Just now',
          targetCompletion: 'Today within 2 hours',
          weatherAssumptionLink: 'Assigned due to Day 1 & Day 2 Flood Occurrence Assumption',
          equipmentUsed: 'Super Sucker Jetting Tanker & High-Volume Dewatering Pump',
          notes: `Dispatched to address connectivity block for ${updatedDrain.code}.`,
          connectivityRestored: false
        };
        return [newTask, ...prev];
      });
    }
  };

  // Restore drain connectivity by drainCode
  const handleRestoreDrainConnectivity = (drainCode: string) => {
    setDrainageList(prev => prev.map(d => {
      if (d.code === drainCode) {
        const targetCanalName = d.networkHierarchy.canal.includes('unavailable') 
          ? 'South Buckingham Canal Outfall Channel' 
          : d.networkHierarchy.canal;
        return {
          ...d,
          status: 'CONNECTED',
          workStatus: 'RESTORED',
          downstreamConnection: `Restored Link: Connected to ${targetCanalName} via Bypass Box Culvert`,
          blockedPoint: undefined,
          networkHierarchy: {
            ...d.networkHierarchy,
            canal: targetCanalName,
            isBlockedAtMainDrainToCanal: false,
            isBlockedAtLocalDrain: false
          },
          possibleImpact: 'Normal active gravity outflow restored. Floodwaters draining cleanly into canal basin.',
          lastVerified: 'Just now (Admin Action Verified)'
        };
      }
      return d;
    }));
  };

  // Add a new task from WorkersAdminView
  const handleAddWorkerTask = (newTask: WorkerTask) => {
    setWorkerTasks(prev => [newTask, ...prev]);

    // If assigned to a drain, update the drain in drainageList
    if (newTask.drainCode) {
      setDrainageList(prev => prev.map(d => {
        if (d.code === newTask.drainCode) {
          return {
            ...d,
            assignedWorkerCrew: newTask.crewName,
            workStatus: 'IN_PROGRESS',
            lastVerified: 'Just now (Crew Deployed)'
          };
        }
        return d;
      }));
    }
  };

  // Complete a worker task
  const handleCompleteWorkerTask = (taskId: string) => {
    let completedDrainCode: string | undefined;

    setWorkerTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        completedDrainCode = t.drainCode;
        return {
          ...t,
          status: 'Completed - Connected',
          connectivityRestored: true,
          targetCompletion: 'Completed Today'
        };
      }
      return t;
    }));

    if (completedDrainCode) {
      handleRestoreDrainConnectivity(completedDrainCode);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* 1. SEPARATE LANDING PAGE */}
      {currentView === 'landing' && (
        <LandingPage onNavigate={navigateTo} />
      )}

      {/* 2. SEPARATE LOGIN PAGE */}
      {currentView === 'login' && (
        <LoginPage 
          onNavigate={navigateTo} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}

      {/* 3. MAIN DASHBOARD APPLICATION (Header + Map-First Views) */}
      {currentView !== 'landing' && currentView !== 'login' && (
        <>
          <Header
            currentView={currentView}
            onNavigate={navigateTo}
            user={currentUser}
            onLogout={handleLogout}
            onSwitchRole={handleSwitchRole}
            isDemoMode={isDemoMode}
            onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
          />

          <main className="flex-1 relative flex flex-col">
            {/* View 1: Flood Prediction (Map-First Primary Experience) */}
            {currentView === 'flood-prediction' && (
              <FloodPredictionView
                floodZones={CHENNAI_FLOOD_ZONES}
                sensors={CHENNAI_SENSORS}
                onNavigateToNavigator={(dest) => {
                  setNavDestinationParam(dest);
                  navigateTo('navigator');
                }}
                onNavigateToDrain={(area) => {
                  setDrainAreaParam(area);
                  navigateTo('drain-connectivity');
                }}
              />
            )}

            {/* View 2: Flood-Time Navigator */}
            {currentView === 'navigator' && (
              <NavigatorView
                floodZones={CHENNAI_FLOOD_ZONES}
                initialDestinationName={navDestinationParam}
              />
            )}

            {/* View 3: Drain Connectivity */}
            {currentView === 'drain-connectivity' && (
              <DrainConnectivityView
                initialAreaName={drainAreaParam}
                drainageList={drainageList}
                onUpdateDrain={handleUpdateDrain}
                onNavigateToWorkersDashboard={() => navigateTo('workers')}
                onDispatchWorkOrder={(drain) => {
                  navigateTo('workers');
                }}
              />
            )}

            {/* View 4: Weather Forecast & Flood Impact Cascade */}
            {currentView === 'weather' && (
              <WeatherView
                onNavigateToFloodMap={() => navigateTo('flood-prediction')}
                onNavigateToWorkers={() => navigateTo('workers')}
              />
            )}

            {/* View 5: Workers Dashboard & Field History */}
            {currentView === 'workers' && (
              <WorkersAdminView
                user={currentUser}
                tasksList={workerTasks}
                onAddTask={handleAddWorkerTask}
                onCompleteTask={handleCompleteWorkerTask}
                onNavigateToDrain={(area) => {
                  setDrainAreaParam(area);
                  navigateTo('drain-connectivity');
                }}
                onRestoreConnectivity={handleRestoreDrainConnectivity}
              />
            )}

            {/* View 6: Reports & Civic Rapid Response */}
            {currentView === 'reports' && (
              <ReportsView
                user={currentUser}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}
