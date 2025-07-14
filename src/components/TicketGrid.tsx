import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Lock, Check } from 'lucide-react';

interface GridTicket {
  id: number;
  owner?: string;
  price: number;
}

interface TicketGridProps {
  tickets: GridTicket[];
  selectedTickets: number[];
  userAddress?: string;
  isConnected: boolean;
  onTicketSelect: (ticketId: number) => void;
}

const TicketGrid: React.FC<TicketGridProps> = ({
  tickets,
  selectedTickets,
  userAddress,
  isConnected,
  onTicketSelect
}) => {
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
    <div className="grid-container rounded-lg p-4 mb-6">
      <div className="grid grid-cols-5 gap-1 max-w-sm mx-auto">
        {tickets.map((ticket) => (
          <Button
            key={ticket.id}
            onClick={() => !ticket.owner && isConnected && onTicketSelect(ticket.id)}
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
    </div>
  );
};

export default TicketGrid;