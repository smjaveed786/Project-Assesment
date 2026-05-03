const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
    const { title, description, status, assignedTo, projectId, dueDate } = req.body;

    const task = new Task({
        title,
        description,
        status: status || 'todo',
        assignedTo,
        projectId,
        dueDate
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
};

// @desc    Get tasks by project
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    const projectId = req.query.projectId;
    const filter = projectId ? { projectId } : {};
    
    // If member, they can only see tasks assigned to them? 
    // Usually members see all tasks in a project they are part of.
    // But the prompt says "Member: view assigned tasks".
    if (req.user.role === 'member') {
        filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter).populate('assignedTo', 'name email').populate('projectId', 'name');
    res.json(tasks);
};

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const { title, description, status, assignedTo, dueDate } = req.body;
    const task = await Task.findById(req.params.id);

    if (task) {
        if (req.user.role === 'admin') {
            task.title = title || task.title;
            task.description = description || task.description;
            task.status = status || task.status;
            task.assignedTo = assignedTo || task.assignedTo;
            task.dueDate = dueDate || task.dueDate;
        } else {
            // Member can only update status
            if (status) {
                task.status = status;
            } else {
                return res.status(403).json({ message: 'Members can only update status' });
            }
        }

        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        await Task.deleteOne({ _id: req.params.id });
        res.json({ message: 'Task removed' });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};
