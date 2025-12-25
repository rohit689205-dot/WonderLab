import { Circle, Brain, DollarSign, Scale, FlaskConical, Sword } from 'lucide-react';
import { ExperimentMetadata, ViewState, ShopItem, CraftElement } from './types';

export const EXPERIMENTS: ExperimentMetadata[] = [
  {
    id: ViewState.EXPERIMENT_CIRCLE,
    title: "Draw a Perfect Circle",
    description: "Test your dexterity. Can you draw a mathematically perfect circle with your mouse?",
    icon: Circle,
    color: "bg-purple-100 text-purple-600",
    tag: 'Interactive'
  },
  {
    id: ViewState.EXPERIMENT_EXPLAIN,
    title: "Explain It Like I'm 5",
    description: "An AI engine that breaks down the most complex topics into simple, emoji-filled explanations.",
    icon: Brain,
    color: "bg-blue-100 text-blue-600",
    tag: 'AI'
  },
  {
    id: ViewState.EXPERIMENT_SPEND,
    title: "Spend the Budget",
    description: "You have $100 Billion. Can you spend it all on ridiculous items before time runs out?",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
    tag: 'Game'
  },
  {
    id: ViewState.EXPERIMENT_DILEMMA,
    title: "Absurd Dilemmas",
    description: "Face AI-generated moral dilemmas that get increasingly ridiculous and difficult.",
    icon: Scale,
    color: "bg-orange-100 text-orange-600",
    tag: 'AI'
  },
  {
    id: ViewState.EXPERIMENT_CRAFT,
    title: "Infinite Craft",
    description: "Combine elements to create anything. From Water + Fire to... The Internet? Powered by AI.",
    icon: FlaskConical,
    color: "bg-indigo-100 text-indigo-600",
    tag: 'Game'
  },
  {
    id: ViewState.EXPERIMENT_QUEST,
    title: "Emoji Quest",
    description: "A pocket-sized RPG. Battle monsters, earn gold, upgrade your gear, and survive as long as you can.",
    icon: Sword,
    color: "bg-red-100 text-red-600",
    tag: 'Game'
  }
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 1, name: "Big Mac", price: 5, image: "🍔" },
  { id: 2, name: "Flip Flops", price: 20, image: "🩴" },
  { id: 3, name: "Video Game", price: 60, image: "🎮" },
  { id: 4, name: "Airpods", price: 200, image: "🎧" },
  { id: 5, name: "Smartphone", price: 1000, image: "📱" },
  { id: 6, name: "Designer Handbag", price: 5000, image: "👜" },
  { id: 7, name: "Jet Ski", price: 12000, image: "🚤" },
  { id: 8, name: "Tesla Model S", price: 90000, image: "🚗" },
  { id: 9, name: "Single Family Home", price: 400000, image: "🏠" },
  { id: 10, name: "Gold Bar", price: 700000, image: "🪙" },
  { id: 11, name: "Superbowl Ad", price: 7000000, image: "📺" },
  { id: 12, name: "Luxury Yacht", price: 25000000, image: "🛳️" },
  { id: 13, name: "F16 Fighter Jet", price: 50000000, image: "✈️" },
  { id: 14, name: "Skyscraper", price: 800000000, image: "🏙️" },
  { id: 15, name: "Cruise Ship", price: 1200000000, image: "🚢" },
  { id: 16, name: "NBA Team", price: 3000000000, image: "🏀" },
];

export const INITIAL_ELEMENTS: CraftElement[] = [
  { name: "Water", emoji: "💧" },
  { name: "Fire", emoji: "🔥" },
  { name: "Wind", emoji: "🌬️" },
  { name: "Earth", emoji: "🌍" },
];
