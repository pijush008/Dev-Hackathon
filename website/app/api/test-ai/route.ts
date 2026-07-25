import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const logs: string[] = [];

  try {
    // Test 1: env vars
    logs.push(`OPENAI_API_KEY set: ${!!process.env.OPENAI_API_KEY}`);
    logs.push(`OPENAI_BASE_URL: ${process.env.OPENAI_BASE_URL}`);
    logs.push(`Key prefix: ${process.env.OPENAI_API_KEY?.slice(0, 10)}`);

    // Test 2: Supabase auth
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    logs.push(`Auth: ${user ? user.id : "no user"} | error: ${authError?.message || "none"}`);

    // Test 3: OpenAI call
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    });
    const res = await client.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [{ role: "user", content: "Say hi in 5 words" }],
      max_tokens: 20,
    });
    logs.push(`AI response: ${res.choices[0].message.content}`);

    return NextResponse.json({ ok: true, logs });
  } catch (e: any) {
    logs.push(`ERROR: ${e.message}`);
    logs.push(`ERROR type: ${e.constructor?.name}`);
    logs.push(`ERROR stack: ${e.stack?.slice(0, 500)}`);
    return NextResponse.json({ ok: false, logs }, { status: 500 });
  }
}
