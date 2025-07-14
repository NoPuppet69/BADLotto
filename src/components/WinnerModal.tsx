import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Sparkles, Gift } from 'lucide-react';

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  winnerTicket: number;
  prizeAmount: number;
  isWinner: boolean;
}

const WinnerModal: React.FC<WinnerModalProps> = ({
  isOpen,
  onClose,
  winnerTicket,
  prizeAmount,
  isWinner
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {isWinner ? (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
                <Trophy className="h-8 w-8 text-yellow-500" />
                Congratulations!
              </span>
            ) : (
              <span className="text-gray-600">Lottery Results</span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          {isWinner ? (
            <Card className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-12 w-12 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold mb-2">You Won!</h3>
              <p className="text-lg mb-2">Winning Ticket: #{winnerTicket}</p>
              <p className="text-2xl font-bold">{prizeAmount} ETH</p>
            </Card>
          ) : (
            <Card className="p-6 bg-gradient-to-r from-gray-400 to-gray-600 text-white border-0">
              <div className="flex items-center justify-center mb-4">
                <Gift className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold mb-2">Better Luck Next Time!</h3>
              <p className="text-lg mb-2">Winning Ticket: #{winnerTicket}</p>
              <p className="text-lg">Prize: {prizeAmount} ETH</p>
            </Card>
          )}

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg"
          >
            {isWinner ? 'Claim Prize' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerModal;