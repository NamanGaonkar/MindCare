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
  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", bounce: 0.4, duration: 0.8 },
    },
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.5 }}
          variants={cardVariants}
        >
          <Card className="h-full">
            <CardHeader className="flex items-center gap-4">
              <feature.icon className="h-8 w-8 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default FeatureCards;
