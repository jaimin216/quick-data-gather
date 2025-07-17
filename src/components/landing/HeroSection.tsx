
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";

interface HeroSectionProps {
  user: any;
}

export const HeroSection = ({ user }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full opacity-20 animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full opacity-20 animate-pulse delay-2000" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-lg">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">No-Code Form Builder</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Build Beautiful Forms
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              in Minutes
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create stunning forms, collect responses effortlessly, and analyze data with our powerful drag-and-drop builder. 
            No coding required.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
                <Link to="/forms/new">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-4 border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 hover:scale-105"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Create New Form
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-4 border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 hover:scale-105"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    See Live Demo
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Trust Indicators */}
          <div className="pt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">Trusted by teams worldwide</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">Microsoft</div>
              <div className="text-2xl font-bold text-gray-400">Stripe</div>
              <div className="text-2xl font-bold text-gray-400">Shopify</div>
              <div className="text-2xl font-bold text-gray-400">Airbnb</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
