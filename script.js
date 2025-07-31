// Enhanced JS for Aditya Medical & General Store Website

const products = [
  { name: "Paracetamol", price: 456.06 },
  { name: "Ibuprofen", price: 190.87 },
  { name: "Amoxicillin", price: 755.87 },
  { name: "Cetrizine", price: 110.26 },
  { name: "Dolo 650", price: 521.17 },
  { name: "Crocin Advance", price: 613.88 },
  { name: "Aspirin", price: 387.2 },
  { name: "Metformin", price: 1127.96 },
  { name: "Pantoprazole", price: 118.53 },
  { name: "Omeprazole", price: 487.26 },
  { name: "Calcium Tablets", price: 855.2 },
  { name: "Multivitamins", price: 217.56 },
  { name: "Vitamin D3", price: 629.69 },
  { name: "Folic Acid", price: 973.7 },
  { name: "Antacid Gel", price: 723.18 },
  { name: "ORS Sachet", price: 782.86 },
  { name: "Insulin", price: 734.85 },
  { name: "Thyronorm", price: 774.14 },
  { name: "Azithromycin", price: 967.97 },
  { name: "Losartan", price: 1000.73 },
  { name: "Amlodipine", price: 100.74 },
  { name: "Atorvastatin", price: 315.67 },
  { name: "Cough Syrup", price: 554.69 },
  { name: "Vicks Vaporub", price: 514.7 },
  { name: "Benzoyl Peroxide Gel", price: 217.61 },
  { name: "Clotrimazole Cream", price: 1023.31 },
  { name: "Moisturizer", price: 998.36 },
  { name: "Antiseptic Cream", price: 216.34 },
  { name: "Eye Drops", price: 187.43 },
  { name: "Nasal Spray", price: 700.93 },
  { name: "Hand Sanitizer", price: 755.04 },
  { name: "Face Mask", price: 483.61 },
  { name: "Digital Thermometer", price: 646.96 },
  { name: "Oximeter", price: 402.5 },
  { name: "BP Monitor", price: 471.86 },
  { name: "Glucose Meter", price: 646.7 },
  { name: "Bandages", price: 949.04 },
  { name: "Crepe Bandage", price: 1051.18 },
  { name: "Cotton Rolls", price: 732.72 },
  { name: "Surgical Gloves", price: 847.6 },
  { name: "Syringes", price: 854.27 },
  { name: "IV Set", price: 968.65 },
  { name: "Disinfectant Liquid", price: 1042.69 },
  { name: "Dettol Soap", price: 488.62 },
  { name: "Savlon Liquid", price: 260.58 },
  { name: "Toothpaste", price: 1047.07 },
  { name: "Toothbrush", price: 1070.59 },
  { name: "Shampoo", price: 619.26 },
  { name: "Hair Oil", price: 260.71 },
  { name: "Comb", price: 607.29 },
  { name: "Body Lotion", price: 433.9 },
  { name: "Talcum Powder", price: 665.49 },
  { name: "Bathing Soap", price: 1119.55 },
  { name: "Face Wash", price: 342.67 },
  { name: "Lip Balm", price: 1073.84 },
  { name: "Deodorant", price: 947.5 },
  { name: "Sanitary Pads", price: 1003.52 },
  { name: "Diapers", price: 961.71 },
  { name: "Baby Lotion", price: 676.38 },
  { name: "Baby Powder", price: 1049.63 },
  { name: "Baby Shampoo", price: 209.32 },
  { name: "Feeding Bottle", price: 282.38 },
  { name: "Hot Water Bag", price: 624.93 },
  { name: "Cold Pack", price: 585.69 },
  { name: "Pain Relief Spray", price: 875.89 },
  { name: "Muscle Relaxant", price: 307.59 },
  { name: "Digestive Enzyme", price: 263.93 },
  { name: "Laxative", price: 530.43 },
  { name: "Hemorrhoid Cream", price: 780.16 },
  { name: "Mouthwash", price: 638.97 },
  { name: "Tongue Cleaner", price: 1100.39 },
  { name: "Nail Cutter", price: 1011.97 },
  { name: "Scissors", price: 706.93 },
  { name: "Wound Dressing", price: 122.69 },
  { name: "Cotton Swabs", price: 1170.63 },
  { name: "Ear Drops", price: 401.33 },
  { name: "Energy Drink", price: 1090.1 },
  { name: "Protein Powder", price: 520.37 },
  { name: "Health Drink", price: 632.77 },
  { name: "Electrolyte Powder", price: 1029.45 },
  { name: "Glucose Powder", price: 113.42 },
  { name: "Herbal Tea", price: 256.98 },
  { name: "Green Tea", price: 262.11 },
  { name: "Face Mask N95", price: 417.45 },
  { name: "Surgical Mask", price: 696.59 },
  { name: "Gloves (Latex)", price: 1077.0 },
  { name: "Alcohol Wipes", price: 819.86 },
  { name: "Neem Soap", price: 497.52 },
  { name: "Aloe Vera Gel", price: 518.94 },
  { name: "Sunscreen", price: 113.46 },
  { name: "Handwash Liquid", price: 457.69 },
  { name: "Tissue Paper", price: 389.81 },
  { name: "Toilet Cleaner", price: 1126.95 },
  { name: "Floor Cleaner", price: 693.8 },
  { name: "Mosquito Repellent", price: 969.68 },
  { name: "Inhaler", price: 962.92 },
  { name: "Allergy Tablets", price: 722.97 },
  { name: "Sleeping Aid", price: 587.87 },
  { name: "Antibiotic Ointment", price: 918.71 },
  { name: "Sterile Gauze", price: 1051.81 },
  { name: "Zinc Tablets", price: 822.44 },
  { name: "Iron Capsules", price: 1136.86 },
  { name: "Throat Lozenges", price: 867.64 }
];

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const cartItemsList = document.getElementById("cartItems");
const totalPriceDisplay = document.getElementById("totalPrice");
const cartCount = document.getElementById("cartCount");
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");

const cart = [];

function displayProducts(productArray) {
  productList.innerHTML = "";
  productArray.forEach((product) => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>Price: ₹${product.price.toFixed(2)}</p>
      <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
    `;
    productList.appendChild(div);
  });
}

displayProducts(products);

// Search Functionality
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
  displayProducts(filtered);
});

// Sorting Functionality
sortSelect.addEventListener("change", () => {
  const sorted = [...products];
  if (sortSelect.value === "asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "desc") {
    sorted.sort((a, b) => b.price - a.price);
  }
  displayProducts(sorted);
});

function addToCart(name, price) {
  cart.push({ name, price });
  updateCartUI();
}

function updateCartUI() {
  cartItemsList.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₹${item.price.toFixed(2)}`;
    cartItemsList.appendChild(li);
    total += item.price;
  });

  totalPriceDisplay.textContent = `Total: ₹${total.toFixed(2)}`;
  cartCount.textContent = cart.length;
}

cartToggle.addEventListener("click", () => {
  cartPanel.classList.toggle("hidden");
});

// Contact Form Handling
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Thank you! We'll get in touch with you soon.");
  this.reset();
});

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Thank you for your purchase!");
  cart.length = 0;
  updateCartUI();
  cartPanel.classList.add("hidden");
}
