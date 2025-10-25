// File: api/server.js

const os = require('os');

// Ini adalah fungsi handler yang akan dijalankan Vercel
// setiap kali ada permintaan ke file ini.
module.exports = (req, res) => {
  // Ambil data sistem
  const data = {
    platform: os.platform(),
    cpuCores: os.cpus().length,
    totalMemory: (os.totalmem() / 1024 / 1024).toFixed(2), // Ubah ke MB
    freeMemory: (os.freemem() / 1024 / 1024).toFixed(2)   // Ubah ke MB
  };

  // Kirim data ini sebagai respon JSON
  // status(200) artinya "OK"
  res.status(200).json(data);
};