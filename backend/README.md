# HelpMe Backend

Spring Boot Backend für HelpMe - Barrierearme Kommunikations-App mit JWT Authentication und PostgreSQL.

## 🚀 Technologie-Stack

- **Framework:** Spring Boot 3.2.0
- **Sprache:** Java 17
- **Datenbank:** PostgreSQL 15
- **Authentifizierung:** JWT (JSON Web Token)
- **Build Tool:** Maven
- **Security:** Spring Security mit BCrypt

## 📋 Anforderungen

- Java 17+
- Maven 3.6+
- Docker & Docker Compose (für PostgreSQL)
- PostgreSQL 15 (oder Docker)

## 🛠️ Installation & Setup

### 1. PostgreSQL mit Docker starten

```bash
cd backend
docker-compose up -d
```

Das startet PostgreSQL auf `localhost:5432` mit:
- **Database:** helpme_db
- **User:** helpme_user
- **Password:** helpme_password

### 2. Backend starten

```bash
mvn clean install
mvn spring-boot:run
```

Das Backend läuft dann unter `http://localhost:8080/api`

### 3. JWT Secret konfigurieren

In `application.properties` den `jwt.secret` ändern (mindestens 32 Zeichen):

```properties
jwt.secret=dein-eigener-super-langer-secret-key-mindestens-32-zeichen!!
```

## 📚 API Endpoints

### Auth Endpoints

#### Registrierung
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "password": "passwort123",
  "passwordConfirm": "passwort123",
  "isHelper": false
}

Response: 201 Created
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "userId": 1,
  "name": "Max Mustermann",
  "email": "max@example.com",
  "isHelper": false
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "max@example.com",
  "password": "passwort123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "userId": 1,
  "name": "Max Mustermann",
  "email": "max@example.com",
  "isHelper": false
}
```

#### Aktueller User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "name": "Max Mustermann",
  "email": "max@example.com",
  ...
}
```

### Tile Endpoints

#### Alle Kacheln abrufen
```
GET /api/tiles
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "title": "Guten Morgen",
    "text": "Guten Morgen! Wie geht es dir?",
    "color": "#6366f1",
    "category": "ZUHAUSE",
    "position": 0,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00",
    "active": true
  }
]
```

#### Kacheln nach Kategorie abrufen
```
GET /api/tiles/category/zuhause
Authorization: Bearer <token>

Categories: ZUHAUSE, DRAUSSEN, ARZT, ESSEN, NOTFALL
```

#### Einzelne Kachel abrufen
```
GET /api/tiles/{id}
Authorization: Bearer <token>
```

#### Kachel erstellen
```
POST /api/tiles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Neue Kachel",
  "text": "Das ist ein Test",
  "color": "#6366f1",
  "category": "ZUHAUSE"
}

Response: 201 Created
```

#### Kachel aktualisieren
```
PUT /api/tiles/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Aktualisiert",
  "text": "Aktualisierter Text",
  "color": "#8b5cf6",
  "category": "ZUHAUSE"
}
```

#### Kachel löschen
```
DELETE /api/tiles/{id}
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Kachel gelöscht",
  "timestamp": 1704110400000
}
```

#### Kacheln neu anordnen
```
POST /api/tiles/reorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "tileIds": [3, 1, 2, 4]
}
```

## 🔐 JWT Token

Der Token muss in allen geschützten Requests im Authorization Header mitgesendet werden:

```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJtYXhAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDQxMTA0MDB9...
```

**Token-Format:**
- Typ: HS512 HMAC
- Expiration: 24 Stunden (konfigurierbar)
- Claims: userId, email

## 📦 Datenbankstruktur

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_helper BOOLEAN DEFAULT false,
    helper_of_id BIGINT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    last_login TIMESTAMP
);
```

### Tiles Table
```sql
CREATE TABLE tiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    color VARCHAR(7) NOT NULL,
    category VARCHAR(50) NOT NULL,
    position INTEGER,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
```

## 🧪 Testing mit cURL

```bash
# Registrierung
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "passwordConfirm": "password123",
    "isHelper": false
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Kacheln abrufen (mit Token)
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:8080/api/tiles

# Kachel erstellen
curl -X POST http://localhost:8080/api/tiles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "text": "Test text",
    "color": "#6366f1",
    "category": "ZUHAUSE"
  }'
```

## 📝 Logs

Logs sind konfiguriert für:
- **Root Level:** INFO
- **Application (com.helpme):** DEBUG
- **Spring Security:** DEBUG

Ändern in `application.properties`:
```properties
logging.level.com.helpme=DEBUG
logging.level.org.springframework.security=DEBUG
```

## 🚀 Production Deployment

### Sicherheit

1. **JWT Secret ändern** - Verwende einen sehr langen, zufälligen String
2. **CORS konfigurieren** - Nur erlaubte Origins hinzufügen
3. **HTTPS** - Verwende SSL/TLS in Production
4. **Database** - Starke Passwörter verwenden

### Environment Variables

```bash
# application.properties oder via Umgebungsvariablen
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/helpme_db
SPRING_DATASOURCE_USERNAME=helpme_user
SPRING_DATASOURCE_PASSWORD=<strong_password>
JWT_SECRET=<very_long_random_secret>
JWT_EXPIRATION=86400000
```

## 📊 Performance

- Datenbank-Indizes auf `user_id` und `category`
- Lazy Loading für User-Tiles Relationship
- Connection Pooling mit HikariCP
- Query Optimization mit JPA

## 🐛 Troubleshooting

**PostgreSQL verbindet nicht:**
```bash
# Docker Logs prüfen
docker logs helpme_postgres

# Oder manuell verbinden
docker exec -it helpme_postgres psql -U helpme_user -d helpme_db
```

**JWT Token ungültig:**
- Token ist abgelaufen (nach 24h)
- Secret hat sich geändert
- Token ist beschädigt

**CORS Fehler:**
- Prüfe Allowed Origins in `SecurityConfig.java`
- Frontend-URL muss im CORS-Config sein

## 📚 Weitere Ressourcen

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Version:** 1.0.0  
**Last Updated:** 2024
