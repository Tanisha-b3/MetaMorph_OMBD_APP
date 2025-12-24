package com.example.demo.service;

import com.example.demo.dto.MovieDetailDTO;
import com.example.demo.dto.MovieSummaryDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class OmdbService {

    @Value("${omdb.api.url}")
    private String apiUrl;

    @Value("${omdb.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper mapper = new ObjectMapper();

    public OmdbService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Cacheable(value = "movies", key = "#title")
    public List<MovieSummaryDTO> searchMovies(String title) {

        String url = apiUrl + "?apikey=" + apiKey + "&s=" + title;

        Map<String, Object> response = fetchAsMap(url);
        if (response == null || !"True".equals(response.get("Response"))) {
            return List.of();
        }

        List<Map<String, String>> list =
                (List<Map<String, String>>) response.get("Search");

        return list.stream()
                .map(m -> new MovieSummaryDTO(
                        m.get("imdbID"),
                        m.get("Title"),
                        m.get("Year"),
                        m.get("Poster")
                ))
                .toList();
    }

    @Cacheable(value = "movieDetails", key = "#imdbId")
    public MovieDetailDTO getMovieDetails(String imdbId) {

        String url = apiUrl + "?apikey=" + apiKey + "&i=" + imdbId + "&plot=full";

        Map<String, Object> r = fetchAsMap(url);
        if (r == null || !"True".equals(r.get("Response"))) {
            return null;
        }

        MovieDetailDTO dto = new MovieDetailDTO();
        dto.setTitle((String) r.get("Title"));
        dto.setYear((String) r.get("Year"));
        dto.setPlot((String) r.get("Plot"));
        dto.setDirector((String) r.get("Director"));
        dto.setActors((String) r.get("Actors"));
        dto.setImdbRating((String) r.get("imdbRating"));
        dto.setPoster((String) r.get("Poster"));

        return dto;
    }

    /**
     * SAFE OMDB FETCH
     */
    private Map<String, Object> fetchAsMap(String url) {
        try {
            ResponseEntity<String> response =
                    restTemplate.getForEntity(url, String.class);

            String body = response.getBody();

            // Not JSON → API key / OMDB error
            if (body == null || !body.trim().startsWith("{")) {
                System.err.println("OMDB invalid response: " + body);
                return null;
            }

            return mapper.readValue(body, Map.class);

        } catch (Exception e) {
            System.err.println("OMDB fetch failed: " + e.getMessage());
            return null;
        }
    }
}
