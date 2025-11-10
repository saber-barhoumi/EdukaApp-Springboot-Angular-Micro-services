# Étape 1 : image de base avec Java 17
FROM openjdk:17-jdk-slim

# Étape 2 : définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Étape 3 : copier le fichier JAR (qu’on va générer)
COPY target/library-management-service-0.0.1-SNAPSHOT.jar app.jar

# Étape 4 : exposer le port sur lequel l’application tourne
EXPOSE 8084

# Étape 5 : commande pour exécuter ton application
ENTRYPOINT ["java", "-jar", "app.jar"]
