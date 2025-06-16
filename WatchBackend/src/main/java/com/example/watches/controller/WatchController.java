package com.example.watches.controller;

import com.example.watches.model.Watch;
import com.example.watches.repository.WatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watches")
@CrossOrigin(origins = "http://localhost:3000")
public class WatchController {

    @Autowired
    private WatchRepository watchRepository;

    @GetMapping
    public List<Watch> getAllWatches() {
        return watchRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Watch> getWatchById(@PathVariable Long id) {
        return watchRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Watch createWatch(@RequestBody Watch watch) {
        return watchRepository.save(watch);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Watch> updateWatch(@PathVariable Long id, @RequestBody Watch watchDetails) {
        return watchRepository.findById(id)
                .map(watch -> {
                    watch.setBrand(watchDetails.getBrand());
                    watch.setModel(watchDetails.getModel());
                    watch.setYear(watchDetails.getYear());
                    watch.setPrice(watchDetails.getPrice());
                    watch.setStock(watchDetails.getStock());
                    return ResponseEntity.ok(watchRepository.save(watch));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWatch(@PathVariable Long id) {
        return watchRepository.findById(id)
                .map(watch -> {
                    watchRepository.delete(watch);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
