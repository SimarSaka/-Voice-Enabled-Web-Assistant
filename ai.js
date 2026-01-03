export async function askAI(text) {
  const res = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, sessionId: "default" }),

  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "AI request failed");
  return data.reply;
}
