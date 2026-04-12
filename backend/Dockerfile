# Stage 1: Build with Maven
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests for faster builds)
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime with JRE
FROM eclipse-temurin:17

WORKDIR /app

# Create non-root user for security
RUN groupadd -r helpme && useradd -r -g helpme helpme
USER helpme

# Copy JAR from builder stage
COPY --from=builder /app/target/helpme-backend-*.jar app.jar

EXPOSE 8081

# Environment variables (will be overridden by docker-compose)
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/helpme_db
ENV SPRING_DATASOURCE_USERNAME=helpme_user
ENV SPRING_DATASOURCE_PASSWORD=helpme_password
ENV SERVER_PORT=8081

ENTRYPOINT ["java", "-jar", "app.jar"]
