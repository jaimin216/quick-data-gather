
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkles, FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyDashboardProps {
  onUseTemplate: () => void;
}

export function EmptyDashboard({ onUseTemplate }: EmptyDashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="max-w-2xl w-full text-center border-dashed border-2 border-border">
        <CardContent className="py-12 px-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            No forms yet? Let's get started! 🚀
          </h3>
          
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Create your first form to start collecting responses from your audience. 
            Choose from our templates or build from scratch.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              onClick={onUseTemplate}
              variant="outline"
              size="lg"
              className="flex items-center space-x-2 min-w-40"
            >
              <Sparkles className="h-5 w-5" />
              <span>Use Template</span>
            </Button>
            
            <Link to="/forms/new">
              <Button size="lg" className="flex items-center space-x-2 min-w-40">
                <Plus className="h-5 w-5" />
                <span>Create Blank Form</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-foreground">Easy Builder</h4>
                <p className="text-xs text-muted-foreground">Drag & drop questions</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-foreground">Share Easily</h4>
                <p className="text-xs text-muted-foreground">Links & QR codes</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-foreground">View Results</h4>
                <p className="text-xs text-muted-foreground">Real-time analytics</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
