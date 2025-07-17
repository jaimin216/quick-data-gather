
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Sparkles, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateForm: () => void;
  onUseTemplate: () => void;
  title?: string;
  description?: string;
  showTemplateButton?: boolean;
}

export function EmptyState({ 
  onCreateForm, 
  onUseTemplate, 
  title = "No forms yet — get started! 🚀",
  description = "Create your first form or choose from our premium templates to get started quickly.",
  showTemplateButton = true
}: EmptyStateProps) {
  return (
    <div className="flex justify-center py-16">
      <Card className="max-w-md w-full bg-gradient-to-br from-background via-background to-accent/5 border-dashed border-2 border-border/50 hover:border-border transition-colors">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {title}
            </h3>
            <p className="text-muted-foreground">
              {description}
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={onCreateForm}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Form
            </Button>
            
            {showTemplateButton && (
              <Button 
                variant="outline" 
                onClick={onUseTemplate}
                className="w-full hover:bg-accent hover:border-primary/50 transition-all duration-200"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Browse Templates
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
