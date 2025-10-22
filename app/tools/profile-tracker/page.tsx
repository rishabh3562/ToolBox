"use client";

import { useState, useEffect } from "react";
import { Profile, PlatformType } from "@/types/profile";
import { platforms } from "@/lib/profiles/platforms";
import { ProfileService } from "@/lib/db/services/profileService";
import { ProfileCard } from "@/components/profiles/profile-card";
import { ProfileForm } from "@/components/profiles/profile-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import * as Icons from "lucide-react";

export default function ProfileTrackerPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<
    PlatformType | "all"
  >("all");
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const profilesData = await ProfileService.getAllProfiles();
      setProfiles(profilesData);
    } catch (error) {
      console.error("Error loading profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.categories.some((cat) =>
        cat.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesPlatform =
      selectedPlatform === "all" || profile.platform === selectedPlatform;

    return matchesSearch && matchesPlatform;
  });

  const handleAddProfile = async (profileData: Partial<Profile>) => {
    try {
      const newProfile = await ProfileService.createProfile({
        name: profileData.name!,
        handle: profileData.handle!,
        platform: profileData.platform!,
        imageUrl: profileData.imageUrl,
        description: profileData.description!,
        categories: profileData.categories!,
        favoriteContent: [],
        url: profileData.url!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setProfiles([newProfile, ...profiles]);
      setIsAddingProfile(false);
    } catch (error) {
      console.error("Error adding profile:", error);
    }
  };

  const handleUpdateProfile = async (profileData: Partial<Profile>) => {
    if (!editingProfile) return;

    try {
      const updatedProfile = await ProfileService.updateProfile(
        editingProfile.id,
        profileData,
      );

      if (updatedProfile) {
        setProfiles(
          profiles.map((p) =>
            p.id === editingProfile.id ? updatedProfile : p,
          ),
        );
      }

      setEditingProfile(undefined);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteProfile = async (profile: Profile) => {
    try {
      const success = await ProfileService.deleteProfile(profile.id);

      if (success) {
        setProfiles(profiles.filter((p) => p.id !== profile.id));
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Profile Tracker</h1>
          <p className="text-muted-foreground">
            Track and organize your favorite creators across different platforms
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isAddingProfile} onOpenChange={setIsAddingProfile}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Profile</DialogTitle>
              </DialogHeader>
              <ProfileForm
                onSubmit={handleAddProfile}
                onCancel={() => setIsAddingProfile(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setSelectedPlatform("all")}>
              All Platforms
            </TabsTrigger>
            {platforms.map((platform) => {
              const Icon = Icons[
                platform.icon as keyof typeof Icons
              ] as React.ComponentType<{ className?: string }>;
              return (
                <TabsTrigger
                  key={platform.id}
                  value={platform.id}
                  onClick={() =>
                    setSelectedPlatform(platform.id as PlatformType)
                  }
                  className="flex items-center gap-2"
                >
                  {Icon && <Icon className={`w-4 h-4 ${platform.color}`} />}
                  {platform.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onEdit={setEditingProfile}
                onDelete={handleDeleteProfile}
              />
            ))}
            {filteredProfiles.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  No profiles found. Add your first profile to get started!
                </p>
              </div>
            )}
          </div>
        </Tabs>

        {editingProfile && (
          <Dialog
            open={!!editingProfile}
            onOpenChange={() => setEditingProfile(undefined)}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <ProfileForm
                profile={editingProfile}
                onSubmit={handleUpdateProfile}
                onCancel={() => setEditingProfile(undefined)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
