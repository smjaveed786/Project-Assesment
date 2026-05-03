const Task = require('../models/Task');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    const filter = {};
    if (req.user.role === 'member') {
        filter.assignedTo = req.user._id;
    }

    const totalTasks = await Task.countDocuments(filter);
    const completedTasks = await Task.countDocuments({ ...filter, status: 'done' });
    const pendingTasks = await Task.countDocuments({ ...filter, status: { $ne: 'done' } });
    
    const now = new Date();
    const overdueTasks = await Task.countDocuments({ 
        ...filter, 
        status: { $ne: 'done' }, 
        dueDate: { $lt: now } 
    });

    res.json({
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks
    });
};

module.exports = { getDashboardStats };
