import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Journaling = () => {
  const [entry, setEntry] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Journal</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Write down your thoughts and feelings..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="mb-4 h-32"
        />
        <Button>Save Entry</Button>
      </CardContent>
    </Card>
  );
};

export default Journaling;