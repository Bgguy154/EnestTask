import { useState, useEffect, useContext, type JSX } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import '../css/DashBoard.css';

type TaskStatus = 'todo' | 'in-progress' | 'done';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  tasksCount?: number;
}

const API_URL = import.meta.env.VITE_API_URL;

const ProjectDetail = (): JSX.Element => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');

  const [editingTaskId, setEditingTaskId] = useState('');
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [editingTaskDescription, setEditingTaskDescription] = useState('');
  const [editingTaskStatus, setEditingTaskStatus] = useState<TaskStatus>('todo');

  useEffect(() => {
    if (user && projectId) {
      fetchProject(projectId);
      fetchTasks(projectId);
    }
  }, [user, projectId]);

  const fetchProject = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get<Project>(`${API_URL}/projects/${id}`, {
        withCredentials: true,
      });
      setProject(res.data);
    } catch (err) {
      toast.error('Failed to load project.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get<Task[]>(`${API_URL}/tasks`, {
        params: { projectId: id },
        withCredentials: true,
      });
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load tasks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectId) return;
    if (!newTaskTitle.trim()) {
      toast.error('Please enter a task title.');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/projects/${projectId}/tasks`,
        {
          title: newTaskTitle,
          description: newTaskDescription,
          status: newTaskStatus,
        },
        {
          withCredentials: true,
        }
      );

      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskStatus('todo');
      toast.success('Task created successfully!');
      fetchTasks(projectId);
      fetchProject(projectId);
    } catch (err) {
      toast.error('Failed to create task.');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        withCredentials: true,
      });

      toast.success('Task deleted successfully!');
      if (projectId) fetchTasks(projectId);
      if (projectId) fetchProject(projectId);
    } catch (err) {
      toast.error('Failed to delete task.');
      console.error(err);
    }
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task._id);
    setEditingTaskTitle(task.title);
    setEditingTaskDescription(task.description || '');
    setEditingTaskStatus(task.status);
  };

  const handleCancelEdit = () => {
    setEditingTaskId('');
  };

  const handleSaveTask = async (taskId: string) => {
    if (!editingTaskTitle.trim()) {
      toast.error('Task title cannot be empty.');
      return;
    }

    try {
      await axios.put(
        `${API_URL}/tasks/${taskId}`,
        {
          title: editingTaskTitle,
          description: editingTaskDescription,
          status: editingTaskStatus,
        },
        {
          withCredentials: true,
        }
      );

      toast.success('Task updated successfully!');
      setEditingTaskId('');
      if (projectId) fetchTasks(projectId);
    } catch (err) {
      toast.error('Failed to update task.');
      console.error(err);
    }
  };

  const handleChangeTaskStatus = async (
    taskId: string,
    status: TaskStatus
  ) => {
    try {
      await axios.put(
        `${API_URL}/tasks/${taskId}`,
        { status },
        {
          withCredentials: true,
        }
      );

      if (projectId) fetchTasks(projectId);
    } catch (err) {
      toast.error('Failed to update task status.');
      console.error(err);
    }
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((task) =>
      statusFilter === 'all' ? true : task.status === statusFilter
    )
    .sort((a, b) => {
      if (sortOption === 'oldest') {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

  if (!projectId) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h2>Project not selected</h2>
            <p>Please choose a project from the dashboard.</p>
            <Link to="/dashboard">Back to dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>{project?.name || 'Project details'}</h2>
          <p>{project?.description || 'Manage tasks for this project.'}</p>
          <div className="task-controls">
            <button className="project-detail-link" onClick={() => navigate('/dashboard')}>
              Back to dashboard
            </button>
          </div>
        </div>

        <div className="task-form">
          <h4>Add Task to Project</h4>
          <form onSubmit={handleCreateTask}>
            <div className="task-form-grid">
              <div className="form-field">
                <label>Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Add a description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Status</label>
                <select
                  value={newTaskStatus}
                  onChange={(e) => setNewTaskStatus(e.target.value as TaskStatus)}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <button type="submit">Add Task</button>
            </div>
          </form>
        </div>

        <div className="tasks-section">
          <div className="tasks-header-row">
            <div>
              <h3>{project?.name || 'Project tasks'}</h3>
              <p>{project?.description}</p>
            </div>
            <div className="task-controls">
              <input
                type="text"
                placeholder="Search tasks by title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading project tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <h4>No tasks found.</h4>
              <p>Use the form above to add a task to this project.</p>
            </div>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => (
                <li
                  key={task._id}
                  className={`task-item ${task.status === 'done' ? 'completed' : ''}`}
                >
                  <div className="task-content">
                    {editingTaskId === task._id ? (
                      <div className="edit-fields">
                        <div className="form-field">
                          <label>Title</label>
                          <input
                            value={editingTaskTitle}
                            onChange={(e) => setEditingTaskTitle(e.target.value)}
                          />
                        </div>
                        <div className="form-field">
                          <label>Description</label>
                          <input
                            value={editingTaskDescription}
                            onChange={(e) => setEditingTaskDescription(e.target.value)}
                          />
                        </div>
                        <div className="form-field">
                          <label>Status</label>
                          <select
                            value={editingTaskStatus}
                            onChange={(e) => setEditingTaskStatus(e.target.value as TaskStatus)}
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="task-title">{task.title}</div>
                        {task.description && (
                          <div className="task-description">{task.description}</div>
                        )}
                        <div className="task-meta">
                          <span className={`status-badge ${task.status}`}>
                            {task.status === 'todo'
                              ? 'To Do'
                              : task.status === 'in-progress'
                              ? 'In Progress'
                              : 'Done'}
                          </span>
                          <small>{new Date(task.createdAt).toLocaleDateString()}</small>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="task-actions">
                    {editingTaskId === task._id ? (
                      <>
                        <button className="complete-btn" onClick={() => handleSaveTask(task._id)}>
                          Save
                        </button>
                        <button className="delete-btn" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="complete-btn"
                          onClick={() =>
                            handleChangeTaskStatus(
                              task._id,
                              task.status === 'done'
                                ? 'todo'
                                : task.status === 'in-progress'
                                ? 'done'
                                : 'in-progress'
                            )
                          }
                        >
                          {task.status === 'done'
                            ? 'Move to To Do'
                            : task.status === 'in-progress'
                            ? 'Mark Done'
                            : 'Start'}
                        </button>
                        <button className="edit-btn" onClick={() => handleStartEdit(task)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteTask(task._id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
