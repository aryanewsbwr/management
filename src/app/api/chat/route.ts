import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, agencyContext } = await req.json();
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = `You are Aryan News Agency's AI Assistant ("PaperFlow AI"). You help the news agency owner and staff manage newspaper transactions, customer dues, hawker delivery routes, counter sales, and publisher stock.

Here is the current live agency database context:
${JSON.stringify(agencyContext, null, 2)}

Instructions:
1. Provide helpful, accurate, polite, and professional answers in clear English or Hindi based on the user's input language.
2. If asked about customer dues, list the customers, their phone numbers, and exact due amounts from the context.
3. If asked about hawker routes, list the hawker names, assigned regions, and mobile numbers.
4. If asked about counter sales or billing, summarize total revenue and numbers from the context.
5. Keep responses concise, well-structured, using bullet points or markdown tables when appropriate.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error:', errText);
      // Fallback response if API call fails
      return NextResponse.json({ 
        reply: `⚠️ Note: Operating with live context assistant.\n\n` + fallbackAnswer(prompt, agencyContext)
      });
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

function fallbackAnswer(prompt: string, context: any) {
  const p = prompt.toLowerCase();
  if (p.includes('due') || p.includes('unpaid') || p.includes('बकाया')) {
    const unpaid = context.customers?.filter((c: any) => c.due_amount > 0) || [];
    return `Found ${unpaid.length} customer(s) with pending dues:\n` + 
      unpaid.map((c: any) => `• ${c.name_eng} (${c.phone || 'No Phone'}): ₹${c.due_amount}`).join('\n');
  }
  if (p.includes('hawker') || p.includes('delivery')) {
    return `Hawkers:\n` + (context.hawkers || []).map((h: any) => `• ${h.name} (${h.region_name}): ${h.mobile}`).join('\n');
  }
  return `Connected to Agency Database. Total Customers: ${context.customers?.length || 0}, Active Hawkers: ${context.hawkers?.length || 0}.`;
}
