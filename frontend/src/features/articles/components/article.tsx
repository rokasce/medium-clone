import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { mockArticles } from '@/pages/home';
import type { Article as IArticle } from '@/types';
import { Link, useRouter } from '@tanstack/react-router';
import { Bookmark, Edit3, MessageCircle, Send, Share2, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import { HtmlRenderer } from './html-renderer';
import { usePublishArticle } from '../hooks';

export function Article({ article }: { article: IArticle }) {
  const router = useRouter();
  const { mutate: publishArticle, isPending: isPublishing } =
    usePublishArticle();

  const isDraft = article?.status === 'Draft';

  const handlePublish = () => {
    publishArticle(article.id, {
      onSuccess: () => {
        toast.success('Article published successfully!');
        router.navigate({ to: '/articles/$slug', params: { slug: article.slug } });
      },
      onError: (error) => {
        toast.error('Failed to publish article', {
          description: error.message,
        });
      },
    });
  };

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl">Article not found</h1>
        <Link
          to="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Return to home
        </Link>
      </div>
    );
  }

  const relatedArticles = mockArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Article header */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={article.author.image}
                  alt={article.author.username}
                />
                <AvatarFallback>
                  {article.author.username
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link to="/profile" className="font-semibold hover:underline">
                {article.author.username}
              </Link>
              <div className="text-sm text-muted-foreground">
                {article.readingTimeMinutes} min read · {article.publishedAt}
              </div>
            </div>
          </div>

          {isDraft && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/articles/edit/$slug" params={{ slug: article.slug }}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={isPublishing}
              >
                <Send className="h-4 w-4 mr-2" />
                {isPublishing ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          )}
        </div>

        <Separator className="mb-6" />

        {/* Action bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => {}}
            >
              <ThumbsUp className="h-4 w-4" />
              {article.isClapped ? article.clapsCount + 1 : article.clapsCount}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              12
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Featured image */}
        {article.featuredImage && (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-96 object-cover rounded mb-8"
          />
        )}

        <HtmlRenderer html={article.content} />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags?.map((tag) => (
            <Button
              key={tag.slug}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              {tag.name}
            </Button>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Author card */}
        <div className="flex items-start gap-4 p-6 bg-muted rounded-lg mb-12">
          <Link to="/profile">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={article.author.image}
                alt={article.author.username}
              />
              <AvatarFallback>
                {article.author.username
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <Link
              to="/profile"
              className="font-semibold text-lg hover:underline"
            >
              {article.author.username}
            </Link>
            <p className="text-muted-foreground mt-2">{article.author.bio}</p>
            <Button variant="outline" size="sm" className="mt-4">
              Follow
            </Button>
          </div>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">More from Medium</h2>
            <div className="space-y-6">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.slug}
                  to="/articles/$slug"
                  params={{ slug: relatedArticle.slug }}
                  className="block group"
                >
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={relatedArticle.author.avatar}
                            alt={relatedArticle.author.name}
                          />
                          <AvatarFallback>
                            {relatedArticle.author.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {relatedArticle.author.name}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:underline">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {relatedArticle.readTime} min read
                      </div>
                    </div>
                    {relatedArticle.imageUrl && (
                      <img
                        src={relatedArticle.imageUrl}
                        alt={relatedArticle.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
