import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface GridTicket {
  id: number;
  owner?: string;
  price: number;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  isConnected: boolean;
  userAddress?: string;
  tickets: GridTicket[];
  connectWallet: (address: string) => void;
  purchaseTicket: (ticketId: number, paymentMethod: string) => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  isConnected: false,
  tickets: [],
  connectWallet: () => {},
  purchaseTicket: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>();
  const [tickets, setTickets] = useState<GridTicket[]>([]);

  // Initialize tickets with $BAD pricing
  useEffect(() => {
    const initialTickets = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      price: 100000000 // 100M $BAD tokens
    }));
    setTickets(initialTickets);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const connectWallet = (address: string) => {
    setIsConnected(true);
    setUserAddress(address);
    toast({
      title: "Wallet Connected!",
      description: "You can now purchase lottery tickets with $BAD tokens.",
    });
  };

  const purchaseTicket = (ticketId: number, paymentMethod: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, owner: userAddress } : ticket
    ));
    toast({
      title: "Ticket Purchased!",
      description: `Successfully purchased ticket #${ticketId} with 100M $BAD tokens`,
    });
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        isConnected,
        userAddress,
        tickets,
        connectWallet,
        purchaseTicket,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};