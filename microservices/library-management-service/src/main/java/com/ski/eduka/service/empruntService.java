package com.ski.eduka.service;

import com.ski.eduka.entity.Emprunt;
import java.util.List;

public interface empruntService {

    // Ajouter un emprunt
    Emprunt addEmprunt(Long livreId);

    // Mettre à jour un emprunt (ex: date de retour ou status)
    Emprunt updateEmprunt(Long empruntId, Emprunt empruntDetails);

    // Supprimer un emprunt
    void deleteEmprunt(Long empruntId);

    // Récupérer un emprunt par ID
    Emprunt getEmpruntById(Long empruntId);

    // Récupérer tous les emprunts
    List<Emprunt> getAllEmprunts();

    // Récupérer les emprunts de l'utilisateur connecté
    List<Emprunt> getEmpruntsByCurrentUser();
}
