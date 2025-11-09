FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy the JAR file
COPY target/*.jar app.jar

# Expose port
EXPOSE 8885

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
