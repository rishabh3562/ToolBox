import { streamGeminiResponse } from "@/lib/gemini";
import { Schema, DatabaseType } from "@/types/schema";

export async function generateSchema(
  prompt: string,
  dbType: DatabaseType,
  onProgress: (response: { text: string; done: boolean }) => void,
) {
  const context = `
    You are a database schema expert. Generate a complete database schema based on the user's description.
    The output should be in JSON format and include:
    - Tables with fields, types, and constraints
    - Relationships between tables
    - Indexes for optimization
    - Description for each table and field
    
    For the database type: ${dbType}
    
    Format the response as valid JSON with the following structure:
    {
      "schema": {
        "name": string,
        "description": string,
        "tables": Array<{
          "name": string,
          "description": string,
          "fields": Array<{
            "name": string,
            "type": string,
            "nullable": boolean,
            "defaultValue"?: string,
            "primaryKey": boolean,
            "autoIncrement": boolean,
            "description": string
          }>,
          "indexes": Array<{
            "name": string,
            "fields": string[],
            "type": string
          }>,
          "foreignKeys": Array<{
            "name": string,
            "fields": string[],
            "references": {
              "table": string,
              "fields": string[]
            }
          }>
        }>
      },
      "suggestions": string[],
      "optimizations": string[]
    }
  `;

  await streamGeminiResponse(prompt, context, onProgress);
}

export function generateSQLCode(schema: Schema): string {
  let sql = "";

  // Generate CREATE TABLE statements
  schema.tables.forEach((table) => {
    sql += `CREATE TABLE ${table.name} (\n`;

    // Fields
    const fields = table.fields.map((field) => {
      let fieldDef = `  ${field.name} ${field.type}`;
      if (field.length) fieldDef += `(${field.length})`;
      if (field.primaryKey) fieldDef += " PRIMARY KEY";
      if (field.autoIncrement) fieldDef += " AUTO_INCREMENT";
      if (!field.nullable) fieldDef += " NOT NULL";
      if (field.defaultValue) fieldDef += ` DEFAULT ${field.defaultValue}`;
      if (field.unique) fieldDef += " UNIQUE";
      return fieldDef;
    });

    // Foreign Keys
    if (table.foreignKeys) {
      table.foreignKeys.forEach((fk) => {
        const constraint =
          `  CONSTRAINT ${fk.name} FOREIGN KEY (${fk.fields.join(", ")}) ` +
          `REFERENCES ${fk.references.table}(${fk.references.fields.join(", ")})`;
        fields.push(constraint);
      });
    }

    sql += fields.join(",\n");
    sql += "\n);\n\n";

    // Indexes
    if (table.indexes) {
      table.indexes.forEach((index) => {
        const indexType = index.type ? `${index.type} ` : "";
        sql += `CREATE ${indexType}INDEX ${index.name} ON ${table.name} (${index.fields.join(", ")});\n`;
      });
      sql += "\n";
    }
  });

  return sql;
}
