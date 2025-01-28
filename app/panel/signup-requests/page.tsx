"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import useFetch from "@/app/hooks/useFetch"; // Adjust the path accordingly

const SignupRequests = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("employee"); // Default role

  // Fetch signup requests using useFetch hook
  const { data, loading: fetchLoading, error: fetchError } = useFetch<any[]>(
    "auth/signup-requests", // API endpoint to get all signup requests
    true
  );

  // Handle approve signup request
  const approveSignup = async (id: string, role: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/approve-signup/${id}`, // API URL to approve signup request
        { role } // Use selected role for the approved user
      );
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== id)
      ); // Remove approved request from the list
    } catch (err) {
      console.error("Error approving signup:", err);
      setError("Failed to approve the signup request.");
    } finally {
      setLoading(false);
    }
  };

  // Update the requests state when new data is fetched
  useEffect(() => {
    if (data) {
      setRequests(data);
    }
    if (fetchError) {
      setError(fetchError);
    }
  }, [data, fetchError]);

  // Handle role change in the dropdown
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Signup Requests</h2>

      {fetchLoading || loading ? (
        <p className="text-lg text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-lg text-red-500">{error}</p>
      ) : (
        <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{request.name}</td>
                <td className="py-2 px-4">{request.email}</td>
                <td className="py-2 px-4">
                  <select
                    value={selectedRole}
                    onChange={handleRoleChange}
                    className="bg-gray-200 text-gray-700 py-1 px-2 rounded-md"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                    <option value="manager">unapproved</option>
                    {/* Add more roles if needed */}
                  </select>
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => approveSignup(request._id, selectedRole)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    {loading ? "Approving..." : "Approve"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SignupRequests;
