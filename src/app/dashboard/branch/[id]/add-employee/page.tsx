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
      setError("נא למלא את כל השדות כולל תמונה.");
      return;
    }

    setUploading(true);

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${branchId}/${fileName}`;

    // העלאת תמונה
    const { error: uploadError } = await supabase.storage
      .from("employees")
      .upload(filePath, imageFile);

    if (uploadError) {
      setError("שגיאה בהעלאת תמונה: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("employees")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // שמירת עובד
    const { error: insertError } = await supabase.from("employees").insert([
      {
        name,
        image_url: imageUrl,
        branch_id: branchId,
      },
    ]);

    setUploading(false);

    if (insertError) {
      setError("שגיאה בהוספת עובד: " + insertError.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">הוסף עובד חדש</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1">שם העובד</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="לדוגמה: יוסי כהן"
              required
            />
          </div>

          <div>
            <label className="block mb-1">תמונת העובד</label>
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
            {uploading ? "מעלה..." : "הוסף עובד"}
          </button>
        </form>
      </div>
    </div>
  );
}
