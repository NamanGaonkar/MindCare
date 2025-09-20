import { ArrowRight, Book, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section
          className="relative bg-cover bg-center py-20"
          style={{ backgroundImage: "url('/src/assets/mint-wave.png')" }}
        >
          <div className="relative container mx-auto px-4 text-center">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Your mental wellness matters
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground">
              A Safe Space for <span className="text-primary">Student Wellbeing</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-foreground">
              Connect with support, access resources, and prioritize your mental health in a stigma-free environment designed just for students.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Chat Support <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-primary text-primary hover:bg-primary/5">
                <Book className="mr-2 h-5 w-5" /> Book Appointment
              </Button>
            </div>
          </div>
          <div className="relative container mx-auto px-4 pt-24 pb-12">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center text-foreground">
                <div className="bg-primary/10 rounded-full p-5">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-5 text-2xl font-bold">Confidential</h3>
                <p className="mt-3">Your privacy is our priority.</p>
              </div>
              <div className="flex flex-col items-center text-center text-foreground">
                <div className="bg-primary/10 rounded-full p-5">
                  <MessageCircle className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-5 text-2xl font-bold">24/7 Support</h3>
                <p className="mt-3">Available whenever you need us.</p>
              </div>
              <div className="flex flex-col items-center text-center text-foreground">
                <div className="bg-primary/10 rounded-full p-5">
                  <Book className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-5 text-2xl font-bold">Professional Care</h3>
                <p className="mt-3">Licensed counselors ready to help.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
