import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface GaslessModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
  ticketPrice: number;
  userAddress: string;
  onConfirm: (ticketId: number) => void;
}

const GaslessModal: React.FC<GaslessModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  ticketPrice,
  userAddress,
  onConfirm
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGaslessPurchase = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('gasless-purchase', {
        body: {
          ticketId,
          userAddress,
          paymentMethod: 'bad-token'
        }
      });

      if (error) throw error;
      
      if (data.success) {
        setTransactionHash(data.transactionHash);
        setTimeout(() => {
          onConfirm(ticketId);
          onClose();
        }, 2000);
      } else {
        throw new Error(data.error || 'Transaction failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gasless Purchase - Ticket #{ticketId}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="p-4 bg-black border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{ticketPrice} $BAD</div>
              <div className="text-sm text-royal-blue-400">Ticket Price</div>
              <div className="text-xs text-green-400 mt-1 flex items-center justify-center gap-1">
                <Zap className="h-3 w-3" />
                Gas fees paid by site wallet
              </div>
            </div>
          </Card>

          {error && (
            <Card className="p-3 bg-red-50 border-red-200">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </Card>
          )}

          {transactionHash && (
            <Card className="p-3 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Transaction successful!</span>
              </div>
              <div className="text-xs text-gray-500 mt-1 break-all">
                {transactionHash}
              </div>
            </Card>
          )}

          <Button
            onClick={handleGaslessPurchase}
            disabled={isProcessing || !!transactionHash}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 animate-spin" />
                Processing Gasless Transaction...
              </div>
            ) : transactionHash ? (
              'Purchase Complete!'
            ) : (
              'Confirm Gasless Purchase'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GaslessModal;