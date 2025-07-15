
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Timer } from 'lucide-react';

interface Question {
  id?: string;
  type: string;
  title: string;
  description: string;
  required: boolean;
  options?: string[];
  points?: number;
  correct_answers?: string[];
  explanation?: string;
}

interface PreviewQuizButtonProps {
  questions: Question[];
  isQuiz: boolean;
  timeLimit?: number;
  totalPoints: number;
}

export default function PreviewQuizButton({ questions, isQuiz, timeLimit, totalPoints }: PreviewQuizButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isQuiz) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Eye className="h-4 w-4" />
          <span>Preview Quiz</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quiz Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Quiz Info */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Questions:</span>
              <span>{questions.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Points:</span>
              <span>{totalPoints}</span>
            </div>
            {timeLimit && (
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  Time Limit:
                </span>
                <span>{timeLimit} minutes</span>
              </div>
            )}
          </div>

          {/* Questions Preview */}
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">
                    Question {index + 1}: {question.title}
                  </h3>
                  {question.points && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {question.points} pts
                    </span>
                  )}
                </div>
                
                {question.description && (
                  <p className="text-sm text-muted-foreground mb-3">{question.description}</p>
                )}
                
                {question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded border-2 ${
                          question.correct_answers?.includes(option) 
                            ? 'bg-green-100 border-green-500' 
                            : 'border-gray-300'
                        }`}>
                          {question.correct_answers?.includes(option) && (
                            <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-0.5" />
                          )}
                        </div>
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.explanation && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
