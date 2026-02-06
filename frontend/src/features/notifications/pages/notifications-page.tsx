import { useState } from 'react';
import {
  Settings,
  CheckCheck,
  ThumbsUp,
  UserPlus,
  MessageCircle,
  User,
  BookOpen,
} from 'lucide-react';

import { Link } from 'react-router';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import { cn } from '@/shared/lib';

interface Notification {
  id: string;
  type: 'comment' | 'clap' | 'follow' | 'mention' | 'article';
  title: string;
  message: string;
  timestamp: string;
  date: string;
  read: boolean;
  avatar?: string;
  authorName?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'clap',
    title: 'New claps on your article',
    message:
      "Sarah Chen and 24 others clapped for 'The Future of Web Development: What to Expect in 2026'",
    timestamp: '2 hours ago',
    date: '2026-02-06',
    read: false,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    authorName: 'Sarah Chen',
  },
  {
    id: '2',
    type: 'follow',
    title: 'New follower',
    message: 'Michael Rodriguez started following you',
    timestamp: '5 hours ago',
    date: '2026-02-06',
    read: false,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    authorName: 'Michael Rodriguez',
  },
  {
    id: '3',
    type: 'comment',
    title: 'New comment',
    message:
      'Emily Watson commented: "This is exactly what I needed! The section on component architecture is brilliant."',
    timestamp: '8 hours ago',
    date: '2026-02-06',
    read: false,
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    authorName: 'Emily Watson',
  },
  {
    id: '4',
    type: 'clap',
    title: 'New claps on your article',
    message:
      "David Kim and 15 others clapped for 'Building Scalable React Applications'",
    timestamp: '1 day ago',
    date: '2026-02-05',
    read: false,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    authorName: 'David Kim',
  },
  {
    id: '5',
    type: 'mention',
    title: 'You were mentioned',
    message:
      "Alexandra Martinez mentioned you in 'Design Systems: Creating Consistency at Scale'",
    timestamp: '1 day ago',
    date: '2026-02-05',
    read: true,
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    authorName: 'Alexandra Martinez',
  },
  {
    id: '6',
    type: 'follow',
    title: 'New follower',
    message: 'Jessica Lee started following you',
    timestamp: '2 days ago',
    date: '2026-02-04',
    read: true,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    authorName: 'Jessica Lee',
  },
  {
    id: '7',
    type: 'comment',
    title: 'New comment',
    message:
      'Robert Zhang replied to your comment: "I agree with your perspective on this. Have you considered..."',
    timestamp: '2 days ago',
    date: '2026-02-04',
    read: true,
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    authorName: 'Robert Zhang',
  },
  {
    id: '8',
    type: 'article',
    title: 'Recommended for you',
    message:
      "Based on your reading history: 'Advanced TypeScript Patterns' by Maria Garcia",
    timestamp: '3 days ago',
    date: '2026-02-03',
    read: true,
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    authorName: 'Maria Garcia',
  },
  {
    id: '9',
    type: 'clap',
    title: 'New claps on your article',
    message:
      "James Wilson and 8 others clapped for 'The Art of Writing Clean Code'",
    timestamp: '3 days ago',
    date: '2026-02-03',
    read: true,
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    authorName: 'James Wilson',
  },
  {
    id: '10',
    type: 'follow',
    title: 'New follower',
    message: 'Lisa Anderson started following you',
    timestamp: '4 days ago',
    date: '2026-02-02',
    read: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    authorName: 'Lisa Anderson',
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'clap':
      return <ThumbsUp className="h-5 w-5 text-green-600" />;
    case 'follow':
      return <UserPlus className="h-5 w-5 text-blue-600" />;
    case 'comment':
      return <MessageCircle className="h-5 w-5 text-orange-600" />;
    case 'mention':
      return <User className="h-5 w-5 text-purple-600" />;
    case 'article':
      return <BookOpen className="h-5 w-5 text-zinc-600" />;
  }
};

const groupNotificationsByDate = (notifications: Notification[]) => {
  const groups: { [key: string]: Notification[] } = {};

  notifications.forEach((notification) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];

    let label = notification.date;
    if (notification.date === today) {
      label = 'Today';
    } else if (notification.date === yesterday) {
      label = 'Yesterday';
    } else {
      label = 'Earlier';
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(notification);
  });

  return groups;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filterNotifications = (type: string) => {
    if (type === 'all') return notifications;
    if (type === 'unread') return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === type);
  };

  const filteredNotifications = filterNotifications(activeTab);
  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl dark:text-white">Notifications</h1>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all as read
                </Button>
              )}
              <Link to="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {unreadCount > 0 && (
            <p className="text-zinc-600 dark:text-zinc-400">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              All
              {notifications.length > 0 && (
                <span className="ml-2 text-xs bg-zinc-200 px-2 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="comment">Responses</TabsTrigger>
            <TabsTrigger value="clap">Claps</TabsTrigger>
            <TabsTrigger value="follow">Followers</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {Object.keys(groupedNotifications).length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <CheckCheck className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
                </div>
                <p className="text-lg font-medium mb-2 dark:text-white">
                  You're all caught up!
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  No notifications to show
                </p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([date, notifs]) => (
                <div key={date} className="space-y-2">
                  <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 px-2">
                    {date}
                  </h2>
                  <div className="bg-white dark:bg-zinc-900 rounded-lg divide-y dark:divide-zinc-800">
                    {notifs.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={cn(
                          'w-full text-left p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors first:rounded-t-lg last:rounded-b-lg',
                          !notification.read &&
                            'bg-green-50/50 hover:bg-green-50/70 dark:bg-green-950/30 dark:hover:bg-green-950/50'
                        )}
                      >
                        <div className="flex gap-4">
                          <div className="shrink-0">
                            {notification.avatar ? (
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage
                                    src={notification.avatar}
                                    alt={notification.authorName}
                                  />
                                  <AvatarFallback>
                                    {notification.authorName
                                      ?.split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-1 shadow-sm">
                                  {getNotificationIcon(notification.type)}
                                </div>
                              </div>
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                {getNotificationIcon(notification.type)}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <p className="font-semibold dark:text-white">
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                  {notification.timestamp}
                                </span>
                                {!notification.read && (
                                  <div className="h-2 w-2 rounded-full bg-green-600" />
                                )}
                              </div>
                            </div>
                            <p className="text-zinc-700 dark:text-zinc-300">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
