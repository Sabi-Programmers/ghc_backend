window.onload = function () {
  // Get the current route
  const currentRoute = window.location.pathname;
  console.log("Current route:", currentRoute);

  const options = {
    placeholder: "Compose an epic...",
    theme: "snow",
  };
  // const quill = new Quill("#news-editor", options);

  const newsForm = document.getElementById("news-form");

  if (newsForm) {
    newsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const newsHtml = quill.getSemanticHTML();
      console.log(newsHtml);
    });
  }

  /**
   *  Select Package Handlers
   */

  if (currentRoute === "/packages") {
    const selectPackageForm = document.getElementById("select-package-form");
    selectPackageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const addPackages = [];
      for (let i = 0; i < e.target.length - 1; i++) {
        const element = e.target[i];

        if (element.checked) {
          addPackages.push({
            name: element.value,
            price: Number(element.dataset.price),
            subTotal: Number(element.dataset.price),
            quantity: 1,
          });
        }
      }
      localStorage.setItem("selected-packages", JSON.stringify(addPackages));
      if (addPackages.length > 0) {
        window.location.href = "/packages/complete-order";
      }
    });
  }

  /* ======================================  */

  /**
   * Package Order Handlers
   */
  if (currentRoute === "/packages/complete-order") {
    const packages = JSON.parse(localStorage.getItem("selected-packages"));

    const getEwallet =
      document.getElementById("e-wallet-balance").dataset.balance;
    let ewalletBalance = getEwallet;
    let total = 0;
    let maxQuantity = 10;
    let minQuantity = 1;

    const packageOrderWrapper = document.querySelector(
      ".package-order-wrapper"
    );
    const submitPackageOrderButton = document.querySelector(
      "#submit-package-order"
    );
    const packageOrderError = document.querySelector("#package-order-error");

    const renderPackageOrderItems = () => {
      console.log(packages);
      total = 0;
      packageOrderWrapper.innerHTML = packages.map((pkgOrder, i) => {
        total = pkgOrder.subTotal + total;
        return `  <div class="package-order-item border-bottom">  
                  <div class="flex-shrink-0">
                    <img
                      src="/static/assets/img/${pkgOrder.name}.png"
                      alt="package image"
                      class="w-100 h-100 rounded-4 border"
                    />
                  </div>
                <div class="d-flex justify-content-between w-100 ps-2 pe-1">
                  <div class="d-flex flex-column">
                    <span class="fw-medium text-capitalize"
                      > ${pkgOrder.name}</span
                    >
                    <span class="fs-5 fw-bold mb-auto"
                      >$ ${pkgOrder.subTotal.toFixed(2)}</span
                    >
                    <span class="fw-light fst-italic">${
                      pkgOrder.quantity
                    } cycles</span>
                  </div>
                  <div
                    class="d-flex flex-column align-items-center justify-content-between"
                  >
                    <div class="btn btn-outline-danger remove-package-btn">
                      <i class="bx bxs-trash-alt"></i>
                    </div>
                    <div class="d-flex align-items-center gap-1">
                      <span class="package-quantity-plus text-success"
                        ><i class="bx bx-plus-circle"></i
                      ></span>
                      <input
                        type="number"
                        class="form-control package-quantity"
                        name="${pkgOrder.name}"
                        value="${pkgOrder.quantity}"
                      />
                      <span class="package-quantity-minus text-danger"
                        ><i class="bx bx-minus-circle"></i
                      ></span>
                    </div>
                  </div>
                </div>
              </div>`;
      });

      const packageQtyPlus = document.querySelectorAll(
        ".package-quantity-plus"
      );
      const packageQtyMinus = document.querySelectorAll(
        ".package-quantity-minus"
      );
      const packageQty = document.querySelectorAll(".package-quantity");
      const removePackageBtn = document.querySelectorAll(".remove-package-btn");

      removePackageBtn.forEach((btn, i) => {
        btn.addEventListener("click", () => {
          packages.splice(i, 1);
          localStorage.setItem("selected-packages", JSON.stringify(packages));
          renderPackageOrderItems();
        });
      });

      packageQty.forEach((pkgInput, i) => {
        pkgInput.addEventListener("change", () => {
          if (pkgInput.value >= 1 && pkgInput.value <= 10) {
            packages[i].quantity = Number(pkgInput.value);
          } else if (pkgInput.value < 1) {
            packages[i].quantity = minQuantity;
          } else if (pkgInput.value > 10) {
            packages[i].quantity = maxQuantity;
          }
          packages[i].subTotal = packages[i].price * packages[i].quantity;
          renderPackageOrderItems();
        });
      });

      packageQtyPlus.forEach((btn, i) => {
        btn.addEventListener("click", () => {
          if (packages[i].quantity < maxQuantity) {
            packages[i].quantity = packages[i].quantity + 1;
            packages[i].subTotal = packages[i].price * packages[i].quantity;
            renderPackageOrderItems();
          }
        });
      });

      packageQtyMinus.forEach((btn, i) => {
        btn.addEventListener("click", () => {
          if (packages[i].quantity > minQuantity) {
            packages[i].quantity = packages[i].quantity - 1;

            packages[i].subTotal = packages[i].price * packages[i].quantity;
            renderPackageOrderItems();
          }
        });
      });

      document.querySelector("#total").innerText = "$" + total.toFixed(2);

      if (ewalletBalance < total) {
        submitPackageOrderButton.disabled = true;
        packageOrderError.innerText = "Insuficient balance";
      }
    };

    renderPackageOrderItems();

    submitPackageOrderButton.addEventListener("click", () => {
      const data = {};

      packages.forEach((pkg) => {
        data[pkg.name] = pkg.quantity;
      });

      const submitPackageOrder = async () => {
        try {
          const res = await fetch("/packages", {
            method: "POST",
            body: JSON.stringify(data),
          });
          console.log("waitin.......");
          const resData = await res.json();

          console.log(resData);
        } catch (error) {
          console.log(error);
        }
      };

      submitPackageOrder();
    });
  }
};
