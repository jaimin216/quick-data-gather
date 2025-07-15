
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Settings } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  allow_anonymous: boolean;
  collect_email: boolean;
  custom_thank_you_message?: string;
  passing_feedback?: string;
  failing_feedback?: string;
}

interface FormSettingsDrawerProps {
  form: FormData;
  onFormChange: (form: FormData) => void;
  isQuiz: boolean;
}

export default function FormSettingsDrawer({ form, onFormChange, isQuiz }: FormSettingsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-2 border-muted">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Form Settings</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <h3 className="font-medium">Basic Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Feedback Messages */}
            <div className="space-y-4">
              <h3 className="font-medium">Feedback Messages</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="thank_you_message" className="text-sm">Thank You Message</Label>
                  <Textarea
                    id="thank_you_message"
                    value={form.custom_thank_you_message || ''}
                    onChange={(e) => onFormChange({ ...form, custom_thank_you_message: e.target.value })}
                    placeholder="Thank you for your response!"
                    rows={2}
                  />
                </div>
                
                {isQuiz && (
                  <>
                    <div>
                      <Label htmlFor="passing_feedback" className="text-sm">Passing Feedback</Label>
                      <Textarea
                        id="passing_feedback"
                        value={form.passing_feedback || ''}
                        onChange={(e) => onFormChange({ ...form, passing_feedback: e.target.value })}
                        placeholder="🎉 Congratulations! You passed the quiz!"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="failing_feedback" className="text-sm">Failing Feedback</Label>
                      <Textarea
                        id="failing_feedback"
                        value={form.failing_feedback || ''}
                        onChange={(e) => onFormChange({ ...form, failing_feedback: e.target.value })}
                        placeholder="😕 Better luck next time! Review the material and try again."
                        rows={2}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
