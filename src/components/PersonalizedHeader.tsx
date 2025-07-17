
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, FileText } from 'lucide-react';
import { useMemo } from 'react';

interface PersonalizedHeaderProps {
  totalForms: number;
  totalResponses: number;
  onOpenProfile?: () => void;
}

export function PersonalizedHeader({ totalForms, totalResponses, onOpenProfile }: PersonalizedHeaderProps) {
  const { user, signOut } = useAuth();

  const personalizedMessage = useMemo(() => {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17) greeting = 'Good evening';
    
    return `${greeting}! You have ${totalForms} forms, ${totalResponses} responses today.`;
  }, [totalForms, totalResponses]);

  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          Welcome back!
        </h1>
        <p className="text-muted-foreground text-lg">
          {personalizedMessage}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-105 transition-transform">
              <Avatar className="h-10 w-10 ring-2 ring-background shadow-lg">
                <AvatarImage src="" alt="User avatar" />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-600/20 font-semibold">
                  {user?.email ? getUserInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{user?.email?.split('@')[0]}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onOpenProfile}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
