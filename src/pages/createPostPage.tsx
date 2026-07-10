import React from 'react'
import { CreatePost } from '../components/createPost';

export function CreatePostPage() {
  return (
    <div className="min-h-screen bg-[#F7F6FB] px-4 py-14">
      <div className="mx-auto mb-8 max-w-lg text-center">
        <h2 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#14132B]">Create new Post</h2>
      </div>
      <CreatePost />
    </div>
  );
}