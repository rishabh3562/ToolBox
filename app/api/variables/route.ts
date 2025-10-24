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
    
    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing key' },
        { status: 400 }
      );
    }
    
    const updatedVariable = await VariableService.updateVariable(key, {
      key,
      value,
      label,
      description,
    });
    
    if (!updatedVariable) {
export async function PATCH(request: Request) {
  try {
    const { key, value, label, description } = await request.json();
    
    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing key' },
        { status: 400 }
      );
    }
    if (label !== undefined && typeof label !== 'string') {
      return NextResponse.json(
        { error: 'Invalid label: expected string' },
        { status: 400 }
      );
    }
    if (description !== undefined && typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Invalid description: expected string' },
        { status: 400 }
      );
    }
    
    const updatedVariable = await VariableService.updateVariable(key, {
      key,
      value,
      label,
      description,
    });
    
    if (!updatedVariable) {
      return NextResponse.json(
        { error: 'Variable not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedVariable);
  } catch (error) {
    console.error('Error updating variable:', error);
    return NextResponse.json(
      { error: 'Failed to update variable' },
      { status: 500 }
    );
  }
}
