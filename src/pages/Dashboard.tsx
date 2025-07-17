
import { useEffect, useState, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { FormTemplateSelector } from '@/components/FormTemplateSelector';
import { DashboardFilters } from '@/components/DashboardFilters';
import { UnifiedCreateButton } from '@/components/UnifiedCreateButton';
import { SectionedFormDisplay } from '@/components/SectionedFormDisplay';
import { PersonalizedHeader } from '@/components/PersonalizedHeader';
import { AnalyticsSummary } from '@/components/AnalyticsSummary';
import { ActiveFilters } from '@/components/ActiveFilters';
import { EmptyState } from '@/components/EmptyState';
import type { Tables } from '@/integrations/supabase/types';

type Form = Tables<'forms'> & {
  is_quiz?: boolean;
  question_count?: number;
  response_count?: number;
};

export default function Dashboard() {
  const navigate = useNavigate();
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
        response_count: Math.floor(Math.random() * 50), // TODO: Add actual response count query
        is_quiz: form.is_quiz || false
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

  const handleCreateForm = () => {
    navigate('/forms/new');
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

  // Calculate analytics
  const totalResponses = forms.reduce((acc, form) => acc + (form.response_count || 0), 0);
  const avgCompletionRate = forms.length > 0 ? Math.round(
    forms.reduce((acc, form) => acc + ((form.response_count || 0) / Math.max(form.question_count || 1, 1)), 0) / forms.length * 100
  ) : 0;

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PersonalizedHeader 
          totalForms={forms.length}
          totalResponses={totalResponses}
        />

        {formsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : forms.length === 0 ? (
          <EmptyState 
            onCreateForm={handleCreateForm}
            onUseTemplate={() => setTemplateSelectorOpen(true)}
          />
        ) : (
          <>
            <AnalyticsSummary 
              totalForms={forms.length}
              totalResponses={totalResponses}
              avgCompletionRate={avgCompletionRate}
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-foreground">Your Forms & Exams</h2>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => setTemplateSelectorOpen(true)}
                  variant="outline"
                  className="flex items-center space-x-2 hover:bg-accent hover:scale-105 transition-all duration-200"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Templates</span>
                </Button>
                <UnifiedCreateButton onUseTemplate={() => setTemplateSelectorOpen(true)} />
              </div>
            </div>

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

            <ActiveFilters
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              typeFilter={typeFilter}
              sortBy={sortBy}
              onClearSearch={() => setSearchQuery('')}
              onClearStatus={() => setStatusFilter('all')}
              onClearType={() => setTypeFilter('all')}
              onClearSort={() => setSortBy('created_desc')}
              onClearAll={clearFilters}
            />

            {filteredAndSortedForms.length === 0 ? (
              <EmptyState 
                onCreateForm={handleCreateForm}
                onUseTemplate={() => setTemplateSelectorOpen(true)}
                title="No forms match your filters"
                description="Try adjusting your search criteria or clear all filters to see your forms."
                showTemplateButton={false}
              />
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
    </div>
  );
}
