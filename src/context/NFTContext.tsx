import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the NFT interface
export interface NFT {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  creator: string;
  createdAt: number;
  status: string;
  isVerified: boolean;
}

interface NFTContextType {
  nfts: NFT[];
  addNFT: (nft: Omit<NFT, 'id' | 'createdAt' | 'status'>) => void;
  getUserNFTs: (email: string) => NFT[];
}

const NFTContext = createContext<NFTContextType | undefined>(undefined);

export const useNFTs = () => {
  const context = useContext(NFTContext);
  if (!context) {
    throw new Error('useNFTs must be used within an NFTProvider');
  }
  return context;
};

interface NFTProviderProps {
  children: ReactNode;
}

export const NFTProvider: React.FC<NFTProviderProps> = ({ children }) => {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  
  // Load NFTs from localStorage on initial load
  useEffect(() => {
    const storedNFTs = localStorage.getItem('nfts');
    if (storedNFTs) {
      setNFTs(JSON.parse(storedNFTs));
    }
  }, []);
  
  // Save NFTs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nfts', JSON.stringify(nfts));
  }, [nfts]);
  
  // Add a new NFT to the collection
  const addNFT = (nftData: Omit<NFT, 'id' | 'createdAt' | 'status'>) => {
    const newNFT: NFT = {
      ...nftData,
      id: `nft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      status: 'New',
    };
    
    setNFTs(prev => [newNFT, ...prev]);
  };
  
  // Get all NFTs created by a specific user
  const getUserNFTs = (email: string) => {
    return nfts.filter(nft => nft.creator === email);
  };
  
  const value = {
    nfts,
    addNFT,
    getUserNFTs
  };
  
  return (
    <NFTContext.Provider value={value}>
      {children}
    </NFTContext.Provider>
  );
};

export default NFTContext; 