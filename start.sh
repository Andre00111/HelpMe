#!/bin/bash

set -e

echo "================================================"
echo "  HelpMe - Starting all services with Docker"
echo "================================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ FEHLER: Docker ist nicht gestartet."
  echo "   Bitte starten Sie Docker Desktop und versuchen Sie es erneut."
  exit 1
fi

echo "🐳 Starte alle Services (Database, Backend, Frontend)..."
echo ""

# Build and start in detached mode
docker compose up --build -d

echo ""
echo "⏳ Warte auf Services zum Starten..."
sleep 5

echo ""
echo "================================================"
echo "  ✅ Services erfolgreich gestartet!"
echo "================================================"
echo ""
echo "🚀 Verfügbar unter:"
echo ""
echo "   📱 Frontend (Mobile App):     http://localhost:3000"
echo "   🏥 Backend API:               http://localhost:8081/api"
echo "   🏥 Health-Check:              http://localhost:8081/api/auth/health"
echo "   💾 PostgreSQL:                localhost:5432"
echo ""
echo "📝 Nützliche Docker-Befehle:"
echo ""
echo "   Logs anzeigen:    docker compose logs -f"
echo "   Nur Backend:      docker compose logs -f backend"
echo "   Services stoppen: docker compose down"
echo "   Alles löschen:    docker compose down -v"
echo ""
echo "================================================"
