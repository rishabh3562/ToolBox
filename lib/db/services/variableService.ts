import { connectDB } from '../connection';
import Variable from '../models/Variable';
import { Variable as IVariable } from '@/types';

export class VariableService {
  static async createVariable(variableData: IVariable): Promise<IVariable> {
    await connectDB();
    
    const variable = new Variable(variableData);
    const savedVariable = await variable.save();
    
    return savedVariable.toObject();
  }

  static async getAllVariables(): Promise<IVariable[]> {
    await connectDB();
    
    const variables = await Variable.find({}).sort({ key: 1 });
    
    return variables.map(variable => variable.toObject());
  }

  static async getVariableByKey(key: string): Promise<IVariable | null> {
    await connectDB();
    
    const variable = await Variable.findOne({ key });
    
    if (!variable) return null;
    
    return variable.toObject();
  }

  static async updateVariable(key: string, updates: Partial<IVariable>): Promise<IVariable | null> {
    await connectDB();
    
    const variable = await Variable.findOneAndUpdate(
      { key },
      updates,
      { new: true, upsert: true }
    );
    
    if (!variable) return null;
    
    return variable.toObject();
  }

  static async deleteVariable(key: string): Promise<boolean> {
    await connectDB();
    
    const result = await Variable.findOneAndDelete({ key });
    return !!result;
  }

  static async initializeDefaultVariables(): Promise<void> {
    await connectDB();
    
    const count = await Variable.countDocuments();
    if (count > 0) return; // Already initialized

    const defaultVariables = [
      {
        key: "client_name",
        value: "",
        label: "Client Name",
        description: "Client full name as you want it to appear",
      },
      {
        key: "your_name",
        value: "Rishabh Dubey",
        label: "Your Name",
        description: "Your full name as you want it to appear",
      },
      {
        key: "role",
        value: "Web Dev & AWS Certified Cloud practioner",
        label: "Professional Role",
        description: "Your current professional title",
      },
      {
        key: "portfolio_url",
        value: "https://dubeyrishabh108.vercel.app/home",
        label: "Portfolio URL",
        description: "Link to your portfolio website",
      },
      {
        key: "linkedin_url",
        value: "https://www.linkedin.com/in/rishabh108/",
        label: "LinkedIn URL",
        description: "Your LinkedIn profile URL",
      },
      {
        key: "topmate_url",
        value: "https://topmate.io/rishabh108",
        label: "Tompate URL",
        description: "Your Tompate profile URL",
      },
      {
        key: "github_url",
        value: "https://github.com/rishabh3562",
        label: "Github URL",
        description: "Your Github profile URL",
      },
      {
        key: "cal_url",
        value: "https://cal.com/dubeyrishabh108",
        label: "Cal.com URL",
        description: "Your Tompate profile URL",
      },
      {
        key: "expertise",
        value: "Web Development",
        label: "Areas of Expertise",
        description: "Your main professional skills and expertise",
      },
    ];

    await Variable.insertMany(defaultVariables);
  }
}