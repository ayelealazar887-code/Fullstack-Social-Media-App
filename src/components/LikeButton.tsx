import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { useAuth } from "../context/authContext";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Props {
  postId: number;
}
interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}
const vote = async (voteValue: number, postId: number, userId: string) => {
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    if (existingVote.vote == voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: voteValue });
    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);

  return data as Vote[];
};

export const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<Vote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
    refetchInterval: 5000,
  });

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) {
        throw new Error("You Must be Logged in to Vote!");
      }
      return vote(voteValue, postId, user.id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
  });

  if (isLoading)
    return <div className="text-sm text-gray-400">Loading votes...</div>;
  if (error)
    return (
      <div className="text-sm text-red-500">Error: {error.message}</div>
    );

  const Like = votes?.filter((v) => v.vote === 1).length || 0;
  const Dislike = votes?.filter((v) => v.vote === -1).length || 0;

  const userVote = votes?.find((v) => v.user_id === user?.id)?.vote;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => mutate(1)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${
          userVote === 1
            ? "bg-blue-50 border-blue-200 text-blue-600"
            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        }`}
      >
        <ThumbsUp
          className="w-4 h-4"
          fill={userVote === 1 ? "currentColor" : "none"}
        />
        <span>{Like}</span>
      </button>

      <button
        onClick={() => mutate(-1)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${
          userVote === -1
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        }`}
      >
        <ThumbsDown
          className="w-4 h-4"
          fill={userVote === -1 ? "currentColor" : "none"}
        />
        <span>{Dislike}</span>
      </button>
    </div>
  );
};