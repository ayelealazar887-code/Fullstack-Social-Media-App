import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { PostItem } from "./postItem";

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url: string | null;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("post")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return data;
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["post"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <div>Loading Posts</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {data?.map((post, key) => (
        <PostItem key={key} post={post} />
      ))}
    </>
  );
};