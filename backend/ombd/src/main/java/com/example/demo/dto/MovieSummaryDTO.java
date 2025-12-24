package com.example.demo.dto;

public class MovieSummaryDTO {

    private String imdbID;
    private String title;
    private String year;
    private String poster;

    public MovieSummaryDTO() {
    }

    public MovieSummaryDTO(String imdbID, String title, String year, String poster) {
        this.imdbID = imdbID;
        this.title = title;
        this.year = year;
        this.poster = poster;
    }

    public String getImdbID() {
        return imdbID;
    }

    public void setImdbID(String imdbID) {
        this.imdbID = imdbID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }
}
