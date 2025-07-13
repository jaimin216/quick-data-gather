import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle, Star } from 'lucide-react';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Form = Tables<'forms'>;
type Question = Tables<'questions'>;

interface FormData {
  [questionId: string]: any;
}

export default function PublicForm() {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      loadForm();
    }
  }, [id]);

  const loadForm = async () => {
    if (!id) return;

    try {
      // Load form details
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single();

      if (formError) throw formError;
      setForm(formData);

      // Load questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('form_id', id)
        .order('order_index');

      if (questionsError) throw questionsError;
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error loading form:', error);
      toast({
        title: "Error",
        description: "Failed to load form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSubmitting(true);

    try {
      // Validate required fields
      const requiredQuestions = questions.filter(q => q.required);
      for (const question of requiredQuestions) {
        if (!formData[question.id] || (Array.isArray(formData[question.id]) && formData[question.id].length === 0)) {
          toast({
            title: "Required field missing",
            description: `Please answer: ${question.title}`,
            variant: "destructive",
          });
          setSubmitting(false);
          return;
        }
      }

      // Create form response with proper typing
      const formResponseData: TablesInsert<'form_responses'> = {
        form_id: form.id,
      };

      // Only add email if form collects email and user provided one
      if (form.collect_email && email.trim()) {
        formResponseData.respondent_email = email.trim();
      }

      const { data: responseData, error: responseError } = await supabase
        .from('form_responses')
        .insert(formResponseData)
        .select()
        .single();

      if (responseError) {
        console.error('Form response error:', responseError);
        throw responseError;
      }

      // Create question responses
      const questionResponses = questions.map(question => ({
        form_response_id: responseData.id,
        question_id: question.id,
        answer: formData[question.id] || null
      }));

      const { error: questionsError } = await supabase
        .from('question_responses')
        .insert(questionResponses);

      if (questionsError) {
        console.error('Question responses error:', questionsError);
        throw questionsError;
      }

      setSubmitted(true);
      toast({
        title: "Success",
        description: "Your response has been submitted successfully!",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const value = formData[question.id];

    switch (question.type) {
      case 'text':
      case 'email':
        return (
          <Input
            type={question.type}
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.description || `Enter ${question.title.toLowerCase()}`}
            required={question.required}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.description || `Enter ${question.title.toLowerCase()}`}
            required={question.required}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, Number(e.target.value))}
            placeholder={question.description || `Enter ${question.title.toLowerCase()}`}
            required={question.required}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            required={question.required}
          />
        );

      case 'multiple_choice':
        const options = question.options as string[] || [];
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={(newValue) => handleInputChange(question.id, newValue)}
            required={question.required}
          >
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        const checkboxOptions = question.options as string[] || [];
        const selectedOptions = value || [];
        return (
          <div className="space-y-2">
            {checkboxOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleInputChange(question.id, [...selectedOptions, option]);
                    } else {
                      handleInputChange(question.id, selectedOptions.filter((item: string) => item !== option));
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'dropdown':
        const dropdownOptions = question.options as string[] || [];
        return (
          <Select value={value || ''} onValueChange={(newValue) => handleInputChange(question.id, newValue)}>
            <SelectTrigger>
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
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleInputChange(question.id, rating)}
                className={`p-1 ${
                  value >= rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!form) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Form Not Found</h1>
            <p className="text-gray-600">This form doesn't exist or is not published.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
            <p className="text-gray-600 mb-6">
              {form.custom_thank_you_message || 'Your response has been submitted successfully.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{form.title}</CardTitle>
          {form.description && (
            <p className="text-gray-600 mt-2">{form.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.collect_email && (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
            )}

            {questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <Label className="text-base font-medium">
                  {question.title}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {question.description && (
                  <p className="text-sm text-gray-600">{question.description}</p>
                )}
                {renderQuestion(question)}
              </div>
            ))}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Response'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
