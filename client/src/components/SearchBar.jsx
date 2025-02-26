/* eslint-disable react/prop-types */
import { useState } from 'react';
import '../styles/SearchBar.scss';

const SearchBar = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/search/photos?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch results`);
      }
      
      const data = await response.json();
      if (data.success) {
        setLoading(false);
        onSearchResults(data.data); // Pass the results
      } else {
        setError('No results found.');
        onSearchResults([]); // Clear results
      }
    } catch (err) {
      console.error(err);
      setError('Search failed. Please try again.');
      setLoading(false);
      onSearchResults([]); // Clear results
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for photos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p className="search-error">{error}</p>}
    </div>
  );
};

export default SearchBar;
