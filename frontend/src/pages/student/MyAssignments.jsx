import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getAssignments, getCourses } from "../../services/dashboard.service";

const MyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [submissionForm, setSubmissionForm] = useState({
    text: '',
    file: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsData, coursesData] = await Promise.all([
        getAssignments(),
        getCourses()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesFilter = filter === 'all' || assignment.status === filter;
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.course?.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAssignmentDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  const handleSubmitAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
  };

  const handleSubmission = (e) => {
    e.preventDefault();
    // Handle assignment submission logic here
    console.log('Submitting assignment:', selectedAssignment._id, submissionForm);
    alert(`Assignment "${selectedAssignment.title}" submitted successfully!`);
    setShowSubmitModal(false);
    setSubmissionForm({ text: '', file: null });
    // Refresh assignments after submission
    fetchData();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'graded': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return 'No due date';
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days remaining`;
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading assignments...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Assignments</h1>
          <div className="flex space-x-4">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Assignments</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Assignment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 text-xl">📝</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{assignments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-300 text-xl">⏳</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Pending</h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{assignments.filter(a => a.status === 'pending').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 text-xl">✅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Submitted</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{assignments.filter(a => a.status === 'submitted').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-300 text-xl">🎯</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Graded</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{assignments.filter(a => a.status === 'graded').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{assignment.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{assignment.description?.substring(0, 50)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {assignment.course?.title || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : '-'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getDaysRemaining(assignment.dueDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {assignment.grade ? (
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">{assignment.grade}%</span>
                        {assignment.grade >= 90 && <span className="ml-1 text-green-600">🌟</span>}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      to={`/student/assignments/${assignment._id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      View
                    </Link>
                    {assignment.status === 'pending' ? (
                      <button 
                        onClick={() => handleSubmitAssignment(assignment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Submit Assignment
                      </button>
                    ) : assignment.status === 'submitted' ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✅ Submitted</span>
                        {assignment.submissionLink && (
                          <a 
                            href={assignment.submissionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 text-xs"
                          >
                            View Link
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-600">🎯 Graded</span>
                        {assignment.grade && (
                          <span className="text-sm font-medium text-purple-600">{assignment.grade}%</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Assignment Details Modal */}
        {showDetailsModal && selectedAssignment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedAssignment.title}</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Assignment Description</h3>
                    <p className="text-gray-600">{selectedAssignment.description || 'No description available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Requirements</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Submit your work before the due date</li>
                      <li>Follow the formatting guidelines provided</li>
                      <li>Include all required references</li>
                      <li>Ensure your work is original and properly cited</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Submission Guidelines</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• File format: PDF, DOC, or DOCX</li>
                        <li>• Maximum file size: 10MB</li>
                        <li>• Naming convention: [YourName]_[AssignmentTitle]</li>
                        <li>• Include your name and student ID in the document</li>
                      </ul>
                    </div>
                  </div>

                  {selectedAssignment.status === 'graded' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Feedback</h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-blue-800">Grade: {selectedAssignment.grade}%</span>
                          <span className="text-blue-600">Excellent work!</span>
                        </div>
                        <p className="text-blue-700">
                          Great job on this assignment! Your analysis was thorough and well-structured. 
                          Consider expanding on the conclusion in future assignments.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Assignment Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Course:</span>
                        <p className="font-medium text-gray-800">{selectedAssignment.course?.title || '-'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Due Date:</span>
                        <p className="font-medium text-gray-800">
                          {selectedAssignment.dueDate ? new Date(selectedAssignment.dueDate).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <p>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedAssignment.status)}`}>
                            {selectedAssignment.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Time Remaining:</span>
                        <p className="font-medium text-gray-800">{getDaysRemaining(selectedAssignment.dueDate)}</p>
                      </div>
                    </div>
                  </div>

                  {selectedAssignment.status === 'pending' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
                      <div className="space-y-2">
                        <button 
                          onClick={() => {
                            setShowDetailsModal(false);
                            handleSubmitAssignment(selectedAssignment);
                          }}
                          className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Submit Assignment
                        </button>
                        <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                          Save as Draft
                        </button>
                        <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                          Ask Question
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Teacher Info</h3>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xl">👨‍🏫</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{selectedAssignment.course?.teacher?.name || 'Teacher'}</p>
                        <p className="text-sm text-gray-600">Course Instructor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Assignment Modal */}
        {showSubmitModal && selectedAssignment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Submit Assignment</h3>
              
              <form onSubmit={handleSubmission}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Assignment</label>
                  <p className="text-gray-600 font-medium">{selectedAssignment.title}</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Comments (Optional)</label>
                  <textarea
                    value={submissionForm.text}
                    onChange={(e) => setSubmissionForm({...submissionForm, text: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Add any comments about your submission..."
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Upload File</label>
                  <input
                    type="file"
                    onChange={(e) => setSubmissionForm({...submissionForm, file: e.target.files[0]})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept=".pdf,.doc,.docx"
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max: 10MB)</p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmitModal(false);
                      setSubmissionForm({ text: '', file: null });
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Submit Assignment
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

export default MyAssignments;
