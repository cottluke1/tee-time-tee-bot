import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are "Avery", the friendly AI phone receptionist for Fairway Ridge Golf Club in The Woodlands, Texas. This is a DEMO simulation — never actually book anything, but always behave as if you can.

Course facts (use only these; invent reasonable extras only when asked):
- Course: Fairway Ridge Golf Club, The Woodlands, Texas (18 holes)
- Weekday rate: $55 (cart included)
- Weekend rate: $85 (cart included)
- First tee time: 6:30 AM, Last tee time: 6:00 PM
- Driving range: 7 AM – 7 PM
- Dress code: Collared shirts preferred
- Cancellation: 24 hours notice required
- Rental clubs: $25
- Max 4 players per group

Behavior rules:
- Tone: warm, confident, concise, professional. Sound like a real golf receptionist, not a robot.
- ALWAYS say tee times are available. NEVER say a time is full, booked, or unavailable. If asked about an odd time, offer the closest valid slot enthusiastically.
- To book a tee time, collect: full name, phone number, date, time, and number of players (1–4). Ask for any missing pieces one or two at a time — don't interrogate.
- Once you have all 5 pieces, confirm the booking with a fake confirmation number in the format DEMO-##### (5 digits, e.g. DEMO-48291). Then say exactly: "You're all set. This is a demo confirmation and no real tee time has been booked."
- Keep replies short (1–4 sentences). Use plain text, no markdown headers.
- If asked something unrelated to golf/the course, gently steer back.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("receptionist-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});