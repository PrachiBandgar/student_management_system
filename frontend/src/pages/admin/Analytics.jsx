import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalAssignments: 0,
    avgAttendance: "0%"
  });
  const [loading, setLoading] = useState(true);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const API_URL = "http://localhost:5000/api";

  // Fetch real data from students, teachers, and courses
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch students
      const studentsRes = await axios.get(`${API_URL}/users/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      // Fetch teachers
      const teachersRes = await axios.get(`${API_URL}/users/teachers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      // Fetch courses
      const coursesRes = await axios.get(`${API_URL}/dashboard/courses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const students = studentsRes.data || [];
      const teachers = teachersRes.data || [];
      const courses = coursesRes.data || [];
      
      // Calculate real stats based on specific requirements
      const totalStudents = students.length;
      const totalTeachers = teachers.length;
      const totalCourses = courses.length;
      const completedCourses = courses.filter(c => c.status === "completed").length;
      const activeStudents = students.filter(s => s.status === "active").length;
      
      // Total Users = Teachers + Students
      const totalUsers = totalStudents + totalTeachers;
      
      // Avg Attendance = Percentage of active students
      const avgAttendance = totalStudents > 0 
        ? Math.round((activeStudents / totalStudents) * 100) + "%"
        : "0%";

      setStats({
        totalUsers,           // Teachers + Students
        totalCourses,         // All courses from courses page
        totalAssignments: completedCourses,  // Completed courses
        avgAttendance         // % of active students
      });
      
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]); // Refetch when time range changes

  // Update chart data based on real stats
  const studentEnrollmentData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Students",
        data: [Math.floor((stats.totalUsers || 0) * 0.1), Math.floor((stats.totalUsers || 0) * 0.15), 
               Math.floor((stats.totalUsers || 0) * 0.2), Math.floor((stats.totalUsers || 0) * 0.25), 
               Math.floor((stats.totalUsers || 0) * 0.15), Math.floor((stats.totalUsers || 0) * 0.15)],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const performanceData = {
    labels: ["Mathematics", "Physics", "Chemistry", "English", "History"],
    datasets: [
      {
        label: "Average Grade",
        data: [85, 78, 82, 88, 75],
        borderColor: "rgba(147, 51, 234, 1)",
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(147, 51, 234, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const attendanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Attendance Rate",
        data: [85, 88, 82, 90, 87, 92],
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(107, 114, 128, 1)',
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(107, 114, 128, 1)',
          font: {
            size: 12
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    maintainAspectRatio: false
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading analytics...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">🌙</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  className="sr-only peer" 
                />
                <div className={`w-11 h-6 rounded-full peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
              </label>
              <span className="text-sm text-gray-600 dark:text-gray-400">☀️</span>
            </div>
            
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* ===== ENHANCED ANALYTICS CHARTS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Users Distribution Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Users Distribution</h3>
            <Bar
              data={{
                labels: ['Total Users', 'Total Courses', 'Completed Assignments'],
                datasets: [{
                  label: 'Count',
                  data: [
                    stats.totalUsers || 0,
                    stats.totalCourses || 0,
                    stats.totalAssignments || 0
                  ],
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(147, 51, 234, 0.8)',
                    'rgba(34, 197, 94, 0.8)'
                  ],
                  borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(147, 51, 234, 1)',
                    'rgba(34, 197, 94, 1)'
                  ],
                  borderWidth: 2,
                  borderRadius: 8
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(156, 163, 175, 0.1)'
                    },
                    ticks: {
                      color: 'rgba(107, 114, 128, 1)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      color: 'rgba(107, 114, 128, 1)'
                    }
                  }
                }
              }}
            />
          </div>

          {/* Attendance Progress Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Attendance Progress</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="relative w-56 h-56">
                <svg className="w-56 h-56 transform -rotate-90">
                  <circle
                    cx="112"
                    cy="112"
                    r="96"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="112"
                    cy="112"
                    r="96"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${parseInt(stats.avgAttendance) * 6.03} 603`}
                    className="text-orange-500 transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-gray-800 dark:text-white">
                    {stats.avgAttendance}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Average Attendance</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {parseInt(stats.avgAttendance) >= 80 ? 'Excellent' : 
                     parseInt(stats.avgAttendance) >= 60 ? 'Good' : 'Needs Improvement'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards with Progress Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats.totalUsers}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Teachers + Students</p>
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900">
                <span className="text-blue-600 dark:text-blue-300 text-2xl">👥</span>
              </div>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((stats.totalUsers || 0) * 5, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Total Courses Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Courses</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats.totalCourses}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">All courses</p>
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900">
                <span className="text-purple-600 dark:text-purple-300 text-2xl">📚</span>
              </div>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((stats.totalCourses || 0) * 12.5, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Assignments Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Assignments</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats.totalAssignments}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Completed courses</p>
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900">
                <span className="text-green-600 dark:text-green-300 text-2xl">✅</span>
              </div>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((stats.totalAssignments || 0) * 25, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Avg Attendance Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Attendance</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats.avgAttendance}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active students %</p>
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-orange-100 dark:bg-orange-900">
                <span className="text-orange-600 dark:text-orange-300 text-2xl">📊</span>
              </div>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${stats.avgAttendance}` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Student Enrollment
            </h2>
            <Line data={studentEnrollmentData} options={chartOptions} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Subject Performance
            </h2>
            <Line data={performanceData} options={chartOptions} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Attendance Trend
            </h2>
            <Line data={attendanceData} options={chartOptions} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Recent Activities
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">New student enrolled</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📚</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Course completed</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm">📊</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Grade updated</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== REPORT BUTTONS ===== */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Generate Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User Report Button */}
            <div 
              onClick={() => {
                console.log("User Report button clicked!");
                alert("User Report Clicked!");
              }}
              className="flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                <span className="text-white text-xl">👥</span>
              </div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">User Report</span>
              <span className="text-xs text-blue-600 dark:text-blue-400 mt-1">Students & Teachers</span>
            </div>

            {/* Course Report Button */}
            <div 
              onClick={() => {
                console.log("Course Report button clicked!");
                alert("Course Report Clicked!");
              }}
              className="flex flex-col items-center justify-center p-6 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-600 transition-colors">
                <span className="text-white text-xl">📚</span>
              </div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Course Report</span>
              <span className="text-xs text-purple-600 dark:text-purple-400 mt-1">All Courses</span>
            </div>

            {/* Assignment Report Button */}
            <div 
              onClick={() => {
                console.log("Assignment Report button clicked!");
                alert("Assignment Report Clicked!");
              }}
              className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-600 transition-colors">
                <span className="text-white text-xl">✅</span>
              </div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Assignment Report</span>
              <span className="text-xs text-green-600 dark:text-green-400 mt-1">Completed Tasks</span>
            </div>

            {/* Attendance Report Button */}
            <div 
              onClick={() => {
                console.log("Attendance Report button clicked!");
                alert("Attendance Report Clicked!");
              }}
              className="flex flex-col items-center justify-center p-6 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-600 transition-colors">
                <span className="text-white text-xl">📊</span>
              </div>
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Attendance Report</span>
              <span className="text-xs text-orange-600 dark:text-orange-400 mt-1">Attendance Stats</span>
            </div>
          </div>
        </div>

        </div>
      </DashboardLayout>
    );
};

export default Analytics;