import { AppBar, Toolbar, Box, Button, Avatar, Menu, MenuItem, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import authService from '../services/authService'

export default function Header() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isLoggedIn = authService.isAuthenticated()
  const user = authService.getStoredUser()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    authService.logout()
    handleMenuClose()
    navigate('/login')
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1,
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Logo/Titel - Links */}
        <Box
          onClick={() => navigate('/')}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.4rem', sm: '1.8rem' },
              color: 'white',
              letterSpacing: '-0.5px',
            }}
          >
            💬 HelpMe
          </Typography>
        </Box>

        {/* Auth Section - Rechts */}
        {isLoggedIn ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* User Avatar & Dropdown */}
            <Box
              onClick={handleMenuOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  border: '2px solid white',
                  fontWeight: 700,
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              {isDesktop && (
                <Box>
                  <Typography
                    sx={{
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    {user?.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.75rem',
                    }}
                  >
                    {user?.email}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => { handleMenuClose(); navigate('/my-tiles'); }}>
                📋 Meine Kacheln
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); navigate('/'); }}>
                🏠 Startseite
              </MenuItem>
              <MenuItem divider />
              <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
                <LogoutIcon sx={{ mr: 1, fontSize: '1rem' }} />
                Abmelden
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Button
              variant="text"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: { xs: '0.85rem', sm: '1rem' },
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                },
              }}
            >
              Anmelden
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
