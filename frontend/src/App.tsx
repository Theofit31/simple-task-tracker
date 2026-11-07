import { useEffect, useState } from "react";
import {
  Check,
  ClipboardList,
  Activity,
  CircleCheck,
  Plus,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import "./App.css";

type TaskStatus = "Todo" | "In Progress" | "Done";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
}

interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const EMPTY_FORM: TaskFormData = {
  title: "",
  description: "",
  status: "Todo",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  Todo: "Belum Dikerjakan",
  "In Progress": "Sedang Dikerjakan",
  Done: "Selesai",
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<{
    title?: string;
  }>({});
  // Add/Edit modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] =
    useState<TaskFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  // Delete confirmation modal
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/tasks`);

      if (!response.ok) {
        throw new Error("Gagal mengambil daftar tugas.");
      }

      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Open Add modal
  const openAddModal = () => {
    setEditingTask(null);
    setFormData(EMPTY_FORM);
    setIsFormOpen(true);
    setFormErrors({});
  };

  // Open Edit modal with existing data
  const openEditModal = (task: Task) => {
    setEditingTask(task);

    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
    });

    setIsFormOpen(true);
    setFormErrors({});
  };

  // Close Add/Edit modal
  const closeFormModal = () => {
    if (saving) return;

    setIsFormOpen(false);
    setEditingTask(null);
    setFormData(EMPTY_FORM);
  };

  // Handle form input changes
  const handleInputChange = <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Create or Update task
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      setFormErrors({
        title: "Judul tugas tidak boleh kosong.",
      });
      return;
    }
    setFormErrors({});
    const payload = {
      title: trimmedTitle,
      description: formData.description.trim(),
      status: formData.status,
    };

    try {
      setSaving(true);
      const isEditing = editingTask !== null;
      const url = isEditing
        ? `${API_URL}/tasks/${editingTask.id}`
        : `${API_URL}/tasks`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(
          result.detail || "Gagal menyimpan tugas."
        );
      }
      await fetchTasks();
      setIsFormOpen(false);
      setEditingTask(null);
      setFormData(EMPTY_FORM);
      setFormErrors({});
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan tugas."
      );
    } finally {
      setSaving(false);
    }
  };

  // Open Delete confirmation modal
  const openDeleteModal = (task: Task) => {
    setDeletingTask(task);
  };

  // Delete task after confirmation
  const handleDelete = async () => {
    if (!deletingTask) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_URL}/tasks/${deletingTask.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(
          result.detail || "Gagal menghapus tugas"
        );
      }

      await fetchTasks();
      setDeletingTask(null);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal menghapus tugas"
      );
    } finally {
      setDeleting(false);
    }
  };

  const todoTasks = tasks.filter(
    (task) => task.status === "Todo"
  );

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  );

  const doneTasks = tasks.filter(
    (task) => task.status === "Done"
  );

  const completedCount = doneTasks.length;

  return (
    <div className="app">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon">
            <Check size={27} strokeWidth={3} />
          </div>
          <span>TaskFlow</span>
        </div>
      </header>

      <main className="main-container">
        {/* Page heading */}
        <section className="page-heading">
          <h1>Daftar Tugas Saya</h1>
          <p>Kelola dan pantau aktivitas serta tugas harian Anda.</p>
        </section>

        {/* Dashboard statistics */}
        <section className="stats-grid">
          <div className="stat-card total-card">
           <div className="stat-icon total-icon"><ClipboardList size={32} strokeWidth={2} /></div>
            <div>
              <p>Total Tugas</p>
              <h2>{tasks.length}</h2>
            </div>
          </div>

          <div className="stat-card progress-card">
            <div className="stat-icon progress-icon"><Activity size={32} strokeWidth={2} /></div>
            <div>
              <p>Sedang Dikerjakan</p>
              <h2>{inProgressTasks.length}</h2>
            </div>
          </div>

          <div className="stat-card completed-card">
            <div className="stat-icon completed-icon"><CircleCheck size={32} strokeWidth={2} /></div>
            <div>
              <p>Selesai</p>
              <h2>{completedCount}</h2>
            </div>
          </div>
        </section>

        {/* Task board heading */}
        <section className="board-heading">
          <div>
            <h2>Papan Tugas</h2>
            <p>Atur dan pantau tugas berdasarkan status pengerjaan.</p>
          </div>

          <button className="add-button" onClick={openAddModal}>
            <Plus size={20} strokeWidth={2.5} />
            Tambah Tugas
          </button>
        </section>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchTasks}>Coba lagi</button>
          </div>
        )}

        {loading ? (
          <div className="loading">Memuat daftar tugas...</div>
        ) : (
          <section className="board-grid">
            <TaskColumn
              title="Belum Dikerjakan"
              status="Todo"
              tasks={todoTasks}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />

            <TaskColumn
              title="Sedang Dikerjakan"
              status="In Progress"
              tasks={inProgressTasks}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />

            <TaskColumn
              title="Selesai"
              status="Done"
              tasks={doneTasks}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          </section>
        )}
      </main>

      {/* Add / Edit Modal */}
      {isFormOpen && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeFormModal();
            }
          }}
        >
          <div className="form-modal">
            <div className="modal-header">
              <h2>
                {editingTask ? "Edit Tugas" : "Tambah Tugas Baru"}
              </h2>
              <button
                type="button"
                className="close-button"
                onClick={closeFormModal}
                aria-label="Tutup"
              >
                <X size={26} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">
                  Judul Tugas <span>*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  placeholder="Masukkan judul tugas..."
                  value={formData.title}
                  className={formErrors.title ? "input-error" : ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    handleInputChange("title", value);
                    if (value.trim()) {
                      setFormErrors((prev) => ({
                        ...prev,
                        title: undefined,
                      }));
                    }
                  }}
                  maxLength={255}
                />
                {formErrors.title && (
                  <p className="field-error">{formErrors.title}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Deskripsi
                </label>

                <textarea
                  id="description"
                  placeholder="Masukkan deskripsi tugas..."
                  value={formData.description}
                  onChange={(event) =>
                    handleInputChange("description", event.target.value)
                  }
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <StatusSelect
                  value={formData.status}
                  onChange={(status) =>
                    handleInputChange("status", status)
                  }
                />
              </div>

              {/* Keterangan wajib diisi */}
              <div className="required-note">
                <span>*</span> Wajib diisi
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeFormModal}
                  disabled={saving}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={saving}
                >
                  {saving
                    ? "Menyimpan..."
                    : editingTask
                    ? "Simpan Perubahan"
                    : "Buat Tugas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTask && (
        <div
          className="modal-overlay delete-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleting
            ) {
              setDeletingTask(null);
            }
          }}
        >
          <div className="delete-modal">
            <button
              className="close-button delete-close"
              onClick={() => setDeletingTask(null)}
              disabled={deleting}
              aria-label="Close"
            >
              <X className="close-spin-icon" size={25} />
            </button>

            <div className="delete-icon">
              <Trash2 size={38} strokeWidth={2.5} />
            </div>

            <h2>Hapus Tugas?</h2>

            <p>
              Apakah Anda yakin ingin menghapus{" "}
              <strong>“{deletingTask.title}”</strong>?
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="delete-actions">
              <button
                className="cancel-button"
                onClick={() => setDeletingTask(null)}
                disabled={deleting}
              >
                Batal
              </button>

              <button
                className="confirm-delete-button"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Task column component
interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}
interface StatusSelectProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
}

function StatusSelect({ value, onChange }: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options: TaskStatus[] = [
    "Todo",
    "In Progress",
    "Done",
  ];

  return (
    <div className="status-select">
      <button
        type="button"
        className={`status-select-trigger ${getStatusClass(value)}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="status-select-label">
          <span className="status-indicator" />
          {STATUS_LABELS[value]}
        </span>

        <span className={`dropdown-chevron ${isOpen ? "open" : ""}`}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="dropdown-backdrop"
            onClick={() => setIsOpen(false)}
          />

          <div className="status-select-menu">
            {options.map((status) => (
              <button
                type="button"
                key={status}
                className={`status-option ${getStatusClass(status)} ${
                  value === status ? "selected" : ""
                }`}
                onClick={() => {
                  onChange(status);
                  setIsOpen(false);
                }}
              >
                <span className="status-indicator" />
                <span>{STATUS_LABELS[status]}</span>

                {value === status && (
                  <Check size={17} className="option-check" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
function TaskColumn({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
}: TaskColumnProps) {
  return (
    <div className={`task-column ${getStatusClass(status)}`}>
      <div className="column-header">
        <div className="column-title">
          <span className="status-indicator" />
          <h3>{title}</h3>
        </div>

        <span className="task-count">{tasks.length}</span>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">Belum ada tugas</div>
        ) : (
          tasks.map((task) => (
            <article className="task-card" key={task.id}>
              <h4>{task.title}</h4>

              <p className="task-description">
                {task.description || "Tidak ada deskripsi."}
              </p>

              <div className="task-card-footer">
                <span className={`status-badge ${getStatusClass(status)}`}>
                  <span className="status-indicator" />
                  {STATUS_LABELS[task.status]}
                </span>

                <div className="task-actions">
                  <button
                    className="icon-button edit-button"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                    aria-label={`Edit ${task.title}`}
                  >
                    <Pencil size={19} />
                  </button>

                  <button
                    className="icon-button delete-button"
                    onClick={() => onDelete(task)}
                    title="Delete task"
                    aria-label={`Delete ${task.title}`}
                  >
                    <Trash2 size={19} />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}


function getStatusClass(status: TaskStatus): string {
  switch (status) {
    case "Todo":
      return "todo";

    case "In Progress":
      return "in-progress";

    case "Done":
      return "done";

    default:
      return "";
  }
}

export default App;