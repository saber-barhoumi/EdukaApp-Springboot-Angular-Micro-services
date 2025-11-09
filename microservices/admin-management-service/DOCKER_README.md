# Admin Management Service - Configuration Docker

## 📋 Description

Le service **Admin Management** gère les programmes académiques et les départements de l'application EdukaApp. Il utilise:
- **Spring Boot 3.1.5** avec Java 17
- **MySQL 8.0** pour la persistance des données
- **OpenFeign** pour communiquer avec le User Management Service (Node.js)
- **Eureka Client** pour l'enregistrement au service discovery
- **Resilience4j** pour la résilience (Circuit Breaker, Retry)

---

## 🐳 Dockerfile

Le Dockerfile utilise une **construction multi-étapes** pour optimiser la taille de l'image:

### Stage 1: Build
- Image de base: `maven:3.8.5-openjdk-17`
- Télécharge les dépendances Maven
- Compile le code source
- Package l'application en JAR

### Stage 2: Runtime
- Image de base: `openjdk:17-jdk-slim`
- Copie uniquement le JAR final
- Taille réduite pour un déploiement rapide

---

## 🔧 Variables d'Environnement

### Variables obligatoires:

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `SPRING_DATASOURCE_URL` | URL de connexion MySQL | `jdbc:mysql://mysqldb:3306/admin_management_db` |
| `SPRING_DATASOURCE_USERNAME` | Utilisateur MySQL | `root` |
| `SPRING_DATASOURCE_PASSWORD` | Mot de passe MySQL | `root` |
| `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | URL Eureka Server | `http://eureka-server:8761/eureka/` |
| `USER_SERVICE_URL` | URL User Management Service | `http://user-management-nodejs:3000` |

### Variables optionnelles:

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Mode Hibernate DDL | `update` |
| `SPRING_PROFILES_ACTIVE` | Profile Spring actif | `docker` |
| `SERVER_PORT` | Port du service | `8087` |

---

## 🚀 Construction de l'Image

### Méthode 1: Commande Docker directe

```bash
cd microservices/admin-management-service
docker build -t saberbarhoumi11/admin-management-service:1.0 .
```

### Méthode 2: Script PowerShell automatisé

```powershell
.\build-and-push-admin-service.ps1
```

Ce script va:
1. ✅ Construire l'image
2. ✅ Vérifier l'image
3. ✅ Se connecter à Docker Hub
4. ✅ Pousser l'image vers Docker Hub

### Méthode 3: Via Docker Compose

```bash
docker-compose build admin-management-service
```

---

## 🏃 Exécution du Service

### Option 1: Exécution standalone (avec MySQL local)

```bash
docker run -d \
  --name admin-management-service \
  -p 8087:8087 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/admin_management_db \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=root \
  -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://host.docker.internal:8761/eureka \
  -e USER_SERVICE_URL=http://host.docker.internal:3000 \
  saberbarhoumi11/admin-management-service:1.0
```

### Option 2: Avec Docker Compose (recommandé)

```bash
docker-compose up admin-management-service
```

---

## 📊 Architecture de Déploiement

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (8888)                       │
│              Secured with Keycloak OAuth2                    │
└────────────────────┬────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
┌─────────▼─────────┐  ┌────────▼─────────────┐
│ Admin Management  │  │  User Management     │
│   Service (8087)  │──│  Service (3000)      │
│   Spring Boot     │  │  Node.js + MongoDB   │
│   + MySQL         │  └──────────────────────┘
└─────────┬─────────┘
          │
┌─────────▼─────────┐
│  MySQL Database   │
│     (3306)        │
│ admin_management  │
│      _db          │
└───────────────────┘
```

---

## 🔗 Dépendances du Service

### Services requis avant le démarrage:

1. **MySQL Database** (`mysqldb:3306`)
   - Base de données: `admin_management_db`
   - Auto-créée au démarrage

2. **Eureka Server** (`eureka-server:8761`)
   - Service Discovery
   - Enregistrement automatique

3. **User Management Service** (`user-management-nodejs:3000`)
   - Communication via OpenFeign
   - Validation des utilisateurs

### Services optionnels:

4. **Config Server** (`config-server:8888`)
   - Configuration centralisée

5. **Keycloak** (`keycloak:8080`)
   - Authentification OAuth2 via API Gateway

---

## 🧪 Tests et Vérification

### 1. Vérifier que le service est démarré:

```bash
docker logs admin-management-service-eduka
```

Rechercher: `Started AdminManagementApplication`

### 2. Vérifier l'enregistrement Eureka:

```
http://localhost:8761
```

Le service `ADMIN-MANAGEMENT-SERVICE` doit apparaître.

### 3. Tester les endpoints:

#### Via API Gateway (recommandé):
```bash
# Lister les programmes académiques
curl http://localhost:8888/api/v1/academic-programs

# Créer un programme
curl -X POST http://localhost:8888/api/v1/academic-programs \
  -H "Content-Type: application/json" \
  -d '{
    "programName": "Computer Science",
    "programCode": "CS101",
    "description": "Bachelor in Computer Science",
    "duration": "4 years",
    "active": true,
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1"
  }'
```

#### Direct (mode développement):
```bash
curl http://localhost:8087/api/v1/academic-programs
```

### 4. Vérifier la base de données:

```bash
docker exec -it mysql-eduka mysql -uroot -proot -e "USE admin_management_db; SHOW TABLES;"
```

---

## 📤 Push vers Docker Hub

### Étape 1: Tag de l'image

```bash
docker tag saberbarhoumi11/admin-management-service:1.0 saberbarhoumi11/admin-management-service:latest
```

### Étape 2: Push multiple tags

```bash
docker push saberbarhoumi11/admin-management-service:1.0
docker push saberbarhoumi11/admin-management-service:latest
```

### Étape 3: Vérification

Votre image est disponible sur:
```
https://hub.docker.com/r/saberbarhoumi11/admin-management-service
```

---

## 🛠️ Configuration Docker Compose

Voici la configuration complète pour `docker-compose.yml`:

```yaml
admin-management-service:
  build: ./microservices/admin-management-service
  image: saberbarhoumi11/admin-management-service:1.0
  container_name: admin-management-service-eduka
  ports:
    - "8087:8087"
  depends_on:
    mysqldb:
      condition: service_healthy
    eureka-server:
      condition: service_healthy
    user-management-nodejs:
      condition: service_healthy
  environment:
    - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
    - SPRING_DATASOURCE_URL=jdbc:mysql://mysqldb:3306/admin_management_db?createDatabaseIfNotExist=true&useSSL=false
    - SPRING_DATASOURCE_USERNAME=root
    - SPRING_DATASOURCE_PASSWORD=root
    - SPRING_JPA_HIBERNATE_DDL_AUTO=update
    - USER_SERVICE_URL=http://user-management-nodejs:3000
    - SPRING_PROFILES_ACTIVE=docker
  networks:
    - eduka-network
  healthcheck:
    test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8087/actuator/health || exit 1"]
    interval: 15s
    timeout: 5s
    retries: 10
    start_period: 40s
```

---

## 🐛 Dépannage

### Problème 1: Erreur de connexion MySQL

**Symptôme:**
```
Communications link failure
```

**Solution:**
```bash
# Vérifier que MySQL est démarré
docker-compose ps mysqldb

# Vérifier les logs MySQL
docker-compose logs mysqldb

# Attendre le healthcheck
docker-compose up -d mysqldb
sleep 30
docker-compose up admin-management-service
```

### Problème 2: Port 8087 déjà utilisé

**Solution:**
```powershell
# Windows
netstat -ano | findstr :8087
taskkill /PID <PID> /F

# Ou changer le port dans docker-compose.yml
ports:
  - "8088:8087"  # Utiliser 8088 au lieu de 8087
```

### Problème 3: UserServiceClient ne se connecte pas

**Symptôme:**
```
feign.RetryableException: Connection refused
```

**Solution:**
```bash
# Vérifier que user-management-nodejs est démarré
docker-compose ps user-management-nodejs

# Vérifier la variable USER_SERVICE_URL
docker exec admin-management-service-eduka env | grep USER_SERVICE
```

### Problème 4: Table 'admin_management_db.academic_program' doesn't exist

**Solution:**
```bash
# Vérifier le mode Hibernate DDL
docker exec admin-management-service-eduka env | grep HIBERNATE_DDL

# Devrait être "update" ou "create"
# Redémarrer le service
docker-compose restart admin-management-service
```

---

## 📚 Endpoints API

### Academic Programs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/academic-programs` | Liste tous les programmes |
| `GET` | `/api/v1/academic-programs/{id}` | Récupère un programme par ID |
| `POST` | `/api/v1/academic-programs` | Crée un nouveau programme |
| `PUT` | `/api/v1/academic-programs/{id}` | Met à jour un programme |
| `DELETE` | `/api/v1/academic-programs/{id}` | Supprime un programme |

### Departments

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/departments` | Liste tous les départements |
| `GET` | `/api/v1/departments/{id}` | Récupère un département par ID |
| `POST` | `/api/v1/departments` | Crée un nouveau département |
| `PUT` | `/api/v1/departments/{id}` | Met à jour un département |
| `DELETE` | `/api/v1/departments/{id}` | Supprime un département |

---

## 🔒 Sécurité

- ✅ Communication sécurisée via API Gateway
- ✅ Validation JWT avec Keycloak
- ✅ Validation des userId via User Management Service
- ✅ Circuit Breaker pour la résilience
- ✅ Retry automatique en cas d'échec

---

**Auteur:** Saber Barhoumi  
**Service:** Admin Management  
**Version:** 1.0  
**Date:** Novembre 2025
