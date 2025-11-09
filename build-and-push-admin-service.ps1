# Script PowerShell pour construire et pousser l'image Admin Management Service vers Docker Hub

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Build & Push Admin Management Service" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$IMAGE_NAME = "saberbarhoumi11/admin-management-service"
$VERSION = "1.0"
$FULL_IMAGE_NAME = "${IMAGE_NAME}:${VERSION}"
$SERVICE_PATH = "microservices\admin-management-service"

# Étape 1: Se déplacer dans le répertoire du service
Write-Host "[1/5] Navigation vers le dossier du service..." -ForegroundColor Yellow
Set-Location $SERVICE_PATH
Write-Host "✓ Répertoire actuel: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Étape 2: Construire l'image Docker
Write-Host "[2/5] Construction de l'image Docker..." -ForegroundColor Yellow
docker build -t $FULL_IMAGE_NAME .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Image construite avec succès: $FULL_IMAGE_NAME" -ForegroundColor Green
} else {
    Write-Host "✗ Erreur lors de la construction de l'image" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Étape 3: Vérifier l'image
Write-Host "[3/5] Vérification de l'image..." -ForegroundColor Yellow
docker images | Select-String $IMAGE_NAME
Write-Host "✓ Image vérifiée" -ForegroundColor Green
Write-Host ""

# Étape 4: Connexion à Docker Hub
Write-Host "[4/5] Connexion à Docker Hub..." -ForegroundColor Yellow
Write-Host "Si vous n'êtes pas connecté, entrez vos identifiants Docker Hub:" -ForegroundColor Cyan
docker login

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Connecté à Docker Hub" -ForegroundColor Green
} else {
    Write-Host "✗ Échec de la connexion à Docker Hub" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Étape 5: Push vers Docker Hub
Write-Host "[5/5] Push de l'image vers Docker Hub..." -ForegroundColor Yellow
docker push $FULL_IMAGE_NAME

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Image poussée avec succès vers Docker Hub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host "  Déploiement terminé avec succès!" -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Votre image est maintenant disponible sur:" -ForegroundColor Cyan
    Write-Host "https://hub.docker.com/r/$IMAGE_NAME" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pour l'utiliser:" -ForegroundColor Cyan
    Write-Host "docker pull $FULL_IMAGE_NAME" -ForegroundColor Yellow
} else {
    Write-Host "✗ Erreur lors du push vers Docker Hub" -ForegroundColor Red
    exit 1
}

# Retour au dossier racine
Set-Location ..\..
