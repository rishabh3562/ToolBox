import { Metadata } from "next";
import { TemplateService } from "@/lib/db/services/templateService";
import { VariableService } from "@/lib/db/services/variableService";
import { TemplateManagerClient } from "./_components/template-manager-client";

export const metadata: Metadata = {
  title: "Template Manager | ToolBox",
  description:
    "Create and manage professional templates with dynamic variable support. Organize templates by categories and tags for easy access.",
  openGraph: {
    title: "Template Manager | ToolBox",
    description:
      "Create and manage professional templates with dynamic variable support",
    type: "website",
  },
};

export default async function TemplateManagerPage() {
  // Server-side data fetching - no env variable errors!
  let initialTemplates, initialVariables;

  try {
    // Initialize defaults if needed (server-side safe)
    await TemplateService.initializeDefaultTemplates();
    await VariableService.initializeDefaultVariables();

    // Fetch initial data server-side
    initialTemplates = await TemplateService.getAllTemplates();
    initialVariables = await VariableService.getAllVariables();
  } catch (error) {
    console.error("Error loading initial data:", error);
    initialTemplates = [];
    initialVariables = [];
  }

  return (
    <TemplateManagerClient
      initialTemplates={initialTemplates}
      initialVariables={initialVariables}
    />
  );
}
