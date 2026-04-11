import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { TileCategory, CustomTile } from '../hooks/useCustomTiles'

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA15E', '#A29BFE', '#FAB1A0', '#74B9FF', '#FF7675',
  '#D63031', '#E17055', '#6C5CE7', '#00B894', '#FFD93D',
]

const CATEGORIES: TileCategory[] = ['zuhause', 'draussen', 'arzt', 'essen', 'notfall']

const CATEGORY_LABELS: Record<TileCategory, string> = {
  zuhause: '🏠 Zuhause',
  draussen: '🌳 Draußen',
  arzt: '🏥 Arzt',
  essen: '🍽️ Essen',
  notfall: '🚨 Notfall',
}

interface AddTileDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (tile: Omit<CustomTile, 'id' | 'createdAt'>) => void
}

export default function AddTileDialog({ open, onClose, onAdd }: AddTileDialogProps) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [category, setCategory] = useState<TileCategory>('zuhause')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || !text.trim()) {
      return
    }

    setIsSubmitting(true)

    // Simuliere kurze API-Latenz
    await new Promise(resolve => setTimeout(resolve, 300))

    onAdd({
      title,
      text,
      color,
      category,
    })

    // Reset Form
    setTitle('')
    setText('')
    setColor(COLORS[0])
    setCategory('zuhause')
    setIsSubmitting(false)
    onClose()
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  const isValid = title.trim().length > 0 && text.trim().length > 0

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: { xs: '1.6rem', sm: '1.8rem' },
          color: '#1976d2',
          pb: 2,
          pt: 3,
        }}
      >
        ✨ Neue Kachel erstellen
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 3, pb: 3 }}>
        {/* Titel */}
        <TextField
          fullWidth
          label="Titel"
          placeholder="Zum Beispiel: Guten Morgen"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          size="medium"
          helperText="Der Name für deine Kachel"
          inputProps={{
            style: { fontSize: '1.1rem' },
          }}
          sx={{
            '& .MuiInputBase-root': {
              fontSize: '1.1rem',
            },
            '& .MuiFormHelperText-root': {
              fontSize: '1rem',
            },
          }}
          aria-label="Titel der neuen Kachel"
        />

        {/* Sprechtext */}
        <TextField
          fullWidth
          label="Text zum Sprechen"
          placeholder="Zum Beispiel: Guten Morgen! Wie geht es dir?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isSubmitting}
          multiline
          rows={4}
          helperText="Das wird laut gesprochen"
          inputProps={{
            style: { fontSize: '1.1rem' },
          }}
          sx={{
            '& .MuiInputBase-root': {
              fontSize: '1.1rem',
            },
            '& .MuiFormHelperText-root': {
              fontSize: '1rem',
            },
          }}
          aria-label="Text für Sprachausgabe"
        />

        {/* Kategorie */}
        <FormControl fullWidth size="medium" disabled={isSubmitting}>
          <InputLabel sx={{ fontSize: '1.1rem' }}>Wo brauchst du das?</InputLabel>
          <Select
            value={category}
            label="Wo brauchst du das?"
            onChange={(e) => setCategory(e.target.value as TileCategory)}
            sx={{
              fontSize: '1.1rem',
            }}
            aria-label="Situation für die Kachel"
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat} sx={{ fontSize: '1.1rem', padding: '12px 16px' }}>
                {CATEGORY_LABELS[cat]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Farbe */}
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 800,
              mb: 2.5,
              color: '#1976d2',
              fontSize: '1.1rem',
            }}
          >
            🎨 Welche Farbe?
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))',
              gap: 1.5,
            }}
          >
            {COLORS.map((c) => (
              <Box
                key={c}
                onClick={() => !isSubmitting && setColor(c)}
                sx={{
                  width: '100%',
                  aspectRatio: '1',
                  backgroundColor: c,
                  borderRadius: 1.5,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  border: color === c ? '5px solid #000' : '3px solid #ccc',
                  transition: 'all 0.15s',
                  opacity: isSubmitting ? 0.5 : 1,
                  '&:hover': !isSubmitting && {
                    transform: 'scale(1.08)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                    borderColor: '#000',
                  },
                  '&:focus-visible': {
                    outline: '3px solid #FFD700',
                    outlineOffset: '2px',
                  },
                }}
                role="button"
                tabIndex={isSubmitting ? -1 : 0}
                onKeyDown={(e) => {
                  if (!isSubmitting && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    setColor(c)
                  }
                }}
                aria-label={`Farbe ${c} auswählen`}
              />
            ))}
          </Box>
        </Box>

        {/* Vorschau */}
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 800,
              mb: 1.5,
              color: '#1976d2',
              fontSize: '1.1rem',
            }}
          >
            👀 So sieht es aus:
          </Typography>
          <Box
            sx={{
              p: 3,
              backgroundColor: color,
              color: 'white',
              borderRadius: 2,
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: '1.4rem',
              fontWeight: 700,
              wordBreak: 'break-word',
              textShadow: '0 3px 6px rgba(0,0,0,0.25)',
              lineHeight: 1.4,
              border: '3px solid rgba(0,0,0,0.1)',
            }}
          >
            {text || '(Dein Text erscheint hier)'}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          gap: 2,
          justifyContent: 'space-between',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          startIcon={<CloseIcon />}
          sx={{
            textTransform: 'none',
            fontSize: { xs: '1.2rem', sm: '1.1rem' },
            fontWeight: 700,
            padding: { xs: '16px 24px', sm: '12px 24px' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Abbrechen
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          variant="contained"
          startIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : <AddIcon />}
          sx={{
            textTransform: 'none',
            fontSize: { xs: '1.2rem', sm: '1.1rem' },
            fontWeight: 700,
            padding: { xs: '16px 24px', sm: '12px 28px' },
            width: { xs: '100%', sm: 'auto' },
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
            '&:disabled': {
              backgroundColor: '#ccc',
            },
          }}
        >
          {isSubmitting ? '⏳ Speichert...' : '✅ Kachel erstellen'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
