import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, ShoppingCart, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface PurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTickets: number[];
  userAddress?: string;
  onPurchaseComplete: (ticketIds: number[]) => void;
}

const PurchaseDialog: React.FC<PurchaseDialogProps> = ({
  isOpen,
  onClose,
  selectedTickets,
  userAddress,
  onPurchaseComplete
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const totalCost = selectedTickets.length * 100000000;
  const prizeAmount = totalCost * 0.5;
  const burnAmount = totalCost * 0.5;

  const handlePurchase = async () => {
    if (!userAddress || selectedTickets.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Store ticket purchases in database
      const ticketData = selectedTickets.map(ticketNumber => ({
        ticket_number: ticketNumber,
        wallet_address: userAddress,
        transaction_hash: '0x' + Math.random().toString(16).substr(2, 64),
        lottery_round: 1
      }));
      
      const { error: ticketError } = await supabase
        .from('lottery_tickets')
        .insert(ticketData);
      
      if (ticketError) throw ticketError;
      
      // Update lottery stats
      const { data: currentStats, error: statsError } = await supabase
        .from('lottery_stats')
        .select('total_prizes_won, total_tokens_burnt')
        .single();
      
      if (statsError) throw statsError;
      
      const { error: updateError } = await supabase
        .from('lottery_stats')
        .update({
          total_prizes_won: (currentStats?.total_prizes_won || 0) + prizeAmount,
          total_tokens_burnt: (currentStats?.total_tokens_burnt || 0) + burnAmount,
          last_updated: new Date().toISOString()
        })
        .eq('id', 1);
      
      if (updateError) throw updateError;
      
      toast({ 
        title: "Purchase Successful!", 
        description: `Successfully purchased ${selectedTickets.length} tickets` 
      });
      
      onPurchaseComplete(selectedTickets);
      onClose();
    } catch (error) {
      console.error('Purchase error:', error);
      toast({ 
        title: "Purchase Failed", 
        description: "There was an error processing your purchase", 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeTicket = (ticketId: number) => {
    // This would need to be handled by parent component
    // For now, just close dialog to simplify
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900/95 to-blue-900/95 border-2 border-cyan-400/50 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold futuristic-text bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <ShoppingCart className="h-5 w-5 text-cyan-400" />
            PURCHASE TICKETS
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="cyber-border rounded-lg p-4">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-cyan-400 futuristic-text">
                {(totalCost / 1000000).toFixed(0)}M $BAD
              </div>
              <div className="text-sm text-gray-300">Total Cost ({selectedTickets.length} tickets)</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-green-400 font-bold">{(prizeAmount / 1000000).toFixed(0)}M</div>
                <div className="text-gray-400">To Prize Pool</div>
              </div>
              <div className="text-center">
                <div className="text-red-400 font-bold">{(burnAmount / 1000000).toFixed(0)}M</div>
                <div className="text-gray-400">To Burn</div>
              </div>
            </div>
          </div>
          
          <div className="cyber-border rounded-lg p-3">
            <div className="text-sm text-gray-300 mb-2">Selected Tickets:</div>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
              {selectedTickets.map(ticketId => (
                <Badge key={ticketId} variant="secondary" className="bg-cyan-600/20 text-cyan-400 text-xs">
                  #{ticketId}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="cyber-border rounded-lg p-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Coins className="h-5 w-5" />
                <span className="font-medium futuristic-text">$BAD TOKENS ONLY</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handlePurchase}
            disabled={isProcessing || selectedTickets.length === 0}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg neon-glow transform hover:scale-105 transition-all duration-300 futuristic-text"
          >
            {isProcessing ? 'PROCESSING...' : 'CONFIRM PURCHASE'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;