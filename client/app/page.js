"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/import/logs");
      setLogs(res.data);
    } catch (e) {
      console.error("Error");
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
            onClick={() =>
              axios.post("http://localhost:5000/api/import/trigger")
            }
            className="bg-[#1a73e8] hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Trigger All Sources
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
              {logs.map((log) => (
                <tr
                  key={log._id}
                  className="hover:bg-gray-50 transition-colors"
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
                    {log.fileName}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {log.total}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-orange-500">
                    {log.new}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-500">
                    {log.updated}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        log.status === "Completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
