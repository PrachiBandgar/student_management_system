import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getStudentDashboardData, getCourses, getAssignments } from "../../services/dashboard.service";

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed, trends

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashboardData, coursesData, assignmentsData] = await Promise.all([
        getStudentDashboardData(),
        getCourses(),
        getAssignments()
      ]);
      
      // Process assignments to create results data
      const gradedAssignments = assignmentsData.filter(a => a.status === 'graded' && a.grade);
      setResults(gradedAssignments);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock results for demonstration
  const generateMockResults = () => {
    const mockResults = [
      {
        _id: '1',
        title: 'Mathematics Midterm Exam',
        course: { title: 'Mathematics' },
        grade: 92,
        maxGrade: 100,
        type: 'exam',
        date: new Date('2024-12-01'),
        feedback: 'Excellent performance! Strong understanding of calculus concepts.',
        weight: 30
      },
      {
        _id: '2',
        title: 'Physics Lab Report',
        course: { title: 'Physics' },
        grade: 88,
        maxGrade: 100,
        type: 'lab',
        date: new Date('2024-11-28'),
        feedback: 'Good experimental design and analysis. Minor improvements needed in data presentation.',
        weight: 20
      },
      {
        _id: '3',
        title: 'English Essay Assignment',
        course: { title: 'English Literature' },
        grade: 95,
        maxGrade: 100,
        type: 'assignment',
        date: new Date('2024-11-25'),
        feedback: 'Outstanding writing! Well-structured arguments and excellent use of evidence.',
        weight: 25
      },
      {
        _id: '4',
        title: 'Chemistry Quiz',
        course: { title: 'Chemistry' },
        grade: 85,
        maxGrade: 100,
        type: 'quiz',
        date: new Date('2024-11-20'),
        feedback: 'Good understanding of chemical reactions. Review periodic table trends.',
        weight: 15
      },
      {
        _id: '5',
        title: 'Computer Science Project',
        course: { title: 'Computer Science' },
        grade: 90,
        maxGrade: 100,
        type: 'project',
        date: new Date('2024-11-15'),
        feedback: 'Well-implemented solution. Clean code and good documentation.',
        weight: 30
      }
    ];
    return mockResults;
  };

  const allResults = results.length > 0 ? results : generateMockResults();

  const calculateGPA = (results) => {
    if (results.length === 0) return 0;
    
    const totalWeightedGrade = results.reduce((sum, result) => {
      const gradePoint = getGradePoint(result.grade);
      return sum + (gradePoint * (result.weight || 1));
    }, 0);
    
    const totalWeight = results.reduce((sum, result) => sum + (result.weight || 1), 0);
    
    return (totalWeightedGrade / totalWeight).toFixed(2);
  };

  const getGradePoint = (grade) => {
    if (grade >= 97) return 4.0;
    if (grade >= 93) return 4.0;
    if (grade >= 90) return 3.7;
    if (grade >= 87) return 3.3;
    if (grade >= 83) return 3.0;
    if (grade >= 80) return 2.7;
    if (grade >= 77) return 2.3;
    if (grade >= 73) return 2.0;
    if (grade >= 70) return 1.7;
    if (grade >= 67) return 1.3;
    if (grade >= 63) return 1.0;
    if (grade >= 60) return 0.7;
    return 0.0;
  };

  const getLetterGrade = (grade) => {
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

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    if (grade >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceLevel = (grade) => {
    if (grade >= 90) return { level: 'Excellent', color: 'bg-green-100 text-green-800', icon: '🌟' };
    if (grade >= 80) return { level: 'Good', color: 'bg-blue-100 text-blue-800', icon: '👍' };
    if (grade >= 70) return { level: 'Satisfactory', color: 'bg-yellow-100 text-yellow-800', icon: '📈' };
    if (grade >= 60) return { level: 'Needs Improvement', color: 'bg-orange-100 text-orange-800', icon: '⚠️' };
    return { level: 'Poor', color: 'bg-red-100 text-red-800', icon: '❌' };
  };

  const calculateCourseAverage = (courseTitle) => {
    const courseResults = allResults.filter(r => r.course.title === courseTitle);
    if (courseResults.length === 0) return 0;
    const sum = courseResults.reduce((acc, r) => acc + r.grade, 0);
    return Math.round(sum / courseResults.length);
  };

  const getFilteredResults = () => {
    let filtered = allResults;
    
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(r => r.course.title === selectedCourse);
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredResults = getFilteredResults();
  const overallGPA = calculateGPA(allResults);
  const currentSemesterGPA = calculateGPA(filteredResults);

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading results...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Results</h1>
          <div className="flex space-x-4">
            <select 
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="current">Current Semester</option>
              <option value="fall2024">Fall 2024</option>
              <option value="spring2024">Spring 2024</option>
              <option value="all">All Time</option>
            </select>
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course._id} value={course.title}>{course.title}</option>
              ))}
            </select>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-3 py-1 rounded ${viewMode === 'overview' ? 'bg-white shadow' : ''}`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1 rounded ${viewMode === 'detailed' ? 'bg-white shadow' : ''}`}
              >
                Detailed
              </button>
              <button
                onClick={() => setViewMode('trends')}
                className={`px-3 py-1 rounded ${viewMode === 'trends' ? 'bg-white shadow' : ''}`}
              >
                Trends
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'overview' && (
          <div className="space-y-6">
            {/* GPA and Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Overall GPA</h3>
                    <p className="text-2xl font-bold text-purple-600">{overallGPA}</p>
                    <p className="text-sm text-gray-600">4.0 scale</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Semester GPA</h3>
                    <p className="text-2xl font-bold text-blue-600">{currentSemesterGPA}</p>
                    <p className="text-sm text-gray-600">Current semester</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Average Grade</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(allResults.reduce((acc, r) => acc + r.grade, 0) / allResults.length)}%
                    </p>
                    <p className="text-sm text-gray-600">All assessments</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-xl">🏆</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Class Rank</h3>
                    <p className="text-2xl font-bold text-orange-600">12/45</p>
                    <p className="text-sm text-gray-600">Top 27%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course-wise Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Performance</h3>
                <div className="space-y-4">
                  {courses.map(course => {
                    const avg = calculateCourseAverage(course.title);
                    const performance = getPerformanceLevel(avg);
                    
                    return (
                      <div key={course._id}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{course.title}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-bold ${getGradeColor(avg)}`}>{avg}%</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${performance.color}`}>
                              {performance.icon} {performance.level}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              avg >= 90 ? 'bg-green-600' : 
                              avg >= 80 ? 'bg-blue-600' : 
                              avg >= 70 ? 'bg-yellow-600' : 
                              'bg-red-600'
                            }`} 
                            style={{ width: `${avg}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">A (90-100)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">B (80-89)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">C (70-79)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">D (60-69)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">F (Below 60)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Results */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assessment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredResults.slice(0, 5).map((result) => (
                      <tr key={result._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{result.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Weight: {result.weight || 1}%</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.course.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            result.type === 'exam' ? 'bg-red-100 text-red-800' :
                            result.type === 'quiz' ? 'bg-yellow-100 text-yellow-800' :
                            result.type === 'project' ? 'bg-purple-100 text-purple-800' :
                            result.type === 'lab' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {result.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`text-lg font-bold ${getGradeColor(result.grade)}`}>
                              {result.grade}%
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPerformanceLevel(result.grade).color}`}>
                              {getLetterGrade(result.grade)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(result.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'detailed' && (
          <div className="space-y-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assessment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Weight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredResults.map((result) => (
                    <tr key={result._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{result.title}</div>
                          {result.feedback && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Feedback available</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {result.course.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          result.type === 'exam' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          result.type === 'quiz' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          result.type === 'project' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {result.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {result.weight || 1}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {result.grade}/{result.maxGrade || 100}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold ${getGradeColor(result.grade)}`}>
                            {result.grade}%
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPerformanceLevel(result.grade).color}`}>
                            {getLetterGrade(result.grade)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                          View Details
                        </button>
                        {result.feedback && (
                          <button className="text-green-600 hover:text-green-900">
                            Feedback
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'trends' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Trends</h3>
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg">📈</div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Performance trend chart will be displayed here</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Showing improvement over time</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject-wise Performance</h3>
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg">📊</div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Subject performance chart will be displayed here</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Comparing performance across subjects</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment Type Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Exams</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Quizzes</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Assignments</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Projects</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Labs</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="font-medium text-yellow-800">Dean's List</p>
                    <p className="text-sm text-yellow-600">3.8+ GPA for 2 consecutive semesters</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-medium text-blue-800">Perfect Attendance</p>
                    <p className="text-sm text-blue-600">100% attendance this semester</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-medium text-green-800">Top Performer</p>
                    <p className="text-sm text-green-600">Ranked in top 10% of class</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="font-medium text-purple-800">Subject Excellence</p>
                    <p className="text-sm text-purple-600">A+ grade in Mathematics</p>
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

export default MyResults;
