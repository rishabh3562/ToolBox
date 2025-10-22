import { Platform } from "@/types/profile";

export const platforms: Platform[] = [
  {
    id: "youtube",
    name: "YouTube",
    icon: "Youtube",
    color: "text-red-600",
    baseUrl: "https://youtube.com",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "Linkedin",
    color: "text-blue-600",
    baseUrl: "https://linkedin.com/in",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: "Twitter",
    color: "text-sky-500",
    baseUrl: "https://twitter.com",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "Instagram",
    color: "text-pink-600",
    baseUrl: "https://instagram.com",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "Github",
    color: "text-gray-900 dark:text-white",
    baseUrl: "https://github.com",
  },
  {
    id: "medium",
    name: "Medium",
    icon: "FileText",
    color: "text-green-600",
    baseUrl: "https://medium.com",
  },
];

export function getPlatform(id: string): Platform | undefined {
  return platforms.find((p) => p.id === id);
}

export function getPlatformUrl(platform: Platform, handle: string): string {
  return `${platform.baseUrl}/${handle}`;
}
