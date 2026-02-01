import { AuthenticatedLayout, PublicLayout } from '@/app/layouts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks';
import { Link } from '@tanstack/react-router';

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <AuthenticatedLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.userName}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's what's happening in your blog today.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Your Drafts</CardTitle>
                <CardDescription>
                  Continue working on your drafts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/dashboard">View Drafts</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Write</CardTitle>
                <CardDescription>Start a new article</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link to="/write">New Article</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Explore</CardTitle>
                <CardDescription>Discover new articles</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/explore">Browse Articles</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Stay curious.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
        <Button size="lg" className="mt-8">
          Start reading
        </Button>
      </div>
    </PublicLayout>
  );
}
