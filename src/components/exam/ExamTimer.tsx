
import { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ExamTimerProps {
  timeLimitMinutes: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export function ExamTimer({ timeLimitMinutes, onTimeUp, isActive }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const totalSeconds = timeLimitMinutes * 60;

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercentage = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const isWarning = timeLeft <= 300; // Last 5 minutes

  return (
    <div className={`fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 border-l-4 z-50 ${
      isWarning ? 'border-red-500' : 'border-blue-500'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        {isWarning ? (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        ) : (
          <Clock className="h-5 w-5 text-blue-500" />
        )}
        <span className={`font-semibold ${isWarning ? 'text-red-600' : 'text-gray-800'}`}>
          Time Remaining
        </span>
      </div>
      <div className={`text-2xl font-mono font-bold ${
        isWarning ? 'text-red-600' : 'text-gray-800'
      }`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <Progress 
        value={progressPercentage} 
        className="w-32 mt-2"
      />
    </div>
  );
}
