import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface GeminiResponse {
  text: string;
  done: boolean;
}

export type GeminiCallback = (response: GeminiResponse) => void;

export async function streamGeminiResponse(
  prompt: string,
  context: string,
  onResponse: GeminiCallback
) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContentStream(
      `Context: ${context}\n\nPrompt: ${prompt}`
    );

    for await (const chunk of result.stream) {
      const text = chunk.text();
      onResponse({ text, done: false });
    }
    
    onResponse({ text: '', done: true });
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

export const generateDescription = async (
  projectDescription: string,
  onResponse: GeminiCallback
) => {
  const context = `
    You are a professional technical writer specializing in GitHub repository descriptions.
    Create a concise, engaging, and professional description that highlights the key features
    and purpose of the project. The description should be between 50-100 characters.
  `;
  
  await streamGeminiResponse(projectDescription, context, onResponse);
};

export const generateTags = async (
  projectDescription: string,
  onResponse: GeminiCallback
) => {
  const context = `
    You are a GitHub tag specialist. Analyze the project description and generate
    5-8 relevant tags that will help with project discoverability. Return only
    the tags separated by commas, without any additional text.
  `;
  
  await streamGeminiResponse(projectDescription, context, onResponse);
};

export const generateReadme = async (
  projectData: {
    title: string;
    description: string;
    features: string[];
    installation?: string;
    usage?: string;
    contributing?: string;
    license: string;
  },
  onResponse: GeminiCallback
) => {
  const context = `
    You are a README.md generator. Create a professional README file using the
    provided information. Include all sections if available, and format them
    properly using markdown syntax. Make it engaging and well-structured.
  `;
  
  await streamGeminiResponse(JSON.stringify(projectData), context, onResponse);
};