import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, DollarSign, Clock } from 'lucide-react';

interface LotteryStatsProps {
  totalTickets: number;
  soldTickets: number;
  prizePool: number;
  timeRemaining: string;
  userTickets: number;
}

const LotteryStats: React.FC<LotteryStatsProps> = ({
  totalTickets,
  soldTickets,
  prizePool,
  timeRemaining,
  userTickets
}) => {
  const progressPercentage = (soldTickets / totalTickets) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Prize Pool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{prizePool} ETH</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tickets Sold
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{soldTickets}/{totalTickets}</div>
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Your Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userTickets}</div>
          <Badge variant="secondary" className="mt-1 bg-white/20 text-white">
            {((userTickets / totalTickets) * 100).toFixed(1)}% chance
          </Badge>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Left
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{timeRemaining}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LotteryStats;