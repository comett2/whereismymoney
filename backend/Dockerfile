# Etap 1: build
FROM gradle:8.9-jdk21 AS build
WORKDIR /app
COPY . .
RUN gradle clean build -x test

# Etap 2: run
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/build/libs/whereismymoney-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
