export interface Tile {
  id: string
  text: string
  color: string
  ariaLabel?: string
}

export const DEFAULT_TILES: Tile[] = [
  {
    id: 'help',
    text: 'Ich brauche Hilfe',
    color: '#ef4444',
    ariaLabel: 'Ich brauche Hilfe - Button'
  },
  {
    id: 'drink',
    text: 'Ich möchte trinken',
    color: '#06b6d4',
    ariaLabel: 'Ich möchte trinken - Button'
  },
  {
    id: 'hungry',
    text: 'Ich habe Hunger',
    color: '#3b82f6',
    ariaLabel: 'Ich habe Hunger - Button'
  },
  {
    id: 'outside',
    text: 'Ich möchte rausgehen',
    color: '#10b981',
    ariaLabel: 'Ich möchte rausgehen - Button'
  },
  {
    id: 'slow',
    text: 'Bitte langsam sprechen',
    color: '#f59e0b',
    ariaLabel: 'Bitte langsam sprechen - Button'
  },
  {
    id: 'home',
    text: 'Ich möchte nach Hause',
    color: '#d97706',
    ariaLabel: 'Ich möchte nach Hause - Button'
  },
  {
    id: 'cold',
    text: 'Mir ist kalt',
    color: '#8b5cf6',
    ariaLabel: 'Mir ist kalt - Button'
  },
  {
    id: 'break',
    text: 'Ich brauche eine Pause',
    color: '#ec4899',
    ariaLabel: 'Ich brauche eine Pause - Button'
  },
  {
    id: 'happy',
    text: 'Mir geht es gut',
    color: '#6366f1',
    ariaLabel: 'Mir geht es gut - Button'
  },
  {
    id: 'sad',
    text: 'Mir geht es nicht gut',
    color: '#f43f5e',
    ariaLabel: 'Mir geht es nicht gut - Button'
  },
  {
    id: 'bathroom',
    text: 'Kann ich aufs Klo?',
    color: '#dc2626',
    ariaLabel: 'Kann ich aufs Klo - Button'
  },
  {
    id: 'pain',
    text: 'Mir tut etwas weh',
    color: '#ea580c',
    ariaLabel: 'Mir tut etwas weh - Button'
  },
]
