import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: String,
  fileUrl: String,
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Submission", submissionSchema);
