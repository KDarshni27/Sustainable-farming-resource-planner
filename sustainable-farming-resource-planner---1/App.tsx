import React, { useState, useMemo } from 'react';
import { Plan, PlannerConfiguration, Tab } from './types';
import { TABS } from './constants';
import { solve } from './services/planningService';
import PlannerInput from './components/PlannerInput';
import PlanOutput from './components/PlanOutput';
import GanttChart from './components/GanttChart';
import ProjectInfo from './components/ProjectInfo';
import TabsComponent from './components/Tabs';
import LoginPage from './components/LoginPage';

const PlannerApp: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0].id);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [config, setConfig] = useState<PlannerConfiguration | null>(null);

  const handlePlanRequest = (configuration: PlannerConfiguration) => {
    setIsPlanning(true);
    setPlan(null);
    setError(null);
    setConfig(configuration);
    
    setTimeout(() => {
      try {
        const result = solve(configuration);
        if (result === null) {
          setError("No solution found. Try increasing resources or reducing the number of fields.");
        } else {
          setPlan(result);
        }
      } catch (e) {
        if (e instanceof Error) {
            setError(`An error occurred during planning: ${e.message}`);
        } else {
            setError("An unknown error occurred during planning.");
        }
      } finally {
        setIsPlanning(false);
      }
    }, 50);
  };

  const selectedTabData = useMemo(() => TABS.find(tab => tab.id === activeTab), [activeTab]);

  return (
    <>
      <header className="bg-slate-900/70 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-10 border-b border-slate-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-400">
            Sustainable Farming Resource Planner
          </h1>
          <button
            onClick={onLogout}
            className="py-2 px-4 rounded-md shadow-sm text-sm font-medium text-green-300 bg-transparent border border-green-500 hover:bg-green-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-6 bg-slate-800/50 rounded-lg shadow-xl p-6 border border-slate-700">
          {activeTab === 'planner' && (
            <div>
              <PlannerInput onPlanRequest={handlePlanRequest} isPlanning={isPlanning} />
              
              {isPlanning && (
                <div className="mt-8 flex justify-center items-center flex-col">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
                  <p className="mt-4 text-green-400">Generating optimal plan...</p>
                </div>
              )}

              {error && (
                <div className="mt-8 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                  <h3 className="font-bold">Planning Failed</h3>
                  <p>{error}</p>
                </div>
              )}
              
              {plan && config && (
                <div className="mt-8 space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-green-300 border-b-2 border-green-800/50 pb-2">Generated Plan</h2>
                    <PlanOutput plan={plan} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-green-300 border-b-2 border-green-800/50 pb-2">Plan Visualization</h2>
                    <GanttChart plan={plan} config={config} />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab !== 'planner' && selectedTabData && (
            <ProjectInfo title={selectedTabData.label} content={selectedTabData.content} />
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
          <p>Built by a world-class senior frontend React engineer.</p>
      </footer>
    </>
  );
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {!isAuthenticated ? (
        <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <PlannerApp onLogout={() => setIsAuthenticated(false)} />
      )}
    </div>
  );
};


export default App;