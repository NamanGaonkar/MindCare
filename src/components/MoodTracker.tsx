import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, Laugh, Angry } from 'lucide-react';

const moods = [
  { icon: Laugh, label: 'Excellent' },
  { icon: Smile, label: 'Good' },
  { icon: Meh, label: 'Okay' },
  { icon: Frown, label: 'Bad' },
  { icon: Angry, label: 'Awful' },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around mb-4">
          {moods.map((mood, index) => (
            <Button
              key={index}
              variant={selectedMood === mood.label ? 'default' : 'outline'}
              size="icon"
              onClick={() => setSelectedMood(mood.label)}
              className={`rounded-full w-16 h-16 flex flex-col items-center justify-center`}
            >
              <mood.icon className="h-8 w-8 mb-1" />
              <span className="text-xs">{mood.label}</span>
            </Button>
          ))}
        </div>
        {selectedMood && <p className="text-center text-muted-foreground">You're feeling {selectedMood}.</p>}
      </CardContent>
    </Card>
  );
};

export default MoodTracker;