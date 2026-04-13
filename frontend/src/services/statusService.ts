import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081'

interface StatusData {
  healthStatus: 'GOOD' | 'WARNING' | 'EMERGENCY'
  timestamp?: string
}

/**
 * StatusService - Handles health status updates
 */
class StatusService {
  /**
   * Send health status to backend API
   */
  async sendStatus(status: 'GOOD' | 'WARNING' | 'EMERGENCY'): Promise<void> {
    const token = localStorage.getItem('authToken')
    if (!token) {
      console.error('❌ Keine Authentifizierung gefunden')
      throw new Error('Keine Authentifizierung gefunden')
    }

    const statusData: StatusData = {
      healthStatus: status,
      timestamp: new Date().toISOString(),
    }

    console.log('📤 Sende Status zu Backend:', {
      url: `${API_BASE_URL}/api/status`,
      data: statusData,
      token: token.substring(0, 20) + '...',
    })

    try {
      const response = await axios.post(`${API_BASE_URL}/api/status`, statusData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      console.log(`✅ Status "${status}" erfolgreich gesendet:`, response.data)
    } catch (error) {
      console.error('❌ Fehler beim Senden des Status:', error)
      if (axios.isAxiosError(error)) {
        console.error('  Status:', error.response?.status)
        console.error('  Daten:', error.response?.data)
        console.error('  URL:', error.config?.url)
      }
      throw error
    }
  }
}

export default new StatusService()
