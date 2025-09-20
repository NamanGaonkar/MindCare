import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JournalEntry {
    id: string;
    content: string;
    created_at: string;
}

const Journaling = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entry, setEntry] = useState('');
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecentEntries = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('journal_entries')
        .select('id, content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
          console.error("Error fetching recent entries:", error)
      } else {
          setRecentEntries(data || []);
      }
  }

  useEffect(() => {
    fetchRecentEntries();
  }, [user]);

  const handleSaveEntry = async () => {
    if (!user || !entry.trim()) return;
    setLoading(true);

    const { error } = await supabase
      .from('journal_entries')
      .insert({ user_id: user.id, content: entry.trim() });

    if (error) {
      toast({ title: "Error saving entry", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Journal entry saved!" });
      setEntry('');
      fetchRecentEntries(); // Refresh the list
    }
    setLoading(false);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>My Journal</CardTitle>
        <CardDescription>A private space for your thoughts.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Textarea
          placeholder="Write down your thoughts and feelings..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="mb-4 h-32"
        />
        <Button onClick={handleSaveEntry} disabled={loading || !entry.trim()}>
            {loading ? 'Saving...' : 'Save Entry'}
        </Button>
        <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Recent Entries</h3>
            <ScrollArea className="h-40">
                {recentEntries.length === 0 && <p className="text-sm text-muted-foreground">No recent entries.</p>}
                <div className="space-y-3">
                    {recentEntries.map(item => (
                        <div key={item.id} className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm truncate">{item.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date(item.created_at).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default Journaling;