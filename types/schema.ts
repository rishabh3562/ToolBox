export interface Table {
  name: string;
  description?: string;
  fields: Field[];
  indexes?: Index[];
  foreignKeys?: ForeignKey[];
}

export interface Field {
  name: string;
  type: string;
  length?: number;
  nullable?: boolean;
  defaultValue?: string;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  unique?: boolean;
  description?: string;
}

export interface Index {
  name: string;
  fields: string[];
  type?: "UNIQUE" | "FULLTEXT" | "SPATIAL";
}

export interface ForeignKey {
  name: string;
  fields: string[];
  references: {
    table: string;
    fields: string[];
  };
  onDelete?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION";
  onUpdate?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION";
}

export interface Schema {
  id?: string;
  userId?: string;
  name: string;
  description?: string;
  tables: Table[];
}

export type DatabaseType = "mysql" | "postgresql" | "mongodb";

export interface SchemaGeneratorResponse {
  schema: Schema;
  suggestions: string[];
  optimizations: string[];
}
