import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InfoOverlayProps {
  onClose: () => void;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2 p-1 h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="pr-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome to $BAD GRID Lottery!
          </h2>
          
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              Welcome to the ultimate lottery experience powered by $BAD tokens! 
              This is your chance to win big while supporting the $BAD ecosystem.
            </p>
            
            <p>
              Each ticket costs 100M $BAD tokens and gives you a chance to win 
              amazing prizes. The lottery features a 10x10 grid of tickets, 
              with draws happening regularly.
            </p>
            
            <p>
              Best of all, our gasless system means you only pay in $BAD tokens - 
              no gas fees required! Connect your wallet and start playing today.
            </p>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This text can be easily edited later to reflect the actual 
              purpose and rules of your lottery system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoOverlay;