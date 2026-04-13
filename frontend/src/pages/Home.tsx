import { useState, useEffect } from 'react'
import { Container, Typography, Box, Alert, AlertTitle, Grid, CircularProgress } from '@mui/material'
import TileGrid from '../components/TileGrid'
import EmergencyTile from '../components/EmergencyTile'
import { DEFAULT_TILES } from '../data/tiles'
import authService from '../services/authService'
import tileService, { TileDTO } from '../services/tileService'
import locationService from '../services/locationService'
import statusService from '../services/statusService'

export default function Home() {
  const isLoggedIn = authService.isAuthenticated()
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [tiles, setTiles] = useState<TileDTO[]>([])
  const [tilesLoading, setTilesLoading] = useState(false)
  const [tilesError, setTilesError] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<any>(null)

  // Prüfe ob Web Speech API verfügbar ist
  useEffect(() => {
    const isSupported = 'speechSynthesis' in window
    setIsSpeechSupported(isSupported)
  }, [])

  // Fetch tiles from backend if logged in
  useEffect(() => {
    if (isLoggedIn) {
      const fetchTiles = async () => {
        try {
          setTilesLoading(true)
          const fetchedTiles = await tileService.getAllTiles()
          setTiles(fetchedTiles)
          setTilesError(null)
        } catch (err: any) {
          console.error(err)
          setTilesError('Fehler beim Laden der Kacheln')
          // Fall back to default tiles on error
          setTiles([])
        } finally {
          setTilesLoading(false)
        }
      }

      fetchTiles()
    } else {
      // Show default tiles if not logged in
      setTiles([])
    }
  }, [isLoggedIn])

  // Start location tracking when logged in (store current location, don't send it)
  useEffect(() => {
    if (isLoggedIn) {
      console.log('Starting location tracking')
      locationService.startTracking(
        (location) => {
          console.log('Location tracked:', location)
          setCurrentLocation(location)
        },
        (error) => {
          console.error('Location error:', error)
        }
      )
    } else {
      locationService.stopTracking()
    }

    // Cleanup: stop tracking when component unmounts or user logs out
    return () => {
      if (!isLoggedIn) {
        locationService.stopTracking()
      }
    }
  }, [isLoggedIn])

  const handleSpeak = (text: string) => {
    if (!isSpeechSupported) {
      return
    }

    // Stoppe aktuelle Sprachausgabe
    window.speechSynthesis.cancel()

    setIsSpeaking(true)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'de-DE'
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }

  return (
    <Container
      maxWidth="lg"
      component="main"
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2 },
        flex: 1,
      }}
    >
      {/* Header Section */}
      <Box
        component="header"
        sx={{
          mb: { xs: 4, sm: 5, md: 6 },
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '2.8rem', sm: '3.4rem', md: '4rem' },
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            HelpMe
          </Typography>
        </Box>
        <Typography
          variant="h5"
          component="p"
          sx={{
            color: '#64748b',
            fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.7rem' },
            fontWeight: 600,
            mb: 2,
            lineHeight: 1.3,
          }}
        >
          Klick auf eine Kachel
          <br />
          zum Sprechen
        </Typography>
      </Box>

      {/* Fallback für fehlende Web Speech API */}
      {!isSpeechSupported && (
        <Alert
          severity="warning"
          sx={{
            mb: 4,
            fontSize: { xs: '1.1rem', sm: '1.2rem' },
            '& .MuiAlertTitle-root': {
              fontSize: { xs: '1.2rem', sm: '1.4rem' },
              fontWeight: 700,
            },
          }}
          role="status"
          aria-live="polite"
        >
          <AlertTitle>⚠️ Sprachausgabe nicht verfügbar</AlertTitle>
          Leider kann dieser Browser die Sprachausgabe nicht nutzen.
          <br />
          Bitte einen anderen Browser verwenden:
          <br />
          Chrome, Edge, Safari oder Firefox
        </Alert>
      )}

      {/* NOTFALL-BEREICH */}
      <Box
        sx={{
          mb: 6,
          pb: 4,
          borderBottom: '3px solid rgba(239, 68, 68, 0.2)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
            fontWeight: 800,
            color: '#991b1b',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          🚨 NOTFALL - Schnelle Hilfe
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <EmergencyTile
              type="helper"
              onActivate={() => {
                alert('📞 Hilfsperson wird angerufen...\n\n(Das ist noch ein Demo-Button)')
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <EmergencyTile
              type="doctor"
              onActivate={() => {
                alert('🏥 Notarzt wird angerufen...\n\n(Das ist noch ein Demo-Button)')
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <EmergencyTile
              type="location"
              onActivate={async () => {
                try {
                  if (!currentLocation) {
                    alert('❌ Standort wird noch erfasst, bitte warten...')
                    return
                  }
                  await Promise.all([
                    locationService.sendLocationToBackend(currentLocation),
                    statusService.sendStatus('GOOD')
                  ])
                  alert('✅ Standort und Status übermittelt - Mir geht es GUT 🟢')
                } catch (err: any) {
                  alert(`❌ Fehler: ${err.message}`)
                }
              }}
            />
          </Grid>
        </Grid>

        {/* Status Buttons - Standort mit Status */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: '2px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
              fontWeight: 800,
              color: '#991b1b',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            📍 Mein Status
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ justifyContent: 'center' }}>
            <Grid item xs={12} sm={6} md={4}>
              <Box
                onClick={async () => {
                  try {
                    if (!currentLocation) {
                      alert('❌ Standort wird noch erfasst, bitte warten...')
                      return
                    }
                    await Promise.all([
                      locationService.sendLocationToBackend(currentLocation),
                      statusService.sendStatus('GOOD')
                    ])
                    alert('✅ Standort und Status übermittelt - Mir geht es GUT 🟢')
                  } catch (err: any) {
                    alert(`❌ Fehler: ${err.message}`)
                  }
                }}
                sx={{
                  p: 3,
                  backgroundColor: '#22c55e',
                  color: 'white',
                  borderRadius: 2,
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#16a34a',
                    transform: 'scale(1.05)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                🟢 Mir geht es GUT
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box
                onClick={async () => {
                  try {
                    if (!currentLocation) {
                      alert('❌ Standort wird noch erfasst, bitte warten...')
                      return
                    }
                    await Promise.all([
                      locationService.sendLocationToBackend(currentLocation),
                      statusService.sendStatus('WARNING')
                    ])
                    alert('⚠️ Standort und Status übermittelt - ACHTUNG 🟡')
                  } catch (err: any) {
                    alert(`❌ Fehler: ${err.message}`)
                  }
                }}
                sx={{
                  p: 3,
                  backgroundColor: '#eab308',
                  color: 'black',
                  borderRadius: 2,
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#ca8a04',
                    transform: 'scale(1.05)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                🟡 ACHTUNG
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box
                onClick={async () => {
                  try {
                    if (!currentLocation) {
                      alert('❌ Standort wird noch erfasst, bitte warten...')
                      return
                    }
                    await Promise.all([
                      locationService.sendLocationToBackend(currentLocation),
                      statusService.sendStatus('EMERGENCY')
                    ])
                    alert('🚨 Standort und Status übermittelt - NOT 🔴')
                  } catch (err: any) {
                    alert(`❌ Fehler: ${err.message}`)
                  }
                }}
                sx={{
                  p: 3,
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: 2,
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                    transform: 'scale(1.05)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                🔴 NOT
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Hauptbereich: Tile Grid */}
      <Box
        sx={{
          mb: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontSize: { xs: '1.2rem', sm: '1.3rem' },
            fontWeight: 700,
            color: '#64748b',
            textAlign: 'center',
          }}
        >
          💬 {isLoggedIn ? 'Deine persönlichen Kacheln' : 'Normale Kommunikation'}
        </Typography>

        {tilesError && (
          <Alert
            severity="error"
            onClose={() => setTilesError(null)}
            sx={{
              mb: 3,
              fontSize: '1.05rem',
              borderRadius: 2,
            }}
          >
            {tilesError}
          </Alert>
        )}

        {isLoggedIn && tilesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={50} />
          </Box>
        ) : (
          <TileGrid
            tiles={isLoggedIn && tiles.length > 0 ? (tiles as any) : (DEFAULT_TILES as any)}
            onSpeak={handleSpeak}
          />
        )}
      </Box>

      {/* Infosektion */}
      <Box
        component="section"
        sx={{
          mt: { xs: 5, sm: 6, md: 8 },
          p: { xs: 4, sm: 5, md: 6 },
          background: 'linear-gradient(135deg, #10b98166 0%, #06b6d466 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            color: '#047857',
            fontWeight: 800,
            fontSize: { xs: '1.4rem', sm: '1.7rem', md: '2rem' },
          }}
        >
          👆 So funktioniert's
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#047857',
            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
            lineHeight: 1.8,
            fontWeight: 500,
        }}
        >
          Klick auf eine farbige Kachel
          <br />
          Die App spricht den Text laut
          <br />
          <br />
          <strong>Oder: Tab drücken zum Navigieren,</strong>
          <br />
          <strong>Enter zum Sprechen</strong>
        </Typography>
      </Box>

      {/* Status Information */}
      {isSpeaking && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#2e7d32',
            color: 'white',
            padding: { xs: '20px 24px', sm: '24px 32px' },
            borderRadius: 2,
            fontSize: { xs: '1.3rem', sm: '1.5rem' },
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 1000,
            border: '3px solid #fff',
          }}
          role="status"
          aria-live="polite"
        >
          🔊 Spreche jetzt...
        </Box>
      )}
    </Container>
  )
}
