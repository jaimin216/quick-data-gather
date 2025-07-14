
import { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { FormTemplateSelector } from '@/components/FormTemplateSelector';
import { DashboardFilters } from '@/components/DashboardFilters';
import { EmptyDashboard } from '@/components/EmptyDashboard';
import { UnifiedCreateButton } from '@/components/UnifiedCreateButton';
import { SectionedFormDisplay } from '@/components/SectionedFormDisplay';
import type { Tables } from '@/integrations/supabase/types';

type Form = Tables<'forms'> & {
  is_quiz?: boolean;
  question_count?: number;
  response_count?: number;
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [formsLoading, setFormsLoading] = useState(true);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  
  // Filter states with enhanced options
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // all, form, exam
  const [sortBy, setSortBy] = useState('created_desc');

  useEffect(() => {
    if (user) {
      fetchForms();
    }
  }, [user]);

  const fetchForms = async () => {
    try {
      // Fetch forms with question count
      const { data: formsData, error: formsError } = await supabase
        .from('forms')
        .select(`
          *,
          questions(count)
        `)
        .order('created_at', { ascending: false });

      if (formsError) throw formsError;

      // Transform the data to include question_count
      const formsWithCounts = formsData?.map(form => ({
        ...form,
        question_count: form.questions?.[0]?.count || 0,
        response_count: 0, // TODO: Add response count query
        is_quiz: false // TODO: Add quiz detection logic
      })) || [];

      setForms(formsWithCounts);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast({
        title: "Error",
        description: "Failed to load forms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormsLoading(false);
    }
  };

  const handleDeleteForm = (formId: string) => {
    setForms(forms.filter(form => form.id !== formId));
  };

  const handleTemplateSelect = (template: any) => {
    setTemplateSelectorOpen(false);
    const templateData = encodeURIComponent(JSON.stringify(template));
    window.location.href = `/forms/new?template=${templateData}`;
  };

  // Enhanced filter and sort logic
  const filteredAndSortedForms = useMemo(() => {
    let filtered = forms;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(form =>
        form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (form.description && form.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(form => form.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter === 'form') {
      filtered = filtered.filter(form => !form.is_quiz);
    } else if (typeFilter === 'exam') {
      filtered = filtered.filter(form => form.is_quiz);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'updated_desc':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'responses_desc':
          return (b.response_count || 0) - (a.response_count || 0);
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [forms, searchQuery, statusFilter, typeFilter, sortBy]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || typeFilter !== 'all' || sortBy !== 'created_desc';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setSortBy('created_desc');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your forms and exams, view responses and analytics
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => setTemplateSelectorOpen(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Use Template</span>
          </Button>
          <UnifiedCreateButton onUseTemplate={() => setTemplateSelectorOpen(true)} />
        </div>
      </div>

      {formsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : forms.length === 0 ? (
        <EmptyDashboard onUseTemplate={() => setTemplateSelectorOpen(true)} />
      ) : (
        <>
          <DashboardFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />

          {filteredAndSortedForms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No forms match your current filters.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <SectionedFormDisplay 
              forms={filteredAndSortedForms}
              onDelete={handleDeleteForm}
            />
          )}
        </>
      )}

      <FormTemplateSelector
        open={templateSelectorOpen}
        onOpenChange={setTemplateSelectorOpen}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  );
}
