import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";

// GET /api/templates - Get all templates
async function handleGetTemplates(request: NextRequest): Promise<NextResponse> {
  try {
    // Simulate fetching templates from database
    const templates = [
      {
        id: "1",
        name: "React Component Template",
        description: "Boilerplate for React functional components",
        content: "import React from 'react';\n\nconst {{componentName}} = () => {\n  return (\n    <div>\n      {{content}}\n    </div>\n  );\n};\n\nexport default {{componentName}};",
        variables: ["componentName", "content"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "2", 
        name: "API Route Template",
        description: "Next.js API route boilerplate",
        content: "import { NextRequest, NextResponse } from 'next/server';\n\nexport async function GET(request: NextRequest) {\n  try {\n    // {{logic}}\n    return NextResponse.json({ success: true });\n  } catch (error) {\n    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });\n  }\n}",
        variables: ["logic"],
        createdAt: new Date().toISOString(),
      }
    ];

    return NextResponse.json({
      success: true,
      data: templates,
      count: templates.length,
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST /api/templates - Create a new template
async function handleCreateTemplate(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { name, description, content, variables } = body;

    // Validate required fields
    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    // Simulate creating template in database
    const newTemplate = {
      id: Date.now().toString(),
      name,
      description: description || "",
      content,
      variables: variables || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newTemplate,
      message: "Template created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the handlers
export const GET = rateLimitMiddleware.templates(handleGetTemplates);
export const POST = rateLimitMiddleware.templates(handleCreateTemplate);
