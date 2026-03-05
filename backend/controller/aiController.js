const SYSTEM_PROMPT = `You are a Senior Distributed Systems Architect with experience designing large-scale systems used by companies like Google, Netflix, and Amazon.

Your task is to analyze a High Level Design (HLD) diagram of a software system.

The diagram is represented as a structured topology containing components and their connections.

Your goals are to evaluate the architecture from the perspective of:

1. Scalability
2. Reliability
3. Fault tolerance
4. Performance and latency
5. Data consistency
6. Availability
7. Security
8. Operational complexity

Assume the system may need to scale to millions or hundreds of millions of users.`;

const buildUserPrompt = (title, components, connections) => {
  return `----------------------------
SYSTEM DIAGRAM
----------------------------

Title: ${title}

Components:
${components}

Connections:
${connections}

----------------------------
ANALYSIS INSTRUCTIONS
----------------------------

Analyze the architecture and provide expert-level feedback.

Specifically identify:

1. Architecture Summary
Explain in a few sentences what this system is doing and how traffic flows.

2. Strengths
Identify good architectural decisions made in the design.

3. Bottlenecks
Identify components that may become performance or scaling bottlenecks.

4. Missing Components
Identify important infrastructure or architectural components that are missing (for example: cache, queue, load balancer, CDN, replication, autoscaling, etc).

5. Scalability Improvements
Suggest ways to improve the system to support very large traffic.

6. Reliability Improvements
Suggest changes that improve fault tolerance, redundancy, and failure recovery.

7. Performance Optimizations
Suggest improvements to reduce latency or improve throughput.

8. Security Improvements
Highlight potential security improvements or best practices.

9. Interview Feedback
Provide constructive feedback as if reviewing this design in a system design interview.

10. Suggested Components to Add
List specific components that could be added to improve the design.

----------------------------
OUTPUT FORMAT
----------------------------

Return ONLY valid JSON in the following structure:

{
  "architecture_summary": "",
  "strengths": [],
  "bottlenecks": [],
  "missing_components": [],
  "scalability_improvements": [],
  "reliability_improvements": [],
  "performance_optimizations": [],
  "security_improvements": [],
  "interview_feedback": "",
  "suggested_components": [
    {
      "component": "",
      "reason": ""
    }
  ]
}

Important rules:
- Be precise and practical.
- Do not repeat the diagram text.
- Focus on real distributed systems principles.
- Assume large-scale production environments.
- Avoid generic advice.`;
};

const formatComponents = (nodes) => {
  if (!nodes || nodes.length === 0) return "No components found.";

  return nodes
    .map((node, i) => {
      const label = node.data?.label || node.data?.name || "Unnamed";
      const type = node.type || "unknown";
      const iconId = node.data?.iconId || "";
      const icon = node.data?.icon || "";

      let description = `${i + 1}. [${type.toUpperCase()}] ${label}`;
      if (iconId) description += ` (icon: ${iconId})`;
      if (icon && !iconId) description += ` (${icon})`;
      return description;
    })
    .join("\n");
};

const formatConnections = (edges, nodes) => {
  if (!edges || edges.length === 0) return "No connections found.";

  const nodeMap = {};
  if (nodes) {
    nodes.forEach((node) => {
      nodeMap[node.id] = node.data?.label || node.data?.name || node.id;
    });
  }

  return edges
    .map((edge, i) => {
      const source = nodeMap[edge.source] || edge.source;
      const target = nodeMap[edge.target] || edge.target;
      const label = edge.label ? ` [${edge.label}]` : "";
      return `${i + 1}. ${source} -> ${target}${label}`;
    })
    .join("\n");
};

// Call AI via OpenRouter (supports sk-or-v1- keys) or Anthropic directly (sk-ant- keys)
const callAI = async (systemPrompt, userPrompt) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Validate message content is non-empty before sending
  if (!systemPrompt || !userPrompt) {
    throw new Error("System prompt or user prompt is empty");
  }

  if (apiKey.startsWith("sk-or-")) {
    const model = process.env.OPENROUTER_MODEL || "anthropic/claude-3.7-sonnet";

    const messages = [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: userPrompt.trim() },
    ];

    console.log(`OpenRouter → trying model: ${model}`);

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
        body: JSON.stringify({ model, max_tokens: 1800, messages }),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      console.error(
        `OpenRouter → fetch failed for ${model}:`,
        fetchErr.message,
      );
      throw new Error(`Failed to connect to AI service: ${fetchErr.message}`);
    }
    clearTimeout(timeoutId);

    const rawBody = await response.text();

    if (!response.ok) {
      let errJson = null;
      try {
        errJson = JSON.parse(rawBody);
      } catch (_) {}

      const errMsg = errJson?.error?.message || errJson?.message || rawBody;
      console.error(
        `OpenRouter ${response.status} for model "${model}": ${errMsg}`,
      );

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
  } else {
    // Native Anthropic SDK (sk-ant- keys)
    const Anthropic = require("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });

    console.log(
      `Anthropic SDK → sending request to claude-3-7-sonnet-20250219`,
    );
    const message = await client.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1800,
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

    // Parse the JSON response
    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI analysis response",
        rawResponse: responseText,
      });
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
        message: error.message,
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message: error.message,
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
