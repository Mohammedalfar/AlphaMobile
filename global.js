/* global.js - Updated for Auth, Profile Icon, & OTP Flow */

// [existing currencies and translations objects - keep as is]
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
  // [existing translations - keep as is]
  en: { /* ... */ },
  el: { /* ... */ }
  // ... other langs
};

let currentCurrency = localStorage.getItem('currency') || 'EUR';
let currentLang = localStorage.getItem('lang') || 'en';

document.addEventListener("DOMContentLoaded", () => {
  // [existing cart HTML injection and theme setup - keep as is]
  const cartHTML = ` [existing cart HTML] `;
  document.body.insertAdjacentHTML('beforeend', cartHTML);
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Auto-open cart if from login
  const params = new URLSearchParams(window.location.search);
  if (params.get('openCart') === 'true') {
    setTimeout(() => toggleCart(), 500);  // Delay for load
  }

  // [existing language/currency apply - keep as is]
});

// [existing language & currency functions - keep as is]
window.toggleLangMenu = function() { /* ... */ }
window.changeLang = function(lang, code, name) { /* ... */ }
window.applyLanguage = function(lang) { /* ... */ }
window.changeCurrency = function(currency) { /* ... */ }
window.applyCurrency = function(currency) { /* ... */ }
window.toggleTheme = function() { /* ... */ }

// [existing cart logic - keep as is]
let cart = JSON.parse(localStorage.getItem('alphaCart')) || [];
window.toggleCart = function() { /* ... */ }
window.addToCart = function(id, price, name, img, desc) { /* ... */ }
window.removeFromCart = function(index) { /* ... */ }
function saveCart() { /* ... */ }
function updateNavCounts() { /* ... */ }
function updateCartUI() { /* ... */ }

// Profile navigation (new)
window.goToProfile = function() {
  const user = localStorage.getItem('alphaUser');
  if (user) {
    window.location.href = 'profile.html';
  } else {
    window.location.href = 'login.html';
  }
};

// UPDATED CHECKOUT: Requires login + OTP flow
window.checkout = async function() {
  if(cart.length === 0) return alert("Empty Cart");

  // Dynamic import
  const module = await import('./db.js');
  const { auth } = module;

  let user = auth.currentUser;
  
  if(!user) {
    window.location.href = 'login.html';  // Redirects to enhanced login with OTP
    return;
  }
  
  const btn = document.getElementById('cart-checkout');
  btn.innerText = "Processing...";
  btn.disabled = true;

  try {
    let total = 0;
    cart.forEach(item => total += item.price);
    
    await module.saveOrderToDB(user.uid, total, cart);
    
    const curr = currencies[currentCurrency];
    let msg = `New Order (Verified User)\nUser: ${user.email}\n\n`;
    cart.forEach(item => { 
      msg += `- ${item.name} (${curr.symbol}${(item.price * curr.rate).toFixed(0)})\n`;
    });
    msg += `\n*Total: ${curr.symbol}${(total * curr.rate).toFixed(0)}*`;
    
    cart = [];
    saveCart();
    updateCartUI();
    
    window.open(`https://wa.me/35796123456?text=${encodeURIComponent(msg)}`, '_blank');
    
  } catch(e) {
    alert("Order Error: " + e.message);
  } finally {
    btn.innerText = "Checkout";
    btn.disabled = false;
  }
}