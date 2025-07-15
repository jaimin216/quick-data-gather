
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Check, X } from 'lucide-react';
import FormModeToggle from './FormModeToggle';
import FormSettingsDrawer from './FormSettingsDrawer';
import QuizSettings from './QuizSettings';

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
  custom_thank_you_message?: string;
  passing_feedback?: string;
  failing_feedback?: string;
}

interface FormSettingsProps {
  form: FormData;
  onFormChange: (form: FormData) => void;
  onSave: () => void;
  saving: boolean;
  lastSaved?: Date;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function FormSettings({ form, onFormChange, onSave, saving, lastSaved }: FormSettingsProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    if (saving) {
      setSaveStatus('saving');
    } else if (lastSaved) {
      setSaveStatus('saved');
      const timer = setTimeout(() => setSaveStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [saving, lastSaved]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormChange({ ...form, title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFormChange({ ...form, description: e.target.value });
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />;
      case 'saved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'error':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Save className="h-4 w-4" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved ✓';
      case 'error':
        return 'Error ❌';
      default:
        return 'Save';
    }
  };

  return (
    <div className="space-y-4">
      <FormModeToggle
        isQuiz={form.is_quiz}
        onToggle={(enabled) => onFormChange({ ...form, is_quiz: enabled })}
      />

      <Card className="rounded-lg shadow-md bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <CardContent className="p-6">
          <div className="absolute top-4 right-4">
            <Button 
              onClick={onSave} 
              disabled={saving}
              size="sm"
              className="flex items-center space-x-2 shadow-sm"
            >
              {getSaveStatusIcon()}
              <span className="hidden sm:inline">{getSaveStatusText()}</span>
            </Button>
          </div>

          <div className="space-y-4 pr-20">
            <div>
              <input
                type="text"
                value={form.title}
                onChange={handleTitleChange}
                placeholder={form.is_quiz ? "Quiz Title" : "Form Title"}
                className="text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 w-full placeholder-gray-400 text-gray-900"
              />
            </div>
            
            <div>
              <textarea
                value={form.description}
                onChange={handleDescriptionChange}
                placeholder={form.is_quiz ? "Quiz Description (Optional)" : "Form Description (Optional)"}
                className="text-gray-600 bg-transparent border-none outline-none focus:ring-0 w-full resize-none placeholder-gray-400"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <FormSettingsDrawer
        form={form}
        onFormChange={onFormChange}
        isQuiz={form.is_quiz}
      />

      <QuizSettings
        isQuiz={form.is_quiz}
        onQuizToggle={(enabled) => onFormChange({ ...form, is_quiz: enabled })}
        timeLimit={form.time_limit_minutes}
        onTimeLimitChange={(minutes) => onFormChange({ ...form, time_limit_minutes: minutes })}
        passingScore={form.passing_score}
        onPassingScoreChange={(score) => onFormChange({ ...form, passing_score: score })}
        showResults={form.show_results}
        onShowResultsChange={(show) => onFormChange({ ...form, show_results: show })}
        allowRetake={form.allow_retake}
        onAllowRetakeChange={(allow) => onFormChange({ ...form, allow_retake: allow })}
        autoSave={form.auto_save_enabled}
        onAutoSaveChange={(enabled) => onFormChange({ ...form, auto_save_enabled: enabled })}
      />
    </div>
  );
}
