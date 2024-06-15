window.onload = function () {
  // Get the current route
  const currentRoute = window.location.pathname;

  /**
   * Breadcrumbs
   */

  // Get the breadcrumb container
  const breadcrumbContainer = document.getElementById("breadcrumb");

  const updateBreadcrumbs = () => {
    // Split the route into parts and filter out empty strings
    const routeParts = currentRoute.split("/").filter((part) => part);

    // Clear any existing breadcrumb items
    breadcrumbContainer.innerHTML = "";

    // Create the "Home" breadcrumb item
    const homeCrumb = document.createElement("li");
    homeCrumb.classList.add("breadcrumb-item");
    const homeLink = document.createElement("a");
    homeLink.href = "./dashboard.html"; // Adjust according to your home URL
    homeLink.textContent = "Home";
    homeCrumb.appendChild(homeLink);
    breadcrumbContainer.appendChild(homeCrumb);

    // Create breadcrumb items for each part of the route
    routeParts.forEach((part, index) => {
      const crumb = document.createElement("li");
      crumb.classList.add("breadcrumb-item");
      if (index === routeParts.length - 1) {
        // Last part should be active
        crumb.classList.add("active");
        crumb.textContent = part.charAt(0).toUpperCase() + part.slice(1);
      } else {
        const link = document.createElement("a");
        link.href = "/" + routeParts.slice(0, index + 1).join("/");
        link.textContent = part.charAt(0).toUpperCase() + part.slice(1);
        crumb.appendChild(link);
      }
      breadcrumbContainer.appendChild(crumb);
    });
  };

  if (breadcrumbContainer) {
    updateBreadcrumbs();
  }

  /**
   * =================================================================
   */

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
   * Admin Login
   */
  let adminForm = document.getElementById("admin-auth-form");

  if (adminForm) {
    pristine = new Pristine(adminForm);

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

    adminForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let valid = pristine.validate();

      if (!valid) {
        return;
      }

      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      handlerPostRequest(jsonData, "/admin/login", "/admin/dashboard");
    });
  }

  /**
   * Register
   */
  let registerForm = document.getElementById("register-form");
  let completeRegisterForm = document.getElementById("complete-register-form");

  if (registerForm) {
    // userDetails.style.display = "none";
    // userBankInfo.style.display = "grid";

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

      const banks = document.querySelector("#bankName");
      const selectedBank = banks.options[banks.selectedIndex];
      jsonData.bankCode = selectedBank.getAttribute("data-code");

      handlerPostRequest(jsonData, "/auth/register", "/dashboard");
    });
  }

  /**
   * Forgot Password
   */
  let forgotPasswordForm = document.getElementById("forgot-password-form");
  if (forgotPasswordForm) {
    pristine = new Pristine(forgotPasswordForm);

    forgotPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let valid = pristine.validate();

      if (!valid) {
        return;
      }

      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      handlerPostRequest(
        jsonData,
        "/auth/forgot-password",
        "/auth/reset-password?u=" + jsonData.username
      );
    });
  }

  /**
   * Reset Password
   */
  let resetPasswordForm = document.getElementById("reset-password-form");
  if (resetPasswordForm) {
    pristine = new Pristine(resetPasswordForm);

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

    resetPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let valid = pristine.validate();

      if (!valid) {
        return;
      }

      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      handlerPostRequest(jsonData, "/auth/reset-password", "/auth/login");
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

    // Get Otp
    const sendOtpBtn = document.getElementById("send-otp-btn");
    const otpCounter = document.getElementById("otp-counter");

    sendOtpBtn.addEventListener("click", async () => {
      // Disable the send-otp-btn and show a loading spinner
      sendOtpBtn.disabled = true;
      sendOtpBtn.innerHTML = `<div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;

      try {
        const res = await fetch("/withdrawal/otp", { method: "POST" });
        const resData = await res.json();

        if (!res.ok) {
          throw new Error(resData.message || "Failed to send OTP");
        }

        toast.success(resData.message);

        // Start a countdown timer for 90 seconds
        let timeLeft = 90;
        otpCounter.textContent = `${timeLeft} seconds remaining`;

        const countdown = setInterval(() => {
          timeLeft -= 1;
          otpCounter.textContent = `${timeLeft} seconds remaining`;

          if (timeLeft <= 0) {
            clearInterval(countdown);
            otpCounter.textContent = "";
            sendOtpBtn.disabled = false;
            sendOtpBtn.innerHTML = "Send OTP";
          }
        }, 1000);
      } catch (error) {
        toast.error(error.message);
        sendOtpBtn.disabled = false;
        sendOtpBtn.innerHTML = "Send OTP";
      } finally {
        // Ensure the button is re-enabled if an error occurs
        if (sendOtpBtn.disabled) {
          sendOtpBtn.disabled = false;
          sendOtpBtn.innerHTML = "Send OTP";
        }
      }
    });

    // submit form
    const withdrawalRequestForm = document.getElementById(
      "withdrawal-request-form"
    );

    pristine = new Pristine(withdrawalRequestForm);

    withdrawalRequestForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let valid = pristine.validate();

      if (!valid) {
        return;
      }

      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      handlerPostRequest(jsonData, "/withdrawal", "/dashboard");
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

  /**
   * News / Announcements
   */
  const displayNews = async () => {
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById("news-modal"));

    // Manipulate the modal content
    const modalBody = document.querySelector("#news-modal .modal-content-body");
    const modalContentTitle = document.querySelector(
      "#news-modal .modal-content-title"
    );
    const modalNewsImg = document.querySelector("#news-modal .modal-news-img");
    const modalTitle = document.querySelector("#news-modal .modal-title");
    const modalCloseBtn = document.getElementById("close-news-modal");
    const modalPrevBtn = document.getElementById("prev-news-modal");
    const modalNextBtn = document.getElementById("next-news-modal");
    const modalReadNews = document.getElementById("readNews");
    const modalReadPages = document.getElementById("news-pages");
    let newsIndex = 0;

    const fetchNews = async () => {
      try {
        const res = await fetch("/news");
        const resData = await res.json();
        return resData.data;
      } catch (error) {
        return null;
      }
    };

    const filterReadNews = (news) => {
      const readNewsIds = JSON.parse(localStorage.getItem("readNewsIds")) || [];
      return news.filter((newsItem) => !readNewsIds.includes(newsItem.id));
    };

    const news = filterReadNews(await fetchNews());

    if (!news || news.length === 0) {
      return;
    }

    const renderNews = () => {
      modalReadPages.innerText = `${newsIndex + 1} of ${news.length} items`;
      modalTitle.innerText = "Announcements #" + news[newsIndex].id;
      modalContentTitle.innerText = news[newsIndex].title;
      modalNewsImg.innerHTML = ` <img
      src="/uploads/images/${news[newsIndex].photo}"
      alt="News Photo"
    />`;
      modalBody.innerHTML = news[newsIndex].description;
      modal.show();
    };

    // Render the first news item
    renderNews();

    // Next button functionality
    modalNextBtn.addEventListener("click", () => {
      if (newsIndex < news.length - 1) {
        newsIndex++;
        renderNews();
      }
    });

    // Previous button functionality
    modalPrevBtn.addEventListener("click", () => {
      if (newsIndex > 0) {
        newsIndex--;
        renderNews();
      }
    });

    // Close button functionality
    modalCloseBtn.addEventListener("click", () => {
      if (modalReadNews.checked) {
        let readNewsIds = JSON.parse(localStorage.getItem("readNewsIds")) || [];
        readNewsIds = readNewsIds.concat(news.map((newsItem) => newsItem.id));
        localStorage.setItem("readNewsIds", JSON.stringify(readNewsIds));
      }
      modal.hide();
    });
  };

  if (currentRoute === "/dashboard") {
    setTimeout(displayNews, 2000);
  }

  /**
   * Change Password Form
   */

  const changePasswordForm = document.getElementById("change-password-form");
  if (changePasswordForm) {
    pristine = new Pristine(changePasswordForm);

    const passwordInput = document.getElementById("Password");
    const confirmPasswordInput = document.getElementById("ConfirmPassword");

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

    changePasswordForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let valid = pristine.validate();

      if (!valid) {
        return;
      }

      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      handlerPostRequest(jsonData, "/profile/change-password", "/profile");
    });
  }

  /**
   * Update Profile Form
   */
  const profileForm = document.getElementById("profile-form");

  if (profileForm) {
    pristine = new Pristine(profileForm);

    profileForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let valid = pristine.validate();

      if (!valid) {
        return;
      }

      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);
      handlerPostRequest(jsonData, "/profile", "/profile");
    });
  }

  /**
   * Upload profile photo
   */

  if (currentRoute == "/profile") {
    const photoFile = document.getElementById("profile-photo-file");
    const imageTag = document.getElementById("profile-photo");
    const photoCtrls = document.getElementById("profile-photo-btn");
    const savePhoto = document.getElementById("profile-photo-save-btn");
    const cancelPhoto = document.getElementById("profile-photo-cancel-btn");

    const currentPhoto = imageTag.getAttribute("src");

    photoFile.addEventListener("change", (e) => {
      photoCtrls.style.display = "block";

      let uploadedPhoto = e.target.files[0];

      // check if the file selected is not an image file
      if (!uploadedPhoto.type.includes("image")) {
        return toast.failed("Only images are allowed!");
      }

      // check if size (in bytes) exceeds 10 MB
      if (uploadedPhoto.size > 10_000_000) {
        return toast.failed("Maximum upload size is 10MB!");
      }

      if (uploadedPhoto) {
        let reader = new FileReader();

        reader.onload = function (event) {
          imageTag.src = event.target.result;
        };

        reader.readAsDataURL(uploadedPhoto);
      }
    });

    cancelPhoto.addEventListener("click", () => {
      imageTag.src = currentPhoto;
      photoCtrls.style.display = "none";
    });

    savePhoto.addEventListener("click", async () => {
      handleLoader("show");
      const uploadedPhoto = photoFile.files[0];
      let formData = new FormData();
      if (uploadedPhoto) {
        formData.append("photo", uploadedPhoto);
        try {
          const res = await fetch("/profile/photo", {
            method: "POST",
            body: formData,
          });
          const resData = await res.json();

          if (resData.success === false) {
            throw new Error(resData.message);
          }
          handleLoader("hide");
          toast.success(resData.message);
          photoCtrls.style.display = "none";
        } catch (err) {
          handleLoader("hide");
          toast.failed(err.message);
          return;
        }
      } else {
        handleLoader("hide");
        toast.failed("No data found");
      }
    });
  }

  if (currentRoute == "/business-promo-contest") {
    const adsForm = document.getElementById("ads-form");

    adsForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      handleLoader("show");
      const uploadedPhoto = e.target[1].files[0];
      let formData = new FormData();
      formData.append("facebookAdsLink", e.target[0].value);

      formData.append("photo", uploadedPhoto);
      try {
        const res = await fetch("/business-promo-contest/ads", {
          method: "POST",
          body: formData,
        });
        const resData = await res.json();

        if (resData.success === false) {
          throw new Error(resData.message);
        }
        handleLoader("hide");
        toast.success(resData.message);
        redirect("/business-promo-contest");
      } catch (err) {
        handleLoader("hide");
        toast.failed(err.message);
        return;
      }
    });

    const meetingForm = document.getElementById("meetings-form");
    meetingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      handleLoader("show");
      const uploadedPhoto = e.target[1].files[0];
      let formData = new FormData();
      formData.append("facebookGroupLink", e.target[0].value);
      formData.append("zoomMeetingLink", e.target[2].value);

      formData.append("photo", uploadedPhoto);
      try {
        const res = await fetch("/business-promo-contest/meetings", {
          method: "POST",
          body: formData,
        });
        const resData = await res.json();

        if (resData.success === false) {
          throw new Error(resData.message);
        }
        handleLoader("hide");
        toast.success(resData.message);
        redirect("/business-promo-contest");
      } catch (err) {
        handleLoader("hide");
        toast.failed(err.message);
        return;
      }
    });

    const offlineForm = document.getElementById("offline-form");
    offlineForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      handleLoader("show");

      let formData = new FormData();
      formData.append("youtubeVideoLink", e.target[0].value);
      formData.append("tiktokVideoLink", e.target[1].value);

      const jsonData = formDataToJson(formData);

      try {
        const res = await fetch("/business-promo-contest/offline", {
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
        redirect("/business-promo-contest");
      } catch (err) {
        handleLoader("hide");
        toast.failed(err.message);
        return;
      }
    });

    const signupUsernamesForm = document.getElementById("submit_new");

    const nameInput = document.getElementById("usernames");
    const addButton = document.getElementById("add-usernames");
    const nameList = document.getElementById("display-usernames");
    let names = [];

    addButton.addEventListener("click", () => {
      const name = nameInput.value.trim();
      if (name.length < 4) {
        toast.failed("Username must be at least 4 characters long");
        return;
      }
      if (name) {
        names.push(name);
        nameInput.value = "";
        updateNameList();
      }
    });

    function updateNameList() {
      nameList.innerHTML = "";
      names.forEach((name, index) => {
        const nameItem = document.createElement("li");
        nameItem.className = "mt-1";
        nameItem.textContent = name;

        const removeButton = document.createElement("button");
        removeButton.className = "ms-3 btn btn-danger btn-sm";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
          names.splice(index, 1);
          updateNameList();
        });

        nameItem.appendChild(removeButton);
        nameList.appendChild(nameItem);
      });
    }

    signupUsernamesForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (names.length < 1) {
        toast.failed("Please Enter Usernames");
        return;
      }
      handleLoader("show");
      try {
        const res = await fetch("/business-promo-contest/signups", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usernames: names }),
        });
        const resData = await res.json();

        if (resData.success === false) {
          throw new Error(resData.message);
        }
        handleLoader("hide");
        toast.success(resData.message);
        redirect("/business-promo-contest");
      } catch (err) {
        handleLoader("hide");
        toast.failed(err.message);
        return;
      }
    });
  }

  /**
   * Message form with Quill text editor
   */

  const mgsOptions = {
    placeholder: "Type message...",
    theme: "snow",
  };

  const messageEditor = document.getElementById("message-editor");
  const messageForm = document.getElementById("message-form");

  if (messageEditor && messageForm) {
    const quill = new Quill(messageEditor, mgsOptions);

    const messageTitleInput = document.getElementById("message-title-input");

    const mgsFormSubmitBtn = document.getElementById("mgs-form-submit-btn");

    const validateFields = (title, description) => {
      if (title.value.trim().length < 1) {
        toast.failed("Please enter a title");
        return false;
      }
      if (description.trim().length < 1) {
        toast.failed("Please enter a Message");
        return false;
      }
      return true;
    };

    messageForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const messageText = quill.getText();
      const messageHtml = quill.getSemanticHTML();
      const validate = validateFields(messageTitleInput, messageText);
      if (validate) {
        const data = {
          title: messageTitleInput.value,
          narration: messageHtml,
        };
        await handlerPostRequest(data, "/messages/send");
        window.location.href = "/messages";
      }
    });
  }
};
