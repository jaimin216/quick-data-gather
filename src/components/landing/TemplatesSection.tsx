
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, MessageSquare, GraduationCap, Heart, Briefcase } from "lucide-react";

const templates = [
  {
    icon: FileText,
    title: "Contact Form",
    description: "Simple contact form with name, email, and message fields",
    category: "Business",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    icon: Users,
    title: "Event Registration",
    description: "Collect attendee information for events and workshops",
    category: "Events",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    icon: MessageSquare,
    title: "Customer Feedback",
    description: "Gather valuable feedback from your customers",
    category: "Business",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    icon: GraduationCap,
    title: "Quiz Template",
    description: "Create engaging quizzes with automatic grading",
    category: "Education",
    gradient: "from-orange-500 to-red-600"
  },
  {
    icon: Heart,
    title: "Survey Form",
    description: "Comprehensive survey with multiple question types",
    category: "Research",
    gradient: "from-teal-500 to-cyan-600"
  },
  {
    icon: Briefcase,
    title: "Job Application",
    description: "Professional job application form with file uploads",
    category: "HR",
    gradient: "from-violet-500 to-purple-600"
  }
];

export const TemplatesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Start with a
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              template
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our professionally designed templates or start from scratch. All templates are fully customizable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <template.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {template.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed mb-4">
                  {template.description}
                </CardDescription>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-colors duration-200"
                >
                  Use Template
                </Button>
              </CardContent>
              
              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
