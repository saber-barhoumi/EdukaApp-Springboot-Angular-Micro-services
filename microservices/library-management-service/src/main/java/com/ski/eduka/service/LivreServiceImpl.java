package com.ski.eduka.service;

import com.ski.eduka.dto.LivreDto;
import com.ski.eduka.entity.Livre;
import com.ski.eduka.repository.LivreRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class LivreServiceImpl implements LivreService{
    @Autowired
    private final LivreRepository livreRepository;

    @Override
    public Livre addlivre(LivreDto livreDto) {
        Livre livre=new Livre();
        livre.setCategorie(livreDto.getCategorie());
        livre.setDiponible(livreDto.getDiponible());
        livre.setTitre(livreDto.getTitre());

        return livreRepository.save(livre);
    }

    @Override
    public List<Livre> getall() {
        List<Livre> livres=livreRepository.findAll();
        return livres;
    }

    @Override
    public Livre getbyid(Long livreid) {
        Livre livre=livreRepository.findById(livreid).orElse(null);
        return livre;
    }

    @Override
    public void deletebyid(Long livreid) {
        livreRepository.deleteById(livreid);
    }

    @Override
    public Livre updatelivre(LivreDto livreDto) {
        Livre livre=livreRepository.findById(livreDto.getLivreid()).orElse(null);
        livre.setTitre(livreDto.getTitre());
        livre.setCategorie(livreDto.getCategorie());
        livre.setDiponible(livreDto.getDiponible());

        return livreRepository.save(livre);
    }



}
