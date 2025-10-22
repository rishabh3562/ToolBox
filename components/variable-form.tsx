"use client";

import { Variable } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface VariableFormProps {
  variables: Variable[];
  onVariableChange: (key: string, value: string) => void;
}

export function VariableForm({
  variables,
  onVariableChange,
}: VariableFormProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Your Information</h3>
        {variables.map((variable) => (
          <div key={variable.key} className="space-y-2">
            <Label htmlFor={variable.key}>{variable.label}</Label>
            <Input
              id={variable.key}
              value={variable.value}
              onChange={(e) => onVariableChange(variable.key, e.target.value)}
              placeholder={variable.description}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
