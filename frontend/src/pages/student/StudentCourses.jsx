import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getCourses } from "../../services/dashboard.service";
import { Link } from "react-router-dom";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      // Mock student courses data
      const studentCourses = [
        {
          id: 1,
          title: "Mathematics 101",
          instructor: "Dr. John Smith",
          status: "active",
          progress: 75,
          assignments: 5,
          completedAssignments: 3
        },
        {
          id: 2,
          title: "Physics 201",
          instructor: "Prof. Sarah Johnson",
          status: "active",
          progress: 60,
          assignments: 4,
          completedAssignments: 2
        },
        {
          id: 3,
          title: "English Literature",
          instructor: "Dr. Emily Brown",
          status: "active",
          progress: 85,
          assignments: 6,
          completedAssignments: 5
        },
        {
          id: 4,
          title: "Chemistry 101",
          instructor: "Prof. Michael Davis",
          status: "completed",
          progress: 100,
          assignments: 8,
          completedAssignments: 8
        }
      ];
      setCourses(studentCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading courses...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Courses</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <span>{courses.length} Total Courses</span>
            <span>•</span>
            <span>{courses.filter(c => c.status === 'active').length} Active</span>
            <span>•</span>
            <span>{courses.filter(c => c.status === 'completed').length} Completed</span>
          </div>
        </div>

        {/* Course Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 text-xl">📚</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total Courses</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-300 text-xl">✅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Active</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{courses.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-300 text-xl">🎯</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Completed</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{courses.filter(c => c.status === 'completed').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-300 text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Avg Progress</h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {courses.length > 0 ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{course.instructor}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  course.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {course.status === 'active' ? '🟢 Active' : '✅ Completed'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      course.progress >= 80 ? 'bg-green-500' : 
                      course.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Assignment Stats */}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                <span>Assignments: {course.completedAssignments}/{course.assignments}</span>
                <span>{Math.round((course.completedAssignments / course.assignments) * 100)}% Complete</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link 
                  to={`/student/assignments`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg text-center transition-colors duration-200 text-sm"
                >
                  View Assignments
                </Link>
                {course.status === 'active' && (
                  <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                    Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentCourses;
