"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/utils/supabase/client";
import { QRCodeCanvas } from "qrcode.react";

// טיפוס עבור סניף
interface Branch {
  id: string;
  name: string;
  owner_id: string;
}

interface Star {
  top: number;
  left: number;
  delay: number;
}

export default function DashboardPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBranchName, setNewBranchName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [showQrFor, setShowQrFor] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const generatedStars = Array.from({ length: 40 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 10,
    }));
    setStars(generatedStars);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          console.error("User not authenticated", error);
          router.push("/login");
        } else {
          setUserId(data.user.id);
        }
      } catch (err) {
        console.error("Error fetching user", err);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchBranches = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("branches")
        .select("*")
        .eq("owner_id", userId);

      if (error) {
        console.error("Error loading branches:", JSON.stringify(error, null, 2));
      } else {
        setBranches(data || []);
      }

      setLoading(false);
    };

    fetchBranches();
  }, [userId]);

  const addBranch = async () => {
    if (!newBranchName.trim()) return;
    if (!userId) return;

    const payload = { name: newBranchName, owner_id: userId };

    const { data, error } = await supabase.from("branches").insert([payload]).select();

    if (error) {
      console.error("Error adding branch:", JSON.stringify(error, null, 2));
    } else {
      setBranches([...branches, data?.[0]]);
      setNewBranchName("");
    }
  };

  const deleteBranch = async (branchId: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הסניף?")) return;

    const { error } = await supabase
      .from("branches")
      .delete()
      .eq("id", branchId);

    if (error) {
      console.error("Error deleting branch:", JSON.stringify(error, null, 2));
      alert("אירעה שגיאה בעת מחיקת הסניף.");
    } else {
      setBranches(branches.filter((b) => b.id !== branchId));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return <div className="text-center text-white mt-20">טוען...</div>;
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start pt-10 px-4 pb-24">
      {/* תוכן הדף נשאר אותו דבר */}
      {/* ... */}
    </div>
  );
}
