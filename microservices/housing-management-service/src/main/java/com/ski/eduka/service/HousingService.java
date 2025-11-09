package com.ski.eduka.service;

import com.ski.eduka.entity.Chambre;
import com.ski.eduka.entity.Foyer;
import com.ski.eduka.enums.ChambreType;
import com.ski.eduka.repository.ChambreRepository;
import com.ski.eduka.repository.FoyerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Slf4j
public class HousingService {

    @Autowired
    private FoyerRepository foyerRepository;

    @Autowired
    private ChambreRepository chambreRepository;

    // ============================================
    // CRUD FOYER (ADMIN ONLY)
    // ============================================

    /**
     * Créer un nouveau foyer
     */
    public Foyer createFoyer(Foyer foyer) {
        log.info("🏢 Création d'un nouveau foyer: {}", foyer.getNom());
        return foyerRepository.save(foyer);
    }

    /**
     * Mettre à jour un foyer
     */
    public Foyer updateFoyer(Long id, Foyer foyerDetails) {
        Foyer foyer = foyerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Foyer non trouvé avec l'ID: " + id));

        foyer.setNom(foyerDetails.getNom());
        foyer.setAdresse(foyerDetails.getAdresse());
        foyer.setCapacite(foyerDetails.getCapacite());

        log.info("✏️ Mise à jour du foyer ID {}: {}", id, foyer.getNom());
        return foyerRepository.save(foyer);
    }

    /**
     * Supprimer un foyer
     */
    public void deleteFoyer(Long id) {
        Foyer foyer = foyerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Foyer non trouvé avec l'ID: " + id));

        log.info("🗑️ Suppression du foyer ID {}: {}", id, foyer.getNom());
        foyerRepository.delete(foyer);
    }

    /**
     * Obtenir un foyer par ID
     */
    public Foyer getFoyer(Long id) {
        return foyerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Foyer non trouvé avec l'ID: " + id));
    }

    /**
     * Obtenir tous les foyers
     */
    public List<Foyer> getAllFoyers() {
        return foyerRepository.findAll();
    }

    /**
     * Rechercher des foyers par nom
     */
    public List<Foyer> searchFoyersByName(String nom) {
        return foyerRepository.findByNomContainingIgnoreCase(nom);
    }

    // ============================================
    // CRUD CHAMBRE (ADMIN ONLY)
    // ============================================

    /**
     * Créer une chambre dans un foyer
     */
    public Chambre createChambre(Long foyerId, Chambre chambre) {
        Foyer foyer = getFoyer(foyerId);

        // Vérifier si le numéro existe déjà dans ce foyer
        if (chambreRepository.existsByNumeroAndFoyerId(chambre.getNumero(), foyerId)) {
            throw new RuntimeException("Une chambre avec ce numéro existe déjà dans ce foyer");
        }

        chambre.setFoyer(foyer);
        chambre.setDisponible(true);

        log.info("🛏️ Création d'une chambre {} dans le foyer {}", chambre.getNumero(), foyer.getNom());
        return chambreRepository.save(chambre);
    }

    /**
     * Mettre à jour une chambre
     */
    public Chambre updateChambre(Long id, Chambre chambreDetails) {
        Chambre chambre = chambreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée avec l'ID: " + id));

        chambre.setNumero(chambreDetails.getNumero());
        chambre.setType(chambreDetails.getType());

        log.info("✏️ Mise à jour de la chambre ID {}", id);
        return chambreRepository.save(chambre);
    }

    /**
     * Supprimer une chambre
     */
    public void deleteChambre(Long id) {
        Chambre chambre = chambreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée avec l'ID: " + id));

        if (chambre.isAssigned()) {
            throw new RuntimeException("Impossible de supprimer une chambre assignée. Libérez-la d'abord.");
        }

        log.info("🗑️ Suppression de la chambre ID {}", id);
        chambreRepository.delete(chambre);
    }

    // ============================================
    // AFFECTATION / DÉSAFFECTATION (ADMIN ONLY)
    // ============================================

    /**
     * Assigner une chambre à un utilisateur
     */
    public Chambre assignChambreToUser(Long chambreId, String userId, String userName) {
        Chambre chambre = chambreRepository.findById(chambreId)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée avec l'ID: " + chambreId));

        // Vérifier si la chambre est déjà assignée
        if (chambre.isAssigned()) {
            throw new RuntimeException("Cette chambre est déjà assignée à l'utilisateur: " + chambre.getUserName());
        }

        // Vérifier si l'utilisateur a déjà une chambre
        chambreRepository.findByUserId(userId).ifPresent(existingChambre -> {
            throw new RuntimeException("L'utilisateur " + userName + " a déjà une chambre assignée (N°" + existingChambre.getNumero() + ")");
        });

        chambre.assignToUser(userId, userName);

        log.info("✅ Chambre {} assignée à l'utilisateur {} (ID: {})",
                chambre.getNumero(), userName, userId);

        return chambreRepository.save(chambre);
    }

    /**
     * Libérer une chambre (désaffectation)
     */
    public Chambre unassignChambre(Long chambreId) {
        Chambre chambre = chambreRepository.findById(chambreId)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée avec l'ID: " + chambreId));

        if (!chambre.isAssigned()) {
            throw new RuntimeException("Cette chambre n'est pas assignée");
        }

        String previousUser = chambre.getUserName();
        chambre.unassign();

        log.info("🔓 Chambre {} libérée (précédemment assignée à {})",
                chambre.getNumero(), previousUser);

        return chambreRepository.save(chambre);
    }

    // ============================================
    // CONSULTATION (USER/STUDENT)
    // ============================================

    /**
     * Obtenir la chambre assignée à un utilisateur
     */
    public Chambre getChambreByUserId(String userId) {
        return chambreRepository.findByUserId(userId)
                .orElse(null); // Retourne null si aucune chambre n'est assignée
    }

    /**
     * Obtenir toutes les chambres disponibles
     */
    public List<Chambre> getAvailableChambres() {
        return chambreRepository.findByDisponibleTrue();
    }

    /**
     * Obtenir les chambres disponibles par type
     */
    public List<Chambre> getAvailableChambresByType(ChambreType type) {
        return chambreRepository.findByDisponibleTrueAndType(type);
    }

    /**
     * Obtenir toutes les chambres d'un foyer
     */
    public List<Chambre> getChambresByFoyer(Long foyerId) {
        return chambreRepository.findByFoyerId(foyerId);
    }

    /**
     * Obtenir toutes les chambres
     */
    public List<Chambre> getAllChambres() {
        return chambreRepository.findAll();
    }

    /**
     * Obtenir une chambre par ID
     */
    public Chambre getChambre(Long id) {
        return chambreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée avec l'ID: " + id));
    }

    // ============================================
    // STATISTIQUES (ADMIN)
    // ============================================

    /**
     * Obtenir les statistiques d'un foyer
     */
    public FoyerStats getFoyerStats(Long foyerId) {
        Foyer foyer = getFoyer(foyerId);
        long totalChambres = chambreRepository.findByFoyerId(foyerId).size();
        long availableChambres = chambreRepository.countAvailableChambresByFoyer(foyerId);
        long occupiedChambres = totalChambres - availableChambres;

        return new FoyerStats(
                foyer.getNom(),
                totalChambres,
                availableChambres,
                occupiedChambres,
                foyer.getCapacite()
        );
    }

    /**
     * Classe interne pour les statistiques
     */
    public static class FoyerStats {
        public String nom;
        public long totalChambres;
        public long chambresDisponibles;
        public long chambresOccupees;
        public int capaciteMax;

        public FoyerStats(String nom, long total, long disponibles, long occupees, int capaciteMax) {
            this.nom = nom;
            this.totalChambres = total;
            this.chambresDisponibles = disponibles;
            this.chambresOccupees = occupees;
            this.capaciteMax = capaciteMax;
        }
    }
}
