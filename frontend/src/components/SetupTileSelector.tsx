import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  Grid,
} from '@mui/material'
import { SetupTile } from '../data/setupTiles'

interface SetupTileSelectorProps {
  tiles: SetupTile[]
  selectedIds: Set<string>
  onSelectionChange: (id: string, selected: boolean) => void
}

export default function SetupTileSelector({
  tiles,
  selectedIds,
  onSelectionChange,
}: SetupTileSelectorProps) {
  return (
    <Box>
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {tiles.map((tile) => {
          const isSelected = selectedIds.has(tile.setupId)

          return (
            <Grid item xs={12} sm={6} md={4} key={tile.setupId}>
              <Card
                onClick={() => onSelectionChange(tile.setupId, !isSelected)}
                sx={{
                  height: '100%',
                  backgroundColor: tile.color,
                  color: 'white',
                  cursor: 'pointer',
                  position: 'relative',
                  border: isSelected ? '5px solid #000' : '3px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 2.5, pb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation()
                        onSelectionChange(tile.setupId, e.target.checked)
                      }}
                      sx={{
                        color: 'white',
                        '&.Mui-checked': {
                          color: '#FFD700',
                        },
                        transform: 'scale(1.4)',
                        mt: 0.5,
                      }}
                      aria-label={`Wähle: ${tile.title}`}
                    />

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          fontSize: { xs: '1.2rem', sm: '1.3rem' },
                          mb: 1,
                          lineHeight: 1.2,
                        }}
                      >
                        {tile.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '1rem', sm: '1.05rem' },
                          opacity: 0.95,
                          lineHeight: 1.4,
                        }}
                      >
                        {tile.text}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                {/* Checkmark wenn ausgewählt */}
                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: '#FFD700',
                      color: '#000',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                    }}
                  >
                    ✓
                  </Box>
                )}
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
