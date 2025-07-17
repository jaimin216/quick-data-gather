
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TemplatesSection } from "@/components/landing/TemplatesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <HeroSection user={user} />
      <FeaturesSection />
      <HowItWorksSection />
      <TemplatesSection />
      <TestimonialsSection />
      <FinalCTASection user={user} />
    </div>
  );
};

export default Index;
