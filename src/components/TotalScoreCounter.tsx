
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface TotalScoreCounterProps {
  totalPoints: number;
  questionCount: number;
  isQuiz: boolean;
}

export default function TotalScoreCounter({ totalPoints, questionCount, isQuiz }: TotalScoreCounterProps) {
  if (!isQuiz) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Total Quiz Score</p>
              <p className="text-xs text-muted-foreground">
                {questionCount} {questionCount === 1 ? 'question' : 'questions'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{totalPoints}</p>
            <p className="text-xs text-muted-foreground">points</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
