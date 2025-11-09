package com.ski.eduka.service;

import com.ski.eduka.entity.Emprunt;
import java.util.List;

public interface empruntService {



    Emprunt addEmprunt(Long livreId,  String token);


    Emprunt updateEmprunt(Long empruntId, Emprunt empruntDetails);


    void deleteEmprunt(Long empruntId);

    Emprunt getEmpruntById(Long empruntId);


    List<Emprunt> getAllEmprunts();


    List<Emprunt> getEmpruntsByUserId(String userId);
}
