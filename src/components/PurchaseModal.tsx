import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Coins, CreditCard, Zap } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
  ticketPrice: number;
  onConfirm: (ticketId: number, paymentMethod: string) => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  ticketPrice,
  onConfirm
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('eth');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);
    // Simulate transaction processing
    setTimeout(() => {
      onConfirm(ticketId, paymentMethod);
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  const paymentOptions = [
    { id: 'eth', name: 'Ethereum', icon: Coins, color: 'from-blue-500 to-blue-600' },
    { id: 'usdc', name: 'USDC', icon: CreditCard, color: 'from-green-500 to-green-600' },
    { id: 'matic', name: 'Polygon', icon: Zap, color: 'from-purple-500 to-purple-600' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Purchase Ticket #{ticketId}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{ticketPrice} ETH</div>
              <div className="text-sm text-gray-600">Ticket Price</div>
            </div>
          </Card>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Payment Method</Label>
            <div className="grid grid-cols-3 gap-2">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.id}
                    variant={paymentMethod === option.id ? "default" : "outline"}
                    onClick={() => setPaymentMethod(option.id)}
                    className={`h-16 flex-col gap-1 ${paymentMethod === option.id ? `bg-gradient-to-r ${option.color} text-white` : ''}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{option.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {isProcessing ? 'Processing...' : 'Confirm Purchase'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;