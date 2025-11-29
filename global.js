/* global.js – FULLY WORKING VERSION (Nov 2025) */

const currencies = {
  EUR: { rate: 1, symbol: "€" },
  USD: { rate: 1.08, symbol: "$" },
  GBP: { rate: 0.85, symbol: "£" },
  JPY: { rate: 163, symbol: "¥" },
  CNY: { rate: 7.8, symbol: "¥" },
  AUD: { rate: 1.65, symbol: "A$" },
  CAD: { rate: 1.47, symbol: "C$" },
  CHF: { rate: 0.95, symbol: "Fr" }
};

const translations = {
  en: { shop: "Shop", repairs: "Repairs", contact: "Contact", cart: "Cart", checkout: "Checkout", empty: "Cart is empty", total: "Total", welcome: "Welcome" },
  el: { shop: "Κατάστημα", repairs: "Επισκευές", contact: "Επικοινωνία", cart: "Καλάθι", checkout: "Αγορά", empty: "Το καλάθι είναι άδειο", total: "Σύνολο", welcome: "Καλωσήρθατε" },
  ar: { shop: "المتجر", repairs: "الإصلاحات", contact: "اتصل بنا", cart: "السلة", checkout: "الدفع", empty: "السلة فارغة", total: "المجموع", welcome: "مرحباً" },
  pl: { shop: "Sklep", repairs: "Naprawy", contact: "Kontakt", cart: "Koszyk", checkout: "Zapłać", empty: "Koszyk pusty", total: "Razem", welcome: "Witamy" },
  fr: { shop: "Boutique", repairs: "Réparations", contact: "Contact", cart: "Panier", checkout: "Payer", empty: "Panier vide", total: "Total", welcome: "Bienvenue" },
  de: { shop: "Shop", repairs: "Reparaturen", contact: "Kontakt", cart: "Warenkorb", checkout: "Kaufen", empty: "Warenkorb leer", total: "Gesamt", welcome: "Willkommen" },
  ru: { shop: "Магазин", repairs: "Ремонт", contact: "Контакты", cart: "Корзина", checkout: "Оплатить", empty: "Корзина пуста", total: "Итого", welcome: "Добро пожаловать" },
  tr: { shop: "Mağaza", repairs: "Tamir", contact: "İletişim", cart: "Sepet", checkout: "Satın Al", empty: "Sepet boş", total: "Toplam", welcome: "Hoş geldiniz" }
};

let currentCurrency = localStorage.getItem("currency") || "EUR";
let currentLang = localStorage.getItem("lang") || "en";
let cart = JSON.parse(localStorage.getItem("alphaCart") || "[]");

// Inject cart HTML
document.body.insertAdjacentHTML("beforeend", `
  <div id="cart" class="cart-hidden">
    <div class="cart-header">
      <h3>${translations[currentLang].cart} (<span id="cart-count">0</span>)</h3>
      <button onclick="toggleCart()">✕</button>
    </div>
    <div id="cart-items"></div>
    <div class="cart-footer">
      <div class="cart-total"><strong>${translations[currentLang].total}:</strong> <span id="cart-total">€0</span></div>
      <button id="cart-checkout" onclick="checkout()">${translations[currentLang].checkout}</button>
    </div>
  </div>
  <div id="cart-overlay" onclick="toggleCart()"></div>
`);

document.addEventListener("DOMContentLoaded", () => {
  applyCurrency();
  applyLanguage();
  updateCartUI();
  applyTheme();

  // Auto-open cart after login
  if (location.search.includes("openCart=true")) {
    setTimeout(toggleCart, 600);
  }
});

// Theme
window.toggleTheme = () => {
  const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
};

function applyTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
}

// Currency
window.changeCurrency = (cur) => {
  currentCurrency = cur;
  localStorage.setItem("currency", cur);
  applyCurrency();
  updateCartUI();
};

function applyCurrency() {
  document.querySelectorAll(".price").forEach(el => {
    const eur = parseFloat(el.dataset.price);
    const rate = currencies[currentCurrency].rate;
    const symbol = currencies[currentCurrency].symbol;
    el.textContent = symbol + (eur * rate).toFixed(0);
  });
  document.getElementById("currency-selector")?.selectedIndex && (
    document.getElementById("currency-selector").value = currentCurrency
  );
}

// Language
window.toggleLangMenu = () => document.getElementById("lang-menu").classList.toggle("show");
window.changeLang = (lang, code, name) => {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.getElementById("current-code").textContent = code;
  document.getElementById("current-name").textContent = name;
  applyLanguage();
  toggleLangMenu();
};

function applyLanguage() {
  const t = translations[currentLang];
  document.querySelectorAll("[data-t]").forEach(el => {
    const key = el.dataset.t;
    if (t[key]) el.textContent = t[key];
  });
}

// Profile Icon
window.goToProfile = () => {
  location.href = localStorage.getItem("alphaUser") ? "profile.html" : "login.html";
};

// Cart Functions
window.toggleCart = () => {
  document.getElementById("cart").classList.toggle("cart-hidden");
  document.getElementById("cart-overlay").classList.toggle("cart-hidden");
};

window.addToCart = (id, price, name, img) => {
  cart.push({ id, price, name, img });
  saveCart();
  updateCartUI();
  toggleCart();
};

window.removeFromCart = (i) => {
  cart.splice(i, 1);
  saveCart();
  updateCartUI();
};

function saveCart() {
  localStorage.setItem("alphaCart", JSON.stringify(cart));
}

function updateCartUI() {
  const itemsDiv = document.getElementById("cart-items");
  const countEl = document.querySelectorAll(".cart-count");
  const totalEl = document.getElementById("cart-total");

  countEl.forEach(el => el.textContent = cart.length);
  if (cart.length === 0) {
    itemsDiv.innerHTML = `<p style="text-align:center;color:var(--muted);padding:40px 20px">${translations[currentLang].empty}</p>`;
    totalEl.textContent = "€0";
    return;
  }

  let html = "";
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    const formatted = (item.price * currencies[currentCurrency].rate).toFixed(0);
    html += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${currencies[currentCurrency].symbol}${formatted}</div>
        </div>
        <button onclick="removeFromCart(${i})">✕</button>
      </div>`;
  });
  itemsDiv.innerHTML = html;
  totalEl.textContent = currencies[currentCurrency].symbol + (total * currencies[currentCurrency].rate).toFixed(0);
}

// Checkout – forces login
window.checkout = async () => {
  if (cart.length === 0) return alert("Cart is empty");

  const { auth } = await import("./db.js");
  const user = auth.currentUser;

  if (!user && !localStorage.getItem("alphaUser")) {
    location.href = "login.html";
    return;
  }

  const btn = document.getElementById("cart-checkout");
  btn.disabled = true;
  btn.textContent = "Processing...";

  try {
    const total = cart.reduce((a, b) => a + b.price, 0);
    await (await import("./db.js")).saveOrderToDB(user?.uid, total, cart);

    const sym = currencies[currentCurrency].symbol;
    const rate = currencies[currentCurrency].rate;
    let msg = `New Order\nUser: ${user?.email || "Guest"}\n\n`;
    cart.forEach(i => msg += `• ${i.name} - ${sym}${(i.price * rate).toFixed(0)}\n`);
    msg += `\n*Total: ${sym}${(total * rate).toFixed(0)}*`;

    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();

    open(`https://wa.me/35796123456?text=${encodeURIComponent(msg)}`, "_blank");
  } catch (e) {
    alert("Error: " + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Checkout";
  }
};