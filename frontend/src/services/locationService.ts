import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081'

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
}

/**
 * LocationService - Handles geolocation tracking and API communication
 */
class LocationService {
  private watchId: number | null = null
  private isTracking: boolean = false

  /**
   * Request user's permission and start tracking location (no status - just track coordinates)
   */
  startTracking(
    onSuccess?: (location: LocationData) => void,
    onError?: (error: string) => void
  ): void {
    if (!navigator.geolocation) {
      const msg = 'Geolocation wird vom Browser nicht unterstützt'
      console.error(msg)
      onError?.(msg)
      return
    }

    this.isTracking = true

    // Start continuous position tracking
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }

        console.log('Location received:', locationData)
        onSuccess?.(locationData)

        // Don't send automatically - let the UI handle sending with the user's chosen status
      },
      (error) => {
        let errorMsg = 'Fehler beim Abrufen des Standorts'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Standortzugriff verweigert. Bitte aktivieren Sie ihn in den Einstellungen.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Standortinformationen nicht verfügbar'
            break
          case error.TIMEOUT:
            errorMsg = 'Standortanfrage hat zu lange gedauert'
            break
        }
        console.error(errorMsg, error)
        onError?.(errorMsg)
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 0,
      }
    )
  }

  /**
   * Stop tracking location
   */
  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
    this.isTracking = false
    console.log('Location tracking stopped')
  }

  /**
   * Get current location once (promise-based)
   */
  getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation wird vom Browser nicht unterstützt'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
        },
        (error) => {
          let errorMsg = 'Fehler beim Abrufen des Standorts'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = 'Standortzugriff verweigert'
              break
            case error.POSITION_UNAVAILABLE:
              errorMsg = 'Standortinformationen nicht verfügbar'
              break
            case error.TIMEOUT:
              errorMsg = 'Standortanfrage hat zu lange gedauert'
              break
          }
          reject(new Error(errorMsg))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }

  /**
   * Send location data to backend API
   */
  async sendLocationToBackend(location: LocationData): Promise<void> {
    const token = localStorage.getItem('authToken')
    if (!token) {
      console.error('❌ [LocationService] Keine Authentifizierung gefunden')
      throw new Error('Keine Authentifizierung gefunden')
    }

    console.log('📤 [LocationService] POST /location:', { lat: location.latitude, lng: location.longitude })

    try {
      await axios.post(`${API_BASE_URL}/api/location`, location, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      console.log('✅ [LocationService] Location erfolgreich gesendet')
    } catch (error) {
      console.error('❌ [LocationService] Fehler:', error)
      throw error
    }
  }

  /**
   * Check if tracking is currently active
   */
  isLocationTracking(): boolean {
    return this.isTracking
  }
}

export default new LocationService()
