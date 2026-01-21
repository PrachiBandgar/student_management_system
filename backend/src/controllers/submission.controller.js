import Submission from '../models/Submission.js';

// Get all submissions
export const getSubmissions = async (req, res) => {
  try {
    let submissions;
    
    if (req.params.assignmentId) {
      // Get submissions by assignment ID
      submissions = await Submission.find({ assignment: req.params.assignmentId }).populate('assignment student');
    } else if (req.params.studentId) {
      // Get submissions by student ID
      submissions = await Submission.find({ student: req.params.studentId }).populate('assignment student');
    } else {
      // Get all submissions
      submissions = await Submission.find({}).populate('assignment student');
    }
    
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
};

// Create a new submission
export const createSubmission = async (req, res) => {
  try {
    const submission = new Submission({
      assignment: req.body.assignment,
      student: req.body.student,
      content: req.body.content,
      fileUrl: req.body.fileUrl,
      submittedAt: new Date()
    });
    const savedSubmission = await submission.save();
    
    // Populate the references for response
    const populatedSubmission = await Submission.findById(savedSubmission._id).populate('assignment student');
    
    res.status(201).json(populatedSubmission);
  } catch (error) {
    res.status(400).json({ message: 'Error creating submission', error: error.message });
  }
};

// Submit assignment (for students)
export const submitAssignment = async (req, res) => {
  try {
    const submission = await Submission.create({
      assignment: req.body.assignmentId,
      student: req.user._id, // ✅ from auth
      content: req.body.content
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({
      message: "Error submitting assignment",
      error: error.message
    });
  }
};

// Update a submission
export const updateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignment student');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    res.status(200).json(submission);
  } catch (error) {
    res.status(400).json({ message: 'Error updating submission', error: error.message });
  }
};

// Delete a submission
export const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting submission', error: error.message });
  }
};
