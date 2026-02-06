import { Button } from '@/shared/components/ui';
import { CreateArticleForm } from '../components/article-form';

export default function WritePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <CreateArticleForm />

        {/* Publishing options */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <h3 className="font-semibold mb-4 dark:text-white">Story Preview</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Include a high-quality image in your story to make it more inviting
            to readers.
          </p>
          <Button variant="outline">Add a cover image</Button>
        </div>
      </div>
    </div>
  );
}
