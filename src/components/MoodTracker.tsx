import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, Laugh, Angry } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const moods = [
  { icon: Laugh, label: 'Excellent', value: 5 },
  { icon: Smile, label: 'Good', value: 4 },
  { icon: Meh, label: 'Okay', value: 3 },
  { icon: Frown, label: 'Bad', value: 2 },
  { icon: Angry, label: 'Awful', value: 1 },
];

const MoodTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [savedMood, setSavedMood] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTodaysMood = async () => {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood_value')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lte('created_at', `${today}T23:59:59.999Z`)
        .single();
      
      if (data) {
        setSelectedMood(data.mood_value);
        setSavedMood(data.mood_value);
      }
    };
    fetchTodaysMood();
  }, [user]);

  const handleMoodSelect = async (moodValue: number) => {
    if (!user) return;
    setLoading(true);
    setSelectedMood(moodValue);

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('mood_entries')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lte('created_at', `${today}T23:59:59.999Z`)
        .single();

    if (data) { // Update existing entry for today
        const { error: updateError } = await supabase
            .from('mood_entries')
            .update({ mood_value: moodValue, updated_at: new Date().toISOString() })
            .eq('id', data.id);
        if (updateError) {
            toast({ title: "Error updating mood", description: updateError.message, variant: "destructive" });
        } else {
            toast({ title: "Mood updated!" });
            setSavedMood(moodValue);
        }
    } else { // Insert new entry
        const { error: insertError } = await supabase
            .from('mood_entries')
            .insert({ user_id: user.id, mood_value: moodValue });
        if (insertError) {
            toast({ title: "Error saving mood", description: insertError.message, variant: "destructive" });
        } else {
            toast({ title: "Mood saved!" });
            setSavedMood(moodValue);
        }
    }
    setLoading(false);
  };

  const getMoodLabel = (value: number | null) => {
      return moods.find(m => m.value === value)?.label.toLowerCase();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
        {savedMood && <CardDescription>Today you're feeling {getMoodLabel(savedMood)}.</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex justify-around mb-4">
          {moods.map((mood) => (
            <Button
              key={mood.value}
              variant={selectedMood === mood.value ? 'default' : 'outline'}
              size="icon"
              onClick={() => handleMoodSelect(mood.value)}
              disabled={loading}
              className={`rounded-full w-16 h-16 flex flex-col items-center justify-center transition-all duration-200`}
            >
              <mood.icon className="h-8 w-8 mb-1" />
              <span className="text-xs">{mood.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
