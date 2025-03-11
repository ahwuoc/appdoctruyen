import type { Comment } from '../(action)/comment';
export const buildCommentTree = (comments: Comment[], parentId: string | null = null): Comment[] =>
{
    return comments
        .filter((comment) => comment.parent_id === parentId)
        .map((comment) => ({
            ...comment,
            replies: buildCommentTree(comments, comment.id), // Gọi đệ quy
        }));
};