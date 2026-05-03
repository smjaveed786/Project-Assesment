const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createProject,
  getProjects,
  getProject,
  addMember,
  deleteProject
} = require("../controllers/projectController");

// Admin creates project
router.post("/", auth, role("admin"), createProject);

// Get single project
router.get("/:id", auth, getProject);

// Get projects for logged user
router.get("/", auth, getProjects);

// Add member (Admin only)
router.put("/:id/add-member", auth, role("admin"), addMember);

// Delete project
router.delete("/:id", auth, role("admin"), deleteProject);

module.exports = router;
