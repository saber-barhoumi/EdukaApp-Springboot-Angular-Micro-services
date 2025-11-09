package com.ski.eduka.controller;

import com.ski.eduka.entity.Foyer;
import com.ski.eduka.repository.FoyerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/foyers")
@RequiredArgsConstructor
public class FoyerController {

    private final FoyerRepository foyerRepository;

    @GetMapping
    public List<Foyer> getAll() {
        return foyerRepository.findAll();
    }

    @PostMapping
    public Foyer add(@RequestBody Foyer foyer) {
        return foyerRepository.save(foyer);
    }

    @PutMapping("/{id}")
    public Foyer update(@PathVariable Long id, @RequestBody Foyer foyer) {
        foyer.setId(id);
        return foyerRepository.save(foyer);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        foyerRepository.deleteById(id);
    }
}
