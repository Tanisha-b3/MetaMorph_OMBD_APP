# 🎬 OMDB Movie Explorer – Backend

This is the backend service for the OMDB Movie Explorer application.
It is built using Spring Boot and acts as a middleware REST API between the frontend and the public OMDB API, providing simplified endpoints, caching, and secure API key handling.

## 🚀 Features

- RESTful APIs built with Spring Boot

- Fetches movie data from OMDB API

- In-memory caching using Spring Cache + Caffeine

- Cache expiry and maximum size configured

- Secure handling of OMDB API key using environment variables

- Clean DTO-based responses (no raw OMDB payloads)

- Runs locally

## 🛠 Tech Stack

- Java 17

- Spring Boot 3.x

- Spring Web

- Spring Cache

- Caffeine Cache

- RestTemplate

- Maven

## 📁 Project Structure
```bash
src/main/java/com/example/demo
├── config
│   └── AppConfig.java          # RestTemplate configuration
├── controller
│   └── OmdbController.java     # REST endpoints
├── dto
│   ├── MovieSummaryDTO.java    # Search response DTO
│   └── MovieDetailDTO.java     # Movie detail DTO
├── service
│   └── OmdbService.java        # OMDB integration + caching
└── OmdbExplorerApplication.java
```

## 🔑 OMDB API Key Setup (IMPORTANT)

This project does not hardcode the OMDB API key.

### 1️⃣ Get an API key

Register at:
```bash
👉 https://www.omdbapi.com/apikey.aspx
```

2️⃣ Set Environment Variable
Windows (PowerShell)
```bash
setx OMDB_API_KEY "your_api_key_here"
```
macOS / Linux
```bash
export OMDB_API_KEY=your_api_key_here
```

### ⚠️ Restart your IDE / terminal after setting the variable.

- ⚙️ Configuration
- application.properties
- server.port=8080
```bash
omdb.api.url=https://www.omdbapi.com/
omdb.api.key=${OMDB_API_KEY}

spring.cache.type=caffeine
spring.cache.cache-names=movies,movieDetails
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=10m
```

▶️ Running the Backend Locally
1️⃣ Build the project
```bash
mvn clean install
```
2️⃣ Run the application

```bash
mvn spring-boot:run
```

The server will start on:

```bash
http://localhost:8080

```

## 📌 API Endpoints
 🔍 Search Movies
```bash
GET /api/movies/search?title={movieTitle}
```

### Example

- http://localhost:8080/api/movies/search?title=batman


### Response
```bash
[
  {
    "imdbID": "tt0372784",
    "title": "Batman Begins",
    "year": "2005",
    "poster": "https://..."
  }
]
```

### 🎥 Movie Details
```bash
GET /api/movies/{imdbId}
```

### Example

- http://localhost:8080/api/movies/tt0372784

```bash
Response

{
  "title": "Batman Begins",
  "year": "2005",
  "plot": "After training with his mentor...",
  "director": "Christopher Nolan",
  "actors": "Christian Bale, Michael Caine",
  "imdbRating": "8.2",
  "poster": "https://..."
}
```

## ⚡ Caching Strategy

- Search results cached by movie title

- Movie details cached by IMDb ID

- Cache provider: Caffeine

- Expiry: 10 minutes

- Max size: 500 entries

- This improves performance and reduces calls to OMDB API.

## ✅ Best Practices Followed

- RESTful API design

- Secure API key handling

- Clean and extensible architecture

## 📦 Future Enhancements

- Redis-based distributed caching

- Global exception handling

- Rate limiting

- Pagination support

- API documentation (Swagger/OpenAPI)

## 👤 Author

- OMDB Movie Explorer – Backend
- Developed as part of a technical assignment.