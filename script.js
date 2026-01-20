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
   ĐA NGÔN NGỮ GIAO DIỆN
====================================================== */
const translations = {
  vi: {
    title: "✨ Trình tạo QR Code",
    subtitle: "Tạo QR nhanh & đẹp",
    input: "🔗 Nhập link hoặc nội dung",
    generate: "⚡ Tạo QR ngay",
    download: "⬇️ Tải QR PNG",
    borderThickness: "Độ dày viền",
    borderNone: "Không viền",
    borderColor: "Màu viền",
    cornerRadius: "Bo góc QR",
    cornerSquare: "Vuông",
    cornerSoft: "Bo nhẹ",
    cornerStrong: "Bo nhiều",
    logoCenter: "Logo trung tâm",
    changeLogo: "Đổi",
    removeLogo: "Xóa"
  },
  en: {
    title: "✨ QR Code Generator",
    subtitle: "Fast & beautiful QR",
    input: "🔗 Enter text or URL",
    generate: "⚡ Generate QR",
    download: "⬇️ Download QR PNG",
    borderThickness: "Border thickness",
    borderNone: "No border",
    borderColor: "Border color",
    cornerRadius: "QR corner radius",
    cornerSquare: "Square",
    cornerSoft: "Rounded",
    cornerStrong: "Extra rounded",
    logoCenter: "Center logo",
    changeLogo: "Change",
    removeLogo: "Remove"

  },
  zh: {
    title: "✨ 二维码生成器",
    subtitle: "快速生成二维码",
    input: "🔗 输入内容或链接",
    generate: "⚡ 生成二维码",
    download: "⬇️ 下载 PNG",
    borderThickness: "边框粗细",
    borderNone: "无边框",
    borderColor: "边框颜色",
    cornerRadius: "二维码圆角",
    cornerSquare: "方形",
    cornerSoft: "轻微圆角",
    cornerStrong: "大圆角",
    logoCenter: "中心Logo",
    changeLogo: "更换",
    removeLogo: "删除"

  },
  ja: {
    title: "✨ QRコード生成",
    subtitle: "高速・高品質QR",
    input: "🔗 テキストまたはURL",
    generate: "⚡ QR作成",
    download: "⬇️ ダウンロード",
    borderThickness: "枠線の太さ",
    borderNone: "枠なし",
    borderColor: "枠線の色",
    cornerRadius: "QR角丸",
    cornerSquare: "四角",
    cornerSoft: "少し丸",
    cornerStrong: "大きく丸",
    logoCenter: "中央ロゴ",
    changeLogo: "変更",
    removeLogo: "削除"

  },
  ko: {
    title: "✨ QR 코드 생성기",
    subtitle: "빠르고 깔끔한 QR",
    input: "🔗 텍스트 또는 URL",
    generate: "⚡ QR 생성",
    download: "⬇️ 다운로드",
    borderThickness: "테두리 두께",
    borderNone: "테두리 없음",
    borderColor: "테두리 색상",
    cornerRadius: "QR 모서리",
    cornerSquare: "사각형",
    cornerSoft: "둥글게",
    cornerStrong: "많이 둥글게",
    logoCenter: "중앙 로고",
    changeLogo: "변경",
    removeLogo: "삭제"

  },
  ru: {
    title: "✨ Генератор QR-кодов",
    subtitle: "Быстро и красиво",
    input: "🔗 Введите текст или ссылку",
    generate: "⚡ Создать QR",
    download: "⬇️ Скачать PNG",
    borderThickness: "Толщина рамки",
    borderNone: "Без рамки",
    borderColor: "Цвет рамки",
    cornerRadius: "Скругление QR",
    cornerSquare: "Квадрат",
    cornerSoft: "Скругленный",
    cornerStrong: "Сильно скругленный",
    logoCenter: "Логотип по центру",
    changeLogo: "Изменить",
    removeLogo: "Удалить"
  },
  de: {
    title: "✨ QR-Code Generator",
    subtitle: "Schnell & modern",
    input: "🔗 Text oder Link eingeben",
    generate: "⚡ QR erstellen",
    download: "⬇️ PNG herunterladen",
    borderThickness: "Rahmenstärke",
    borderNone: "Kein Rahmen",
    borderColor: "Rahmenfarbe",
    cornerRadius: "QR-Ecken",
    cornerSquare: "Eckig",
    cornerSoft: "Abgerundet",
    cornerStrong: "Stark abgerundet",
    logoCenter: "Zentrales Logo",
    changeLogo: "Ändern",
    removeLogo: "Entfernen"
  },
  fr: {
    title: "✨ Générateur QR Code",
    subtitle: "Rapide et élégant",
    input: "🔗 Entrez un texte ou lien",
    generate: "⚡ Créer QR",
    download: "⬇️ Télécharger PNG",
    borderThickness: "Épaisseur de bordure",
    borderNone: "Sans bordure",
    borderColor: "Couleur de bordure",
    cornerRadius: "Coins du QR",
    cornerSquare: "Carré",
    cornerSoft: "Arrondi",
    cornerStrong: "Très arrondi",
    logoCenter: "Logo central",
    changeLogo: "Changer",
    removeLogo: "Supprimer"

  }
};
const langSelect = document.getElementById('languageSelect');

function applyLanguage(lang) {
  // đổi text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = translations[lang][key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = translations[lang][key];
  });

  // ===== ĐỔI FONT THEO NGÔN NGỮ =====
  document.body.className = ''; // reset
  document.body.classList.add(`lang-${lang}`);

  localStorage.setItem('lang', lang);
}


// Khi đổi ngôn ngữ
langSelect.addEventListener('change', e => {
  applyLanguage(e.target.value);
});

// Tự nhận ngôn ngữ đã lưu
function detectBrowserLanguage() {
  const lang = navigator.language.toLowerCase();

  if (lang.startsWith('vi')) return 'vi';
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('ru')) return 'ru';
  if (lang.startsWith('de')) return 'de';
  if (lang.startsWith('fr')) return 'fr';

  return 'en'; // fallback
}

// Ưu tiên ngôn ngữ đã lưu
const savedLang = localStorage.getItem('lang');
const defaultLang = savedLang || detectBrowserLanguage();

languageSelect.value = defaultLang;
applyLanguage(defaultLang);

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
