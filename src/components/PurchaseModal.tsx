import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Zap } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTickets: number[];
  ticketPrice: number;
  onConfirm: (ticketIds: number[]) => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  selectedTickets,
  ticketPrice,
  onConfirm
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [useGasless, setUseGasless] = useState(true);

  const totalCost = selectedTickets.length * ticketPrice;

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      await onConfirm(selectedTickets);
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(0)}B`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}K`;
    }
    return price.toString();
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
          <Card className="p-4 bg-black/50 border-cyan-400/50">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="bg-cyan-400/20 text-cyan-400">
                  {selectedTickets.length} {selectedTickets.length === 1 ? 'Ticket' : 'Tickets'}
                </Badge>
              </div>
              <div className="text-sm text-gray-300">
                Boxes: {selectedTickets.sort((a, b) => a - b).join(', ')}
              </div>
              <div className="text-2xl font-bold text-white">
                {formatPrice(totalCost)} $BAD
              </div>
              <div className="text-sm text-gray-400">Total Cost</div>
            </div>
          </Card>

          <div className="cyber-border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gasless"
                checked={useGasless}
                onCheckedChange={setUseGasless}
                className="border-cyan-400 data-[state=checked]:bg-cyan-400"
              />
              <label htmlFor="gasless" className="text-sm text-cyan-400 font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Gasless Transaction (Recommended)
              </label>
            </div>
            <div className="text-xs text-gray-400 ml-6">
              {useGasless 
                ? 'Gas fees will be paid by the site wallet automatically' 
                : 'You will pay gas fees from your wallet'}
            </div>
          </div>

          <Button
            onClick={handlePurchase}
            disabled={isProcessing || selectedTickets.length === 0}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg neon-glow transform hover:scale-105 transition-all duration-300 futuristic-text"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                PROCESSING...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                CONFIRM PURCHASE
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;