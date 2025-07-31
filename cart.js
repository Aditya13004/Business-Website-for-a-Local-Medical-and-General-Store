// Shared cart logic for all pages
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function updateCartUI() {
  const cartItemsList = document.getElementById("cartItems");
  const totalPriceDisplay = document.getElementById("totalPrice");
  const cartCount = document.getElementById("cartCount");
  
  if (!cartItemsList || !totalPriceDisplay || !cartCount) return;

  cartItemsList.innerHTML = "";
  let total = 0;
  
  cart.forEach((item, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <img src="${item.img || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&crop=center'}" alt="" style="width:32px;height:32px;border-radius:4px;border:1px solid #e3eaf3;background:#f4f8fb;object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&crop=center'">
        <div style="flex:1;">
          <span style="font-weight:500;display:block;">${item.name}</span>
          <span style="color:#1976d2;font-size:0.9rem;">₹${item.price.toFixed(2)}</span>
        </div>
      </div>
      <div class="cart-qty-controls">
        <button class="qty-btn" data-idx="${idx}" data-action="decrease">-</button>
        <span class="cart-qty">${item.quantity}</span>
        <button class="qty-btn" data-idx="${idx}" data-action="increase">+</button>
        <button class="remove-btn" data-idx="${idx}" title="Remove">🗑️</button>
      </div>
    `;
    cartItemsList.appendChild(li);
    total += item.price * item.quantity;
  });
  
  totalPriceDisplay.textContent = `Total: ₹${total.toFixed(2)}`;
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Event listeners for cart functionality
document.addEventListener("click", function(e) {
  // Add to Cart
  if (e.target.classList.contains("add-btn")) {
    const name = e.target.getAttribute("data-name");
    const price = parseFloat(e.target.getAttribute("data-price"));
    const img = e.target.getAttribute("data-img");
    
    const found = cart.find(item => item.name === name);
    if (found) {
      found.quantity += 1;
    } else {
      cart.push({ name, price, img, quantity: 1 });
    }
    updateCartUI();
    
    // Show success message
    const btn = e.target;
    const originalText = btn.textContent;
    btn.textContent = "✓ Added";
    btn.style.background = "#4caf50";
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = "#1976d2";
    }, 1000);
  }
  
  // Cart quantity controls
  if (e.target.classList.contains("qty-btn")) {
    const idx = +e.target.getAttribute("data-idx");
    const action = e.target.getAttribute("data-action");
    
    if (action === "increase") {
      cart[idx].quantity += 1;
    } else if (action === "decrease") {
      cart[idx].quantity -= 1;
      if (cart[idx].quantity <= 0) cart.splice(idx, 1);
    }
    updateCartUI();
  }
  
  // Remove item
  if (e.target.classList.contains("remove-btn")) {
    const idx = +e.target.getAttribute("data-idx");
    cart.splice(idx, 1);
    updateCartUI();
  }
  
  // Cart toggle
  if (e.target.id === "cartToggle") {
    const cartPanel = document.getElementById("cartPanel");
    if (cartPanel) cartPanel.classList.toggle("hidden");
  }
});

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  alert(`Thank you for your purchase!\n\nTotal Items: ${itemCount}\nTotal Amount: ₹${total.toFixed(2)}\n\nYour order has been placed successfully.`);
  
  cart = [];
  updateCartUI();
  const cartPanel = document.getElementById("cartPanel");
  if (cartPanel) cartPanel.classList.add("hidden");
}

// Expose checkout to global scope for inline HTML onclick
window.checkout = checkout;

// On page load, update cart UI
document.addEventListener("DOMContentLoaded", updateCartUI);