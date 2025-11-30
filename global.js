/* global.js */

const currencies = {
  EUR: { rate: 1, symbol: "€", name: "€ EUR" },
  USD: { rate: 1.08, symbol: "$", name: "$ USD" },
  GBP: { rate: 0.85, symbol: "£", name: "£ GBP" },
  JPY: { rate: 163, symbol: "¥", name: "¥ JPY" },
  CNY: { rate: 7.8, symbol: "¥", name: "¥ CNY" },
  AUD: { rate: 1.65, symbol: "A$", name: "$ AUD" },
  CAD: { rate: 1.47, symbol: "C$", name: "$ CAD" },
  CHF: { rate: 0.95, symbol: "Fr", name: "Fr CHF" }
};

const translations = {
  en: {
    nav: ["Home", "Shop", "Repairs", "Contact"],
    cart: { title: "Your Basket", empty: "Cart is empty", total: "Total", checkout: "Checkout via WhatsApp" },
    shop: { title: "Shop", filter: ["All", "Phones", "Audio", "Cables"], btn: "Add to Cart" },
    repair: { title: "Service Menu" },
    contact: { title: "Visit Us", formTitle: "Send a Message", btn: "Send", ph: ["Your Name", "Phone Number", "How can we help?"] }
  },
  el: {
    nav: ["Αρχική", "Κατάστημα", "Επισκευές", "Επικοινωνία"],
    cart: { title: "Καλάθι", empty: "Άδειο", total: "Σύνολο", checkout: "Αγορά μέσω WhatsApp" },
    shop: { title: "Κατάστημα", filter: ["Όλα", "Κινητά", "Ήχος", "Καλώδια"], btn: "Προσθήκη" },
    repair: { title: "Μενού Υπηρεσιών" },
    contact: { title: "Επισκεφθείτε μας", formTitle: "Στείλτε Μήνυμα", btn: "Αποστολή", ph: ["Όνομα", "Τηλέφωνο", "Μήνυμα..."] }
  },
  ar: {
    nav: ["الرئيسية", "المتجر", "تصليح", "اتصل بنا"],
    cart: { title: "سلة التسوق", empty: "السلة فارغة", total: "المجموع", checkout: "إتمام الطلب" },
    shop: { title: "المتجر", filter: ["الكل", "هواتف", "صوتيات", "كابلات"], btn: "أضف للسلة" },
    repair: { title: "قائمة الخدمات" },
    contact: { title: "زورونا", formTitle: "أرسل رسالة", btn: "إرسال", ph: ["الاسم", "رقم الهاتف", "كيف يمكننا مساعدتك؟"] }
  },
  pl: {
    nav: ["Start", "Sklep", "Naprawy", "Kontakt"],
    cart: { title: "Koszyk", empty: "Pusty", total: "Suma", checkout: "Zamów" },
    shop: { title: "Sklep", filter: ["Wszystkie", "Telefony", "Audio", "Kable"], btn: "Dodaj" },
    repair: { title: "Usługi" },
    contact: { title: "Kontakt", formTitle: "Wyślij wiadomość", btn: "Wyślij", ph: ["Imię", "Telefon", "Wiadomość..."] }
  },
  fr: {
    nav: ["Accueil", "Boutique", "Réparations", "Contact"],
    cart: { title: "Panier", empty: "Vide", total: "Total", checkout: "Commander" },
    shop: { title: "Boutique", filter: ["Tout", "Téléphones", "Audio", "Câbles"], btn: "Ajouter" },
    repair: { title: "Services" },
    contact: { title: "Contact", formTitle: "Message", btn: "Envoyer", ph: ["Nom", "Téléphone", "Message..."] }
  },
  de: {
    nav: ["Start", "Shop", "Reparatur", "Kontakt"],
    cart: { title: "Warenkorb", empty: "Leer", total: "Gesamt", checkout: "Bestellen" },
    shop: { title: "Shop", filter: ["Alle", "Handys", "Audio", "Kabel"], btn: "Hinzufügen" },
    repair: { title: "Service" },
    contact: { title: "Kontakt", formTitle: "Nachricht", btn: "Senden", ph: ["Name", "Telefon", "Nachricht..."] }
  },
  ru: {
    nav: ["Главная", "Магазин", "Ремонт", "Контакты"],
    cart: { title: "Корзина", empty: "Пусто", total: "Итого", checkout: "Заказать" },
    shop: { title: "Магазин", filter: ["Все", "Телефоны", "Аудио", "Кабели"], btn: "В корзину" },
    repair: { title: "Услуги" },
    contact: { title: "Контакты", formTitle: "Сообщение", btn: "Отправить", ph: ["Имя", "Телефон", "Сообщение..."] }
  },
  tr: {
    nav: ["Ana Sayfa", "Mağaza", "Tamir", "İletişim"],
    cart: { title: "Sepet", empty: "Boş", total: "Toplam", checkout: "Satın Al" },
    shop: { title: "Mağaza", filter: ["Tümü", "Telefonlar", "Ses", "Kablolar"], btn: "Ekle" },
    repair: { title: "Servis" },
    contact: { title: "İletişim", formTitle: "Mesaj", btn: "Gönder", ph: ["İsim", "Telefon", "Mesaj..."] }
  }
};

let currentCurrency = localStorage.getItem('currency') || 'EUR';
let currentLang = localStorage.getItem('lang') || 'en';

document.addEventListener("DOMContentLoaded", () => {
  const cartHTML = `
    <div class="cart-sidebar" id="cartSidebar">
      <div class="cart-header">
        <h2 style="margin:0" id="cart-title">Basket</h2>
        <button class="cart-close" onclick="toggleCart()">×</button>
      </div>
      <div class="cart-items" id="cartItems">
        <p style="color:var(--muted); text-align:center; margin-top:20px;">Empty</p>
      </div>
      <div class="cart-footer">
        <div class="cart-total"><span id="cart-total-lbl">Total</span><span id="cartTotal">€0</span></div>
        <button class="btn-checkout" onclick="checkout()" id="cart-checkout">Checkout</button>
      </div>
    </div>
    <div class="cart-overlay" id="cartOverlay" onclick="toggleCart()"></div>
    <style>
      .cart-sidebar { position: fixed; top: 0; right: -400px; width: 350px; height: 100vh; background: var(--card); border-left: 1px solid var(--border); z-index: 99999; padding: 30px; display: flex; flex-direction: column; transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: -10px 0 40px rgba(0,0,0,0.1); color: var(--text); }
      .cart-sidebar.open { right: 0; }
      .cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 15px; }
      .cart-close { background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text); }
      .cart-items { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
      .cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99998; display: none; backdrop-filter: blur(2px); }
      .cart-overlay.active { display: block; }
      .cart-item { display: flex; gap: 10px; align-items: center; background: var(--bg); padding: 10px; border-radius: 12px; border: 1px solid var(--border); }
      .cart-item img { width: 50px; height: 50px; object-fit: cover; border-radius: 8px; }
      .cart-total { margin-top: 20px; font-size: 20px; font-weight: 800; display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 15px; }
      .btn-checkout { width: 100%; padding: 16px; background: #93C572; color: white; border: none; border-radius: 16px; font-weight: 700; cursor: pointer; margin-top: 15px; transition: 0.2s; }
      
      @media(max-width: 500px) { .cart-sidebar { width: 100%; right: -100%; } .cart-sidebar.open { right: 0; } }
      html[dir="rtl"] .cart-sidebar { right: auto; left: -400px; border-left: none; border-right: 1px solid var(--border); }
      html[dir="rtl"] .cart-sidebar.open { left: 0; }
    </style>
  `;
  document.body.insertAdjacentHTML('beforeend', cartHTML);
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const savedCode = localStorage.getItem('langCode') || 'US';
  const savedName = localStorage.getItem('langName') || 'English';
  
  if(document.getElementById('current-code')) document.getElementById('current-code').innerText = savedCode;
  if(document.getElementById('current-name')) document.getElementById('current-name').innerText = savedName;
  
  if(document.getElementById('current-currency-display')) {
    document.getElementById('current-currency-display').innerText = currencies[currentCurrency].name;
  }

  window.applyLanguage(currentLang);
  window.applyCurrency(currentCurrency);
  updateCartUI();
  updateNavCounts();
});

window.toggleCurrencyMenu = function() {
  document.getElementById('currency-menu').classList.toggle('open');
}

window.selectCurrency = function(code) {
  changeCurrency(code);
  document.getElementById('current-currency-display').innerText = currencies[code].name;
  document.getElementById('currency-menu').classList.remove('open');
}

window.toggleProfile = function() {
  document.getElementById('profile-menu').classList.toggle('open');
  updateProfileMenu();
}

window.updateProfileMenu = function() {
  const user = JSON.parse(localStorage.getItem('alphaUser'));
  const menu = document.getElementById('profile-menu');
  if(user) {
    menu.innerHTML = `<div style="padding:10px;font-weight:600;color:var(--text);border-bottom:1px solid var(--border);margin-bottom:5px;">Hi, ${user.name.split(' ')[0]}</div><div class="profile-option" onclick="window.location.href='profile.html'">Settings</div><div class="profile-option" onclick="logoutUser()" style="color:#ef4444">Logout</div>`;
  } else {
    menu.innerHTML = `<div class="profile-option" onclick="window.location.href='login.html'">Login</div><div class="profile-option" onclick="window.location.href='register.html'">Register</div>`;
  }
}

window.logoutUser = function() {
  localStorage.removeItem('alphaUser');
  document.getElementById('profile-menu').classList.remove('open');
  location.reload();
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.profile-btn')) document.getElementById('profile-menu')?.classList.remove('open');
  if (!e.target.closest('.lang-dropdown')) document.getElementById('lang-menu')?.classList.remove('open');
  if (!e.target.closest('.currency-dropdown')) document.getElementById('currency-menu')?.classList.remove('open');
});

window.toggleLangMenu = function() {
  document.getElementById('lang-menu').classList.toggle('open');
}

window.changeLang = function(lang, code, name) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  localStorage.setItem('langCode', code);
  localStorage.setItem('langName', name);
  document.getElementById('current-code').innerText = code;
  document.getElementById('current-name').innerText = name;
  window.applyLanguage(lang);
  document.getElementById('lang-menu').classList.remove('open');
}

window.applyLanguage = function(lang) {
  const t = translations[lang] || translations['en'];
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  if(document.getElementById('nav-1')) document.getElementById('nav-1').innerText = t.nav[0];
  if(document.getElementById('nav-2')) document.getElementById('nav-2').innerText = t.nav[1];
  if(document.getElementById('nav-3')) document.getElementById('nav-3').innerText = t.nav[2];
  if(document.getElementById('nav-4')) document.getElementById('nav-4').innerText = t.nav[3];
  if(document.getElementById('cart-title')) document.getElementById('cart-title').innerText = t.cart.title;
  if(document.getElementById('cart-total-lbl')) document.getElementById('cart-total-lbl').innerText = t.cart.total;
  if(document.getElementById('cart-checkout')) document.getElementById('cart-checkout').innerText = t.cart.checkout;
  updateCartUI();
}

window.changeCurrency = function(currency) {
  currentCurrency = currency;
  localStorage.setItem('currency', currency);
  window.applyCurrency(currency); 
}

window.applyCurrency = function(currency) {
  const data = currencies[currency];
  document.querySelectorAll('.product-price, .price').forEach(el => {
    if(!el.dataset.original) {
      const match = el.innerText.match(/[\d,]+\.?\d*/); 
      if(match) el.dataset.original = parseFloat(match[0].replace(/,/g, ''));
    }
    const base = parseFloat(el.dataset.original);
    if(!isNaN(base)) {
      if(el.innerText.includes('-')) return; 
      el.innerText = `${data.symbol}${(base * data.rate).toFixed(0)}`;
    }
  });
  updateCartUI();
}

window.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

let cart = JSON.parse(localStorage.getItem('alphaCart')) || [];

window.toggleCart = function() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('active');
}

window.addToCart = function(id, price, name, img, desc) {
  const displayName = desc ? `${name} (${desc})` : name;
  cart.push({ id, name: displayName, price, img });
  saveCart();
  updateCartUI();
  toggleCart();
}

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('alphaCart', JSON.stringify(cart));
  updateNavCounts();
}

function updateNavCounts() {
  document.querySelectorAll('.cart-count').forEach(el => el.innerText = cart.length);
}

function updateCartUI() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const curr = currencies[currentCurrency];
  let total = 0;
  if (cart.length === 0) {
    if(container) container.innerHTML = `<p style="color:var(--muted); text-align:center; margin-top:20px;">Empty</p>`;
  } else {
    if(container) container.innerHTML = cart.map((item, index) => {
      total += item.price;
      const displayPrice = (item.price * curr.rate).toFixed(0);
      return `<div class="cart-item"><img src="${item.img}" alt="${item.name}"><div style="flex:1"><div style="font-weight:600;font-size:14px">${item.name}</div><div style="color:#93C572;font-weight:700">${curr.symbol}${displayPrice}</div></div><button onclick="removeFromCart(${index})" style="background:none;border:none;color:red;cursor:pointer;">✕</button></div>`;
    }).join('');
  }
  if(totalEl) totalEl.innerText = `${curr.symbol}${(total * curr.rate).toFixed(0)}`;
}

window.checkout = function() {
  if(cart.length === 0) return alert("Empty Cart");
  const user = JSON.parse(localStorage.getItem('alphaUser'));
  if(!user) { window.location.href = 'login.html'; return; }
  
  const curr = currencies[currentCurrency];
  let msg = `New Order from *${user.name}*\nPhone: ${user.phone}\nAddress: ${user.address}, ${user.city}\n\n`;
  let total = 0;
  cart.forEach(item => { 
    total += item.price;
    msg += `- ${item.name} (${curr.symbol}${(item.price * curr.rate).toFixed(0)})\n`;
  });
  msg += `\n*Total: ${curr.symbol}${(total * curr.rate).toFixed(0)}*`;
  window.open(`https://wa.me/35770009394?text=${encodeURIComponent(msg)}`, '_blank');
}