import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";

interface Props {
  postId: number;
}
interface NewComment {
  content: string;
  parent_comment_id: number | null;
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string,
) => {
  if (!userId || !author) {
    throw new Error("you must logged in to comment");
  }

  const { error } = await supabase.from("comment").insert({
    post_id: postId,
    content: newComment.content, // fixed typo: was "constent"
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

export const CommentSection = ({ postId }: Props) => {
  const [newComment, setnewComment] = useState<string>("");
  const { user } = useAuth();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata.user_name,
      ),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment) return;

    mutate({ content: newComment, parent_comment_id: null });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      {user ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setnewComment(e.target.value)}
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />

          <div className="flex items-center justify-between">
            {isError && (
              <p className="text-sm text-red-500">
                Something went wrong. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={!newComment || isPending}
              className="ml-auto rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isPending ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-500">
          You must be logged in to post a comment.
        </p>
      )}
    </div>
  );
};