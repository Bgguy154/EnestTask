import Project from "../models/Project.js";
import Task from "../models/Task.js";

export async function getProjects(req, res) {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });

    const results = await Promise.all(
      projects.map(async (project) => {
        const tasksCount = await Task.countDocuments({
          project: project._id,
          user: req.user._id,
        });
        return {
          ...project.toObject(),
          tasksCount,
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getProjectById(req, res) {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const tasksCount = await Task.countDocuments({
      project: project._id,
      user: req.user._id,
    });

    res.status(200).json({
      ...project.toObject(),
      tasksCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createProject(req, res) {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Project name is required" });
  }

  try {
    const project = await Project.create({
      name: name.trim(),
      description: description?.trim(),
      user: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateProject(req, res) {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name?.trim() ?? project.name,
        description: req.body.description?.trim() ?? project.description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteProject(req, res) {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Task.deleteMany({ project: project._id, user: req.user._id });
    await project.deleteOne();

    res.status(200).json({ message: "Project removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createProjectTask(req, res) {
  const { title, description, status, assignedTo } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Please add a title" });
  }

  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim(),
      status: status || "todo",
      assignedTo: assignedTo?.trim(),
      project: project._id,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
