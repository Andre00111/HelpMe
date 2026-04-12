import { Container, Box, Typography, TextField, Button, Paper, Alert, Link as MuiLink, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import authService from '../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        if (password !== passwordConfirm) {
          setError('Passwörter stimmen nicht überein')
          setLoading(false)
          return
        }
        if (!name.trim()) {
          setError('Bitte gib deinen Namen ein')
          setLoading(false)
          return
        }
        await authService.register({
          name,
          email,
          password,
          passwordConfirm,
          isHelper: false,
        })
      } else {
        await authService.login({ email, password })
      }
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || (isSignUp ? 'Registrierung fehlgeschlagen' : 'Anmeldung fehlgeschlagen'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <Paper
        elevation={2}
        sx={{
          width: '100%',
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              mb: 3,
              fontSize: { xs: '4rem', sm: '5rem' },
            }}
          >
            {isSignUp ? '✨' : '👋'}
          </Box>
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
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.4rem' },
                lineHeight: 1.1,
              }}
            >
              {isSignUp ? 'Neuer Account' : 'Anmelden'}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: '#555',
              fontSize: { xs: '1.1rem', sm: '1.2rem' },
              fontWeight: 500,
            }}
          >
            {isSignUp
              ? 'Erstelle einen neuen Benutzerkonto'
              : 'Melde dich an für deine Kacheln'}
          </Typography>
        </Box>

        {/* Error Alert */}
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

        {/* Login Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            mb: 4,
          }}
        >
          {isSignUp && (
            <TextField
              fullWidth
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              variant="outlined"
              size="medium"
              required={isSignUp}
              inputProps={{
                style: { fontSize: '1.2rem', padding: '14px' },
              }}
              aria-label="Name eingeben"
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '1.2rem',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1.1rem',
                },
              }}
            />
          )}

          <TextField
            fullWidth
            label="E-Mail-Adresse"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de"
            variant="outlined"
            size="medium"
            required
            inputProps={{
              style: { fontSize: '1.2rem', padding: '14px' },
            }}
            aria-label="E-Mail-Adresse eingeben"
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '1.2rem',
              },
              '& .MuiInputLabel-root': {
                fontSize: '1.1rem',
              },
            }}
          />

          <TextField
            fullWidth
            label="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            variant="outlined"
            size="medium"
            required
            inputProps={{
              style: { fontSize: '1.2rem', padding: '14px' },
            }}
            aria-label="Passwort eingeben"
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '1.2rem',
              },
              '& .MuiInputLabel-root': {
                fontSize: '1.1rem',
              },
            }}
          />

          {isSignUp && (
            <TextField
              fullWidth
              label="Passwort bestätigen"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              variant="outlined"
              size="medium"
              required={isSignUp}
              inputProps={{
                style: { fontSize: '1.2rem', padding: '14px' },
              }}
              aria-label="Passwort bestätigen"
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '1.2rem',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1.1rem',
                },
              }}
            />
          )}

          {!isSignUp && (
            <MuiLink
              href="#"
              sx={{
                fontSize: '1.1rem',
                color: '#1976d2',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#1565c0',
                },
              }}
            >
              ❓ Passwort vergessen?
            </MuiLink>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} /> : (isSignUp ? <PersonAddIcon /> : <LoginIcon />)}
            sx={{
              fontSize: { xs: '1.3rem', sm: '1.2rem' },
              padding: '18px',
              backgroundColor: '#1976d2',
              fontWeight: 800,
              mt: 3,
              '&:hover': {
                backgroundColor: '#1565c0',
              },
              '&:disabled': {
                backgroundColor: '#999',
              },
              '&:focus-visible': {
                outline: '4px solid #FFD700',
                outlineOffset: '2px',
              },
            }}
          >
            {loading ? 'Wird verarbeitet...' : (isSignUp ? '✨ Account erstellen' : '✅ Anmelden')}
          </Button>
        </Box>

        {/* Toggle Sign Up / Login */}
        <Box sx={{ textAlign: 'center', borderTop: '2px solid #eee', pt: 4 }}>
          <Typography variant="body1" sx={{ color: '#555', mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>
            {isSignUp ? 'Du hast schon einen Account?' : 'Du hast noch keinen Account?'}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setEmail('')
              setPassword('')
              setPasswordConfirm('')
              setName('')
              setError(null)
            }}
            sx={{
              color: '#1976d2',
              fontWeight: 700,
              fontSize: '1.1rem',
              textTransform: 'none',
              padding: '12px 28px',
              borderColor: '#1976d2',
              borderWidth: '2px',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                borderColor: '#1565c0',
              },
            }}
          >
            {isSignUp ? '🔓 Zur Anmeldung' : '✏️ Hier registrieren'}
          </Button>
        </Box>

        {/* Disclaimer */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '1rem',
              lineHeight: 1.8,
              display: 'block',
            }}
          >
            Mit der Anmeldung akzeptierst du unsere{' '}
            <MuiLink href="#" sx={{ color: '#1976d2', fontWeight: 600 }}>
              Nutzungsbedingungen
            </MuiLink>
            {' '}und{' '}
            <MuiLink href="#" sx={{ color: '#1976d2', fontWeight: 600 }}>
              Datenschutz
            </MuiLink>
            .
          </Typography>
        </Paper>
      </Paper>
    </Container>
  )
}
