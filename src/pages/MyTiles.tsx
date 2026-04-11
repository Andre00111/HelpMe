import { useState, useEffect } from 'react'
import { Container, Box, Typography, Button, Paper, Grid, Tabs, Tab, CircularProgress, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import LoginIcon from '@mui/icons-material/Login'
import BuildIcon from '@mui/icons-material/Build'
import AddTileDialog from '../components/AddTileDialog'
import CustomTileCard from '../components/CustomTileCard'
import authService from '../services/authService'
import tileService, { TileDTO } from '../services/tileService'

const CATEGORIES = ['ZUHAUSE', 'DRAUSSEN', 'ARZT', 'ESSEN', 'NOTFALL'] as const
type TileCategory = typeof CATEGORIES[number]

const CATEGORY_LABELS: Record<TileCategory, string> = {
  ZUHAUSE: '🏠 Zuhause',
  DRAUSSEN: '🌳 Draußen',
  ARZT: '🏥 Arzt',
  ESSEN: '🍽️ Essen',
  NOTFALL: '🚨 Notfall',
}

// Map old format to new format
function mapCategoryFormat(oldFormat: string): TileCategory {
  const mapping: Record<string, TileCategory> = {
    zuhause: 'ZUHAUSE',
    draussen: 'DRAUSSEN',
    arzt: 'ARZT',
    essen: 'ESSEN',
    notfall: 'NOTFALL',
  }
  return mapping[oldFormat.toLowerCase()] || 'ZUHAUSE'
}

export default function MyTiles() {
  const navigate = useNavigate()
  const isLoggedIn = authService.isAuthenticated()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<TileCategory>('ZUHAUSE')
  const [tiles, setTiles] = useState<TileDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTiles = async () => {
      try {
        setLoading(true)
        const fetchedTiles = await tileService.getAllTiles()
        setTiles(fetchedTiles)
        setError(null)
      } catch (err: any) {
        setError('Fehler beim Laden der Kacheln')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (isLoggedIn) {
      fetchTiles()
    } else {
      setLoading(false)
    }
  }, [isLoggedIn])

  const getTilesByCategory = (category: TileCategory): TileDTO[] => {
    return tiles.filter((tile) => tile.category === category)
  }

  const addTile = async (newTile: TileDTO) => {
    try {
      const created = await tileService.createTile(newTile)
      setTiles([...tiles, created])
    } catch (err: any) {
      setError('Fehler beim Erstellen der Kachel')
      console.error(err)
    }
  }

  const deleteTile = async (id: number) => {
    try {
      await tileService.deleteTile(id)
      setTiles(tiles.filter((tile) => tile.id !== id))
    } catch (err: any) {
      setError('Fehler beim Löschen der Kachel')
      console.error(err)
    }
  }

  const tilesInCategory = getTilesByCategory(activeCategory)

  if (!isLoggedIn) {
    return (
      <Container
        maxWidth="md"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            textAlign: 'center',
            backgroundColor: 'transparent',
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              mb: 3,
              fontSize: { xs: '3rem', sm: '4rem' },
            }}
          >
            🔐
          </Box>

          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '1.8rem' },
              color: '#1976d2',
            }}
          >
            Anmeldung erforderlich
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              lineHeight: 1.6,
            }}
          >
            Um deine persönlichen Kacheln zu speichern und zu verwalten,
            <br />
            musst du dich zuerst anmelden.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{
                fontSize: '1rem',
                padding: '14px 28px',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Zur Anmeldung
            </Button>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.9rem',
              }}
            >
              oder nutze die <strong>Standard-Kacheln</strong> auf der Startseite
            </Typography>
          </Box>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, flex: 1 }}>
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{
            mb: 4,
            fontSize: '1.05rem',
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {/* Header */}
      <Box
        component="header"
        sx={{
          mb: 5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        <Box>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
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
                fontSize: { xs: '2.4rem', sm: '2.8rem', md: '3.2rem' },
                fontWeight: 800,
                lineHeight: 1.1,
              }}
            >
              Meine Kacheln
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontSize: { xs: '1.2rem', sm: '1.3rem' },
              fontWeight: 600,
            }}
          >
            Du hast {tiles.length} Kachel{tiles.length !== 1 ? 'n' : ''}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          size="large"
          sx={{
            fontSize: { xs: '1.3rem', sm: '1.4rem' },
            padding: { xs: '20px 24px', sm: '18px 32px' },
            backgroundColor: '#1976d2',
            fontWeight: 700,
            minWidth: { xs: '100%', sm: 'auto' },
            '&:hover': {
              backgroundColor: '#1565c0',
            },
            '&:focus-visible': {
              outline: '4px solid #FFD700',
              outlineOffset: '3px',
            },
          }}
        >
          ➕ Neue Kachel
        </Button>
      </Box>

      {/* Kategorie Tabs */}
      <Paper
        elevation={0}
        sx={{
          mb: 5,
          borderBottom: '2px solid rgba(0,0,0,0.05)',
          backgroundColor: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
        }}
      >
        <Tabs
          value={activeCategory}
          onChange={(_, value) => setActiveCategory(value)}
          aria-label="Kachel-Kategorien"
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
              fontWeight: 700,
              textTransform: 'none',
              minHeight: { xs: '64px', sm: '72px' },
              minWidth: { xs: 'auto', sm: '120px' },
              color: '#666',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: '#e8f4f8',
              },
            },
            '& .Mui-selected': {
              color: '#1976d2',
              backgroundColor: '#e3f2fd',
            },
            '& .MuiTabs-indicator': {
              height: '5px',
              backgroundColor: '#1976d2',
            },
          }}
        >
          {CATEGORIES.map((category) => (
            <Tab
              key={category}
              label={CATEGORY_LABELS[category]}
              value={category}
              aria-label={`Filter: ${CATEGORY_LABELS[category]}`}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Kacheln Grid */}
      {tilesInCategory.length > 0 ? (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3, lg: 3.5 }} sx={{ mb: 5 }}>
          {tilesInCategory.map((tile) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tile.id}>
              <CustomTileCard tile={tile} onDelete={deleteTile} />
            </Grid>
          ))}
        </Grid>
      ) : tiles.length === 0 ? (
        // Wenn gar keine Kacheln vorhanden sind - zeige Setup-Option
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            textAlign: 'center',
            backgroundColor: '#f0f0f0',
            borderRadius: 2,
            border: '4px dashed #bbb',
            mb: 4,
          }}
        >
          <Box sx={{ mb: 3, fontSize: '3.5rem' }}>🚀</Box>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: '#666',
              fontSize: { xs: '1.4rem', sm: '1.6rem' },
            }}
          >
            Lass uns Kacheln erstellen!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#555',
              mb: 4,
              fontSize: { xs: '1.1rem', sm: '1.2rem' },
              lineHeight: 1.6,
            }}
          >
            Willkommen! Du hast noch keine Kacheln.
            <br />
            Wir können dir jetzt bei der Einrichtung helfen.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              startIcon={<BuildIcon />}
              onClick={() => navigate('/setup')}
              size="large"
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.1rem' },
                padding: { xs: '16px 24px', sm: '14px 28px' },
                backgroundColor: '#1976d2',
                fontWeight: 700,
              }}
            >
              🎯 Einrichtung starten
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              size="large"
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.1rem' },
                padding: { xs: '16px 24px', sm: '14px 28px' },
                fontWeight: 700,
                borderWidth: '2px',
              }}
            >
              ➕ Selbst erstellen
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            textAlign: 'center',
            backgroundColor: '#f0f0f0',
            borderRadius: 2,
            border: '4px dashed #bbb',
            mb: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: '#666',
              fontSize: { xs: '1.4rem', sm: '1.6rem' },
            }}
          >
            😴 Noch keine Kacheln
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#555',
              mb: 4,
              fontSize: { xs: '1.1rem', sm: '1.2rem' },
              lineHeight: 1.6,
            }}
          >
            Hier könnten deine Kacheln für<br/>
            <strong>{CATEGORY_LABELS[activeCategory]}</strong> stehen
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            size="large"
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.3rem' },
              padding: { xs: '16px 24px', sm: '18px 32px' },
              backgroundColor: '#1976d2',
              fontWeight: 700,
            }}
          >
            ➕ Jetzt erstellen
          </Button>
        </Paper>
      )}

      {/* Info Box */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3.5, sm: 4.5 },
          background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
          color: 'white',
          border: 'none',
          borderRadius: 2,
          boxShadow: '0 10px 30px rgba(249, 115, 22, 0.2)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 800,
            color: 'white',
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
          }}
        >
          📖 So funktioniert's
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'white',
            lineHeight: 2,
            fontSize: { xs: '1.1rem', sm: '1.2rem' },
            fontWeight: 500,
          }}
        >
          <strong>1.</strong> Klick auf <strong>„Neue Kachel"</strong>
          <br />
          <strong>2.</strong> Schreib einen <strong>Titel</strong>
          <br />
          <strong>3.</strong> Schreib den <strong>Text zum Sprechen</strong>
          <br />
          <strong>4.</strong> Wähle <strong>Farbe</strong> und <strong>Situation</strong>
          <br />
          <strong>5.</strong> Klick <strong>„Kachel erstellen"</strong>
          <br />
          <strong>6.</strong> Fertig! 🎉
        </Typography>
      </Paper>

          {/* Dialog */}
          <AddTileDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onAdd={(tile) => {
              addTile(tile)
              const mapped = tile.category as TileCategory
              setActiveCategory(mapped)
            }}
          />
        </>
      )}
    </Container>
  )
}
