'use client';

import { Profile } from '@/types/profile';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getPlatform } from '@/lib/profiles/platforms';
import * as Icons from 'lucide-react';
import Link from 'next/link';

interface ProfileCardProps {
  profile: Profile;
  onEdit?: (profile: Profile) => void;
  onDelete?: (profile: Profile) => void;
}

export function ProfileCard({ profile, onEdit, onDelete }: ProfileCardProps) {
  const platform = getPlatform(profile.platform);
  const PlatformIcon = platform ? Icons[platform.icon as keyof typeof Icons] : Icons.Globe;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="relative">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <PlatformIcon className={`w-8 h-8 ${platform?.color}`} />
            </div>
          )}
          <div className="absolute -bottom-2 -right-2">
            <PlatformIcon className={`w-5 h-5 ${platform?.color}`} />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">@{profile.handle}</p>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="ghost" size="icon" onClick={() => onEdit(profile)}>
                  <Icons.Edit className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="icon" onClick={() => onDelete(profile)}>
                  <Icons.Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {profile.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {profile.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>

          {profile.favoriteContent.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Favorite Content</h4>
              <div className="space-y-2">
                {profile.favoriteContent.slice(0, 2).map((content) => (
                  <Link
                    key={content.id}
                    href={content.url}
                    target="_blank"
                    className="block text-sm hover:underline text-muted-foreground"
                  >
                    {content.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}