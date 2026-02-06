import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
} from '@/shared/components/ui';
import { Link } from '@tanstack/react-router';
import { Bookmark } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();

  const trendingTags = [
    'Programming',
    'Web Development',
    'React',
    'TypeScript',
    'Design',
    'JavaScript',
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          {user?.image && (
            <img
              src={user.image}
              alt={user.username}
              className="h-16 w-16 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-muted-foreground mt-1">
              {user?.email}
              {user?.bio && <span className="block text-sm">{user.bio}</span>}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Your Drafts</CardTitle>
              <CardDescription>Continue working on your drafts</CardDescription>
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
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content */}
        <div className="lg:col-span-8">
          <div className="space-y-8">
            {mockArticles.map((article) => (
              <article
                key={article.slug}
                className="border-b border-border pb-8"
              >
                <Link
                  to="/articles/$slug"
                  params={{ slug: article.slug }}
                  className="block group"
                >
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={article.author.avatar}
                            alt={article.author.name}
                          />
                          <AvatarFallback>
                            {article.author.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">
                          {article.author.name}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold mb-2 group-hover:underline line-clamp-2 text-foreground">
                        {article.title}
                      </h2>

                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{article.publishedAt}</span>
                          <span>·</span>
                          <span>{article.readTime} min read</span>
                          <span>·</span>
                          <span>{article.claps} claps</span>
                        </div>

                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <Bookmark className="h-4 w-4" />
                        </Button>
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
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-4">
          <div className="sticky top-20">
            <div className="mb-6">
              <h3 className="font-semibold mb-4 text-foreground">
                Trending on Medium
              </h3>
              <div className="space-y-4">
                {mockArticles.slice(0, 3).map((article, index) => (
                  <Link
                    key={article.slug}
                    to="/articles/$slug"
                    params={{ slug: article.slug }}
                    className="block group"
                  >
                    <div className="flex gap-4">
                      <span className="text-3xl text-muted-foreground font-serif">
                        0{index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-5 w-5">
                            <AvatarImage
                              src={article.author.avatar}
                              alt={article.author.name}
                            />
                            <AvatarFallback>
                              {article.author.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-foreground">
                            {article.author.name}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm line-clamp-2 group-hover:underline text-foreground">
                          {article.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="font-semibold mb-4 text-foreground">
                Discover more of what matters to you
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export const mockArticles: Article[] = [
  {
    slug: '1',
    title: 'The Future of Web Development: What to Expect in 2026',
    excerpt:
      "As we move further into 2026, the landscape of web development continues to evolve at a rapid pace. Let's explore the key trends shaping our industry.",
    content: `
# The Future of Web Development: What to Expect in 2026

As we move further into 2026, the landscape of web development continues to evolve at a rapid pace. Let's explore the key trends shaping our industry.

## AI-Powered Development Tools

Artificial intelligence has become an integral part of the development workflow. Modern IDEs now offer intelligent code completion that understands context better than ever before.

## Component-Driven Architecture

The shift towards component-driven development has revolutionized how we build web applications. Reusable components are now the standard, not the exception.

## Performance First

With Core Web Vitals becoming increasingly important, developers are prioritizing performance from day one. This shift has led to faster, more responsive web applications.

## Conclusion

The future of web development is bright, with new tools and methodologies emerging to help us build better experiences for users worldwide.
    `,
    author: {
      name: 'Sarah Chen',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Senior Software Engineer at TechCorp',
    },
    readTime: 8,
    publishedAt: '2026-02-01',
    tags: ['Web Development', 'Technology', 'Programming'],
    claps: 1284,
    imageUrl:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200',
  },
  {
    slug: '2',
    title: 'Building Scalable React Applications: A Comprehensive Guide',
    excerpt:
      'Learn the best practices for building React applications that can scale from small projects to enterprise-level solutions.',
    content: `
# Building Scalable React Applications: A Comprehensive Guide

Scalability is one of the most important considerations when building modern web applications. In this guide, we'll explore proven patterns and practices.

## Architecture Patterns

Understanding the right architecture pattern for your application is crucial. From monolithic approaches to micro-frontends, each has its place.

## State Management

Choosing the right state management solution can make or break your application's scalability. We'll compare different approaches and their trade-offs.

## Code Organization

A well-organized codebase is essential for long-term maintainability. Learn how to structure your React projects for maximum efficiency.
    `,
    author: {
      name: 'Michael Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Tech Lead & React Enthusiast',
    },
    readTime: 12,
    publishedAt: '2026-01-28',
    tags: ['React', 'JavaScript', 'Software Architecture'],
    claps: 892,
    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200',
  },
  {
    slug: '3',
    title: 'The Art of Writing Clean Code',
    excerpt:
      "Clean code isn't just about making your code work—it's about making it readable, maintainable, and elegant.",
    content: `
# The Art of Writing Clean Code

Clean code isn't just about making your code work—it's about making it readable, maintainable, and elegant.

## Principles of Clean Code

We'll explore the fundamental principles that make code clean: simplicity, clarity, and intentionality.

## Naming Conventions

Good names are the foundation of readable code. Learn how to choose names that communicate intent clearly.

## Function Design

Functions should do one thing and do it well. We'll discuss how to break down complex operations into manageable pieces.
    `,
    author: {
      name: 'Emily Watson',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Software Craftsperson',
    },
    readTime: 6,
    publishedAt: '2026-01-25',
    tags: ['Programming', 'Best Practices', 'Clean Code'],
    claps: 2156,
  },
  {
    slug: '4',
    title: 'Understanding TypeScript: Beyond the Basics',
    excerpt:
      "TypeScript has become the de facto standard for large-scale JavaScript applications. Let's dive deep into advanced TypeScript patterns.",
    content: `
# Understanding TypeScript: Beyond the Basics

TypeScript has become the de facto standard for large-scale JavaScript applications. Let's dive deep into advanced TypeScript patterns.

## Advanced Types

Conditional types, mapped types, and template literal types open up powerful possibilities for type-safe code.

## Generics Mastery

Generics are one of TypeScript's most powerful features. Learn how to leverage them effectively.

## Type Guards

Custom type guards help you work with union types more effectively and safely.
    `,
    author: {
      name: 'David Kim',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'TypeScript Advocate',
    },
    readTime: 10,
    publishedAt: '2026-01-22',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    claps: 1567,
    imageUrl:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200',
  },
  {
    slug: '5',
    title: 'Design Systems: Creating Consistency at Scale',
    excerpt:
      "A well-crafted design system is the backbone of any successful product. Here's how to build one that lasts.",
    content: `
# Design Systems: Creating Consistency at Scale

A well-crafted design system is the backbone of any successful product. Here's how to build one that lasts.

## Component Libraries

Building a comprehensive component library requires careful planning and execution.

## Design Tokens

Design tokens create a single source of truth for design decisions across your organization.

## Documentation

Great documentation is what separates a good design system from a great one.
    `,
    author: {
      name: 'Alexandra Martinez',
      avatar:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      bio: 'Product Designer & Design Systems Lead',
    },
    readTime: 9,
    publishedAt: '2026-01-20',
    tags: ['Design Systems', 'UI/UX', 'Design'],
    claps: 1823,
    imageUrl:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200',
  },
];

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  readTime: number;
  publishedAt: string;
  tags: string[];
  claps: number;
  imageUrl?: string;
}
