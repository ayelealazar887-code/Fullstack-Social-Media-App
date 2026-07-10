import React, { useState, type ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";

interface PostInput {
  title: string;
  content: string;
}

const createPost = async (posts: PostInput, imageFile: File) => {
  
  
  const filePath = `${posts.title}-${Date.now()}-${imageFile.name}`
  const { error: uploadError } = await supabase.storage.from('image_url').upload(filePath, imageFile);

  if(uploadError) throw new Error(uploadError.message);
   const { data: publicURLData } = supabase.storage.from("image_url").getPublicUrl(filePath);

   const { data, error } = await supabase.from("post").insert({...posts, image_url: publicURLData.publicUrl });
  if (error) throw new Error(error.message);

  return data;
};

export function CreatePost() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
   const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutate } = useMutation({ mutationFn: (data: { post: PostInput; imageFile: File }) => {
    return createPost(data.post, data.imageFile)
  } });

  const handelSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if(!selectedFile) return;
    mutate({ post: { title, content }, imageFile: selectedFile});
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0]);
    }
  }
  return (
    <form onSubmit={handelSubmit} className="mx-auto w-full max-w-lg rounded-2xl border border-[#E8E6F5] bg-white p-8">
      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-semibold text-[#14132B]">Title</label>
        <input
          type="text"
          id="title"
          required
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-lg border border-[#E8E6F5] bg-[#FCFCFE] px-3 py-2.5 text-sm text-[#14132B] focus:border-[#3A2FE0] focus:outline-none focus:ring-3 focus:ring-[#ECEAFB]"
        />
      </div>
      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-semibold text-[#14132B]">Content</label>
        <textarea
          id="content"
          required
          onChange={(event) => setContent(event.target.value)}
          className="w-full resize-y rounded-lg border border-[#E8E6F5] bg-[#FCFCFE] px-3 py-2.5 text-sm leading-relaxed text-[#14132B] focus:border-[#3A2FE0] focus:outline-none focus:ring-3 focus:ring-[#ECEAFB]"
        />
      </div>
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-semibold text-[#14132B]">Content</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          required
          onChange={handleFileChange}
          className="block w-full cursor-pointer rounded-lg border border-[#E8E6F5] bg-[#FCFCFE] px-3 py-2.5 text-sm text-[#6E6B85] file:mr-3 file:rounded-md file:border-0 file:bg-[#ECEAFB] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[#3A2FE0] hover:file:bg-[#3A2FE0] hover:file:text-white"
        />
      </div>
      <button className="w-full rounded-lg bg-[#3A2FE0] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2E25B8]">
        Create post
      </button>
    </form>
  );
}