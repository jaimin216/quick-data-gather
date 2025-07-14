
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileText, GraduationCap } from 'lucide-react';

interface FormModeToggleProps {
  isQuiz: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function FormModeToggle({ isQuiz, onToggle }: FormModeToggleProps) {
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isQuiz ? (
                <GraduationCap className="h-5 w-5 text-primary" />
              ) : (
                <FileText className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label className="text-base font-medium">
                  {isQuiz ? 'Quiz Mode' : 'Form Mode'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isQuiz 
                    ? 'Create a quiz with scoring, time limits, and correct answers'
                    : 'Create a simple form to collect responses'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">Form</span>
            <Switch
              checked={isQuiz}
              onCheckedChange={onToggle}
            />
            <span className="text-sm text-muted-foreground">Quiz</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
