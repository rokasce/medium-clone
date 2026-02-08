import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/shared/components/ui';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/features';
import { useMyArticles } from '@/features/articles/hooks';
import type { ArticleSummary } from '@/types';
import { Edit3, FileText } from 'lucide-react';

type ProfileTab = 'published' | 'drafts' | 'about';

export function Profile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('published');
  const { user: currentUser } = useAuth();

  const { data: myArticles, isLoading } = useMyArticles();

  const publishedArticles =
    myArticles?.filter((a) => a.status === 'Published') ?? [];
  const draftArticles = myArticles?.filter((a) => a.status === 'Draft') ?? [];

  const tabs: { id: ProfileTab; label: string; count?: number }[] = [
    { id: 'published', label: 'Published', count: publishedArticles.length },
    { id: 'drafts', label: 'Drafts', count: draftArticles.length },
    { id: 'about', label: 'About' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Profile header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={currentUser?.image ?? ''}
                  alt={currentUser?.username}
                />
                <AvatarFallback>
                  {currentUser?.username
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {currentUser?.username}
                </h1>
                <p className="text-muted-foreground mb-4 max-w-xl">
                  {currentUser?.bio}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>{currentUser?.followersCount ?? 0} Followers</span>
                  <span>{currentUser?.followingCount ?? 0} Following</span>
                </div>
              </div>
            </div>
            <Button variant="outline">Edit profile</Button>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Navigation tabs */}
        <div className="flex gap-8 mb-8 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({tab.count})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'published' && (
          <ArticleList
            articles={publishedArticles}
            isLoading={isLoading}
            emptyMessage="You haven't published any stories yet."
            emptyAction={
              <Link to="/write">
                <Button>Write your first story</Button>
              </Link>
            }
          />
        )}

        {activeTab === 'drafts' && (
          <ArticleList
            articles={draftArticles}
            isLoading={isLoading}
            emptyMessage="You don't have any drafts."
            emptyAction={
              <Link to="/write">
                <Button>Start writing</Button>
              </Link>
            }
            isDraft
          />
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              About {currentUser?.username}
            </h2>
            {currentUser?.bio ? (
              <p className="text-muted-foreground leading-relaxed">
                {currentUser.bio}
              </p>
            ) : (
              <p className="text-muted-foreground italic">No bio added yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleList({
  articles,
  isLoading,
  emptyMessage,
  emptyAction,
  isDraft = false,
}: {
  articles: ArticleSummary[];
  isLoading: boolean;
  emptyMessage: string;
  emptyAction: React.ReactNode;
  isDraft?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b border-border pb-8 animate-pulse">
            <div className="flex gap-6">
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
              <div className="hidden sm:block w-40 h-28 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{emptyMessage}</p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {articles.map((article) => (
        <article key={article.slug} className="border-b border-border pb-8">
          <div className="flex gap-6">
            <Link
              to={isDraft ? '/articles/preview/$slug' : '/articles/$slug'}
              params={{ slug: article.slug }}
              search={isDraft ? { status: 'Draft' } : undefined}
              className="flex-1 group"
            >
              <div className="flex items-center gap-2 mb-2">
                {isDraft && (
                  <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                    <FileText className="h-3 w-3" />
                    Draft
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:underline line-clamp-2">
                {article.title || 'Untitled'}
              </h2>

              {article.subtitle && (
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {article.subtitle}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {isDraft ? 'Last edited' : 'Published'}{' '}
                  {new Date(
                    isDraft
                      ? article.createdAt
                      : (article.publishedAt ?? article.createdAt)
                  ).toLocaleDateString()}
                </span>
                <span>·</span>
                <span>{article.readingTimeMinutes} min read</span>
                {!isDraft && (
                  <>
                    <span>·</span>
                    <span>{article.clapsCount} claps</span>
                  </>
                )}
              </div>
            </Link>

            {article.featuredImageUrl && (
              <div className="hidden sm:block w-40 h-28 shrink-0">
                <img
                  src={article.featuredImageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}

            {isDraft && (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 self-center"
                asChild
              >
                <Link to="/articles/edit/$slug" params={{ slug: article.slug }}>
                  <Edit3 className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
