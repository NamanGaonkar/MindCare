import { CheckCircle, Clock, Users, Phone } from "lucide-react";

const bookingOptions = [
  {
    title: "Campus Counseling",
    description: "Meet with licensed counselors at the campus wellness center.",
    icon: <Users className="h-8 w-8 text-primary" />,
    features: [
      "Completely confidential",
      "Flexible scheduling",
      "Individual or group sessions",
    ],
  },
  {
    title: "Crisis Support",
    description: "Immediate support for urgent mental health situations.",
    icon: <Phone className="h-8 w-8 text-destructive" />,
    features: [
      "Available 24/7",
      "Emergency intervention",
      "Trained crisis counselors",
    ],
  },
  {
    title: "Group Therapy",
    description: "Join supportive group sessions with other students.",
    icon: <Users className="h-8 w-8 text-blue-500" />,
    features: [
      "Peer support groups",
      "Weekly sessions",
      "Safe, moderated environment",
    ],
  },
];

const BookingOptions = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {bookingOptions.map((option, index) => (
        <div key={index} className="transparent-card rounded-lg p-6 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            {option.icon}
            <h3 className="text-2xl font-bold text-foreground">{option.title}</h3>
          </div>
          <p className="text-muted-foreground mb-6 flex-grow">{option.description}</p>
          <ul className="space-y-3">
            {option.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BookingOptions;
