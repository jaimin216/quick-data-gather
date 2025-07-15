
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import DualPassingCriteria from './DualPassingCriteria';

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
  usePercentageCriteria: boolean;
  onUsePercentageCriteriaChange: (value: boolean) => void;
  useMcqCriteria: boolean;
  onUseMcqCriteriaChange: (value: boolean) => void;
  minCorrectMcqs?: number;
  onMinCorrectMcqsChange: (count: number | undefined) => void;
  totalMcqs: number;
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
  usePercentageCriteria,
  onUsePercentageCriteriaChange,
  useMcqCriteria,
  onUseMcqCriteriaChange,
  minCorrectMcqs,
  onMinCorrectMcqsChange,
  totalMcqs
}: QuizSettingsProps) {
  if (!isQuiz) return null;

  return (
    <div className="space-y-4">
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>Quiz Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
              className="w-48"
            />
            <p className="text-sm text-muted-foreground">Leave empty for no time limit</p>
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

      <DualPassingCriteria
        usePercentageCriteria={usePercentageCriteria}
        onUsePercentageCriteriaChange={onUsePercentageCriteriaChange}
        useMcqCriteria={useMcqCriteria}
        onUseMcqCriteriaChange={onUseMcqCriteriaChange}
        passingScore={passingScore}
        onPassingScoreChange={onPassingScoreChange}
        minCorrectMcqs={minCorrectMcqs}
        onMinCorrectMcqsChange={onMinCorrectMcqsChange}
        totalMcqs={totalMcqs}
        isQuiz={isQuiz}
      />
    </div>
  );
}
