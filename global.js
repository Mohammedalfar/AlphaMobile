/* global.js - Handles Cart & Navigation */

// 1. Inject Cart HTML into the page automatically
document.addEventListener("DOMContentLoaded", () => {
  const cartHTML = `
    <div class="cart-sidebar" id="cartSidebar">
      <div class="cart-header">
        <h2 style="margin:0">Your Basket</h2>
        <button class="cart-close" onclick="toggleCart()">×</button>
      </div>
      <div class="cart-items" id="cartItems">
        <p style="color:var(--muted); text-align:center; margin-top:20px;">Cart is empty</p>
      </div>
      <div class="cart-footer">
        <div class="cart-total"><span>Total</span><span id="cartTotal">€0</span></div>
        <button class="btn-checkout" onclick="checkout()">Checkout via WhatsApp</button>
      </div>
    </div>
    <div class="cart-overlay" id="cartOverlay" onclick="toggleCart()"></div>
    <style>
      .cart-sidebar { position: fixed; top: 0; right: -400px; width: 350px; height: 100vh; background: var(--card); border-left: 1px solid var(--border); z-index: 9999; padding: 30px; display: flex; flex-direction: column; transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: -10px 0 40px rgba(0,0,0,0.1); color: var(--text); }
      .cart-sidebar.open { right: 0; }
      .cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 15px; }
      .cart-close { background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text); }
      .cart-items { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
      .cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9998; display: none; backdrop-filter: blur(2px); }
      .cart-overlay.active { display: block; }
      .cart-item { display: flex; gap: 10px; align-items: center; background: var(--bg); padding: 10px; border-radius: 12px; border: 1px solid var(--border); }
      .cart-item img { width: 50px; height: 50px; object-fit: cover; border-radius: 8px; }
      .cart-total { margin-top: 20px; font-size: 20px; font-weight: 800; display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 15px; }
      .btn-checkout { width: 100%; padding: 16px; background: #93C572; color: white; border: none; border-radius: 16px; font-weight: 700; cursor: pointer; margin-top: 15px; transition: 0.2s; }
      .btn-checkout:hover { transform: scale(1.02); }
    </style>
  `;
  document.body.insertAdjacentHTML('beforeend', cartHTML);
  updateCartUI();
  updateNavCounts();
});

// 2. Logic
let cart = JSON.parse(localStorage.getItem('alphaCart')) || [];

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('active');
}

function addToCart(id, price, name, img) {
  const item = { id, name, price, img };
  cart.push(item);
  saveCart();
  updateCartUI();
  toggleCart(); 
}

function removeFromCart(index) {
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
  
  let total = 0;
  if (cart.length === 0) {
    container.innerHTML = '<p style="color:var(--muted); text-align:center; margin-top:20px;">Cart is empty</p>';
  } else {
    container.innerHTML = cart.map((item, index) => {
      total += item.price;
      return `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}">
          <div style="flex:1">
            <div style="font-weight:600;font-size:14px">${item.name}</div>
            <div style="color:#93C572;font-weight:700">€${item.price}</div>
          </div>
          <button onclick="removeFromCart(${index})" style="background:none;border:none;color:red;cursor:pointer;">✕</button>
        </div>`;
    }).join('');
  }
  if(totalEl) totalEl.innerText = `€${total}`;
}

function checkout() {
  if(cart.length === 0) return alert("Cart is empty");
  
  let msg = "Hello, I would like to order:\n";
  let total = 0;
  cart.forEach(item => {
    msg += `- ${item.name} (€${item.price})\n`;
    total += item.price;
  });
  msg += `\nTotal: €${total}`;
  
  window.open(`https://wa.me/35796123456?text=${encodeURIComponent(msg)}`, '_blank');
}