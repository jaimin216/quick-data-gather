
import { useMemo } from 'react';
import { EnhancedFormCard } from './EnhancedFormCard';
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
    <div className="space-y-8">
      {regularForms.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-foreground">📋 My Forms</h2>
            <span className="text-sm text-muted-foreground">({regularForms.length})</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularForms.map((form) => (
              <EnhancedFormCard
                key={form.id}
                form={form}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </section>
      )}

      {exams.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-foreground">🧪 My Exams</h2>
            <span className="text-sm text-muted-foreground">({exams.length})</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((form) => (
              <EnhancedFormCard
                key={form.id}
                form={form}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
