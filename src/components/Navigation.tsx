import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import authService from '../services/authService'

export default function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const isLoggedIn = authService.isAuthenticated()

  // Mapping von Route zu Navigation-Wert
  const routeMap: Record<string, number> = {
    '/': 0,
    '/my-tiles': 1,
    '/login': 2,
  }

  const currentValue = routeMap[location.pathname] ?? 0

  const handleChange = (_event: React.SyntheticEvent, value: number) => {
    if (isLoggedIn && value === 2) {
      // Logout action
      authService.logout()
      navigate('/login')
    } else {
      const routes = ['/', '/my-tiles', '/login']
      navigate(routes[value])
    }
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: 0,
      }}
      elevation={0}
    >
      <Box
        sx={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <BottomNavigation
          value={currentValue}
          onChange={handleChange}
          sx={{
            backgroundColor: 'transparent',
            borderTop: 'none',
          }}
        >
        <BottomNavigationAction
          label="Start"
          icon={<HomeIcon />}
          aria-label="Startseite mit Standard-Kacheln"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 700,
            minHeight: '76px',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '1rem',
              fontWeight: 700,
              marginTop: '4px',
            },
            '& svg': {
              fontSize: '1.8rem',
            },
            '&.Mui-selected': {
              color: '#1976d2',
              backgroundColor: '#e3f2fd',
            },
          }}
        />
        <BottomNavigationAction
          label="Meine"
          icon={<PersonIcon />}
          aria-label="Meine persönlichen Kacheln"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 700,
            minHeight: '76px',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '1rem',
              fontWeight: 700,
              marginTop: '4px',
            },
            '& svg': {
              fontSize: '1.8rem',
            },
            '&.Mui-selected': {
              color: '#1976d2',
              backgroundColor: '#e3f2fd',
            },
          }}
        />
        <BottomNavigationAction
          label={isLoggedIn ? 'Logout' : 'Login'}
          icon={isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
          aria-label={isLoggedIn ? 'Abmelden' : 'Anmeldung'}
          sx={{
            fontSize: '1.1rem',
            fontWeight: 700,
            minHeight: '76px',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '1rem',
              fontWeight: 700,
              marginTop: '4px',
            },
            '& svg': {
              fontSize: '1.8rem',
            },
            '&.Mui-selected': {
              color: '#1976d2',
              backgroundColor: '#e3f2fd',
            },
          }}
        />
      </BottomNavigation>
      </Box>
    </Paper>
  )
}
