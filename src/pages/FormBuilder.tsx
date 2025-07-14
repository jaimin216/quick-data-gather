
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Share } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { FormShare } from '@/components/FormShare';
import FormSettings from '@/components/FormSettings';
import QuestionsBuilder from '@/components/QuestionsBuilder';
import type { Tables, Enums } from '@/integrations/supabase/types';

type Form = Tables<'forms'>;
type Question = Tables<'questions'>;
type QuestionType = Enums<'question_type'>;

interface FormData {
  title: string;
  description: string;
  allow_anonymous: boolean;
  collect_email: boolean;
  is_quiz: boolean;
  time_limit_minutes?: number;
  passing_score?: number;
  show_results: boolean;
  allow_retake: boolean;
  auto_save_enabled: boolean;
}

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

export default function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    allow_anonymous: true,
    collect_email: false,
    is_quiz: false,
    show_results: true,
    allow_retake: true,
    auto_save_enabled: true,
  });
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingForm, setLoadingForm] = useState(!!id);
  const [isPublished, setIsPublished] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>();

  useEffect(() => {
    if (user && id) {
      loadForm();
    } else if (user && !id) {
      // Check if there's a template in the URL params
      const templateParam = searchParams.get('template');
      if (templateParam) {
        try {
          const template = JSON.parse(decodeURIComponent(templateParam));
          loadTemplate(template);
        } catch (error) {
          console.error('Error parsing template:', error);
          toast({
            title: "Error",
            description: "Failed to load template. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  }, [user, id, searchParams]);

  const loadTemplate = (template: any) => {
    setForm({
      title: template.form.title,
      description: template.form.description,
      allow_anonymous: template.form.allow_anonymous,
      collect_email: template.form.collect_email,
      is_quiz: template.form.is_quiz || false,
      show_results: template.form.show_results ?? true,
      allow_retake: template.form.allow_retake ?? true,
      auto_save_enabled: template.form.auto_save_enabled ?? true,
      time_limit_minutes: template.form.time_limit_minutes,
      passing_score: template.form.passing_score,
    });

    const templateQuestions = template.questions.map((q: any, index: number) => ({
      type: q.type,
      title: q.title,
      description: q.description,
      required: q.required,
      options: q.options || [],
      order_index: index,
      points: q.points || (template.form.is_quiz ? 1 : undefined),
      correct_answers: q.correct_answers || [],
      explanation: q.explanation || '',
    }));

    setQuestions(templateQuestions);

    toast({
      title: "Template Loaded",
      description: `${template.name} template has been applied successfully.`,
    });
  };

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
        is_quiz: formData.is_quiz || false,
        time_limit_minutes: formData.time_limit_minutes || undefined,
        passing_score: formData.passing_score || undefined,
        show_results: formData.show_results ?? true,
        allow_retake: formData.allow_retake ?? true,
        auto_save_enabled: formData.auto_save_enabled ?? true,
      });

      setIsPublished(formData.status === 'published');

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
        points: q.points || undefined,
        correct_answers: q.correct_answers as string[] || [],
        explanation: q.explanation || '',
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
      const totalPoints = form.is_quiz ? questions.reduce((sum, q) => sum + (q.points || 1), 0) : 0;

      const formUpdateData = {
        title: form.title,
        description: form.description,
        allow_anonymous: form.allow_anonymous,
        collect_email: form.collect_email,
        is_quiz: form.is_quiz,
        time_limit_minutes: form.time_limit_minutes,
        passing_score: form.passing_score,
        total_points: totalPoints,
        show_results: form.show_results,
        allow_retake: form.allow_retake,
        auto_save_enabled: form.auto_save_enabled,
      };

      if (id) {
        // Update existing form
        const { error: formError } = await supabase
          .from('forms')
          .update(formUpdateData)
          .eq('id', id);

        if (formError) throw formError;
      } else {
        // Create new form
        const { data: newForm, error: formError } = await supabase
          .from('forms')
          .insert({
            ...formUpdateData,
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
          points: form.is_quiz ? (q.points || 1) : null,
          correct_answers: form.is_quiz && q.correct_answers?.length ? q.correct_answers : null,
          explanation: form.is_quiz ? q.explanation : null,
        }));

        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToInsert);

        if (questionsError) throw questionsError;
      }

      setLastSaved(new Date());
      toast({
        title: "Success",
        description: `${form.is_quiz ? 'Quiz' : 'Form'} saved successfully!`,
      });

      if (!id) {
        navigate(`/forms/${formId}/edit`);
      }
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: "Error",
        description: `Failed to save ${form.is_quiz ? 'quiz' : 'form'}. Please try again.`,
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
        description: `Please save the ${form.is_quiz ? 'quiz' : 'form'} first before publishing.`,
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

      setIsPublished(true);
      toast({
        title: "Success",
        description: `${form.is_quiz ? 'Quiz' : 'Form'} published successfully! You can now share it with others.`,
      });
    } catch (error) {
      console.error('Error publishing form:', error);
      toast({
        title: "Error",
        description: `Failed to publish ${form.is_quiz ? 'quiz' : 'form'}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  if (loading || loadingForm) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? `Edit ${form.is_quiz ? 'Quiz' : 'Form'}` : `Create New ${form.is_quiz ? 'Quiz' : 'Form'}`}
        </h1>
        <div className="flex flex-wrap gap-3">
          {id && (
            <>
              <Button onClick={publishForm} variant="outline" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Publish</span>
              </Button>
              {isPublished && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Share className="h-4 w-4" />
                      <span>Share</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share Your {form.is_quiz ? 'Quiz' : 'Form'}</DialogTitle>
                    </DialogHeader>
                    <FormShare formId={id} formTitle={form.title} />
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <FormSettings
          form={form}
          onFormChange={setForm}
          onSave={saveForm}
          saving={saving}
          lastSaved={lastSaved}
        />

        <QuestionsBuilder
          questions={questions}
          onQuestionsChange={setQuestions}
          isQuiz={form.is_quiz}
        />
      </div>
    </div>
  );
}
