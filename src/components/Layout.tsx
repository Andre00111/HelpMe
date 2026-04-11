import { ReactNode } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import Header from './Header'
import Navigation from './Navigation'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bg: '#f8fafc' }}>
      {/* Top Header */}
      <Header />

      {/* Hauptinhalt mit Platz für Bottom Navigation */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          pb: isDesktop ? 0 : 8, // Platz für Bottom Navigation (nur auf Mobile)
          backgroundColor: '#f8fafc',
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation (nur auf Mobile) */}
      {!isDesktop && <Navigation />}
    </Box>
  )
}
