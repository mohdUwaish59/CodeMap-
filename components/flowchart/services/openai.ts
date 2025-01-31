import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateCode(systemArchitecture: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert software architect and developer. Generate production-ready, fully implemented code based on the provided system architecture JSON. 
          
          CRITICAL REQUIREMENTS:
          - Generate COMPLETE, detailed implementation code with full business logic
          - Include ALL necessary files, configurations, and dependencies
          - Implement proper error handling, logging, and monitoring
          - Follow best practices for security, performance, and scalability
          - Use TypeScript for type safety
          - Include comprehensive unit tests
          - Add Docker configuration for containerization
          - Include CI/CD pipeline configuration
          - Add detailed comments explaining complex logic
          - Implement proper validation and sanitization
          - Add proper environment configuration
          - Include database migrations and seeds
          - Implement caching where appropriate
          - Add rate limiting and security measures
          - Include API documentation
          - Implement proper authentication and authorization
          - Add monitoring and logging setup
          - Include load balancing configuration where needed
          
          RESPONSE FORMAT:
          - ONLY output code blocks with file paths as headers
          - NO explanatory text or descriptions
          - NO markdown outside of code blocks
          - Each file should be in a code block with its path as the header
          
          Example:
          \`\`\`/src/server/index.ts
          // Server implementation
          \`\`\`
          
          \`\`\`/src/types/index.ts
          // Type definitions
          \`\`\`
          `
        },
        {
          role: "user",
          content: `Generate complete production-ready implementation for this architecture: ${systemArchitecture}`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating code:', error);
    throw new Error('Failed to generate code. Please try again.');
  }
}