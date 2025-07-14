
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import QuestionBlock from './QuestionBlock';
import type { Enums } from '@/integrations/supabase/types';

type QuestionType = Enums<'question_type'>;

interface QuestionData {
  id?: string;
  type: QuestionType;
  title: string;
  description: string;
  required: boolean;
  options?: string[];
  order_index: number;
  points?: number;
  correct_answers?: string[];
  explanation?: string;
}

interface QuestionsBuilderProps {
  questions: QuestionData[];
  onQuestionsChange: (questions: QuestionData[]) => void;
  isQuiz: boolean;
}

export default function QuestionsBuilder({ questions, onQuestionsChange, isQuiz }: QuestionsBuilderProps) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(-1);

  const addQuestion = () => {
    const newQuestion: QuestionData = {
      type: 'text',
      title: '',
      description: '',
      required: false,
      order_index: questions.length,
      ...(isQuiz && { points: 1, correct_answers: [], explanation: '' })
    };
    const newQuestions = [...questions, newQuestion];
    onQuestionsChange(newQuestions);
    setActiveQuestionIndex(questions.length);
  };

  const updateQuestion = (index: number, field: keyof QuestionData, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    onQuestionsChange(updatedQuestions);
  };

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = { ...questions[index] };
    delete questionToDuplicate.id;
    questionToDuplicate.title = questionToDuplicate.title + ' (Copy)';
    questionToDuplicate.order_index = questions.length;
    
    const newQuestions = [...questions, questionToDuplicate];
    onQuestionsChange(newQuestions);
    setActiveQuestionIndex(questions.length);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    const reorderedQuestions = updatedQuestions.map((q, i) => ({ ...q, order_index: i }));
    onQuestionsChange(reorderedQuestions);
    setActiveQuestionIndex(-1);
  };

  const totalPoints = isQuiz ? questions.reduce((sum, q) => sum + (q.points || 1), 0) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{isQuiz ? 'Quiz Builder' : 'Form Builder'}</CardTitle>
            {isQuiz && totalPoints > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Total Points: {totalPoints}
              </p>
            )}
          </div>
          <div className="hidden md:block">
            <Button onClick={addQuestion} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add {isQuiz ? 'Question' : 'Question'}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No questions yet. Start building your {isQuiz ? 'quiz' : 'form'}!
            </p>
            <Button onClick={addQuestion} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Your First Question</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionBlock
                key={index}
                question={question}
                index={index}
                isActive={activeQuestionIndex === index}
                isQuiz={isQuiz}
                onUpdate={(field, value) => updateQuestion(index, field, value)}
                onDuplicate={() => duplicateQuestion(index)}
                onDelete={() => removeQuestion(index)}
                onFocus={() => setActiveQuestionIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Floating Add Button for Mobile */}
        <div className="md:hidden fixed bottom-6 right-6 z-10">
          <Button
            onClick={addQuestion}
            size="lg"
            className="rounded-full shadow-lg h-14 w-14 flex items-center justify-center"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Sticky Toolbar for Mobile */}
        <div className="md:hidden sticky bottom-0 bg-white border-t p-4 mt-6">
          <Button onClick={addQuestion} className="w-full flex items-center justify-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
