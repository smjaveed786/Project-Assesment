const Task = require("../models/Task");

// In-memory storage for tasks when the database is unreachable
let demoTasks = [
  { _id: "6634e0000000000000000001", title: "Complete design review", status: "todo", priority: "high", projectId: { _id: "6634c0000000000000000001", name: "Alpha Infrastructure" }, dueDate: "2026-05-10" },
  { _id: "6634e0000000000000000002", title: "Implement authentication", status: "in-progress", priority: "high", projectId: { _id: "6634c0000000000000000002", name: "Mobile App v2" }, dueDate: "2026-05-15" },
  { _id: "6634e0000000000000000003", title: "Update README", status: "done", priority: "low", projectId: { _id: "6634c0000000000000000001", name: "Alpha Infrastructure" }, dueDate: "2026-05-01" }
];

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    let tasks = [];
    try {
      const filter = projectId ? { projectId } : {};
      tasks = await Task.find(filter)
        .populate("projectId", "name")
        .populate("assignedTo", "name")
        .lean();
      
      // If DB is working, we ignore demoTasks. But if we want to show both:
      // tasks = [...tasks, ...demoTasks]; 
    } catch (e) {
      console.warn("Database unreachable, serving persistent demo tasks");
      tasks = demoTasks;
      if (projectId) {
        tasks = tasks.filter(t => t.projectId?._id === projectId);
      }
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
      res.json(task);
    } catch (e) {
      // Update in-memory for demo consistency
      demoTasks = demoTasks.map(t => t._id === id ? { ...t, status } : t);
      res.json({ _id: id, status });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.createTask = async (req, res) => {
  try {
    let { title, description, priority, dueDate, assignedTo, projectId } = req.body;

    const idMap = {
      "p1": "6634c0000000000000000001",
      "p2": "6634c0000000000000000002",
      "demo1": "6634c0000000000000000001",
      "demo2": "6634c0000000000000000002",
      "mock_id_admin@demo.com": "6634d0000000000000000002"
    };

    if (idMap[projectId]) projectId = idMap[projectId];
    if (idMap[assignedTo]) assignedTo = idMap[assignedTo];
    
    try {
      const task = await Task.create({
        title, description, priority,
        dueDate: dueDate || null,
        assignedTo: (assignedTo && assignedTo !== "") ? assignedTo : null,
        projectId: (projectId && projectId !== "") ? projectId : null,
        createdBy: req.user.id
      });
      res.json(task);
    } catch (dbError) {
      console.error("DB Error in createTask, saving to in-memory store");
      
      // Get project name for UI consistency in mock mode
      const projectNames = {
        "6634c0000000000000000001": "Alpha Infrastructure",
        "6634c0000000000000000002": "Mobile App v2"
      };

      const mockTask = {
        _id: `mock_${Date.now()}`,
        title, description, priority,
        dueDate: dueDate || null,
        assignedTo: { _id: assignedTo, name: "Assigned User" },
        projectId: { _id: projectId, name: projectNames[projectId] || "Project" },
        status: "todo",
        createdAt: new Date()
      };
      
      demoTasks = [mockTask, ...demoTasks];
      res.json(mockTask);
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error: " + err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Task.findByIdAndDelete(id);
    } catch (e) {
      demoTasks = demoTasks.filter(t => t._id !== id);
    }
    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
