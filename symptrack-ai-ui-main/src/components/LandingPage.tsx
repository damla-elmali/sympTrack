import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Stethoscope, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Instant Risk Analysis",
      description: "AI-powered assessment of your symptoms to identify potential health risks instantly."
    },
    {
      icon: <Stethoscope className="h-8 w-8 text-primary" />,
      title: "Smart Suggestions",
      description: "Personalized recommendations based on your symptoms and health history."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Symptom Journal",
      description: "Track your health journey with intelligent logging and pattern recognition."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">SympTrack</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary"
                onClick={() => navigate('/auth')}
              >
                Login
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
                onClick={() => navigate('/auth')}
              >
                Register
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6">
        <div className="py-20 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            AI-Powered Symptom Tracking
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            An intelligent assistant that takes your health seriously
          </p>
          <Button 
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-6 text-lg rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/auth')}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-secondary/50 rounded-2xl">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;