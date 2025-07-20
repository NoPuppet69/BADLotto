import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dice6, Trophy, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface DrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDrawComplete: (winningNumber: number) => void;
}

const DrawModal: React.FC<DrawModalProps> = ({ isOpen, onClose, onDrawComplete }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const performDraw = async () => {
    setIsDrawing(true);
    
    // Create transparent random number generation
    const timestamp = Date.now();
    const randomSeed = Math.random();
    const userAgent = navigator.userAgent;
    const screenRes = `${screen.width}x${screen.height}`;
    
    // Combine multiple entropy sources
    const entropy = `${timestamp}-${randomSeed}-${userAgent}-${screenRes}`;
    
    // Simple hash function for deterministic randomness
    let hash = 0;
    for (let i = 0; i < entropy.length; i++) {
      const char = entropy.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Generate number 1-100
    const result = Math.abs(hash % 100) + 1;
    
    // Simulate drawing animation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setWinningNumber(result);
    setShowResult(true);
    setIsDrawing(false);
    
    toast({
      title: "Draw Complete!",
      description: `Winning number: ${result}`,
    });
  };

  const handleComplete = () => {
    if (winningNumber) {
      onDrawComplete(winningNumber);
      setShowResult(false);
      setWinningNumber(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900/95 to-purple-900/95 border-2 border-purple-400/50 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold futuristic-text bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Dice6 className="h-5 w-5 text-purple-400" />
            LOTTERY DRAW
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-center">
          {!showResult && (
            <>
              <div className="cyber-border rounded-lg p-6">
                <p className="text-white mb-4">Ready to draw the winning number?</p>
                <p className="text-purple-300 text-sm mb-4">
                  Using transparent randomization based on:
                  <br />• Current timestamp
                  <br />• Browser entropy
                  <br />• System parameters
                </p>
                {isDrawing && (
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Sparkles className="h-5 w-5 text-purple-400 animate-spin" />
                    <span className="text-purple-300">Drawing...</span>
                  </div>
                )}
              </div>
              
              <Button
                onClick={performDraw}
                disabled={isDrawing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg neon-glow transform hover:scale-105 transition-all duration-300 futuristic-text"
              >
                <Dice6 className="h-4 w-4 mr-2" />
                {isDrawing ? 'DRAWING...' : 'DRAW NOW'}
              </Button>
            </>
          )}
          
          {showResult && winningNumber && (
            <>
              <div className="cyber-border rounded-lg p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
                <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">WINNING NUMBER</h3>
                <Badge className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2">
                  {winningNumber}
                </Badge>
              </div>
              
              <Button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 rounded-lg neon-glow transform hover:scale-105 transition-all duration-300 futuristic-text"
              >
                <Trophy className="h-4 w-4 mr-2" />
                COMPLETE DRAW
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DrawModal;