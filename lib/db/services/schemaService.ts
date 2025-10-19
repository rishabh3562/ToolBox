import connectDB from '../connection';
import SchemaModel, { SchemaDocument } from '../models/Schema';
import { Schema as ISchema } from '@/types/schema';

export class SchemaService {
  static async createSchema(schemaData: Omit<ISchema, 'id'>): Promise<ISchema> {
    await connectDB();
    
    const schema = new SchemaModel(schemaData);
    const savedSchema = await schema.save();
    
    return {
      id: savedSchema._id.toString(),
      ...savedSchema.toObject()
    };
  }

  static async getAllSchemas(): Promise<ISchema[]> {
    await connectDB();
    
    const schemas = await SchemaModel.find({}).sort({ createdAt: -1 });
    
    return schemas.map(schema => ({
      id: schema._id.toString(),
      ...schema.toObject()
    }));
  }

  static async getSchemaById(id: string): Promise<ISchema | null> {
    await connectDB();
    
    const schema = await SchemaModel.findById(id);
    
    if (!schema) return null;
    
    return {
      id: schema._id.toString(),
      ...schema.toObject()
    };
  }

  static async updateSchema(id: string, updates: Partial<ISchema>): Promise<ISchema | null> {
    await connectDB();
    
    const schema = await SchemaModel.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    
    if (!schema) return null;
    
    return {
      id: schema._id.toString(),
      ...schema.toObject()
    };
  }

  static async deleteSchema(id: string): Promise<boolean> {
    await connectDB();
    
    const result = await SchemaModel.findByIdAndDelete(id);
    return !!result;
  }

  static async searchSchemas(query: string): Promise<ISchema[]> {
    await connectDB();
    
    const searchFilter = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    const schemas = await SchemaModel.find(searchFilter).sort({ createdAt: -1 });
    
    return schemas.map(schema => ({
      id: schema._id.toString(),
      ...schema.toObject()
    }));
  }
}