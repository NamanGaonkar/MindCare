import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Users, MessageSquare, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: BrainCircuit, title: "AI Chatbot", description: "Instant, anonymous support for your mental wellness journey." },
  { icon: Users, title: "Peer Support", description: "Connect with a community that understands and shares your experiences." },
  { icon: MessageSquare, title: "Counselor Booking", description: "Schedule confidential appointments with licensed counselors." },
  { icon: BookOpen, title: "Resources", description: "Access a curated library of articles, guides, and self-help tools." },
];

const FeatureCards = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <CardHeader className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors"
              >
                <feature.icon className="h-8 w-8 text-primary" />
              </motion.div>
              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default FeatureCards;
