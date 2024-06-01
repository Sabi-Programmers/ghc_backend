document.addEventListener("DOMContentLoaded", () => {
  // Get the current route
  const currentRoute = window.location.pathname;
  /**
   * Toast
   */
  const toastLive = document.getElementById("live-toast");
  const toast = {};
  if (toastLive) {
    const toastColor = document.getElementById("toast-color");
    const toastTitle = document.getElementById("toast-title");
    const toastBody = document.getElementById("toast-body");
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);

    const success = (message) => {
      toastColor.classList.remove("bg-danger");
      toastColor.classList.add("bg-success");
      toastTitle.innerText = "Success!";
      toastBody.innerText = message;
      toastBootstrap.show();
    };
    const failed = (message) => {
      toastColor.classList.remove("bg-success");
      toastColor.classList.add("bg-danger");
      toastTitle.innerText = "Failed!";
      toastBody.innerText = message;
      toastBootstrap.show();
    };
    toast.success = success;
    toast.failed = failed;
  }

  function formDataToJson(formData) {
    const json = {};
    for (const [key, value] of formData.entries()) {
      json[key] = value;
    }
    return json;
  }

  const loaderHtml = `<div id="api-handler-loader">
  <div class="spinner-border text-warning" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`;

  function handleLoader(action) {
    if (action === "show") {
      document.body.insertAdjacentHTML("beforeend", loaderHtml);
    } else if (action === "hide") {
      const loaderElement = document.getElementById("api-handler-loader");
      if (loaderElement) {
        loaderElement.remove();
      }
    }
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  document.querySelectorAll(".add-to-cart-form").forEach((formEl) => {
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      addToCart(e.target);
    });
  });

  function addToCart(form) {
    // Get form values
    const quantity = form.quantity.value;
    const name = form.name.value;
    const price = form.price.value;
    const type = form.type.value;
    const image = form.image.value;
    const id = form.itemId.value;
    const ref = null;

    // Set quantity to 1 if product type is 'cart'
    const adjustedQuantity = type === "DIGITAL" ? 1 : parseInt(quantity, 10);

    // Calculate subtotal
    const subtotal = parseFloat(price) * adjustedQuantity;

    // Create cart item object
    const cartItem = {
      id: id,
      name: name,
      price: price,
      type: type,
      image: image,
      quantity: adjustedQuantity,
      subtotal: subtotal,
      ref: null,
    };

    // Retrieve existing cart items from local storage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex((item) => item.id === cartItem.id);

    if (existingItemIndex > -1) {
      // If it exists, update the quantity and subtotal
      if (cart[existingItemIndex].type === "DIGITAL") {
        cart[existingItemIndex].quantity = 1;
        cart[existingItemIndex].subtotal = parseFloat(price);
      } else {
        cart[existingItemIndex].quantity += cartItem.quantity;
        cart[existingItemIndex].subtotal += subtotal;
      }
    } else {
      // If it doesn't exist, add it to the cart
      cart.push(cartItem);
    }

    // Save updated cart back to local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Optional: Notify the user
    toast.success("Item added to cart");
    updateCartCount();
  }

  const cartItemContainer = document.querySelector(".cart-item-wrapper");

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const unCart = document.querySelector(".un-cart");
    const unCartMob = document.querySelector(".un-cart-mob");

    if (cart.length > 0) {
      unCart.classList.remove("d-none");
      unCartMob.classList.remove("d-none");
    }

    const cartItemCount = document.querySelectorAll(".cart-item-count");
    cartItemCount.forEach((clc) => {
      clc.innerText = cart.length;
    });
  }

  const renderCartItems = () => {
    let total = 0;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartItemContainer) {
      cartItemContainer.innerHTML = cart
        .map((cartItem, i) => {
          total += cartItem.subtotal;
          return `
        <div class="cart-item border-bottom">
          <div class="flex-shrink-0">
            <img
              src="${cartItem.image}"
              alt="${cartItem.name}"
              class="w-100 h-100 rounded-4 border"
            />
          </div>
          <div class="d-flex justify-content-between w-100 ps-2 pe-1">
            <div class="d-flex flex-column">
              <span class="fw-medium text-capitalize">${cartItem.name}</span>
              <span class="fs-5 fw-bold mb-auto">$ ${cartItem.subtotal.toFixed(
                2
              )}</span>
              <span class="fw-light fst-italic">${
                cartItem.quantity
              } units</span>
            </div>
            <div class="d-flex flex-column align-items-center justify-content-between">
              <div class="btn btn-outline-danger remove-cart-item-btn">
                <i class="bx bxs-trash-alt"></i>
              </div>
              <div class="d-flex align-items-center gap-1">
                <span class="cart-item-quantity-plus text-success">
                  <i class="bx bx-plus-circle"></i>
                </span>
                <input
                  type="number"
                  class="form-control cart-item-quantity"
                  name="${cartItem.id}"
                  value="${cartItem.quantity}"
                  ${cartItem.type === "DIGITAL" ? "readonly" : ""}
                />
                <span class="cart-item-quantity-minus text-danger">
                  <i class="bx bx-minus-circle"></i>
                </span>
              </div>
            </div>
          </div>
        </div>`;
        })
        .join("");

      document.querySelector("#total").innerText = "$" + total.toFixed(2);

      const cartQtyPlus = document.querySelectorAll(".cart-item-quantity-plus");
      const cartQtyMinus = document.querySelectorAll(
        ".cart-item-quantity-minus"
      );
      const cartQty = document.querySelectorAll(".cart-item-quantity");
      const removeCartItemBtn = document.querySelectorAll(
        ".remove-cart-item-btn"
      );

      removeCartItemBtn.forEach((btn, i) => {
        btn.addEventListener("click", () => {
          cart.splice(i, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCartItems();
        });
      });

      cartQty.forEach((cartInput, i) => {
        cartInput.addEventListener("change", () => {
          const value = Number(cartInput.value);
          if (value >= 1) {
            if (cart[i].type !== "cart") {
              cart[i].quantity = value;
              cart[i].subtotal = cart[i].price * cart[i].quantity;
              localStorage.setItem("cart", JSON.stringify(cart));
              renderCartItems();
            } else {
              cartInput.value = 1; // Ensure quantity remains 1 for 'cart' type items
            }
          } else {
            cartInput.value = cart[i].quantity;
          }
        });
      });

      cartQtyPlus.forEach((btn, i) => {
        btn.addEventListener("click", () => {
          if (cart[i].type !== "DIGITAL") {
            cart[i].quantity += 1;
            cart[i].subtotal = cart[i].price * cart[i].quantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCartItems();
          }
        });
      });

      cartQtyMinus.forEach((btn, i) => {
        btn.addEventListener("click", () => {
          if (cart[i].type !== "DIGITAL") {
            if (cart[i].quantity > 1) {
              cart[i].quantity -= 1;
              cart[i].subtotal = cart[i].price * cart[i].quantity;
              localStorage.setItem("cart", JSON.stringify(cart));
              renderCartItems();
            }
          }
        });
      });
    }
    updateCartCount();
  };

  // Initial render
  renderCartItems();

  const submitCartItemsButton = document.getElementById("submit-cart-item");

  const submitCartItems = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length < 1) {
      toast.failed("cart is empty");
      return;
    }

    window.location.href = "/shop/checkout/";
  };
  if (submitCartItemsButton) {
    submitCartItemsButton.addEventListener("click", submitCartItems);
  }

  const submitCheckout = async function () {
    const checkoutForm = document.getElementById("checkout-form");
    pristine = new Pristine(checkoutForm);
    checkoutForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (cart.length < 1) {
        toast.failed("Cart is empty");
        window.location.href = "/shop";
        return;
      }

      let valid = pristine.validate();

      if (!valid) {
        return;
      }
      handleLoader("show");
      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      const orders = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        ref: item.ref,
      }));

      const finalOutput = {
        ...jsonData,
        orders: orders,
      };

      try {
        const res = await fetch("/shop/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalOutput),
        });

        const resData = await res.json();

        if (resData.success === false) {
          throw new Error(resData.message);
        }
        toast.success("Checkout Success");

        window.location.href = resData.data.data.link;
      } catch (err) {
        toast.failed(err.message);
      } finally {
        handleLoader("hide");
      }
    });
  };

  if (currentRoute.includes("checkout")) {
    if (cart.length < 1) {
      window.location.href = "/shop";
      return;
    }

    submitCheckout();

    const dollarTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const checkoutTotalEl = document.getElementById("checkout-order-total");
    checkoutTotalEl.innerText = "$" + dollarTotal.toLocaleString();

    document
      .getElementById("checkout_currency")
      .addEventListener("change", (e) => {
        if (e.target.value === "NGN") {
          checkoutTotalEl.innerText =
            "$" +
            dollarTotal.toLocaleString() +
            " ≈ " +
            "₦" +
            (dollarTotal * 1000).toLocaleString();
        } else {
          checkoutTotalEl.innerText = "$" + dollarTotal.toLocaleString();
        }
      });
  }
});
