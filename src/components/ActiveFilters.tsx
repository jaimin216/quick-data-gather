
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, FileText, FlaskConical } from 'lucide-react';

interface ActiveFiltersProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  sortBy: string;
  onClearSearch: () => void;
  onClearStatus: () => void;
  onClearType: () => void;
  onClearSort: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  searchQuery,
  statusFilter,
  typeFilter,
  sortBy,
  onClearSearch,
  onClearStatus,
  onClearType,
  onClearSort,
  onClearAll
}: ActiveFiltersProps) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || sortBy !== 'created_desc';

  if (!hasActiveFilters) return null;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Published';
      case 'draft': return 'Draft';
      case 'closed': return 'Closed';
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'form': return (
        <div className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          Forms
        </div>
      );
      case 'exam': return (
        <div className="flex items-center gap-1">
          <FlaskConical className="h-3 w-3" />
          Exams
        </div>
      );
      default: return null;
    }
  };

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case 'created_desc': return null; // Default, don't show
      case 'created_asc': return 'Oldest First';
      case 'updated_desc': return 'Recently Updated';
      case 'responses_desc': return 'Most Responses';
      case 'title_asc': return 'Title A-Z';
      case 'title_desc': return 'Title Z-A';
      default: return null;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      
      {searchQuery && (
        <Badge variant="secondary" className="gap-2 animate-scale-in">
          Search: "{searchQuery}"
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSearch}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {getStatusLabel(statusFilter) && (
        <Badge variant="secondary" className="gap-2 animate-scale-in">
          Status: {getStatusLabel(statusFilter)}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearStatus}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {getTypeLabel(typeFilter) && (
        <Badge variant="secondary" className="gap-2 animate-scale-in">
          Type: {getTypeLabel(typeFilter)}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearType}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {getSortLabel(sortBy) && (
        <Badge variant="secondary" className="gap-2 animate-scale-in">
          Sort: {getSortLabel(sortBy)}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSort}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="text-xs"
      >
        Clear All
      </Button>
    </div>
  );
}
