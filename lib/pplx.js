// lib/pplx.js
export async function getResponseFromPerplexity(history) {
  const apiKey = process.env.PPLX_API_KEY;
  if (!apiKey) throw new Error('PPLX_API_KEY not set');

  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: history,
      return_related_questions: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Perplexity API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? '';
  const related = data?.related_questions ?? [];
  const citations = data?.citations ?? [];
  return { content, related, citations };
}
