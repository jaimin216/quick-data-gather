
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lock } from 'lucide-react';
import type { Enums } from '@/integrations/supabase/types';

type QuestionType = Enums<'question_type'>;

interface QuizModeRestrictionsProps {
  isQuiz: boolean;
  allowedTypes: QuestionType[];
  currentType: QuestionType;
  onTypeChange: (type: QuestionType) => void;
}

const QUIZ_ALLOWED_TYPES: QuestionType[] = [
  'multiple_choice',
  'checkbox',
  'dropdown',
  'text',
  'textarea',
  'number',
  'rating'
];

const FORM_ALLOWED_TYPES: QuestionType[] = [
  'text',
  'textarea',
  'multiple_choice',
  'checkbox',
  'dropdown',
  'number',
  'email',
  'date',
  'rating'
];

const TYPE_LABELS = {
  multiple_choice: 'Multiple Choice',
  checkbox: 'Checkbox',
  dropdown: 'Dropdown',
  text: 'Text',
  textarea: 'Textarea',
  number: 'Number',
  email: 'Email',
  date: 'Date',
  rating: 'Rating'
};

export default function QuizModeRestrictions({
  isQuiz,
  allowedTypes,
  currentType,
  onTypeChange
}: QuizModeRestrictionsProps) {
  const restrictedTypes = isQuiz 
    ? FORM_ALLOWED_TYPES.filter(type => !QUIZ_ALLOWED_TYPES.includes(type))
    : [];

  const isCurrentTypeRestricted = isQuiz && restrictedTypes.includes(currentType);

  if (!isQuiz || restrictedTypes.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-amber-800">
          <Lock className="h-4 w-4" />
          Quiz Mode Restrictions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="border-amber-200 bg-amber-50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-amber-800">
            <div className="space-y-2">
              <p className="font-medium">
                The following question types are not available in quiz mode:
              </p>
              <ul className="text-sm space-y-1">
                {restrictedTypes.map(type => (
                  <li key={type} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-600 rounded-full" />
                    {TYPE_LABELS[type]}
                  </li>
                ))}
              </ul>
              {isCurrentTypeRestricted && (
                <p className="text-sm font-medium text-amber-900 mt-3">
                  ⚠️ Current question type "{TYPE_LABELS[currentType]}" is not supported in quiz mode.
                  Please change to a supported type.
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
