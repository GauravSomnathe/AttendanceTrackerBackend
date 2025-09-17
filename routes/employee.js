// routes/employee.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ CREATE employee
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({ 
      name, 
      email, 
      password, 
      role: role || "employee",
      lateCount: 0 // default
    });
    await user.save();

    res.status(201).json({ message: "Employee created", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ READ all employees
router.get("/", async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ READ single employee
router.get("/:id", async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select("-password");
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ UPDATE employee
router.put("/:id", async (req, res) => {
  try {
    const { name, email, role, lateCount } = req.body;
    const employee = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, lateCount },
      { new: true }
    ).select("-password");

    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee updated", employee });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ DELETE employee
router.delete("/:id", async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ===============================
// 🚨 NEW: Mark Employee as Late
// ===============================
router.put("/:id/late", async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    employee.lateCount += 1;
    await employee.save();

    res.json({ message: "Late marked successfully", lateCount: employee.lateCount });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===============================
// 🚨 NEW: Get all late employees
// ===============================
router.get("/late/employees", async (req, res) => {
  try {
    const lateEmployees = await User.find({ role: "employee", lateCount: { $gt: 0 } }).select("-password");
    res.json(lateEmployees);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
