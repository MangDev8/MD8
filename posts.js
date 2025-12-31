const postBtn = document.getElementById("post-btn");
const postList = document.getElementById("post-list");

postBtn.addEventListener("click", async () => {
  const user = document.getElementById("post-username").value.trim();
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();

  if (!user || !title || !content) {
    alert("Semua wajib diisi");
    return;
  }

  await fetch("api/post.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, title, content })
  });

  loadPosts();
});

// Ambil post
async function loadPosts() {
  const res = await fetch("api/get.php");
  const posts = await res.json();

  postList.innerHTML = "";

  posts.reverse().forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${p.title}</b>
      <small>oleh ${p.user}</small>
      <p>${p.content}</p>
      <hr>
    `;
    postList.appendChild(li);
  });
}

loadPosts();