/* global.js - Shared UI Logic & Auth Integration */

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

let currentCurrency = localStorage.getItem('currency') || 'EUR';
let currentLang = localStorage.getItem('lang') || 'en';
let cart = JSON.parse(localStorage.getItem('alphaCart')) || [];

document.addEventListener("DOMContentLoaded", () => {
  injectCartHTML();
  
  // Theme Setup
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Set Selector Values
  const currSelector = document.getElementById('currency-selector');
  if(currSelector) currSelector.value = currentCurrency;
  
  // Apply Defaults
  if(window.applyLanguage) window.applyLanguage(currentLang);
  window.applyCurrency(currentCurrency);
  updateCartUI();
  updateNavCounts();

  // --- AUTH NAVIGATION CHECK ---
  // Dynamically import DB to check login status without blocking UI
  import('./db.js').then(module => {
     module.subscribeToAuth((user) => {
       const nav = document.querySelector('nav');
       const controls = document.querySelector('.controls');
       
       const existingProfileLink = document.getElementById('nav-profile');
       const existingLoginLink = document.getElementById('nav-login');

       if (existingProfileLink) existingProfileLink.remove();
       if (existingLoginLink) existingLoginLink.remove();

       if(user) {
         // User is logged in -> Show "Profile"
         const link = document.createElement('a');
         link.href = "profile.html";
         link.id = "nav-profile";
         link.innerText = "Profile";
         link.style.color = "var(--pistachio)";
         nav.insertBefore(link, controls);
       } else {
         // User is logged out -> Show "Sign In"
         const link = document.createElement('a');
         link.href = "login.html";
         link.id = "nav-login";
         link.innerText = "Sign In";
         nav.insertBefore(link, controls);
       }
     });
  });
});

// --- UI HELPERS ---

function injectCartHTML() {
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
      .btn-checkout:disabled { opacity: 0.6; cursor: default; }
      .control-select { padding: 8px 12px; border-radius: 20px; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-weight: 600; cursor: pointer; outline: none; margin: 0; height: 36px; font-family: 'Inter', sans-serif; }
      @media(max-width: 500px) { .cart-sidebar { width: 100%; right: -100%; } .cart-sidebar.open { right: 0; } }
      html[dir="rtl"] .cart-sidebar { right: auto; left: -400px; border-left: none; border-right: 1px solid var(--border); }
      html[dir="rtl"] .cart-sidebar.open { left: 0; }
    </style>
  `;
  document.body.insertAdjacentHTML('beforeend', cartHTML);
}

// --- CORE FUNCTIONS ---

window.toggleLangMenu = function() { document.getElementById('lang-menu').classList.toggle('open'); }

window.changeCurrency = function(currency) { 
  currentCurrency = currency; 
  localStorage.setItem
