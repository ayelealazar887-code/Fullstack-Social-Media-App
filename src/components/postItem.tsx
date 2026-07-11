import React from "react";
import type { Post } from "./PostList";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (
    <Link
      to={`/post/${post.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 ease-out w-full max-w-md mx-auto"
    >
      {/* Header - avatar row, like IG post header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-gray-100">
        <img
          src={post.avatar_url}
          alt=""
          className="w-8 h-8 rounded-full object-cover bg-gray-200 ring-1 ring-gray-100"
        />
        <span className="text-sm font-semibold text-gray-900 truncate">
          {post.title}
        </span>
      </div>

      {/* Image - square, IG-style */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-3 py-2.5">
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {post.title}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-gray-400 group-hover:text-blue-600 transition-colors duration-200">
          <span>Read post</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Accent bar */}
      <div className="absolute top-0 left-0 h-0.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-500 ease-out" />
    </Link>
  );
};