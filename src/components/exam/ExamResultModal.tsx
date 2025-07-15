
import { CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ExamResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  passingScore?: number;
  canRetake?: boolean;
  onRetake?: () => void;
}

export function ExamResultModal({ 
  isOpen, 
  onClose, 
  score, 
  totalPoints, 
  percentage, 
  passed, 
  passingScore,
  canRetake,
  onRetake
}: ExamResultModalProps) {
  const resultIcon = passed ? (
    <div className="mx-auto flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
      <Trophy className="h-12 w-12 text-green-600" />
    </div>
  ) : (
    <div className="mx-auto flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
      <XCircle className="h-12 w-12 text-red-600" />
    </div>
  );

  const resultMessage = passed 
    ? "🎉 Congratulations! You Passed!" 
    : "😢 Sorry, you didn't pass this time.";

  const feedbackMessage = passed
    ? "Great job! Keep up the excellent work!"
    : "Don't worry, you can review your answers and try again.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Exam Results
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-6">
          {resultIcon}
          
          <h2 className={`text-xl font-bold mb-2 ${
            passed ? 'text-green-600' : 'text-red-600'
          }`}>
            {resultMessage}
          </h2>
          
          <div className="space-y-4 my-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {score}/{totalPoints}
              </div>
              <div className="text-sm text-gray-600 mb-3">Points Scored</div>
              
              <Progress value={percentage} className="w-full mb-2" />
              <div className="text-lg font-semibold">
                {percentage.toFixed(1)}%
              </div>
              
              {passingScore && (
                <div className="text-sm text-gray-600 mt-2">
                  Passing Score: {passingScore}%
                </div>
              )}
            </div>
            
            <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
              passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {passed ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="font-medium">
                {passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">{feedbackMessage}</p>
          
          <div className="flex flex-col gap-3">
            <Button onClick={onClose} className="w-full">
              View Detailed Results
            </Button>
            
            {!passed && canRetake && onRetake && (
              <Button 
                variant="outline" 
                onClick={onRetake}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Exam
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
