
import { useMemo } from 'react';
import { EnhancedFormCard } from './EnhancedFormCard';
import { FileText, FlaskConical } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Form = Tables<'forms'> & {
  is_quiz?: boolean;
  question_count?: number;
  response_count?: number;
};

interface SectionedFormDisplayProps {
  forms: Form[];
  onDelete: (formId: string) => void;
  onStatusChange?: () => void;
}

export function SectionedFormDisplay({ forms, onDelete, onStatusChange }: SectionedFormDisplayProps) {
  const { regularForms, exams } = useMemo(() => {
    const regular = forms.filter(form => !form.is_quiz);
    const quizzes = forms.filter(form => form.is_quiz);
    
    return {
      regularForms: regular,
      exams: quizzes
    };
  }, [forms]);

  if (forms.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10">
      {regularForms.length > 0 && (
        <section className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full"></div>
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">My Forms</h2>
            <span className="text-xs text-muted-foreground bg-accent/30 px-2.5 py-1 rounded-full">
              {regularForms.length} {regularForms.length === 1 ? 'form' : 'forms'}
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularForms.map((form, index) => (
              <div 
                key={form.id} 
                className="animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <EnhancedFormCard
                  form={form}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {exams.length > 0 && (
        <section className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full"></div>
            <FlaskConical className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">My Exams</h2>
            <span className="text-xs text-muted-foreground bg-accent/30 px-2.5 py-1 rounded-full">
              {exams.length} {exams.length === 1 ? 'exam' : 'exams'}
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((form, index) => (
              <div 
                key={form.id} 
                className="animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <EnhancedFormCard
                  form={form}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
