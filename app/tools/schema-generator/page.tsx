import { Metadata } from "next";
import { SchemaService } from "@/lib/db/services/schemaService";
import { SchemaGeneratorClient } from "./_components/schema-generator-client";

export const metadata: Metadata = {
  title: "Schema Generator | ToolBox",
  description:
    "Generate and manage structured data schemas for better SEO. Create Article, Product, Event, and Organization schemas.",
  openGraph: {
    title: "Schema Generator | ToolBox",
    description:
      "Generate and manage structured data schemas for better SEO",
    type: "website",
  },
};

export default async function SchemaGeneratorPage() {
  // Server-side data fetching
  let initialSchemas;

  try {
    initialSchemas = await SchemaService.getAllSchemas();
  } catch (error) {
    console.error("Error loading initial schemas:", error);
    initialSchemas = [];
  }

  return <SchemaGeneratorClient initialSchemas={initialSchemas} />;
}
