"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_WA = void 0;
exports.buildBookingMessage = buildBookingMessage;
exports.buildConfirmationMessage = buildConfirmationMessage;
exports.buildCompletionMessage = buildCompletionMessage;
exports.buildCancellationMessage = buildCancellationMessage;
exports.getWaLink = getWaLink;
exports.getAdminWaLink = getAdminWaLink;
exports.ADMIN_WA = '6281295991378';
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}
function formatDate(iso) {
    return new Date(iso).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
function buildBookingMessage(booking) {
    var lines = [
        '📋 *BOOKING TUGAS BARU*',
        '━━━━━━━━━━━━━━━━━━━━',
        "\uD83D\uDD22 Nomor: ".concat(booking.id),
        "\uD83D\uDC64 Nama: ".concat(booking.nama),
        "\uD83D\uDCF1 WA: ".concat(booking.whatsapp),
        "\uD83D\uDCDA Tugas: ".concat(booking.jenistugas),
        "\uD83D\uDCDD Detail: ".concat(booking.detail),
        "\u23F0 Deadline: ".concat(formatDate(booking.deadline)),
        "\u26A1 Urgensi: ".concat(booking.urgensi),
        "\uD83D\uDCB0 Harga: ".concat(formatRupiah(booking.harga)),
        booking.catatan ? "\uD83D\uDCCC Catatan: ".concat(booking.catatan) : '📌 Catatan: -',
        '━━━━━━━━━━━━━━━━━━━━',
        '⏳ Status: MENUNGGU KONFIRMASI',
        "\uD83D\uDD50 Waktu: ".concat(formatDate(booking.createdAt)),
    ];
    return lines.join('\n');
}
function buildConfirmationMessage(booking) {
    var _a;
    var lines = [
        '✅ *BOOKING DIKONFIRMASI*',
        '━━━━━━━━━━━━━━━━━━━━',
        "\uD83D\uDD22 Nomor: ".concat(booking.id),
        "\uD83D\uDCDA Tugas: ".concat(booking.jenistugas),
        "\u23F0 Deadline: ".concat(formatDate(booking.deadline)),
        "\uD83D\uDCB0 Harga Final: ".concat(formatRupiah(booking.harga)),
        '━━━━━━━━━━━━━━━━━━━━',
        '✅ Status: DIKONFIRMASI ADMIN',
        "\uD83D\uDD50 Waktu Konfirmasi: ".concat(formatDate((_a = booking.waktuKonfirmasi) !== null && _a !== void 0 ? _a : new Date().toISOString())),
        '',
        'Tim kami akan segera mengerjakan tugas Anda. Terima kasih! 🙏',
    ];
    return lines.join('\n');
}
function buildCompletionMessage(booking) {
    var lines = [
        '🎉 *TUGAS SELESAI DIKERJAKAN!*',
        '━━━━━━━━━━━━━━━━━━━━',
        "\uD83D\uDD22 Nomor: ".concat(booking.id),
        "\uD83D\uDC64 Nama: ".concat(booking.nama),
        "\uD83D\uDCDA Tugas: ".concat(booking.jenistugas),
        "\uD83D\uDCB0 Harga: ".concat(formatRupiah(booking.harga)),
        '━━━━━━━━━━━━━━━━━━━━',
        '✅ Status: SELESAI',
        "\uD83D\uDD50 Selesai: ".concat(formatDate(new Date().toISOString())),
        '',
        'Tugas Anda telah selesai dikerjakan! Silakan cek dan konfirmasi hasilnya.',
        'Jika ada revisi, hubungi kami segera. Terima kasih sudah mempercayakan tugas Anda kepada kami! 🙏',
    ];
    return lines.join('\n');
}
function buildCancellationMessage(booking) {
    var lines = [
        '❌ *BOOKING DITOLAK*',
        '━━━━━━━━━━━━━━━━━━━━',
        "\uD83D\uDD22 Nomor: ".concat(booking.id),
        "\uD83D\uDCDA Tugas: ".concat(booking.jenistugas),
        booking.alasanBatal ? "\uD83D\uDCCC Alasan: ".concat(booking.alasanBatal) : '',
        '━━━━━━━━━━━━━━━━━━━━',
        'Silakan hubungi admin untuk informasi lebih lanjut.',
    ]
        .filter(function (l) { return l !== ''; })
        .join('\n');
    return lines;
}
function getWaLink(phone, message) {
    var clean = phone.replace(/\D/g, '');
    var normalized = clean.startsWith('0') ? '62' + clean.slice(1) : clean;
    return "https://wa.me/".concat(normalized, "?text=").concat(encodeURIComponent(message));
}
function getAdminWaLink(message) {
    return getWaLink(exports.ADMIN_WA, message);
}
