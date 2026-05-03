const express = require('express');
const {
    createProject,
    getProjects,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

const { check } = require('express-validator');
const validate = require('../middleware/validate');

router.route('/')
    .get(protect, getProjects)
    .post(protect, admin, [
        check('name', 'Project name is required').not().isEmpty(),
        validate
    ], createProject);

router.route('/:id')
    .put(protect, admin, updateProject)
    .delete(protect, admin, deleteProject);

module.exports = router;
