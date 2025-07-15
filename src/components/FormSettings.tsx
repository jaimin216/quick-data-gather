
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Save, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FormModeToggle from './FormModeToggle';
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
  use_percentage_criteria: boolean;
  use_mcq_criteria: boolean;
  min_correct_mcqs?: number;
  total_mcqs?: number;
}

interface FormSettingsProps {
  form: FormData;
  onFormChange: (form: FormData) => void;
  onSave: () => void;
  saving: boolean;
  lastSaved?: Date;
  totalMcqs: number;
}

export default function FormSettings({ 
  form, 
  onFormChange, 
  onSave, 
  saving, 
  lastSaved,
  totalMcqs 
}: FormSettingsProps) {
  const updateForm = (updates: Partial<FormData>) => {
    onFormChange({ ...form, ...updates });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Settings</CardTitle>
            <div className="flex items-center space-x-3">
              {lastSaved && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
              <Button onClick={onSave} disabled={saving} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
                placeholder="Enter form title..."
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                placeholder="Enter form description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thank-you-message">Custom Thank You Message</Label>
              <Textarea
                id="thank-you-message"
                value={form.custom_thank_you_message || ''}
                onChange={(e) => updateForm({ custom_thank_you_message: e.target.value })}
                placeholder="Thank you for your submission!"
                rows={2}
              />
            </div>
          </div>

          <Separator />

          <FormModeToggle 
            isQuiz={form.is_quiz}
            onToggle={(enabled) => updateForm({ is_quiz: enabled })}
          />
        </CardContent>
      </Card>

      <QuizSettings
        isQuiz={form.is_quiz}
        onQuizToggle={(enabled) => updateForm({ is_quiz: enabled })}
        timeLimit={form.time_limit_minutes}
        onTimeLimitChange={(minutes) => updateForm({ time_limit_minutes: minutes })}
        passingScore={form.passing_score}
        onPassingScoreChange={(score) => updateForm({ passing_score: score })}
        showResults={form.show_results}
        onShowResultsChange={(show) => updateForm({ show_results: show })}
        allowRetake={form.allow_retake}
        onAllowRetakeChange={(allow) => updateForm({ allow_retake: allow })}
        autoSave={form.auto_save_enabled}
        onAutoSaveChange={(enabled) => updateForm({ auto_save_enabled: enabled })}
        usePercentageCriteria={form.use_percentage_criteria}
        onUsePercentageCriteriaChange={(value) => updateForm({ use_percentage_criteria: value })}
        useMcqCriteria={form.use_mcq_criteria}
        onUseMcqCriteriaChange={(value) => updateForm({ use_mcq_criteria: value })}
        minCorrectMcqs={form.min_correct_mcqs}
        onMinCorrectMcqsChange={(count) => updateForm({ min_correct_mcqs: count })}
        totalMcqs={totalMcqs}
      />
    </div>
  );
}
