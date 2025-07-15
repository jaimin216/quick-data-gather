import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { GripVertical, Trash2, Copy, ChevronDown, Plus, X, Trophy } from 'lucide-react';
import QuizQuestionSettings from './QuizQuestionSettings';
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

interface QuestionBlockProps {
  question: QuestionData;
  index: number;
  isActive: boolean;
  isQuiz: boolean;
  onUpdate: (field: keyof QuestionData, value: any) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onFocus: () => void;
}

export default function QuestionBlock({ 
  question, 
  index, 
  isActive, 
  isQuiz,
  onUpdate, 
  onDuplicate, 
  onDelete,
  onFocus
}: QuestionBlockProps) {
  const [isCollapsed, setIsCollapsed] = useState(!isActive && question.title === '');
  const [options, setOptions] = useState(question.options || []);

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...options];
    newOptions[optionIndex] = value;
    setOptions(newOptions);
    onUpdate('options', newOptions);
  };

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    setOptions(newOptions);
    onUpdate('options', newOptions);
  };

  const removeOption = (optionIndex: number) => {
    const newOptions = options.filter((_, i) => i !== optionIndex);
    setOptions(newOptions);
    onUpdate('options', newOptions);
    
    // Update correct answers if they reference removed options
    if (isQuiz && question.correct_answers) {
      const removedOption = options[optionIndex];
      const updatedCorrectAnswers = question.correct_answers.filter(answer => answer !== removedOption);
      onUpdate('correct_answers', updatedCorrectAnswers);
    }
  };

  const needsOptions = ['multiple_choice', 'checkbox', 'dropdown'].includes(question.type);

  // Filter question types for quiz mode
  const availableTypes = isQuiz 
    ? [
        { value: 'multiple_choice', label: 'Multiple Choice' },
        { value: 'checkbox', label: 'Checkbox' },
        { value: 'dropdown', label: 'Dropdown' },
        { value: 'text', label: 'Short Text' },
        { value: 'textarea', label: 'Long Text' },
      ]
    : [
        { value: 'text', label: 'Text' },
        { value: 'textarea', label: 'Long Text' },
        { value: 'multiple_choice', label: 'Multiple Choice' },
        { value: 'checkbox', label: 'Checkbox' },
        { value: 'dropdown', label: 'Dropdown' },
        { value: 'number', label: 'Number' },
        { value: 'email', label: 'Email' },
        { value: 'date', label: 'Date' },
        { value: 'rating', label: 'Rating' },
      ];

  return (
    <Card 
      className={`rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
        isActive 
          ? 'ring-2 ring-primary border-primary bg-primary/5' 
          : 'bg-white border hover:border-muted-foreground/50'
      }`}
      onClick={onFocus}
    >
      <CardContent className="p-4">
        <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="cursor-move text-gray-400 hover:text-gray-600 touch-manipulation">
                <GripVertical className="h-5 w-5" />
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <span className="font-medium">Question {index + 1}</span>
                  </div>
                  {isQuiz && question.points && (
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-2 py-1 rounded-full">
                      <Trophy className="h-3 w-3" />
                      <span className="text-xs font-medium">{question.points} pts</span>
                    </div>
                  )}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className="flex items-center space-x-1 hover:bg-muted/50"
              >
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Duplicate</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>

          <CollapsibleContent className="space-y-4">
            {/* Question Type and Required on same row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Question Type</Label>
                <Select
                  value={question.type}
                  onValueChange={(value) => onUpdate('type', value)}
                >
                  <SelectTrigger className="touch-manipulation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  checked={question.required}
                  onCheckedChange={(checked) => onUpdate('required', !!checked)}
                />
                <Label>Required</Label>
              </div>
            </div>

            <div>
              <Label>Question Title</Label>
              <Input
                value={question.title}
                onChange={(e) => onUpdate('title', e.target.value)}
                placeholder={`Enter your question here...`}
                className="text-lg font-medium focus:ring-2 focus:ring-primary/20"
                autoFocus={isActive && question.title === ''}
              />
            </div>

            <div>
              <Label>Description (Optional)</Label>
              <Input
                value={question.description}
                onChange={(e) => onUpdate('description', e.target.value)}
                placeholder="Add helpful context or instructions for this question"
                className="focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {needsOptions && (
              <div>
                <Label>Options</Label>
                <div className="space-y-2">
                  {options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          className={`pr-8 ${
                            isQuiz && question.correct_answers?.includes(option)
                              ? 'border-green-500 bg-green-50'
                              : ''
                          }`}
                        />
                        {isQuiz && question.correct_answers?.includes(option) && (
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeOption(optionIndex)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 touch-manipulation"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="flex items-center space-x-2 hover:bg-muted/50"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Option</span>
                  </Button>
                </div>
              </div>
            )}

            {isQuiz && (
              <QuizQuestionSettings
                questionType={question.type}
                points={question.points || 1}
                onPointsChange={(points) => onUpdate('points', points)}
                correctAnswers={question.correct_answers || []}
                onCorrectAnswersChange={(answers) => onUpdate('correct_answers', answers)}
                explanation={question.explanation || ''}
                onExplanationChange={(explanation) => onUpdate('explanation', explanation)}
                options={options}
              />
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
