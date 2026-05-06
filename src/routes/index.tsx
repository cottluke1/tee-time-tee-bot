import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Phone,
  PhoneCall,
  CalendarCheck,
  MessageSquare,
  Headphones,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Check,
  Flag,
  CircleDot,
} from "lucide-react";
import heroMockup from "@/assets/hero-mockup.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linq — Your 24/7 Tee Time Booker for the Linqs" },
      {
        name: "description",
        content:
          "Linq is an AI phone receptionist for golf courses. Answer every call, capture tee time bookings, and stop losing revenue to missed calls.",
      },
    ],
  }),
  component: Index,
});

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2 font-display text-xl tracking-tight text-ink">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
        <Flag className="h-4 w-4" />
      </span>
      <span className="font-semibold">Linq</span>
    </a>
  );
}

function Nav() {
  const links = [
    { href: "#how", label: "How It Works" },
    { href: "#integrations", label: "Integrations" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
    { href: "/demo", label: "AI Demo" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <Button asChild variant="hero" size="default" className="rounded-full">
          <a href="#demo">Book Demo</a>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="bg-hero relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 md:grid-cols-2 md:items-center md:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Your 24/7 Tee Time Booker for the Linqs
          </span>
          <h1 className="mt-6 text-5xl leading-[1.05] text-ink md:text-6xl lg:text-7xl">
            Never Miss Another <em className="not-italic text-primary">Tee Time</em> Call
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Linq is an AI-powered phone receptionist built for golf courses. It answers calls, handles common
            questions, captures booking requests, and can connect directly with your tee sheet software to help
            fill more tee times — without adding staff.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <a href="#demo">Book a Demo <ArrowRight className="h-4 w-4" /></a>
            </Button>
            <Button asChild variant="beige" size="xl" className="rounded-full">
              <a href="#how">See How It Works</a>
            </Button>
          </div>
          <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
            Built for golf courses · pro shops · country clubs · daily-fee facilities
          </p>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-secondary/60 blur-2xl" />
          <img
            src={heroMockup}
            alt="AI receptionist call interface beside a tee sheet calendar"
            width={1536}
            height={1152}
            className="rounded-3xl shadow-elegant"
          />
        </div>
      </div>
    </section>
  );
}

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  tone = "light",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tone?: "light" | "beige" | "dark";
}) {
  const toneClass =
    tone === "dark"
      ? "bg-ink text-primary-foreground"
      : tone === "beige"
        ? "bg-secondary/50"
        : "bg-background";
  const sub = tone === "dark" ? "text-primary-foreground/70" : "text-muted-foreground";
  return (
    <section id={id} className={`${toneClass} py-24`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
          )}
          <h2 className="text-4xl md:text-5xl">{title}</h2>
          {subtitle && <p className={`mt-5 text-lg ${sub}`}>{subtitle}</p>}
        </div>
        <div className="mt-16">{children}</div>
      </div>
    </section>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant">
      {Icon && (
        <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

function Problem() {
  return (
    <Section
      eyebrow="The Problem"
      title="Your Pro Shop Is Losing Revenue Every Time the Phone Rings Unanswered"
      subtitle="Golf courses miss calls during busy mornings, lunch rushes, tournaments, and after-hours. Golfers still call to ask about tee times, pricing, carts, range hours, weather delays, dress code, and cancellations. If nobody answers, they call the next course."
      tone="beige"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <Card icon={PhoneCall} title="Missed tee time calls">
          Every unanswered ring is a golfer ready to book — often heading straight to the next course on their list.
        </Card>
        <Card icon={Users} title="Staff interrupted constantly">
          Pro shop teams juggle check-ins, merchandise, and the phone all at once. Service quality suffers.
        </Card>
        <Card icon={Clock} title="Lost after-hours bookings">
          Most tee time research happens in the evening — long after the pro shop lights are off.
        </Card>
      </div>
    </Section>
  );
}

function Solution() {
  const features = [
    { icon: Phone, title: "Answers calls instantly", text: "Picks up on the first ring, every ring." },
    { icon: CalendarCheck, title: "Captures tee time requests", text: "Date, time, players, contact — every detail." },
    { icon: MessageSquare, title: "Handles FAQs", text: "Rates, hours, dress code, range, carts, lessons." },
    { icon: ShieldCheck, title: "Sends SMS confirmations", text: "Golfers get instant text confirmation." },
    { icon: Headphones, title: "Escalates to staff", text: "Routes complex calls to the right person." },
    { icon: Sparkles, title: "Tee sheet integration", text: "Optional direct booking with supported systems." },
  ];
  return (
    <Section
      eyebrow="The Solution"
      title="An AI Receptionist That Sounds Natural, Understands Golf, and Works 24/7"
      subtitle="Linq answers inbound calls, collects booking details, answers FAQs, texts confirmations, and routes complex issues to your staff."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} icon={f.icon} title={f.title}>
            {f.text}
          </Card>
        ))}
      </div>
    </Section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Golfer Calls Your Course", text: "Inbound call rings into Linq instead of going to voicemail." },
    { n: "02", title: "AI Answers Like a Trained Receptionist", text: "Natural voice. Understands golf terminology and your course details." },
    { n: "03", title: "Collects the Details", text: "Date, time, number of players, name, and phone number." },
    { n: "04", title: "Books or Sends the Request", text: "Books directly when integrated, or hands the request to staff." },
  ];
  return (
    <Section
      id="how"
      eyebrow="How It Works"
      title="How Linq Works"
      subtitle="For courses with supported booking software, Linq can check availability and book directly. For courses without integration, it captures the request and sends it to staff by text, email, or dashboard."
      tone="beige"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="relative rounded-2xl border border-border bg-card p-7 shadow-card">
            <div className="font-display text-3xl text-primary">{s.n}</div>
            <h3 className="mt-3 font-display text-lg text-ink">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Integrations() {
  const tiers = [
    {
      title: "Basic Setup",
      text: "AI answers calls, handles FAQs, and sends booking requests to staff via text, email, or dashboard.",
    },
    {
      title: "Assisted Booking",
      text: "AI checks availability from a connected calendar or staff-approved workflow before confirming.",
    },
    {
      title: "Full Integration",
      text: "AI connects with tee sheet software through an API or approved integration to book tee times directly.",
    },
  ];
  return (
    <Section
      id="integrations"
      eyebrow="Integrations"
      title="Works With Your Existing Booking Workflow"
      subtitle="Every golf course uses different tee sheet systems. Linq is designed to support multiple levels of integration."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((t, i) => (
          <div
            key={t.title}
            className="rounded-2xl border border-border bg-card p-8 shadow-card"
          >
            <div className="text-xs uppercase tracking-widest text-primary">Level {i + 1}</div>
            <h3 className="mt-2 font-display text-2xl text-ink">{t.title}</h3>
            <p className="mt-3 text-muted-foreground">{t.text}</p>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-muted-foreground">
        Designed to support golf management platforms such as <span className="text-ink">Lightspeed Golf</span>,{" "}
        <span className="text-ink">foreUP</span>, <span className="text-ink">Club Caddie</span>, and other tee sheet systems
        when API or integration access is available.
      </p>
    </Section>
  );
}

function Benefits() {
  const items = [
    { icon: TrendingUp, title: "Capture more tee time demand" },
    { icon: Users, title: "Reduce stress on pro shop staff" },
    { icon: Clock, title: "Handle after-hours calls" },
    { icon: Sparkles, title: "Improve golfer experience" },
    { icon: CalendarCheck, title: "Fill open tee times faster" },
    { icon: ShieldCheck, title: "Create a more professional phone experience" },
  ];
  return (
    <Section
      eyebrow="Benefits"
      title="Built to Increase Revenue, Not Just Answer Calls"
      tone="dark"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <div
            key={b.title}
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <b.icon className="h-5 w-5" />
            </div>
            <p className="font-display text-lg leading-snug text-primary-foreground">{b.title}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function CallFlow() {
  const turns = [
    { who: "Golfer", text: "Do you have anything open Saturday morning for four players?" },
    { who: "Linq", text: "Yes, I can help with that. Are you looking for early morning, mid-morning, or closer to noon?" },
    { who: "Golfer", text: "Around 9 if possible." },
    { who: "Linq", text: "I found available times near 9:10 and 9:30. Would you like me to reserve one?" },
    { who: "Golfer", text: "9:10 works." },
    { who: "Linq", text: "Great. Can I get your name and phone number for the reservation?" },
  ];
  return (
    <Section
      eyebrow="Example Call"
      title="A Better Phone Experience for Every Golfer"
      tone="beige"
    >
      <div className="mx-auto max-w-2xl space-y-3">
        {turns.map((t, i) => {
          const isAI = t.who === "Linq";
          return (
            <div key={i} className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-card ${
                  isAI ? "bg-primary text-primary-foreground" : "bg-card text-ink border border-border"
                }`}
              >
                <div className={`mb-1 text-[0.7rem] uppercase tracking-widest ${isAI ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {t.who}
                </div>
                <div className="text-[0.95rem] leading-relaxed">{t.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$299",
      period: "/mo",
      desc: "For courses that want calls answered and booking requests captured.",
      features: ["AI phone receptionist", "FAQ handling", "Booking request capture", "SMS / email notifications", "Staff escalation"],
    },
    {
      name: "Growth",
      price: "$799",
      period: "/mo",
      desc: "For courses that want deeper booking workflow support.",
      features: ["Everything in Starter", "Tee time request management", "Calendar / availability workflow", "Confirmation texts", "Custom call scripts", "Basic reporting"],
      featured: true,
    },
    {
      name: "Pro",
      price: "Custom",
      period: "",
      desc: "For courses that want direct tee sheet integration.",
      features: ["Everything in Growth", "API or tee sheet integration", "Direct booking when available", "Custom routing rules", "Multi-course support", "Advanced analytics"],
    },
  ];
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Simple Plans Based on Your Course's Needs"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative flex flex-col rounded-3xl border p-8 ${
              p.featured
                ? "border-primary bg-ink text-primary-foreground shadow-elegant"
                : "border-border bg-card text-ink shadow-card"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-8 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Most popular
              </span>
            )}
            <h3 className="font-display text-2xl">{p.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl">{p.price}</span>
              <span className={p.featured ? "text-primary-foreground/60" : "text-muted-foreground"}>{p.period}</span>
            </div>
            <p className={`mt-3 text-sm ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {p.desc}
            </p>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? "text-secondary" : "text-primary"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                asChild
                variant={p.featured ? "beige" : "hero"}
                className="w-full rounded-full"
                size="lg"
              >
                <a href="#demo">Schedule a Demo</a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Can the AI actually book tee times?",
      a: "Yes, if your tee sheet software supports API access or integration. If not, Linq can still answer calls, collect booking details, and send requests to your staff.",
    },
    {
      q: "Will it replace our pro shop staff?",
      a: "No. It is designed to reduce interruptions, capture missed calls, and support your staff — not replace the personal service golfers expect.",
    },
    {
      q: "Can it answer course-specific questions?",
      a: "Yes. It can be trained on your rates, hours, dress code, cart policies, range hours, membership info, event details, and more.",
    },
    {
      q: "What happens if the caller has a complicated request?",
      a: "The AI can transfer the call, take a message, or text/email staff depending on your setup.",
    },
    {
      q: "Does it work after hours?",
      a: "Yes. Linq can answer calls 24/7 and capture booking demand even when the pro shop is closed.",
    },
  ];
  return (
    <Section id="faq" eyebrow="FAQ" title="Questions, Answered" tone="beige">
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border border-border bg-card px-6 shadow-card"
            >
              <AccordionTrigger className="py-5 text-left font-display text-lg text-ink hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

function DemoForm() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="demo" className="bg-ink py-24 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-start">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-secondary">Book a Demo</p>
          <h2 className="text-4xl md:text-5xl">Turn Missed Calls Into Booked Tee Times</h2>
          <p className="mt-5 max-w-lg text-lg text-primary-foreground/70">
            Give your pro shop a 24/7 AI receptionist that helps golfers faster, reduces staff interruptions,
            and captures revenue your course may be missing.
          </p>
          <div className="mt-8 space-y-3 text-sm text-primary-foreground/80">
            {[
              "15-minute live walkthrough",
              "Hear a real Linq call demo",
              "No setup required to evaluate",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <CircleDot className="h-4 w-4 text-secondary" />
                {t}
              </div>
            ))}
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="rounded-3xl bg-background p-8 text-ink shadow-elegant"
        >
          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary text-primary">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-2xl">Thanks — we'll be in touch.</h3>
              <p className="mt-2 text-muted-foreground">
                A member of our team will reach out within one business day to schedule your demo.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name"><Input required maxLength={100} placeholder="Jane Smith" /></Field>
                <Field label="Course name"><Input required maxLength={120} placeholder="Pinehill Golf Club" /></Field>
                <Field label="Email"><Input required type="email" maxLength={200} placeholder="you@course.com" /></Field>
                <Field label="Phone number"><Input required type="tel" maxLength={30} placeholder="(555) 555-1234" /></Field>
                <Field label="Current booking software"><Input maxLength={100} placeholder="e.g. foreUP" /></Field>
                <Field label="Number of holes"><Input maxLength={20} placeholder="9 / 18 / 27 / 36" /></Field>
              </div>
              <Field label="Message">
                <Textarea maxLength={1000} rows={4} placeholder="Tell us about your call volume or goals…" />
              </Field>
              <Button type="submit" variant="hero" size="xl" className="w-full">
                Book My Demo <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <Logo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Linq. Your 24/7 Tee Time Booker for the Linqs.
        </p>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Integrations />
      <Benefits />
      <CallFlow />
      <Pricing />
      <FAQ />
      <DemoForm />
      <Footer />
    </main>
  );
}
