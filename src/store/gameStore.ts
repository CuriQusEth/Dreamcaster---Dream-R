import { create } from 'zustand';

export type GrowthStage = 'seed' | 'sprout' | 'growing' | 'bloomed';
export type ElementType = 'starlight' | 'moondew' | 'whisperwind' | 'emberheart';

export interface Plant {
  id: string;
  x: number;
  y: number;
  elements: ElementType[];
  stage: GrowthStage;
  health: number; // 0-100
  essence: number;
  createdAt: number;
  lastWatered: number;
}

interface GameState {
  plants: Plant[];
  inventory: Record<ElementType, number>;
  essence: number;
  isRaining: boolean;
  addPlant: (plant: Omit<Plant, 'id' | 'createdAt' | 'lastWatered'>) => void;
  waterPlant: (id: string) => void;
  harvestEssence: (id: string) => void;
  addEssence: (amount: number) => void;
  consumeInventory: (element: ElementType) => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  plants: [],
  inventory: {
    starlight: 5,
    moondew: 5,
    whisperwind: 3,
    emberheart: 1,
  },
  essence: 0,
  isRaining: false,
  
  addPlant: (plantData) => set((state) => ({
    plants: [
      ...state.plants, 
      {
        ...plantData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
        lastWatered: Date.now(),
      }
    ]
  })),

  waterPlant: (id) => set((state) => ({
    plants: state.plants.map(p => 
      p.id === id ? { ...p, health: Math.min(100, p.health + 30), lastWatered: Date.now() } : p
    )
  })),

  harvestEssence: (id) => set((state) => {
    let harvested = 0;
    const updatedPlants = state.plants.map(p => {
      if (p.id === id && p.essence > 0 && p.stage === 'bloomed') {
        harvested = p.essence;
        return { ...p, essence: 0 };
      }
      return p;
    });
    return { plants: updatedPlants, essence: state.essence + harvested };
  }),

  addEssence: (amount) => set((state) => ({ essence: state.essence + amount })),

  consumeInventory: (element) => {
    const { inventory } = get();
    if (inventory[element] > 0) {
      set((state) => ({
        inventory: {
          ...state.inventory,
          [element]: state.inventory[element] - 1
        }
      }));
      return true;
    }
    return false;
  }
}));
