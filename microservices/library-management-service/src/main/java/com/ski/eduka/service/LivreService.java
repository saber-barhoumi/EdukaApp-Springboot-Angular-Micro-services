package com.ski.eduka.service;

import com.ski.eduka.dto.LivreDto;
import com.ski.eduka.entity.Livre;

import java.util.List;

public interface LivreService {
 Livre addlivre(LivreDto livreDto);
 List<Livre>getall();
 Livre getbyid(Long livreid);

 void deletebyid(Long livreid);

 Livre updatelivre(LivreDto livreDto);
}
