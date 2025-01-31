'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateCode } from '../services/openai';

interface CodeGenerationProps {
  flowDescription: string;
}

export default function CodeGeneration({ flowDescription }: CodeGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGenerateCode = async () => {
    if (!flowDescription) {
      setGeneratedCode('Please create a flowchart first before generating code.');
      return;
    }

    setIsGenerating(true);
    try {
      const code = await generateCode(flowDescription);
      setGeneratedCode(code);
    } catch (error) {
      console.error('Error:', error);
      setGeneratedCode('Failed to generate code. Please try again.');
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
    <div className="w-full max-w-4xl mx-auto p-6">
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
                {copied ? 'Copied!' : 'Copy Code'}
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

        {generatedCode ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{generatedCode}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            {flowDescription ? 
              'Click "Generate Code" to create code based on your flowchart' :
              'Create a flowchart first to generate code'
            }
          </div>
        )}
      </Card>
    </div>
  );
}