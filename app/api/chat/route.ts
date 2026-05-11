// app/api/chat/route.ts - Complete version with restrictions
import { NextRequest, NextResponse } from "next/server";

// Helper function to check for restricted topics
function isRestrictedTopic(message: string): boolean {
  const restrictedPatterns = [
    // Political
    /\b(politics?|election|president|democrat|republican|voting|political party|congress|senate|government|politician)\b/i,
    // Religious
    /\b(religion|god|jesus|allah|buddha|church|mosque|temple|prayer|bible|quran|spiritual|faith|holy)\b/i,
    // Relationships
    /\b(dating|relationship|marriage|girlfriend|boyfriend|wife|husband|love|romance|breakup|divorce)\b/i,
    // Personal advice
    /\b(investment|stocks|medical|diagnosis|treatment|lawyer|legal advice|therapy)\b/i,
  ];

  return restrictedPatterns.some((pattern) => pattern.test(message));
}

const SYSTEM_INSTRUCTIONS = `
You are an AI assistant for "Build Flow" - a project management application. 

⚠️ **STRICT RULES - You MUST follow:**
- ONLY discuss project management, coding, and work-related topics
- Politely decline ANY questions about politics, religion, relationships, dating, personal advice, or controversial topics
- If someone asks about restricted topics, respond with: "I'm focused on helping with project management and coding. Let's get back to your project!"

✅ **Acceptable topics:**
- Project planning, timelines, milestones, resources
- Task organization, to-do lists, sprint planning
- Coding, debugging, code reviews, programming languages
- Team collaboration, meetings, workflows, feedback
- Productivity tips, time management
- Technical documentation, requirements

❌ **Forbidden topics (politely refuse):**
- Politics, elections, governments
- Religion, prayers, religious texts
- Dating, relationships, marriage advice
- Medical, legal, or financial advice
- Personal opinions or controversial debates

Keep responses concise, professional, and action-oriented for projects and coding tasks.
`;

const WORKING_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-flash-latest",
  "gemini-pro-latest",
];

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Google AI API key is not configured" },
        { status: 500 },
      );
    }

    const { messages } = await request.json();
    const lastUserMessage = messages
      .filter((m: any) => m.role === "user")
      .pop();

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 },
      );
    }

    // Check for restricted topics before sending to API
    if (isRestrictedTopic(lastUserMessage.content)) {
      const safetyReply =
        "I'm specifically designed to help with project management and coding tasks only. Could you please ask me something about your project planning, coding challenges, or team collaboration? I'd love to help with your work!";
      return NextResponse.json({ reply: safetyReply });
    }

    const conversationHistory = messages
      .map(
        (m: any) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`,
      )
      .join("\n");

    const prompt = `${SYSTEM_INSTRUCTIONS}

Conversation history:
${conversationHistory}

User: ${lastUserMessage.content}

Assistant (stay focused on project management/coding):`;

    let lastError = null;

    for (const modelName of WORKING_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const payload = {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500, 
            topP: 0.8,
            topK: 40,
          },
        };

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          let reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I couldn't generate a response.";

          // Final safety check
          if (isRestrictedTopic(reply)) {
            reply =
              "I'm here to help with project management and coding. Let's focus on your work - what specific task can I help you with?";
          }

          return NextResponse.json({ reply });
        }
      } catch (error: any) {
        lastError = error.message;
      }
    }

    return NextResponse.json(
      { error: "Unable to get AI response", details: lastError },
      { status: 500 },
    );
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to get response", details: error.message },
      { status: 500 },
    );
  }
}
