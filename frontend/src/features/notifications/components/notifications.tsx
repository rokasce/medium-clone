import { useState } from 'react';
import { Link } from 'react-router';
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

interface Notification {
  id: string;
  type: 'comment' | 'clap' | 'follow' | 'mention' | 'article';
  title: string;
  message: string;
  timestamp: string;
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
      "Sarah Chen and 24 others clapped for 'The Future of Web Development'",
    timestamp: '2 hours ago',
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
    read: false,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    authorName: 'Michael Rodriguez',
  },
  {
    id: '3',
    type: 'comment',
    title: 'New comment',
    message: "Emily Watson commented on 'Building Scalable React Applications'",
    timestamp: '1 day ago',
    read: false,
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    authorName: 'Emily Watson',
  },
  {
    id: '4',
    type: 'article',
    title: 'Recommended for you',
    message:
      "Check out 'Understanding TypeScript: Beyond the Basics' by David Kim",
    timestamp: '2 days ago',
    read: true,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    authorName: 'David Kim',
  },
  {
    id: '5',
    type: 'mention',
    title: 'You were mentioned',
    message:
      "Alexandra Martinez mentioned you in 'Design Systems: Creating Consistency'",
    timestamp: '3 days ago',
    read: true,
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    authorName: 'Alexandra Martinez',
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'clap':
      return <ThumbsUp className="h-4 w-4 text-green-600" />;
    case 'follow':
      return <UserPlus className="h-4 w-4 text-blue-600" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4 text-orange-600" />;
    case 'mention':
      return <User className="h-4 w-4 text-purple-600" />;
    case 'article':
      return <BookOpen className="h-4 w-4 text-zinc-600" />;
  }
};

export function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
              {unreadCount}
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
              onClick={markAllAsRead}
              className="text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 h-auto p-0"
            >
              Mark all as read
            </Button>
          )}
        </div>

        <ScrollArea className="h-100">
          {notifications.length === 0 ? (
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
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    'w-full text-left p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors',
                    !notification.read && 'bg-green-50/50 dark:bg-green-950/30'
                  )}
                >
                  <div className="flex gap-3">
                    <div className="shrink-0">
                      {notification.avatar ? (
                        <div className="relative">
                          <Avatar className="h-10 w-10">
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
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-green-600 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                        {notification.timestamp}
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
