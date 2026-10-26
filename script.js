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

// Logika Slider Testimoni Sederhana
let currentSlide = 0;
function geserSlide(arah) {
    const track = document.getElementById('slidesTrack');
    const totalSlides = track.children.length;
    currentSlide = (currentSlide + arah + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}