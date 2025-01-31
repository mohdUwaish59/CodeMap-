'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateCode } from '../services/openai';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CodeBlock } from '@/components/flowchart/components/CodeBlock';

interface CodeGenerationProps {
  flowDescription: string;
}

export default function CodeGeneration({ flowDescription }: CodeGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGenerateCode = async () => {
    if (!flowDescription) {
      setGeneratedCode('```\nPlease create a flowchart first before generating code.\n```');
      return;
    }

    setIsGenerating(true);
    try {
      const code = await generateCode(flowDescription);
      setGeneratedCode(code);
    } catch (error) {
      console.error('Error:', error);
      setGeneratedCode('```\nFailed to generate code. Please try again.\n```');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Generated Code</h2>
          <div className="flex gap-2">
            {generatedCode && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={isGenerating}
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Copy All'}
              </Button>
            )}
            <Button
              onClick={handleGenerateCode}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Code'
              )}
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)] rounded-md border">
          {generatedCode ? (
            <div className="p-4">
              <ReactMarkdown
                components={{
                  pre: ({ children }) => children,
                  code: ({ children, className }) => {
                    if (typeof children !== 'string') return null;
                    
                    const language = (className?.replace('language-', '') || 'typescript').toLowerCase();
                    const [filename, ...codeLines] = children.split('\n');
                    const code = codeLines.join('\n');
                    
                    return (
                      <CodeBlock
                        code={code}
                        language={language}
                        filename={filename.startsWith('/') ? filename : undefined}
                      />
                    );
                  },
                }}
              >
                {generatedCode}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              {flowDescription ? 
                'Click "Generate Code" to create implementation code based on your architecture' :
                'Create a flowchart first to generate code'
              }
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}