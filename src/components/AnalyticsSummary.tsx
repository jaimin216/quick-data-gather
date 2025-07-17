
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, FileText, Users, Target } from 'lucide-react';

interface AnalyticsSummaryProps {
  totalForms: number;
  totalResponses: number;
  avgCompletionRate: number;
}

export function AnalyticsSummary({ 
  totalForms, 
  totalResponses, 
  avgCompletionRate 
}: AnalyticsSummaryProps) {
  const stats = [
    {
      title: 'Forms Created',
      value: totalForms,
      icon: FileText,
      change: '+12%',
      positive: true
    },
    {
      title: 'Total Responses',
      value: totalResponses,
      icon: Users,
      change: '+23%',
      positive: true
    },
    {
      title: 'Completion Rate',
      value: `${avgCompletionRate}%`,
      icon: Target,
      change: '+5%',
      positive: true
    },
    {
      title: 'This Month',
      value: Math.floor(totalResponses * 0.3),
      icon: TrendingUp,
      change: '+18%',
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="group hover:shadow-md transition-all duration-200 hover:-translate-y-1 border-border/50 bg-gradient-to-br from-background via-background to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className={`text-xs mt-1 flex items-center ${
                  stat.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
