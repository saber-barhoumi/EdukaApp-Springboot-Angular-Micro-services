# Guide Docker - Admin Management Service

## 📦 Architecture Dockerisée

L'application EdukaApp utilise Docker Compose pour orchestrer tous les microservices:

### Services Déployés:
1. **Keycloak** (Port 8080) - Serveur d'authentification OAuth2
2. **Eureka Server** (Port 8761) - Service Discovery
3. **Config Server** (Port 8885) - Configuration centralisée
4. **API Gateway** (Port 8888) - Point d'entrée sécurisé avec Keycloak
5. **MongoDB** (Port 27017) - Base de données pour User Management
6. **MySQL** (Port 3306) - Base de données pour Admin Management
7. **RabbitMQ** (Ports 5672, 15672) - Message Broker
8. **User Management Service** (Port 3000) - Node.js + MongoDB
9. **Admin Management Service** (Port 8087) - Spring Boot + MySQL + OpenFeign
10. **Restaurant Service** (Port 8083) - Spring Boot + H2
11. **Notification Service** (Port 8086) - Spring Boot + RabbitMQ
12. **Frontend Angular** (Port 4200) - Interface utilisateur

---

## 🚀 Démarrage Rapide

### 1️⃣ Construction et démarrage de tous les services:

```bash
docker-compose up --build
```

Cette commande va:
- ✅ Construire toutes les images Docker
- ✅ Créer les conteneurs
- ✅ Démarrer tous les services dans le bon ordre

### 2️⃣ Démarrage en arrière-plan:

```bash
docker-compose up -d
```

### 3️⃣ Arrêt des services:

```bash
docker-compose down
```

### 4️⃣ Arrêt et suppression des volumes:

```bash
docker-compose down -v
```

---

## 🔨 Construction de l'image Admin Management Service

### Build local:

```bash
cd microservices/admin-management-service
docker build -t saberbarhoumi11/admin-management-service:1.0 .
```

### Test de l'image localement:

```bash
docker run -p 8087:8087 \
  -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://localhost:8761/eureka \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/admin_management_db \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=root \
  saberbarhoumi11/admin-management-service:1.0
```

---

## 📤 Push vers Docker Hub

### 1. Connexion à Docker Hub:

```bash
docker login
```

Entrez vos identifiants Docker Hub.

### 2. Tag de l'image:

```bash
docker tag saberbarhoumi11/admin-management-service:1.0 saberbarhoumi11/admin-management-service:1.0
```

### 3. Push vers Docker Hub:

```bash
docker push saberbarhoumi11/admin-management-service:1.0
```

### 4. Vérification:

Allez sur https://hub.docker.com et vérifiez que l'image est bien uploadée.

---

## 🌐 Test avec Play With Docker (PWD)

### 1. Accéder à PWD:
- Aller sur: https://labs.play-with-docker.com/
- Cliquer sur **Login** → **Docker**
- Utiliser les mêmes identifiants que Docker Hub

### 2. Créer une nouvelle instance:
- Cliquer sur **+ ADD NEW INSTANCE**

### 3. Cloner le repository ou télécharger docker-compose-hub.yml:

```bash
wget https://raw.githubusercontent.com/votre-repo/EdukaApp/main/docker-compose-hub.yml
```

### 4. Démarrer l'application:

```bash
docker-compose -f docker-compose-hub.yml up -d
```

### 5. Tester les services:

Les ports s'afficheront automatiquement sur PWD. Cliquez dessus pour accéder aux services:
- **8080** → Keycloak
- **8761** → Eureka
- **8888** → API Gateway
- **4200** → Frontend Angular

---

## 🔍 Commandes Utiles

### Voir les conteneurs en cours d'exécution:

```bash
docker ps
```

### Voir tous les conteneurs (même arrêtés):

```bash
docker ps -a
```

### Voir les logs d'un service:

```bash
docker-compose logs admin-management-service
docker-compose logs -f admin-management-service  # Mode suivi
```

### Redémarrer un service spécifique:

```bash
docker-compose restart admin-management-service
```

### Reconstruire un service spécifique:

```bash
docker-compose up --build admin-management-service
```

### Voir les images Docker:

```bash
docker images
```

### Supprimer une image:

```bash
docker rmi saberbarhoumi11/admin-management-service:1.0
```

### Nettoyer les ressources inutilisées:

```bash
docker system prune -a
```

---

## 📊 Vérification des Services

### 1. Eureka Dashboard:
```
http://localhost:8761
```

Tous les microservices doivent être enregistrés.

### 2. API Gateway Health:
```
http://localhost:8888/actuator/health
```

### 3. Admin Management Service:
```
http://localhost:8888/api/v1/academic-programs
http://localhost:8888/api/v1/departments
```

### 4. Keycloak Admin Console:
```
http://localhost:8080
Username: admin
Password: admin
```

### 5. RabbitMQ Management:
```
http://localhost:15672
Username: guest
Password: guest
```

### 6. Frontend Angular:
```
http://localhost:4200
```

---

## 🛠️ Configuration Docker

### Variables d'environnement importantes:

#### Admin Management Service:
```yaml
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
SPRING_DATASOURCE_URL=jdbc:mysql://mysqldb:3306/admin_management_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
USER_SERVICE_URL=http://user-management-nodejs:3000
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_PROFILES_ACTIVE=docker
```

#### API Gateway:
```yaml
SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI=http://keycloak:8080/realms/Eduka-realm
```

---

## 🐛 Dépannage

### Problème: Le conteneur admin-management-service ne démarre pas

**Solution 1:** Vérifier les logs
```bash
docker-compose logs admin-management-service
```

**Solution 2:** Vérifier que MySQL est démarré
```bash
docker-compose ps mysqldb
```

**Solution 3:** Reconstruire l'image
```bash
docker-compose up --build admin-management-service
```

### Problème: Port déjà utilisé

**Solution:** Arrêter le service qui utilise le port
```bash
# Windows
netstat -ano | findstr :8087
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8087 | xargs kill -9
```

### Problème: Erreur de connexion à MySQL

**Solution:** Attendre que MySQL soit complètement démarré
```bash
docker-compose logs mysqldb
```

Rechercher: `mysqld: ready for connections`

---

## 📚 Documentation Complémentaire

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com)
- [Play With Docker](https://labs.play-with-docker.com/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)

---

## ✅ Checklist pour l'équipe

- [ ] Docker et Docker Compose installés
- [ ] Compte Docker Hub créé
- [ ] Images buildées localement
- [ ] Images pushées sur Docker Hub
- [ ] docker-compose.yml configuré
- [ ] Tests locaux réussis avec `docker-compose up`
- [ ] Tests sur PWD réussis
- [ ] Documentation partagée avec l'équipe
- [ ] Keycloak realm exporté et configuré

---

**Auteur:** Saber Barhoumi  
**Date:** Novembre 2025  
**Version:** 1.0
