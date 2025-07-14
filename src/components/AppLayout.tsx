import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Sparkles, Wallet, Check, Zap, Settings, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminPanel from './AdminPanel';
import TicketGrid from './TicketGrid';
import PurchaseDialog from './PurchaseDialog';
import StatsCards from './StatsCards';

interface GridTicket {
  id: number;
  owner?: string;
  price: number;
}

const ADMIN_WALLET = '0xa4e81327dd0Bc39f73787a127f069e7d854aA63E';
const SITE_WALLET = '0xa4e81327dd0Bc39f73787a127f069e7d854aA63E';

const AppLayout: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>();
  const [tickets, setTickets] = useState<GridTicket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [lotteryStats, setLotteryStats] = useState({
    totalPrizesWon: 0,
    totalTokensBurnt: 0,
    drawDate: '',
    drawTime: ''
  });

  const isAdmin = userAddress?.toLowerCase() === ADMIN_WALLET.toLowerCase();

  useEffect(() => {
    const initialTickets = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      price: 100000000
    }));
    setTickets(initialTickets);
    loadLotteryStats();
    loadTicketOwners();
  }, []);

  const loadLotteryStats = async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_stats')
        .select('total_prizes_won, total_tokens_burnt, draw_date, draw_time')
        .single();
      
      if (error) throw error;
      
      if (data) {
        setLotteryStats({
          totalPrizesWon: data.total_prizes_won || 0,
          totalTokensBurnt: data.total_tokens_burnt || 0,
          drawDate: data.draw_date || '',
          drawTime: data.draw_time || ''
        });
      }
    } catch (error) {
      console.error('Error loading lottery stats:', error);
    }
  };

  const loadTicketOwners = async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_tickets')
        .select('ticket_number, wallet_address')
        .eq('lottery_round', 1);
      
      if (error) throw error;
      
      if (data) {
        setTickets(prev => prev.map(ticket => {
          const owner = data.find(d => d.ticket_number === ticket.id);
          return owner ? { ...ticket, owner: owner.wallet_address } : ticket;
        }));
      }
    } catch (error) {
      console.error('Error loading ticket owners:', error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setTimeout(() => {
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setIsConnected(true);
      setUserAddress(mockAddress);
      setIsConnecting(false);
      toast({ title: "Wallet Connected!", description: "You can now purchase lottery tickets." });
    }, 1500);
  };

  const handleTicketSelect = (ticketId: number) => {
    setSelectedTickets(prev => {
      if (prev.includes(ticketId)) {
        return prev.filter(id => id !== ticketId);
      } else {
        return [...prev, ticketId];
      }
    });
  };

  const handlePurchaseComplete = (ticketIds: number[]) => {
    setTickets(prev => prev.map(ticket => 
      ticketIds.includes(ticket.id) ? { ...ticket, owner: userAddress } : ticket
    ));
    setSelectedTickets([]);
    loadLotteryStats();
  };

  const soldTickets = tickets.filter(t => t.owner).length;
  const userTickets = tickets.filter(t => t.owner === userAddress).length;
  const prizePool = soldTickets * 100000000 * 0.5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)]" />
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/6874e8cbb0c0b424c5f5463c_1752498642783_d79596bf.jpg" 
                alt="Logo" 
                className="w-20 h-20 rounded-full border-4 border-cyan-400 shadow-2xl neon-glow"
                style={{ 
                  animation: 'spin-vertical 3s linear infinite',
                  transformStyle: 'preserve-3d'
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold futuristic-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
            <Zap className="h-8 w-8 md:h-12 md:w-12 text-cyan-400" />
            $BAD GRID
            <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-purple-500" />
          </h1>
          <p className="text-lg text-gray-300 mb-3">5x20 Mobile Lottery Grid</p>
          <p className="text-xs text-cyan-400 mb-4 font-mono">0x32b86b99441480a7e5bd3a26c124ec2373e3f015</p>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            {isConnected ? (
              <div className="inline-block p-3 cyber-border rounded-lg">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Check className="h-4 w-4" />
                  <span className="font-medium futuristic-text">CONNECTED</span>
                  <span className="text-sm opacity-90 font-mono">
                    {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                  </span>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg neon-glow transform hover:scale-105 transition-all duration-300 futuristic-text"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
              </Button>
            )}
            
            {isAdmin && (
              <Button
                onClick={() => setShowAdminPanel(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-lg neon-glow transform hover:scale-105 transition-all duration-300 futuristic-text"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {selectedTickets.length > 0 && (
            <Button
              onClick={() => setShowPurchaseDialog(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-lg neon-glow transform hover:scale-105 transition-all duration-300 futuristic-text"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              PURCHASE {selectedTickets.length} TICKETS
            </Button>
          )}
        </div>

        <StatsCards
          prizePool={prizePool}
          soldTickets={soldTickets}
          userTickets={userTickets}
          totalPrizesWon={lotteryStats.totalPrizesWon}
          totalTokensBurnt={lotteryStats.totalTokensBurnt}
          drawDate={lotteryStats.drawDate}
          drawTime={lotteryStats.drawTime}
        />

        <TicketGrid
          tickets={tickets}
          selectedTickets={selectedTickets}
          userAddress={userAddress}
          isConnected={isConnected}
          onTicketSelect={handleTicketSelect}
        />

        <AdminPanel
          isAdmin={isAdmin}
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
        />

        <PurchaseDialog
          isOpen={showPurchaseDialog}
          onClose={() => setShowPurchaseDialog(false)}
          selectedTickets={selectedTickets}
          userAddress={userAddress}
          onPurchaseComplete={handlePurchaseComplete}
        />
      </div>
    </div>
  );
};

export default AppLayout;