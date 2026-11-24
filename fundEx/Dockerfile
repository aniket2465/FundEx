# ---------- Build stage ----------
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw clean package -DskipTests

# ---------- Run stage ----------
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render free tier has 512 MB RAM, so cap the Java heap
ENV JAVA_TOOL_OPTIONS="-Xmx350m"

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
