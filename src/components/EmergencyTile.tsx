import { Box, Typography, Card, keyframes } from '@mui/material'
import { useState } from 'react'
import PhoneIcon from '@mui/icons-material/Phone'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import LocationOnIcon from '@mui/icons-material/LocationOn'

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
`

type EmergencyType = 'helper' | 'doctor' | 'location'

interface EmergencyTileProps {
  type: EmergencyType
  onActivate: () => void
}

const EMERGENCY_CONFIG = {
  helper: {
    icon: PhoneIcon,
    label: 'Hilfsperson anrufen',
    color: '#ef4444',
    description: '📞 Schnell Kontakt zur Hilfsperson',
  },
  doctor: {
    icon: LocalHospitalIcon,
    label: 'Arzt anrufen',
    color: '#dc2626',
    description: '🏥 Sofort Ärztliche Hilfe',
  },
  location: {
    icon: LocationOnIcon,
    label: 'Standort Mitteilen',
    color: '#991b1b',
    description: '📍 Meinen Standort teilen',
  },
}

export default function EmergencyTile({ type, onActivate }: EmergencyTileProps) {
  const [isPressed, setIsPressed] = useState(false)
  const config = EMERGENCY_CONFIG[type]
  const IconComponent = config.icon

  const handlePress = () => {
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 100)
    onActivate()
  }

  return (
    <Card
      onClick={handlePress}
      sx={{
        background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)`,
        color: 'white',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        minHeight: { xs: '100px', sm: '120px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: '16px', sm: '20px' },
        border: '3px solid rgba(255,255,255,0.3)',
        boxShadow: isPressed
          ? '0 8px 20px rgba(239, 68, 68, 0.4)'
          : '0 10px 30px rgba(239, 68, 68, 0.25)',
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.1s ease-in-out',
        animation: `${pulse} 2s infinite`,
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 15px 40px rgba(239, 68, 68, 0.3)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <IconComponent
          sx={{
            fontSize: { xs: '2.5rem', sm: '3rem' },
            fontWeight: 'bold',
          }}
        />
        <Typography
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.2,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {config.label}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            opacity: 0.9,
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          {config.description}
        </Typography>
      </Box>
    </Card>
  )
}
