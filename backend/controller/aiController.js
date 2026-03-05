// Compact system prompt to minimize input token usage
const SYSTEM_PROMPT = `You are a Senior Distributed Systems Architect. Analyze the given HLD diagram and return ONLY valid JSON.`;

const buildUserPrompt = (title, components, connections) => {
  return `System: ${title}
Components: ${components}
Connections: ${connections}

Analyze and return ONLY this JSON (no markdown, no explanation outside JSON):
{"architecture_summary":"","strengths":[],"bottlenecks":[],"missing_components":[],"scalability_improvements":[],"reliability_improvements":[],"performance_optimizations":[],"security_improvements":[],"interview_feedback":"","suggested_components":[{"component":"","reason":""}]}

Fill each field with concise, practical insights. Keep each array to 2-4 items max. Keep strings under 2 sentences.`;
};

const formatComponents = (nodes) => {
  if (!nodes || nodes.length === 0) return "None";
  return nodes
    .map((node) => {
      const label = node.data?.label || node.data?.name || "Unnamed";
      const type = node.type || "unknown";
      return `${label}(${type})`;
    })
    .join(", ");
};

const formatConnections = (edges, nodes) => {
  if (!edges || edges.length === 0) return "None";
  const nodeMap = {};
  if (nodes) {
    nodes.forEach((node) => {
      nodeMap[node.id] = node.data?.label || node.data?.name || node.id;
    });
  }
  return edges
    .map((edge) => {
      const source = nodeMap[edge.source] || edge.source;
      const target = nodeMap[edge.target] || edge.target;
      return `${source}->${target}`;
    })
    .join(", ");
};

// Models to try in order: cheapest first
const FALLBACK_MODELS = [
  "google/gemini-2.0-flash-001",
  "meta-llama/llama-3.1-8b-instruct:free",
  "anthropic/claude-3.5-haiku",
];

// Perform a single OpenRouter fetch
const openRouterFetch = async (apiKey, model, messages, maxTokens) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  let response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://sketchon.app",
        "X-Title": "SketchOn AI Analyze",
      },
      body: JSON.stringify({ model, max_tokens: maxTokens, messages }),
      signal: controller.signal,
    });
  } catch (fetchErr) {
    clearTimeout(timeoutId);
    throw new Error(`Failed to connect to AI service: ${fetchErr.message}`);
  }
  clearTimeout(timeoutId);

  const rawBody = await response.text();
  return { response, rawBody };
};

// Call AI via OpenRouter with automatic model fallback on 402
const callAI = async (systemPrompt, userPrompt) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!systemPrompt || !userPrompt) {
    throw new Error("System prompt or user prompt is empty");
  }

  if (apiKey.startsWith("sk-or-")) {
    const configuredModel =
      process.env.OPENROUTER_MODEL || "anthropic/claude-3.7-sonnet";

    // Build model list: configured model first, then fallbacks
    const modelsToTry = [
      configuredModel,
      ...FALLBACK_MODELS.filter((m) => m !== configuredModel),
    ];

    const messages = [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: userPrompt.trim() },
    ];

    let lastError = null;

    for (const model of modelsToTry) {
      const maxTokens = 1024;
      console.log(
        `OpenRouter → trying model: ${model} (max_tokens: ${maxTokens})`,
      );

      try {
        const { response, rawBody } = await openRouterFetch(
          apiKey,
          model,
          messages,
          maxTokens,
        );

        // On 402, try next cheaper model
        if (response.status === 402) {
          console.warn(`OpenRouter → 402 on ${model}, trying next model...`);
          lastError = new Error(`Credits exhausted for ${model}`);
          lastError.status = 402;
          continue;
        }

        if (!response.ok) {
          let errJson = null;
          try {
            errJson = JSON.parse(rawBody);
          } catch (_) {}
          const errMsg = errJson?.error?.message || errJson?.message || rawBody;
          console.error(
            `OpenRouter ${response.status} for "${model}": ${errMsg}`,
          );

          // On rate limit or server errors, try next model
          if (response.status === 429 || response.status >= 500) {
            lastError = new Error(`AI API error ${response.status}: ${errMsg}`);
            lastError.status = response.status;
            continue;
          }

          const err = new Error(`AI API error ${response.status}: ${errMsg}`);
          err.status = response.status;
          throw err;
        }

        let data;
        try {
          data = JSON.parse(rawBody);
        } catch (_) {
          throw new Error("Invalid response format from AI service");
        }

        const content = data.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error("Empty response from AI service");
        }

        console.log(`OpenRouter → success with model: ${model}`);
        return content;
      } catch (fetchErr) {
        // Network errors — try next model
        if (fetchErr.message?.includes("Failed to connect")) {
          lastError = fetchErr;
          continue;
        }
        throw fetchErr;
      }
    }

    // All models failed
    if (lastError) throw lastError;
    throw new Error("All AI models failed. Please try again later.");
  } else {
    // Native Anthropic SDK (sk-ant- keys)
    const Anthropic = require("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1500,
      system: systemPrompt.trim(),
      messages: [{ role: "user", content: userPrompt.trim() }],
    });

    return message.content[0]?.type === "text" ? message.content[0].text : "";
  }
};

const analyzeDiagram = async (req, res) => {
  try {
    const { title, nodes, edges } = req.body;

    if (!nodes || !Array.isArray(nodes)) {
      return res.status(400).json({
        success: false,
        message: "Nodes array is required",
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI service is not configured. Please set ANTHROPIC_API_KEY.",
      });
    }

    const components = formatComponents(nodes);
    const connections = formatConnections(edges, nodes);
    const diagramTitle = title || "Untitled Diagram";

    const userPrompt = buildUserPrompt(diagramTitle, components, connections);

    const responseText = await callAI(SYSTEM_PROMPT, userPrompt);

    // Parse the JSON response — handle markdown-wrapped JSON too
    let analysis;
    try {
      // Strip markdown code fences if present
      let cleaned = responseText.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/, "");
      }

      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError.message);
      console.error("Raw response:", responseText.substring(0, 500));

      // Build a fallback analysis from the raw text
      analysis = {
        architecture_summary: responseText.substring(0, 300),
        strengths: [
          "AI returned non-JSON. See architecture summary for details.",
        ],
        bottlenecks: [],
        missing_components: [],
        scalability_improvements: [],
        reliability_improvements: [],
        performance_optimizations: [],
        security_improvements: [],
        interview_feedback:
          "The AI response could not be fully parsed. This may be due to low token limits. Please try again.",
        suggested_components: [],
      };
    }

    return res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("AI analysis error:", error);

    if (error.status === 401) {
      return res.status(500).json({
        success: false,
        message: "Invalid API key. Check your ANTHROPIC_API_KEY in .env",
      });
    }

    if (error.status === 402) {
      return res.status(402).json({
        success: false,
        message:
          "AI credits exhausted. All model fallbacks failed. Please add credits at openrouter.ai/settings/credits",
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Rate limited. Please wait a moment and try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to analyze diagram: " + (error.message || "Unknown error"),
    });
  }
};

module.exports = { analyzeDiagram };
