let qr;

const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');

generateBtn.addEventListener('click', generateQR);
downloadBtn.addEventListener('click', downloadQR);

function generateQR() {
  const text = document.getElementById('text').value.trim();
  const qrDiv = document.getElementById('qrcode');

  qrDiv.innerHTML = '';
  downloadBtn.style.display = 'none';

  if (!text) {
    alert('Vui lòng nhập nội dung!');
    return;
  }

  qr = new QRCode(qrDiv, {
    text: text,
    width: 200,
    height: 200
  });

  setTimeout(() => {
    downloadBtn.style.display = 'block';
  }, 300);
}

function downloadQR() {
  const qrDiv = document.getElementById('qrcode');
  const canvasQR = qrDiv.querySelector('canvas');

  if (!canvasQR) {
    alert('Không tìm thấy QR để tải');
    return;
  }

  const borderSize = 16;        // độ dày viền
  const borderColor = '#2563eb'; // màu viền
  const bgColor = '#ffffff';    // nền

  const size = canvasQR.width + borderSize * 2;

  // Canvas mới để xuất ảnh
  const canvasOut = document.createElement('canvas');
  canvasOut.width = size;
  canvasOut.height = size;
  const ctx = canvasOut.getContext('2d');

  // Vẽ nền
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Vẽ viền bo góc
  const radius = 20;
  ctx.fillStyle = borderColor;
  roundRect(ctx, 0, 0, size, size, radius);
  ctx.fill();

  // Vẽ QR vào giữa
  ctx.drawImage(canvasQR, borderSize, borderSize);

  // Tải ảnh
  const a = document.createElement('a');
  a.href = canvasOut.toDataURL('image/png');
  a.download = 'qrcode.png';
  a.click();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
