import { connectDB } from '../connection';
import Template from '../models/Template';
import { Template as ITemplate } from '@/types';

export class TemplateService {
  static async createTemplate(templateData: Omit<ITemplate, 'id'>): Promise<ITemplate> {
    await connectDB();
    
    const template = new Template(templateData);
    const savedTemplate = await template.save();
    
    const { _id, ...rest } = savedTemplate.toObject();
    return {
      ...rest,
      id: _id.toString()
    };
  }

  static async getAllTemplates(): Promise<ITemplate[]> {
    await connectDB();
    
    const templates = await Template.find({}).sort({ createdAt: -1 });
    
    return templates.map(template => {
      const { _id, ...rest } = template.toObject();
      return {
        ...rest,
        id: _id.toString()
      };
    });
  }

  static async getTemplateById(id: string): Promise<ITemplate | null> {
    await connectDB();
    
    const template = await Template.findById(id);
    
    if (!template) return null;
    
    const { _id, ...rest } = template.toObject();
    return {
      ...rest,
      id: _id.toString()
    };
  }

  static async updateTemplate(id: string, updates: Partial<ITemplate>): Promise<ITemplate | null> {
    await connectDB();
    
    const template = await Template.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    
    if (!template) return null;
    
    const { _id, ...rest } = template.toObject();
    return {
      ...rest,
      id: _id.toString()
    };
  }

  static async deleteTemplate(id: string): Promise<boolean> {
    await connectDB();
    
    const result = await Template.findByIdAndDelete(id);
    return !!result;
  }

  static async getTemplatesByCategory(category: string): Promise<ITemplate[]> {
    await connectDB();
    
    const templates = await Template.find({ category }).sort({ createdAt: -1 });
    
    return templates.map(template => {
      const { _id, ...rest } = template.toObject();
      return {
        ...rest,
        id: _id.toString()
      };
    });
  }

  static async initializeDefaultTemplates(): Promise<void> {
    await connectDB();
    
    const count = await Template.countDocuments();
    if (count > 0) return; // Already initialized

    const defaultTemplates = [
      {
        name: "Blog Introduction",
        category: "blog" as const,
        content: `As a {{role}}, I've spent considerable time {{experience}}. You can find more of my work at {{portfolio_url}}.

Connect with me on {{linkedin_url}} to discuss more about {{expertise}}.`,
      },
      {
        name: "Professional Introduction",
        category: "email" as const,
        content: `Hi {{name}},

I hope this email finds you well. I'm {{your_name}}, a {{role}} with expertise in {{expertise}}. 

I'd love to discuss how I can help with {{project_type}}. You can check out my previous work at {{portfolio_url}}.

Best regards,
{{your_name}}`,
      },
      {
        name: "Tompate Reply",
        category: "email" as const,
        content: `Subject: Thank You for Your Interest – How Can I Help You?

Hi {{client_name}},

I noticed that you recently accessed my service through Topmate. Thank you for checking it out! 🙌

I'd love to learn more about your needs and how I can assist you. Whether you're looking for help with:

Improving your website's design or performance,
Optimizing it for better SEO and faster loading times, or
Building a brand-new website from scratch,
I'm here to help!

Feel free to reply to this email with a brief description of your project or any questions you might have. We can also set up a quick call to discuss your requirements and see how we can work together to achieve your goals. You can book a time directly through my Calendly link.

To learn more about my work, feel free to check out my {{portfolio_url}}, {{linkedin_url}}, or {{github_url}}.

Looking forward to hearing from you!

Best regards,
{{your_name}}
Freelance Web Developer
{{portfolio_url}} | {{linkedin_url}} | {{topmate_url}} | {{cal_url}}`,
      },
    ];

    await Template.insertMany(defaultTemplates);
  }
}