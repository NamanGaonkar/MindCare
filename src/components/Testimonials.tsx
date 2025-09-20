import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya S.",
    role: "Computer Science Student",
    content: "The AI chatbot helped me through my exam anxiety. Having 24/7 support made all the difference.",
    rating: 5
  },
  {
    name: "Rahul M.",
    role: "Engineering Student",
    content: "Booking a counselor was so easy, and the peer support forum helped me realize I'm not alone.",
    rating: 5
  },
  {
    name: "Ananya K.",
    role: "Medical Student",
    content: "The resources section has amazing articles on stress management. This platform is a lifesaver!",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default Testimonials;