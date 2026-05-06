import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flag, Send, PhoneCall, CalendarCheck, ServerCog, ArrowRight, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "AI Receptionist Demo — Linq" },
      {
        name: "description",
        content:
          "Try the Linq AI tee time receptionist. Chat live with a simulated golf course AI that books tee times, answers questions, and quotes rates.",
      },
    ],
  }),
  component: DemoPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const EXAMPLES = [
  "Book a tee time for Saturday morning",
  "Do you have anything open at 9 AM?",
  "What are your weekend rates?",
  "Is the driving range open?",
  "Can I book for four players?",
];

const GREETING: Msg = {
  role: "assistant",
  content:
    "Thanks for calling Fairway Ridge Golf Club, this is Avery — how can I help you today? I can book a tee time, check availability, or answer any questions about the course.",
};

function DemoPage() {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setError(null);
    const userMsg: Msg = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/receptionist-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) setError("Too many requests — try again in a moment.");
        else if (resp.status === 402) setError("AI credits exhausted on this workspace.");
        else setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantSoFar = "";
      let started = false;
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, nl);
          textBuffer = textBuffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantSoFar += delta;
              if (!started) {
                started = true;
                setMessages((prev) => [...prev, { role: "assistant", content: assistantSoFar }]);
              } else {
                setMessages((prev) =>
                  prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
                  ),
                );
              }
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-display text-xl tracking-tight text-ink">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
              <Flag className="h-4 w-4" />
            </span>
            <span className="font-semibold">Linq</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm text-muted-foreground hover:text-ink">Home</Link>
            <Link to="/demo" className="text-sm text-ink font-medium">AI Demo</Link>
          </nav>
          <Button asChild variant="hero" size="default" className="rounded-full">
            <a href="/#demo">Book Demo</a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            AI Receptionist Demo
          </span>
          <h1 className="mt-6 font-display text-4xl leading-tight text-ink md:text-5xl">
            Try the AI Tee Time Receptionist
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Ask the AI to book a tee time, check availability, or answer questions about the course.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5" />
            Demo only. This does not book a real tee time.
          </div>
        </div>

        {/* Chat + side panel */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Chat */}
          <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-3 border-b border-border bg-secondary/40 px-5 py-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-ink">Avery · Fairway Ridge Golf Club</p>
                <p className="text-xs text-muted-foreground">The Woodlands, Texas · Online now</p>
              </div>
            </div>

            <div ref={scrollRef} className="h-[420px] overflow-y-auto px-5 py-6 md:h-[480px]">
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-secondary text-ink rounded-bl-sm"
                      }`}
                    >
                      {m.content || "…"}
                    </div>
                  </div>
                ))}
                {loading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm bg-secondary px-4 py-3 text-sm text-muted-foreground">
                      <span className="inline-flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Examples */}
            <div className="border-t border-border bg-background px-5 py-3">
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => send(ex)}
                    disabled={loading}
                    className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs text-ink transition hover:bg-secondary disabled:opacity-50"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border bg-card px-4 py-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                disabled={loading}
                className="rounded-full"
              />
              <Button type="submit" disabled={loading || !input.trim()} variant="hero" size="icon" className="rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            {error && <p className="px-5 pb-3 text-xs text-red-600">{error}</p>}
          </div>

          {/* Side panel */}
          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">System</p>
              <ul className="mt-4 space-y-3 text-sm">
                <StatusRow label="Demo Status" value="Active" tone="green" />
                <StatusRow label="Booking Mode" value="Simulation" tone="green" />
                <StatusRow label="Tee Sheet" value="Always Open" tone="green" />
                <StatusRow label="API Connection" value="Not Connected" tone="muted" />
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-secondary/40 p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Course Info</p>
              <dl className="mt-4 space-y-2 text-sm text-ink">
                <Row k="Weekday" v="$55" />
                <Row k="Weekend" v="$85" />
                <Row k="First tee" v="6:30 AM" />
                <Row k="Last tee" v="6:00 PM" />
                <Row k="Range" v="7 AM – 7 PM" />
                <Row k="Rentals" v="$25" />
              </dl>
            </div>
          </aside>
        </div>

        {/* How real version works */}
        <section className="mt-20">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Production</p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">How the real version works</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <StepCard
              icon={<PhoneCall className="h-5 w-5" />}
              step="1"
              title="Caller talks to AI"
              body="Your course phone is answered instantly, 24/7, by a natural-sounding AI receptionist trained on your course."
            />
            <StepCard
              icon={<CalendarCheck className="h-5 w-5" />}
              step="2"
              title="AI checks real availability"
              body="Linq queries your live tee sheet to find open times that match the golfer's request."
            />
            <StepCard
              icon={<ServerCog className="h-5 w-5" />}
              step="3"
              title="AI books directly"
              body="The booking is written straight into your tee sheet software — no staff handoff required."
            />
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="hero" size="xl">
              <a href="/#demo">
                Book a Demo <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-secondary/30 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Linq · Demo simulation · No real bookings made
        </div>
      </footer>
    </div>
  );
}

function StatusRow({ label, value, tone }: { label: string; value: string; tone: "green" | "muted" }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="inline-flex items-center gap-2 font-medium text-ink">
        <span
          className={`h-2 w-2 rounded-full ${tone === "green" ? "bg-primary animate-pulse" : "bg-muted-foreground/40"}`}
        />
        {value}
      </span>
    </li>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 pb-1 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

function StepCard({ icon, step, title, body }: { icon: React.ReactNode; step: string; title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
          {icon}
        </div>
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Step {step}</span>
      </div>
      <h3 className="mt-4 font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}