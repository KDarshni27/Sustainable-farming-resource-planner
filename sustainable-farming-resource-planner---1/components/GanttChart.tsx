import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Plan, PlannerConfiguration, ActionType } from '../types';

interface GanttChartProps {
  plan: Plan;
  config: PlannerConfiguration;
}

// FIX: Add 'ADVANCE_DAY' to satisfy the Record<ActionType, string> type.
// This action type is not visualized on the chart but is required for type safety,
// and it resolves the "Property 'ADVANCE_DAY' is missing" error.
const ACTION_COLORS: Record<ActionType, string> = {
    IRRIGATE: '#3b82f6',  // Blue-500
    FERTILIZE: '#22c55e', // Green-500
    GROW: '#eab308',      // Yellow-500
    HARVEST: '#10b981',   // Emerald-500
    ADVANCE_DAY: '#64748b', // Slate-500
};


const GanttChart: React.FC<GanttChartProps> = ({ plan, config }) => {
  const chartData = config.fields.map(field => {
    const fieldActions = plan.filter(a => a.fieldId === field.id);
    const dataPoint: { name: string; [key: string]: any } = { name: `Field ${field.id} (${field.crop})` };

    fieldActions.forEach(action => {
      // Each action takes one time step. The bar starts at the action's timeStep and has a length of 1.
      dataPoint[`${action.type}-${action.timeStep}`] = [action.timeStep, action.timeStep + 1];
    });

    return dataPoint;
  });

  return (
    <div className="w-full h-96 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" domain={[0, 'dataMax + 1']} stroke="#94a3b8" />
          <YAxis type="category" dataKey="name" stroke="#94a3b8" width={120} />
          <Tooltip
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#e2e8f0' }}
            formatter={(value: unknown, name) => {
                const type = name.toString().split('-')[0];
                // FIX: The `value` from recharts can be `unknown`. While `Array.isArray` narrows it to `unknown[]`,
                // its elements are still `unknown` and cannot be used in template literals directly.
                // We must cast them to a known type like `number` or `string`.
                if (Array.isArray(value) && value.length === 2) {
                    return [`Time: ${value[0] as number} - ${value[1] as number}`, type];
                }
                return [String(value), type];
            }}
          />
          <Legend />
          {/* FIX: Refactored the bar rendering logic. The original nested .map() was inefficient and caused a TypeScript type inference error where 'actionType' was treated as 'unknown'. This is simplified to a single .map() over the plan, which is more performant, readable, and resolves the type error. */}
          {plan.map((action, index) => {
            // ADVANCE_DAY actions aren't associated with a specific field's timeline, so we don't render a bar for them.
            if (action.type === 'ADVANCE_DAY') {
              return null;
            }
            return (
              <Bar
                key={`${action.type}-${action.timeStep}-${index}`}
                dataKey={`${action.type}-${action.timeStep}`}
                stackId="a"
                fill={ACTION_COLORS[action.type]}
                name={action.type}
                barSize={20}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GanttChart;