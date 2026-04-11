import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { CustomTile, TileCategory } from '../hooks/useCustomTiles'

const CATEGORY_LABELS: Record<TileCategory, string> = {
  zuhause: '🏠 Zuhause',
  draussen: '🌳 Draußen',
  arzt: '🏥 Arzt',
  essen: '🍽️ Essen',
  notfall: '🚨 Notfall',
}

interface CustomTileCardProps {
  tile: CustomTile
  onDelete: (id: string) => void
}

export default function CustomTileCard({ tile, onDelete }: CustomTileCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleSpeak = () => {
    setIsSpeaking(true)

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(tile.text)
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
  }

  const handleDelete = () => {
    if (window.confirm(`Möchtest du die Kachel "${tile.title}" wirklich löschen?`)) {
      onDelete(tile.id)
    }
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${tile.color} 0%, ${tile.color}dd 100%)`,
        color: 'white',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
        '&:hover': {
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ flex: 1, pb: 2 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 800,
            mb: 1.5,
            fontSize: { xs: '1.25rem', sm: '1.4rem' },
            wordBreak: 'break-word',
            lineHeight: 1.2,
          }}
        >
          {tile.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 2.5,
            lineHeight: 1.6,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            opacity: 0.95,
            wordBreak: 'break-word',
            fontWeight: 500,
          }}
        >
          {tile.text}
        </Typography>

        <Chip
          label={CATEGORY_LABELS[tile.category]}
          size="medium"
          sx={{
            backgroundColor: 'rgba(0,0,0,0.25)',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.95rem',
            height: 'auto',
            padding: '6px 12px',
          }}
        />
      </CardContent>

      <CardActions
        sx={{
          gap: 1,
          justifyContent: 'space-between',
          pt: 1,
          px: 2,
          pb: 2,
        }}
      >
        <Tooltip title="Text vorlesen">
          <IconButton
            size="large"
            onClick={handleSpeak}
            disabled={isSpeaking}
            aria-label={`Text vorlesen: ${tile.title}`}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.25)',
              padding: '12px',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.35)',
              },
              '&.Mui-disabled': {
                color: 'white',
                opacity: 0.6,
              },
              '&:focus-visible': {
                outline: '3px solid #FFD700',
              },
            }}
          >
            <VolumeUpIcon sx={{ fontSize: '1.8rem' }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Löschen">
          <IconButton
            size="large"
            onClick={handleDelete}
            aria-label={`Kachel ${tile.title} löschen`}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.25)',
              padding: '12px',
              '&:hover': {
                backgroundColor: 'rgba(220,0,0,0.6)',
              },
              '&:focus-visible': {
                outline: '3px solid #FFD700',
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: '1.8rem' }} />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  )
}
