"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/app/utils/supabase/client";

export default function RateBranchPage() {
  const { branchId } = useParams();
  const [phone, setPhone] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<{ [employeeId: string]: number }>({});

  useEffect(() => {
    if (submittedPhone) {
      fetchEmployees();
    }
  }, [submittedPhone]);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("branch_id", branchId);

    if (error) {
      console.error("Error fetching employees:", error);
    } else {
      setEmployees(data || []);
    }

    setLoading(false);
  };

  const submitRating = async (employeeId: string, stars: number) => {
    const { error } = await supabase.from("ratings").insert([
      {
        employee_id: employeeId,
        phone_number: phone,
        rating: stars,
      },
    ]);

    if (error) {
      alert("שגיאה בשמירת הדירוג.");
    } else {
      setRatings((prev) => ({ ...prev, [employeeId]: stars }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">דירוג עובדים</h1>

      {!submittedPhone ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (phone.trim()) setSubmittedPhone(true);
          }}
          className="bg-gray-800 p-6 rounded-xl w-full max-w-sm"
        >
          <label className="block mb-2 text-sm">הזן מספר טלפון:</label>
          <input
            type="tel"
            className="w-full p-3 rounded bg-gray-700"
            placeholder="050-1234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded">
            המשך לדירוג
          </button>
        </form>
      ) : loading ? (
        <p>טוען עובדים...</p>
      ) : (
        <div className="w-full max-w-2xl space-y-6">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-gray-800 p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={emp.image_url}
                  alt={emp.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{emp.name}</h3>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => submitRating(emp.id, star)}
                        disabled={ratings[emp.id] !== undefined}
                        className={`text-2xl ${
                          ratings[emp.id] >= star
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
