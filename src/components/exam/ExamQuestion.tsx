
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Question = Tables<'questions'>;

interface ExamQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

export function ExamQuestion({ 
  question, 
  questionNumber, 
  totalQuestions, 
  value, 
  onChange, 
  disabled = false 
}: ExamQuestionProps) {
  const renderQuestionInput = () => {
    switch (question.type) {
      case 'text':
      case 'email':
        return (
          <Input
            type={question.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.description || `Enter ${question.title.toLowerCase()}`}
            required={question.required}
            disabled={disabled}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.description || `Enter ${question.title.toLowerCase()}`}
            required={question.required}
            disabled={disabled}
            rows={4}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={question.description || `Enter ${question.title.toLowerCase()}`}
            required={question.required}
            disabled={disabled}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={question.required}
            disabled={disabled}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'multiple_choice':
        const options = question.options as string[] || [];
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={onChange}
            disabled={disabled}
            className="space-y-3"
          >
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <RadioGroupItem 
                  value={option} 
                  id={`${question.id}-${index}`}
                  className="border-2 border-blue-500 text-blue-500 focus:ring-blue-500"
                />
                <Label 
                  htmlFor={`${question.id}-${index}`}
                  className="flex-1 cursor-pointer font-medium"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        const checkboxOptions = question.options as string[] || [];
        const selectedOptions = value || [];
        return (
          <div className="space-y-3">
            {checkboxOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selectedOptions, option]);
                    } else {
                      onChange(selectedOptions.filter((item: string) => item !== option));
                    }
                  }}
                  disabled={disabled}
                  className="border-2 border-blue-500 data-[state=checked]:bg-blue-500"
                />
                <Label 
                  htmlFor={`${question.id}-${index}`}
                  className="flex-1 cursor-pointer font-medium"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'dropdown':
        const dropdownOptions = question.options as string[] || [];
        return (
          <Select value={value || ''} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder={question.description || `Select ${question.title.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {dropdownOptions.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'rating':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onChange(rating)}
                disabled={disabled}
                className={`p-2 transition-all duration-200 ${
                  value >= rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 disabled:cursor-not-allowed`}
              >
                <Star className="h-8 w-8 fill-current" />
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              Question {questionNumber} of {totalQuestions}
            </span>
            {question.points && (
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {question.points} point{question.points !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {question.title}
            {question.required && <span className="text-red-500 ml-1 text-xl">*</span>}
          </h3>
          {question.description && (
            <p className="text-gray-600 mb-4">{question.description}</p>
          )}
        </div>
      </div>
      
      {renderQuestionInput()}
    </div>
  );
}
