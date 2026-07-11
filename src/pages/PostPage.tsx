import { useParams } from "react-router-dom";
import { PostDetail } from "../components/PostDetail";

export function PostPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gray-50">
      <PostDetail postId={Number(id)} />
    </div>
  );
}

