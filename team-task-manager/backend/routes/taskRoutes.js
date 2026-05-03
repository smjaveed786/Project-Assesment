const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask
} = require("../controllers/taskController");

// Anyone authenticated can create task (Admin or Member)
router.post("/", auth, createTask);

// Get tasks
router.get("/", auth, getTasks);

// Member updates status
router.put("/:id/status", auth, updateTaskStatus);

// Admin deletes task
router.delete("/:id", auth, role("admin"), deleteTask);

module.exports = router;
