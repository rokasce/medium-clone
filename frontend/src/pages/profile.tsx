import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/shared/components/ui';
import { Link } from '@tanstack/react-router';
import { mockArticles } from './home';
import { useAuth } from '@/features';

export function Profile() {
  const userArticles = mockArticles.slice(0, 3);
  const { user: currentUser } = useAuth();

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
                  alt={currentUser?.userName}
                />
                <AvatarFallback>
                  {currentUser?.userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {currentUser?.userName}
                </h1>
                <p className="text-muted-foreground mb-4 max-w-xl">
                  {currentUser?.bio}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>{currentUser?.followersCount} Followers</span>
                  <span>{currentUser?.followingCount} Following</span>
                </div>
              </div>
            </div>
            <Button variant="outline">Edit profile</Button>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Navigation tabs */}
        <div className="flex gap-8 mb-8 border-b border-border">
          <button className="pb-3 border-b-2 border-foreground font-semibold">
            Home
          </button>
          <button className="pb-3 text-muted-foreground hover:text-foreground">
            Lists
          </button>
          <button className="pb-3 text-muted-foreground hover:text-foreground">
            About
          </button>
        </div>

        {/* User's articles */}
        <div className="space-y-8">
          {userArticles.map((article) => (
            <article
              key={article.slug}
              className="border-b border-border pb-8"
            >
              <Link to={`/articles/${article.slug}`} className="block group">
                <div className="flex gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2 group-hover:underline line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{article.publishedAt}</span>
                      <span>·</span>
                      <span>{article.readTime} min read</span>
                      <span>·</span>
                      <span>{article.claps} claps</span>
                    </div>
                  </div>

                  {article.imageUrl && (
                    <div className="hidden sm:block w-40 h-28 shrink-0">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Empty state for no articles */}
        {userArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              You haven't published any stories yet.
            </p>
            <Link to="/write">
              <Button>Write your first story</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
