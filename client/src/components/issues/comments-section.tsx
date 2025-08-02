import { useState } from "react";
import { useForm } from "react-hook-form";
import { ThumbsUp, Reply, Flag, CheckCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment, User } from "@shared/schema";
import { formatTimeAgo } from "@/lib/mock-data";

interface CommentFormData {
  content: string;
}

interface CommentsSectionProps {
  comments: Comment[];
  users: User[];
  onPostComment: (content: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
  onFlagComment: (commentId: string) => void;
}

export function CommentsSection({ 
  comments, 
  users, 
  onPostComment, 
  onLikeComment, 
  onFlagComment 
}: CommentsSectionProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>();

  const getUserById = (userId: string | null) => {
    if (!userId) return null;
    return users.find(user => user.id === userId);
  };

  const handlePostComment = (data: CommentFormData) => {
    onPostComment(data.content, replyingTo || undefined);
    reset();
    setReplyingTo(null);
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const topLevelComments = comments.filter(comment => !comment.parentId);
  const getReplies = (parentId: string) => 
    comments.filter(comment => comment.parentId === parentId);

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const author = getUserById(comment.authorId);
    const replies = getReplies(comment.id);

    return (
      <div className={`${isReply ? "ml-8 border-l-2 border-gray-100 pl-4" : ""}`}>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
            {author?.isVerified ? (
              <div className="w-8 h-8 bg-civic-emerald rounded-full flex items-center justify-center">
                <CheckCircle className="text-white h-4 w-4" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <UserCheck className="text-white h-4 w-4" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-foreground">
                {author?.username || "Anonymous"}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(comment.createdAt || new Date())}
              </span>
            </div>
            <p className="text-foreground text-sm mb-2">{comment.content}</p>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-civic-blue p-0"
                onClick={() => onLikeComment(comment.id)}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                {comment.likes}
              </Button>
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-civic-blue p-0"
                  onClick={() => handleReply(comment.id)}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-red-500 p-0"
                onClick={() => onFlagComment(comment.id)}
              >
                <Flag className="h-3 w-3 mr-1" />
                Flag
              </Button>
            </div>
          </div>
        </div>

        {/* Replies */}
        {replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}

        {/* Reply form */}
        {replyingTo === comment.id && (
          <div className="mt-4 ml-11">
            <form onSubmit={handleSubmit(handlePostComment)} className="space-y-2">
              <Textarea
                {...register("content", { required: "Reply content is required" })}
                placeholder="Write a reply..."
                className="resize-none"
                rows={2}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content.message?.toString()}</p>
              )}
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-civic-blue hover:bg-civic-blue/90"
                >
                  Reply
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Comments ({comments.length})
      </h3>
      
      {/* Main comment form */}
      <div className="mb-6">
        <form onSubmit={handleSubmit(handlePostComment)} className="space-y-3">
          <Textarea
            {...register("content", { required: "Comment content is required" })}
            placeholder="Add a comment..."
            className="resize-none"
            rows={3}
          />
          {errors.content && (
            <p className="text-sm text-red-500">{errors.content.message?.toString()}</p>
          )}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-civic-blue hover:bg-civic-blue/90"
            >
              Post Comment
            </Button>
          </div>
        </form>
      </div>
      
      {/* Comments list */}
      <div className="space-y-6">
        {topLevelComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
