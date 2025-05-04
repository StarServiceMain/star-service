"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/utils/supabase/client";
import { QRCodeCanvas } from "qrcode.react";



export default function DashboardPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBranchName, setNewBranchName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [stars, setStars] = useState<any[]>([]);
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
    console.log("Sending payload:", payload);

    const { data, error } = await supabase.from("branches").insert([payload]).select();
    console.log("Insert result:", { data, error });

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
      <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
        <div className="absolute w-full h-full animate-twinkle bg-[url('/stars.png')] bg-repeat opacity-20"></div>
      </div>

      <h1 className="text-4xl font-bold mb-10 text-center">Star Service</h1>

      <div className="w-full max-w-md space-y-10">
        <section className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">הוסף סניף חדש</h2>
          <input
            type="text"
            className="p-3 w-full bg-gray-700 text-white rounded"
            placeholder="שם הסניף"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white mt-4 px-4 py-2 rounded w-full"
            onClick={addBranch}
          >
            הוסף סניף
          </button>
        </section>

        <section className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">הוסף עובדים לסניף</h2>
          {branches.length > 0 ? (
            branches.map((branch) => (
              <div key={branch.id} className="flex flex-col gap-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="flex-1">{branch.name}</span>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                    onClick={() => router.push(`/dashboard/branch/${branch.id}/add-employee`)}
                  >
                    הוסף עובד
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                    onClick={() => deleteBranch(branch.id)}
                  >
                    מחק
                  </button>
                </div>
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
                  onClick={() => setShowQrFor(branch.id)}
                >
                  צור ברקוד לדירוגים
                </button>
                {showQrFor === branch.id && (
                  <div className="flex justify-center pt-2">
                   <QRCodeCanvas value={`${window.location.origin}/rate/${branch.id}`} />

                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-300">לא נמצאו סניפים.</p>
          )}
        </section>

        <section className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">רשימת העובדים</h2>
          {branches.length > 0 ? (
            branches.map((branch) => (
              <div key={branch.id} className="mt-3">
                <h3 className="text-lg font-medium">{branch.name}</h3>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2 w-full"
                  onClick={() => router.push(`/dashboard/branch/${branch.id}/employees`)}
                >
                  צפייה ברשימת העובדים
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-300">לא נמצאו סניפים.</p>
          )}
        </section>
      </div>

      <button
        onClick={handleLogout}
        className="fixed bottom-6 mx-auto left-0 right-0 w-60 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow-lg text-center transition"
      >
        התנתק
      </button>

      <div className="absolute inset-0 pointer-events-none opacity-10">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        .animate-twinkle {
          animation: twinkle 4s infinite;
        }
      `}</style>
    </div>
  );
}
