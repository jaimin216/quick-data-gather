
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import type { Enums } from '@/integrations/supabase/types';

type QuestionType = Enums<'question_type'>;

interface QuizQuestionSettingsProps {
  questionType: QuestionType;
  points: number;
  onPointsChange: (points: number) => void;
  correctAnswers: string[];
  onCorrectAnswersChange: (answers: string[]) => void;
  explanation: string;
  onExplanationChange: (explanation: string) => void;
  options: string[];
}

export default function QuizQuestionSettings({
  questionType,
  points,
  onPointsChange,
  correctAnswers,
  onCorrectAnswersChange,
  explanation,
  onExplanationChange,
  options,
}: QuizQuestionSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasCorrectAnswers = ['multiple_choice', 'checkbox', 'dropdown'].includes(questionType);

  const handleMultipleChoiceAnswer = (answer: string) => {
    onCorrectAnswersChange([answer]);
  };

  const handleCheckboxAnswer = (answer: string, checked: boolean) => {
    if (checked) {
      onCorrectAnswersChange([...correctAnswers, answer]);
    } else {
      onCorrectAnswersChange(correctAnswers.filter(a => a !== answer));
    }
  };

  return (
    <Card className="mt-4 border-primary/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Quiz Settings</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  max="100"
                  value={points}
                  onChange={(e) => onPointsChange(Number(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">Points awarded for correct answer</p>
              </div>
            </div>

            {hasCorrectAnswers && options.length > 0 && (
              <div className="space-y-3">
                <Label>Correct Answer(s)</Label>
                
                {questionType === 'multiple_choice' && (
                  <RadioGroup 
                    value={correctAnswers[0] || ''} 
                    onValueChange={handleMultipleChoiceAnswer}
                    className="space-y-2"
                  >
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`correct-${index}`} />
                        <Label htmlFor={`correct-${index}`} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {questionType === 'checkbox' && (
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`correct-checkbox-${index}`}
                          checked={correctAnswers.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxAnswer(option, !!checked)}
                        />
                        <Label htmlFor={`correct-checkbox-${index}`} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                )}

                {questionType === 'dropdown' && (
                  <RadioGroup 
                    value={correctAnswers[0] || ''} 
                    onValueChange={handleMultipleChoiceAnswer}
                    className="space-y-2"
                  >
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`correct-dropdown-${index}`} />
                        <Label htmlFor={`correct-dropdown-${index}`} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation (Optional)</Label>
              <Textarea
                id="explanation"
                value={explanation}
                onChange={(e) => onExplanationChange(e.target.value)}
                placeholder="Explain why this is the correct answer..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Shown to users after they submit their answer</p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
