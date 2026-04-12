# Authentication Structure

Diese Datei beschreibt, wie die App für echte Authentifizierung vorbereitet ist.

## Aktuelle Struktur (Dummy)

Die App hat drei Seiten mit fest eingebauter Demo-Logik:
- **Login** (`/login`) - UI-Dummy ohne echte Auth
- **MyTiles** (`/my-tiles`) - Zeigt Login-Hinweis wenn `isLoggedIn === false`
- **Home** (`/`) - Zeigt Standard-Kacheln (immer verfügbar)

## So fügt man echte Auth hinzu

### 1. Auth Context erstellen
```typescript
// src/context/AuthContext.tsx
import { createContext, useState } from 'react'

type AuthContextType = {
  isLoggedIn: boolean
  user?: { id: string; email: string }
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    setUser(data.user)
    setIsLoggedIn(true)
    localStorage.setItem('token', data.token)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

### 2. App.tsx anpassen
```typescript
// Wrap mit AuthProvider
<ThemeProvider theme={theme}>
  <CssBaseline />
  <AuthProvider>
    <Router>
      <Layout>
        <Routes>
          ...
        </Routes>
      </Layout>
    </Router>
  </AuthProvider>
</ThemeProvider>
```

### 3. Login.tsx anpassen
```typescript
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/my-tiles')
    } catch (error) {
      setError(error.message)
    }
  }
  // ...
}
```

### 4. MyTiles.tsx anpassen
```typescript
import { useAuth } from '../context/AuthContext'

export default function MyTiles() {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    // Zeige Login-Hinweis
  }
  // Zeige personalisierte Kacheln
}
```

### 5. Protected Routes (optional)
```typescript
// src/components/ProtectedRoute.tsx
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" />
}

// Dann in App.tsx:
<Route 
  path="/my-tiles" 
  element={
    <ProtectedRoute>
      <MyTiles />
    </ProtectedRoute>
  } 
/>
```

## API Endpoints (Beispiel)

Dein Backend sollte diese Endpoints bereitstellen:

```
POST /api/auth/login
  Payload: { email, password }
  Response: { token, user: { id, email, name } }

POST /api/auth/register
  Payload: { email, password, name }
  Response: { token, user: { id, email, name } }

POST /api/auth/logout
  Response: { success: true }

GET /api/user/tiles
  Headers: { Authorization: "Bearer {token}" }
  Response: { tiles: Tile[] }

POST /api/user/tiles
  Payload: { text, color }
  Response: { tile: Tile }

PUT /api/user/tiles/:id
  Payload: { text, color }
  Response: { tile: Tile }

DELETE /api/user/tiles/:id
  Response: { success: true }
```

## Datenspeicherung

Für produktive Nutzung:
- **Token in httpOnly Cookie** (sicherer als localStorage)
- **User State in Context** (oder Redux/Zustand)
- **Tiles in Backend-Datenbank** (nicht localStorage)

## Current Demo State

Im Demo-Modus:
- ✅ UI ist vollständig
- ✅ Navigation funktioniert
- ✅ Login-Formular ist funktional (sendet aber nichts)
- ❌ Keine echte Backend-Verbindung
- ❌ Keine Token/Authentifizierung
- ❌ Keine Persistierung

## Nächste Schritte

1. Backend API implementieren (Node/Express, Python/Django, etc.)
2. AuthContext implementieren
3. Login/Register API-Calls hinzufügen
4. Token-Management einbauen
5. Protected Routes einführen
6. MyTiles mit echten Daten füllen
