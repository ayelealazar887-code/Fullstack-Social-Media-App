import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import type { Post } from "./PostList";
import { LikeButton } from "./LikeButton";

interface Props {
  postId: number;
}
const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("post")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);

  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading)
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">
        Loading post...
      </div>
    );

  if (error)
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <div className="rounded-2xl overflow-hidden shadow-md bg-white border border-gray-100">
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
          <img
            src={data?.image_url}
            alt={data?.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            {data?.title}
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Posted on{" "}
            {data?.created_at &&
              new Date(data.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </p>

          <div className="mt-6 text-gray-700 leading-relaxed whitespace-pre-line">
            {data?.content}
          </div>
        </div>
        <LikeButton postId={postId} />
      </div>
    </article>
  );
};