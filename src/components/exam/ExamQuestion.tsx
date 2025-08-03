
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
            className="py-3 px-4 text-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
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
            rows={6}
            className="py-3 px-4 text-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 resize-none"
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
            className="py-3 px-4 text-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
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
            className="py-3 px-4 text-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
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
              <div key={index} className="flex items-center space-x-4 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                <RadioGroupItem 
                  value={option} 
                  id={`${question.id}-${index}`}
                  className="border-2 border-blue-500 text-blue-500 focus:ring-blue-500 scale-125"
                />
                <Label 
                  htmlFor={`${question.id}-${index}`}
                  className="flex-1 cursor-pointer font-medium text-lg text-gray-800"
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
              <div key={index} className="flex items-center space-x-4 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
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
                  className="border-2 border-blue-500 data-[state=checked]:bg-blue-500 scale-125"
                />
                <Label 
                  htmlFor={`${question.id}-${index}`}
                  className="flex-1 cursor-pointer font-medium text-lg text-gray-800"
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
            <SelectTrigger className="py-3 px-4 text-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300">
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
          <div className="flex space-x-3 justify-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onChange(rating)}
                disabled={disabled}
                className={`p-3 rounded-full transition-all duration-200 hover:scale-110 ${
                  value >= rating ? 'text-yellow-400 bg-yellow-50' : 'text-gray-300 hover:text-yellow-400'
                } disabled:cursor-not-allowed border-2 ${
                  value >= rating ? 'border-yellow-300' : 'border-gray-200'
                }`}
              >
                <Star className="h-10 w-10 fill-current" />
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-200">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
              Question {questionNumber} of {totalQuestions}
            </span>
            {question.points && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                {question.points} point{question.points !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            {question.title}
            {question.required && <span className="text-red-500 ml-2 text-2xl">*</span>}
          </h3>
          {question.description && (
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">{question.description}</p>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        {renderQuestionInput()}
      </div>
    </div>
  );
}
