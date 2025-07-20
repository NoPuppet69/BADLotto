import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

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
  purchaseTickets: (ticketIds: number[]) => Promise<void>;
  isAdmin: boolean;
  resetGrid: () => void;
  stats: {
    prizePool: number;
    soldTickets: number;
    userTickets: number;
    totalPrizesWon: number;
    totalTokensBurnt: number;
    drawDate: string;
    drawTime: string;
  };
  loadStats: () => Promise<void>;
}

const ADMIN_WALLET = '0xa4e81327dd0Bc39f73787a127f069e7d854aA63E';

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  isConnected: false,
  tickets: [],
  connectWallet: () => {},
  purchaseTickets: async () => {},
  isAdmin: false,
  resetGrid: () => {},
  stats: {
    prizePool: 0,
    soldTickets: 0,
    userTickets: 0,
    totalPrizesWon: 0,
    totalTokensBurnt: 0,
    drawDate: '',
    drawTime: ''
  },
  loadStats: async () => {}
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>();
  const [tickets, setTickets] = useState<GridTicket[]>([]);
  const [stats, setStats] = useState({
    prizePool: 0,
    soldTickets: 0,
    userTickets: 0,
    totalPrizesWon: 0,
    totalTokensBurnt: 0,
    drawDate: '',
    drawTime: ''
  });

  const isAdmin = userAddress?.toLowerCase() === ADMIN_WALLET.toLowerCase();

  useEffect(() => {
    loadTickets();
    loadStats();
  }, []);

  useEffect(() => {
    if (userAddress) {
      loadStats();
    }
  }, [userAddress, tickets]);

  const loadTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_tickets')
        .select('*');
      
      if (error) throw error;
      
      const initialTickets = Array.from({ length: 100 }, (_, i) => {
        const purchased = data?.find(t => t.ticket_number === i + 1);
        return {
          id: i + 1,
          price: 100000000,
          owner: purchased?.wallet_address
        };
      });
      
      setTickets(initialTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      const initialTickets = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        price: 100000000
      }));
      setTickets(initialTickets);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_stats')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading lottery stats:', error);
        return;
      }
      
      setStats({
        prizePool: data?.current_prize || 0,
        soldTickets: tickets.filter(t => t.owner).length,
        userTickets: tickets.filter(t => t.owner === userAddress).length,
        totalPrizesWon: data?.total_won || 0,
        totalTokensBurnt: data?.total_burnt || 0,
        drawDate: data?.draw_date || '',
        drawTime: data?.draw_time || ''
      });
    } catch (error) {
      console.error('Error loading lottery stats:', error);
    }
  };

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

  const purchaseTickets = async (ticketIds: number[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('gasless-purchase', {
        body: {
          ticketIds,
          userAddress,
          totalAmount: ticketIds.length * 100000000
        }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      
      await loadTickets();
      await loadStats();
      
      toast({
        title: "Purchase Complete!",
        description: `Successfully purchased ${ticketIds.length} ticket${ticketIds.length > 1 ? 's' : ''} (gas fees paid by site)`,
      });
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase tickets. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const resetGrid = () => {
    loadTickets();
    loadStats();
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
        purchaseTickets,
        isAdmin,
        resetGrid,
        stats,
        loadStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};