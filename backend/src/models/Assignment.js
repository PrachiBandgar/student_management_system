import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["draft", "published", "closed"],
    default: "draft"
  },
  maxScore: {
    type: Number,
    default: 100
  },
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Submission"
  }]
}, {
  timestamps: true
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
