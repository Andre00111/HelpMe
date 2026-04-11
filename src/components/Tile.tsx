import { Card, CardContent, Typography, Box } from '@mui/material'
import { useState, useRef } from 'react'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'

interface TileProps {
  id: string
  text: string
  color: string
  ariaLabel?: string
  onSpeak?: (text: string) => void
}

export default function Tile({ id, text, color, ariaLabel, onSpeak }: TileProps) {
  const [isActive, setIsActive] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    speakText()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Spreche Text aus wenn Enter oder Space gedrückt
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      speakText()
    }
  }

  const speakText = () => {
    // Visuelles Feedback
    setIsActive(true)
    setTimeout(() => setIsActive(false), 150)

    if (onSpeak) {
      onSpeak(text)
    } else {
      // Browser Text-to-Speech API (Fallback)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'de-DE'
        utterance.rate = 0.95
        utterance.pitch = 1
        utterance.volume = 1
        window.speechSynthesis.speak(utterance)
      }
    }
  }

  return (
    <Card
      ref={buttonRef}
      component="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-label={ariaLabel || text}
      aria-pressed="false"
      sx={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        height: '100%',
        minHeight: { xs: '140px', sm: '160px', md: '180px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: isFocused ? '5px solid #000' : '3px solid transparent',
        padding: 0,
        boxShadow: isFocused
          ? '0 0 0 8px #fbbf24, 0 20px 40px rgba(0,0,0,0.15)'
          : isActive
          ? '0 20px 40px rgba(0,0,0,0.15)'
          : '0 10px 30px rgba(0,0,0,0.12)',
        transform: isActive ? 'scale(0.96)' : isFocused ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '&:hover': {
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          transform: 'scale(1.02)',
        },
        '&:active': {
          transform: 'scale(0.96)',
        },
        textAlign: 'center',
        position: 'relative',
        backdropFilter: 'blur(10px)',
      }}
    >
      <CardContent
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: '16px', sm: '20px', md: '24px' },
          '&:last-child': {
            paddingBottom: { xs: '16px', sm: '20px', md: '24px' },
          },
        }}
      >
        <Typography
          component="span"
          sx={{
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: '1.3rem', sm: '1.6rem', md: '1.9rem' },
            textShadow: '0 3px 6px rgba(0,0,0,0.3)',
            wordBreak: 'break-word',
            lineHeight: 1.25,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <VolumeUpIcon
            sx={{
              fontSize: { xs: '2rem', sm: '2.4rem', md: '2.8rem' },
              opacity: 0.95,
            }}
          />
          <span>{text}</span>
        </Typography>
      </CardContent>

      {/* Visueller Indikator für aktiven Zustand */}
      {isActive && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            borderRadius: 'inherit',
            pointerEvents: 'none',
          }}
        />
      )}
    </Card>
  )
}
