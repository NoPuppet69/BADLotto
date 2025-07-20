import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Lock, Check } from 'lucide-react';
import PurchaseModal from './PurchaseModal';
import { useAppContext } from '@/contexts/AppContext';

interface GridTicket {
  id: number;
  owner?: string;
  price: number;
}

interface TicketGridProps {
  tickets: GridTicket[];
  userAddress?: string;
  isConnected: boolean;
}

const TicketGrid: React.FC<TicketGridProps> = ({
  tickets,
  userAddress,
  isConnected
}) => {
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const { purchaseTickets } = useAppContext();

  const handleTicketClick = (ticketId: number) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket?.owner && isConnected) {
      setSelectedTickets(prev => 
        prev.includes(ticketId) 
          ? prev.filter(id => id !== ticketId)
          : [...prev, ticketId]
      );
    }
  };

  const handlePurchaseConfirm = async (ticketIds: number[]) => {
    await purchaseTickets(ticketIds);
    setSelectedTickets([]);
    setPurchaseModalOpen(false);
  };

  const getTicketStyle = (ticket: GridTicket) => {
    if (ticket.owner === userAddress) {
      return 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white border-2 border-cyan-300 shadow-lg neon-glow';
    }
    if (ticket.owner) {
      return 'bg-gradient-to-br from-gray-700 to-gray-900 text-gray-400 border border-gray-600';
    }
    if (selectedTickets.includes(ticket.id)) {
      return 'bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-2 border-yellow-400 shadow-lg neon-glow';
    }
    return 'bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white border-2 border-indigo-400 hover:border-cyan-400 shadow-md hover:shadow-xl hover:neon-glow transform hover:scale-105 transition-all duration-300';
  };

  return (
    <>
      <div className="grid-container rounded-lg p-4 mb-6">
        <div className="grid grid-cols-10 gap-1 max-w-4xl mx-auto">
          {tickets.map((ticket) => (
            <Button
              key={ticket.id}
              onClick={() => handleTicketClick(ticket.id)}
              disabled={!!ticket.owner || !isConnected}
              className={`h-10 w-full p-0 text-xs font-bold relative rounded ${getTicketStyle(ticket)}`}
            >
              {ticket.owner === userAddress && (
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-cyan-300 animate-pulse" />
              )}
              {selectedTickets.includes(ticket.id) && !ticket.owner && (
                <Check className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse" />
              )}
              {!ticket.owner && !isConnected && (
                <Lock className="h-3 w-3 opacity-50" />
              )}
              <span className="futuristic-text">{ticket.id}</span>
            </Button>
          ))}
        </div>
        
        {selectedTickets.length > 0 && (
          <div className="text-center mt-4">
            <Button
              onClick={() => setPurchaseModalOpen(true)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg neon-glow transform hover:scale-105 transition-all duration-300 futuristic-text"
            >
              PURCHASE {selectedTickets.length} TICKET{selectedTickets.length > 1 ? 'S' : ''}
            </Button>
          </div>
        )}
      </div>

      <PurchaseModal
        isOpen={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        selectedTickets={selectedTickets}
        ticketPrice={0.001}
        onConfirm={handlePurchaseConfirm}
      />
    </>
  );
};

export default TicketGrid;