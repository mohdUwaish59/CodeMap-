import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateCode(flowchartJSON: string, language: string = "Python"): Promise<string> {
  try {
    const prompt = `
      You are an intelligent AI agent specialized in translating flowcharts into structured, efficient, and optimized code. 
      You will receive a JSON representation of a flowchart, which describes an algorithm using nodes and connections. 
      Your task is to analyze this JSON, understand the logical flow, and generate high-quality, well-commented, and efficient code in the specified programming language.

      ### **Guidelines for Code Generation:**
      1. **Understand the JSON Structure:**
         - The JSON contains nodes representing operations, conditions, loops, function calls, and outputs.
         - Each node has a unique ID and specifies its type (e.g., "start", "process", "decision", "loop", "end").
         - The connections define the logical sequence of execution.

      2. **Interpret Control Flow:**
         - Maintain correct execution order based on node connections.
         - Implement **conditional branches** (if-else statements) for decision nodes.
         - Implement **loops** (for, while) when encountering loop nodes.
         - Implement **function calls** for modularization if functions are present.

      3. **Generate Readable & Efficient Code:**
         - Use meaningful variable names based on the flowchart.
         - Write structured, well-commented, and readable code.
         - Optimize repetitive structures using functions where needed.
         - Ensure proper indentation and syntax.

      4. **Output Format:**
         - Provide a clean, executable code snippets.
         - Include necessary imports (if required).
         - Ensure the main function (if applicable) is properly structured.

      ### **Flowchart JSON Input:**
      ${flowchartJSON}

      Now, based on the provided flowchart, generate optimized and structured code. Do not leave anything for user to add in the logic. Always generate full and complete logic.**.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert AI that converts flowcharts into high-quality, production-ready code."
        },
        {
          role: "user",
          content: prompt
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
