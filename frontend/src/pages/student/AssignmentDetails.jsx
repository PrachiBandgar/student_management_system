import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

const AssignmentDetails = () => {
  const { id } = useParams();
  const [submissionLink, setSubmissionLink] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock assignment data - in real app, this would come from API
  const assignment = {
    id: id,
    title: "Mathematics Assignment 3",
    course: "Mathematics 101",
    description: "Complete problems 1-25 from Chapter 5, showing all work and steps.",
    dueDate: "2024-01-15",
    status: "pending",
    daysLeft: 3,
    requirements: [
      "Show all mathematical steps",
      "Include diagrams where applicable",
      "Submit as PDF or clear photos",
      "Maximum file size: 10MB"
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submissionLink.trim()) {
      setIsSubmitted(true);
      // In real app, this would make API call
      alert(`Assignment "${assignment.title}" submitted successfully!`);
      console.log("Assignment submitted:", { id, submissionLink });
    }
  };

  const isDeadlinePassed = new Date(assignment.dueDate) < new Date();

  return (
    <DashboardLayout role="student">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link to="/student" className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link to="/student/assignments" className="hover:text-blue-600 dark:hover:text-blue-400">My Assignments</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 dark:text-white">{assignment.title}</span>
        </div>

        {/* Assignment Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{assignment.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{assignment.course}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                isSubmitted 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : isDeadlinePassed
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {isSubmitted ? '✅ Submitted' : isDeadlinePassed ? '❌ Deadline Passed' : '⏳ Pending'}
              </span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Due Date: {new Date(assignment.dueDate).toLocaleDateString()} at 11:59 PM
            <span className={`ml-2 font-medium ${
              assignment.daysLeft <= 1 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              ({assignment.daysLeft} days remaining)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📝 Assignment Description</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {assignment.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📋 Requirements</h2>
              <ul className="space-y-2">
                {assignment.requirements.map((req, index) => (
                  <li key={index} className="flex items-start text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Submit Assignment Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📌 Submit Assignment</h2>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">Assignment Submitted!</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your submission has been received and is being reviewed.</p>
                </div>
              ) : isDeadlinePassed ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Deadline Passed</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">The submission deadline has passed. Contact your instructor if you need an extension.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Submission Link
                    </label>
                    <input
                      type="url"
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                      placeholder="https://docs.google.com/document/..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Google Drive / GitHub / Live URL allowed
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Submit Assignment
                  </button>

                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      <strong>Note:</strong> Make sure your link is publicly accessible and contains all required materials.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssignmentDetails;
