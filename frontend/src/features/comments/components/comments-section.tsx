import { useState } from 'react';
import { MessageCircle, Trash2, CornerDownRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from '@/shared/components/ui';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/hooks';
import { useComments, useAddComment, useDeleteComment } from '../hooks/use-comments';
import type { Comment } from '../types/comment';
import { toast } from 'sonner';

interface CommentItemProps {
  comment: Comment;
  articleId: string;
  currentUserId?: string;
  onReply: (commentId: string, authorName: string) => void;
  isReply?: boolean;
}

function CommentItem({
  comment,
  articleId,
  currentUserId,
  onReply,
  isReply = false,
}: CommentItemProps) {
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(articleId);

  const isOwner = currentUserId === comment.authorId;

  const handleDelete = () => {
    deleteComment(comment.id, {
      onSuccess: () => toast.success('Comment deleted'),
      onError: () => toast.error('Failed to delete comment'),
    });
  };

  return (
    <div className={cn('flex gap-3', isReply && 'ml-10 mt-3')}>
      <Avatar className="h-9 w-9 shrink-0 mt-0.5">
        <AvatarImage src={comment.authorAvatarUrl} alt={comment.authorName} />
        <AvatarFallback>
          {comment.authorName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm dark:text-white">
            {comment.authorName}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
          {comment.status === 'Edited' && (
            <span className="text-xs text-zinc-400 italic">edited</span>
          )}
        </div>

        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {comment.content}
        </p>

        <div className="flex items-center gap-2 mt-2">
          {!isReply && (
            <button
              onClick={() => onReply(comment.id, comment.authorName)}
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
            >
              <CornerDownRight className="h-3 w-3" />
              Reply
            </button>
          )}
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          )}
        </div>

        {/* Replies */}
        {comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-zinc-100 dark:border-zinc-800 pl-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                articleId={articleId}
                currentUserId={currentUserId}
                onReply={onReply}
                isReply
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentInputProps {
  articleId: string;
  replyingTo?: { commentId: string; authorName: string } | null;
  onCancelReply: () => void;
}

function CommentInput({ articleId, replyingTo, onCancelReply }: CommentInputProps) {
  const [content, setContent] = useState('');
  const { mutate: addComment, isPending } = useAddComment(articleId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addComment(
      {
        content: content.trim(),
        parentCommentId: replyingTo?.commentId,
      },
      {
        onSuccess: () => {
          setContent('');
          onCancelReply();
          toast.success(replyingTo ? 'Reply posted' : 'Comment posted');
        },
        onError: () => toast.error('Failed to post comment'),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {replyingTo && (
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <CornerDownRight className="h-4 w-4" />
          <span>
            Replying to <strong>{replyingTo.authorName}</strong>
          </span>
          <button
            type="button"
            onClick={onCancelReply}
            className="text-xs underline hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            Cancel
          </button>
        </div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={replyingTo ? `Reply to ${replyingTo.authorName}…` : 'Write a comment…'}
        rows={3}
        maxLength={1000}
        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">{content.length}/1000</span>
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || isPending}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isPending ? 'Posting…' : replyingTo ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </form>
  );
}

interface CommentsSectionProps {
  articleId: string;
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const { data: comments, isLoading } = useComments(articleId);
  const { isAuthenticated, user } = useAuth();
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    authorName: string;
  } | null>(null);

  const handleReply = (commentId: string, authorName: string) => {
    setReplyingTo({ commentId, authorName });
  };

  const totalCount = comments
    ? comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)
    : 0;

  return (
    <section className="max-w-3xl mx-auto px-4 pb-16">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        <h2 className="text-lg font-semibold dark:text-white">
          {totalCount > 0 ? `${totalCount} Response${totalCount !== 1 ? 's' : ''}` : 'Responses'}
        </h2>
      </div>

      {isAuthenticated ? (
        <div className="mb-8 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <CommentInput
            articleId={articleId}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
          />
        </div>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          Sign in to leave a response.
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full" />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
              currentUserId={user?.id}
              onReply={handleReply}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
          <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No responses yet. Be the first to comment!</p>
        </div>
      )}
    </section>
  );
}
