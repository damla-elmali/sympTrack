import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, Stethoscope, Calendar } from "lucide-react";

const SummaryPage = () => {
  // Mock data
  const summaryData = {
    riskLevel: "Low",
    aiSummary: "Based on your symptoms today, you appear to be experiencing mild tension-related discomfort. Your headache and fatigue symptoms are consistent with stress or dehydration.",
    suggestion: "It is recommended to ensure adequate hydration, take regular breaks, and consider stress management techniques. If symptoms persist or worsen, consult a healthcare professional."
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return {
          bg: "bg-risk-low/10",
          text: "text-risk-low",
          border: "border-risk-low/30",
          icon: "text-risk-low"
        };
      case "medium":
        return {
          bg: "bg-risk-medium/10",
          text: "text-risk-medium",
          border: "border-risk-medium/30",
          icon: "text-risk-medium"
        };
      case "high":
        return {
          bg: "bg-risk-high/10",
          text: "text-risk-high",
          border: "border-risk-high/30",
          icon: "text-risk-high"
        };
      default:
        return {
          bg: "bg-muted",
          text: "text-muted-foreground",
          border: "border-border",
          icon: "text-muted-foreground"
        };
    }
  };

  const riskColors = getRiskColor(summaryData.riskLevel);
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/50 border-b border-border/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Today's Health Summary</h1>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{today}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last updated</p>
              <p className="font-medium text-foreground">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 max-w-4xl mx-auto">
          
          {/* Risk Level Card */}
          <Card className={`${riskColors.bg} border-2 ${riskColors.border} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                  <TrendingDown className={`mr-3 h-6 w-6 ${riskColors.icon}`} />
                  Risk Level Assessment
                </CardTitle>
                <Badge className={`${riskColors.bg} ${riskColors.text} border ${riskColors.border} px-4 py-2 text-sm font-medium rounded-xl`}>
                  {summaryData.riskLevel} Risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Your current symptoms indicate a <strong className={riskColors.text}>{summaryData.riskLevel.toLowerCase()} risk level</strong>. 
                Continue monitoring your symptoms and follow the recommendations below.
              </p>
            </CardContent>
          </Card>

          {/* AI Summary Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/10 border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                <AlertTriangle className="mr-3 h-6 w-6 text-primary" />
                AI Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-card/60 rounded-xl p-6 border border-border/30">
                <p className="text-foreground leading-relaxed">
                  {summaryData.aiSummary}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Suggestion Card */}
          <Card className="bg-gradient-to-br from-secondary/10 to-accent/5 border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                <Stethoscope className="mr-3 h-6 w-6 text-primary" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-card/60 rounded-xl p-6 border border-border/30">
                <p className="text-foreground leading-relaxed mb-4">
                  {summaryData.suggestion}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground rounded-lg px-3 py-1">
                    Hydration
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground rounded-lg px-3 py-1">
                    Rest
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground rounded-lg px-3 py-1">
                    Stress Management
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-8">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-2xl font-medium shadow-md hover:shadow-lg transition-all duration-200">
              Update Symptoms
            </button>
            <button className="bg-card hover:bg-card/80 text-foreground border border-border/50 px-8 py-3 rounded-2xl font-medium shadow-md hover:shadow-lg transition-all duration-200">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;