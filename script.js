/* ======================================================
   LẤY PHẦN TỬ DOM
====================================================== */
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
const downloadJpgBtn = document.getElementById('downloadJpgBtn');
const downloadSvgBtn = document.getElementById('downloadSvgBtn');
const shareBtn = document.getElementById('shareBtn');
const themeToggle = document.getElementById('themeToggle');

/* ======================================================
   KHỞI TẠO & CHẠY NGAY KHI VÀO TRANG
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[id^="year"]').forEach(el => { el.textContent = new Date().getFullYear(); });
  if (!navigator.share) shareBtn.style.display = 'none';
  
  // TỰ ĐỘNG TẠO QR DEMO ĐỂ CỘT PHẢI KHÔNG BỊ TRỐNG
  generateQRBase();
});

/* ======================================================
   DARK MODE THEME
====================================================== */
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.textContent = '☀️';
}
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* ======================================================
   ĐA NGÔN NGỮ
====================================================== */
const translations = {
  vi: { title: "✨ Trình tạo QR Code", subtitle: "Nhanh chóng & Sắc nét", input: "Nhập link hoặc nội dung (VD: google.com)", generate: "⚡ Cập nhật QR", downloadPng: "⬇️ Tải PNG", downloadJpg: "🖼️ Tải JPG", downloadSvg: "📐 Tải SVG", shareQr: "📤 Chia sẻ", borderNone: "Không viền ngoài", cornerSquare: "Góc Vuông", cornerSoft: "Bo góc nhẹ", cornerStrong: "Bo góc nhiều", changeLogo: "📁 Chọn ảnh", removeLogo: "🗑️ Xóa", transparentBg: "Nền trong suốt", useGradient: "Bật Gradient", dotSquare: "Chấm Vuông", dotRound: "Chấm Tròn", dotRounded: "Bo góc mềm", dotClassy: "Sang trọng" },
  en: { title: "✨ QR Code Generator", subtitle: "Fast & Crisp", input: "Enter link or text (e.g. google.com)", generate: "⚡ Update QR", downloadPng: "⬇️ PNG", downloadJpg: "🖼️ JPG", downloadSvg: "📐 SVG", shareQr: "📤 Share", borderNone: "No border", cornerSquare: "Square", cornerSoft: "Rounded", cornerStrong: "Extra rounded", changeLogo: "📁 Upload", removeLogo: "🗑️ Remove", transparentBg: "Transparent", useGradient: "Gradient", dotSquare: "Square", dotRound: "Dots", dotRounded: "Rounded", dotClassy: "Classy" }
};
const langSelect = document.getElementById('languageSelect');
function applyLanguage(lang) {
  const dict = translations[lang] || translations['en'];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n; if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder; if (dict[key]) el.placeholder = dict[key];
  });
  localStorage.setItem('lang', lang);
}
langSelect.addEventListener('change', e => applyLanguage(e.target.value));
const defaultLang = localStorage.getItem('lang') || 'vi';
langSelect.value = defaultLang; applyLanguage(defaultLang);

/* ======================================================
   XỬ LÝ CHUYỂN TAB (TEMPLATE)
====================================================== */
let currentTab = 'text';
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.input-group').forEach(g => g.classList.remove('active'));
    const tab = e.target.dataset.tab;
    e.target.classList.add('active');
    document.getElementById(`group-${tab}`).classList.add('active');
    currentTab = tab;
    generateQRBase(); // Render lại ngay khi đổi tab
  });
});

function getQRFormattedText() {
  if (currentTab === 'text') return document.getElementById('textInput').value.trim();
  if (currentTab === 'wifi') {
    const ssid = document.getElementById('wifiSsid').value.trim();
    const pass = document.getElementById('wifiPass').value.trim();
    if (!ssid) return ''; return `WIFI:S:${ssid};T:WPA;P:${pass};;`;
  }
  if (currentTab === 'vcard') {
    const name = document.getElementById('vcardName').value.trim();
    const phone = document.getElementById('vcardPhone').value.trim();
    const email = document.getElementById('vcardEmail').value.trim();
    if (!name && !phone) return ''; return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
  }
  if (currentTab === 'email') {
    const to = document.getElementById('emailTo').value.trim();
    const sub = document.getElementById('emailSub').value.trim();
    const body = document.getElementById('emailBody').value.trim();
    if (!to) return ''; return `mailto:${to}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
  }
  if (currentTab === 'sms') {
    const phone = document.getElementById('smsPhone').value.trim();
    const msg = document.getElementById('smsMsg').value.trim();
    if (!phone) return ''; return `smsto:${phone}:${msg}`;
  }
  return '';
}

/* ======================================================
   CẤU HÌNH THƯ VIỆN & DEBOUNCE
====================================================== */
const qrCode = new QRCodeStyling({
  width: 800, height: 800, margin: 0,
  qrOptions: { errorCorrectionLevel: 'H' },
  backgroundOptions: { color: "transparent" }, 
  imageOptions: { crossOrigin: "anonymous", margin: 15, imageSize: 0.3 }
});
let currentQRImage = null; 

let typingTimer;
document.querySelectorAll('.qr-input').forEach(input => {
  input.addEventListener('input', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(generateQRBase, 400); 
  });
});
document.querySelectorAll('#qrColor1, #qrColor2').forEach(input => {
  input.addEventListener('input', () => {
    clearTimeout(typingTimer); typingTimer = setTimeout(generateQRBase, 300);
  });
});
document.querySelectorAll('#useGradient, #dotStyle').forEach(el => el.addEventListener('change', generateQRBase));

/* ======================================================
   HÀM TẠO QR VÀ VẼ LÊN CANVAS
====================================================== */
function generateQRBase() {
  const text = getQRFormattedText();
  if (!text) {
      previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      return; 
  }

  const color1 = document.getElementById('qrColor1').value;
  const color2 = document.getElementById('qrColor2').value;
  const useGradient = document.getElementById('useGradient').checked;
  const dotType = document.getElementById('dotStyle').value;

  let dotsOptions = { type: dotType, color: color1 };
  if (useGradient) {
    dotsOptions.gradient = {
      type: "linear", rotation: 0.785398, 
      colorStops: [{ offset: 0, color: color1 }, { offset: 1, color: color2 }]
    };
  }

  qrCode.update({
    data: text,
    dotsOptions: dotsOptions,
    image: logoInput.files[0] ? URL.createObjectURL(logoInput.files[0]) : null
  });

  qrCode.getRawData("png").then(blob => {
    const img = new Image();
    img.onload = () => { currentQRImage = img; updatePreviewCanvas(); };
    img.src = URL.createObjectURL(blob);
  });
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

function updatePreviewCanvas() {
  if (!currentQRImage) return;
  const scaleRatio = 800 / 220; 
  const border = parseInt(borderSizeSelect.value) * scaleRatio;
  const borderColor = borderColorInput.value;
  const radius = parseInt(radiusSelect.value) * scaleRatio;
  const bgColor = document.getElementById('bgColor').value;
  const isTransparent = document.getElementById('transparentBg').checked;

  const size = 800 + border * 2;
  previewCanvas.width = size; previewCanvas.height = size;
  previewCtx.clearRect(0, 0, size, size);
  previewCtx.save();
  
  drawRoundedRect(previewCtx, 0, 0, size, size, radius);
  previewCtx.clip();

  if (!isTransparent) {
    previewCtx.fillStyle = border > 0 ? borderColor : bgColor; previewCtx.fill();
    if (border > 0) { previewCtx.fillStyle = bgColor; previewCtx.fillRect(border, border, 800, 800); }
  } else {
    if (border > 0) { previewCtx.lineWidth = border * 2; previewCtx.strokeStyle = borderColor; previewCtx.stroke(); }
  }

  previewCtx.drawImage(currentQRImage, border, border, 800, 800);
  previewCtx.restore();
}

document.querySelectorAll('#borderSize, #borderColor, #radiusSelect, #bgColor, #transparentBg').forEach(el => {
  el.addEventListener('change', updatePreviewCanvas);
  if(el.type === 'color') el.addEventListener('input', updatePreviewCanvas);
});

/* ======================================================
   SỰ KIỆN NÚT BẤM & TẢI XUỐNG
====================================================== */
generateBtn.addEventListener('click', () => {
  const text = getQRFormattedText();
  if (!text) { alert('Vui lòng nhập nội dung!'); return; }
  generateQRBase();
});

changeLogoBtn.addEventListener('click', () => logoInput.click());
logoInput.addEventListener('change', () => {
  if (!logoInput.files[0]) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    logoPreview.src = e.target.result; logoPreview.style.display = 'block';
    generateQRBase(); 
  };
  reader.readAsDataURL(logoInput.files[0]);
});
removeLogoBtn.addEventListener('click', () => {
  logoInput.value = ''; logoPreview.src = ''; logoPreview.style.display = 'none';
  generateQRBase();
});

// TẢI PNG
downloadBtn.addEventListener('click', () => {
  if (!previewCanvas.width) return;
  const link = document.createElement('a');
  link.download = `qr-code-${Math.floor(Date.now() / 1000)}.png`;
  link.href = previewCanvas.toDataURL('image/png'); link.click();
});

// TẢI JPG (Xử lý lót nền trắng nếu đang ở chế độ trong suốt)
downloadJpgBtn.addEventListener('click', () => {
  if (!previewCanvas.width) return;
  
  // Tạo canvas phụ để đổ nền trắng
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = previewCanvas.width;
  tempCanvas.height = previewCanvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  // Đổ màu trắng nền cứng
  tempCtx.fillStyle = '#ffffff';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  
  // Vẽ đè ảnh canvas hiện tại lên
  tempCtx.drawImage(previewCanvas, 0, 0);

  const link = document.createElement('a');
  link.download = `qr-code-${Math.floor(Date.now() / 1000)}.jpg`;
  link.href = tempCanvas.toDataURL('image/jpeg', 1.0); // Chất lượng 100%
  link.click();
});

// TẢI SVG
downloadSvgBtn.addEventListener('click', () => {
  if (!currentQRImage) return;
  qrCode.download({ name: `qr-vector-${Math.floor(Date.now() / 1000)}`, extension: "svg" });
});

// CHIA SẺ
shareBtn.addEventListener('click', async () => {
  if (!previewCanvas.width || !navigator.share) return;
  previewCanvas.toBlob(async (blob) => {
    try {
      await navigator.share({ title: 'Mã QR của tôi', files: [new File([blob], 'qr-code.png', { type: 'image/png' })] });
    } catch (err) { console.log('Hủy chia sẻ', err); }
  });
});

/* ======================================================
   HIỆU ỨNG THỜI TIẾT (GIỮ NGUYÊN)
====================================================== */
(function () {
    const container = document.getElementById('petals-container');
    if (!container) return; const month = new Date().getMonth() + 1; if (month < 1 || month > 2) return;
    const isMobile = window.innerWidth <= 600; const CONFIG = { interval: isMobile ? 900 : 350, minDuration: isMobile ? 10 : 6, maxDuration: isMobile ? 16 : 9, initialCount: isMobile ? 4 : 10 };
    function createPetal() {
        const petal = document.createElement('div'); petal.className = 'petal';
        const size = Math.random() * 4 + 6; const duration = Math.random() * (CONFIG.maxDuration - CONFIG.minDuration) + CONFIG.minDuration;
        petal.style.left = Math.random() * 100 + 'vw'; petal.style.width = size + 'px'; petal.style.height = size * 1.3 + 'px'; petal.style.animationDuration = duration + 's'; petal.style.opacity = Math.random() * 0.3 + 0.35; petal.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(petal); setTimeout(() => petal.remove(), (duration + 2) * 1000);
    }
    setInterval(createPetal, CONFIG.interval); for (let i = 0; i < CONFIG.initialCount; i++) setTimeout(createPetal, i * 400);
})();
(function () {
  const snowContainer = document.getElementById('snow-container');
  if (!snowContainer) return; const month = new Date().getMonth() + 1; if (!(month === 12 || month === 1)) return;
  const isMobile = window.innerWidth <= 600; const CONFIG = { interval: isMobile ? 900 : 300, minDuration: isMobile ? 12 : 6, maxDuration: isMobile ? 18 : 10, minSize: isMobile ? 3 : 4, maxSize: isMobile ? 6 : 8, initialCount: isMobile ? 5 : 14 };
  function spawnSnow() {
    const snow = document.createElement('div'); snow.className = 'snowflake';
    const size = Math.random() * (CONFIG.maxSize - CONFIG.minSize) + CONFIG.minSize; const duration = Math.random() * (CONFIG.maxDuration - CONFIG.minDuration) + CONFIG.minDuration;
    snow.style.width = size + 'px'; snow.style.height = size + 'px'; snow.style.left = Math.random() * 100 + 'vw'; snow.style.animationDuration = duration + 's'; snow.style.opacity = Math.random() * 0.4 + 0.4;
    snowContainer.appendChild(snow); setTimeout(() => snow.remove(), (duration + 2) * 1000);
  }
  setInterval(spawnSnow, CONFIG.interval); for (let i = 0; i < CONFIG.initialCount; i++) setTimeout(spawnSnow, i * 350);
})();
