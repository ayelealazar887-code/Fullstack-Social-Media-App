import React from "react";
import { PostList } from "../components/PostList";

function Home() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h2>
      <div className="flex flex-col gap-6">
        <PostList />
      </div>
    </div>
  );
}

export default Home;