package com.ski.eduka.service;

import com.ski.eduka.entity.Emprunt;
import com.ski.eduka.entity.Livre;
import com.ski.eduka.enums.Status;
import com.ski.eduka.repository.EmpruntRepository;
import com.ski.eduka.repository.LivreRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmpruntServiceImpl implements empruntService {

    private final EmpruntRepository empruntRepository;
    private final LivreRepository livreRepository;

    /**
     * 🔐 Récupère l'ID utilisateur connecté depuis le token Keycloak
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            // Selon ton Realm Keycloak : souvent "sub" ou "user_id"
            String userId = jwt.getClaimAsString("sub");
            try {
                return Long.parseLong(userId);
            } catch (NumberFormatException e) {
                throw new RuntimeException("Le claim 'sub' du token n'est pas un ID numérique : " + userId);
            }
        }

        throw new RuntimeException("Utilisateur non authentifié");
    }

    /**
     * 📘 Créer un nouvel emprunt pour un livre donné
     */
    @Override
    public Emprunt addEmprunt(Long livreId) {
        Livre livre = livreRepository.findById(livreId)
                .orElseThrow(() -> new RuntimeException("Livre non trouvé avec id: " + livreId));

        Emprunt emprunt = new Emprunt();
        emprunt.setLivre(livre);
        emprunt.setEtudiantId(getCurrentUserId());
        emprunt.setDateEmprunt(LocalDate.now());
        emprunt.setStatus(Status.EN_ATTENTE);

        return empruntRepository.save(emprunt);
    }

    /**
     * ✏️ Mettre à jour un emprunt (ex : retour du livre)
     */
    @Override
    public Emprunt updateEmprunt(Long empruntId, Emprunt empruntDetails) {
        Emprunt existing = empruntRepository.findById(empruntId)
                .orElseThrow(() -> new RuntimeException("Emprunt non trouvé avec id: " + empruntId));

        if (empruntDetails.getDateRetouRéele() != null) {
            existing.setDateRetouRéele(empruntDetails.getDateRetouRéele());
        }

        if (empruntDetails.getStatus() != null) {
            existing.setStatus(empruntDetails.getStatus());
        }

        return empruntRepository.save(existing);
    }

    /**
     * ❌ Supprimer un emprunt
     */
    @Override
    public void deleteEmprunt(Long empruntId) {
        if (!empruntRepository.existsById(empruntId)) {
            throw new RuntimeException("Emprunt non trouvé avec id: " + empruntId);
        }
        empruntRepository.deleteById(empruntId);
    }

    /**
     * 🔍 Obtenir un emprunt par son ID
     */
    @Override
    public Emprunt getEmpruntById(Long empruntId) {
        return empruntRepository.findById(empruntId)
                .orElseThrow(() -> new RuntimeException("Emprunt non trouvé avec id: " + empruntId));
    }

    /**
     * 📚 Récupérer tous les emprunts
     */
    @Override
    public List<Emprunt> getAllEmprunts() {
        return empruntRepository.findAll();
    }

    /**
     * 👤 Récupérer les emprunts de l'utilisateur connecté
     */
    @Override
    public List<Emprunt> getEmpruntsByCurrentUser() {
        Long currentUserId = getCurrentUserId();
        return empruntRepository.findByEtudiantId(currentUserId);
    }
}
