
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  FlaskConical,
  Star,
  TrendingUp
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Form = Tables<'forms'> & {
  is_quiz?: boolean;
  question_count?: number;
  response_count?: number;
};

interface PremiumFormCardProps {
  form: Form;
  onDelete: (formId: string) => void;
  onStatusChange?: () => void;
}

export function PremiumFormCard({ form, onDelete, onStatusChange }: PremiumFormCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
  const isPopular = (form.response_count || 0) > 10;

  return (
    <Card 
      className={`group relative overflow-hidden transition-all duration-300 ease-out cursor-pointer 
        hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] 
        bg-gradient-to-br from-background via-background to-background/50
        backdrop-blur-sm border-border/50 hover:border-border
        ${isExam 
          ? "hover:shadow-purple-500/20 hover:border-purple-300/50" 
          : "hover:shadow-blue-500/20 hover:border-blue-300/50"
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Trending Badge */}
      {isPopular && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white gap-1 animate-pulse">
            <TrendingUp className="h-3 w-3" />
            🔥 Popular
          </Badge>
        </div>
      )}

      {/* Glassmorphism overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
        isExam ? "from-purple-500/5" : "from-blue-500/5"
      }`} />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl ${
                isExam 
                  ? "bg-purple-100 text-purple-700 group-hover:bg-purple-200" 
                  : "bg-blue-100 text-blue-700 group-hover:bg-blue-200"
              } transition-colors`}>
                {isExam ? (
                  <FlaskConical className="h-5 w-5" />
                ) : (
                  <FileText className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {form.title}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge 
                    variant={getStatusVariant(form.status)}
                    className="capitalize text-xs font-medium"
                  >
                    {form.status}
                  </Badge>
                  {isExam && (
                    <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50">
                      🧪 Exam
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 w-8 p-0 transition-all duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                } group-hover:opacity-100 hover:bg-background/80 hover:scale-110`}
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
                      Analytics
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
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
            {form.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 gap-4">
          <div className="flex items-center space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(form.created_at)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Created on {formatDate(form.created_at)}</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {form.question_count || 0}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{form.question_count || 0} questions</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {form.response_count || 0}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{form.response_count || 0} responses</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            asChild 
            className="flex-1 hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105"
          >
            <Link to={`/forms/${form.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
          
          {form.status === 'published' && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" asChild className="hover:scale-105 transition-transform">
                    <Link to={`/forms/${form.id}/view`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview form</p>
                </TooltipContent>
              </Tooltip>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" className="hover:scale-105 transition-transform">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share & QR Code</p>
                    </TooltipContent>
                  </Tooltip>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share "{form.title}"</DialogTitle>
                  </DialogHeader>
                  <FormShare formId={form.id} formTitle={form.title} />
                </DialogContent>
              </Dialog>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" asChild className="hover:scale-105 transition-transform">
                    <Link to={`/forms/${form.id}/responses`}>
                      <BarChart3 className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View analytics</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
