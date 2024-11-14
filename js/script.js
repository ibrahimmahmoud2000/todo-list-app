document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "system";
  setTheme(savedTheme);

  // When the user selects a theme via icons
  document.getElementById("lightModeIcon").addEventListener("click", () => {
    setTheme("light");
    localStorage.setItem("theme", "light");
  });

  document.getElementById("darkModeIcon").addEventListener("click", () => {
    setTheme("dark");
    localStorage.setItem("theme", "dark");
  });

  document.getElementById("systemModeIcon").addEventListener("click", () => {
    setTheme("system");
    localStorage.setItem("theme", "system");
  });

  // Load saved tasks
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTaskToDOM(task.title, task.description, task.completed));
  
  document.getElementById("addTask").addEventListener("click", () => {
    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();

    if (title) {
      addTaskToDOM(title, description);
      saveTasksToLocalStorage();
      document.getElementById("taskTitle").value = "";
      document.getElementById("taskDescription").value = "";
    }
  });
});

let currentEditTask = null;
let currentDeleteTask = null;

function addTaskToDOM(title, description, completed = false) {
  const taskList = document.getElementById("taskList");

  const taskItem = document.createElement("li");
  taskItem.className = `list-group-item d-flex justify-content-between align-items-start task-item ${completed ? "done" : ""}`;
  taskItem.innerHTML = `
    <div>
      <h5 class="task-title mb-1">${title}</h5>
      <small class="task-desc text-muted">${description}</small>
    </div>
    <div class="task-actions">
      <i class="fa fa-check-circle" onclick="toggleTaskCompletion(this)"></i>
      <i class="fa fa-edit" onclick="openEditModal(this)"></i>
      <i class="fa fa-trash" onclick="openDeleteModal(this)"></i>
    </div>
  `;

  taskList.appendChild(taskItem);
}

function toggleTaskCompletion(element) {
  const taskItem = element.closest(".task-item");
  taskItem.classList.toggle("done");
  saveTasksToLocalStorage();
}

function openEditModal(element) {
  // Set the current task
  currentEditTask = element.closest(".task-item");
  const title = currentEditTask.querySelector(".task-title").textContent;
  const description = currentEditTask.querySelector(".task-desc").textContent;

  // Set values in the form
  document.getElementById("editTaskTitle").value = title;
  document.getElementById("editTaskDescription").value = description;

  // Show the edit modal
  const editModal = new bootstrap.Modal(document.getElementById("editTaskModal"));
  editModal.show();
}

function openDeleteModal(element) {
  currentDeleteTask = element.closest(".task-item");
  const deleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
  deleteModal.show();
}

function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll(".task-item").forEach(taskItem => {
    const title = taskItem.querySelector(".task-title").textContent;
    const description = taskItem.querySelector(".task-desc").textContent;
    const completed = taskItem.classList.contains("done");
    tasks.push({ title, description, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.getElementById("saveEdit").addEventListener("click", () => {
  if (currentEditTask) {
    // Get the edited title and description
    const newTitle = document.getElementById("editTaskTitle").value;
    const newDescription = document.getElementById("editTaskDescription").value;

    // Update title and description in the DOM
    currentEditTask.querySelector(".task-title").textContent = newTitle;
    currentEditTask.querySelector(".task-desc").textContent = newDescription;

    // Save changes to localStorage
    saveTasksToLocalStorage();

    // Close the edit modal
    const editModal = bootstrap.Modal.getInstance(document.getElementById("editTaskModal"));
    editModal.hide();
  }
});

document.getElementById("confirmDelete").addEventListener("click", () => {
  if (currentDeleteTask) {
    currentDeleteTask.remove();
    saveTasksToLocalStorage();

    const deleteModal = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal"));
    deleteModal.hide();
  }
});

// Apply the selected theme
function setTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDarkScheme ? "dark" : "light");
  }
}

