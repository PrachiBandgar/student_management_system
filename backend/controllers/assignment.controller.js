import Assignment from "../models/Assignment.js";

export const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({
      ...req.body,
      teacher: req.user.id
    });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("course")
      .populate("teacher", "name email");
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAssignments = async (req, res) => {
  try {
    let assignments;
    
    if (req.params.courseId) {
      // Get assignments by course ID
      assignments = await Assignment.find({ course: req.params.courseId })
        .populate("course")
        .populate("teacher", "name email");
    } else {
      // Get all assignments
      assignments = await Assignment.find()
        .populate("course")
        .populate("teacher", "name email");
    }
    
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
