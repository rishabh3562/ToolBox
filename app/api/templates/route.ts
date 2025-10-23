import { NextResponse } from 'next/server';
import { TemplateService } from '@/lib/db/services/templateService';

export async function GET() {
  try {
    const templates = await TemplateService.getAllTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newTemplate = await TemplateService.createTemplate({
      name: data.name || 'Untitled',
      category: data.category || 'general',
      content: data.content || '',
    });
    return NextResponse.json(newTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.error();
    // Simulate fetching templates from database
    const templates = [
      {
        id: "1",
        name: "React Component Template",
        description: "Boilerplate for React functional components",
        content:
          "import React from 'react';\n\nconst {{componentName}} = () => {\n  return (\n    <div>\n      {{content}}\n    </div>\n  );\n};\n\nexport default {{componentName}};",
        variables: ["componentName", "content"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "API Route Template",
        description: "Next.js API route boilerplate",
        content:
          "import { NextRequest, NextResponse } from 'next/server';\n\nexport async function GET(request: NextRequest) {\n  try {\n    // {{logic}}\n    return NextResponse.json({ success: true });\n  } catch (error) {\n    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });\n  }\n}",
        variables: ["logic"],
        createdAt: new Date().toISOString(),
      },
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
      { status: 500 },
    );
  }
}

// POST /api/templates - Create a new template
async function handleCreateTemplate(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { name, description, content, variables } =
      (body as Record<string, unknown>) ?? {};

    if (typeof name !== "string" || typeof content !== "string") {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 },
      );
    }

    if (variables != null && !Array.isArray(variables)) {
      return NextResponse.json(
        { error: "variables must be an array of strings" },
        { status: 400 },
      );
    }

    // Validate required fields
    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 },
      );
    }

    // Simulate creating template in database
    const newTemplate = {
      id: crypto.randomUUID(),
      name,
      description: description || "",
      content,
      variables: Array.isArray(variables) ? variables.map(String) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: newTemplate,
        message: "Template created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 },
    );
  }
}
