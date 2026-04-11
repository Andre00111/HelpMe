import { Box } from '@mui/material'
import Tile from './Tile'

export interface TileData {
  id: string
  text: string
  color: string
  ariaLabel?: string
}

interface TileGridProps {
  tiles: TileData[]
  onSpeak?: (text: string) => void
}

export default function TileGrid({ tiles, onSpeak }: TileGridProps) {
  return (
    <Box
      component="section"
      role="region"
      aria-label="Kommunikationskacheln"
      sx={{
        width: '100%',
        mb: 4,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: { xs: '16px', sm: '20px', md: '24px', lg: '28px' },
          width: '100%',
          // Alle Kacheln haben gleiche Höhe
          gridAutoRows: 'minmax(140px, 1fr)',
        }}
      >
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            id={tile.id}
            text={tile.text}
            color={tile.color}
            ariaLabel={tile.ariaLabel}
            onSpeak={onSpeak}
          />
        ))}
      </Box>
    </Box>
  )
}
