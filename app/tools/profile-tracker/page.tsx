import { Metadata } from "next";
import { ProfileService } from "@/lib/db/services/profileService";
import { ProfileTrackerClient } from "./_components/profile-tracker-client";

export const metadata: Metadata = {
  title: "Profile Tracker | ToolBox",
  description:
    "Track and manage your online profiles across different platforms. Monitor status and keep notes organized.",
  openGraph: {
    title: "Profile Tracker | ToolBox",
    description: "Track and manage your online profiles across different platforms",
    type: "website",
  },
};

export default async function ProfileTrackerPage() {
  // Server-side data fetching
  let initialProfiles;

  try {
    initialProfiles = await ProfileService.getAllProfiles();
  } catch (error) {
    console.error("Error loading initial profiles:", error);
    initialProfiles = [];
  }

  return <ProfileTrackerClient initialProfiles={initialProfiles} />;
}
