import { useState, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditorContent } from '@tiptap/react';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Plus, X, Loader2, ImageIcon } from 'lucide-react';
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
import { imageApi } from '../api/image-api';
import type { Article } from '@/types';
import {
  createArticleSchema,
  tagSchema,
  type CreateArticleInput,
  type UpdateArticleInput,
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
  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateArticleInput>({
    resolver: zodResolver(createArticleSchema),
    defaultValues,
  });

  const tags = useWatch({ control: form.control, name: 'tags' }) ?? [];
  const featuredImageUrl = useWatch({
    control: form.control,
    name: 'featuredImageUrl',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const response = await imageApi.uploadArticleImage(file);
      form.setValue('featuredImageUrl', response.url, { shouldValidate: true });
      toast.success('Image uploaded successfully');
    } catch (err) {
      console.error('Failed to upload image:', err);
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    form.setValue('featuredImageUrl', null, { shouldValidate: true });
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    setTagError(null);

    if (tags.includes(newTag)) {
      setTagError('Tag already exists');
      return;
    }

    const result = tagSchema.safeParse(newTag);
    if (!result.success) {
      setTagError(result.error?.message ?? 'Invalid tag');
      return;
    }

    form.setValue('tags', [...tags, newTag], { shouldValidate: true });
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      'tags',
      tags.filter((tag) => tag !== tagToRemove),
      { shouldValidate: true }
    );
  };

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

          <div className="space-y-2">
            <Label>Featured Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {featuredImageUrl ? (
              <div className="relative">
                <img
                  src={featuredImageUrl}
                  alt="Featured"
                  className="w-full max-h-64 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-md flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/50 transition-colors disabled:opacity-50"
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Uploading...
                    </span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload featured image
                    </span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags (up to 5)</Label>

            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full"
                >
                  <span className="text-sm">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive text-muted-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {tags.length < 5 && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setTagError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className={`max-w-xs ${tagError ? 'border-red-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tagError && <p className="text-sm text-red-500">{tagError}</p>}
              </div>
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
      defaultValues={{
        title: '',
        subtitle: '',
        content: '',
        tags: [],
        featuredImageUrl: null,
      }}
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
    await updateArticle({ id: article.id, data: data as UpdateArticleInput });
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
        featuredImageUrl: article.featuredImageUrl ?? null,
      }}
      onSubmit={handleSubmit}
      onError={handleError}
    />
  );
};
