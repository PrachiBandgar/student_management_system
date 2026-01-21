import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const TeacherSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [viewMode, setViewMode] = useState('week'); // week, month, day

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockSchedule = [
      {
        id: 1,
        week: 1,
        title: "Week 1 - Sep 1-7",
        days: [
          {
            day: "Monday",
            date: "2024-09-01",
            periods: [
              { time: "8:00-9:00", subject: "Mathematics 101", teacher: "Dr. Smith", room: "Room 101", type: "lecture" },
              { time: "9:00-10:00", subject: "Physics 201", teacher: "Prof. Johnson", room: "Room 102", type: "lecture" },
              { time: "10:00-11:00", subject: "Chemistry Lab", teacher: "Ms. Davis", room: "Lab 201", type: "lab" },
              { time: "11:00-12:00", subject: "Biology 101", teacher: "Mr. Wilson", room: "Room 103", type: "lecture" },
              { time: "12:00-1:00", subject: "Lunch Break", teacher: "-", room: "Cafeteria", type: "break" },
              { time: "1:00-2:00", subject: "Computer Science 101", teacher: "Dr. Brown", room: "Lab 301", type: "lecture" },
              { time: "2:00-3:00", subject: "English Literature", teacher: "Ms. Garcia", room: "Room 201", type: "lecture" },
              { time: "3:00-4:00", subject: "Study Hall", teacher: "-", room: "Library", type: "study" }
            ]
          },
          {
            day: "Tuesday",
            date: "2024-09-02",
            periods: [
              { time: "8:00-9:00", subject: "Physics 201", teacher: "Prof. Johnson", room: "Room 102", type: "lecture" },
              { time: "9:00-10:00", subject: "Mathematics 101", teacher: "Dr. Smith", room: "Room 101", type: "lecture" },
              { time: "10:00-11:00", subject: "Chemistry 101", teacher: "Ms. Davis", room: "Lab 201", type: "lab" },
              { time: "11:00-12:00", subject: "Biology 101", teacher: "Mr. Wilson", room: "Room 103", type: "lecture" },
              { time: "12:00-1:00", subject: "Lunch Break", teacher: "-", room: "Cafeteria", type: "break" },
              { time: "1:00-2:00", subject: "Computer Science 101", teacher: "Dr. Brown", room: "Lab 301", type: "lecture" },
              { time: "2:00-3:00", subject: "English Literature", teacher: "Ms. Garcia", room: "Room 201", type: "lecture" },
              { time: "3:00-4:00", subject: "Study Hall", teacher: "-", room: "Library", type: "study" }
            ]
          },
          {
            day: "Wednesday",
            date: "2024-09-03",
            periods: [
              { time: "8:00-9:00", subject: "Chemistry 101", teacher: "Ms. Davis", room: "Room 201", type: "lecture" },
              { time: "9:00-10:00", subject: "Physics 201", teacher: "Prof. Johnson", room: "Room 102", type: "lecture" },
              { time: "10:00-11:00", subject: "Mathematics 101", teacher: "Dr. Smith", room: "Room 101", type: "lecture" },
              { time: "11:00-12:00", subject: "Biology 101", teacher: "Mr. Wilson", room: "Room 103", type: "lecture" },
              { time: "12:00-1:00", subject: "Lunch Break", teacher: "-", room: "Cafeteria", type: "break" },
              { time: "1:00-2:00", subject: "Computer Science 101", teacher: "Dr. Brown", room: "Lab 301", type: "lecture" },
              { time: "2:00-3:00", subject: "English Literature", teacher: "Ms. Garcia", room: "Room 201", type: "lecture" },
              { time: "3:00-4:00", subject: "Study Hall", teacher: "-", room: "Library", type: "study" }
            ]
          },
          {
            day: "Thursday",
            date: "2024-09-04",
            periods: [
              { time: "8:00-9:00", subject: "Mathematics 101", teacher: "Dr. Smith", room: "Room 101", type: "lecture" },
              { time: "9:00-10:00", subject: "Physics 201", teacher: "Prof. Johnson", room: "Room 102", type: "lecture" },
              { time: "10:00-11:00", subject: "Chemistry 101", teacher: "Ms. Davis", room: "Lab 201", type: "lab" },
              { time: "11:00-12:00", subject: "Biology 101", teacher: "Mr. Wilson", room: "Room 103", type: "lecture" },
              { time: "12:00-1:00", subject: "Lunch Break", teacher: "-", room: "Cafeteria", type: "break" },
              { time: "1:00-2:00", subject: "Computer Science 101", teacher: "Dr. Brown", room: "Lab 301", type: "lecture" },
              { time: "2:00-3:00", subject: "English Literature", teacher: "Ms. Garcia", room: "Room 201", type: "lecture" },
              { time: "3:00-4:00", subject: "Study Hall", teacher: "-", room: "Library", type: "study" }
            ]
          },
          {
            day: "Friday",
            date: "2024-09-05",
            periods: [
              { time: "8:00-9:00", subject: "Physics 201", teacher: "Prof. Johnson", room: "Room 102", type: "lecture" },
              { time: "9:00-10:00", subject: "Mathematics 101", teacher: "Dr. Smith", room: "Room 101", type: "lecture" },
              { time: "10:00-11:00", subject: "Chemistry 101", teacher: "Ms. Davis", room: "Lab 201", type: "lab" },
              { time: "11:00-12:00", subject: "Biology 101", teacher: "Mr. Wilson", room: "Room 103", type: "lecture" },
              { time: "12:00-1:00", subject: "Lunch Break", teacher: "-", room: "Cafeteria", type: "break" },
              { time: "1:00-2:00", subject: "Computer Science 101", teacher: "Dr. Brown", room: "Lab 301", type: "lecture" },
              { time: "2:00-3:00", subject: "English Literature", teacher: "Ms. Garcia", room: "Room 201", type: "lecture" },
              { time: "3:00-4:00", subject: "Study Hall", teacher: "-", room: "Library", type: "study" }
            ]
          }
        ]
      }
    ];
    
    setTimeout(() => {
      setSchedule(mockSchedule);
      setLoading(false);
    }, 1000);
  }, []);

  const currentWeekData = schedule[selectedWeek];

  const getPeriodTypeColor = (type) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'lab': return 'bg-green-100 text-green-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      case 'study': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPeriodTypeIcon = (type) => {
    switch (type) {
      case 'lecture': return '📚';
      case 'lab': return '🧪';
      case 'break': return '🍽️';
      case 'study': return '📚';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="teacher">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading schedule...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Schedule</h1>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {schedule.map((week, index) => (
                <option key={index} value={index}>{week.title}</option>
              ))}
            </select>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Week View</option>
              <option value="month">Month View</option>
              <option value="day">Day View</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Generate Schedule
            </button>
          </div>
        </div>

        {/* Schedule Display */}
        {currentWeekData && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    {currentWeekData.days.map((day, index) => (
                      <th key={index} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div>{day.day}</div>
                        <div className="text-xs text-gray-400">{day.date}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentWeekData.days[0].periods.map((period, periodIndex) => (
                    <tr key={periodIndex} className="hover:bg-gray-50">
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {period.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-center p-2 rounded-lg ${getPeriodTypeColor(period.type)}`}>
                          <div className="text-sm font-medium">{period.subject}</div>
                          <div className="text-xs text-gray-500">{period.teacher}</div>
                          <div className="text-xs text-gray-500">{period.room}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getPeriodTypeIcon(period.type)}</span>
                          <span className="text-xs text-gray-400">{period.type}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Periods</span>
                <span className="font-semibold text-gray-800">35</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Classes per Day</span>
                <span className="font-semibold text-gray-800">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Teaching Hours</span>
                <span className="font-semibold text-gray-800">25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Free Periods</span>
                <span className="font-semibold text-gray-800">8</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Classroom Usage</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Room 101</span>
                <span className="font-semibold text-green-600">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lab 201</span>
                <span className="font-semibold text-green-600">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lab 301</span>
                <span className="font-semibold text-green-600">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Library</span>
                <span className="font-semibold text-yellow-600">45%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                <span className="text-2xl mb-2">📅</span>
                <span className="text-sm font-medium">Add Period</span>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                <span className="text-2xl mb-2">👥</span>
                <span className="text-sm font-medium">Assign Substitute</span>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                <span className="text-2xl mb-2">📧</span>
                <span className="text-sm font-medium">Manage Rooms</span>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                <span className="text-2xl mb-2">📊</span>
                <span className="text-sm font-medium">Export Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherSchedule;
