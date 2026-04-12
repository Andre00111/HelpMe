import { TileCategory, CustomTile } from '../hooks/useCustomTiles'

export interface SetupTile extends Omit<CustomTile, 'id' | 'createdAt'> {
  setupId: string // Temporäre ID für Setup
}

export const SETUP_TILES_BY_CATEGORY: Record<TileCategory, SetupTile[]> = {
  zuhause: [
    {
      setupId: 'home-1',
      title: 'Guten Morgen',
      text: 'Guten Morgen! Ich hoffe, dir geht es gut.',
      color: '#f59e0b',
      category: 'zuhause',
    },
    {
      setupId: 'home-2',
      title: 'Guten Abend',
      text: 'Guten Abend! Schöner Tag heute.',
      color: '#d97706',
      category: 'zuhause',
    },
    {
      setupId: 'home-3',
      title: 'Ich bin müde',
      text: 'Mir ist müde. Ich möchte schlafen.',
      color: '#8b5cf6',
      category: 'zuhause',
    },
    {
      setupId: 'home-4',
      title: 'Fernsehen',
      text: 'Können wir fernsehen?',
      color: '#3b82f6',
      category: 'zuhause',
    },
    {
      setupId: 'home-5',
      title: 'Musik hören',
      text: 'Können wir Musik hören?',
      color: '#ec4899',
      category: 'zuhause',
    },
    {
      setupId: 'home-6',
      title: 'Gemeinsam spielen',
      text: 'Können wir zusammen spielen?',
      color: '#10b981',
      category: 'zuhause',
    },
  ],
  draussen: [
    {
      setupId: 'out-1',
      title: 'Spaziergang',
      text: 'Können wir einen Spaziergang machen?',
      color: '#6BCB77',
      category: 'draussen',
    },
    {
      setupId: 'out-2',
      title: 'Schönes Wetter',
      text: 'Das ist ein schöner Tag!',
      color: '#4ECDC4',
      category: 'draussen',
    },
    {
      setupId: 'out-3',
      title: 'Ich bin kalt',
      text: 'Mir ist kalt. Können wir reingehen?',
      color: '#A29BFE',
      category: 'draussen',
    },
    {
      setupId: 'out-4',
      title: 'Ich bin müde',
      text: 'Mir ist müde. Ich möchte mich hinsetzen.',
      color: '#FAB1A0',
      category: 'draussen',
    },
    {
      setupId: 'out-5',
      title: 'Wasser trinken',
      text: 'Ich möchte Wasser trinken.',
      color: '#74B9FF',
      category: 'draussen',
    },
    {
      setupId: 'out-6',
      title: 'Toilette',
      text: 'Ich muss auf die Toilette.',
      color: '#DDA15E',
      category: 'draussen',
    },
  ],
  arzt: [
    {
      setupId: 'doc-1',
      title: 'Mir tut etwas weh',
      text: 'Mir tut etwas weh.',
      color: '#FF7675',
      category: 'arzt',
    },
    {
      setupId: 'doc-2',
      title: 'Kopfschmerzen',
      text: 'Mir tut der Kopf weh.',
      color: '#E17055',
      category: 'arzt',
    },
    {
      setupId: 'doc-3',
      title: 'Bauchschmerzen',
      text: 'Mir tut der Bauch weh.',
      color: '#D63031',
      category: 'arzt',
    },
    {
      setupId: 'doc-4',
      title: 'Ich bin nervös',
      text: 'Ich bin ein bisschen nervös.',
      color: '#A29BFE',
      category: 'arzt',
    },
    {
      setupId: 'doc-5',
      title: 'Mehr Zeit',
      text: 'Können wir langsamer machen?',
      color: '#74B9FF',
      category: 'arzt',
    },
    {
      setupId: 'doc-6',
      title: 'Fragen?',
      text: 'Kann ich eine Frage stellen?',
      color: '#DDA15E',
      category: 'arzt',
    },
  ],
  essen: [
    {
      setupId: 'food-1',
      title: 'Ich habe Hunger',
      text: 'Mir ist hungrig. Können wir essen?',
      color: '#FFEAA7',
      category: 'essen',
    },
    {
      setupId: 'food-2',
      title: 'Das schmeckt gut',
      text: 'Das schmeckt sehr lecker!',
      color: '#FFD93D',
      category: 'essen',
    },
    {
      setupId: 'food-3',
      title: 'Das mag ich nicht',
      text: 'Das mag ich leider nicht.',
      color: '#FF7675',
      category: 'essen',
    },
    {
      setupId: 'food-4',
      title: 'Mehr bitte',
      text: 'Kann ich noch mehr haben?',
      color: '#FFC93D',
      category: 'essen',
    },
    {
      setupId: 'food-5',
      title: 'Ich bin satt',
      text: 'Ich bin satt. Danke!',
      color: '#6BCB77',
      category: 'essen',
    },
    {
      setupId: 'food-6',
      title: 'Trinken',
      text: 'Ich möchte etwas trinken.',
      color: '#74B9FF',
      category: 'essen',
    },
  ],
  notfall: [
    {
      setupId: 'emergency-1',
      title: 'Hilfe!',
      text: 'Ich brauche Hilfe!',
      color: '#FF0000',
      category: 'notfall',
    },
    {
      setupId: 'emergency-2',
      title: 'Arzt rufen',
      text: 'Bitte rufen Sie einen Arzt!',
      color: '#D63031',
      category: 'notfall',
    },
    {
      setupId: 'emergency-3',
      title: 'Ich bin in Panik',
      text: 'Mir ist angst. Ich brauche Hilfe!',
      color: '#E17055',
      category: 'notfall',
    },
    {
      setupId: 'emergency-4',
      title: 'Mir geht es nicht gut',
      text: 'Mir geht es wirklich nicht gut!',
      color: '#FF7675',
      category: 'notfall',
    },
    {
      setupId: 'emergency-5',
      title: 'Rufen Sie jemanden',
      text: 'Bitte rufen Sie sofort jemanden an!',
      color: '#D63031',
      category: 'notfall',
    },
    {
      setupId: 'emergency-6',
      title: 'Ich bin allein',
      text: 'Bitte lass mich nicht allein!',
      color: '#A29BFE',
      category: 'notfall',
    },
  ],
}

export function getTilesForCategory(category: TileCategory): SetupTile[] {
  return SETUP_TILES_BY_CATEGORY[category] || []
}
