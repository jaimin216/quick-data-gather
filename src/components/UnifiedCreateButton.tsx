
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, FileText, FlaskConical, ChevronDown } from 'lucide-react';

interface UnifiedCreateButtonProps {
  onUseTemplate?: () => void;
}

export function UnifiedCreateButton({ onUseTemplate }: UnifiedCreateButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create New</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link to="/forms/new" className="flex items-center w-full">
            <FileText className="h-4 w-4 mr-2" />
            <span>📝 New Form</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/forms/new?type=exam" className="flex items-center w-full">
            <FlaskConical className="h-4 w-4 mr-2" />
            <span>🧪 New Exam</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/templates" className="flex items-center w-full">
            ✨ Browse Templates
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
