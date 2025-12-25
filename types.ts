import { LucideIcon } from 'lucide-react';

export enum ViewState {
  HOME = 'HOME',
  EXPERIMENT_CIRCLE = 'EXPERIMENT_CIRCLE',
  EXPERIMENT_EXPLAIN = 'EXPERIMENT_EXPLAIN',
  EXPERIMENT_SPEND = 'EXPERIMENT_SPEND',
  EXPERIMENT_DILEMMA = 'EXPERIMENT_DILEMMA',
  EXPERIMENT_CRAFT = 'EXPERIMENT_CRAFT',
  EXPERIMENT_QUEST = 'EXPERIMENT_QUEST',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export interface ExperimentMetadata {
  id: ViewState | string;
  title: string;
  description: string;
  icon?: LucideIcon; // Optional now to support image-only games
  coverImage?: string; // URL or Base64 string for uploaded logo
  color: string;
  tag: 'AI' | 'Interactive' | 'Game';
}

export interface Point {
  x: number;
  y: number;
}

export interface ShopItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface Dilemma {
  scenario: string;
  optionA: string;
  optionB: string;
}

export interface CraftElement {
  name: string;
  emoji: string;
}

export interface InstanceElement extends CraftElement {
  id: string; // Unique ID for the instance on the workspace
  x: number;
  y: number;
}
