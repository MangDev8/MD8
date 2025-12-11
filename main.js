// === Sidebar Toggle ===
const menuIcon = document.getElementById("menu-icon");
const sidebar = document.getElementById("sidebar");

// Toggle sidebar saat icon diklik
menuIcon.addEventListener("click", (e) => {
        e.stopPropagation(); // penting: biar klik icon gak nutup sidebar
        sidebar.classList.toggle("hidden");
});

// Cegah sidebar nutup kalau diklik di dalamnya
sidebar.addEventListener("click", (e) => e.stopPropagation());

// Tutup sidebar kalau klik di luar
document.addEventListener("click", () => {
        sidebar.classList.add("hidden");
});

// === Admin dan Sistem Postingan ===
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const loginMsg = document.getElementById("login-msg");
const loginSection = document.getElementById("login-section");
const adminPanel = document.getElementById("admin-panel");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const saveDraftBtn = document.getElementById("save-draft");
const publishBtn = document.getElementById("publish");
const draftList = document.getElementById("draft-list");
const publishedList = document.getElementById("published-list");
const logoutBtn = document.getElementById("logout");

// Akun admin
const ADMIN_USER = "admin";
const ADMIN_PASS = "12345";

// Jika sudah login sebelumnya
if (localStorage.getItem("loggedIn") === "true") {
        showAdminPanel();
}

// === Event Login ===
loginBtn?.addEventListener("click", () => {
        if (
                usernameInput.value.trim() === ADMIN_USER &&
                passwordInput.value.trim() === ADMIN_PASS
        ) {
                localStorage.setItem("loggedIn", "true");
                showAdminPanel();
        } else {
                loginMsg.textContent = "Username atau password salah!";
        }
});

// === Logout ===
logoutBtn?.addEventListener("click", () => {
        localStorage.removeItem("loggedIn");
        location.reload();
});

// === Fungsi Tampilan ===
function showAdminPanel() {
        loginSection.style.display = "none";
        adminPanel.style.display = "block";
        loadPosts();
}

// === Muat Postingan ===
function loadPosts() {
        const drafts = JSON.parse(localStorage.getItem("drafts") || "[]");
        const published = JSON.parse(localStorage.getItem("published") || "[]");
        
        draftList.innerHTML = "";
        publishedList.innerHTML = "";
        
        // Drafts
        drafts.forEach((d, i) => {
                const li = document.createElement("li");
                li.innerHTML = `
      <b>${d.title}</b>
      <button onclick="publish(${i})">Publish</button>
    `;
                draftList.appendChild(li);
        });
        
        // Published
        published.forEach((p) => {
                const li = document.createElement("li");
                li.innerHTML = `<b>${p.title}</b> - ${p.content}`;
                publishedList.appendChild(li);
        });
}

// === Simpan Draft ===
saveDraftBtn?.addEventListener("click", () => {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        if (!title || !content) return alert("Judul dan konten wajib diisi!");
        
        const drafts = JSON.parse(localStorage.getItem("drafts") || "[]");
        drafts.push({ title, content });
        localStorage.setItem("drafts", JSON.stringify(drafts));
        
        titleInput.value = "";
        contentInput.value = "";
        loadPosts();
});

// === Publish Langsung ===
publishBtn?.addEventListener("click", () => {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        if (!title || !content) return alert("Judul dan konten wajib diisi!");
        
        const published = JSON.parse(localStorage.getItem("published") || "[]");
        published.push({ title, content });
        localStorage.setItem("published", JSON.stringify(published));
        
        titleInput.value = "";
        contentInput.value = "";
        loadPosts();
});

// === Pindahkan dari draft ke published ===
function publish(index) {
        const drafts = JSON.parse(localStorage.getItem("drafts") || "[]");
        const published = JSON.parse(localStorage.getItem("published") || "[]");
        
        published.push(drafts[index]);
        drafts.splice(index, 1);
        
        localStorage.setItem("drafts", JSON.stringify(drafts));
        localStorage.setItem("published", JSON.stringify(published));
        loadPosts();
}