import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type SearchContextType = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (term: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    // Only update URL if we're on the marketplace page
    if (location.pathname === '/marketplace') {
      // Update URL without navigating if we're already on marketplace
      const newUrl = term 
        ? `/marketplace?search=${encodeURIComponent(term)}`
        : '/marketplace';
      window.history.replaceState(null, '', newUrl);
    } else {
      // Navigate to marketplace with search term if we're on a different page
      navigate(`/marketplace?search=${encodeURIComponent(term)}`);
    }
  };

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, handleSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}; 