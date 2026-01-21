import User from "../models/User.js";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Get students only
export const getStudents = async (req, res) => {
  try {
    console.log("Fetching students from database...");
    const students = await User.find({ role: "student" }).select("-password");
    console.log("Found students:", students.length);
    console.log("Students data:", students);
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
};

// Get teachers only
export const getTeachers = async (req, res) => {
  try {
    console.log("Fetching teachers from database...");
    const teachers = await User.find({ role: "teacher" }).select("-password");
    
    // Ensure status always exists
    const teachersWithStatus = teachers.map(teacher => ({
      ...teacher.toObject(),
      status: teacher.status || "active"
    }));
    
    console.log("Found teachers:", teachersWithStatus.length);
    console.log("Teachers data:", teachersWithStatus);
    res.status(200).json(teachersWithStatus);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Error fetching teachers", error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Filter undefined fields before update
    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(([_, v]) => v !== undefined && v !== "")
    );
    
    // Don't allow role change through this endpoint
    delete updateData.role;
    
    console.log("Updating user with data:", updateData);

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated user:", user);
    // Return UPDATED user object directly (not wrapped)
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// Create teacher
export const createTeacher = async (req, res) => {
  try {
    console.log("Creating teacher with data:", req.body);
    
    const { name, email, password, department, phone } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Missing required fields: name, email, password are required" 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User with this email already exists" 
      });
    }
    
    const teacher = new User({
      name,
      email,
      password,
      department: department || "",
      phone: phone || "",
      role: "teacher",
      status: "active"
    });
    
    const savedTeacher = await teacher.save();
    console.log("Created teacher:", savedTeacher);
    
    // Return teacher without password
    const teacherResponse = savedTeacher.toObject();
    delete teacherResponse.password;
    
    res.status(201).json(teacherResponse);
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ message: "Error creating teacher", error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
