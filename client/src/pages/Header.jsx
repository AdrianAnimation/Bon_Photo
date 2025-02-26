import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import '../styles/LanguageSwitcher.scss';

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const context = useOutletContext();
  const onResetSearch = context?.onResetSearch;
  const { t } = useTranslation();

  const handleHomeClick = () => {
    setIsNavOpen(false);
    if (onResetSearch) {
      onResetSearch();
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/" onClick={handleHomeClick}>
            <img src="/logo.png" alt="Photo Showcase Logo" />
          </Link>
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Mobile menu button */}
        <button 
          className="nav-toggle" 
          onClick={toggleNav}
          aria-label="Toggle navigation menu"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {isNavOpen ? (
              // X icon when menu is open
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              // Hamburger icon when menu is closed
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        {/* Navigation */}
        <nav className={isNavOpen ? 'nav-open' : 'nav-closed'}>
          <ul>
            <li><Link to="/" onClick={handleHomeClick}>{t('nav.home')}</Link></li>
            <li><Link to="/login" onClick={() => setIsNavOpen(false)}>{t('nav.login')}</Link></li>
            <li><Link to="/register" onClick={() => setIsNavOpen(false)}>{t('nav.register')}</Link></li>
            <li><Link to="/dashboard" onClick={() => setIsNavOpen(false)}>{t('nav.dashboard')}</Link></li>
            <li><Link to="/about" onClick={() => setIsNavOpen(false)}>{t('nav.about')}</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
