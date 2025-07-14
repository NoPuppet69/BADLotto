import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings, Calendar, Clock, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface AdminPanelProps {
  isAdmin: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isAdmin, isOpen, onClose }) => {
  const [drawDate, setDrawDate] = useState('');
  const [drawTime, setDrawTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadCurrentSettings();
    }
  }, [isOpen, isAdmin]);

  const loadCurrentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_stats')
        .select('draw_date, draw_time')
        .single();
      
      if (error) throw error;
      
      if (data) {
        setDrawDate(data.draw_date || '');
        setDrawTime(data.draw_time || '');
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
      const { error } = await supabase
        .from('lottery_stats')
        .update({ 
          draw_date: drawDate, 
          draw_time: drawTime,
          last_updated: new Date().toISOString()
        })
        .eq('id', 1);
      
      if (error) throw error;
      
      toast({ title: 'Success', description: 'Draw date and time updated successfully' });
      onClose();
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({ title: 'Error', description: 'Failed to update settings', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900/95 to-blue-900/95 border-2 border-cyan-400/50 backdrop-blur-sm">
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
                Draw Date (DD/MM/YYYY)
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
          </div>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg neon-glow transform hover:scale-105 transition-all duration-300 futuristic-text"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'SAVING...' : 'SAVE SETTINGS'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;