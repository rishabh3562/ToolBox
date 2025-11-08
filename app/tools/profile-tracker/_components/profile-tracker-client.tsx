"use client";

import { useState, useEffect } from "react";
import { Profile, PlatformType } from "@/types/profile";
import { platforms } from "@/lib/profiles/platforms";
import { ProfileCard } from "@/components/profiles/profile-card";
import { ProfileForm } from "@/components/profiles/profile-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { api } from "@/lib/api/client";

interface ProfileTrackerClientProps {
  initialProfiles: Profile[];
}

export function ProfileTrackerClient({
  initialProfiles,
}: ProfileTrackerClientProps) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>(initialProfiles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setFilteredProfiles(
        profiles.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.username?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProfiles(profiles);
    }
  }, [searchQuery, profiles]);

  const handleCreateProfile = async (profile: Partial<Profile>) => {
    try {
      const newProfile = await api.profiles.create(profile);
      setProfiles([newProfile, ...profiles]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  const handleUpdateProfile = async (id: string, updates: Partial<Profile>) => {
    try {
      const updated = await api.profiles.update(id, updates);
      setProfiles(profiles.map((p) => (p.id === id ? updated : p)));
      setEditingProfile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    try {
      await api.profiles.delete(id);
      setProfiles(profiles.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Profile Tracker</h1>
          <p className="text-muted-foreground">
            Track and manage your online profiles
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Profile
          </Button>
        </div>

        {filteredProfiles.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No profiles found. Add your first profile!
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onEdit={() => setEditingProfile(profile)}
                onDelete={() => handleDeleteProfile(profile.id)}
              />
            ))}
          </div>
        )}

        {(isFormOpen || editingProfile) && (
          <ProfileForm
            profile={editingProfile}
            platforms={platforms}
            onSubmit={
              editingProfile
                ? (updates) => handleUpdateProfile(editingProfile.id, updates)
                : handleCreateProfile
            }
            onClose={() => {
              setIsFormOpen(false);
              setEditingProfile(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
