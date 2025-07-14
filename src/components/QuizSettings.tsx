
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface QuizSettingsProps {
  isQuiz: boolean;
  onQuizToggle: (enabled: boolean) => void;
  timeLimit?: number;
  onTimeLimitChange: (minutes: number | undefined) => void;
  passingScore?: number;
  onPassingScoreChange: (score: number | undefined) => void;
  showResults: boolean;
  onShowResultsChange: (show: boolean) => void;
  allowRetake: boolean;
  onAllowRetakeChange: (allow: boolean) => void;
  autoSave: boolean;
  onAutoSaveChange: (enabled: boolean) => void;
}

export default function QuizSettings({
  isQuiz,
  onQuizToggle,
  timeLimit,
  onTimeLimitChange,
  passingScore,
  onPassingScoreChange,
  showResults,
  onShowResultsChange,
  allowRetake,
  onAllowRetakeChange,
  autoSave,
  onAutoSaveChange,
}: QuizSettingsProps) {
  if (!isQuiz) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <span>Quiz Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="time-limit">Time Limit (minutes)</Label>
            <Input
              id="time-limit"
              type="number"
              min="1"
              max="480"
              value={timeLimit || ''}
              onChange={(e) => onTimeLimitChange(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="No time limit"
            />
            <p className="text-sm text-muted-foreground">Leave empty for no time limit</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="passing-score">Passing Score (%)</Label>
            <Input
              id="passing-score"
              type="number"
              min="0"
              max="100"
              value={passingScore || ''}
              onChange={(e) => onPassingScoreChange(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="60"
            />
            <p className="text-sm text-muted-foreground">Minimum percentage to pass</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Results</Label>
              <p className="text-sm text-muted-foreground">Show score and correct answers after completion</p>
            </div>
            <Switch
              checked={showResults}
              onCheckedChange={onShowResultsChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Retakes</Label>
              <p className="text-sm text-muted-foreground">Allow users to retake the quiz</p>
            </div>
            <Switch
              checked={allowRetake}
              onCheckedChange={onAllowRetakeChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Save Progress</Label>
              <p className="text-sm text-muted-foreground">Automatically save answers as users type</p>
            </div>
            <Switch
              checked={autoSave}
              onCheckedChange={onAutoSaveChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
