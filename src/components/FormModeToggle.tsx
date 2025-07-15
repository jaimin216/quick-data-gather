
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileText, GraduationCap, Timer, Trophy } from 'lucide-react';

interface FormModeToggleProps {
  isQuiz: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function FormModeToggle({ isQuiz, onToggle }: FormModeToggleProps) {
  return (
    <Card className={`border-2 transition-all duration-300 ${
      isQuiz 
        ? 'border-primary bg-primary/5 shadow-md' 
        : 'border-dashed border-muted-foreground/30 hover:border-muted-foreground/50'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full transition-colors ${
                isQuiz 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isQuiz ? (
                  <GraduationCap className="h-5 w-5" />
                ) : (
                  <FileText className="h-5 w-5" />
                )}
              </div>
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  {isQuiz ? 'Quiz Mode' : 'Form Mode'}
                  {isQuiz && (
                    <div className="flex items-center gap-1 text-primary">
                      <Timer className="h-4 w-4" />
                      <Trophy className="h-4 w-4" />
                    </div>
                  )}
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
            <span className={`text-sm transition-colors ${
              !isQuiz ? 'text-foreground font-medium' : 'text-muted-foreground'
            }`}>
              Form
            </span>
            <Switch
              checked={isQuiz}
              onCheckedChange={onToggle}
              className={isQuiz ? 'data-[state=checked]:bg-primary' : ''}
            />
            <span className={`text-sm transition-colors ${
              isQuiz ? 'text-primary font-medium' : 'text-muted-foreground'
            }`}>
              Quiz
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
