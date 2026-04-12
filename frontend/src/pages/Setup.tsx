import { useState } from 'react'
import { Container, Box, Typography, Button, Card, LinearProgress, Paper, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SetupTileSelector from '../components/SetupTileSelector'
import { TileCategory } from '../hooks/useCustomTiles'
import { getTilesForCategory } from '../data/setupTiles'
import { useCustomTiles } from '../hooks/useCustomTiles'

const CATEGORIES: TileCategory[] = ['zuhause', 'draussen', 'arzt', 'essen', 'notfall']

const CATEGORY_LABELS: Record<TileCategory, { emoji: string; name: string; description: string }> = {
  zuhause: { emoji: '🏠', name: 'Zuhause', description: 'Im Wohnzimmer, Schlafzimmer, Küche' },
  draussen: { emoji: '🌳', name: 'Draußen', description: 'Park, Straße, Geschäfte' },
  arzt: { emoji: '🏥', name: 'Beim Arzt', description: 'In der Arztpraxis oder Krankenhaus' },
  essen: { emoji: '🍽️', name: 'Beim Essen', description: 'Beim Frühstück, Mittagessen, Abendessen' },
  notfall: { emoji: '🚨', name: 'Notfall', description: 'Wenn schnelle Hilfe gebraucht wird' },
}

type SetupStep = 'situation' | 'tiles' | 'summary'

export default function Setup() {
  const navigate = useNavigate()
  const { addTile } = useCustomTiles()

  const [step, setStep] = useState<SetupStep>('situation')
  const [selectedCategory, setSelectedCategory] = useState<TileCategory | null>(null)
  const [selectedTileIds, setSelectedTileIds] = useState<Set<string>>(new Set())

  const handleCategorySelect = (category: TileCategory) => {
    setSelectedCategory(category)
    setSelectedTileIds(new Set()) // Reset tiles
    setStep('tiles')
  }

  const handleTileSelectionChange = (id: string, selected: boolean) => {
    const newSelection = new Set(selectedTileIds)
    if (selected) {
      newSelection.add(id)
    } else {
      newSelection.delete(id)
    }
    setSelectedTileIds(newSelection)
  }

  const handleContinue = () => {
    if (step === 'tiles') {
      setStep('summary')
    }
  }

  const handleBack = () => {
    if (step === 'summary') {
      setStep('tiles')
    } else if (step === 'tiles') {
      setStep('situation')
      setSelectedCategory(null)
    }
  }

  const handleAddToMyTiles = () => {
    if (!selectedCategory) return

    const tiles = getTilesForCategory(selectedCategory)
    const tilesToAdd = tiles.filter((tile) => selectedTileIds.has(tile.setupId))

    // Füge alle ausgewählten Kacheln zu "Meine Kacheln" hinzu
    tilesToAdd.forEach((setupTile) => {
      addTile({
        title: setupTile.title,
        text: setupTile.text,
        color: setupTile.color,
        category: setupTile.category,
      })
    })

    // Gehe zu "Meine Kacheln"
    navigate('/my-tiles')
  }

  const progress = step === 'situation' ? 33 : step === 'tiles' ? 66 : 100

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, flex: 1 }}>
      {/* Fortschrittsbalken */}
      <Box sx={{ mb: 5 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: '6px',
            borderRadius: 3,
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {/* SCHRITT 1: SITUATION WÄHLEN */}
      {step === 'situation' && (
        <Box>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                mb: 2,
                fontSize: { xs: '2.4rem', sm: '2.8rem', md: '3.2rem' },
                fontWeight: 800,
                textAlign: 'center',
              }}
            >
              🎯 Wo brauchst du Kacheln?
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              mb: 5,
              fontSize: { xs: '1.2rem', sm: '1.3rem' },
              color: '#555',
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Wähle eine Situation aus.
            <br />
            Wir zeigen dir passende Kacheln dafür.
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
            {CATEGORIES.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Card
                  onClick={() => handleCategorySelect(category)}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '3px solid transparent',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      transform: 'translateY(-4px)',
                      borderColor: '#1976d2',
                    },
                    '&:focus-within': {
                      outline: '4px solid #FFD700',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: '3.5rem', sm: '4rem' },
                      mb: 2,
                    }}
                  >
                    {CATEGORY_LABELS[category].emoji}
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      mb: 1,
                      fontSize: { xs: '1.4rem', sm: '1.6rem' },
                      fontWeight: 800,
                      color: '#1976d2',
                    }}
                  >
                    {CATEGORY_LABELS[category].name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      color: '#666',
                      lineHeight: 1.5,
                    }}
                  >
                    {CATEGORY_LABELS[category].description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* SCHRITT 2: KACHELN AUSWÄHLEN */}
      {step === 'tiles' && selectedCategory && (
        <Box>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                mb: 2,
                fontSize: { xs: '2.4rem', sm: '2.8rem' },
                fontWeight: 800,
                textAlign: 'center',
              }}
            >
              {CATEGORY_LABELS[selectedCategory].emoji} {CATEGORY_LABELS[selectedCategory].name}
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              mb: 5,
              fontSize: { xs: '1.2rem', sm: '1.3rem' },
              color: '#555',
              textAlign: 'center',
            }}
          >
            Welche Kacheln möchtest du haben?
            <br />
            <strong>(Klick auf eine Kachel zum Auswählen)</strong>
          </Typography>

          <Box sx={{ mb: 5 }}>
            <SetupTileSelector
              tiles={getTilesForCategory(selectedCategory)}
              selectedIds={selectedTileIds}
              onSelectionChange={handleTileSelectionChange}
            />
          </Box>

          {/* Info Box */}
          {selectedTileIds.size === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: '#fff3e0',
                border: '3px solid #f57c00',
                borderRadius: 2,
                mb: 5,
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.2rem',
                  color: '#e65100',
                  fontWeight: 600,
                }}
              >
                ⚠️ Bitte mindestens 1 Kachel auswählen
              </Typography>
            </Paper>
          )}

          {/* Anzeige: X Kacheln ausgewählt */}
          {selectedTileIds.size > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: '#e8f5e9',
                border: '3px solid #2e7d32',
                borderRadius: 2,
                mb: 5,
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.3rem',
                  color: '#1b5e20',
                  fontWeight: 700,
                }}
              >
                ✅ {selectedTileIds.size} Kachel{selectedTileIds.size !== 1 ? 'n' : ''} ausgewählt
              </Typography>
            </Paper>
          )}
        </Box>
      )}

      {/* SCHRITT 3: ZUSAMMENFASSUNG */}
      {step === 'summary' && selectedCategory && (
        <Box>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <CheckCircleIcon
              sx={{
                fontSize: '4rem',
                color: '#10b981',
                mb: 2,
              }}
            />
            <Box
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  mb: 2,
                  fontSize: { xs: '2.4rem', sm: '2.8rem' },
                  fontWeight: 800,
                }}
              >
                Fertig!
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.3rem' },
                color: '#555',
              }}
            >
              Du hast {selectedTileIds.size} Kachel{selectedTileIds.size !== 1 ? 'n' : ''} für
              <br />
              <strong>{CATEGORY_LABELS[selectedCategory].name}</strong> ausgewählt
            </Typography>
          </Box>

          {/* Preview der ausgewählten Kacheln */}
          <Box sx={{ mb: 5 }}>
            <Typography
              sx={{
                fontSize: '1.3rem',
                fontWeight: 700,
                mb: 3,
                color: '#333',
              }}
            >
              📋 Das werden deine Kacheln:
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 2.5 }}>
              {getTilesForCategory(selectedCategory)
                .filter((tile) => selectedTileIds.has(tile.setupId))
                .map((tile) => (
                  <Grid item xs={12} sm={6} md={4} key={tile.setupId}>
                    <Card
                      sx={{
                        backgroundColor: tile.color,
                        color: 'white',
                        p: 3,
                        minHeight: '140px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        {tile.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          opacity: 0.95,
                          lineHeight: 1.4,
                        }}
                      >
                        {tile.text}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Box>
      )}

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'space-between',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          mt: 6,
        }}
      >
        {step !== 'situation' && (
          <Button
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            size="large"
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.1rem' },
              padding: { xs: '16px 24px', sm: '14px 28px' },
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Zurück
          </Button>
        )}

        <Box sx={{ flex: 1 }} />

        {step === 'situation' && (
          <Box
            sx={{
              textAlign: 'center',
              color: '#999',
              fontSize: '1.1rem',
              fontWeight: 600,
              alignSelf: 'center',
            }}
          >
            ← Wähle eine Situation
          </Box>
        )}

        {step === 'tiles' && (
          <Button
            onClick={handleContinue}
            endIcon={<ArrowForwardIcon />}
            variant="contained"
            disabled={selectedTileIds.size === 0}
            size="large"
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.1rem' },
              padding: { xs: '16px 24px', sm: '14px 28px' },
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
              backgroundColor: '#1976d2',
            }}
          >
            Weiter
          </Button>
        )}

        {step === 'summary' && (
          <Button
            onClick={handleAddToMyTiles}
            variant="contained"
            size="large"
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.1rem' },
              padding: { xs: '16px 24px', sm: '14px 28px' },
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
              backgroundColor: '#2e7d32',
              '&:hover': {
                backgroundColor: '#1b5e20',
              },
            }}
          >
            ✅ Zu meinen Kacheln hinzufügen
          </Button>
        )}
      </Box>
    </Container>
  )
}
