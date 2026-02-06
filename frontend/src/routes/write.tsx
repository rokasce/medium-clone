import { createFileRoute } from '@tanstack/react-router';
import { WritePage } from '@/features/articles';

export const Route = createFileRoute('/write')({
  component: CreateArticlePage,
});

function CreateArticlePage() {
  return <WritePage />;
}
