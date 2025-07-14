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
      <Card className="bg-gradient-to-br from-cyan-600/20 to-blue-700/20 text-white border border-cyan-400/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 futuristic-text">
            <Trophy className="h-4 w-4" />PRIZE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-cyan-400">{(prizePool / 1000000).toFixed(0)}M $BAD</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-700/20 text-white border border-indigo-400/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 futuristic-text">
            <Users className="h-4 w-4" />SOLD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-indigo-400">{soldTickets}/100</div>
          <div className="w-full bg-white/10 rounded-full h-1 mt-2">
            <div className="bg-gradient-to-r from-indigo-400 to-purple-500 h-1 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-600/20 to-pink-700/20 text-white border border-purple-400/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 futuristic-text">
            <DollarSign className="h-4 w-4" />YOURS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-purple-400">{userTickets}</div>
          <Badge variant="secondary" className="mt-1 bg-white/10 text-white text-xs">
            {((userTickets / 100) * 100).toFixed(1)}%
          </Badge>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-600/20 to-emerald-700/20 text-white border border-green-400/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 futuristic-text">
            <Trophy className="h-4 w-4" />WON
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-green-400">{(totalPrizesWon / 1000000).toFixed(0)}M</div>
          <div className="text-xs text-gray-300">Total Prizes</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-red-600/20 to-orange-700/20 text-white border border-red-400/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 futuristic-text">
            <Flame className="h-4 w-4" />BURNT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-red-400">{(totalTokensBurnt / 1000000).toFixed(0)}M</div>
          <div className="text-xs text-gray-300">Total Burnt</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-yellow-600/20 to-amber-700/20 text-white border border-yellow-400/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 futuristic-text">
            <Calendar className="h-4 w-4" />DRAW
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold text-yellow-400">{formatDate(drawDate)}</div>
          <div className="text-xs text-yellow-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(drawTime)} UTC
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;