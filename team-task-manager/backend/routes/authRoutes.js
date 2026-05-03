const router = require("express").Router();
const { signup, login, getUsers, updateUserRole } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", auth, getUsers);
router.put("/users/:id/role", auth, role("admin"), updateUserRole);

module.exports = router;
