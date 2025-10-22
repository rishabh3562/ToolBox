import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";

// POST /api/ai/generate - AI-powered code generation
async function handleAIGenerate(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { prompt, type, language } = body;

    // Validate required fields
    if (!prompt || !type) {
      return NextResponse.json(
        { error: "Prompt and type are required" },
        { status: 400 }
      );
    }

    // Validate type
    const supportedTypes = ["code", "template", "snippet", "documentation"];
    if (!supportedTypes.includes(type)) {
      return NextResponse.json(
        { error: `Unsupported type. Supported: ${supportedTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Simulate AI generation (replace with actual AI service)
    let generatedContent = "";
    
    switch (type) {
      case "code":
        generatedContent = `// Generated ${language || "JavaScript"} code based on: ${prompt}\nfunction generatedFunction() {\n  // TODO: Implement based on prompt\n  console.log("Generated from: ${prompt}");\n}`;
        break;
      case "template":
        generatedContent = `<!-- Generated template for: ${prompt} -->\n<div class="{{className}}">\n  <h1>{{title}}</h1>\n  <p>{{description}}</p>\n</div>`;
        break;
      case "snippet":
        generatedContent = `// Snippet: ${prompt}\nconst result = () => {\n  // Implementation here\n  return "Generated snippet";\n};`;
        break;
      case "documentation":
        generatedContent = `# ${prompt}\n\n## Overview\nGenerated documentation for ${prompt}.\n\n## Usage\n\`\`\`${language || "javascript"}\n// Example usage\n\`\`\`\n\n## Parameters\n- param1: Description\n- param2: Description`;
        break;
    }

    const result = {
      id: Date.now().toString(),
      prompt,
      type,
      language: language || "javascript",
      content: generatedContent,
      generatedAt: new Date().toISOString(),
      model: "gpt-3.5-turbo", // Placeholder
    };

    return NextResponse.json({
      success: true,
      data: result,
      message: "Content generated successfully",
    });
  } catch (error) {
    console.error("Error generating AI content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}

// Apply strict rate limiting for AI endpoints
export const POST = rateLimitMiddleware.ai(handleAIGenerate);
