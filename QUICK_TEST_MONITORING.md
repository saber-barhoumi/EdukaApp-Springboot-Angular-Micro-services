# 🧪 Guide de Test Rapide - Monitoring Prometheus & Grafana

## ⚡ Démarrage Rapide (5 minutes)

### Option 1: Script Automatique (Recommandé)

```powershell
# Exécuter le script PowerShell
.\start-monitoring.ps1
```

### Option 2: Manuelle

```powershell
# 1. Build tous les services
cd infrastructure\eureka-server; mvn clean package -DskipTests; cd ..\..
cd infrastructure\config-server; mvn clean package -DskipTests; cd ..\..
cd infrastructure\api-gateway; mvn clean package -DskipTests; cd ..\..
cd microservices\restaurant-management-service; mvn clean package -DskipTests; cd ..\..
cd microservices\notification-service; mvn clean package -DskipTests; cd ..\..

# 2. Build images Docker
docker-compose build

# 3. Démarrer
docker-compose up -d

# 4. Attendre 1-2 minutes
```

---

## ✅ Tests de Vérification

### Test 1: Vérifier Actuator Endpoints

```powershell
# Restaurant Service
curl http://localhost:8083/actuator/health
curl http://localhost:8083/actuator/prometheus

# API Gateway
curl http://localhost:8888/actuator/health
curl http://localhost:8888/actuator/prometheus

# Eureka Server
curl http://localhost:8761/actuator/health
curl http://localhost:8761/actuator/prometheus

# Notification Service
curl http://localhost:8086/actuator/health
curl http://localhost:8086/actuator/prometheus
```

**Résultat attendu:** 
- `/actuator/health` → `{"status":"UP"}`
- `/actuator/prometheus` → Texte brut avec métriques

---

### Test 2: Vérifier Prometheus

1. **Ouvrir Prometheus:**
   ```
   http://localhost:9090
   ```

2. **Vérifier les Targets:**
   - Aller dans **Status → Targets**
   - **Tous les services doivent être UP** (vert) ✅
   
   Services attendus:
   - ✅ eureka-server (8761)
   - ✅ config-server (8885)
   - ✅ api-gateway (8888)
   - ✅ restaurant-service (8083)
   - ✅ notification-service (8086)
   - ✅ admin-management-service (8087)

3. **Tester une Query:**
   ```promql
   # Dans la barre de recherche:
   up
   ```
   
   **Exécuter** → Devrait montrer `up = 1` pour tous les services

4. **Query CPU:**
   ```promql
   system_cpu_usage
   ```

5. **Query Memory:**
   ```promql
   jvm_memory_used_bytes{area="heap"}
   ```

**Screenshot:** Prendre une capture d'écran des targets UP ✅

---

### Test 3: Configurer Grafana

1. **Ouvrir Grafana:**
   ```
   http://localhost:3001
   ```

2. **Login:**
   - Username: `admin`
   - Password: `admin`
   - (Skip le changement de mot de passe si vous voulez)

3. **Ajouter Prometheus Data Source:**
   - Cliquer sur **⚙️ (Settings)** → **Data Sources**
   - Cliquer **Add data source**
   - Sélectionner **Prometheus**
   - **Configuration:**
     ```
     Name: Prometheus
     URL: http://prometheus:9090
     Access: Server (default)
     ```
   - Cliquer **Save & Test**
   - **Devrait afficher:** ✅ "Data source is working"

**Screenshot:** Prendre une capture de "Data source is working" ✅

---

### Test 4: Importer un Dashboard

1. **Dans Grafana:**
   - Cliquer **+ (Create)** → **Import**

2. **Importer via ID:**
   - Entrer: `11378` (JVM Micrometer Dashboard)
   - Cliquer **Load**

3. **Configurer:**
   - Prometheus: Sélectionner **Prometheus**
   - Cliquer **Import**

4. **Dashboard créé!** 🎉
   - Vous devriez voir:
     - 📊 CPU Usage
     - 💾 Memory Usage (Heap)
     - 🔢 Thread Count
     - 🌐 HTTP Requests
     - ⏱️ Response Time

**Screenshot:** Dashboard complet avec métriques en temps réel ✅

---

### Test 5: Générer du Trafic

Pour voir les métriques changer en temps réel:

```powershell
# Faire plusieurs requêtes au restaurant service
for ($i=1; $i -le 100; $i++) {
    curl http://localhost:8083/api/restaurants
    Start-Sleep -Milliseconds 100
}
```

**Dans Grafana:** Vous devriez voir:
- 📈 HTTP Requests augmenter
- ⏱️ Response Time mis à jour
- 🔥 Thread Count varier

---

## 📊 Queries Prometheus Utiles

### Métriques HTTP

```promql
# Total requests
http_server_requests_seconds_count

# Requests per second
rate(http_server_requests_seconds_count[1m])

# Average response time (ms)
rate(http_server_requests_seconds_sum[1m]) / rate(http_server_requests_seconds_count[1m]) * 1000

# Requests by status code
sum by (status) (rate(http_server_requests_seconds_count[1m]))

# Error rate (5xx)
sum(rate(http_server_requests_seconds_count{status=~"5.."}[1m]))
```

### Métriques JVM

```promql
# Heap memory usage (%)
jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"} * 100

# Non-heap memory
jvm_memory_used_bytes{area="nonheap"}

# Thread count
jvm_threads_live_threads

# GC count
rate(jvm_gc_pause_seconds_count[1m])

# GC time
rate(jvm_gc_pause_seconds_sum[1m])
```

### Métriques Système

```promql
# CPU usage (%)
system_cpu_usage * 100

# Process CPU usage
process_cpu_usage * 100

# System load average
system_load_average_1m
```

### Métriques Database

```promql
# Active connections
hikaricp_connections_active

# Idle connections
hikaricp_connections_idle

# Connection timeout
hikaricp_connections_timeout_total
```

---

## 🎨 Dashboards Recommandés à Importer

| ID | Nom | Description |
|----|-----|-------------|
| **11378** | JVM (Micrometer) | Métriques JVM complètes ⭐ |
| **4701** | JVM (Actuator) | Alternative pour Spring Boot |
| **12900** | Spring Boot 2.1 Statistics | Statistiques Spring Boot |
| **3662** | Prometheus 2.0 Stats | Overview Prometheus |
| **10991** | Spring Boot Performance | Performance monitoring |

---

## 🐛 Troubleshooting Rapide

### ❌ Target "DOWN" dans Prometheus

```powershell
# Vérifier le service
docker logs restaurant-service-eduka

# Vérifier actuator
curl http://localhost:8083/actuator/health

# Redémarrer le service
docker-compose restart restaurant-management-service
```

### ❌ "No data" dans Grafana

1. Vérifier que Prometheus est bien configuré:
   - URL: `http://prometheus:9090` (PAS localhost!)
   
2. Tester la connexion Data Source

3. Vérifier dans Prometheus que les métriques existent:
   ```promql
   up{job="restaurant-service"}
   ```

### ❌ Service ne démarre pas

```powershell
# Voir les logs
docker logs --tail 100 restaurant-service-eduka

# Rebuild
cd microservices\restaurant-management-service
mvn clean package -DskipTests
docker-compose build restaurant-management-service
docker-compose up -d restaurant-management-service
```

---

## 📸 Screenshots Requis pour le Rapport

1. ✅ **Prometheus Targets** - Tous les services UP (vert)
2. ✅ **Grafana Data Source** - "Data source is working"
3. ✅ **Dashboard Grafana** - Vue d'ensemble avec métriques
4. ✅ **Graph CPU Usage** - Evolution du CPU
5. ✅ **Graph Memory** - Heap memory usage
6. ✅ **HTTP Requests** - Requêtes par seconde
7. ✅ **Docker PS** - Tous les conteneurs running

---

## ⏱️ Timeline de Test

**Temps total estimé:** 10 minutes

```
00:00 - Démarrer docker-compose up -d
01:00 - Attendre le démarrage complet
02:00 - Vérifier Prometheus targets
03:00 - Vérifier Actuator endpoints
04:00 - Login Grafana
05:00 - Configurer Data Source Prometheus
06:00 - Importer Dashboard 11378
07:00 - Générer du trafic
08:00 - Observer les métriques
09:00 - Prendre screenshots
10:00 - ✅ TERMINÉ
```

---

## ✅ Checklist Finale

Avant de dire que c'est terminé:

- [ ] `docker ps` montre 13 conteneurs running
- [ ] Prometheus accessible (http://localhost:9090)
- [ ] Tous les targets sont UP dans Prometheus
- [ ] Grafana accessible (http://localhost:3001)
- [ ] Data source Prometheus configurée ✅
- [ ] Dashboard importé et affiche des données
- [ ] Métriques changent quand je génère du trafic
- [ ] 7 screenshots pris pour le rapport
- [ ] Guide MONITORING_GUIDE.md lu et compris

---

## 🎯 Pour Impressionner le Prof

Pendant la présentation:

1. **Montrer Prometheus Targets** - "Tous mes services sont monitorés en temps réel"

2. **Faire une requête** - `curl http://localhost:8083/api/restaurants`

3. **Montrer Grafana** - "Et voilà, on voit la requête apparaître en temps réel"

4. **Expliquer les métriques:**
   - "Le CPU est à X%"
   - "La mémoire heap est à Y MB"
   - "On a Z requêtes par seconde"

5. **Montrer les alertes (si configurées):**
   - "Si le CPU dépasse 80%, je reçois une alerte"

6. **Architecture Diagram:**
   ```
   Frontend → API Gateway → Services → Actuator → Prometheus → Grafana
   ```

**Points clés à mentionner:**
- ✅ Production-ready monitoring
- ✅ Observabilité complète
- ✅ Industry standard tools (Prometheus, Grafana)
- ✅ Real-time metrics
- ✅ Can scale to thousands of services

---

## 📚 Commandes Utiles

```powershell
# Voir tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker logs -f prometheus-eduka
docker logs -f grafana-eduka

# Redémarrer tout
docker-compose restart

# Arrêter tout
docker-compose down

# Supprimer volumes (ATTENTION!)
docker-compose down -v

# Status des services
docker-compose ps

# Entrer dans un conteneur
docker exec -it prometheus-eduka sh
docker exec -it grafana-eduka sh
```

---

**🎉 Succès garanti! Votre système de monitoring est opérationnel!**

**Note attendue:** +2 points pour la valeur ajoutée 🚀
