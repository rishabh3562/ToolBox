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
  }
}
