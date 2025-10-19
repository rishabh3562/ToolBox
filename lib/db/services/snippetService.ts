import connectDB from '../connection';
import Snippet, { SnippetDocument } from '../models/Snippet';
import { Snippet as ISnippet } from '@/types/snippet';

export class SnippetService {
  static async createSnippet(snippetData: Omit<ISnippet, 'id'>): Promise<ISnippet> {
    await connectDB();
    
    const snippet = new Snippet(snippetData);
    const savedSnippet = await snippet.save();
    
    return {
      id: savedSnippet._id.toString(),
      ...savedSnippet.toObject()
    };
  }

  static async getAllSnippets(): Promise<ISnippet[]> {
    await connectDB();
    
    const snippets = await Snippet.find({}).sort({ createdAt: -1 });
    
    return snippets.map(snippet => ({
      id: snippet._id.toString(),
      ...snippet.toObject()
    }));
  }

  static async getSnippetById(id: string): Promise<ISnippet | null> {
    await connectDB();
    
    const snippet = await Snippet.findById(id);
    
    if (!snippet) return null;
    
    return {
      id: snippet._id.toString(),
      ...snippet.toObject()
    };
  }

  static async updateSnippet(id: string, updates: Partial<ISnippet>): Promise<ISnippet | null> {
    await connectDB();
    
    const snippet = await Snippet.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date().toISOString() },
      { new: true }
    );
    
    if (!snippet) return null;
    
    return {
      id: snippet._id.toString(),
      ...snippet.toObject()
    };
  }

  static async deleteSnippet(id: string): Promise<boolean> {
    await connectDB();
    
    const result = await Snippet.findByIdAndDelete(id);
    return !!result;
  }

  static async searchSnippets(query: string, category?: string): Promise<ISnippet[]> {
    await connectDB();
    
    const searchFilter: any = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    };

    if (category && category !== 'all') {
      searchFilter.category = category;
    }

    const snippets = await Snippet.find(searchFilter).sort({ createdAt: -1 });
    
    return snippets.map(snippet => ({
      id: snippet._id.toString(),
      ...snippet.toObject()
    }));
  }

  static async getSnippetsByCategory(category: string): Promise<ISnippet[]> {
    await connectDB();
    
    const snippets = await Snippet.find({ category }).sort({ createdAt: -1 });
    
    return snippets.map(snippet => ({
      id: snippet._id.toString(),
      ...snippet.toObject()
    }));
  }

  static async getSnippetsByLanguage(language: string): Promise<ISnippet[]> {
    await connectDB();
    
    const snippets = await Snippet.find({ language }).sort({ createdAt: -1 });
    
    return snippets.map(snippet => ({
      id: snippet._id.toString(),
      ...snippet.toObject()
    }));
  }
}