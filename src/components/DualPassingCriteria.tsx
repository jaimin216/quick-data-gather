
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Percent, Hash, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DualPassingCriteriaProps {
  usePercentageCriteria: boolean;
  onUsePercentageCriteriaChange: (value: boolean) => void;
  useMcqCriteria: boolean;
  onUseMcqCriteriaChange: (value: boolean) => void;
  passingScore?: number;
  onPassingScoreChange: (score: number | undefined) => void;
  minCorrectMcqs?: number;
  onMinCorrectMcqsChange: (count: number | undefined) => void;
  totalMcqs: number;
  isQuiz: boolean;
}

export default function DualPassingCriteria({
  usePercentageCriteria,
  onUsePercentageCriteriaChange,
  useMcqCriteria,
  onUseMcqCriteriaChange,
  passingScore,
  onPassingScoreChange,
  minCorrectMcqs,
  onMinCorrectMcqsChange,
  totalMcqs,
  isQuiz
}: DualPassingCriteriaProps) {
  if (!isQuiz) return null;

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateCriteria = () => {
    const errors: string[] = [];

    if (!usePercentageCriteria && !useMcqCriteria) {
      errors.push('At least one passing criteria must be enabled');
    }

    if (useMcqCriteria && totalMcqs === 0) {
      errors.push('Cannot use MCQ criteria without multiple choice questions');
    }

    if (useMcqCriteria && minCorrectMcqs && minCorrectMcqs > totalMcqs) {
      errors.push(`Minimum correct MCQs (${minCorrectMcqs}) cannot exceed total MCQs (${totalMcqs})`);
    }

    if (usePercentageCriteria && passingScore && (passingScore < 0 || passingScore > 100)) {
      errors.push('Passing score must be between 0 and 100');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePercentageCriteriaChange = (value: boolean) => {
    onUsePercentageCriteriaChange(value);
    if (!value && !useMcqCriteria) {
      onUseMcqCriteriaChange(true);
    }
    setTimeout(validateCriteria, 0);
  };

  const handleMcqCriteriaChange = (value: boolean) => {
    onUseMcqCriteriaChange(value);
    if (!value && !usePercentageCriteria) {
      onUsePercentageCriteriaChange(true);
    }
    setTimeout(validateCriteria, 0);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>Passing Criteria</span>
          <Badge variant="secondary" className="text-xs">
            {(usePercentageCriteria && useMcqCriteria) ? 'Dual' : 'Single'} Criteria
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {validationErrors.map((error, index) => (
                  <p key={index} className="text-sm">• {error}</p>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* Percentage Criteria */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-primary" />
                <Label className="text-base font-medium">Percentage-based Criteria</Label>
              </div>
              <Switch
                checked={usePercentageCriteria}
                onCheckedChange={handlePercentageCriteriaChange}
              />
            </div>
            
            {usePercentageCriteria && (
              <div className="pl-6 space-y-2">
                <Label htmlFor="passing-score">Minimum Passing Score (%)</Label>
                <Input
                  id="passing-score"
                  type="number"
                  min="0"
                  max="100"
                  value={passingScore || ''}
                  onChange={(e) => onPassingScoreChange(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="60"
                  className="w-32"
                />
                <p className="text-sm text-muted-foreground">
                  Student needs to score at least this percentage to pass
                </p>
              </div>
            )}
          </div>

          {/* MCQ Criteria */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                <Label className="text-base font-medium">MCQ Count-based Criteria</Label>
                <Badge variant="outline" className="text-xs">
                  {totalMcqs} MCQs available
                </Badge>
              </div>
              <Switch
                checked={useMcqCriteria}
                onCheckedChange={handleMcqCriteriaChange}
                disabled={totalMcqs === 0}
              />
            </div>
            
            {useMcqCriteria && (
              <div className="pl-6 space-y-2">
                <Label htmlFor="min-correct-mcqs">Minimum Correct MCQs</Label>
                <Input
                  id="min-correct-mcqs"
                  type="number"
                  min="1"
                  max={totalMcqs}
                  value={minCorrectMcqs || ''}
                  onChange={(e) => onMinCorrectMcqsChange(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder={`Max: ${totalMcqs}`}
                  className="w-32"
                />
                <p className="text-sm text-muted-foreground">
                  Student needs to answer at least this many MCQs correctly
                </p>
              </div>
            )}
          </div>

          {/* Criteria Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Passing Requirements:</h4>
            <div className="space-y-1 text-sm">
              {usePercentageCriteria && useMcqCriteria && (
                <p className="text-primary">
                  • Student must meet BOTH criteria to pass
                </p>
              )}
              {usePercentageCriteria && (
                <p>
                  • Score at least {passingScore || 60}% overall
                </p>
              )}
              {useMcqCriteria && (
                <p>
                  • Answer at least {minCorrectMcqs || Math.ceil(totalMcqs / 2)} out of {totalMcqs} MCQs correctly
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
