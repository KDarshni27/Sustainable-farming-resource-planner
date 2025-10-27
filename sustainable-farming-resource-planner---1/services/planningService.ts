import { State, Action, PlannerConfiguration, GrowthStage, Field, ActionType } from '../types';
import { CROP_PROPERTIES } from '../constants';

// Helper to create a unique key for a state to check for visited states
const getStateKey = (state: Omit<State, 'cost' | 'heuristic' | 'totalCost' | 'plan'>): string => {
  const fieldKey = state.fields.map(f => `${f.id}-${f.growthStage}-${f.isWatered}-${f.isFertilized}`).join(',');
  return `${fieldKey}|w:${state.resources.water}|f:${state.resources.fertilizer}|t:${state.resources.time}`;
};


// Heuristic function: sum of remaining growth stages for all non-harvested fields
const calculateHeuristic = (fields: Field[]): number => {
  return fields.reduce((acc, field) => {
    if (field.growthStage !== GrowthStage.HARVESTED) {
      // Each growth stage requires watering and fertilizing (2 actions) + an advance day action.
      // Harvesting is one more action.
      const stagesToGo = GrowthStage.HARVESTABLE - field.growthStage;
      return acc + (stagesToGo * 3) + 1;
    }
    return acc;
  }, 0);
};

const isGoalState = (fields: Field[]): boolean => {
  return fields.every(field => field.growthStage === GrowthStage.HARVESTED);
};

const getApplicableActions = (state: State): Action[] => {
    const actions: Action[] = [];
    const timeStep = state.resources.time;

    // Check actions for each field
    state.fields.forEach(field => {
        if (field.growthStage === GrowthStage.HARVESTED) return;

        const cropProps = CROP_PROPERTIES[field.crop];

        // Harvest action
        if (field.growthStage === GrowthStage.HARVESTABLE) {
            actions.push({ type: 'HARVEST', fieldId: field.id, timeStep });
            return; // If harvestable, it's the only logical action for this field
        }

        // Irrigate action
        if (!field.isWatered && state.resources.water >= cropProps.waterNeed) {
            actions.push({ type: 'IRRIGATE', fieldId: field.id, timeStep });
        }

        // Fertilize action
        if (!field.isFertilized && state.resources.fertilizer >= cropProps.fertilizerNeed) {
            actions.push({ type: 'FERTILIZE', fieldId: field.id, timeStep });
        }
    });

    // If there are no productive actions to take (irrigate, fertilize, harvest),
    // then the only available action is to advance to the next day to allow crops to grow.
    // This prevents the planner from creating useless states by advancing time prematurely.
    if (actions.length === 0 && !isGoalState(state.fields)) {
        actions.push({ type: 'ADVANCE_DAY', fieldId: -1, timeStep });
    }

    return actions;
};


const applyAction = (currentState: State, action: Action): State => {
    const newState: State = JSON.parse(JSON.stringify(currentState)); // Deep copy
    
    newState.plan = [...newState.plan, action];
    newState.cost += 1; // Each action has a cost of 1
    
    if (action.type === 'ADVANCE_DAY') {
        newState.resources.time += 1;
        newState.fields.forEach(f => {
            if (f.growthStage < GrowthStage.HARVESTABLE && f.isWatered && f.isFertilized) {
                f.growthStage += 1;
                f.isWatered = false;
                f.isFertilized = false;
            }
        });
    } else {
        const field = newState.fields.find(f => f.id === action.fieldId)!;
        const cropProps = CROP_PROPERTIES[field.crop];

        switch (action.type) {
            case 'IRRIGATE':
                field.isWatered = true;
                newState.resources.water -= cropProps.waterNeed;
                break;
            case 'FERTILIZE':
                field.isFertilized = true;
                newState.resources.fertilizer -= cropProps.fertilizerNeed;
                break;
            case 'HARVEST':
                field.growthStage = GrowthStage.HARVESTED;
                break;
        }
    }
    
    newState.heuristic = calculateHeuristic(newState.fields);
    newState.totalCost = newState.cost + newState.heuristic;

    return newState;
};


export const solve = (config: PlannerConfiguration): Action[] | null => {
  const initialFields = config.fields;
  const initialResources = { ...config.resources, time: 0 };
  
  const h = calculateHeuristic(initialFields);
  const initialState: State = {
    fields: initialFields,
    resources: initialResources,
    cost: 0,
    heuristic: h,
    totalCost: h,
    plan: [],
  };

  const frontier: State[] = [initialState];
  const visited = new Set<string>();
  visited.add(getStateKey(initialState));

  let iterations = 0;
  const maxIterations = 10000; // Increased safety break for more complex scenarios

  while (frontier.length > 0) {
    iterations++;
    if (iterations > maxIterations) {
        console.error("Max iterations reached. Aborting.");
        return null;
    }

    // Sort frontier to act as a priority queue (lowest totalCost first)
    frontier.sort((a, b) => a.totalCost - b.totalCost);
    const currentState = frontier.shift()!;

    if (isGoalState(currentState.fields)) {
      // The plan is now generated correctly, no need for post-processing.
      return currentState.plan;
    }

    const actions = getApplicableActions(currentState);
    
    for (const action of actions) {
        const nextState = applyAction(currentState, action);
        const nextStateKey = getStateKey(nextState);

        if (!visited.has(nextStateKey)) {
            visited.add(nextStateKey);
            frontier.push(nextState);
        }
    }
  }

  return null; // No solution found
};