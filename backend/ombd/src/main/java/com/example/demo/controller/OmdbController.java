package com.example.demo.controller;

import com.example.demo.dto.MovieDetailDTO;
import com.example.demo.dto.MovieSummaryDTO;
import com.example.demo.service.OmdbService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin
public class OmdbController {

    private final OmdbService service;

    public OmdbController(OmdbService service) {
        this.service = service;
    }

    @GetMapping("/search")
    public List<MovieSummaryDTO> search(@RequestParam String title) {
        return service.searchMovies(title);
    }

    @GetMapping("/{imdbId}")
    public MovieDetailDTO details(@PathVariable String imdbId) {
        return service.getMovieDetails(imdbId);
    }
}
