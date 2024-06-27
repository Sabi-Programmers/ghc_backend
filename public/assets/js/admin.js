document.addEventListener("DOMContentLoaded", () => {
  // Get the current route
  const currentRoute = window.location.pathname;

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

      // if (redirectUrl !== null) {
      //   redirect(redirectUrl);
      // }
    } catch (error) {
      handleLoader("hide");

      toast.failed(error.message);
    }
  };

  const pieChart = document.getElementById("pieChart");

  if (pieChart) {
    const bronze = Number(pieChart.getAttribute("data-bronze"));
    const gold = Number(pieChart.getAttribute("data-gold"));
    const diamond = Number(pieChart.getAttribute("data-diamond"));

    new ApexCharts(document.querySelector("#pieChart"), {
      series: [bronze, gold, diamond],
      chart: {
        height: 350,
        type: "pie",
        toolbar: {
          show: true,
        },
      },
      labels: ["Bronze", "Gold", "Diamond"],
    }).render();
  }
  //
  const searchMemberInput = document.getElementById("search-member-input");
  if (searchMemberInput) {
    const minvalueError = document.createElement("span");
    minvalueError.innerText = "Username must be at least four(4) characters";
    minvalueError.style.color = "red";

    const membersList = document.querySelector("#search-member-results");
    const loaderHTML = `
    <div class="spinner-border text-warning" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;

    const renderLoader = () => {
      membersList.innerHTML = loaderHTML;
    };

    const renderFoundMembers = (data) => {
      membersList.innerHTML = ""; // Clear previous results

      if (data.length === 0) {
        membersList.innerHTML = "<p>No members found</p>";
        return;
      }

      data.forEach((dt) => {
        const memberItem = document.createElement("li");
        memberItem.className = "search-member";
        memberItem.innerHTML = `
        <a href="?member=${dt.username}">
          <img
            src="${
              dt.displayPhoto
                ? "/uploads/images/" + dt.displayPhoto
                : "/static/assets/img/default.jpg"
            }"
            alt="user photo"
          />
          <div>
            <p>${dt.username}</p>
            <small>${dt.fullName}</small>
          </div>
        </a>
      `;

        membersList.appendChild(memberItem);
      });
    };

    const findMembers = async (username) => {
      renderLoader(); // Show loader

      try {
        const res = await fetch("/admin/members/search?username=" + username);
        const resData = await res.json();

        if (resData.success === false) {
          throw new Error(resData.message);
        }
        renderFoundMembers(resData.data);
      } catch (err) {
        renderFoundMembers([]);
      }
    };

    searchMemberInput.addEventListener("input", async (e) => {
      const value = e.target.value;
      if (value.length < 4) {
        if (!searchMemberInput.nextElementSibling) {
          searchMemberInput.after(minvalueError);
        }
        membersList.innerHTML = "";
      } else {
        if (searchMemberInput.nextElementSibling) {
          searchMemberInput.nextElementSibling.remove();
        }
        await findMembers(value);
      }
    });
  }
  const rollbackForm = document.getElementById("roll-back-form");
  if (rollbackForm) {
    rollbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const amount = document.getElementById("roll-back-amount").value;
      if (amount.length < 1) {
        toast.failed("Please enter a valid amount");
        return;
      }
      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      await handlerPostRequest(jsonData, "/admin/members/rollback-funds");

      window.location.reload();
    });
  }

  const blockMemberForm = document.getElementById("block-member-form");
  if (blockMemberForm) {
    blockMemberForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      await handlerPostRequest(jsonData, "/admin/members/block");

      window.location.reload();
    });
  }

  const unBlockMemberForms = document.querySelectorAll(".unblock-member");

  unBlockMemberForms.forEach((el) => {
    el.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      await handlerPostRequest(jsonData, "/admin/members/unblock");

      window.location.reload();
    });
  });

  function toggleFields() {
    const productType = document.getElementById("productType").value;
    const digitalFields = document.getElementById("digitalProductFields");
    const physicalFields = document.getElementById("physicalProductFields");

    if (productType === "digital") {
      digitalFields.style.display = "block";
      physicalFields.style.display = "none";
    } else if (productType === "physical") {
      digitalFields.style.display = "none";
      physicalFields.style.display = "block";
    } else {
      digitalFields.style.display = "none";
      physicalFields.style.display = "none";
    }
  }

  const selectProductType = document.getElementById("productType");
  if (selectProductType) {
    selectProductType.addEventListener("change", toggleFields);
  }

  const addProductForm = document.getElementById("add-product-form");
  const uploadPicturesInput = document.getElementById("uploadPictures");
  const uploadProductFileInput = document.getElementById("uploadProductFile");
  if (addProductForm && uploadPicturesInput) {
    pristine = new Pristine(addProductForm);

    const productSellingPrice = document.getElementById("productSellingPrice");
    const productPrice = document.getElementById("productPrice");

    if (productSellingPrice && productPrice) {
      pristine.addValidator(
        productSellingPrice,
        function (value, el) {
          const price = productPrice.value;
          if (parseFloat(price) > parseFloat(value)) {
            return false;
          }
          return true;
        },
        "Selling Price must be greater than Price",
        3,
        false
      );
    }
    const uploadDigitalProductFile = async (id) => {
      const digitalFormData = new FormData();
      digitalFormData.append("file", uploadProductFileInput.files[0]);
      digitalFormData.append("id", id);
      const digitalRes = await fetch("/admin/shop/add-product/file", {
        method: "POST",
        body: digitalFormData,
      });
      const digitalResData = await digitalRes.json();
      if (digitalResData.success === false) {
        throw new Error(resData.message);
      }
    };

    const submitProductForm = async (formData) => {
      handleLoader("show");

      try {
        const res = await fetch("/admin/shop/add-product", {
          method: "POST",
          body: formData,
        });
        const resData = await res.json();
        if (resData.success === false) {
          throw new Error(resData.message);
        }
        if (resData.data.productType !== "PHYSICAL") {
          await uploadDigitalProductFile(resData.data.id);
        }
        toast.success(resData.message);
        window.location.href = "/admin/shop/product/" + resData.data.slug;
      } catch (error) {
        toast.failed("Failed to add product");
      } finally {
        handleLoader("hide");
      }
    };

    addProductForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let valid = pristine.validate();

      if (!valid) {
        return;
      }

      const photo = uploadPictures.files[0];
      const formData = new FormData(e.target);
      formData.append("photo", photo);

      if (
        e.target.productType.value === "digital" &&
        (uploadProductFileInput.files.length === 0 ||
          e.target.category.value.length === 0)
      ) {
        toast.failed("All Feilds are required");
        return;
      }

      submitProductForm(formData);
    });
  }

  const confirmDeliveryBtn = document.querySelectorAll(".confirmDeliveryBtn");
  confirmDeliveryBtn.forEach((el) => {
    el.addEventListener("click", async () => {
      const id = el.getAttribute("data-id");

      await handlerPostRequest({ id }, "/admin/shop/orders/physical");
      window.location.reload();
    });
  });
  const confirmPkgDeliveryBtn = document.querySelectorAll(
    ".confirmPkgDeliveryBtn"
  );
  confirmPkgDeliveryBtn.forEach((el) => {
    el.addEventListener("click", async () => {
      const id = el.getAttribute("data-id");

      await handlerPostRequest({ id }, "/admin/product-delivery/undelivered");
      window.location.reload();
    });
  });

  /**
   * Message form with Quill text editor
   */

  const mgsOptions = {
    placeholder: "Type message...",
    theme: "snow",
  };

  const messageEditor = document.getElementById("admin-message-editor");
  const messageForm = document.getElementById("admin-message-form");

  if (messageEditor && messageForm) {
    const quill = new Quill(messageEditor, mgsOptions);

    const messageTitleInput = document.getElementById("message-title-input");

    const messageUserId = document.getElementById("message-user-id-input");

    const validateFields = (title, description, userId) => {
      if (userId.value.trim().length < 1) {
        toast.failed("Please select member");
        return false;
      }
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
      const validate = validateFields(
        messageTitleInput,
        messageText,
        messageUserId
      );
      if (validate) {
        const data = {
          title: messageTitleInput.value,
          narration: messageHtml,
          userId: messageUserId.value,
        };
        await handlerPostRequest(data, "/admin/messages/send");
        window.location.href = "/admin/messages";
      }
    });
  }

  const deleteMessageBtn = document.getElementById("deleteMessageBtn");
  if (deleteMessageBtn) {
    deleteMessageBtn.addEventListener("click", () => {
      const id = deleteMessageBtn.getAttribute("data-id");

      handlerPostRequest({ id }, currentRoute + "/delete");
      window.location.href = "/admin/messages";
    });
  }

  const rejectTestimonyForm = document.querySelectorAll(".rejectTestimonyForm");
  const creditTestimonyForm = document.querySelectorAll(".creditTestimonyForm");

  rejectTestimonyForm.forEach((el) => {
    el.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      if (jsonData.feedbackMessage.length <= 1) {
        toast.failed("Please enter a feedback message");
        return;
      }

      await handlerPostRequest(
        { feedbackMessage: jsonData.feedbackMessage },
        `/admin/testimony/${jsonData.userId}/reject/${jsonData.id}`
      );

      window.location.reload();
    });
  });

  creditTestimonyForm.forEach((el) => {
    el.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const jsonData = formDataToJson(formData);

      // if (jsonData.length <= 1) {
      //   toast.failed("Please enter a feedback message");
      //   return;
      // }

      await handlerPostRequest(
        { feedbackMessage: jsonData.feedbackMessage },
        `/admin/testimony/${jsonData.userId}/accept/${jsonData.id}`
      );

      window.location.reload();
    });
  });
});
