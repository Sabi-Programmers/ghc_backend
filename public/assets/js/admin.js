document.addEventListener("DOMContentLoaded", () => {
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
});
