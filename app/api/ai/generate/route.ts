import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";

// Helper function to sanitize user input
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>'"]/g, (char) => {
    const entities: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    };
    return entities[char] || char;
  }).trim().slice(0, 500); // Limit length
};

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

    // Sanitize inputs
    const sanitizedPrompt = sanitizeInput(prompt);
    const sanitizedLanguage = language ? sanitizeInput(language) : "javascript";
    
    // Simulate AI generation (replace with actual AI service)
    let generatedContent = "";
    
    switch (type) {
      case "code":
        generatedContent = `// Generated ${sanitizedLanguage} code based on: ${sanitizedPrompt}\nfunction generatedFunction() {\n  // TODO: Implement based on prompt\n  console.log("Generated from prompt");\n}`;
        break;
      case "template":
        generatedContent = `<!-- Generated template for: ${sanitizedPrompt} -->\n<div class="{{className}}">\n  <h1>{{title}}</h1>\n  <p>{{description}}</p>\n</div>`;
        break;
      case "snippet":
        generatedContent = `// Snippet: ${sanitizedPrompt}\nconst result = () => {\n  // Implementation here\n  return "Generated snippet";\n};`;
        break;
      case "documentation":
        generatedContent = `# ${sanitizedPrompt}\n\n## Overview\nGenerated documentation for ${sanitizedPrompt}.\n\n## Usage\n\`\`\`${sanitizedLanguage}\n// Example usage\n\`\`\`\n\n## Parameters\n- param1: Description\n- param2: Description`;
        break;
    }

    const result = {
      id: crypto.randomUUID(),
      prompt,
      type,
      language: language || "javascript",
      content: generatedContent,
      generatedAt: new Date().toISOString(),
      model: "placeholder", // Update when real AI service is integrated
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
