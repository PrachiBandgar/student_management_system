import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getStudentDashboardData, getCourses } from "../../services/dashboard.service";

const MyAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState('calendar'); // calendar, list, stats

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashboardData, coursesData] = await Promise.all([
        getStudentDashboardData(),
        getCourses()
      ]);
      setAttendanceData(dashboardData.attendances || []);
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock attendance data for demonstration
  const generateAttendanceData = () => {
    const data = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Generate attendance for the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = date.getDay();
      
      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      // Only generate data for past dates
      if (date > today) continue;
      
      // Random attendance status
      const statuses = ['present', 'present', 'present', 'late', 'absent']; // More present days
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      data.push({
        date: date.toISOString(),
        status: status,
        course: courses[Math.floor(Math.random() * courses.length)] || null,
        markedBy: 'Teacher'
      });
    }
    
    return data;
  };

  const attendanceRecords = attendanceData.length > 0 ? attendanceData : generateAttendanceData();

  const getAttendanceStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(a => a.status === 'present').length;
    const absent = attendanceRecords.filter(a => a.status === 'absent').length;
    const late = attendanceRecords.filter(a => a.status === 'late').length;
    
    return {
      total,
      present,
      absent,
      late,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    };
  };

  const getCalendarDays = () => {
    const year = selectedYear;
    const month = selectedMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getAttendanceForDate = (day) => {
    const date = new Date(selectedYear, selectedMonth, day);
    const dateStr = date.toISOString().split('T')[0];
    return attendanceRecords.find(a => 
      new Date(a.date).toISOString().split('T')[0] === dateStr
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-300';
      case 'absent': return 'bg-red-100 text-red-800 border-red-300';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return '✅';
      case 'absent': return '❌';
      case 'late': return '⏰';
      default: return '';
    }
  };

  const stats = getAttendanceStats();

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading attendance data...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Attendance</h1>
          <div className="flex space-x-4">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>January</option>
              <option value={1}>February</option>
              <option value={2}>March</option>
              <option value={3}>April</option>
              <option value={4}>May</option>
              <option value={5}>June</option>
              <option value={6}>July</option>
              <option value={7}>August</option>
              <option value={8}>September</option>
              <option value={9}>October</option>
              <option value={10}>November</option>
              <option value={11}>December</option>
            </select>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1 rounded ${viewMode === 'calendar' ? 'bg-white shadow' : ''}`}
              >
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={`px-3 py-1 rounded ${viewMode === 'stats' ? 'bg-white shadow' : ''}`}
              >
                Stats
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Days</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Present</h3>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
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
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">📈</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Attendance Rate</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.percentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'calendar' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                  {day}
                </div>
              ))}
              
              {getCalendarDays().map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="p-2"></div>;
                }
                
                const attendance = getAttendanceForDate(day);
                const isToday = new Date().getDate() === day && 
                               new Date().getMonth() === selectedMonth && 
                               new Date().getFullYear() === selectedYear;
                const isWeekend = new Date(selectedYear, selectedMonth, day).getDay() === 0 || 
                                 new Date(selectedYear, selectedMonth, day).getDay() === 6;
                
                return (
                  <div
                    key={day}
                    className={`p-2 border rounded-lg text-center ${
                      isToday ? 'ring-2 ring-blue-500' : ''
                    } ${isWeekend ? 'bg-gray-50' : 'bg-white'} ${
                      attendance ? getStatusColor(attendance.status) : 'border-gray-200'
                    }`}
                  >
                    <div className="text-sm font-medium">{day}</div>
                    {attendance && (
                      <div className="text-xs mt-1">
                        {getStatusIcon(attendance.status)}
                      </div>
                    )}
                    {attendance && attendance.course && (
                      <div className="text-xs mt-1 truncate">
                        {attendance.course.title.substring(0, 3)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span>Late</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span>No Class</span>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marked By</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords
                  .filter(a => new Date(a.date).getMonth() === selectedMonth)
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.course?.title || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)} {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.markedBy || '-'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Present</span>
                    <span>{stats.present} days ({Math.round((stats.present / stats.total) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: `${(stats.present / stats.total) * 100}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Absent</span>
                    <span>{stats.absent} days ({Math.round((stats.absent / stats.total) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-red-600 h-3 rounded-full" style={{ width: `${(stats.absent / stats.total) * 100}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Late</span>
                    <span>{stats.late} days ({Math.round((stats.late / stats.total) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-yellow-600 h-3 rounded-full" style={{ width: `${(stats.late / stats.total) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Course-wise Attendance</h3>
              <div className="space-y-3">
                {courses.map(course => {
                  const courseAttendance = attendanceRecords.filter(a => a.course?._id === course._id);
                  const coursePresent = courseAttendance.filter(a => a.status === 'present').length;
                  const courseTotal = courseAttendance.length;
                  const coursePercentage = courseTotal > 0 ? Math.round((coursePresent / courseTotal) * 100) : 0;
                  
                  return (
                    <div key={course._id}>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{course.title}</span>
                        <span>{coursePercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            coursePercentage >= 90 ? 'bg-green-600' : 
                            coursePercentage >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                          }`} 
                          style={{ width: `${coursePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trends</h3>
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg">📈</div>
                <p className="text-gray-600 mt-2">Attendance trend chart will be displayed here</p>
                <p className="text-sm text-gray-500 mt-1">Showing improvement over time</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="font-medium text-green-800">Perfect Week</p>
                    <p className="text-sm text-green-600">7 days present in a row</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-medium text-blue-800">Regular Attendee</p>
                    <p className="text-sm text-blue-600">90%+ attendance this month</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-medium text-purple-800">Consistent Student</p>
                    <p className="text-sm text-purple-600">No absences this semester</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyAttendance;
