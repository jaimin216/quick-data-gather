
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Save, Eye } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import type { Tables, Enums } from '@/integrations/supabase/types';

type Form = Tables<'forms'>;
type Question = Tables<'questions'>;
type QuestionType = Enums<'question_type'>;

interface FormData {
  title: string;
  description: string;
  allow_anonymous: boolean;
  collect_email: boolean;
}

interface QuestionData {
  id?: string;
  type: QuestionType;
  title: string;
  description: string;
  required: boolean;
  options?: string[];
  order_index: number;
}

export default function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    allow_anonymous: true,
    collect_email: false,
  });
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingForm, setLoadingForm] = useState(!!id);

  useEffect(() => {
    if (user && id) {
      loadForm();
    }
  }, [user, id]);

  const loadForm = async () => {
    if (!id) return;

    try {
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();

      if (formError) throw formError;

      setForm({
        title: formData.title,
        description: formData.description || '',
        allow_anonymous: formData.allow_anonymous,
        collect_email: formData.collect_email,
      });

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('form_id', id)
        .order('order_index');

      if (questionsError) throw questionsError;

      setQuestions(questionsData.map(q => ({
        id: q.id,
        type: q.type,
        title: q.title,
        description: q.description || '',
        required: q.required,
        options: q.options as string[] || [],
        order_index: q.order_index,
      })));
    } catch (error) {
      console.error('Error loading form:', error);
      toast({
        title: "Error",
        description: "Failed to load form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingForm(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: QuestionData = {
      type: 'text',
      title: '',
      description: '',
      required: false,
      order_index: questions.length,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof QuestionData, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions.map((q, i) => ({ ...q, order_index: i })));
  };

  const saveForm = async () => {
    if (!form.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Form title is required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      let formId = id;

      if (id) {
        // Update existing form
        const { error: formError } = await supabase
          .from('forms')
          .update({
            title: form.title,
            description: form.description,
            allow_anonymous: form.allow_anonymous,
            collect_email: form.collect_email,
          })
          .eq('id', id);

        if (formError) throw formError;
      } else {
        // Create new form
        const { data: newForm, error: formError } = await supabase
          .from('forms')
          .insert({
            title: form.title,
            description: form.description,
            allow_anonymous: form.allow_anonymous,
            collect_email: form.collect_email,
            user_id: user!.id,
          })
          .select()
          .single();

        if (formError) throw formError;
        formId = newForm.id;
      }

      // Delete existing questions and recreate them
      if (id) {
        await supabase.from('questions').delete().eq('form_id', id);
      }

      // Insert questions
      if (questions.length > 0) {
        const questionsToInsert = questions.map(q => ({
          form_id: formId,
          type: q.type,
          title: q.title,
          description: q.description,
          required: q.required,
          options: q.options?.length ? q.options : null,
          order_index: q.order_index,
        }));

        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToInsert);

        if (questionsError) throw questionsError;
      }

      toast({
        title: "Success",
        description: "Form saved successfully!",
      });

      if (!id) {
        navigate(`/forms/${formId}/edit`);
      }
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: "Error",
        description: "Failed to save form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const publishForm = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "Please save the form first before publishing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('forms')
        .update({ status: 'published' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Form published successfully!",
      });
    } catch (error) {
      console.error('Error publishing form:', error);
      toast({
        title: "Error",
        description: "Failed to publish form. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || loadingForm) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Edit Form' : 'Create New Form'}
        </h1>
        <div className="flex space-x-3">
          <Button onClick={saveForm} disabled={saving} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </Button>
          {id && (
            <Button onClick={publishForm} variant="outline" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Publish</span>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Form Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Form Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Form Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter form title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter form description"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allow_anonymous"
                checked={form.allow_anonymous}
                onCheckedChange={(checked) => setForm({ ...form, allow_anonymous: !!checked })}
              />
              <Label htmlFor="allow_anonymous">Allow anonymous responses</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="collect_email"
                checked={form.collect_email}
                onCheckedChange={(checked) => setForm({ ...form, collect_email: !!checked })}
              />
              <Label htmlFor="collect_email">Collect email addresses</Label>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Questions</CardTitle>
              <Button onClick={addQuestion} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Question</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No questions yet. Click "Add Question" to get started.
              </p>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Question Type</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value) => updateQuestion(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="textarea">Long Text</SelectItem>
                            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                            <SelectItem value="dropdown">Dropdown</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={question.required}
                          onCheckedChange={(checked) => updateQuestion(index, 'required', !!checked)}
                        />
                        <Label>Required</Label>
                      </div>
                    </div>

                    <div>
                      <Label>Question Title</Label>
                      <Input
                        value={question.title}
                        onChange={(e) => updateQuestion(index, 'title', e.target.value)}
                        placeholder="Enter question title"
                      />
                    </div>

                    <div>
                      <Label>Description (Optional)</Label>
                      <Input
                        value={question.description}
                        onChange={(e) => updateQuestion(index, 'description', e.target.value)}
                        placeholder="Enter question description"
                      />
                    </div>

                    {['multiple_choice', 'checkbox', 'dropdown'].includes(question.type) && (
                      <div>
                        <Label>Options</Label>
                        <Textarea
                          value={(question.options || []).join('\n')}
                          onChange={(e) => updateQuestion(index, 'options', e.target.value.split('\n').filter(opt => opt.trim()))}
                          placeholder="Enter options (one per line)"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
