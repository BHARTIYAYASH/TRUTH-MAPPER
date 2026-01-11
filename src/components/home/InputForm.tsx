"use client";

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import * as pdfjsLib from 'pdfjs-dist';
import { useToast } from '@/hooks/use-toast';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={pending}
      >
        {pending ? <LoadingSpinner className="mr-2 h-5 w-5" /> : <Sparkles className="mr-2 h-5 w-5" />}
        {pending ? 'Analyzing...' : 'Analyze Arguments'}
      </Button>
    );
  }

type InputType = 'Topic' | 'URL' | 'Document';

export function InputForm({ formAction, authToken }: { formAction: (formData: FormData) => void; authToken: string | null }) {
  const [inputType, setInputType] = useState<InputType>('Topic');
  const [inputValue, setInputValue] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    toast({ title: 'Parsing File...', description: 'Extracting text from your document.' });

    if (file.type === 'application/pdf') {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            if (!e.target?.result) throw new Error("File reading failed");
            const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            let text = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map(item => ('str' in item ? item.str : '')).join(' ');
            }
            setInputValue(text);
            toast({ title: 'Success', description: 'File parsed successfully.'});
          } catch(err) {
            console.error('Error parsing PDF:', err);
            toast({
              variant: "destructive",
              title: "PDF Parsing Failed",
              description: "Could not extract text from the PDF. The file may be corrupt or image-based.",
            });
            setInputValue('');
          } finally {
            setIsParsing(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error reading PDF file:', error);
        toast({
          variant: "destructive",
          title: "File Read Error",
          description: "Could not read the selected PDF file.",
        });
        setInputValue('');
        setIsParsing(false);
      }

    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputValue(e.target?.result as string);
        setIsParsing(false);
        toast({ title: 'Success', description: 'File parsed successfully.'});
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "File Read Error",
          description: "Could not read the selected file.",
        });
        setIsParsing(false);
      }
      reader.readAsText(file);
    }
  };

  const getPlaceholder = () => {
    switch (inputType) {
      case 'Topic':
        return 'e.g., The pros and cons of universal basic income';
      case 'URL':
        return 'e.g., https://www.example.com/article';
      case 'Document':
        return 'Paste your document text here or upload a file...';
    }
  };

  const isSubmitDisabled = isParsing || !inputValue;

  return (
    <Card className="w-full border-4 shadow-[8px_8px_0px_hsl(var(--border))]">
      <CardContent className="p-2">
        <form action={formAction} className="space-y-4">
          <Tabs defaultValue="Topic" onValueChange={(value) => {
            setInputType(value as InputType);
            setInputValue(''); // Reset input value when changing tabs
          }}>
            <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
              <TabsTrigger value="Topic" className="rounded-sm border-2 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none">Topic</TabsTrigger>
              <TabsTrigger value="URL" className="rounded-sm border-2 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none">URL</TabsTrigger>
              <TabsTrigger value="Document" className="rounded-sm border-2 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none">Document</TabsTrigger>
            </TabsList>
            
            <div className="p-4">
                <input type="hidden" name="inputType" value={inputType} />
                {authToken && <input type="hidden" name="authToken" value={authToken} />}
                {inputType === 'URL' ? (
                     <Input
                        name="input"
                        type="url"
                        placeholder={getPlaceholder()}
                        className="h-14 text-base"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        required
                    />
                ) : (
                    <Textarea
                        name="input"
                        placeholder={getPlaceholder()}
                        className="min-h-[140px] text-base"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        readOnly={isParsing}
                        required
                    />
                )}
                {inputType === 'Document' && (
                    <div className="mt-4">
                        <Input type="file" onChange={handleFileChange} accept=".txt,.md,.pdf" className="text-sm"/>
                    </div>
                )}
            </div>
          </Tabs>
          <div className="px-4 pb-4">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
