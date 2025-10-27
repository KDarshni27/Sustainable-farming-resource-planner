import React from 'react';
import { Plan } from '../types';

interface PlanOutputProps {
  plan: Plan;
}

const PlanOutput: React.FC<PlanOutputProps> = ({ plan }) => {
  const getActionDescription = (action: Plan[0]) => {
    switch (action.type) {
      case 'IRRIGATE':
        return `Irrigate Field ${action.fieldId}`;
      case 'FERTILIZE':
        return `Fertilize Field ${action.fieldId}`;
      case 'GROW':
        return `Let Field ${action.fieldId} Grow`;
      case 'HARVEST':
        return `Harvest Field ${action.fieldId}`;
      case 'ADVANCE_DAY':
        return `End of Day ${action.timeStep}. Crops grow.`;
      default:
        return 'Unknown Action';
    }
  };

  const getActionIcon = (actionType: Plan[0]['type']) => {
    switch(actionType) {
        case 'IRRIGATE': return '💧';
        case 'FERTILIZE': return '🌱';
        case 'GROW': return '☀️';
        case 'HARVEST': return '🌾';
        case 'ADVANCE_DAY': return '🌅';
        default: return '➡️';
    }
  }

  return (
    <div className="bg-slate-900/50 p-4 rounded-lg max-h-96 overflow-y-auto border border-slate-700">
      <ol className="relative border-l border-slate-700">
        {plan.map((action, index) => (
          <li key={index} className="mb-6 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-green-900/50 rounded-full -left-4 ring-4 ring-slate-800 text-xl">
              {getActionIcon(action.type)}
            </span>
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 shadow-sm">
                <div className="flex justify-between items-center">
                    <p className="text-md font-semibold text-green-300">{getActionDescription(action)}</p>
                    { action.type !== 'ADVANCE_DAY' &&
                        <time className="block mb-2 text-sm font-normal leading-none text-slate-400">Day {action.timeStep}</time>
                    }
                </div>
            </div>
          </li>
        ))}
         <li className="ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-green-900/50 rounded-full -left-4 ring-4 ring-slate-800 text-xl">
              🏁
            </span>
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 shadow-sm">
                 <p className="text-md font-semibold text-green-300">Plan Complete</p>
            </div>
          </li>
      </ol>
    </div>
  );
};

export default PlanOutput;