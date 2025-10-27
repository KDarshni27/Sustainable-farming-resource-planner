// FIX: Import React to resolve "Cannot find namespace 'React'" error.
import React from 'react';

export type CropType = 'WHEAT' | 'CORN' | 'SOY' | 'POTATO' | 'CARROT' | 'TOMATO';

export enum GrowthStage {
  SEED = 0,
  SPROUT = 1,
  MATURE = 2,
  HARVESTABLE = 3,
  HARVESTED = 4,
}

export interface Field {
  id: number;
  crop: CropType;
  growthStage: GrowthStage;
  isWatered: boolean;
  isFertilized: boolean;
}

export interface Resources {
  water: number;
  fertilizer: number;
  time: number;
}

export interface PlannerConfiguration {
    fields: Field[];
    resources: Omit<Resources, 'time'>;
}

export interface State {
  fields: Field[];
  resources: Resources;
  cost: number; // g(n) - cost from start to current node
  heuristic: number; // h(n) - estimated cost from current to goal
  totalCost: number; // f(n) = g(n) + h(n)
  plan: Action[];
}

export type ActionType = 'IRRIGATE' | 'FERTILIZE' | 'HARVEST' | 'GROW' | 'ADVANCE_DAY';

export interface Action {
  type: ActionType;
  fieldId: number;
  timeStep: number;
}

export type Plan = Action[];

export type Tab = 'planner' | 'abstract' | 'problem' | 'methodology' | 'implementation' | 'example' | 'visualization' | 'conclusion';

export interface TabData {
    id: Tab;
    label: string;
    content: React.ReactNode;
}