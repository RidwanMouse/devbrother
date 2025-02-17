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
        // Update login button to show logged in state
        loginBtn.innerHTML = '<i class="fas fa-user-circle mr-2"></i>Admin';
    } else {
        alert("Email-ka ama password-ka waa khalad!");
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
    tbody.innerHTML = "";

    users.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${user.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${new Date(
                    user.dateRegistered
                ).toLocaleDateString()}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="deleteUser(${
                    user.id
                })" class="text-rose-500 hover:text-rose-700">
                    <i class="fas fa-trash"></i> Tir
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteUser(userId) {
    if (confirm("Ma hubtaa inaad tirto user-kan?")) {
        users = users.filter((user) => user.id !== userId);
        localStorage.setItem("users", JSON.stringify(users));
        updateUsersTable();
    }
}

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLoginBtn = document.getElementById('mobileLoginBtn');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
    }
});

// Mobile login button
mobileLoginBtn.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = 'hidden';
});

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Add logout button handler
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
    isLoggedIn = false;
    adminDashboard.classList.add("hidden");
    // Reset login button text
    loginBtn.innerHTML = '<i class="fas fa-user-circle mr-2"></i>Login';
    // Show logout message
    alert("Waad ka baxday account-ka!");
}); 