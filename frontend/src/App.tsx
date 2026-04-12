import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import Layout from './components/Layout'
import Home from './pages/Home'
import MyTiles from './pages/MyTiles'
import Login from './pages/Login'
import Setup from './pages/Setup'

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Modern Indigo
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899', // Modern Pink
      light: '#f472b6',
      dark: '#db2777',
    },
    success: {
      main: '#10b981', // Modern Green
    },
    warning: {
      main: '#f59e0b', // Modern Amber
    },
    error: {
      main: '#ef4444', // Modern Red
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontSize: '1.3rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1.1rem',
      lineHeight: 1.6,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: '0.3px',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-tiles" element={<MyTiles />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/login" element={<Login />} />
            {/* Fallback für unbekannte Routes */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
