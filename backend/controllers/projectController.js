const Project = require('../models/Project');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    const { name, description, members } = req.body;

    const project = new Project({
        name,
        description,
        createdBy: req.user._id,
        members: members || []
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
};

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    let projects;
    if (req.user.role === 'admin') {
        projects = await Project.find({}).populate('createdBy', 'name email');
    } else {
        projects = await Project.find({ members: req.user._id }).populate('createdBy', 'name email');
    }
    res.json(projects);
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
    const { name, description, members } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
        project.name = name || project.name;
        project.description = description || project.description;
        project.members = members || project.members;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        await Project.deleteOne({ _id: req.params.id });
        res.json({ message: 'Project removed' });
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
};

module.exports = {
    createProject,
    getProjects,
    updateProject,
    deleteProject
};
