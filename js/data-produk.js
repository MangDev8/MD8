    // ================= DATA PRODUK =================
    const products = [
      {
        name: "Lampu Emergency Rakitan Mini",
        price: "Rp 50.000",
        desc: "Lampu kecil ringan, cocok buat camping dan emergency.",
        images: ["p1.png", "p2.png"],
        link: "https://shopee.co.id/produk-lampu"
      },
      {
        name: "Amplifier Mini 3W",
        price: "Rp 30.000",
        desc: "Amplifier mini cocok untuk speaker kecil dan portable.",
        images: ["p2.png"],
        link: "https://shopee.co.id/amp-mini"
      },
      {
        name: "Amplifier High Power",
        price: "Rp 150.000",
        desc: "Daya gede, suara bening, cocok buat speaker rakitan.",
        images: ["p1.png", "p2.png", "p3.png"],
        link: "https://shopee.co.id/amp-power"
      },
      {
        name: "Amplifier Ultra Bass",
        price: "Rp 150.000",
        desc: "Bass kuat, cocok untuk audio rumahan.",
        images: ["p3.png", "p2.png"],
        link: "https://shopee.co.id/amp-bass"
      }
    ];

    // ================= GENERATE CARD =================
    const list = document.getElementById("product-list");

    products.forEach((p, i) => {
      list.innerHTML += `
        <div class="product-card" onclick="openPopup(${i})">
          <img src="${p.images[0]}" />
          <p class="name">${p.name}</p>
          <p class="price">${p.price}</p>
        </div>
      `;
    });
