import { Button } from '@/shared/components/ui';
import { EditArticleForm } from '../components/article-form';
import type { Article } from '@/types';

interface EditPageProps {
  article: Article;
}

export default function EditPage({ article }: EditPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EditArticleForm article={article} />
        <div className="border-t border-border pt-6">
          <h3 className="font-semibold mb-4 text-foreground">Story Preview</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Include a high-quality image in your story to make it more inviting
            to readers.
          </p>
          <Button variant="outline">Add a cover image</Button>
        </div>
      </div>
    </div>
  );
}
