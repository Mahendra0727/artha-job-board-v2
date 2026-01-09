"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ PRODUCTION API URL
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/import/logs`);
      setLogs(res.data);
    } catch (e) {
      console.error("Error fetching logs:", e);
    }
  };

  const triggerImport = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/import/trigger`);
      fetchData(); // Refresh logs
    } catch (e) {
      console.error("Error triggering import:", e);
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
            className="bg-[#1a73e8] hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            {loading ? "Triggering..." : "Trigger All Sources"}
          </button>
        </div>
        {/* Rest of your table code same */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Your existing table JSX */}
          </table>
        </div>
      </div>
    </div>
  );
}
