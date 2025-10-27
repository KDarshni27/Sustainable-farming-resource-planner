
import React from 'react';
import { CropType, TabData } from './types';

export const CROP_PROPERTIES: Record<CropType, { waterNeed: number; fertilizerNeed: number }> = {
  WHEAT: { waterNeed: 2, fertilizerNeed: 1 },
  CORN: { waterNeed: 3, fertilizerNeed: 2 },
  SOY: { waterNeed: 2, fertilizerNeed: 2 },
  POTATO: { waterNeed: 3, fertilizerNeed: 3 },
  CARROT: { waterNeed: 2, fertilizerNeed: 2 },
  TOMATO: { waterNeed: 4, fertilizerNeed: 3 },
};

// FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension.
const MethodologyContent = () => (
    React.createElement('div', { className: "space-y-4 prose prose-invert max-w-none prose-h3:text-green-400 prose-strong:text-green-300" },
        React.createElement('h3', null, 'State Representation'),
        React.createElement('p', null, 'A state in our planning problem is a snapshot of the entire farm. It includes:'),
        React.createElement('ul', null,
            React.createElement('li', null, "For each field: its current growth stage, whether it's been watered, and whether it's been fertilized in the current growth cycle."),
            React.createElement('li', null, "Available resources: the remaining units of water and fertilizer."),
            React.createElement('li', null, "Current timestep.")
        ),
        React.createElement('pre', null, 
            React.createElement('code', { className: "language-js" }, `
State = {
    fields: [ {id, crop, growthStage, isWatered, isFertilized}, ... ],
    resources: { water, fertilizer, time }
}
`)
        ),
        React.createElement('h3', null, 'Actions (Operators)'),
        React.createElement('p', null, 'Actions transition the farm from one state to another. They have preconditions (what must be true to perform the action) and effects (how the state changes after the action).'),
        React.createElement('ul', null,
            React.createElement('li', null, 
                React.createElement('strong', null, 'Irrigate(field):'),
                React.createElement('ul', null,
                    React.createElement('li', null, React.createElement('strong', null, 'Preconditions:'), " Field is not already watered; sufficient water is available."),
                    React.createElement('li', null, React.createElement('strong', null, 'Effects:'), " Water resource decreases; field's `isWatered` status becomes true.")
                )
            ),
            React.createElement('li', null, 
                React.createElement('strong', null, 'Fertilize(field):'),
                React.createElement('ul', null,
                    React.createElement('li', null, React.createElement('strong', null, 'Preconditions:'), " Field is not already fertilized; sufficient fertilizer is available."),
                    React.createElement('li', null, React.createElement('strong', null, 'Effects:'), " Fertilizer resource decreases; field's `isFertilized` status becomes true.")
                )
            ),
            React.createElement('li', null, 
                React.createElement('strong', null, 'Grow(field):'),
                React.createElement('ul', null,
                    React.createElement('li', null, React.createElement('strong', null, 'Preconditions:'), " Field has been both watered and fertilized in the current growth cycle."),
                    React.createElement('li', null, React.createElement('strong', null, 'Effects:'), " Growth stage of the crop in the field advances; `isWatered` and `isFertilized` are reset for the next stage.")
                )
            ),
            React.createElement('li', null, 
                React.createElement('strong', null, 'Harvest(field):'),
                React.createElement('ul', null,
                    React.createElement('li', null, React.createElement('strong', null, 'Preconditions:'), " Crop is at the 'HARVESTABLE' stage."),
                    React.createElement('li', null, React.createElement('strong', null, 'Effects:'), " Field status becomes 'HARVESTED'.")
                )
            )
        ),
        React.createElement('h3', null, 'Goal State'),
        React.createElement('p', null, "The goal is to reach a state where all fields have the status 'HARVESTED'. The planner's objective is to find the shortest sequence of actions to achieve this goal.")
    )
);


// FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension.
export const TABS: TabData[] = [
    { id: 'planner', label: 'Planner', content: '' },
    { 
        id: 'abstract', 
        label: 'Abstract', 
        content: React.createElement('p', { className: "prose prose-invert max-w-none" },
            "This project introduces a classical AI planning system for sustainable agriculture resource management. The system, termed the Sustainable Farming Resource Planner, utilizes an A* search algorithm to generate optimal schedules for irrigation, fertilization, and harvesting across multiple crop fields. It operates under strict constraints of limited water, fertilizer, and time. By modeling the farm as a state-space problem with defined actions (e.g., irrigate, fertilize) and goals (e.g., all crops harvested), the planner produces an efficient, step-by-step action plan. The output is visualized as a Gantt chart, providing farmers with a clear and actionable timeline to maximize yield while conserving precious resources, demonstrating the practical application of AI in addressing real-world agricultural challenges."
        )
    },
    { 
        id: 'problem', 
        label: 'Problem Definition', 
        content: React.createElement('div', { className: "space-y-4 prose prose-invert max-w-none" },
              React.createElement('p', null, "Sustainable agriculture faces a critical challenge: optimizing resource allocation. Farmers must make complex, interdependent decisions daily about which fields to irrigate, when to apply fertilizer, and the optimal time to harvest. These decisions are complicated by several factors:"),
              React.createElement('ul', { className: "list-disc pl-5" },
                React.createElement('li', null, React.createElement('strong', null, "Limited Resources:"), " Water is increasingly scarce due to climate change, and fertilizers are costly and have environmental impacts. There is often not enough of these resources to apply them ideally to every field."),
                React.createElement('li', null, React.createElement('strong', null, "Time Constraints:"), " Crops have specific growth windows. Actions must be performed in a timely sequence to ensure healthy development and a successful harvest. Delaying one action can have cascading negative effects on the entire crop cycle."),
                React.createElement('li', null, React.createElement('strong', null, "Scalability:"), " As the number of fields and crop diversity increases, the complexity of scheduling grows exponentially, making manual planning inefficient and prone to error.")
              ),
              React.createElement('p', null, "There is no perfect, one-size-fits-all solution. Weather is unpredictable, soil conditions vary, and market demands fluctuate. Therefore, a tool that can rapidly generate a \"good enough\" plan based on current conditions is invaluable. This is where classical AI planning provides a powerful framework for finding an optimal sequence of actions within a well-defined model of the problem.")
            )
    },
    { id: 'methodology', label: 'Proposed Methodology', content: React.createElement(MethodologyContent, null) },
    { 
        id: 'implementation', 
        label: 'Implementation', 
        content: React.createElement('div', { className: "space-y-4 prose prose-invert max-w-none prose-h3:text-green-400" },
            React.createElement('h3', null, "Core Algorithm: A* Search"),
            React.createElement('p', null,
              "This planner is implemented in TypeScript within a React application. The core of the planner is the A* search algorithm, a classic and powerful pathfinding and graph traversal algorithm known for its completeness and optimality."
            ),
            React.createElement('ul', null,
              React.createElement('li', null, React.createElement('strong', null, "Frontier (Open List):"), " A priority queue is used to store states that have been discovered but not yet evaluated. States are prioritized based on their `f(n)` value, which is the sum of the cost to reach the state and the estimated cost to the goal. In this implementation, we use a simple array that is sorted at each step to simulate a priority queue."),
              React.createElement('li', null, React.createElement('strong', null, "Explored Set (Closed List):"), " A set stores the states that have already been evaluated to prevent cycles and redundant computations. A state is uniquely identified by a string hash of its field statuses and remaining resources."),
              React.createElement('li', null, React.createElement('strong', null, "Heuristic Function `h(n)`:"), " The heuristic provides an estimate of the cost to get from the current state to the goal. A good heuristic is crucial for the efficiency of A*. Our heuristic is the total number of growth stages remaining across all non-harvested fields. This is an admissible heuristic (it never overestimates the true cost), which guarantees that A* will find the optimal solution.")
            ),
            React.createElement('h3', null, "Data Structures"),
            React.createElement('p', null,
              "The state of the farm, actions, and the plan are represented using TypeScript interfaces for type safety and clarity. The main `solve` function orchestrates the A* search, starting with the initial user-defined configuration and terminating when a goal state is reached or the frontier is empty."
            )
          )
    },
];