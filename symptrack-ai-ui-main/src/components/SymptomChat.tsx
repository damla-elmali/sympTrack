import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChatEntry {
  id: number;
  date: string;
  disease: string;
  risk: "High Risk" | "Low Risk" | "Neutral";
  symptoms: string;
}

interface Message {
  id: number;
  type: "user" | "bot";
  message: string;
}

const SymptomChat = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      message: "Hello! I'm here to help you analyze your symptoms. Please describe how you're feeling today."
    }
  ]);
  const [pastEntries, setPastEntries] = useState<ChatEntry[]>([
    { id: 1, date: "Yesterday", disease: "Tension Headache", risk: "Low Risk", symptoms: "Headache, Fatigue" },
    { id: 2, date: "2 days ago", disease: "Common Cold", risk: "Low Risk", symptoms: "Sore throat, Runny nose" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: conversation.length + 1,
      type: "user",
      message: message.trim()
    };

    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);
    const currentMessage = message.trim();
    setMessage("");

    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: { symptoms: currentMessage }
      });

      if (error) {
        throw error;
      }

      if (!data || data.error) {
        throw new Error(data?.error || 'Failed to analyze symptoms');
      }

      const { disease, risk, analysis } = data;

      const botMessage: Message = {
        id: conversation.length + 2,
        type: "bot",
        message: analysis
      };

      setConversation(prev => [...prev, botMessage]);

      // Add to past entries
      const newEntry: ChatEntry = {
        id: pastEntries.length + 1,
        date: "Today",
        disease,
        risk,
        symptoms: currentMessage
      };

      setPastEntries(prev => [newEntry, ...prev]);

      toast({
        title: "Analysis Complete",
        description: `Condition: ${disease} - Risk Level: ${risk}`,
      });

    } catch (error) {
      console.error("Error calling analyze-symptoms function:", error);
      
      let errorMessage = "Failed to analyze symptoms. Please try again.";
      
      if (error.message?.includes('not configured')) {
        errorMessage = "Please add your Gemini API key in the project settings to enable AI analysis.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low Risk":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "High Risk":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      case "Neutral":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Past Entries */}
      <div className="w-80 bg-card/50 border-r border-border/50 p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          Past Entries
        </h2>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="space-y-3">
            {pastEntries.map((entry) => (
              <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-border/50 rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-foreground">{entry.date}</span>
                    <span className={`px-2 py-1 text-xs rounded-lg border ${getRiskColor(entry.risk)}`}>
                      {entry.risk}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">{entry.disease}</p>
                  <p className="text-sm text-muted-foreground">{entry.symptoms}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card/50 border-b border-border/50 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">{today}</h1>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Bot className="h-5 w-5 text-primary" />
              <span className="text-sm">AI Assistant Active</span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {conversation.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start space-x-3 max-w-2xl ${msg.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                  <div className={`p-2 rounded-2xl ${msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    {msg.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm ${msg.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-card border border-border/50"}`}>
                    <p className={`text-sm leading-relaxed ${msg.type === "user" ? "text-primary-foreground" : "text-foreground"} whitespace-pre-wrap`}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-2xl">
                  <div className="p-2 rounded-2xl bg-secondary text-secondary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="p-4 rounded-2xl shadow-sm bg-card border border-border/50">
                    <p className="text-sm leading-relaxed text-foreground">Analyzing your symptoms...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-card/50 border-t border-border/50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your symptoms..."
                className="flex-1 rounded-2xl border-border/50 bg-input focus:ring-primary"
                onKeyPress={(e) => e.key === "Enter" && !isLoading && message.trim() && sendMessage()}
                disabled={isLoading}
              />
              <Button 
                onClick={sendMessage}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6"
                disabled={!message.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChat;