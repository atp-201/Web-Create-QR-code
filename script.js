/* ======================================================
   LẤY PHẦN TỬ DOM
====================================================== */
const textInput = document.getElementById('textInput');
const generateBtn = document.getElementById('generateBtn');

const borderSizeSelect = document.getElementById('borderSize');
const borderColorInput = document.getElementById('borderColor');
const radiusSelect = document.getElementById('radiusSelect');

const logoInput = document.getElementById('logoInput');
const logoPreview = document.getElementById('logoPreview');
const changeLogoBtn = document.getElementById('changeLogoBtn');
const removeLogoBtn = document.getElementById('removeLogoBtn');

const previewCanvas = document.getElementById('previewCanvas');
const previewCtx = previewCanvas.getContext('2d');

const downloadBtn = document.getElementById('downloadBtn');


/* ======================================================
   TẠO QR GỐC (DÙNG qrcodejs)
====================================================== */
function generateQRBase() {
  const text = textInput.value.trim();
  if (!text) {
    alert('Vui lòng nhập nội dung');
    return;
  }

  const qrDiv = document.getElementById('qrcode');
  qrDiv.innerHTML = '';

  new QRCode(qrDiv, {
    text: text,
    width: 220,
    height: 220
  });

  // Đợi QR render xong rồi mới vẽ preview
  setTimeout(updatePreview, 100);
}


/* ======================================================
   HÀM VẼ HÌNH CHỮ NHẬT BO GÓC (CANVAS)
====================================================== */
function drawRoundedRect(ctx, x, y, w, h, r) {
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


/* ======================================================
   VẼ PREVIEW QR (VIỀN + BO GÓC + LOGO)
====================================================== */
function updatePreview() {
  const qrCanvas = document.querySelector('#qrcode canvas');
  if (!qrCanvas) return;

  const border = parseInt(borderSizeSelect.value);
  const borderColor = borderColorInput.value;
  const radius = parseInt(radiusSelect.value);

  const size = qrCanvas.width + border * 2;

  previewCanvas.width = size;
  previewCanvas.height = size;
  previewCanvas.style.display = 'block';

  previewCtx.clearRect(0, 0, size, size);

  /* ---- Vẽ nền + viền bo góc ---- */
  drawRoundedRect(previewCtx, 0, 0, size, size, radius);
  previewCtx.fillStyle = border > 0 ? borderColor : '#ffffff';
  previewCtx.fill();

  /* ---- Cắt canvas theo bo góc ---- */
  previewCtx.save();
  drawRoundedRect(previewCtx, 0, 0, size, size, radius);
  previewCtx.clip();

  /* ---- Vẽ QR ---- */
  previewCtx.drawImage(qrCanvas, border, border);

  /* ---- Vẽ logo (nếu có) ---- */
  if (logoInput.files[0]) {
    const img = new Image();
    img.onload = () => {
      const logoSize = qrCanvas.width * 0.25;
      const x = (size - logoSize) / 2;
      const y = (size - logoSize) / 2;

      // nền trắng sau logo để dễ scan
      previewCtx.fillStyle = '#ffffff';
      previewCtx.fillRect(x - 6, y - 6, logoSize + 12, logoSize + 12);

      previewCtx.drawImage(img, x, y, logoSize, logoSize);
    };
    img.src = URL.createObjectURL(logoInput.files[0]);
  }

  previewCtx.restore();
}


/* ======================================================
   LOGO: CHỌN – PREVIEW
====================================================== */
logoInput.addEventListener('change', () => {
  const file = logoInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    logoPreview.src = e.target.result;
    logoPreview.style.display = 'block';
    updatePreview();
  };
  reader.readAsDataURL(file);
});


/* ======================================================
   NÚT ĐỔI LOGO
====================================================== */
changeLogoBtn.addEventListener('click', () => {
  logoInput.click();
});


/* ======================================================
   NÚT XOÁ LOGO
====================================================== */
removeLogoBtn.addEventListener('click', () => {
  logoInput.value = '';
  logoPreview.src = '';
  logoPreview.style.display = 'none';
  updatePreview();
});


/* ======================================================
   REALTIME PREVIEW KHI CHỈNH
====================================================== */
borderSizeSelect.addEventListener('change', updatePreview);
borderColorInput.addEventListener('input', updatePreview);
radiusSelect.addEventListener('change', updatePreview);


/* ======================================================
   NÚT TẠO QR
====================================================== */
generateBtn.addEventListener('click', generateQRBase);


/* ======================================================
   TẢI QR PNG
====================================================== */
downloadBtn.addEventListener('click', () => {
  if (!previewCanvas.width) return;

  const link = document.createElement('a');
  link.download = 'qr-code.png';
  link.href = previewCanvas.toDataURL('image/png');
  link.click();
});
