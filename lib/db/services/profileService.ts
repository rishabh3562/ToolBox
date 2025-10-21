import { connectDB } from '../connection';
import Profile from '../models/Profile';
import { Profile as IProfile } from '@/types/profile';

export class ProfileService {
  static async createProfile(profileData: Omit<IProfile, 'id'>): Promise<IProfile> {
    await connectDB();

    const profile = new Profile(profileData);
    const savedProfile = await profile.save();
    const { _id, ...rest } = savedProfile.toObject();

    return {
      ...rest,
      id: _id.toString()
    };
  }

  static async getAllProfiles(): Promise<IProfile[]> {
    await connectDB();

    const profiles = await Profile.find({}).sort({ createdAt: -1 });

    return profiles.map(profile => {
      const { _id, ...rest } = profile.toObject();
      return {
        ...rest,
        id: _id.toString()
      };
    });
  }

  static async getProfileById(id: string): Promise<IProfile | null> {
    await connectDB();

    const profile = await Profile.findById(id);

    if (!profile) return null;

    const { _id, ...rest } = profile.toObject();
    return {
      ...rest,
      id: _id.toString()
    };
  }

  static async updateProfile(id: string, updates: Partial<IProfile>): Promise<IProfile | null> {
    await connectDB();

    const profile = await Profile.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date().toISOString() },
      { new: true }
    );

    if (!profile) return null;

    const { _id, ...rest } = profile.toObject();
    return {
      ...rest,
      id: _id.toString()
    };
  }

  static async deleteProfile(id: string): Promise<boolean> {
    await connectDB();
    
    const result = await Profile.findByIdAndDelete(id);
    return !!result;
  }

  static async searchProfiles(query: string, platform?: string): Promise<IProfile[]> {
    await connectDB();
    
    const searchFilter: any = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { handle: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { categories: { $in: [new RegExp(query, 'i')] } }
      ]
    };

    if (platform && platform !== 'all') {
      searchFilter.platform = platform;
    }

    const profiles = await Profile.find(searchFilter).sort({ createdAt: -1 });

    return profiles.map(profile => {
      const { _id, ...rest } = profile.toObject();
      return {
        ...rest,
        id: _id.toString()
      };
    });
  }
}