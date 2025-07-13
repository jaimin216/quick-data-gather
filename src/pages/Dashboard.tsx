
import { useEffect, useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { FormShare } from '@/components/FormShare';
import { FormTemplateSelector } from '@/components/FormTemplateSelector';
import { FormCard } from '@/components/FormCard';
import { DashboardFilters } from '@/components/DashboardFilters';
import { EmptyDashboard } from '@/components/EmptyDashboard';
import type { Tables } from '@/integrations/supabase/types';

type Form = Tables<'forms'>;

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [formsLoading, setFormsLoading] = useState(true);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_desc');

  useEffect(() => {
    if (user) {
      fetchForms();
    }
  }, [user]);

  const fetchForms = async () => {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setForms(data || []);
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

  // Filter and sort forms
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

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'updated_desc':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [forms, searchQuery, statusFilter, sortBy]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || sortBy !== 'created_desc';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
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
          <h1 className="text-3xl font-bold text-foreground">My Forms</h1>
          <p className="text-muted-foreground mt-2">
            Manage your forms and view responses
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
          <Link to="/forms/new">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create New Form</span>
            </Button>
          </Link>
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedForms.map((form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  onDelete={handleDeleteForm}
                />
              ))}
            </div>
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
