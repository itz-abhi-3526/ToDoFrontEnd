import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import Login from "./Login";
import Signup from "./Signup";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const fetchTasks = async (token) => {
    const response = await fetch(
      "https://todobackend-6cpm.onrender.com/tasks",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setTasks(Array.isArray(data) ? data : data.tasks || []);
  };

  useEffect(() => {
    if (token) fetchTasks(token);
  }, [token]);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  const addTask = async (text) => {
    const response = await fetch(
      "https://todobackend-6cpm.onrender.com/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, status: "pending", priority: "medium" }),
      }
    );
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
  };

  const deleteTask = async (id) => {
    await fetch(`https://todobackend-6cpm.onrender.com/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const updateTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    const response = await fetch(
      `https://todobackend-6cpm.onrender.com/tasks/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const updateTaskPriority = async (id, newPriority) => {
    const response = await fetch(
      `https://todobackend-6cpm.onrender.com/tasks/${id}/priority`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority: newPriority }),
      }
    );
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      (filterPriority === "all" || task.priority === filterPriority)
  );

  const MainApp = () => (
    <div className="app-container">
      <nav className="navbar glass">
        <div className="nav-content">
          <a href="/" className="btn home-btn">
            Home
          </a>
          <button className="btn logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <motion.h1
          className="title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Vanta – Clarity in Chaos!
        </motion.h1>

        <form
          className="task-form"
          onSubmit={(e) => {
            e.preventDefault();
            addTask(e.target[0].value);
            e.target[0].value = "";
          }}
        >
          <input type="text" placeholder="Add a task" required />
          <button type="submit" className="btn purple">
            Add
          </button>
        </form>

        <div className="filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">Filter</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <ul className="task-list">
          {filteredTasks.map((task) => (
            <motion.li
              key={task._id}
              className="task glass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="task-info">
                <span>{task.text}</span>
                <small>
                  ({task.status}, {task.priority})
                </small>
              </div>
              <div className="task-actions">
                <button
                  className={`btn ${
                    task.status === "pending" ? "yellow" : "green"
                  }`}
                  onClick={() => updateTaskStatus(task._id, task.status)}
                >
                  {task.status === "pending" ? "Mark Complete" : "Mark Pending"}
                </button>
                <select
                  value={task.priority}
                  onChange={(e) => updateTaskPriority(task._id, e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  className="btn red"
                  onClick={() => deleteTask(task._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      </main>

      <footer className="footer glass">© 2025 Vanta.</footer>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={token ? <MainApp /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
