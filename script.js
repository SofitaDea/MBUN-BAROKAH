/* =====================================================
   PENGATURAN — edit bagian ini saja untuk ubah data
   ===================================================== */
const WA_NUMBER = "6287836345222"; // 087836345222 -> format internasional tanpa +

// kategori: "bakso" atau "mie" | harga dalam Rupiah | emoji bisa diganti
const MENU = [
  { id: 1,  kat: "bakso", gambar: "assests/bakso-biasa", nama: "Bakso Biasa",  harga: 10000, desc: "Bakso sapi kenyal klasik, isi 20 butir." },
  { id: 2,  kat: "bakso", emoji: "💪", nama: "Bakso Urat",   harga: 13000, desc: "Bertekstur kasar dengan potongan urat sapi." },
  { id: 3,  kat: "bakso", emoji: "🥚", nama: "Bakso Telur",  harga: 13000, desc: "Bakso besar berisi telur puyuh utuh." },
  { id: 4,  kat: "bakso", emoji: "🥩", nama: "Bakso Tetelan",harga: 16000, desc: "Isian tetelan empuk, gurih dan juicy." },
  { id: 5,  kat: "bakso", emoji: "🌋", nama: "Bakso Lava",   harga: 15000, desc: "Isian sambal cabai pedas meleleh di dalam." },
  { id: 6,  kat: "mie",   emoji: "🍜", nama: "Mie Ayam",     harga: 8000, desc: "Mi kenyal, ayam cincang manis gurih." },
  { id: 7,  kat: "mie",   emoji: "🍝", nama: "Mie Yamin",    harga: 9000, desc: "Mi yamin manis, topping ayam dan pangsit." },
  { id: 8,  kat: "mie",   emoji: "🍗", nama: "Mie Ayam Ceker",           harga: 9000, desc: "Mie ayam dengan ceker empuk berbumbu." },
  { id: 9,  kat: "mie",   emoji: "🥟", nama: "Mie Ayam Pangsit Basah",   harga: 10000, desc: "Mie ayam dengan pangsit basah lembut." },
  { id: 10, kat: "mie",   emoji: "🍜", nama: "Mie Ayam Bakso Urat",      harga: 10000, desc: "Mie ayam komplit plus bakso urat." },
  { id: 11, kat: "mie",   emoji: "🍜", nama: "Mie Ayam Bakso Telur",     harga: 15000, desc: "Mie ayam komplit plus bakso telur." },
  { id: 12, kat: "mie",   emoji: "🌋", nama: "Mie Ayam Bakso Lava",      harga: 17000, desc: "Mie ayam komplit plus bakso lava pedas." }
];

// foto: taruh gambar di folder img/ lalu isi nama file. Jika kosong/tidak ada, tampil emoji.
const TESTIMONI = [
  { nama: "Rina, Solo",       bintang: 5, foto: "img/testi1.jpg", teks: "Bakso lavanya pedasnya pas, kuahnya gurih. Anak-anak sampai minta tambah!" },
  { nama: "Dimas, Karanganyar",bintang: 5, foto: "img/testi2.jpg", teks: "Mie ayam bakso uratnya enak banget, praktis buat stok anak kos." },
  { nama: "Sari, Sukoharjo",  bintang: 4, foto: "img/testi3.jpg", teks: "Sambalnya home-made dan segar. Kemasan rapi dan bersih." }
];

/* =====================================================
   LOGIKA — tidak perlu diubah
   ===================================================== */
const rupiah = n => "Rp" + n.toLocaleString("id-ID");
let cart = {}; // { id: jumlah }

// --- Render menu ---
const grid = document.getElementById("menuGrid");
function renderMenu(filter = "semua") {
  grid.innerHTML = MENU.filter(m => filter === "semua" || m.kat === filter).map(m => `
    <article class="item">
      <div class="pic" aria-hidden="true">${m.emoji}</div>
      <div class="body">
        <h3>${m.nama}</h3><p>${m.desc}</p>
        <div class="row"><span class="price">${rupiah(m.harga)}</span>
        <button class="add" data-id="${m.id}">Tambah</button></div>
      </div>
    </article>`).join("");
}
grid.addEventListener("click", e => {
  const b = e.target.closest(".add");
  if (!b) return;
  const id = b.dataset.id;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  toast("Ditambahkan ke keranjang");
});
document.getElementById("tabs").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  document.querySelectorAll("#tabs button").forEach(x => x.classList.remove("on"));
  b.classList.add("on");
  renderMenu(b.dataset.f);
});

// --- Keranjang ---
const box = document.getElementById("cartBox");
const hitungTotal = () => Object.entries(cart).reduce((t, [id, q]) => t + MENU.find(m => m.id == id).harga * q, 0);

function renderCart() {
  const ids = Object.keys(cart);
  document.getElementById("navCount").textContent = Object.values(cart).reduce((a, b) => a + b, 0);
  if (!ids.length) { box.innerHTML = '<p class="empty">Keranjang masih kosong. Pilih menu di atas dulu.</p>'; return; }
  box.innerHTML = ids.map(id => {
    const m = MENU.find(x => x.id == id), q = cart[id];
    return `<div class="line">
      <div><b>${m.nama}</b><small>${rupiah(m.harga)} × ${q} = ${rupiah(m.harga * q)}</small></div>
      <div class="qty"><button data-a="min" data-id="${id}" aria-label="Kurangi">−</button><b>${q}</b>
      <button data-a="plus" data-id="${id}" aria-label="Tambah">+</button></div>
      <button class="rm" data-a="del" data-id="${id}" aria-label="Hapus">✕</button></div>`;
  }).join("") + `<div class="total"><span>Total</span><span>${rupiah(hitungTotal())}</span></div>`;
}
box.addEventListener("click", e => {
  const b = e.target.closest("button[data-a]");
  if (!b) return;
  const id = b.dataset.id;
  if (b.dataset.a === "plus") cart[id]++;
  if (b.dataset.a === "min" && --cart[id] <= 0) delete cart[id];
  if (b.dataset.a === "del") delete cart[id];
  renderCart();
});

// --- Checkout ke WhatsApp ---
document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!Object.keys(cart).length) { toast("Keranjang masih kosong"); return; }
  const v = id => document.getElementById(id).value.trim();
  let pesan = "*PESANAN BARU - MbunBarokah*\n\n";
  pesan += `Nama: ${v("nama")}\nNo. WA: ${v("hp")}\nAlamat: ${v("alamat")}\n\n*Rincian pesanan:*\n`;
  Object.entries(cart).forEach(([id, q], i) => {
    const m = MENU.find(x => x.id == id);
    pesan += `${i + 1}. ${m.nama} x${q} = ${rupiah(m.harga * q)}\n`;
  });
  pesan += `\n*Total: ${rupiah(hitungTotal())}*\n`;
  if (v("catatan")) pesan += `Catatan: ${v("catatan")}\n`;
  pesan += "\nTerima kasih!";
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, "_blank");
});

// --- Slider testimoni ---
const track = document.getElementById("track"), dots = document.getElementById("dots");
let cur = 0, timer;
track.innerHTML = TESTIMONI.map(t => `
  <div class="slide"><div class="review">
    <img class="photo" src="${t.foto}" alt="Foto ${t.nama}" onerror="this.outerHTML='<div class=&quot;photo&quot;>🍜</div>'">
    <div><div class="stars">${"★".repeat(t.bintang)}${"☆".repeat(5 - t.bintang)}</div>
    <q>${t.teks}</q><b>${t.nama}</b></div></div></div>`).join("");
dots.innerHTML = TESTIMONI.map((_, i) => `<button data-i="${i}" aria-label="Testimoni ${i + 1}"></button>`).join("");
function go(i) {
  cur = (i + TESTIMONI.length) % TESTIMONI.length;
  track.style.transform = `translateX(-${cur * 100}%)`;
  [...dots.children].forEach((d, k) => d.classList.toggle("on", k === cur));
  clearInterval(timer); timer = setInterval(() => go(cur + 1), 5000);
}
document.getElementById("prev").onclick = () => go(cur - 1);
document.getElementById("next").onclick = () => go(cur + 1);
dots.onclick = e => { if (e.target.dataset.i) go(+e.target.dataset.i); };

// --- Util ---
function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 1500);
}
document.getElementById("yr").textContent = new Date().getFullYear();

renderMenu(); renderCart(); go(0);
