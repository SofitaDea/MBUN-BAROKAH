// Nomor WhatsApp Tujuan Pemesanan
const WA_NUMBER = "6287836345222";

// Keranjang Belanja
let keranjang = [];

// Fungsi Tambah Item ke Keranjang
function tambahItem(id, nama, harga) {
    const itemAda = keranjang.find(item => item.id === id);
    if (itemAda) {
        itemAda.qty += 1;
    } else {
        keranjang.push({ id, nama, harga, qty: 1 });
    }
    updateKeranjang();
}

// Fungsi Ubah Jumlah Item di Keranjang
function ubahQty(id, jumlah) {
    const itemAda = keranjang.find(item => item.id === id);
    if (itemAda) {
        itemAda.qty += jumlah;
        if (itemAda.qty <= 0) {
            keranjang = keranjang.filter(item => item.id !== id);
        }
    }
    updateKeranjang();
}

// Fungsi Update Tampilan Keranjang
function updateKeranjang() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');

    if (keranjang.length === 0) {
        container.innerHTML = '<div class="empty">Keranjang masih kosong. Yuk tambah menu pilihanmu!</div>';
        totalEl.innerText = 'Rp0';
        countEl.innerText = '0';
        return;
    }

    container.innerHTML = '';
    let totalHarga = 0;
    let totalQty = 0;

    keranjang.forEach(item => {
        let subtotal = item.harga * item.qty;
        totalHarga += subtotal;
        totalQty += item.qty;

        const line = document.createElement('div');
        line.classList.add('line');
        line.innerHTML = `
            <div>
                <strong>${item.nama}</strong>
                <small>Rp${item.harga.toLocaleString('id-ID')} x ${item.qty}</small>
            </div>
            <div class="qty">
                <button type="button" onclick="ubahQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button type="button" onclick="ubahQty(${item.id}, 1)">+</button>
            </div>
            <button class="rm" onclick="ubahQty(${item.id}, -${item.qty})">🗑️</button>
        `;
        container.appendChild(line);
    });

    totalEl.innerText = `Rp${totalHarga.toLocaleString('id-ID')}`;
    countEl.innerText = totalQty;
}

function kirimWhatsApp(event) {
    event.preventDefault();

    if (keranjang.length === 0) {
        alert("Keranjang masih kosong! Silakan pilih menu terlebih dahulu.");
        return;
    }

    const nama = document.getElementById('nama').value.trim();
    const telepon = document.getElementById('telepon').value.trim();
    const metode = document.getElementById('metode').value; // Mengambil nilai metode pesanan
    const alamat = document.getElementById('alamat').value.trim();

    let pesan = `Halo MbunBarokah, saya ingin memesan:\n\n`;
    let total = 0;

    keranjang.forEach(item => {
        let sub = item.harga * item.qty;
        total += sub;
        pesan += `- ${item.nama} (${item.qty}x) = Rp${sub.toLocaleString('id-ID')}\n`;
    });

    pesan += `\n*Total Keseluruhan: Rp${total.toLocaleString('id-ID')}*\n\n`;
    pesan += `*Data Pemesan:*\n`;
    pesan += `Nama: ${nama}\n`;
    pesan += `No. HP: ${telepon}\n`;
    pesan += `Metode: ${metode}\n`; // Menampilkan metode di pesan WA
    pesan += `Alamat/Catatan: ${alamat}\n\n`;
    pesan += `Mohon segera diproses ya, terima kasih!`;

    const urlWA = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`;
    window.open(urlWA, '_blank');
}

// Filter Kategori Menu (Semua, Bakso, Mie Ayam)
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('#tabs button');
    const items = document.querySelectorAll('.menu-grid .item');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('on'));
            btn.classList.add('on');

            const kategori = btn.getAttribute('data-f');

            items.forEach(item => {
                const itemKat = item.getAttribute('data-kat');
                if (kategori === 'semua' || itemKat === kategori) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// ==========================================
// LOGIKA SLIDER TESTIMONI
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById('sliderTrack');
    const slides = track ? track.children : [];
    const dotsBox = document.getElementById('dotsContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!track || slides.length === 0) return;

    let current = 0;

    // 1. Buat titik-titik indikator (dots) secara otomatis
    if (dotsBox) {
        dotsBox.innerHTML = '';
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement("button");
            dot.setAttribute("type", "button");
            dot.setAttribute("aria-label", "Testimoni " + (i + 1));
            dot.classList.add("dot");
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", () => goTo(i));
            dotsBox.appendChild(dot);
        }
    }

    // 2. Fungsi utama untuk berpindah slide
    function goTo(index) {
        // Efek berputar (looping) jika habis atau kurang dari 0
        current = (index + slides.length) % slides.length;
        
        // Geser track slider
        track.style.transform = `translateX(-${current * 100}%)`;
        
        // Perbarui status aktif pada titik-titik dots
        if (dotsBox) {
            [...dotsBox.children].forEach((d, i) => {
                d.classList.toggle("active", i === current);
            });
        }
    }

    // 3. Event listener untuk tombol navigasi
    if (nextBtn) {
        nextBtn.addEventListener("click", () => goTo(current + 1));
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => goTo(current - 1));
    }

    // Inisialisasi awal di slide pertama
    goTo(0);
});