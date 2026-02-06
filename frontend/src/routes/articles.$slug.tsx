import { Article } from '@/features/articles/components/article';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/articles/$slug')({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  return <Article slug={slug} />;
}
