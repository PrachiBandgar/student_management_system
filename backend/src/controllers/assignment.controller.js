import Assignment from '../models/Assignment.js';

// Get all assignments
export const getAssignments = async (req, res) => {
  try {
    let assignments;
    
    if (req.params.courseId) {
      // Get assignments by course ID
      assignments = await Assignment.find({ course: req.params.courseId }).populate('course teacher submissions');
    } else {
      // Get all assignments
      assignments = await Assignment.find({}).populate('course teacher submissions');
    }
    
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
};

// Create a new assignment
export const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({
      title: req.body.title,
      description: req.body.description,
      course: req.body.course,
      dueDate: req.body.dueDate,
      teacher: req.user._id // ✅ permanent
    });

    // Populate for response to include course and teacher details
    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('course', 'title description')
      .populate('teacher', 'name email');

    res.status(201).json(populatedAssignment);
  } catch (error) {
    res.status(400).json({
      message: "Error creating assignment",
      error: error.message
    });
  }
};

// Update an assignment
export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course teacher submissions');
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.status(200).json(assignment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating assignment', error: error.message });
  }
};

// Delete an assignment
export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment', error: error.message });
  }
};
