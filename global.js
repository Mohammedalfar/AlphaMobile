/* global.js */

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

// ... (Translations object stays the same as before, keeping it short here to save space) ...
const translations = { en: { nav: ["Home", "Shop", "Repairs", "Contact"], cart: { title: "Your Basket", empty: "Cart is empty", total: "Total", checkout: "Checkout via WhatsApp" }, shop: { title: "Shop", filter: ["All", "Phones", "Audio", "Cables"], btn: "Add to Cart" }, repair: { title: "Service Menu" }, contact: { title: "Visit Us", formTitle: "Send a Message", btn: "Send", ph: ["Your Name", "Phone Number", "How can we help?"] } } };
// (Add other languages back here if needed, or use previous version's dictionary)

let currentCurrency = localStorage.getItem('currency') || 'EUR';
let currentLang = localStorage.getItem('lang') || 'en';
let cart = JSON.parse(localStorage.getItem('alphaCart')) || [];

document.addEventListener("DOMContentLoaded", () => {
  // Inject Cart HTML
  const cartHTML = `
    <div class="cart-sidebar" id="cartSidebar">
      <div class="cart-header">
        <h2 style="margin:0">Basket</h2>
        <button class="cart-close" onclick="toggleCart()">×</button>
      </div>
      <div class="cart-items" id="cartItems"></div>
      <div class="cart-footer">
        <div class="cart-total"><span>Total</span><span id="cartTotal">€0</span></div>
        <button class="btn-checkout" onclick="checkout()">Checkout via WhatsApp</button>
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
      .control-select { padding: 8px 12px; border-radius: 20px; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-weight: 600; cursor: pointer; outline: none; margin: 0; height: 36px; font-family: 'Inter', sans-serif; }
      @media(max-width: 500px) { .cart-sidebar { width: 100%; right: -100%; } .cart-sidebar.open { right: 0; } }
    </style>
  `;
  document.body.insertAdjacentHTML('beforeend', cartHTML);
  
  // Apply Settings
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const currSelector = document.getElementById('currency-selector');
  if(currSelector) currSelector.value = currentCurrency;
  
  updateCartUI(); // Instant update
  updateNavCounts();
});

// --- FUNCTIONS ---
window.toggleCart = function() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('active');
}

window.addToCart = function(id, price, name, img, desc) {
  // If desc exists, append it
  const displayName = desc ? `${name} (${desc})` : name;
  cart.push({ id, name: displayName, price, img });
  saveCart();
  updateCartUI(); // Force UI update
  toggleCart();   // Open cart
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
    if(container) container.innerHTML = '<p style="color:var(--muted); text-align:center; margin-top:20px;">Cart is empty</p>';
  } else {
    if(container) container.innerHTML = cart.map((item, index) => {
      total += item.price;
      const displayPrice = (item.price * curr.rate).toFixed(0);
      return `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}">
          <div style="flex:1">
            <div style="font-weight:600;font-size:14px">${item.name}</div>
            <div style="color:#93C572;font-weight:700">${curr.symbol}${displayPrice}</div>
          </div>
          <button onclick="removeFromCart(${index})" style="background:none;border:none;color:red;cursor:pointer;">✕</button>
        </div>`;
    }).join('');
  }
  if(totalEl) totalEl.innerText = `${curr.symbol}${(total * curr.rate).toFixed(0)}`;
}

window.changeCurrency = function(currency) {
  currentCurrency = currency;
  localStorage.setItem('currency', currency);
  location.reload(); // Simple reload to apply currency everywhere
}

window.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

window.checkout = function() {
  if(cart.length === 0) return alert("Empty Cart");
  const user = JSON.parse(localStorage.getItem('alphaUser'));
  if(!user) { window.location.href = 'login.html'; return; }
  
  const curr = currencies[currentCurrency];
  let msg = `New Order from *${user.name}*\nPhone: ${user.phone}\nAddress: ${user.address}\n\n`;
  let total = 0;
  cart.forEach(item => { 
    total += item.price;
    msg += `- ${item.name} (${curr.symbol}${(item.price * curr.rate).toFixed(0)})\n`;
  });
  msg += `\n*Total: ${curr.symbol}${(total * curr.rate).toFixed(0)}*`;
  window.open(`https://wa.me/35796123456?text=${encodeURIComponent(msg)}`, '_blank');
}