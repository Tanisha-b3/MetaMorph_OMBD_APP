import { useState, useEffect } from "react";

export default function MovieExplorer() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;


  const searchMovies = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
  `${API_BASE_URL}/movies/search?title=${encodeURIComponent(query)}`
);
      const data = await res.json();
      const uniqueMovies = [
        ...new Map(data.map(m => [m.imdbID, m])).values()
      ];
      setMovies(uniqueMovies);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const showDetails = async (id) => {
    setSelected(null);
    setDetailsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/movies/${id}`);
      const data = await res.json();
      setSelected(data);
    } catch (err) {
      console.error("Details error:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Auto-search on Enter key
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && query.trim()) {
        searchMovies();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [query]);

  return (
    <div className="movie-explorer">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            🎬
            <h1>Movie Explorer</h1>
          </div>
          <p className="tagline">Discover your next favorite film</p>
        </div>
      </header>

      <main className="main-content">
        {/* Search Section */}
        <section className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search for movies by title..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchMovies()}
              />
              <button 
                className="search-button"
                onClick={searchMovies}
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  "Search"
                )}
              </button>
            </div>
            {query && !loading && (
              <p className="search-hint">
                Press Enter or click Search to find movies
              </p>
            )}
          </div>
        </section>

        {/* Movies Grid */}
        {movies.length > 0 && (
          <section className="movies-section">
            <h2 className="section-title">
              Found {movies.length} movie{movies.length !== 1 ? 's' : ''}
            </h2>
            <div className="movies-grid">
              {movies.map((movie) => (
                <div
                  key={movie.imdbID}
                  className="movie-card"
                  onClick={() => showDetails(movie.imdbID)}
                >
                  <div className="movie-poster">
                    <img
                      src={movie.poster !== "N/A" ? movie.poster : "/no-image.png"}
                      alt={movie.title}
                      onError={(e) => {
                        e.target.src = "/no-image.png";
                      }}
                    />
                    <div className="movie-overlay">
                      <span className="view-details">View Details</span>
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <p className="movie-year">{movie.year}</p>
                    <div className="movie-type">
                      <span className="type-badge">{movie.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && movies.length === 0 && query && (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h3>No movies found</h3>
            <p>Try searching for a different title</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching for movies...</p>
          </div>
        )}
      </main>

      {/* Movie Details Modal */}
      {detailsLoading && (
        <div className="modal-overlay">
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Loading movie details...</p>
          </div>
        </div>
      )}

      {selected && !detailsLoading && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            
            <div className="modal-content">
              <div className="modal-poster">
                <img
                  src={selected.poster !== "N/A" ? selected.poster : "/no-image.png"}
                  alt={selected.title}
                />
              </div>
              
              <div className="modal-details">
                <h2 className="modal-title">
                  {selected.title} <span className="modal-year">({selected.year})</span>
                </h2>
                
                {selected.imdbRating && (
                  <div className="rating">
                    <span className="rating-star">⭐</span>
                    <span className="rating-value">{selected.imdbRating}</span>
                    <span className="rating-source">/10 IMDb</span>
                  </div>
                )}
                
                <div className="details-grid">
                  {selected.director && selected.director !== "N/A" && (
                    <div className="detail-item">
                      <span className="detail-label">Director</span>
                      <span className="detail-value">{selected.director}</span>
                    </div>
                  )}
                  
                  {selected.actors && selected.actors !== "N/A" && (
                    <div className="detail-item">
                      <span className="detail-label">Cast</span>
                      <span className="detail-value">{selected.actors}</span>
                    </div>
                  )}
                  
                  {selected.genre && selected.genre !== "N/A" && (
                    <div className="detail-item">
                      <span className="detail-label">Genre</span>
                      <span className="detail-value">{selected.genre}</span>
                    </div>
                  )}
                  
                  {selected.runtime && selected.runtime !== "N/A" && (
                    <div className="detail-item">
                      <span className="detail-label">Runtime</span>
                      <span className="detail-value">{selected.runtime}</span>
                    </div>
                  )}
                </div>
                
                {selected.plot && selected.plot !== "N/A" && (
                  <div className="plot-section">
                    <h3 className="plot-title">Plot</h3>
                    <p className="plot-text">{selected.plot}</p>
                  </div>
                )}
                
                {selected.imdbID && (
                  <a
                    href={`https://www.imdb.com/title/${selected.imdbID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="imdb-link"
                  >
                    View on IMDb ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )

    }
      
    </div>
  );
}