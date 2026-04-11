import { useState } from 'react'

export type TileCategory = 'zuhause' | 'draussen' | 'arzt' | 'essen' | 'notfall'

export interface CustomTile {
  id: string
  title: string
  text: string
  color: string
  category: TileCategory
  createdAt: Date
}

const CATEGORY_LABELS: Record<TileCategory, string> = {
  zuhause: '🏠 Zuhause',
  draussen: '🌳 Draußen',
  arzt: '🏥 Arzt',
  essen: '🍽️ Essen',
  notfall: '🚨 Notfall',
}

const INITIAL_TILES: CustomTile[] = [
  {
    id: '1',
    title: 'Guten Morgen',
    text: 'Guten Morgen! Ich hoffe dir geht es gut.',
    color: '#FFD93D',
    category: 'zuhause',
    createdAt: new Date('2026-04-01'),
  },
  {
    id: '2',
    title: 'Spaziergang',
    text: 'Können wir einen Spaziergang machen?',
    color: '#6BCB77',
    category: 'draussen',
    createdAt: new Date('2026-04-02'),
  },
]

export function useCustomTiles() {
  const [tiles, setTiles] = useState<CustomTile[]>(INITIAL_TILES)

  const addTile = (tile: Omit<CustomTile, 'id' | 'createdAt'>) => {
    const newTile: CustomTile = {
      ...tile,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setTiles([newTile, ...tiles])
    return newTile
  }

  const deleteTile = (id: string) => {
    setTiles(tiles.filter(tile => tile.id !== id))
  }

  const updateTile = (id: string, updates: Partial<Omit<CustomTile, 'id' | 'createdAt'>>) => {
    setTiles(tiles.map(tile => (tile.id === id ? { ...tile, ...updates } : tile)))
  }

  const getTilesByCategory = (category: TileCategory) => {
    return tiles.filter(tile => tile.category === category)
  }

  return {
    tiles,
    addTile,
    deleteTile,
    updateTile,
    getTilesByCategory,
    CATEGORY_LABELS,
  }
}
