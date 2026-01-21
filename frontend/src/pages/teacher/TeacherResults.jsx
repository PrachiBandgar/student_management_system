import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const TeacherResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    assignmentId: '',
    studentId: '',
    grade: '',
    feedback: ''
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockResults = [
      { id: 1, assignment: "Math Quiz 1", student: "John Doe", course: "Mathematics 101", submittedDate: "2024-09-01", grade: 95, status: "graded", feedback: "Excellent work! Strong understanding of concepts." },
      { id: 2, assignment: "Math Quiz 1", student: "Jane Smith", course: "Mathematics 101", submittedDate: "2024-09-01", grade: 88, status: "graded", feedback: "Good work. Review calculus basics." },
      { id: 3, assignment: "Physics Lab Report", student: "Mike Johnson", course: "Physics 201", submittedDate: "2024-09-02", grade: 92, status: "graded", feedback: "Well-designed experiment. Include more detail in analysis." },
      { id: 4, assignment: "Physics Lab Report", student: "Sarah Wilson", course: "Physics 201", submittedDate: "2024-09-02", grade: 78, status: "graded", feedback: "Good effort, but needs improvement in data presentation." },
      { id: 5, assignment: "Chemistry Assignment", student: "Tom Brown", course: "Chemistry 101", submittedDate: "2024-09-03", grade: 85, status: "graded", feedback: "Solid understanding of chemical reactions." },
      { id: 6, assignment: "Chemistry Assignment", student: "Emily Davis", course: "Chemistry 101", submittedDate: "2024-09-03", grade: 91, status: "graded", feedback: "Excellent lab work! Very thorough analysis." },
      { id: 7, assignment: "Computer Science Project", student: "David Brown", course: "Computer Science 101", submittedDate: "2024-09-04", grade: 96, status: "graded", feedback: "Outstanding implementation! Clean code and good documentation." },
      { id: 8, assignment: "Computer Science Project", student: "Lisa Garcia", course: "Computer Science 101", submittedDate: "2024-09-04", grade: 89, status: "graded", feedback: "Good project structure. Consider optimization techniques." },
      { id: 9, assignment: "English Essay", student: "Chris Wilson", course: "English Literature", submittedDate: "2024-09-05", grade: 94, status: "graded", feedback: "Well-written essay with strong arguments." },
      { id: 10, assignment: "English Essay", student: "Amy Johnson", course: "English Literature", submittedDate: "2024-09-05", grade: 87, status: "graded", feedback: "Good analysis. Work on thesis statement clarity." },
    ];
    
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, []);

  const courses = ['all', 'Mathematics 101', 'Physics 201', 'Chemistry 101', 'Computer Science 101', 'English Literature'];

  const filteredResults = results.filter(result => {
    const matchesCourse = selectedCourse === 'all' || result.course === selectedCourse;
    return matchesCourse;
  });

  const handleGrade = (result) => {
    setSelectedAssignment(result);
    setGradeForm({
      assignmentId: result.id,
      studentId: result.student,
      grade: result.grade.toString(),
      feedback: result.feedback
    });
    setShowGradeModal(true);
  };

  const handleSubmitGrade = (e) => {
    e.preventDefault();
    console.log("Submitting grade:", gradeForm);
    
    // Update the result in the array
    setResults(results.map(r => 
      r.id === gradeForm.assignmentId 
        ? { ...r, grade: parseInt(gradeForm.grade), feedback: gradeForm.feedback }
        : r
    ));
    
    setShowGradeModal(false);
    setSelectedAssignment(null);
    setGradeForm({ assignmentId: '', studentId: '', grade: '', feedback: '' });
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeLetter = (grade) => {
    if (grade >= 97) return 'A+';
    if (grade >= 93) return 'A';
    if (grade >= 90) return 'A-';
    if (grade >= 87) return 'B+';
    if (grade >= 83) return 'B';
    if (grade >= 80) return 'B-';
    if (grade >= 77) return 'C+';
    if (grade >= 73) return 'C';
    if (grade >= 70) return 'C-';
    if (grade >= 67) return 'D+';
    if (grade >= 63) return 'D';
    if (grade >= 60) return 'D-';
    return 'F';
  };

  if (loading) {
    return (
      <DashboardLayout role="teacher">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading results...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Results</h1>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Export Results
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">📝</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Submissions</h3>
                <p className="text-2xl font-bold text-blue-600">{filteredResults.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Graded</h3>
                <p className="text-2xl font-bold text-green-600">{filteredResults.filter(r => r.status === 'graded').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Avg Grade</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredResults.length > 0 
                    ? Math.round(filteredResults.reduce((sum, r) => sum + r.grade, 0) / filteredResults.length)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">🏆</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Highest Grade</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredResults.length > 0 
                    ? Math.max(...filteredResults.map(r => r.grade))
                    : 0
                  }%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {result.assignment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.student}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.submittedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`font-bold ${getGradeColor(result.grade)}`}>
                      {result.grade}% ({getGradeLetter(result.grade)})
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      result.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleGrade(result)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Grade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grade Modal */}
        {showGradeModal && selectedAssignment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Grade Assignment</h3>
                <button
                  onClick={() => setShowGradeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">{selectedAssignment.assignment}</h4>
                  <div className="text-sm text-gray-600">
                    <p><strong>Student:</strong> {selectedAssignment.student}</p>
                    <p><strong>Course:</strong> {selectedAssignment.course}</p>
                    <p><strong>Submitted:</strong> {selectedAssignment.submittedDate}</p>
                    <p><strong>Current Grade:</strong> {selectedAssignment.grade}% ({getGradeLetter(selectedAssignment.grade)})</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitGrade}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Grade (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={gradeForm.grade}
                      onChange={(e) => setGradeForm({...gradeForm, grade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Feedback</label>
                    <textarea
                      value={gradeForm.feedback}
                      onChange={(e) => setGradeForm({...gradeForm, feedback: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Provide feedback to the student..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowGradeModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Submit Grade
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

export default TeacherResults;
