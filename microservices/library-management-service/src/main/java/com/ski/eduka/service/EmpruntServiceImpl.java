package com.ski.eduka.service;

import com.ski.eduka.client.UserClient;
import com.ski.eduka.dto.userrdto;
import com.ski.eduka.entity.Emprunt;
import com.ski.eduka.entity.Livre;
import com.ski.eduka.enums.Status;
import com.ski.eduka.repository.EmpruntRepository;
import com.ski.eduka.repository.LivreRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpruntServiceImpl implements empruntService {

    private final EmpruntRepository empruntRepository;
    private final LivreRepository livreRepository;
    private final UserClient userClient;
    private final JwtDecoder jwtDecoder;


    @Override
    public Emprunt addEmprunt(Long livreId,  String token) {

        // 1️⃣ Décoder le JWT pour obtenir le userId
        Jwt jwt = jwtDecoder.decode(token.replace("Bearer ", ""));
        String userId = jwt.getClaimAsString("sub");

        // 2️⃣ Récupérer l’utilisateur via Feign si besoin (optionnel)
        userrdto user = userClient.getUserById(userId, token);

        // 3️⃣ Vérifier que le livre existe
        Livre livre = livreRepository.findById(livreId)
                .orElseThrow(() -> new RuntimeException("Livre non trouvé avec id: " + livreId));

        // 4️⃣ Créer l’emprunt
        Emprunt emprunt = new Emprunt();
        emprunt.setLivre(livre);
        emprunt.setEtudiantId(Long.valueOf(user.getId()));
        emprunt.setDateEmprunt(LocalDate.now());
        emprunt.setStatus(Status.EN_ATTENTE);

        // 5️⃣ Sauvegarder
        return empruntRepository.save(emprunt);

    }

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

    @Override
    public void deleteEmprunt(Long empruntId) {
        if (!empruntRepository.existsById(empruntId)) {
            throw new RuntimeException("Emprunt non trouvé avec id: " + empruntId);
        }
        empruntRepository.deleteById(empruntId);

    }

    @Override
    public Emprunt getEmpruntById(Long empruntId) {
        return empruntRepository.findById(empruntId)
                .orElseThrow(() -> new RuntimeException("Emprunt non trouvé avec id: " + empruntId));
    }

    @Override
    public List<Emprunt> getAllEmprunts() {
        return empruntRepository.findAll();
    }

    @Override
    public List<Emprunt> getEmpruntsByUserId(String userId) {
        Long userIdLong;
        try {
            userIdLong = Long.parseLong(userId);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Format d'ID utilisateur invalide : " + userId);
        }
        return empruntRepository.findByEtudiantId(userIdLong);
    }
    }

