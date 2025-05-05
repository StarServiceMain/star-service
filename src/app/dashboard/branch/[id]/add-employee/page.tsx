"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/app/utils/supabase/client";

export default function AddEmployeePage() {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const branchId = params.id as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !imageFile) {
      setError("Please fill in all fields including a picture.");
      return;
    }

    setUploading(true);

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${branchId}/${fileName}`;

    // Uploading a picture
    const { error: uploadError } = await supabase.storage
      .from("employees")
      .upload(filePath, imageFile);

    if (uploadError) {
      setError("Error uploading image: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("employees")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // Employee retention
    const { error: insertError } = await supabase.from("employees").insert([
      {
        name,
        image_url: imageUrl,
        branch_id: branchId,
      },
    ]);

    setUploading(false);

    if (insertError) {
      setError("Error adding employee: " + insertError.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Add a new employee</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1">Employee name</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="For example: Yossi Cohen"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Employee photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full bg-gray-700 rounded p-2"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {uploading ? "Upload..." : "Add employee"}
          </button>
        </form>
      </div>
    </div>
  );
}
