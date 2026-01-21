import { useState } from "react";

const MyAttendance = () => {
  const [selectedMonth, setSelectedMonth] = useState("December");

  const attendanceData = [
    { date: "2024-12-01", status: "Present", checkIn: "8:45 AM", checkOut: "4:30 PM" },
    { date: "2024-12-02", status: "Present", checkIn: "8:30 AM", checkOut: "4:15 PM" },
    { date: "2024-12-03", status: "Late", checkIn: "9:15 AM", checkOut: "4:45 PM" },
    { date: "2024-12-04", status: "Present", checkIn: "8:50 AM", checkOut: "4:20 PM" },
    { date: "2024-12-05", status: "Absent", checkIn: "-", checkOut: "-" },
    { date: "2024-12-06", status: "Present", checkIn: "8:40 AM", checkOut: "4:25 PM" },
    { date: "2024-12-07", status: "Present", checkIn: "8:35 AM", checkOut: "4:30 PM" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Late":
        return "bg-yellow-100 text-yellow-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const presentDays = attendanceData.filter((day) => day.status === "Present").length;
  const totalDays = attendanceData.length;
  const attendancePercentage = ((presentDays / totalDays) * 100).toFixed(1);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Attendance</h1>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
        >
          <option value="November" className="bg-white dark:bg-gray-700 text-black dark:text-white">November 2024</option>
          <option value="December" className="bg-white dark:bg-gray-700 text-black dark:text-white">December 2024</option>
          <option value="January" className="bg-white dark:bg-gray-700 text-black dark:text-white">January 2025</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
              <span className="text-green-600 dark:text-green-300 text-xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{attendancePercentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
              <span className="text-blue-600 dark:text-blue-300 text-xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Present Days</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{presentDays}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-4">
              <span className="text-red-600 dark:text-red-300 text-xl">❌</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Absent Days</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {attendanceData.filter((day) => day.status === "Absent").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Check In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Check Out
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {attendanceData.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(record.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {record.checkIn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {record.checkOut}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Attendance Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">This Month</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Working Days</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">{totalDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Days Present</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{presentDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Days Late</span>
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  {attendanceData.filter((day) => day.status === "Late").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Days Absent</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {attendanceData.filter((day) => day.status === "Absent").length}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Request Leave
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;