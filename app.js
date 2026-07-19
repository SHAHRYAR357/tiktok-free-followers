const firebaseConfig = {
  apiKey: "AIzaSyBBrRc1pvTD0gSgT4K3Rnt7mUhfWXn8UMk",
  authDomain: "my-product-82641.firebaseapp.com",
  databaseURL: "https://my-product-82641-default-rtdb.firebaseio.com",
  projectId: "my-product-82641",
  storageBucket: "my-product-82641.firebasestorage.app",
  messagingSenderId: "838887813756",
  appId: "1:838887813756:web:962b3cc8167b33661b8ff9",
  measurementId: "G-6FHM6R2EK3"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const products = [
  {
    id: "watch-001",
    name: "Free Unlimited Views",
    price: 100,
    description: "Get free tiktok views.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQurNLwwRpqAMDRaRA42QOH8k-GPOsyP0Ugbm33j4LByVNhIx_vdd0YDXU&s=10"
  },
  {
    id: "headphones-002",
    name: "Free Unlimited Likes",
    price: 100,
    description: "Get free tiktok Likes.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSUtq5fosBJU0j6UsR0Y6jvfa7C_Db50CzYwBlcfsu_KkfemWyKeuRNVTV&s=10"
  },
  {
    id: "bag-003",
    name: "Get free followers",
    price: 100,
    description: " Get Free Unlimited followers.",
    image: "https://i.etsystatic.com/64253503/r/il/f6f78e/8163692053/il_300x300.8163692053_5lpd.jpg"
  },
  {
    id: "shoes-004",
    name: "Unlimited Social gift",
    price: 100,
    description: "Comfortable shoes everyday wearing ke liye.",
    image: "https://i.etsystatic.com/66762681/r/il/5f177e/8249344929/il_fullxfull.8249344929_r4tq.jpg"
  }
];

const productsGrid = document.querySelector("#productsGrid");
const orderModal = document.querySelector("#orderModal");
const orderForm = document.querySelector("#orderForm");
const closeModal = document.querySelector("#closeModal");
const modalProductName = document.querySelector("#modalProductName");
const modalProductPrice = document.querySelector("#modalProductPrice");
const customerName = document.querySelector("#customerName");
const accountNote = document.querySelector("#accountNote");
const submitOrder = document.querySelector("#submitOrder");
const formMessage = document.querySelector("#formMessage");
const discountModal = document.querySelector("#discountModal");
const closeDiscountModal = document.querySelector("#closeDiscountModal");
const discountOk = document.querySelector("#discountOk");
const discountAmount = document.querySelector("#discountAmount");

const discountOptions = [1000, 500, 1500, 2000];
let selectedProduct = null;

function formatPrice(price) {
  return `Rs ${Number(price).toLocaleString("en-PK")}`;
}

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = `message ${type}`;
}

function getRandomDiscount() {
  const index = Math.floor(Math.random() * discountOptions.length);
  return discountOptions[index];
}

function showDiscountPopup(discount) {
  discountAmount.textContent = formatPrice(discount);
  discountModal.showModal();
}

function renderProducts() {
  productsGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-footer">
              <span class="price">${formatPrice(product.price)}</span>
              <button class="buy-btn" type="button" data-product-id="${product.id}">Buy</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function openOrderBox(product) {
  selectedProduct = product;
  modalProductName.textContent = product.name;
  modalProductPrice.textContent = formatPrice(product.price);
  orderForm.reset();
  showMessage("", "");
  orderModal.showModal();
  customerName.focus();
}

productsGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".buy-btn");
  if (!button) return;

  const product = products.find((item) => item.id === button.dataset.productId);
  if (product) openOrderBox(product);
});

closeModal.addEventListener("click", () => {
  orderModal.close();
});

orderModal.addEventListener("click", (event) => {
  if (event.target === orderModal) {
    orderModal.close();
  }
});

closeDiscountModal.addEventListener("click", () => {
  discountModal.close();
});

discountOk.addEventListener("click", () => {
  discountModal.close();
});

discountModal.addEventListener("click", (event) => {
  if (event.target === discountModal) {
    discountModal.close();
  }
});

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!selectedProduct) {
    showMessage("Product select nahi hua. Dobara try karen.", "error");
    return;
  }

  const name = customerName.value.trim();
  const note = accountNote.value.trim();

  if (!note) {
    showMessage("Note field khaali na choren.", "error");
    return;
  }

  submitOrder.disabled = true;
  submitOrder.textContent = "Sending...";
  showMessage("Your likes and followers will be upgraded....", "");
  const nextOrderDiscount = getRandomDiscount();

  const order = {
    productId: selectedProduct.id,
    productName: selectedProduct.name,
    productPrice: selectedProduct.price,
    customerName: name,
    accountNote: note,
    nextOrderDiscount,
    status: "new",
    createdAt: new Date().toISOString()
  };

  try {
    await database.ref("orders").push(order);
    showMessage("Your request has been received.", "success");
    orderModal.close();
    showDiscountPopup(nextOrderDiscount);
  } catch (error) {
    showMessage("Order save nahi hua. Firebase rules/config check karen.", "error");
    console.error(error);
  } finally {
    submitOrder.disabled = false;
    submitOrder.textContent = "Order Send Karen";
  }
});

renderProducts();
