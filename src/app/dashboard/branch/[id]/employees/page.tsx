"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/app/utils/supabase/client";

interface Employee {
  id: string;
  name: string;
  image_url: string;
  branch_id: string;
  total_stars?: number;
}

interface Rating {
  employee_id: string;
  stars: number;
}

export default function EmployeesListPage() {
  const params = useParams();
  const branchId = params.id as string;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeesWithStars = async () => {
      // Retrieval of all employees at the branch
      const { data: employeesData, error: empError } = await supabase
        .from("employees")
        .select("id, name, image_url, branch_id")
        .eq("branch_id", branchId);

      if (empError || !employeesData) {
        console.error("Error retrieving employees:", empError?.message);
        setLoading(false);
        return;
      }

      const employeeIds = employeesData.map(emp => emp.id);

      const { data: ratingsData, error: ratingError } = await supabase
        .from("ratings")
        .select("employee_id, stars");

      if (ratingError) {
        console.error("Error retrieving ratings:", ratingError.message);
        setLoading(false);
        return;
      }

      const starMap: Record<string, number> = {};
      ratingsData?.forEach((r: Rating) => {
        if (!starMap[r.employee_id]) starMap[r.employee_id] = 0;
        starMap[r.employee_id] += r.stars;
      });

      const merged = employeesData.map((emp) => ({
        ...emp,
        total_stars: starMap[emp.id] || 0,
      }));

      setEmployees(merged);
      setLoading(false);
    };

    fetchEmployeesWithStars();
  }, [branchId]);

  const deleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete the employee??")) return;

    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (error) {
      console.error("Error deleting employee:", error.message);
      alert("An error occurred while deleting..");
      return;
    }

    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-10">Employee list</h1>

      {loading ? (
        <div className="text-center">Loading workers...</div>
      ) : employees.length === 0 ? (
        <div className="text-center text-gray-400">There are no employees at this branch..</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-gray-800 rounded-xl p-4 shadow-lg flex flex-col items-center"
            >
              <img
                src={employee.image_url}
                alt={employee.name}
                className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-white"
              />
              <h2 className="text-lg font-semibold">{employee.name}</h2>
              <div className="mt-2 text-yellow-400 text-lg">
                ⭐ {employee.total_stars} Stars
              </div>
              <button
                onClick={() => deleteEmployee(employee.id)}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete employee
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
