"use client"


import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/app/utils/supabase/client";

interface Employee {
  id: string;
  name: string;
  image_url: string;
  branch_id: string;
}

export default function RateBranchPage() {
  const params = useParams();
  const branchId = params.branchId as string;

  const [phone, setPhone] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
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
      .select("id, name, image_url, branch_id")
      .eq("branch_id", branchId);

    if (error) {
      console.error("Error retrieving employees:", error);
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
        stars,
      },
    ]);

    if (error) {
      alert("Error saving rating.");
    } else {
      setRatings((prev) => ({ ...prev, [employeeId]: stars }));
    }
  };

  const handleFinish = () => {
    window.location.href = "https://google.com"; // Change to the desired address
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Employee rating</h1>

      {!submittedPhone ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (phone.trim()) setSubmittedPhone(true);
          }}
          className="bg-gray-800 p-6 rounded-xl w-full max-w-sm"
        >
          <label className="block mb-2 text-sm">Enter a phone number:</label>
          <input
            type="tel"
            className="w-full p-3 rounded bg-gray-700"
            placeholder="050-1234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded">
            Continue to rating
          </button>
        </form>
      ) : loading ? (
        <p>Loading workers...</p>
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

          <button
            onClick={handleFinish}
            className="mt-8 w-full bg-green-600 hover:bg-green-700 py-3 rounded text-xl font-bold"
          >
            End of rating
          </button>
        </div>
      )}
    </div>
  );
}
