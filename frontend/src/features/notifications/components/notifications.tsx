import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Bell,
  BookOpen,
  MessageCircle,
  ThumbsUp,
  User,
  UserPlus,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Separator,
} from '@/shared/components/ui';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
} from '../hooks/use-notifications';
import type { NotificationType } from '../types/notification';
import { formatDistanceToNow } from 'date-fns';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'ArticleClapped':
      return <ThumbsUp className="h-4 w-4 text-green-600" />;
    case 'NewFollower':
      return <UserPlus className="h-4 w-4 text-blue-600" />;
    case 'ArticleCommented':
    case 'CommentReplied':
      return <MessageCircle className="h-4 w-4 text-orange-600" />;
    case 'MentionedInComment':
      return <User className="h-4 w-4 text-purple-600" />;
    case 'ArticlePublished':
    case 'SubmissionApproved':
    case 'SubmissionRejected':
      return <BookOpen className="h-4 w-4 text-zinc-600" />;
    default:
      return <Bell className="h-4 w-4 text-zinc-600" />;
  }
};

export function Notifications() {
  const [open, setOpen] = useState(false);

  const { data: notificationsData, isLoading } = useNotifications({
    page: 1,
    pageSize: 5,
  });
  const { data: unreadCountData } = useUnreadCount();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = notificationsData?.items ?? [];
  const unreadCount = unreadCountData?.count ?? 0;

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b dark:border-zinc-800">
          <h3 className="font-semibold dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 h-auto p-0"
            >
              Mark all as read
            </Button>
          )}
        </div>

        <ScrollArea className="h-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
              <p className="text-zinc-500 dark:text-zinc-400">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="divide-y dark:divide-zinc-800">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  disabled={notification.isRead}
                  className={cn(
                    'w-full text-left p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors',
                    !notification.isRead && 'bg-green-50/50 dark:bg-green-950/30'
                  )}
                >
                  <div className="flex gap-3">
                    <div className="shrink-0">
                      {notification.actorAvatarUrl ? (
                        <div className="relative">
                          <Avatar className="h-10 w-10">
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
                          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm dark:text-white">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-green-600 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Link to="/notifications" className="block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400"
                  onClick={() => setOpen(false)}
                >
                  View all notifications
                </Button>
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
