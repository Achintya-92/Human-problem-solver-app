import type { Request, Response } from "express";
import { z } from "zod";
import { env } from "../utils/env";

export async function similarProblems(req: Request, res: Response) {
  const q = z.object({ problemId: z.string().min(1) }).parse(req.query);
  return res.json({
    data: {
      problemId: q.problemId,
      items: [],
      note: "AI placeholder: semantic matching will be added later.",
    },
  });
}

export async function recommendations(req: Request, res: Response) {
  const q = z.object({ category: z.string().optional(), q: z.string().optional() }).parse(req.query);
  
  try {
    const prompt = `Given the category "${q.category || 'general'}" and question "${q.q || ''}", recommend human experiences or experts who could help. Be concise and helpful.`;
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const note = data.choices?.[0]?.message?.content || "AI placeholder: recommend human experiences/solvers later.";

    return res.json({
      data: {
        items: [],
        context: q,
        note,
      },
    });
  } catch (error) {
    console.error("AI recommendations error:", error);
    return res.json({
      data: {
        items: [],
        context: q,
        note: "AI recommendation temporarily unavailable.",
      },
    });
  }
}

export async function summarize(req: Request, res: Response) {
  const body = z.object({ text: z.string().min(1).max(8000) }).parse(req.body);
  return res.json({
    data: {
      summary:
        body.text.length < 240
          ? body.text
          : `${body.text.slice(0, 220).trim()}…`,
      note: "AI placeholder: real summarizer later.",
    },
  });
}

export async function emotionDetect(req: Request, res: Response) {
  const body = z.object({ text: z.string().min(1).max(8000) }).parse(req.body);
  const t = body.text.toLowerCase();
  const emotion =
    t.includes("anx") || t.includes("stress") ? "anxious" : t.includes("sad") ? "sad" : "neutral";
  return res.json({ data: { emotion, note: "AI placeholder: real emotion model later." } });
}

export async function semanticSearch(req: Request, res: Response) {
  const q = z.object({ q: z.string().min(1), type: z.enum(["problems", "solutions"]).default("problems") }).parse(req.query);
  return res.json({
    data: {
      query: q.q,
      type: q.type,
      items: [],
      note: "AI placeholder: vector search later.",
    },
  });
}

