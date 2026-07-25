"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Shield,
  Activity,
  Pill,
  Calendar,
  Bell,
  AlertTriangle,
  Phone,
  Mail,
} from "lucide-react";

const faqs = [
  {
    icon: MessageSquare,
    title: "AI Companion",
    items: [
      "Chat with the AI for general health questions and mental wellness support.",
      "The AI is not a substitute for professional medical advice.",
      "It can help you prepare for doctor visits and understand symptoms.",
    ],
  },
  {
    icon: Activity,
    title: "Mood & Journal",
    items: [
      "Log your mood daily to track emotional patterns over time.",
      "Add optional journal notes to capture context around your feelings.",
      "View your mood history chart and statistics.",
    ],
  },
  {
    icon: Pill,
    title: "Medications",
    items: [
      "Add your medications and set dosage schedules.",
      "Mark medications as taken when you complete each dose.",
      "Get reminders about upcoming medication times.",
    ],
  },
  {
    icon: Calendar,
    title: "Appointments",
    items: [
      "Book new appointments with available providers.",
      "View your upcoming appointments.",
      "Cancel appointments if plans change.",
    ],
  },
  {
    icon: Shield,
    title: "Crisis & Emergency",
    items: [
      "Access immediate crisis resources including the 988 Suicide & Crisis Lifeline.",
      "Build a personalized safety plan with coping strategies.",
      "Emergency SOS is always available with one tap.",
    ],
  },
  {
    icon: Bell,
    title: "Notifications",
    items: [
      "Receive medication and appointment reminders.",
      "Stay updated with health tips and care plan updates.",
      "Manage notification preferences in Settings.",
    ],
  },
];

const emergencyContacts = [
  { label: "988 Suicide & Crisis Lifeline", value: "988 (call or text)" },
  { label: "Crisis Text Line", value: "Text HOME to 741741" },
  { label: "Emergency Services", value: "911" },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">
          Learn how to use CareCompass features.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {faqs.map((faq) => (
          <Card key={faq.title}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <faq.icon className="h-4 w-4 text-primary" />
                {faq.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {faq.items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium">{contact.label}</span>
                <Badge variant="destructive">{contact.value}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Phone className="h-4 w-4 text-primary" />
            Need More Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <Mail className="mr-1 inline h-3 w-3" /> Email us at{" "}
            <a
              href="mailto:support@carecompass.health"
              className="text-primary underline"
            >
              support@carecompass.health
            </a>
          </p>
          <p>
            CareCompass is a decision-support tool, not a medical provider.
            Always consult a licensed healthcare professional for medical
            decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
