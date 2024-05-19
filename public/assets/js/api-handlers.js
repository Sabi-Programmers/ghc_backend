window.onload = function () {
  // Get the current route
  const currentRoute = window.location.pathname;
  console.log("Current route:", currentRoute);

  // Terms and conditions
  const tandc = document.getElementById("accept-terms-and-conditions");

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

  const redirect = (url) => {
    setTimeout(() => {
      window.location.href = url;
    }, 1500);
  };

  function formDataToJson(formData) {
    const json = {};
    for (const [key, value] of formData.entries()) {
      json[key] = value;
    }
    return json;
  }

  const handlerPostRequest = async (jsonData, endpoint, redirectUrl) => {
    try {
      handleLoader("show");
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
      const resData = await res.json();

      if (resData.success === false) {
        throw new Error(resData.message);
      }
      handleLoader("hide");
      toast.success(resData.message);

      if (redirectUrl !== null) {
        redirect(redirectUrl);
      }
    } catch (error) {
      handleLoader("hide");

      toast.failed(error.message);
    }
  };

  /**
   *Login
   */
  let loginForm = document.getElementById("login-form");

  if (loginForm) {
    pristine = new Pristine(loginForm);

    const passwordInput = document.getElementById("password");

    pristine.addValidator(
      passwordInput,
      function (value, el) {
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);

        if (!hasUppercase || !hasLowercase) {
          return false;
        }
        return true;
      },
      "Password must contain at least one uppercase and one lowercase letter.",
      2,
      false
    );

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let valid = pristine.validate();

      if (!valid) {
        return;
      }

      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      handlerPostRequest(jsonData, "/auth/login", "/dashboard");
    });
  }
  /**
   * Register
   */
  let registerForm = document.getElementById("register-form");

  if (registerForm) {
    pristine = new Pristine(registerForm);

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    if (confirmPasswordInput) {
      pristine.addValidator(
        confirmPasswordInput,
        function (value, el) {
          const password = passwordInput.value;
          if (password !== value) {
            return false;
          }
          return true;
        },
        "Password does't match.",
        3,
        false
      );
    }

    pristine.addValidator(
      passwordInput,
      function (value, el) {
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);

        if (!hasUppercase || !hasLowercase) {
          return false;
        }
        return true;
      },
      "Password must contain at least one uppercase and one lowercase letter.",
      2,
      false
    );

    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let valid = pristine.validate();

      if (!valid) {
        return;
      }
      if (!tandc.checked) {
        toast.failed("Please agree to the terms and conditions");
        return;
      }

      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      handlerPostRequest(jsonData, "/auth/register", "/dashboard");
    });
  }

  /**
   * Logout
   */
  let logout = document.getElementById("logout");

  if (logout) {
    logout.addEventListener("click", () => {
      handlerPostRequest({}, "/auth/logout", "/");
    });
  }

  /**
   * News form with Quill text editor
   */

  const options = {
    placeholder: "Compose an epic...",
    theme: "snow",
  };

  const newsEditor = document.getElementById("news-editor");
  const newsForm = document.getElementById("news-form");

  if (newsEditor && newsForm) {
    const quill = new Quill(newsEditor, options);

    const newsTitleInput = document.getElementById("news-title-input");
    const newsPhotoInput = document.getElementById("news-photo-input");
    const newsFormSubmitBtn = document.getElementById("news-form-submit-btn");

    const validateFields = (photo, title, description) => {
      if (photo.files.length === 0) {
        alert("Please select a file to upload.");
        return false;
      }

      if (title.value.trim().length < 1) {
        alert("Please enter a title");
        return false;
      }
      if (description.trim().length < 1) {
        alert("Please enter a description");
        return false;
      }
      return true;
    };

    const submitNews = async (formData) => {
      newsFormSubmitBtn.setAttribute("disabled", true);
      try {
        const res = await fetch("/admin/news/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          toast.failed("Failed to upload news");
          newsFormSubmitBtn.setAttribute("disabled", false);

          return;
        }

        const resData = await res.json();

        if (resData.success) {
          toast.success(resData.message);
          newsFormSubmitBtn.setAttribute("disabled", false);

          setTimeout(() => {
            window.location.href = "/admin/news/" + resData.data.slug;
          }, 2000);
          return;
        }
        return false;
      } catch (error) {
        toast.failed(error.message);
        newsFormSubmitBtn.setAttribute("disabled", false);
      }
    };

    newsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newsText = quill.getText();
      const newsHtml = quill.getSemanticHTML();
      const validate = validateFields(newsPhotoInput, newsTitleInput, newsText);
      if (validate) {
        const photo = newsPhotoInput.files[0];
        const formData = new FormData();
        formData.append("photo", photo);
        formData.append("title", newsTitleInput.value);
        formData.append("description", newsHtml);

        submitNews(formData);
      }
    });
  }

  // New Date
  const newsDates = document.querySelectorAll(".news-date");
  if (newsDates) {
    newsDates.forEach((dateEl) => {
      const data = dateEl.getAttribute("data-content");

      const date = new Date(data);

      dateEl.innerHTML = date.toLocaleDateString();
    });
  }

  /**
   * Delete a news
   */

  const deleteNewsBtn = document.getElementById("delete-news-btn");

  if (deleteNewsBtn) {
    const newsId = deleteNewsBtn.getAttribute("data-id");

    const deleteNews = async () => {
      deleteNewsBtn.setAttribute("disabled", true);
      try {
        const res = await fetch("/admin/news/" + newsId, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          toast.failed("Couldn't delete news");
          deleteNewsBtn.setAttribute("disabled", false);
          return;
        }

        const resData = await res.json();

        if (resData.success) {
          toast.success(resData.message);
          setTimeout(() => {
            window.location.href = "/admin/news";
          }, 2000);
        }
        deleteNewsBtn.setAttribute("disabled", false);
      } catch (error) {
        toast.failed(error.message);
        deleteNewsBtn.setAttribute("disabled", false);
      }
    };

    deleteNewsBtn.addEventListener("click", deleteNews);
  }

  /**
   * =====================================
   */

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
    const packages =
      JSON.parse(localStorage.getItem("selected-packages")) || [];

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

    if (packages.length < 1) {
      submitPackageOrderButton.setAttribute("disabled", true);
      redirect("/packages");
    } else {
      submitPackageOrderButton.removeAttribute("disabled");
    }

    submitPackageOrderButton.addEventListener("click", async () => {
      const data = {};

      if (!tandc.checked) {
        toast.failed("Please agree to the terms and conditions");
        return;
      }

      packages.forEach((pkg) => {
        data[pkg.name] = pkg.quantity;
      });

      localStorage.removeItem("selected-packages");
      await handlerPostRequest(data, "/packages", "/packages/order-successful");
    });
  }

  /**
   * Withdrawal Wallet
   */

  // withdrawals wallet
  const selectWallet = document.getElementById("withdrawWallet");

  if (selectWallet) {
    selectWallet.addEventListener("change", (e) => {
      window.location.href = "/withdrawal?sw=" + e.target.value;
    });

    const withdrawAmount = document.getElementById("withdrawal-amount");
    const withdrawAmountError = document.querySelector(
      "#withdrawal-amount + span"
    );
    const threshold = document.getElementById("withdrawal-threshold");
    const availableBalance = document.getElementById("available-balance");
    const withdrawalBtn = document.getElementById("withdrawal-btn");

    if (withdrawAmount && threshold && availableBalance) {
      withdrawalBtn.setAttribute("disabled", true);

      const th = Number(threshold.getAttribute("data-content"));
      const av = Number(availableBalance.getAttribute("data-content"));

      withdrawAmount.addEventListener("change", (e) => {
        withdrawAmountError.classList.remove("d-none");
        const amount = Number(e.target.value);
        if (amount < av) {
          withdrawAmountError.classList.add("d-none");
        }
        if (amount >= th && amount > av) {
          withdrawalBtn.removeAttribute("disabled");
        }
      });
    }
    // submit form
    const withdrawalRequestForm = document.getElementById(
      "withdrawal-request-form"
    );

    withdrawalRequestForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log(withdrawAmount.value);
      toast.success(`Otp has been sent to E-Mail`);
    });
  }

  /**
   * Add Testimony
   */

  const addTestimonyForm = document.getElementById("add-testimony-form");

  if (addTestimonyForm) {
    pristine = new Pristine(addTestimonyForm);
    addTestimonyForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let valid = pristine.validate();

      if (!valid) {
        return;
      }

      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      const urlRegex = new RegExp(
        /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/
      );

      if (
        !urlRegex.test(jsonData.facebookLink) &&
        !urlRegex.test(jsonData.youtubeLink) &&
        !urlRegex.test(jsonData.tiktokLink)
      ) {
        toast.failed("Please add a valid URL link");
        return;
      }

      handlerPostRequest(jsonData, "/testimony", "/testimony/view");
    });
  }

  /**
   * =======================================================
   */

  /**
   * Filters
   */

  // Team Genration

  if (currentRoute.includes("team-generation")) {
    const teamGenPkg = document.getElementById("tg-pkg");
    const teamGen = document.getElementById("tg-gen");
    const pkg = teamGenPkg.getAttribute("data-key");
    const gen = teamGen.getAttribute("data-key");

    teamGenPkg.addEventListener("change", (e) => {
      redirect(`${currentRoute}?pkg=${e.target.value}&gen=${gen}`);
    });
    teamGen.addEventListener("change", (e) => {
      redirect(`${currentRoute}?pkg=${pkg}&gen=${e.target.value}`);
    });
  }
};
