import { useState } from "react";

const Courses = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: "Advanced Mathematics", code: "MATH101", teacher: "Dr. Sarah Wilson", students: 45, status: "Active" },
    { id: 2, name: "Physics Fundamentals", code: "PHYS101", teacher: "Mr. David Brown", students: 38, status: "Active" },
    { id: 3, name: "Chemistry Basics", code: "CHEM101", teacher: "Ms. Emily Davis", students: 42, status: "Active" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", code: "", teacher: "", students: 0, status: "Active" });

  const handleAddCourse = () => {
    if (newCourse.name && newCourse.code) {
      setCourses([...courses, { ...newCourse, id: courses.length + 1 }]);
      setNewCourse({ name: "", code: "", teacher: "", students: 0, status: "Active" });
      setShowForm(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Courses Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? "Cancel" : "Add Course"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Course Code"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Teacher"
              value={newCourse.teacher}
              onChange={(e) => setNewCourse({ ...newCourse, teacher: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Number of Students"
              value={newCourse.students}
              onChange={(e) => setNewCourse({ ...newCourse, students: parseInt(e.target.value) || 0 })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newCourse.status}
              onChange={(e) => setNewCourse({ ...newCourse, status: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button
            onClick={handleAddCourse}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Course
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">📚</span>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  course.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {course.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.name}</h3>
            <p className="text-sm text-gray-600 mb-1">Code: {course.code}</p>
            <p className="text-sm text-gray-600 mb-1">Teacher: {course.teacher}</p>
            <p className="text-sm text-gray-600 mb-4">Students: {course.students}</p>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                Edit
              </button>
              <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;