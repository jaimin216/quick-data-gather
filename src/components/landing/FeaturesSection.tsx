
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MousePointer, 
  BarChart3, 
  GraduationCap, 
  Sparkles, 
  Shield, 
  Zap, 
  Globe, 
  Users 
} from "lucide-react";

const features = [
  {
    icon: MousePointer,
    title: "Drag & Drop Builder",
    description: "Create forms visually with our intuitive drag-and-drop interface. No coding skills required.",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track responses, view analytics, and export data with powerful insights dashboard.",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    icon: GraduationCap,
    title: "Quiz & Grading System",
    description: "Create interactive quizzes with automatic grading and detailed performance reports.",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    icon: Sparkles,
    title: "AI Form Generation",
    description: "Generate forms instantly with AI. Describe what you need and watch it come to life.",
    gradient: "from-orange-500 to-red-600"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with end-to-end encryption and GDPR compliance.",
    gradient: "from-teal-500 to-cyan-600"
  },
  {
    icon: Globe,
    title: "Global Distribution",
    description: "Share forms anywhere with custom domains and embedded widgets.",
    gradient: "from-violet-500 to-purple-600"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to create
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              amazing forms
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From simple contact forms to complex surveys and quizzes, our platform provides all the tools you need to collect, analyze, and act on your data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
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
