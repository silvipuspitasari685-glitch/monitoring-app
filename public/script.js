// Dapatkan elemen canvas
const ctx = document.getElementById('memoryChart').getContext('2d');

// Buat grafik baru
const memoryChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Free Memory (MB)',
      data: [],
      borderColor: '#00c896',
      backgroundColor: 'rgba(0,200,150,0.2)',
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { 
        beginAtZero: true
        // Kamu bisa menambahkan 'max: 1.0' jika kamu mengirim persentase
      }
    }
  }
});

// Fungsi untuk mengambil data dan memperbarui UI
async function updateData() {
  try {
    // 1. Ambil data dari server
    const res = await fetch('/api/server');
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();

    // 2. Tampilkan data ke elemen HTML
    // Perhatikan: kita panggil ID dari 'index.html' (misal 'cpus')
    // dan kita isi dengan data dari 'server.js' (misal data.cpuCores)
    document.getElementById('platform').textContent = data.platform;
    document.getElementById('cpus').textContent = data.cpuCores;
    document.getElementById('totalmem').textContent = data.totalMemory;
    document.getElementById('freemem').textContent = data.freeMemory;

    // 3. Update data di Chart (Grafik)
    const now = new Date().toLocaleTimeString();
    memoryChart.data.labels.push(now);
    
    // Server mengirim 'freeMemory' sebagai string (karena .toFixed(2))
    // Kita ubah kembali jadi angka agar grafik bisa membacanya
    memoryChart.data.datasets[0].data.push(parseFloat(data.freeMemory));

    // Hapus data terlama jika sudah terlalu banyak (misal lebih dari 20)
    if (memoryChart.data.labels.length > 20) {
      memoryChart.data.labels.shift();
      memoryChart.data.datasets[0].data.shift();
    }

    // Perbarui tampilan chart
    memoryChart.update();

  } catch (error) {
    // Jika ada error (misal server mati), tampilkan di console
    console.error("Gagal memperbarui data:", error);
  }
}

// ======================================================
// JALANKAN SEMUANYA
// ======================================================

// Panggil fungsi updateData setiap 2 detik
setInterval(updateData, 2000);

// Panggil fungsi updateData sekali saat halaman baru dimuat
// agar tidak perlu menunggu 2 detik untuk data pertama
updateData();