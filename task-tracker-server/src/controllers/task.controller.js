const Task = require('../models/Task.model');
const asyncHandler = require('../utils/asyncHandler');

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Task title is required');
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    user: req.user._id
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task }
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, page = 1, limit = 10 } = req.query;

  const filter = { user: req.user._id };

  if (status) {
    // Handle both 'in-progress' and 'in_progress' formats
    if (status === 'in-progress') {
      filter.status = { $in: ['in-progress', 'in_progress'] };
    } else {
      filter.status = status;
    }
  }

  if (priority) {
    filter.priority = priority;
  }

  console.log('=== GET TASKS QUERY ===');
  console.log('Status param from request:', status);
  console.log('Final filter:', JSON.stringify(filter));

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  console.log('Found tasks:', tasks.length);
  tasks.forEach(t => console.log(`  - ${t.title}: status='${t.status}'`));

  const total = await Task.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: {
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalTasks: total,
        limit: parseInt(limit)
      }
    }
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this task');
  }

  res.status(200).json({
    success: true,
    data: { task }
  });
});

const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  const { title, description, status, priority, dueDate } = req.body;

  task.title = title !== undefined ? title : task.title;
  task.description = description !== undefined ? description : task.description;
  task.status = status !== undefined ? status : task.status;
  task.priority = priority !== undefined ? priority : task.priority;
  task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

  task = await task.save();

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: { task }
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully'
  });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
