"use client";

import { useState } from "react";
import { Profile, PlatformType } from "@/types/profile";
import { platforms } from "@/lib/profiles/platforms";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Icons from "lucide-react";

interface ProfileFormProps {
  profile?: Profile;
  onSubmit: (profile: Partial<Profile>) => void;
  onCancel: () => void;
}

export function ProfileForm({ profile, onSubmit, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    handle: profile?.handle || "",
    platform: profile?.platform || ("youtube" as PlatformType),
    imageUrl: profile?.imageUrl || "",
    description: profile?.description || "",
    categories: profile?.categories.join(", ") || "",
    url: profile?.url || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      categories: formData.categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Creator name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="handle">Handle/Username</Label>
              <Input
                id="handle"
                value={formData.handle}
                onChange={(e) =>
                  setFormData({ ...formData, handle: e.target.value })
                }
                placeholder="@handle"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Platform</Label>
            <Select
              value={formData.platform}
              onValueChange={(value) =>
                setFormData({ ...formData, platform: value as PlatformType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => {
                  const Icon = Icons[
                    platform.icon as keyof typeof Icons
                  ] as React.ComponentType<{ className?: string }>;
                  return (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center gap-2">
                        {Icon && (
                          <Icon className={`w-4 h-4 ${platform.color}`} />
                        )}
                        <span>{platform.name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Profile Image URL (optional)</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What does this creator do?"
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">Categories (comma-separated)</Label>
            <Input
              id="categories"
              value={formData.categories}
              onChange={(e) =>
                setFormData({ ...formData, categories: e.target.value })
              }
              placeholder="Tech, Productivity, Entertainment"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Profile URL</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="https://platform.com/profile"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {profile ? "Update Profile" : "Add Profile"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
