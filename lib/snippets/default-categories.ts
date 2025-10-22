import { Category } from "@/types/snippet";

export const defaultCategories: Category[] = [
  {
    id: "javascript",
    name: "JavaScript",
    description: "JavaScript code snippets",
    subCategories: [
      {
        id: "js-utils",
        name: "Utility Functions",
        parentId: "javascript",
      },
      {
        id: "js-react",
        name: "React",
        parentId: "javascript",
        subCategories: [
          {
            id: "react-hooks",
            name: "Hooks",
            parentId: "js-react",
          },
          {
            id: "react-components",
            name: "Components",
            parentId: "js-react",
          },
        ],
      },
    ],
  },
  {
    id: "python",
    name: "Python",
    description: "Python code snippets",
    subCategories: [
      {
        id: "py-utils",
        name: "Utility Functions",
        parentId: "python",
      },
      {
        id: "py-data",
        name: "Data Processing",
        parentId: "python",
      },
    ],
  },
  {
    id: "sql",
    name: "SQL",
    description: "SQL queries and database operations",
    subCategories: [
      {
        id: "sql-queries",
        name: "Queries",
        parentId: "sql",
      },
      {
        id: "sql-functions",
        name: "Functions",
        parentId: "sql",
      },
    ],
  },
];
