import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditorContent } from '@tiptap/react';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { RichTextEditorMenuBar } from './rte-menu-bar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRichTextEditor } from '../hooks/use-rich-text-editor';
import { useCreateArticle, useUpdateArticle } from '../hooks';
import type { Article } from '@/types';
import {
  createArticleSchema,
  type CreateArticleInput,
} from '../schemas/article-schemas';

interface ArticleFormProps {
  title: string;
  description: string;
  submitLabel: string;
  submittingLabel: string;
  defaultValues: CreateArticleInput;
  onSubmit: (data: CreateArticleInput) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  title,
  description,
  submitLabel,
  submittingLabel,
  defaultValues,
  onSubmit,
  onSuccess,
  onError,
}) => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateArticleInput>({
    resolver: zodResolver(createArticleSchema),
    defaultValues,
  });

  const editor = useRichTextEditor({
    content: defaultValues.content,
    onChange: (html) => {
      form.setValue('content', html, { shouldValidate: true });
    },
    onBlur: () => {
      form.trigger('content');
    },
  });

  const handleSubmit = async (data: CreateArticleInput) => {
    setError(null);

    try {
      await onSubmit(data);
      form.reset();
      editor?.commands.clearContent();
      onSuccess?.();
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('An unknown error occurred.');
      setError(error.message);
      onError?.(error);
    }
  };

  const submitButtonText = form.formState.isSubmitting
    ? submittingLabel
    : submitLabel;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter your article title"
              {...form.register('title')}
              className={form.formState.errors.title ? 'border-red-500' : ''}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              type="text"
              placeholder="Enter your article subtitle"
              {...form.register('subtitle')}
              className={form.formState.errors.subtitle ? 'border-red-500' : ''}
            />
            {form.formState.errors.subtitle && (
              <p className="text-sm text-red-500">
                {form.formState.errors.subtitle.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <div
              className={`w-full border rounded-md ${form.formState.errors.content ? 'border-red-500 ring-2 ring-red-500' : 'border-input'}`}
            >
              <RichTextEditorMenuBar editor={editor} />
              <EditorContent editor={editor} className="w-full" />
            </div>
            {form.formState.errors.content && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {submitButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export const CreateArticleForm: React.FC = () => {
  const { navigate } = useRouter();
  const { mutateAsync: createArticle } = useCreateArticle();

  const handleSubmit = async (data: CreateArticleInput) => {
    const response = await createArticle(data);

    if (!response || !response.id) {
      throw new Error('Failed to create article');
    }

    navigate({ to: `/articles/preview/${response.slug}` });
  };

  return (
    <ArticleForm
      title="Create New Article"
      description="Fill in the details to create an article."
      submitLabel="Publish Article"
      submittingLabel="Publishing..."
      defaultValues={{ title: '', subtitle: '', content: '', tags: [] }}
      onSubmit={handleSubmit}
    />
  );
};

interface EditArticleFormProps {
  article: Article;
}

export const EditArticleForm: React.FC<EditArticleFormProps> = ({
  article,
}) => {
  const { navigate } = useRouter();
  const { mutateAsync: updateArticle } = useUpdateArticle();

  const handleSubmit = async (data: CreateArticleInput) => {
    await updateArticle({ id: article.id, data });
    navigate({ to: `/articles/preview/${article.slug}` });
  };

  const handleError = (error: Error) => {
    toast('Error updating article', {
      description: error.message,
    });
  };

  return (
    <ArticleForm
      title="Edit Article"
      description="Update your article content and settings."
      submitLabel="Update Article"
      submittingLabel="Updating..."
      defaultValues={{
        title: article.title ?? '',
        subtitle: article.subtitle ?? '',
        content: article.content ?? '',
        tags: article.tags?.map((tag) => tag.slug) ?? [],
      }}
      onSubmit={handleSubmit}
      onError={handleError}
    />
  );
};
