
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Form = Tables<'forms'>;
type Question = Tables<'questions'>;

interface FormResponse {
  [questionId: string]: any;
}

export default function PublicForm() {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<FormResponse>({});
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
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single();

      if (formError) throw formError;

      setForm(formData);

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
        description: "Form not found or is not published.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const validateResponses = () => {
    for (const question of questions) {
      if (question.required && (!responses[question.id] || responses[question.id] === '')) {
        toast({
          title: "Validation Error",
          description: `Please answer: ${question.title}`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const submitForm = async () => {
    if (!validateResponses()) return;

    setSubmitting(true);

    try {
      // Create form response
      const { data: formResponse, error: responseError } = await supabase
        .from('form_responses')
        .insert({
          form_id: id!,
          respondent_email: form?.collect_email ? email : null,
        })
        .select()
        .single();

      if (responseError) throw responseError;

      // Create question responses
      const questionResponses = questions.map(question => ({
        form_response_id: formResponse.id,
        question_id: question.id,
        answer: responses[question.id] || null,
      }));

      const { error: questionsError } = await supabase
        .from('question_responses')
        .insert(questionResponses);

      if (questionsError) throw questionsError;

      setSubmitted(true);
      toast({
        title: "Success",
        description: "Your response has been submitted successfully!",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit your response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const commonProps = {
      required: question.required,
    };

    switch (question.type) {
      case 'text':
      case 'email':
        return (
          <Input
            {...commonProps}
            type={question.type}
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder={`Enter ${question.title.toLowerCase()}`}
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder={`Enter ${question.title.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Enter number"
          />
        );

      case 'date':
        return (
          <Input
            {...commonProps}
            type="date"
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
          />
        );

      case 'dropdown':
        return (
          <Select onValueChange={(value) => handleResponseChange(question.id, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {(question.options as string[] || []).map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiple_choice':
        return (
          <RadioGroup
            onValueChange={(value) => handleResponseChange(question.id, value)}
          >
            {(question.options as string[] || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {(question.options as string[] || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={(responses[question.id] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = responses[question.id] || [];
                    let newValues;
                    if (checked) {
                      newValues = [...currentValues, option];
                    } else {
                      newValues = currentValues.filter((v: string) => v !== option);
                    }
                    handleResponseChange(question.id, newValues);
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                type="button"
                variant={responses[question.id] === rating ? "default" : "outline"}
                onClick={() => handleResponseChange(question.id, rating)}
                className="w-10 h-10"
              >
                {rating}
              </Button>
            ))}
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!form) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Form Not Found</h1>
            <p className="text-gray-600">This form is not available or is not published.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4 text-green-600">Thank You!</h1>
            <p className="text-gray-600">
              {form.custom_thank_you_message || "Your response has been submitted successfully."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{form.title}</CardTitle>
          {form.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {form.collect_email && (
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
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
            onClick={submitForm} 
            disabled={submitting}
            className="w-full"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
