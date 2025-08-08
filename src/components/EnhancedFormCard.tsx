
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { 
  Eye, 
  Edit, 
  Trash2, 
  QrCode, 
  BarChart3, 
  Copy,
  Calendar,
  Users,
  MessageSquare,
  MoreHorizontal,
  FileText,
  FlaskConical
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { FormShare } from '@/components/FormShare';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Form = Tables<'forms'> & {
  is_quiz?: boolean;
  question_count?: number;
  response_count?: number;
};

interface EnhancedFormCardProps {
  form: Form;
  onDelete: (formId: string) => void;
  onStatusChange?: () => void;
}

export function EnhancedFormCard({ form, onDelete, onStatusChange }: EnhancedFormCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', form.id);

      if (error) throw error;

      onDelete(form.id);
      toast({
        title: "Success",
        description: "Form deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting form:', error);
      toast({
        title: "Error",
        description: "Failed to delete form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const copyFormLink = () => {
    const url = `${window.location.origin}/forms/${form.id}/view`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Form link copied to clipboard.",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'closed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isExam = form.is_quiz || false;
  const cardBorderClass = isExam 
    ? "border-purple-200 hover:border-purple-300 bg-gradient-to-br from-purple-50/50 to-transparent" 
    : "border-blue-200 hover:border-blue-300 bg-gradient-to-br from-blue-50/50 to-transparent";

  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${cardBorderClass}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {isExam ? (
                <FlaskConical className="h-4 w-4 text-purple-600" />
              ) : (
                <FileText className="h-4 w-4 text-blue-600" />
              )}
              <span className="text-lg font-semibold text-foreground line-clamp-1">
                {form.title}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge 
                variant={getStatusVariant(form.status)}
                className="capitalize text-xs font-medium"
              >
                {form.status}
              </Badge>
              {isExam && (
                <Badge variant="outline" className="text-purple-600 border-purple-300">
                  🧪 Quiz Mode
                </Badge>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to={`/forms/${form.id}/edit`} className="flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit {isExam ? 'Exam' : 'Form'}
                </Link>
              </DropdownMenuItem>
              {form.status === 'published' && (
                <>
                  <DropdownMenuItem asChild>
                    <Link to={`/forms/${form.id}/view`} className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/forms/${form.id}/responses`} className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Results
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyFormLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {form.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {form.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(form.created_at)}
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {form.question_count || 0} questions
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {form.response_count || 0} responses
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" asChild className="flex-1">
            <Link to={`/forms/${form.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
          
          {form.status === 'published' && (
            <>
              <Button size="sm" variant="outline" asChild>
                <Link to={`/forms/${form.id}/view`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm sm:max-w-md p-0 sm:p-4">
                  <DialogHeader className="pb-0">
                    <DialogTitle>Share "{form.title}"</DialogTitle>
                    <DialogDescription className="text-xs">Copy the link or share the QR code.</DialogDescription>
                  </DialogHeader>
                  <FormShare formId={form.id} formTitle={form.title} />
                </DialogContent>
              </Dialog>

              <Button size="sm" variant="outline" asChild>
                <Link to={`/forms/${form.id}/responses`}>
                  <BarChart3 className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
