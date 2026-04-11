import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'

interface CustomTile {
  id: string
  text: string
  color: string
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DFE6E9', '#FF7675', '#A29BFE', '#FAB1A0', '#74B9FF',
  '#D63031', '#E17055', '#6C5CE7', '#00B894', '#00CEC9'
]

export default function Settings() {
  const [tiles, setTiles] = useState<CustomTile[]>([
    { id: '1', text: 'Beispiel Kachel', color: '#FF6B6B' }
  ])
  const [newText, setNewText] = useState('')
  const [selectedColor, setSelectedColor] = useState(COLORS[0])

  const handleAddTile = () => {
    if (newText.trim()) {
      const newTile: CustomTile = {
        id: Date.now().toString(),
        text: newText,
        color: selectedColor
      }
      setTiles([...tiles, newTile])
      setNewText('')
    }
  }

  const handleDeleteTile = (id: string) => {
    setTiles(tiles.filter(tile => tile.id !== id))
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h1"
        sx={{
          mb: 4,
          fontSize: { xs: '2rem', sm: '2.5rem' },
          fontWeight: 700,
          color: '#1976d2'
        }}
      >
        Einstellungen
      </Typography>

      {/* Neue Kachel hinzufügen */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Neue Kachel erstellen
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Kacheltext"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="z.B. Hallo Welt!"
            size="small"
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth size="small">
            <InputLabel>Farbe wählen</InputLabel>
            <Select
              value={selectedColor}
              label="Farbe wählen"
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              {COLORS.map((color) => (
                <MenuItem key={color} value={color}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: color,
                        borderRadius: 1,
                        border: '1px solid #ddd'
                      }}
                    />
                    {color}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              backgroundColor: selectedColor,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Vorschau
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleAddTile}
            sx={{
              fontSize: '1rem',
              padding: '12px 24px'
            }}
          >
            Kachel hinzufügen
          </Button>
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* Deine Kacheln */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Deine Kacheln ({tiles.length})
      </Typography>

      {tiles.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
          <Typography color="textSecondary">
            Du hast noch keine Kacheln erstellt. Füge eine oben hinzu!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {tiles.map((tile) => (
            <Grid item xs={12} sm={6} md={4} key={tile.id}>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: tile.color,
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 150
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    wordBreak: 'break-word'
                  }}
                >
                  {tile.text}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteTile(tile.id)}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Info Box */}
      <Paper
        sx={{
          mt: 4,
          p: 3,
          backgroundColor: '#e3f2fd',
          border: '2px solid #1976d2'
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, color: '#1565c0', fontWeight: 600 }}>
          ℹ️ Info
        </Typography>
        <Typography color="textSecondary" sx={{ fontSize: '0.95rem' }}>
          Diese Seite ist noch in der Entwicklung. Bald kannst du hier:
          <ul style={{ marginTop: '8px', marginBottom: 0 }}>
            <li>Kacheln speichern und laden (localStorage)</li>
            <li>Sprechgeschwindigkeit anpassen</li>
            <li>Hintergrundfarben und Schriftgröße einstellen</li>
            <li>Voreinstellungen exportieren und importieren</li>
          </ul>
        </Typography>
      </Paper>
    </Container>
  )
}
