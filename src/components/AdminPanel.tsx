import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings, Calendar, Clock, Save, Dice6, RotateCcw, Trophy, Flame } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import DrawModal from './DrawModal';
import { useAppContext } from '@/contexts/AppContext';

interface AdminPanelProps {
  isAdmin: boolean;
  isOpen: boolean;
  onClose: () => void;
  onResetGrid: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isAdmin, isOpen, onClose, onResetGrid }) => {
  const [drawDate, setDrawDate] = useState('');
  const [drawTime, setDrawTime] = useState('');
  const [totalWon, setTotalWon] = useState('');
  const [totalBurnt, setTotalBurnt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const { loadStats } = useAppContext();

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadCurrentSettings();
    }
  }, [isOpen, isAdmin]);

  const loadCurrentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_stats')
        .select('draw_date, draw_time, total_won, total_burnt, current_prize')
        .eq('id', 1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }
      
      if (data) {
        setDrawDate(data.draw_date || '');
        setDrawTime(data.draw_time || '');
        setTotalWon(((data.total_won || 0) / 1000000).toString());
        setTotalBurnt(((data.total_burnt || 0) / 1000000).toString());
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    if (!drawDate || !drawTime) {
      toast({ title: 'Error', description: 'Please fill in both date and time', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      // Get current prize to preserve it
      const { data: currentData } = await supabase
        .from('lottery_stats')
        .select('current_prize')
        .eq('id', 1)
        .single();

      const { error } = await supabase
        .from('lottery_stats')
        .upsert({ 
          id: 1,
          draw_date: drawDate, 
          draw_time: drawTime,
          total_won: parseFloat(totalWon || '0') * 1000000,
          total_burnt: parseFloat(totalBurnt || '0') * 1000000,
          current_prize: currentData?.current_prize || 0
        });
      
      if (error) throw error;
      
      await loadStats();
      toast({ title: 'Success', description: 'Settings updated successfully' });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({ title: 'Error', description: 'Failed to update settings', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetGrid = async () => {
    try {
      await supabase.from('lottery_tickets').delete().neq('id', 0);
      await supabase.from('lottery_stats').upsert({ 
        id: 1,
        current_prize: 0
      });
      
      onResetGrid();
      toast({ title: 'Success', description: 'Grid reset successfully' });
    } catch (error) {
      console.error('Error resetting grid:', error);
      toast({ title: 'Error', description: 'Failed to reset grid', variant: 'destructive' });
    }
  };

  const handleDrawComplete = async (winningNumber: number) => {
    try {
      await supabase.from('lottery_stats').upsert({
        id: 1,
        last_winning_number: winningNumber,
        current_prize: 0
      });
      
      await handleResetGrid();
      
      toast({ title: 'Draw Complete!', description: `Winning number: ${winningNumber}. Grid has been reset.` });
    } catch (error) {
      console.error('Error completing draw:', error);
      toast({ title: 'Error', description: 'Failed to complete draw', variant: 'destructive' });
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900/95 to-blue-900/95 border-2 border-cyan-400/50 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold futuristic-text bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Settings className="h-5 w-5 text-cyan-400" />
              ADMIN PANEL
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="cyber-border rounded-lg p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="drawDate" className="text-cyan-400 font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Draw Date
                </Label>
                <Input
                  id="drawDate"
                  type="date"
                  value={drawDate}
                  onChange={(e) => setDrawDate(e.target.value)}
                  className="bg-black/50 border-cyan-400/50 text-white focus:border-cyan-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="drawTime" className="text-cyan-400 font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Draw Time (24hr UTC)
                </Label>
                <Input
                  id="drawTime"
                  type="time"
                  value={drawTime}
                  onChange={(e) => setDrawTime(e.target.value)}
                  className="bg-black/50 border-cyan-400/50 text-white focus:border-cyan-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalWon" className="text-yellow-400 font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Total Won (M)
                  </Label>
                  <Input
                    id="totalWon"
                    type="number"
                    min="0"
                    step="0.1"
                    value={totalWon}
                    onChange={(e) => setTotalWon(e.target.value)}
                    className="bg-black/50 border-yellow-400/50 text-white focus:border-yellow-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalBurnt" className="text-red-400 font-medium flex items-center gap-2">
                    <Flame className="h-4 w-4" />
                    Total Burnt (M)
                  </Label>
                  <Input
                    id="totalBurnt"
                    type="number"
                    min="0"
                    step="0.1"
                    value={totalBurnt}
                    onChange={(e) => setTotalBurnt(e.target.value)}
                    className="bg-black/50 border-red-400/50 text-white focus:border-red-400"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg neon-glow transform hover:scale-105 transition-all duration-300 futuristic-text"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'SAVING...' : 'SAVE SETTINGS'}
              </Button>
              
              <Button
                onClick={() => setShowDrawModal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg neon-glow transform hover:scale-105 transition-all duration-300 futuristic-text"
              >
                <Dice6 className="h-4 w-4 mr-2" />
                PERFORM DRAW
              </Button>
              
              <Button
                onClick={handleResetGrid}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 rounded-lg neon-glow transform hover:scale-105 transition-all duration-300 futuristic-text"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                RESET GRID
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <DrawModal
        isOpen={showDrawModal}
        onClose={() => setShowDrawModal(false)}
        onDrawComplete={handleDrawComplete}
      />
    </>
  );
};

export default AdminPanel;