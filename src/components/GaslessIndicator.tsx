import React from 'react';
import { Card } from '@/components/ui/card';
import { Zap, Shield } from 'lucide-react';

const GaslessIndicator: React.FC = () => {
  return (
    <Card className="p-4 mb-6 bg-black border-2 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-green-400 animate-pulse" />
          <span className="text-green-400 font-bold">GASLESS TRANSACTIONS</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          <span className="text-cyan-400 font-medium">Gas fees paid by site</span>
        </div>
      </div>
      <div className="text-center mt-2">
        <span className="text-white text-sm">
          Purchase tickets with only $BAD tokens - no ETH required!
        </span>
      </div>
    </Card>
  );
};

export default GaslessIndicator;