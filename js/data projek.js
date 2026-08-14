    // ================= DATA PRODUK =================
    const products = [
      {
        name: "Lampu Emergency Rakitan Mini",
        desc: "Lampu kecil ringan, cocok buat camping dan emergency.",
        images: ["p1.png", "p2.png"],
      },
      {
        name: "Lampu Emergency Rakitan Mini",
        desc: "Lampu kecil ringan, cocok buat camping dan emergency.",
        images: ["p1.png", "p2.png"],
      },
      {
        name: "Lampu Emergency Rakitan Mini",
        desc: "Lampu kecil ringan, cocok buat camping dan emergency.",
        images: ["p1.png", "p2.png"],
      },
      {
        name: "Lampu Emergency Rakitan Mini",
        desc: "Lampu kecil ringan, cocok buat camping dan emergency.",
        images: ["p1.png", "p2.png"],
      },

    ];

    // ================= GENERATE CARD =================
    const list = document.getElementById("product-list");

    products.forEach((p, i) => {
      list.innerHTML += `
        <div class="product-card" onclick="openPopup(${i})">
          <img src="${p.images[0]}" />
          <p class="name">${p.name}</p>
        </div>
      `;
    });
  
      