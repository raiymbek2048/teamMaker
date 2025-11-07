# ---------- Этап 1: сборка ----------
# ---------- Этап 1: build ----------
FROM maven:3.9.8-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# ---------- Этап 2: runtime ----------
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

# Открываем порт приложения
EXPOSE 8500

# Переменные окружения можно переопределять из docker-compose
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/team \
    SPRING_DATASOURCE_USERNAME=postgres \
    SPRING_DATASOURCE_PASSWORD=1234 \
    SPRING_JPA_HIBERNATE_DDL_AUTO=update \
    SPRING_JPA_SHOW_SQL=true

ENTRYPOINT ["java","-jar","app.jar"]
