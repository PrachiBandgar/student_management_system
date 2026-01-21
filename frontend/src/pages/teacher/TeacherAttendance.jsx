import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const TeacherAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({
    course: '',
    date: '',
    status: 'present'
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockAttendance = [
      { id: 1, student: "John Doe", course: "Mathematics 101", date: "2024-09-01", status: "present", time: "9:00 AM" },
      { id: 2, student: "Jane Smith", course: "Mathematics 101", date: "2024-09-01", status: "present", time: "9:05 AM" },
      { id: 3, student: "Mike Johnson", course: "Mathematics 101", date: "2024-09-01", status: "late", time: "9:15 AM" },
      { id: 4, student: "Sarah Wilson", course: "Physics 201", date: "2024-09-01", status: "present", time: "10:00 AM" },
      { id: 5, student: "Tom Brown", course: "Physics 201", date: "2024-09-01", status: "absent", time: "-" },
      { id: 6, student: "Emily Davis", course: "Chemistry 101", date: "2024-09-02", status: "present", time: "2:00 PM" },
      { id: 7, student: "Chris Wilson", course: "Chemistry 101", date: "2024-09-02", status: "present", time: "2:05 PM" },
      { id: 8, student: "Lisa Garcia", course: "Chemistry 101", date: "2024-09-02", status: "late", time: "2:10 PM" },
      { id: 9, student: "David Brown", course: "Computer Science 101", date: "2024-09-02", status: "absent", time: "-" },
      { id: 10, student: "Amy Johnson", course: "Computer Science 101", date: "2024-09-02", status: "present", time: "3:00 PM" },
    ];
    
    setTimeout(() => {
      setAttendance(mockAttendance);
      setLoading(false);
    }, 1000);
  }, []);

  const courses = ['all', 'Mathematics 101', 'Physics 201', 'Chemistry 101', 'Computer Science 101'];

  const filteredAttendance = attendance.filter(record => {
    const matchesDate = record.date === selectedDate;
    const matchesCourse = selectedCourse === 'all' || record.course === selectedCourse;
    return matchesDate && matchesCourse;
  });

  const handleMarkAttendance = (e) => {
    e.preventDefault();
    console.log("Marking attendance:", attendanceForm);
    setShowMarkModal(false);
    setAttendanceForm({ course: '', date: '', status: 'present' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return '✅';
      case 'late': return '⏰';
      case 'absent': return '❌';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="teacher">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading attendance...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Attendance</h1>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {courses.map(course => (
                <option key={course} value={course} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">{course}</option>
              ))}
            </select>
            <button
              onClick={() => setShowMarkModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Mark Attendance
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Present</h3>
                <p className="text-2xl font-bold text-green-600">
                  {filteredAttendance.filter(a => a.status === 'present').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⏰</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Late</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredAttendance.filter(a => a.status === 'late').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl">❌</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Absent</h3>
                <p className="text-2xl font-bold text-red-600">
                  {filteredAttendance.filter(a => a.status === 'absent').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Students</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredAttendance.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.student}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)} {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mark Attendance Modal */}
        {showMarkModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Mark Attendance</h3>
                <button
                  onClick={() => setShowMarkModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleMarkAttendance}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Course</label>
                    <select
                      required
                      value={attendanceForm.course}
                      onChange={(e) => setAttendanceForm({...attendanceForm, course: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Course</option>
                      <option value="Mathematics 101">Mathematics 101</option>
                      <option value="Physics 201">Physics 201</option>
                      <option value="Chemistry 101">Chemistry 101</option>
                      <option value="Computer Science 101">Computer Science 101</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                    <input
                      type="date"
                      required
                      value={attendanceForm.date}
                      onChange={(e) => setAttendanceForm({...attendanceForm, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                    <select
                      required
                      value={attendanceForm.status}
                      onChange={(e) => setAttendanceForm({...attendanceForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="present">Present</option>
                      <option value="late">Late</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowMarkModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Mark Attendance
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherAttendance;
