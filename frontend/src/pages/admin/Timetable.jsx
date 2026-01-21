import { useState } from "react";

const Timetable = () => {
  const [selectedGrade, setSelectedGrade] = useState("10th");

  const timetableData = {
    "10th": {
      Monday: [
        { time: "9:00-10:00", subject: "Mathematics", teacher: "Dr. Sarah Wilson" },
        { time: "10:00-11:00", subject: "Physics", teacher: "Mr. David Brown" },
        { time: "11:00-12:00", subject: "Chemistry", teacher: "Ms. Emily Davis" },
        { time: "1:00-2:00", subject: "English", teacher: "Ms. Lisa Johnson" },
        { time: "2:00-3:00", subject: "History", teacher: "Mr. John Smith" },
      ],
      Tuesday: [
        { time: "9:00-10:00", subject: "Chemistry", teacher: "Ms. Emily Davis" },
        { time: "10:00-11:00", subject: "Mathematics", teacher: "Dr. Sarah Wilson" },
        { time: "11:00-12:00", subject: "Physics", teacher: "Mr. David Brown" },
        { time: "1:00-2:00", subject: "Biology", teacher: "Dr. Maria Garcia" },
        { time: "2:00-3:00", subject: "Geography", teacher: "Mr. Robert Lee" },
      ],
      // Add more days...
    },
    "9th": {
      Monday: [
        { time: "9:00-10:00", subject: "English", teacher: "Ms. Lisa Johnson" },
        { time: "10:00-11:00", subject: "Mathematics", teacher: "Dr. Sarah Wilson" },
        // ... more classes
      ],
      // ... more days
    },
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Timetable Management</h1>
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="9th">9th Grade</option>
          <option value="10th">10th Grade</option>
          <option value="11th">11th Grade</option>
          <option value="12th">12th Grade</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {days.map((day) => (
          <div key={day} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              {day}
            </h3>
            <div className="space-y-2">
              {timetableData[selectedGrade]?.[day]?.map((slot, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100"
                >
                  <div className="text-xs text-gray-600 mb-1">{slot.time}</div>
                  <div className="font-medium text-gray-800">{slot.subject}</div>
                  <div className="text-sm text-gray-600">{slot.teacher}</div>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-4">
                  No classes scheduled
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Add New Class
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
            Edit Timetable
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timetable;