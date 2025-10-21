import { connectDB } from '../connection';
import SchemaModel from '../models/Schema';
import { Schema as ISchema } from '@/types/schema';

export class SchemaService {
  static async createSchema(schemaData: Omit<ISchema, 'id'>): Promise<ISchema> {
    await connectDB();
    
    const schema = new SchemaModel(schemaData);
    const savedSchema = await schema.save();
    
    const { _id, ...rest } = savedSchema.toObject();
    return {
      ...rest,
      id: _id.toString()
    };
  }

  static async getAllSchemas(): Promise<ISchema[]> {
    await connectDB();
    
    const schemas = await SchemaModel.find({}).sort({ createdAt: -1 });
    
    return schemas.map(schema => {
      const { _id, ...rest } = schema.toObject();
      return {
        ...rest,
        id: _id.toString()
      };
    });
  }

  static async getSchemaById(id: string): Promise<ISchema | null> {
    await connectDB();
    
    const schema = await SchemaModel.findById(id);
    
    if (!schema) return null;
    
    const { _id, ...rest } = schema.toObject();
    return {
      ...rest,
      id: _id.toString()
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
    
    const { _id, ...rest } = schema.toObject();
    return {
      ...rest,
      id: _id.toString()
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
    
    return schemas.map(schema => {
      const { _id, ...rest } = schema.toObject();
      return {
        ...rest,
        id: _id.toString()
      };
    });
  }
}