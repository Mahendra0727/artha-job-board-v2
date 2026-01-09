"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://artha-backend-dv1h.onrender.com/api";

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/import/logs`);
      setLogs(res.data);
    } catch (e) {
      console.error("Error fetching logs:", e.message);
    }
  };

  const triggerImport = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/import/trigger`);
      fetchData();
    } catch (e) {
      console.error("Error triggering import:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
          <h1 className="text-xl font-semibold text-gray-800">
            Job Import History
          </h1>
          <button
            onClick={triggerImport}
            disabled={loading}
            className="bg-[#1a73e8] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-medium transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Triggering...
              </span>
            ) : (
              "Trigger All Sources"
            )}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  fileName
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  importDateTime
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  total
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase text-orange-500">
                  new
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase text-blue-500">
                  updated
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <svg
                        className="w-12 h-12 text-gray-300 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-sm">
                        No import logs yet. Click "Trigger All Sources" to start
                        importing jobs.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold border border-blue-100 uppercase">
                        {log.category || "GENERAL"}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-xs text-gray-400 truncate max-w-[200px]"
                      title={log.fileName}
                    >
                      {log.fileName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {log.total || 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-orange-500">
                      {log.new || 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-blue-500">
                      {log.updated || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          log.status === "Completed"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : log.status === "Failed"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {log.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
