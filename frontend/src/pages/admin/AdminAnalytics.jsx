import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {},
    charts: [],
    loading: true,
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const mockAnalytics = {
      overview: {
        totalUsers: 1250,
        activeUsers: 980,
        totalCourses: 45,
        activeCourses: 38,
        totalAssignments: 234,
        completedAssignments: 189,
        avgCompletionRate: 80.8,
        totalAttendance: 15678,
        avgAttendanceRate: 92.3,
      },
      charts: [
        {
          title: "User Growth",
          data: [65, 78, 90, 81, 56, 85, 92, 103, 87, 95, 110, 125],
        },
        {
          title: "Course Enrollment",
          data: [120, 135, 125, 145, 160, 175, 190, 185, 200, 210, 225, 240],
        },
        {
          title: "Assignment Completion",
          data: [85, 88, 92, 78, 95, 88, 92, 85, 90, 88, 95, 92],
        },
        {
          title: "Attendance Rate",
          data: [88, 90, 92, 85, 88, 90, 92, 94, 91, 89, 90, 92],
        },
      ],
    };

    setTimeout(() => {
      setAnalytics(mockAnalytics);
    }, 800);
  }, []);

  const { overview, charts } = analytics;

  return (
    <DashboardLayout role="admin">
      <div className="p-6 text-gray-800 dark:text-gray-100">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Users",
              value: overview.totalUsers,
              sub: `Active: ${overview.activeUsers}`,
              icon: "👥",
              color: "blue",
            },
            {
              title: "Total Courses",
              value: overview.totalCourses,
              sub: `Active: ${overview.activeCourses}`,
              icon: "📚",
              color: "green",
            },
            {
              title: "Assignments",
              value: overview.totalAssignments,
              sub: `Completed: ${overview.completedAssignments}`,
              icon: "📝",
              color: "yellow",
            },
            {
              title: "Avg Attendance",
              value: `${overview.avgAttendanceRate}%`,
              sub: `Records: ${overview.totalAttendance}`,
              icon: "📊",
              color: "purple",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center bg-${card.color}-100 dark:bg-${card.color}-900`}
                >
                  <span
                    className={`text-${card.color}-600 dark:text-${card.color}-300 text-xl`}
                  >
                    {card.icon}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {card.sub}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {charts.map((chart, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
            >
              <h3 className="text-lg font-semibold mb-4">{chart.title}</h3>

              <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-end justify-around p-4">
                {chart.data.map((value, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-4 bg-blue-500 dark:bg-blue-400 rounded"
                      style={{ height: `${value / 2}px` }}
                    ></div>
                    <span className="text-xs mt-2 text-gray-600 dark:text-gray-300">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "User Activity",
              stats: [
                ["Daily Active Users", "156"],
                ["Weekly Active Users", "892"],
                ["Monthly Active Users", "3,245"],
                ["Avg Session Duration", "24m 35s"],
              ],
            },
            {
              title: "Course Performance",
              stats: [
                ["Most Popular Course", "Mathematics 101"],
                ["Highest Completion Rate", "95.2%"],
                ["Avg Students / Course", "42.5"],
                ["Total Course Hours", "1,250"],
              ],
            },
            {
              title: "System Performance",
              stats: [
                ["Server Uptime", "99.8%"],
                ["Avg Response Time", "245ms"],
                ["Database Size", "2.4 GB"],
                ["API Calls Today", "15,234"],
                ["Error Rate", "0.2%"],
              ],
            },
          ].map((section, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
            >
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <div className="space-y-3">
                {section.stats.map(([label, value], idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {label}
                    </span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Export Reports */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Export Reports</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["📊", "User Report"],
              ["📚", "Course Report"],
              ["📝", "Assignment Report"],
              ["✅", "Attendance Report"],
            ].map(([icon, label], i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedReport(label);
                  setShowReportModal(true);
                }}
                className="p-4 border border-gray-300 dark:border-gray-700 
                           rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                           text-left cursor-pointer transition-all duration-300"
              >
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {selectedReport}
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedReport === "User Report" && "Complete user data including all students and teachers with their profiles, enrollment status, and activity metrics."}
                  {selectedReport === "Course Report" && "Comprehensive course information including enrollment numbers, completion rates, and performance statistics."}
                  {selectedReport === "Assignment Report" && "Detailed assignment data showing completion rates, grades, and student performance across all subjects."}
                  {selectedReport === "Attendance Report" && "Attendance statistics showing daily, weekly, and monthly attendance patterns for all users."}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  disabled
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                >
                  Download PDF
                  <span className="text-xs block">Coming Soon</span>
                </button>
                <button
                  disabled
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                >
                  Download Excel
                  <span className="text-xs block">Coming Soon</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
