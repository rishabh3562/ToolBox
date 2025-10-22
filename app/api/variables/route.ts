import { NextResponse } from 'next/server';
import { VariableService } from '@/lib/db/services/variableService';

export async function GET() {
  try {
    const variables = await VariableService.getAllVariables();
    return NextResponse.json(variables);
  } catch (error) {
    console.error('Error fetching variables:', error);
    return NextResponse.error();
  }
}

export async function PATCH(request: Request) {
  try {
    const { key, value, label, description } = await request.json();
    const updatedVariable = await VariableService.updateVariable(key, {
      key,
      value,
      label,
      description,
    });
    return NextResponse.json(updatedVariable);
  } catch (error) {
    console.error('Error updating variable:', error);
    return NextResponse.error();
  }
}
