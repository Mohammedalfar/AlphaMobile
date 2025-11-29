// PROFILE ICON
window.goToProfile = function() {
  if (localStorage.getItem('alphaUser')) {
    window.location.href = 'profile.html';
  } else {
    window.location.href = 'login.html';
  }
};

// AUTO OPEN CART AFTER LOGIN
document.addEventListener("DOMContentLoaded", () => {
  // your existing code ...

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('openCart') === 'true') {
    setTimeout(() => toggleCart(), 600);
  }
});

// UPDATED CHECKOUT (forces login)
window.checkout = async function() {
  if (cart.length === 0) return alert("Cart is empty");

  const module = await import('./db.js');
  const user = module.auth.currentUser;

  if (!user && !localStorage.getItem('alphaUser')) {
    window.location.href = 'login.html';
    return;
  }

  const btn = document.getElementById('cart-checkout');
  btn.disabled = true;
  btn.textContent = "Processing...";

  try {
    const total = cart.reduce((s,i) => s + i.price, 0);
    await module.saveOrderToDB(user?.uid || null, total, cart);

    const sym = currencies[currentCurrency].symbol;
    const rate = currencies[currentCurrency].rate || 1;
    let msg = `New Order\nUser: ${user?.email || "Guest"}\n\n`;
    cart.forEach(i => msg += `• ${i.name} - ${sym}${(i.price*rate).toFixed(0)}\n`);
    msg += `\n*Total: ${sym}${(total*rate).toFixed(0)}*`;

    cart = [];
    saveCart();
    updateCartUI();

    window.open(`https://wa.me/35796123456?text=${encodeURIComponent(msg)}`,'_blank');
  } catch(e) {
    alert("Error: " + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Checkout";
  }
};