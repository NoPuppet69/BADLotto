import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, DollarSign, Flame, Calendar, Clock } from 'lucide-react';

interface StatsCardsProps {
  prizePool: number;
  soldTickets: number;
  userTickets: number;
  totalPrizesWon: number;
  totalTokensBurnt: number;
  drawDate: string;
  drawTime: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  prizePool,
  soldTickets,
  userTickets,
  totalPrizesWon,
  totalTokensBurnt,
  drawDate,
  drawTime
}) => {
  const progressPercentage = (soldTickets / 100) * 100;
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };
  
  const formatTime = (timeStr: string) => {
    if (!timeStr) return 'TBD';
    return timeStr.slice(0, 5);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      <Card className="bg-black text-white border-2 border-cyan-400 neon-glow shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 futuristic-text text-blue-600">
            <Trophy className="h-4 w-4" />PRIZE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-white">{(prizePool / 1000000).toFixed(0)}M $BAD</div>
        </CardContent>
      </Card>
      
      <Card className="bg-black text-white border-2 border-cyan-400 neon-glow shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 futuristic-text text-blue-600">
            <Users className="h-4 w-4" />SOLD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-white">{soldTickets}/100</div>
          <div className="w-full bg-white/10 rounded-full h-1 mt-2">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black text-white border-2 border-cyan-400 neon-glow shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 futuristic-text text-blue-600">
            <DollarSign className="h-4 w-4" />YOURS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-white">{userTickets}</div>
          <Badge variant="secondary" className="mt-1 bg-white/10 text-white text-xs">
            {((userTickets / 100) * 100).toFixed(1)}%
          </Badge>
        </CardContent>
      </Card>
      
      <Card className="bg-black text-white border-2 border-cyan-400 neon-glow shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 futuristic-text text-yellow-400">
            <Trophy className="h-4 w-4" />WON
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-white">{(totalPrizesWon / 1000000).toFixed(0)}M</div>
          <div className="text-xs text-gray-300">Cumulative</div>
        </CardContent>
      </Card>
      
      <Card className="bg-black text-white border-2 border-cyan-400 neon-glow shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 futuristic-text text-red-400">
            <Flame className="h-4 w-4" />BURNT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-white">{(totalTokensBurnt / 1000000).toFixed(0)}M</div>
          <div className="text-xs text-gray-300">Cumulative</div>
        </CardContent>
      </Card>
      
      <Card className="bg-black text-white border-2 border-cyan-400 neon-glow shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 futuristic-text text-blue-600">
            <Calendar className="h-4 w-4" />DRAW
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold text-white">{formatDate(drawDate)}</div>
          <div className="text-xs text-gray-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(drawTime)} UTC
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;