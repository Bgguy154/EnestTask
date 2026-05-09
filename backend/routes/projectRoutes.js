import { Router } from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  createProjectTask,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/").get(protect, getProjects).post(protect, createProject);
router
  .route("/:id")
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);
router.route("/:id/tasks").post(protect, createProjectTask);

export default router;
