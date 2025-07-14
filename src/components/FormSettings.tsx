
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Check, X } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  allow_anonymous: boolean;
  collect_email: boolean;
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
    <Card className="rounded-lg shadow-md bg-gray-50 relative">
      <CardContent className="p-4">
        <div className="absolute top-4 right-4">
          <Button 
            onClick={onSave} 
            disabled={saving}
            size="sm"
            className="flex items-center space-x-2"
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
              placeholder="Form Title"
              className="text-2xl font-bold bg-transparent border-none outline-none focus:ring-0 w-full placeholder-gray-400"
            />
          </div>
          
          <div>
            <textarea
              value={form.description}
              onChange={handleDescriptionChange}
              placeholder="Form Description (Optional)"
              className="text-gray-600 bg-transparent border-none outline-none focus:ring-0 w-full resize-none placeholder-gray-400"
              rows={2}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allow_anonymous"
                checked={form.allow_anonymous}
                onCheckedChange={(checked) => onFormChange({ ...form, allow_anonymous: !!checked })}
              />
              <Label htmlFor="allow_anonymous" className="text-sm">Allow anonymous responses</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="collect_email"
                checked={form.collect_email}
                onCheckedChange={(checked) => onFormChange({ ...form, collect_email: !!checked })}
              />
              <Label htmlFor="collect_email" className="text-sm">Collect email addresses</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
