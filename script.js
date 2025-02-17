// Login Modal Logic
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");
const loginForm = document.getElementById("loginForm");
const adminDashboard = document.getElementById("adminDashboard");
const closeAdminDashboard = document.getElementById("closeAdminDashboard");

// Store users in localStorage (simplified)
let users = JSON.parse(localStorage.getItem("users")) || [];
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

// Add isLoggedIn state variable
let isLoggedIn = false;

loginBtn.addEventListener("click", () => {
  if (isLoggedIn) {
    showAdminDashboard();
  } else {
    loginModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
});

const closeLoginModal = () => {
  loginModal.classList.add("hidden");
  document.body.style.overflow = "auto";
};

closeModal.addEventListener("click", closeLoginModal);

// Update the login form submit handler
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    isLoggedIn = true;
    showAdminDashboard();
    closeLoginModal();
    loginBtn.innerHTML = '<i class="fas fa-user-circle mr-2"></i>Admin';
  } else {
    alert("Invalid email or password!");
  }
});

loginModal.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    closeLoginModal();
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Update showAdminDashboard function to check login state
function showAdminDashboard() {
  if (!isLoggedIn) {
    loginModal.classList.remove("hidden");
    return;
  }
  adminDashboard.classList.remove("hidden");
  updateUsersTable();
}

closeAdminDashboard.addEventListener("click", () => {
  adminDashboard.classList.add("hidden");
});

function updateUsersTable() {
  const tbody = document.getElementById("usersTableBody");
  const totalUsersElement = document.getElementById("totalUsers");
  tbody.innerHTML = "";
  totalUsersElement.textContent = users.length;

  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <i class="fas fa-user text-gray-500"></i>
                        </div>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${
                          user.email
                        }</div>
                        <div class="text-sm text-gray-500">${
                          user.fullName || "N/A"
                        }</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                    ${new Date(user.dateRegistered).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }">
                    ${user.status || "Active"}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button onclick="editUser(${user.id})" 
                        class="text-blue-600 hover:text-blue-900 transition duration-300">
                    <i class="fas fa-edit mr-1"></i>
                    Edit
                </button>
                <button onclick="toggleUserStatus(${user.id})" 
                        class="text-yellow-600 hover:text-yellow-900 transition duration-300">
                    <i class="fas fa-toggle-on mr-1"></i>
                    Toggle Status
                </button>
                <button onclick="deleteUser(${user.id})" 
                        class="text-red-600 hover:text-red-900 transition duration-300">
                    <i class="fas fa-trash mr-1"></i>
                    Delete
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

function editUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (user) {
    const newName = prompt("Enter new name:", user.fullName);
    const newEmail = prompt("Enter new email:", user.email);
    if (newName && newEmail) {
      updateUser(userId, { fullName: newName, email: newEmail });
    }
  }
}

function toggleUserStatus(userId) {
  const user = users.find((u) => u.id === userId);
  if (user) {
    const newStatus = user.status === "active" ? "inactive" : "active";
    updateUser(userId, { status: newStatus });
  }
}

function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    users = users.filter((user) => user.id !== userId);
    localStorage.setItem("users", JSON.stringify(users));
    updateUsersTable();
  }
}

// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLoginBtn = document.getElementById("mobileLoginBtn");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.add("hidden");
  }
});

// Mobile login button
mobileLoginBtn.addEventListener("click", () => {
  loginModal.classList.remove("hidden");
  mobileMenu.classList.add("hidden");
  document.body.style.overflow = "hidden";
});

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

// Add logout button handler
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  isLoggedIn = false;
  adminDashboard.classList.add("hidden");
  loginBtn.innerHTML = '<i class="fas fa-user-circle mr-2"></i>Login';
  alert("You have been successfully logged out!");
});

// Add user management functions
function addUser(userData) {
  const newUser = {
    id: Date.now(),
    ...userData,
    dateRegistered: new Date().toISOString(),
    status: "active",
  };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  updateUsersTable();
}

function updateUser(userId, updatedData) {
  users = users.map((user) =>
    user.id === userId ? { ...user, ...updatedData } : user
  );
  localStorage.setItem("users", JSON.stringify(users));
  updateUsersTable();
}

// Add registration related variables
const registerBtn = document.getElementById("registerBtn");
const registerModal = document.getElementById("registerModal");
const closeRegisterModal = document.getElementById("closeRegisterModal");
const registerForm = document.getElementById("registerForm");

// Add register button to navigation
registerBtn.addEventListener("click", () => {
  registerModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
});

closeRegisterModal.addEventListener("click", () => {
  registerModal.classList.add("hidden");
  document.body.style.overflow = "auto";
});

// Handle registration form submission
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fullName = document.getElementById("regFullName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  // Check if email already exists
  if (users.some((user) => user.email === email)) {
    alert("This email is already registered!");
    return;
  }

  // Add new user
  addUser({
    fullName,
    email,
    password,
  });

  alert("Registration successful!");
  registerModal.classList.add("hidden");
  document.body.style.overflow = "auto";
  registerForm.reset();
});

// Close modal when clicking outside
registerModal.addEventListener("click", (e) => {
  if (e.target === registerModal) {
    registerModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
});
