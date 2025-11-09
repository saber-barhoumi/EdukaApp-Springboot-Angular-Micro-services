package com.ski.eduka.service;


import com.ski.eduka.Client.UserClient;
import com.ski.eduka.dto.UserDto;
import com.ski.eduka.entity.Chambre;
import com.ski.eduka.repository.ChambreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChambreService {

    private final ChambreRepository chambreRepository;
    private final UserClient userClient;

    public Chambre affecterChambre(Long chambreId, String userId) {
        // Vérifier que la chambre existe
        Chambre chambre = chambreRepository.findById(chambreId)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée avec id: " + chambreId));

        // Vérifier que l'utilisateur existe via Feign
        UserDto user = userClient.getUserById(userId);
        if (user == null) {
            throw new RuntimeException("Utilisateur non trouvé avec id: " + userId);
        }

        // Affecter la chambre
        chambre.setUserId(String.valueOf(user.getId())); // On convertit en String si nécessaire
        chambre.setDisponible(false);

        return chambreRepository.save(chambre);
    }




}
