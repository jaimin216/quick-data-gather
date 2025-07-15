
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle } from 'lucide-react';

interface ExamProgressIndicatorProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: Set<string>;
  questionIds: string[];
}

export function ExamProgressIndicator({ 
  currentQuestion, 
  totalQuestions, 
  answeredQuestions,
  questionIds
}: ExamProgressIndicatorProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const answeredCount = answeredQuestions.size;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Progress</h3>
        <span className="text-sm text-gray-600">
          {answeredCount}/{totalQuestions} answered
        </span>
      </div>
      
      <Progress value={progressPercentage} className="w-full mb-4" />
      
      <div className="flex flex-wrap gap-2">
        {questionIds.map((questionId, index) => {
          const isAnswered = answeredQuestions.has(questionId);
          const isCurrent = index + 1 === currentQuestion;
          
          return (
            <div
              key={questionId}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                isCurrent
                  ? 'bg-blue-500 text-white border-2 border-blue-600'
                  : isAnswered
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-500 border border-gray-300'
              }`}
            >
              {isAnswered && !isCurrent ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
