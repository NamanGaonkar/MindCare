import { Brain, Shield, Clock, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Mental Health Chat",
    description: "24/7 intelligent conversations with our AI assistant trained specifically for student mental health support.",
    icon: <Brain className="h-8 w-8 text-primary" />,
    link: "/chat",
    buttonText: "Start Chat"
  },
  {
    title: "Privacy Guaranteed", 
    description: "Your conversations are completely confidential and secure. We prioritize your privacy above all else.",
    icon: <Shield className="h-8 w-8 text-green-500" />,
    link: "/resources",
    buttonText: "Learn More"
  },
  {
    title: "Instant Support",
    description: "Get immediate responses and support whenever you need it, day or night.",
    icon: <Clock className="h-8 w-8 text-blue-500" />,
    link: "/chat",
    buttonText: "Get Support"
  },
  {
    title: "Smart Insights",
    description: "AI-powered mood tracking and personalized insights to help you understand your mental health patterns.",
    icon: <Sparkles className="h-8 w-8 text-purple-500" />,
    link: "/dashboard",
    buttonText: "View Dashboard"
  },
];

const FeatureCards = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">AI-Powered Mental Wellness</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of mental health support with our advanced AI assistant designed specifically for students.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring", 
                bounce: 0.4, 
                duration: 0.8
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="cursor-pointer"
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 group">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors"
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col justify-between flex-1">
                  <CardDescription className="text-base mb-6 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <Button asChild className="w-full">
                    <Link to={feature.link}>{feature.buttonText}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;