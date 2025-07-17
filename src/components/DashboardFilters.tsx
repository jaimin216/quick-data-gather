
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X, ArrowUpDown, FileText, FlaskConical } from 'lucide-react';

interface DashboardFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  typeFilter: string;
  onTypeChange: (type: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function DashboardFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  sortBy,
  onSortChange,
  onClearFilters,
  hasActiveFilters
}: DashboardFiltersProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search forms and exams..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-border/50 focus:border-primary transition-all duration-200 bg-background/50"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={onTypeChange}>
              <SelectTrigger className="w-36 border-border/50 hover:border-primary transition-colors bg-background/50">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="form">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Forms
                  </div>
                </SelectItem>
                <SelectItem value="exam">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4" />
                    Exams
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="w-36 border-border/50 hover:border-primary transition-colors bg-background/50">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-48 border-border/50 hover:border-primary transition-colors bg-background/50">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_desc">Newest First</SelectItem>
                <SelectItem value="created_asc">Oldest First</SelectItem>
                <SelectItem value="updated_desc">Recently Updated</SelectItem>
                <SelectItem value="responses_desc">Most Responses</SelectItem>
                <SelectItem value="title_asc">Title A-Z</SelectItem>
                <SelectItem value="title_desc">Title Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 hover:scale-105"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
