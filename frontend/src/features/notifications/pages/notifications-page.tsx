import { useState } from 'react';
import {
  Bell,
  Settings,
  CheckCheck,
  ThumbsUp,
  UserPlus,
  MessageCircle,
  User,
  BookOpen,
} from 'lucide-react';

import { Link } from '@tanstack/react-router';
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
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
} from '../hooks/use-notifications';
import type { Notification, NotificationType } from '../types/notification';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'ArticleClapped':
      return <ThumbsUp className="h-5 w-5 text-green-600" />;
    case 'NewFollower':
      return <UserPlus className="h-5 w-5 text-blue-600" />;
    case 'ArticleCommented':
    case 'CommentReplied':
      return <MessageCircle className="h-5 w-5 text-orange-600" />;
    case 'MentionedInComment':
      return <User className="h-5 w-5 text-purple-600" />;
    case 'ArticlePublished':
    case 'SubmissionApproved':
    case 'SubmissionRejected':
      return <BookOpen className="h-5 w-5 text-zinc-600" />;
    default:
      return <Bell className="h-5 w-5 text-zinc-600" />;
  }
};

const mapTabToType = (tab: string): string | undefined => {
  switch (tab) {
    case 'comment':
      return 'ArticleCommented';
    case 'clap':
      return 'ArticleClapped';
    case 'follow':
      return 'NewFollower';
    default:
      return undefined;
  }
};

const groupNotificationsByDate = (notifications: Notification[]) => {
  const groups: { [key: string]: Notification[] } = {};

  notifications.forEach((notification) => {
    const date = new Date(notification.createdAt);

    let label: string;
    if (isToday(date)) {
      label = 'Today';
    } else if (isYesterday(date)) {
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
  const [activeTab, setActiveTab] = useState('all');

  const { data: notificationsData, isLoading } = useNotifications({
    page: 1,
    pageSize: 50,
    unreadOnly: activeTab === 'unread' ? true : undefined,
    type: mapTabToType(activeTab),
  });
  const { data: unreadCountData } = useUnreadCount();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = notificationsData?.items ?? [];
  const totalCount = notificationsData?.totalCount ?? 0;
  const unreadCount = unreadCountData?.count ?? 0;

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const groupedNotifications = groupNotificationsByDate(notifications);

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
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                  className="gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all as read
                </Button>
              )}
              <Link to="/profile">
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
              {totalCount > 0 && (
                <span className="ml-2 text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded-full">
                  {totalCount}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-green-600 border-t-transparent rounded-full" />
              </div>
            ) : Object.keys(groupedNotifications).length === 0 ? (
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
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={notification.isRead}
                        className={cn(
                          'w-full text-left p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors first:rounded-t-lg last:rounded-b-lg',
                          !notification.isRead &&
                            'bg-green-50/50 hover:bg-green-50/70 dark:bg-green-950/30 dark:hover:bg-green-950/50'
                        )}
                      >
                        <div className="flex gap-4">
                          <div className="shrink-0">
                            {notification.actorAvatarUrl ? (
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage
                                    src={notification.actorAvatarUrl}
                                    alt={notification.actorName}
                                  />
                                  <AvatarFallback>
                                    {notification.actorName
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
                                  {formatDistanceToNow(
                                    new Date(notification.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                                {!notification.isRead && (
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
