const express = require('express');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

const { check } = require('express-validator');
const validate = require('../middleware/validate');

router.route('/')
    .get(protect, getTasks)
    .post(protect, admin, [
        check('title', 'Task title is required').not().isEmpty(),
        check('projectId', 'Project ID is required').not().isEmpty(),
        validate
    ], createTask);

router.route('/:id')
    .put(protect, updateTask) // Members can update status, logic handled in controller
    .delete(protect, admin, deleteTask);

module.exports = router;
