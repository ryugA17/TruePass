import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PaymentService } from '../services/PaymentService';

// Define the NFT interface
export interface NFT {
  id: string;
  title: string;
  description: string;
  price: string; // Price in INR format (e.g., "₹1,000.00")
  image: string;
  creator: string;
  createdAt: number;
  status: string;
  isVerified: boolean;
  paymentId?: string; // Payment ID for INR transaction
  transferable: boolean; // Whether the NFT can be transferred (always false for tickets)
}

interface NFTContextType {
  nfts: NFT[];
  addNFT: (nft: Omit<NFT, 'id' | 'createdAt' | 'status'>) => void;
  getUserNFTs: (email: string) => NFT[];
  formatNFTPrice: (price: number) => string;
  parseNFTPrice: (priceString: string) => number;
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
    // Ensure price is in INR format
    let price = nftData.price;
    if (!price.includes('₹')) {
      // Convert to INR format if not already
      price = PaymentService.formatPrice(parseFloat(price));
    }

    const newNFT: NFT = {
      ...nftData,
      price,
      id: `nft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      status: 'New',
      transferable: false, // Tickets are not transferable
    };

    setNFTs(prev => [newNFT, ...prev]);
  };

  // Format price to INR
  const formatNFTPrice = (price: number): string => {
    return PaymentService.formatPrice(price);
  };

  // Parse INR price string to number
  const parseNFTPrice = (priceString: string): number => {
    return PaymentService.parsePrice(priceString);
  };

  // Get all NFTs created by a specific user
  const getUserNFTs = (email: string) => {
    return nfts.filter(nft => nft.creator === email);
  };

  const value = {
    nfts,
    addNFT,
    getUserNFTs,
    formatNFTPrice,
    parseNFTPrice
  };

  return (
    <NFTContext.Provider value={value}>
      {children}
    </NFTContext.Provider>
  );
};

export default NFTContext;