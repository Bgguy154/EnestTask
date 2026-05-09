// taskController.js
import Task from "../models/Task.js";

export async function getTasks(req, res) {
  try {
    const { projectId, status, search, sort } = req.query;

    const filter = { user: req.user._id };

    if (projectId) {
      filter.project = projectId;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    let query = Task.find(filter).populate("project", "name");

    if (sort === "oldest") {
      query = query.sort({ createdAt: 1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const tasks = await query;
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createTask(req, res) {
  const { title, description, status, assignedTo, projectId } = req.body;

  if (!title || !title.trim())
    return res.status(400).json({ message: "Please add a title" });

  if (!projectId) {
    return res.status(400).json({ message: "A project is required for the task" });
  }

  try {
    const task = await Task.create({
      title: title.trim(),
      description: description?.trim(),
      status: status || "todo",
      assignedTo: assignedTo?.trim(),
      project: projectId,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    const updateData = {
      ...(req.body.title !== undefined && { title: req.body.title.trim() }),
      ...(req.body.description !== undefined && { description: req.body.description.trim() }),
      ...(req.body.status !== undefined && { status: req.body.status }),
      ...(req.body.assignedTo !== undefined && { assignedTo: req.body.assignedTo.trim() }),
    };

    if (req.body.completed !== undefined) {
      updateData.status = req.body.completed ? "done" : "todo";
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    await Task.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Task removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
