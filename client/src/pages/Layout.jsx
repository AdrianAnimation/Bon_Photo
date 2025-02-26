import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import SearchBar from '../components/SearchBar';
import '../styles/Layout.scss';

function Layout() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const isHomePage = location.pathname === '/';

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setIsSearchActive(true);
  };

  const handleResetSearch = () => {
    setSearchResults(null);
    setIsSearchActive(false);
  };

  return (
    <div className="layout">
      <Header />
      {isHomePage && <SearchBar onSearchResults={handleSearchResults} />}
      <main className="main-content">
        <Outlet context={{ 
          searchResults, 
          isSearchActive,
          onResetSearch: handleResetSearch 
        }} />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
